
import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Play } from "lucide-react"; // Removed Star import

const categoryColors = {
  technology: "bg-blue-100 text-blue-800",
  lifestyle: "bg-purple-100 text-purple-800", 
  entertainment: "bg-pink-100 text-pink-800",
  finance: "bg-emerald-100 text-emerald-800",
  shopping: "bg-orange-100 text-orange-800",
  travel: "bg-cyan-100 text-cyan-800",
  health: "bg-green-100 text-green-800"
};

export default function AdCard({ 
  ad, 
  onWatch, 
  delay = 0
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
    >
      {/* Removed isPremium badge */}
      
      <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="font-bold text-lg mb-1">{ad.advertiser}</h3>
          <p className="text-sm opacity-90">{ad.ad_title}</p>
        </div>
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-sm">
            <Clock className="w-3 h-3" />
            {ad.ad_duration}s
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary" className={categoryColors[ad.category]}>
            {ad.category}
          </Badge>
          <div className="flex items-center gap-1 font-bold text-emerald-600">
            <DollarSign className="w-4 h-4" />
            {ad.reward_amount.toFixed(2)} {/* Added .toFixed(2) */}
          </div>
        </div>
        
        <p className="text-slate-600 mb-4 line-clamp-2 h-10"> {/* Added h-10 class */}
          {ad.ad_description}
        </p>
        
        <Button 
          onClick={() => onWatch(ad)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105"
        >
          <Play className="w-4 h-4 mr-2" />
          Watch & Earn
        </Button>
      </div>
    </motion.div>
  );
}
