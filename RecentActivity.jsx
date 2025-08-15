import React from 'react';
import { motion } from "framer-motion";
import { Play, DollarSign, Clock, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';

export default function RecentActivity({ recentViews, isLoading }) {
  if (isLoading) {
    return (
        <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 shadow-xl p-6">
            <Skeleton className="h-6 w-1/2 mb-6" />
            <div className="space-y-4">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
            </div>
        </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 shadow-xl p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">Recent Activity</h3>
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          All Completed
        </Badge>
      </div>
      
      <div className="space-y-4">
        {recentViews.length > 0 ? recentViews.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-white/40 hover:bg-white/60 transition-all duration-200 border border-white/20"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
              <Play className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex-1">
              <h4 className="font-semibold text-slate-800">{activity.ad_title}</h4>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <Clock className="w-3 h-3" />
                  {activity.ad_duration}s
                </div>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 text-sm">{formatDistanceToNow(new Date(activity.created_date))} ago</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 font-bold text-emerald-600">
              <DollarSign className="w-4 h-4" />
              {activity.reward_amount.toFixed(2)}
            </div>
          </motion.div>
        )) : (
            <div className="text-center py-8 text-slate-500">
                <p>No recent activity.</p>
                <p className="text-sm">Watch some ads to get started!</p>
            </div>
        )}
      </div>
    </motion.div>
  );
}