import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  X,
  CheckCircle,
  DollarSign,
  Clock
} from "lucide-react";

export default function AdPlayer({ 
  ad, 
  onComplete, 
  onClose,
  isVisible 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [watchTime, setWatchTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const timeLeft = ad ? ad.ad_duration - watchTime : 0;

  useEffect(() => {
    if (!ad || !isVisible) return;
    
    let interval;
    if (isPlaying && !isCompleted) {
      interval = setInterval(() => {
        setWatchTime(prev => {
          const newTime = prev + 1;
          if (newTime >= ad.ad_duration) {
            setIsCompleted(true);
            setIsPlaying(false);
            setProgress(100);
            return ad.ad_duration;
          }
          setProgress((newTime / ad.ad_duration) * 100);
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, ad, isCompleted, isVisible]);

  const handlePlayPause = () => {
    if (isCompleted) return;
    setIsPlaying(!isPlaying);
  };

  const handleComplete = () => {
    onComplete(ad, watchTime, isCompleted);
  };

  if (!isVisible || !ad) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{ad.ad_title}</h2>
              <p className="text-slate-500">{ad.advertiser}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 font-semibold text-emerald-600">
                <DollarSign className="w-4 h-4" />
                {ad.reward_amount.toFixed(2)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Video Area */}
          <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 relative flex items-center justify-center flex-1">
            <div className="text-center text-white">
              <div className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                <Play className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{ad.ad_title}</h3>
              <p className="text-slate-300">{ad.ad_description}</p>
            </div>

            {/* Play/Pause Overlay */}
            {!isCompleted && (
              <button
                onClick={handlePlayPause}
                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
              >
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                  {isPlaying ? (
                    <Pause className="w-10 h-10 text-white" />
                  ) : (
                    <Play className="w-10 h-10 text-white ml-1" />
                  )}
                </div>
              </button>
            )}

            {/* Completion Overlay */}
            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 bg-emerald-500/90 flex items-center justify-center"
              >
                <div className="text-center text-white">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Ad Completed!</h3>
                  <p className="text-emerald-100">{`You earned ₹${ad.reward_amount.toFixed(2)}`}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <div className="p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePlayPause}
                  disabled={isCompleted}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4" />
                <span className="font-mono">
                  {`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-sm text-slate-500">
                <span>Progress: {Math.floor(progress)}%</span>
                <span>Duration: {ad.ad_duration}s</span>
              </div>
            </div>

            {isCompleted && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mt-6"
              >
                <Button
                  onClick={handleComplete}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 rounded-xl shadow-lg"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {`Claim Reward (₹${ad.reward_amount.toFixed(2)})`}
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}