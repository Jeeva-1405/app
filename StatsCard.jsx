import React from 'react';
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  gradient, 
  trend,
  delay = 0,
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <Skeleton className="h-[150px] rounded-2xl bg-white/60" />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 transform translate-x-8 -translate-y-8 bg-gradient-to-br ${gradient}`} />
      
      <div className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-emerald-500">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">{trend}</span>
            </div>
          )}
        </div>
        
        <div>
          <p className="text-slate-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}