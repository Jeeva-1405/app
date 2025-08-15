import React from 'react';
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';


export default function EarningsChart({ weeklyData, isLoading }) {
  const totalThisWeek = weeklyData?.reduce((sum, day) => sum + day.earnings, 0) || 0;

  if (isLoading) {
      return <Skeleton className="h-[350px] rounded-2xl bg-white/60" />;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 shadow-xl p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Weekly Earnings</h3>
          <p className="text-slate-500 text-sm">Your earning trends this week</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            ₹{totalThisWeek.toFixed(2)}
          </p>
          <p className="text-xs text-slate-500">Total this week</p>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyData}>
            <defs>
              <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              className="text-slate-400"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              className="text-slate-400"
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Earnings']}
            />
            <Area 
              type="monotone" 
              dataKey="earnings" 
              stroke="#3B82F6" 
              strokeWidth={3}
              fill="url(#earningsGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}