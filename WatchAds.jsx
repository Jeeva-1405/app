
import React, { useState } from "react";
import { motion } from "framer-motion";
import { AdView, Earning } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Filter, 
  Clock, 
  DollarSign,
  PlayCircle
} from "lucide-react";

import AdCard from "../components/ads/AdCard";
import AdPlayer from "../components/ads/AdPlayer";

export default function WatchAds() {
  const [ads] = useState([
    {
      id: 1,
      ad_title: "Latest Smartphone Tech",
      ad_description: "Discover the newest smartphone features and innovations that will change how you connect.",
      ad_duration: 30,
      reward_amount: 0.20,
      category: "technology",
      advertiser: "TechCorp"
    },
    {
      id: 2,
      ad_title: "Luxury Fashion Collection",
      ad_description: "Explore our premium fashion line with sustainable materials and timeless designs.",
      ad_duration: 45,
      reward_amount: 0.20,
      category: "lifestyle",
      advertiser: "StyleBrand"
    },
    {
      id: 3,
      ad_title: "Travel Paradise Destinations",
      ad_description: "Experience breathtaking locations around the world with our curated travel packages.",
      ad_duration: 60,
      reward_amount: 0.20,
      category: "travel",
      advertiser: "WanderLust Tours"
    },
    {
      id: 4,
      ad_title: "Financial Freedom Course",
      ad_description: "Learn investment strategies and financial planning from industry experts.",
      ad_duration: 90,
      reward_amount: 0.20,
      category: "finance",
      advertiser: "WealthWise"
    },
    {
      id: 5,
      ad_title: "New Movie Trailer",
      ad_description: "Get a sneak peek of the upcoming blockbuster movie of the year.",
      ad_duration: 30,
      reward_amount: 0.20,
      category: "entertainment",
      advertiser: "Cinema Studios"
    }
  ]);

  const [selectedAd, setSelectedAd] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showPlayer, setShowPlayer] = useState(false);

  const categories = ["all", "technology", "lifestyle", "travel", "finance", "entertainment"];
  
  const filteredAds = activeCategory === "all" 
    ? ads 
    : ads.filter(ad => ad.category === activeCategory);

  const handleWatchAd = (ad) => {
    setSelectedAd(ad);
    setShowPlayer(true);
  };

  const handleAdComplete = async (ad, watchTime, completed) => {
    try {
      const completion_percentage = (ad.ad_duration > 0 ? (watchTime / ad.ad_duration) * 100 : 0);

      // Save ad view
      const newAdView = await AdView.create({
        ad_title: ad.ad_title,
        ad_description: ad.ad_description,
        ad_duration: ad.ad_duration,
        reward_amount: ad.reward_amount,
        status: completed ? "completed" : "skipped",
        watch_time: watchTime,
        completion_percentage: completion_percentage,
        category: ad.category,
        advertiser: ad.advertiser
      });

      if (completed) {
        // Save earning
        await Earning.create({
          amount: ad.reward_amount,
          ad_view_id: newAdView.id.toString(),
          status: "confirmed"
        });
      }

      setShowPlayer(false);
      setSelectedAd(null);
    } catch (error) {
      console.error("Error saving ad completion:", error);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">
                Watch & Earn 💰
              </h1>
              <p className="text-slate-600 text-lg">Choose an ad and start earning today</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                <DollarSign className="w-3 h-3 mr-1" />
                ₹0.20 per ad
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                <Clock className="w-3 h-3 mr-1" />
                30-90 seconds
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 bg-white/60 backdrop-blur-xl p-2 rounded-xl border border-white/20">
            {categories.map((category) => (
              <TabsTrigger 
                key={category}
                value={category}
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <PlayCircle className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-slate-800">Available Ads</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAds.length > 0 ? filteredAds.map((ad, index) => (
                    <AdCard 
                      key={ad.id}
                      ad={ad}
                      onWatch={handleWatchAd}
                      delay={index * 0.1}
                    />
                  )) : (
                    <div className="col-span-full text-center py-16 text-slate-500">
                      <p>No ads available in this category.</p>
                    </div>
                  )
                }
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Ad Player */}
        <AdPlayer
          ad={selectedAd}
          onComplete={handleAdComplete}
          onClose={() => {
            setShowPlayer(false);
            setSelectedAd(null);
          }}
          isVisible={showPlayer}
        />
      </div>
    </div>
  );
}
