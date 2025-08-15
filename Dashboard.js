import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { AdView, Earning, User } from "@/entities/all";
import { 
  DollarSign, 
  Play, 
  Clock, 
  Target,
  ArrowRight,
  Wallet
} from "lucide-react";

import StatsCard from "../components/dashboard/StatsCard";
import EarningsChart from "../components/dashboard/EarningsChart";
import RecentActivity from "../components/dashboard/RecentActivity";

export default function Dashboard() {
  const [timeOfDay, setTimeOfDay] = useState('');
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    adsWatchedToday: 0,
    totalWatchTime: 0,
    completionRate: 0,
  });
  const [recentViews, setRecentViews] = useState([]);
  const [weeklyEarnings, setWeeklyEarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 17) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');

    const fetchData = async () => {
      setIsLoading(true);
      const currentUser = await User.me();
      setUser(currentUser);

      const allEarnings = await Earning.filter({ created_by: currentUser.email });
      const allViews = await AdView.filter({ created_by: currentUser.email });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const adsWatchedToday = allViews.filter(v => new Date(v.created_date) >= today).length;
      const totalEarnings = allEarnings.reduce((sum, e) => sum + e.amount, 0);
      const totalWatchTime = allViews.reduce((sum, v) => sum + v.watch_time, 0) / 3600; // in hours
      const completedViews = allViews.filter(v => v.status === 'completed').length;
      const completionRate = allViews.length > 0 ? (completedViews / allViews.length) * 100 : 0;
      
      // Calculate weekly earnings for chart
      const last7Days = Array(7).fill(0).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toLocaleDateString('en-CA');
      }).reverse();

      const weeklyData = last7Days.map(dateStr => {
          const dayEarnings = allEarnings
              .filter(e => new Date(e.created_date).toLocaleDateString('en-CA') === dateStr)
              .reduce((sum, e) => sum + e.amount, 0);
          return {
              day: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
              earnings: dayEarnings,
          };
      });

      setStats({
        totalEarnings,
        adsWatchedToday,
        totalWatchTime,
        completionRate,
      });
      
      setRecentViews(allViews.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 3));
      setWeeklyEarnings(weeklyData);
      
      setIsLoading(false);
    };

    fetchData();
  }, []);
  
  const getGreeting = () => {
    const greetings = {
      morning: '🌅 Good morning',
      afternoon: '☀️ Good afternoon', 
      evening: '🌙 Good evening'
    };
    return greetings[timeOfDay] || 'Hello';
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">
                {getGreeting()}, {user?.full_name || 'User'}! 👋
              </h1>
              <p className="text-slate-600 text-lg">Ready to turn your time into earnings?</p>
            </div>
            <Link to={createPageUrl("WatchAds")}>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Start Watching
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Earnings"
            value={`₹${stats.totalEarnings.toFixed(2)}`}
            icon={DollarSign}
            gradient="from-emerald-500 to-teal-600"
            delay={0.1}
            isLoading={isLoading}
          />
          <StatsCard
            title="Ads Watched Today"
            value={stats.adsWatchedToday}
            icon={Play}
            gradient="from-blue-500 to-cyan-600"
            delay={0.2}
            isLoading={isLoading}
          />
          <StatsCard
            title="Watch Time"
            value={`${stats.totalWatchTime.toFixed(1)}hrs`}
            icon={Clock}
            gradient="from-purple-500 to-pink-600"
            delay={0.3}
            isLoading={isLoading}
          />
          <StatsCard
            title="Completion Rate"
            value={`${stats.completionRate.toFixed(0)}%`}
            icon={Target}
            gradient="from-orange-500 to-red-600"
            delay={0.4}
            isLoading={isLoading}
          />
        </div>

        {/* Charts and Activity Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <EarningsChart weeklyData={weeklyEarnings} isLoading={isLoading} />
          </div>
          <div>
            <RecentActivity recentViews={recentViews} isLoading={isLoading}/>
          </div>
        </div>

        {/* Action Card */}
        <div className="grid md:grid-cols-1 gap-6">
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 p-8 text-white shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Ready to Cash Out?</h3>
                <p className="text-emerald-100">Minimum payout: ₹20.00</p>
              </div>
            </div>
            <Link to={createPageUrl("Earnings")}>
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                View Earnings
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}