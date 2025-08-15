import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  Play, 
  Wallet, 
  TrendingUp,
  User as UserIcon,
  Settings
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Watch Ads",
    url: createPageUrl("WatchAds"),
    icon: Play,
  },
  {
    title: "Earnings",
    url: createPageUrl("Earnings"),
    icon: Wallet,
  },
  {
    title: "Profile",
    url: createPageUrl("Profile"),
    icon: UserIcon,
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --gradient-earnings: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            --gradient-success: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            --glass-bg: rgba(255, 255, 255, 0.1);
            --glass-border: rgba(255, 255, 255, 0.2);
          }
        `}
      </style>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Sidebar className="border-r border-white/20 backdrop-blur-xl bg-white/80">
          <SidebarHeader className="border-b border-white/20 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AdWatch Pro
                </h2>
                <p className="text-xs text-slate-500">Earn from anywhere in India</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`rounded-xl px-4 py-3 transition-all duration-200 hover:bg-white/60 hover:backdrop-blur-sm hover:shadow-sm ${
                          location.pathname === item.url 
                            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 shadow-sm' 
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-4 rounded-xl bg-gradient-to-br from-emerald-50 to-blue-50 border border-white/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Wallet className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold text-slate-700">Today's Earnings</span>
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    ₹0.00
                  </div>
                  <div className="text-xs text-slate-500 mt-1">0 ads watched</div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-white/20 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate">User</p>
                <p className="text-xs text-slate-500 truncate">Member</p>
              </div>
              <Link to={createPageUrl("Profile")} className="p-2 rounded-lg hover:bg-white/40 transition-colors text-slate-400 hover:text-slate-600">
                <Settings className="w-4 h-4" />
              </Link>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/40 backdrop-blur-xl border-b border-white/20 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-white/40 p-2 rounded-xl transition-colors duration-200" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AdWatch Pro
              </h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}