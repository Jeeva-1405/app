import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Earning, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  TrendingUp, 
  Calendar, 
  Download,
  Wallet,
  IndianRupee,
  Edit
} from "lucide-react";
import { format } from "date-fns";

export default function Earnings() {
  const [earnings, setEarnings] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        const currentUser = await User.me();
        setUser(currentUser);
        const userEarnings = await Earning.filter({ created_by: currentUser.email }, "-created_date");
        setEarnings(userEarnings);
        setIsLoading(false);
    }
    fetchData();
  }, []);

  const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0);
  const confirmedEarnings = earnings.filter(e => e.status === "confirmed").reduce((sum, earning) => sum + earning.amount, 0);
  const pendingEarnings = earnings.filter(e => e.status === "pending").reduce((sum, earning) => sum + earning.amount, 0);

  const MIN_WITHDRAWAL = 20;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Your Earnings 💳
          </h1>
          <p className="text-slate-600 text-lg">Track your progress and manage payouts via UPI</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0 shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Total Earnings</CardTitle>
                  <IndianRupee className="w-6 h-6 opacity-80" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">₹{totalEarnings.toFixed(2)}</div>
                <div className="flex items-center gap-1 text-green-100">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">All time earnings</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/60 backdrop-blur-xl border border-white/20 shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg text-slate-800">Available</CardTitle>
                  <Wallet className="w-6 h-6 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-800 mb-2">₹{confirmedEarnings.toFixed(2)}</div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Ready to withdraw
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/60 backdrop-blur-xl border border-white/20 shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg text-slate-800">Pending</CardTitle>
                  <Calendar className="w-6 h-6 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-800 mb-2">₹{pendingEarnings.toFixed(2)}</div>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  Processing
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Method */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/60 backdrop-blur-xl border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800">Payout Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-xl bg-white/40 border border-white/20 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI Logo" className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800">UPI</p>
                                <p className="text-sm text-slate-600 truncate max-w-[150px]">{user?.upi_id || 'Not set'}</p>
                            </div>
                        </div>
                        <Link to={createPageUrl("Profile")}>
                          <Button variant="ghost" size="icon" className="text-slate-500"><Edit className="w-4 h-4" /></Button>
                        </Link>
                      </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl shadow-md"
                    disabled={confirmedEarnings < MIN_WITHDRAWAL || !user?.upi_id}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {confirmedEarnings >= MIN_WITHDRAWAL ? 'Request Payout' : `Min. ₹${MIN_WITHDRAWAL} (₹${(MIN_WITHDRAWAL - confirmedEarnings).toFixed(2)} to go)`}
                  </Button>
                  {!user?.upi_id && confirmedEarnings >= MIN_WITHDRAWAL && (
                    <p className="text-center text-sm text-red-500 mt-2">Please set your UPI ID in your profile to withdraw.</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Earnings History */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-white/60 backdrop-blur-xl border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800">Recent Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {!isLoading && earnings.length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                            <p>No earnings yet.</p>
                            <p className="text-sm">Start watching ads to see your history here.</p>
                        </div>
                    )}
                    {earnings.map((earning, index) => (
                      <motion.div
                        key={earning.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/40 border border-white/20"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            earning.status === 'confirmed' 
                              ? 'bg-gradient-to-br from-emerald-500 to-green-600'
                              : 'bg-gradient-to-br from-orange-500 to-yellow-600'
                          }`}>
                            <IndianRupee className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              Ad Viewing Reward
                            </p>
                            <p className="text-sm text-slate-500">
                              {format(new Date(earning.created_date), 'MMM d, yyyy • h:mm a')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold text-slate-800">
                            +₹{earning.amount.toFixed(2)}
                          </p>
                          <Badge 
                            variant="outline"
                            className={
                              earning.status === 'confirmed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-orange-50 text-orange-700 border-orange-200'
                            }
                          >
                            {earning.status}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}