"use client";

import React from 'react';
import { 
  Search, Bell, Megaphone, Calendar, AlertCircle, 
  ChevronRight, ExternalLink, Clock, FileText
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function EventsPage() {
  return (
    <div className="animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Bell className="text-gray-800" size={28} />
          <h1 className="text-3xl font-bold text-gray-900">Notices & Events</h1>
        </div>
        <p className="text-gray-500 text-sm mb-6">Stay updated with the latest university announcements</p>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-4xl">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <Input 
              placeholder="Search circulars, events, deadlines..." 
              className="h-12 pl-12 rounded-full border-gray-200 bg-white shadow-sm focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 text-base"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            <Button className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-6">All</Button>
            <Button variant="outline" className="rounded-full border-gray-200 text-gray-600 bg-white hover:bg-gray-50 px-6">Notices</Button>
            <Button variant="outline" className="rounded-full border-gray-200 text-gray-600 bg-white hover:bg-gray-50 px-6">Events</Button>
          </div>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<AlertCircle size={20}/>} iconBg="bg-rose-100" iconColor="text-rose-600" value="5" label="New Notices" />
        <StatCard icon={<Calendar size={20}/>} iconBg="bg-blue-100" iconColor="text-blue-500" value="3" label="Events this Week" />
        <StatCard icon={<Clock size={20}/>} iconBg="bg-amber-100" iconColor="text-amber-500" value="2" label="Upcoming Deadlines" />
        <StatCard icon={<Megaphone size={20}/>} iconBg="bg-emerald-100" iconColor="text-emerald-500" value="1" label="Official Circular" />
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Announcements</h2>
            <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-200 animate-pulse">Live Updates</Badge>
          </div>

          <div className="space-y-3">
            <ListCard color="border-l-rose-500" icon={<AlertCircle className="text-rose-500"/>} title="Exam Registration Deadline Extended" subtitle="New Deadline: May 12, 2026 · Academics Dept" />
            <ListCard color="border-l-indigo-400" icon={<Megaphone className="text-indigo-400"/>} title="Annual Tech Fest 2026 Announced" subtitle="Dates: May 20 - 22 · Student Council" />
            <ListCard color="border-l-amber-400" icon={<Calendar className="text-amber-400"/>} title="Library Closed for Maintenance" subtitle="May 8, 09:00 AM to 02:00 PM · Administration" />
            <ListCard color="border-l-emerald-400" icon={<FileText className="text-emerald-400"/>} title="Hostel Fee Payment Portal Open" subtitle="Pay before May 15 to avoid late fees · Finance" />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h2>
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2 mb-4"><Calendar size={16}/> May Highlights</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Tech Fest</span><span className="font-medium text-indigo-600">May 20</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Semester Exams Begin</span><span className="font-medium text-rose-600">May 25</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Summer Break Starts</span><span className="font-medium text-emerald-600">June 5</span></div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2 mb-4"><FileText size={16}/> Important Links</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center group cursor-pointer"><span className="text-gray-600 group-hover:text-indigo-600 transition-colors">Academic Calendar</span><Badge variant="secondary" className="bg-indigo-50 text-indigo-600">PDF</Badge></div>
              <div className="flex justify-between items-center group cursor-pointer"><span className="text-gray-600 group-hover:text-indigo-600 transition-colors">Holiday List 2026</span><Badge variant="secondary" className="bg-gray-100 text-gray-600">PDF</Badge></div>
              <div className="flex justify-between items-center group cursor-pointer"><span className="text-gray-600 group-hover:text-indigo-600 transition-colors">Event Gallery</span><Badge variant="secondary" className="bg-blue-50 text-blue-600">Link</Badge></div>
            </div>
          </div>
        </div>
      </div>

      <BottomBanner title="Have a query about an event?" subtitle="Ask CuhBot — get instant venue details and registration links" />
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
      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20 shrink-0"><Bell size={24} className="text-white" /></div>
      <div><h3 className="text-lg font-bold">{title}</h3><p className="text-sm text-indigo-100 mt-1">{subtitle}</p></div>
    </div>
    <Button className="bg-white text-indigo-600 hover:bg-gray-50 rounded-xl px-8 h-12 font-bold relative z-10 shadow-sm whitespace-nowrap">Ask CuhBot <ExternalLink size={16} className="ml-2" /></Button>
  </div>
);