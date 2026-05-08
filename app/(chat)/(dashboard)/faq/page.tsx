"use client";

import React from 'react';
import { 
  Search, HelpCircle, BookOpen, MessageSquare, CheckCircle, 
  ChevronRight, ExternalLink, HeadphonesIcon, FileQuestion
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FAQPage() {
  return (
    <div className="animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <HelpCircle className="text-gray-800" size={28} />
          <h1 className="text-3xl font-bold text-gray-900">FAQs</h1>
        </div>
        <p className="text-gray-500 text-sm mb-6">Find quick answers to common queries about academics, admissions, and more</p>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-4xl">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <Input 
              placeholder="Search for questions (e.g. 'How to pay fee?')" 
              className="h-12 pl-12 rounded-full border-gray-200 bg-white shadow-sm focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 text-base"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            <Button className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-6">Top Queries</Button>
            <Button variant="outline" className="rounded-full border-gray-200 text-gray-600 bg-white hover:bg-gray-50 px-6">Admissions</Button>
            <Button variant="outline" className="rounded-full border-gray-200 text-gray-600 bg-white hover:bg-gray-50 px-6">Exams</Button>
          </div>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<BookOpen size={20}/>} iconBg="bg-indigo-100" iconColor="text-indigo-600" value="150+" label="Help Articles" />
        <StatCard icon={<FileQuestion size={20}/>} iconBg="bg-blue-100" iconColor="text-blue-500" value="5" label="Categories" />
        <StatCard icon={<CheckCircle size={20}/>} iconBg="bg-emerald-100" iconColor="text-emerald-500" value="98%" label="Resolution Rate" />
        <StatCard icon={<HeadphonesIcon size={20}/>} iconBg="bg-amber-100" iconColor="text-amber-500" value="24/7" label="Bot Support" />
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-bold text-gray-900">Most Frequently Asked</h2>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">Browse all <ChevronRight size={16}/></button>
          </div>

          <div className="space-y-3">
            <ListCard color="border-l-indigo-500" icon={<HelpCircle className="text-indigo-500"/>} title="How do I pay my semester fees online?" subtitle="Category: Accounts · 1.2k views" />
            <ListCard color="border-l-emerald-400" icon={<HelpCircle className="text-emerald-400"/>} title="What is the process to apply for hostel?" subtitle="Category: Campus Life · 850 views" />
            <ListCard color="border-l-rose-400" icon={<HelpCircle className="text-rose-400"/>} title="Where can I download my admit card?" subtitle="Category: Examinations · 3.4k views" />
            <ListCard color="border-l-blue-400" icon={<HelpCircle className="text-blue-400"/>} title="How to request a transcript?" subtitle="Category: Academics · 600 views" />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h2>
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2 mb-4"><FileQuestion size={16}/> Popular Categories</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center group cursor-pointer"><span className="text-gray-500 group-hover:text-indigo-600">Admissions (24)</span><ChevronRight size={14} className="text-gray-300 group-hover:text-indigo-500"/></div>
              <div className="flex justify-between items-center group cursor-pointer"><span className="text-gray-500 group-hover:text-indigo-600">Examinations (45)</span><ChevronRight size={14} className="text-gray-300 group-hover:text-indigo-500"/></div>
              <div className="flex justify-between items-center group cursor-pointer"><span className="text-gray-500 group-hover:text-indigo-600">Hostel & Mess (18)</span><ChevronRight size={14} className="text-gray-300 group-hover:text-indigo-500"/></div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
            <h3 className="font-bold text-sm text-indigo-900 flex items-center gap-2 mb-2"><HeadphonesIcon size={16} className="text-indigo-600"/> Still need help?</h3>
            <p className="text-xs text-indigo-700/80 mb-4 leading-relaxed">If you couldn't find the answer to your question, our support team is here to assist you.</p>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-none">Contact IT Helpdesk</Button>
          </div>
        </div>
      </div>

      <BottomBanner title="Didn't find what you were looking for?" subtitle="Ask CuhBot — get highly specific answers directly from our knowledge base" />
    </div>
  );
}

// --- SHARED COMPONENTS ---
const StatCard = ({ icon, iconBg, iconColor, value, label }: any) => (
  <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100">
    <div className={`w-12 h-12 rounded-full ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>{icon}</div>
    <div><h3 className="text-2xl font-bold text-gray-900 leading-none mb-1">{value}</h3><p className="text-xs text-gray-500 font-medium">{label}</p></div>
  </div>
);
const ListCard = ({ color, icon, title, subtitle }: any) => (
  <div className={`bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm border border-gray-100 border-l-4 ${color} hover:shadow-md transition-shadow cursor-pointer group`}>
    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">{icon}</div>
    <div className="flex-1"><h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{title}</h4><p className="text-xs text-gray-500">{subtitle}</p></div>
    <ChevronRight className="text-gray-300 group-hover:text-indigo-500 transition-colors" size={20} />
  </div>
);
const BottomBanner = ({ title, subtitle }: any) => (
  <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-lg shadow-indigo-200">
    <div className="absolute top-0 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
    <div className="absolute bottom-0 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
    <div className="flex items-center gap-4 relative z-10 text-white">
      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20 shrink-0"><MessageSquare size={24} className="text-white" /></div>
      <div><h3 className="text-lg font-bold">{title}</h3><p className="text-sm text-indigo-100 mt-1">{subtitle}</p></div>
    </div>
    <Button className="bg-white text-indigo-600 hover:bg-gray-50 rounded-xl px-8 h-12 font-bold relative z-10 shadow-sm whitespace-nowrap">Ask CuhBot <ExternalLink size={16} className="ml-2" /></Button>
  </div>
);