"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, MessageSquare, GraduationCap, FileText, 
  MapPin, Bell, HelpCircle, Send, Search, Sparkles 
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const pathname = usePathname();

  // Navigation Configuration
  const navLinks = [
    { icon: <Home size={20} />, label: "Home", href: "/dashboard" },
    { icon: <MessageSquare size={20} />, label: "Ask a Question", href: "/chat" },
    { icon: <GraduationCap size={20} />, label: "Academics", href: "/dashboard/academics" },
    { icon: <FileText size={20} />, label: "Admissions", href: "/dashboard/admissions" },
    { icon: <MapPin size={20} />, label: "Campus Life", href: "/dashboard/campus-life" },
    { icon: <FileText size={20} />, label: "Examinations", href: "/dashboard/exams" },
    { icon: <Sparkles size={20} />, label: "Facilities", href: "/dashboard/facilities" },
    { icon: <Bell size={20} />, label: "Notices & Events", href: "/dashboard/events" },
    { icon: <HelpCircle size={20} />, label: "FAQs", href: "/dashboard/faq" },
  ];

  return (
    <div className="flex h-screen bg-[#f4f7fe] overflow-hidden p-4">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 flex flex-col pb-6 pr-4">
        <div className="flex items-center gap-2 px-4 mb-8">
          <div className="w-10 h-10 bg-indigo-900 rounded-xl flex items-center justify-center text-white font-bold">U</div>
          <div>
            <h1 className="font-bold text-lg leading-none">CuhBot</h1>
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
          <Button variant="outline" className="w-full justify-start gap-2 rounded-xl border-gray-200">
            <MessageSquare size={18} /> Feedback
          </Button>
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="text-sm">
              <p className="font-bold">Guest</p>
              <button className="text-indigo-600 text-xs hover:underline">Sign in</button>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        
        {/* Header/Top Bar */}
        <div className="flex justify-end p-6 gap-4">
           <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-green-700">Online</span>
           </div>
           <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <HelpCircle size={20} className="text-gray-500" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto px-12 pb-12">
          
          {/* Hero Section */}
          <section className="relative bg-gradient-to-r from-blue-50/50 to-transparent rounded-3xl p-10 mb-12 overflow-hidden min-h-[300px] flex flex-col justify-center">
            <div className="relative z-10 max-w-xl">
              <p className="text-gray-500 font-medium mb-2">Hello! 👋</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                I'm <span className="text-indigo-600">CuhBot</span><br />
                Your University Assistant
              </h2>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                I can help you with information about admissions, academics, examinations, campus facilities, events and much more.
              </p>

              <div className="relative group max-w-lg">
                <Input 
                  placeholder="How can I help you today?" 
                  className="h-14 pl-6 pr-14 rounded-2xl border-gray-200 shadow-lg shadow-indigo-50/50 focus-visible:ring-indigo-500"
                />
                <Button size="icon" className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-indigo-600 hover:bg-indigo-700">
                  <Send size={18} />
                </Button>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Try asking about:</span>
                <SuggestionTag label="Admission Process" />
                <SuggestionTag label="Exam Schedule" />
                <SuggestionTag label="Campus Facilities" />
              </div>
            </div>

            {/* Mascot Image (Ensure this PNG is in your public folder) */}
            <img 
              src="/robot-mascot.png" 
              alt="Mascot" 
              className="absolute right-0 bottom-0 w-[450px] object-contain hidden lg:block"
            />
          </section>

          {/* Quick Actions Grid */}
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-6">Explore quick actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <ActionCard icon={<GraduationCap />} title="Academics" desc="Find information about courses, programs, and departments." />
              <ActionCard icon={<Search />} title="Admissions" desc="Get details about admission process, eligibility and dates." />
              <ActionCard icon={<FileText />} title="Examinations" desc="Check exam schedules, results, and related information." />
              <ActionCard icon={<Home />} title="Campus Life" desc="Explore clubs, events, hostels, and student services." />
              <ActionCard icon={<Bell />} title="Notices & Events" desc="Stay updated with latest announcements and events." />
            </div>
          </section>
        </div>

        {/* Bottom Status Bar */}
        <div className="py-4 border-t border-gray-50 flex justify-center items-center gap-2 bg-white flex-shrink-0">
          <div className="w-5 h-5 bg-gray-400 rounded flex items-center justify-center text-[10px] text-white font-bold">U</div>
          <p className="text-[10px] text-gray-400 font-medium">CuhBot — Empowering students with instant information</p>
        </div>
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

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

const SuggestionTag = ({ label }: { label: string }) => (
  <button className="px-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm">
    {label}
  </button>
);

const ActionCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="group p-6 bg-gray-50/50 border border-gray-100 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-indigo-50 transition-all cursor-pointer flex flex-col h-full">
    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 mb-4 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
    <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-grow">{desc}</p>
    <div className="text-gray-300 group-hover:text-indigo-600 self-end transition-colors">
      <Send size={16} />
    </div>
  </div>
);

export default Dashboard;