import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Save, Mail, User as UserIcon, CheckCircle, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // null, 'success', 'error'

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        setUpiId(currentUser.upi_id || "");
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await User.updateMyUserData({ upi_id: upiId });
      setSaveStatus('success');
    } catch (error) {
      console.error("Failed to save UPI ID", error);
      setSaveStatus('error');
    }
    setIsSaving(false);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Your Profile</h1>
          <p className="text-slate-600 text-lg">Manage your account details and payment information.</p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
        >
          <Card className="bg-white/60 backdrop-blur-xl border border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>This information is used to identify you on the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-white/40 border border-white/20">
                    <UserIcon className="w-5 h-5 text-slate-500" />
                    <div className="flex-1">
                      <Label className="text-sm text-slate-500">Full Name</Label>
                      <p className="font-semibold text-slate-800">{user?.full_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-white/40 border border-white/20">
                    <Mail className="w-5 h-5 text-slate-500" />
                    <div className="flex-1">
                      <Label className="text-sm text-slate-500">Email Address</Label>
                      <p className="font-semibold text-slate-800">{user?.email}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
        >
          <Card className="bg-white/60 backdrop-blur-xl border border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Enter your UPI ID to receive payments. All payouts are processed via UPI.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
              ) : (
                <div className="space-y-2">
                    <Label htmlFor="upi_id" className="flex items-center gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI Logo" className="w-8" />
                        UPI ID
                    </Label>
                    <Input
                        id="upi_id"
                        placeholder="yourname@bank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        disabled={isSaving}
                    />
                    <p className="text-xs text-slate-500">e.g., 9876543210@upi or username@okhdfcbank</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <div>
                    {saveStatus === 'success' && (
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex items-center gap-2 text-emerald-600">
                           <CheckCircle className="w-4 h-4" />
                           <span>Saved successfully!</span>
                        </motion.div>
                    )}
                    {saveStatus === 'error' && (
                         <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex items-center gap-2 text-red-600">
                           <AlertCircle className="w-4 h-4" />
                           <span>Failed to save. Please try again.</span>
                        </motion.div>
                    )}
                </div>
                <Button onClick={handleSave} disabled={isSaving || isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}