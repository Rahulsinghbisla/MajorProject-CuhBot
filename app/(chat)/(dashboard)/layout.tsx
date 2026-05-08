"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, MessageSquare, GraduationCap, FileText, 
  MapPin, Bell, HelpCircle, Sparkles 
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { v4 as uuidv4 } from "uuid";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [threadId, setThreadId] = React.useState("");
  useEffect(() => {
    setThreadId(uuidv4());
  }, []);

  // Navigation Configuration
  const navLinks = [
    { icon: <Home size={20} />, label: "Home", href: "/" },
    { icon: <MessageSquare size={20} />, label: "Ask a Question", href: `/chat/${threadId}` },
    { icon: <GraduationCap size={20} />, label: "Academics", href: "/academics" },
    { icon: <FileText size={20} />, label: "Admissions", href: "/admission" },
    { icon: <MapPin size={20} />, label: "Campus Life", href: "/campus" },
    { icon: <FileText size={20} />, label: "Examinations", href: "/examination" },
    { icon: <Sparkles size={20} />, label: "Facilities", href: "/facilities" },
    { icon: <Bell size={20} />, label: "Notices & Events", href: "/notice" },
    { icon: <HelpCircle size={20} />, label: "FAQs", href: "/faq" },
  ];

  return (
    <div className="flex h-screen bg-[#f4f7fe] overflow-hidden p-4">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 flex flex-col pb-6 pr-4">
        <div className="flex items-center gap-2 px-4 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold">U</div>
          <div>
            <h1 className="font-bold text-lg leading-none text-gray-900">CuhBot</h1>
            <p className="text-[10px] text-gray-500">Your University Assistant</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navLinks.map((link) => (
            <NavItem 
              key={link.href}
              icon={link.icon} 
              label={link.label} 
              href={link.href}
              active={pathname === link.href}
            />
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <Button variant="outline" className="w-full justify-start gap-2 rounded-xl border-gray-200 text-gray-700 bg-transparent hover:bg-gray-100"
          >
            <Link href="/dashboard/feedback">
              <MessageSquare size={18} /> Feedback
            </Link>
          </Button>
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="text-sm">
              <p className="font-bold text-gray-900">Guest</p>
              <button className="text-indigo-600 text-xs hover:underline">Sign in</button>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT SHELL --- */}
      <main className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        
        {/* Header/Top Bar */}
        <div className="flex justify-end p-6 gap-4">
           <Badge variant="outline" className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100 hover:bg-green-50 shadow-none">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-green-700">Online</span>
           </Badge>
           <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <HelpCircle size={20} className="text-gray-500" />
           </button>
        </div>

        {/* Dynamic Page Content Injected Here */}
        <div className="flex-1 overflow-y-auto px-12 pb-12">
          {children}
        </div>

        {/* Bottom Status Bar */}
        <div className="py-4 border-t border-gray-50 flex justify-center items-center gap-2 bg-white flex-shrink-0">
          <div className="w-5 h-5 bg-gray-400 rounded flex items-center justify-center text-[10px] text-white font-bold">U</div>
          <p className="text-[10px] text-gray-400 font-medium">CuhBot — Empowering students with instant information</p>
        </div>
      </main>
    </div>
  );
}

// Sidebar NavItem Component
const NavItem = ({ 
  icon, 
  label, 
  href, 
  active = false 
}: { 
  icon: React.ReactNode, 
  label: string, 
  href: string, 
  active?: boolean 
}) => (
  <Link href={href} className="block w-full">
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
      active 
        ? 'bg-indigo-600/10 text-indigo-700 font-semibold shadow-sm' 
        : 'text-gray-500 hover:bg-gray-100 hover:text-indigo-600'
    }`}>
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  </Link>
);