"use client";

import React from 'react';
import { 
  Search, BookOpen, Dumbbell, Coffee, Monitor, 
  ChevronRight, Clock, MapPin, ExternalLink, Sparkles
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FacilitiesPage() {
  return (
    <div className="animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="text-gray-800" size={28} />
          <h1 className="text-3xl font-bold text-gray-900">Facilities</h1>
        </div>
        <p className="text-gray-500 text-sm mb-6">Explore campus amenities, libraries, labs, and recreation centers</p>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-4xl">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <Input 
              placeholder="Search facilities, labs, sports..." 
              className="h-12 pl-12 rounded-full border-gray-200 bg-white shadow-sm focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 text-base"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            <Button className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-6">All</Button>
            <Button variant="outline" className="rounded-full border-gray-200 text-gray-600 bg-white hover:bg-gray-50 px-6">Academic</Button>
            <Button variant="outline" className="rounded-full border-gray-200 text-gray-600 bg-white hover:bg-gray-50 px-6">Sports</Button>
            <Button variant="outline" className="rounded-full border-gray-200 text-gray-600 bg-white hover:bg-gray-50 px-6">Food</Button>
          </div>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<BookOpen size={20}/>} iconBg="bg-indigo-100" iconColor="text-indigo-600" value="4" label="Libraries" />
        <StatCard icon={<Monitor size={20}/>} iconBg="bg-blue-100" iconColor="text-blue-500" value="12" label="Research Labs" />
        <StatCard icon={<Dumbbell size={20}/>} iconBg="bg-emerald-100" iconColor="text-emerald-500" value="5" label="Sports Grounds" />
        <StatCard icon={<Coffee size={20}/>} iconBg="bg-amber-100" iconColor="text-amber-500" value="8" label="Cafeterias" />
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-bold text-gray-900">Featured Amenities</h2>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">View Map <MapPin size={14} className="ml-1"/></button>
          </div>

          <div className="space-y-3">
            <ListCard color="border-l-indigo-500" icon={<BookOpen className="text-indigo-500"/>} title="Central Library" subtitle="Open 24/7 · Main Academic Block" />
            <ListCard color="border-l-blue-400" icon={<Monitor className="text-blue-400"/>} title="Advanced Computing Lab" subtitle="08:00 AM - 10:00 PM · Block A" />
            <ListCard color="border-l-emerald-400" icon={<Dumbbell className="text-emerald-400"/>} title="Indoor Sports Complex" subtitle="06:00 AM - 09:00 PM · Near Hostels" />
            <ListCard color="border-l-amber-400" icon={<Coffee className="text-amber-400"/>} title="Student Center Cafeteria" subtitle="07:00 AM - 11:00 PM · North Wing" />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h2>
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2 mb-4"><Clock size={16}/> Current Status</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Central Library</span><Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200">Open</Badge></div>
              <div className="flex justify-between"><span className="text-gray-500">Health Center</span><Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200">Open</Badge></div>
              <div className="flex justify-between"><span className="text-gray-500">Computing Lab</span><Badge variant="outline" className="text-rose-600 bg-rose-50 border-rose-200">Closed</Badge></div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2 mb-4"><BookOpen size={16}/> Library Occupancy</h3>
            <div className="flex justify-between text-xs mb-2"><span className="text-gray-500">Currently Seated</span><span className="font-bold text-indigo-600">340 / 500</span></div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
              <div className="bg-indigo-500 h-2 rounded-full w-[68%]"></div>
            </div>
            <p className="text-[10px] text-gray-400">High occupancy expected after 5 PM.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2 mb-4"><ExternalLink size={16}/> Quick Services</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center group cursor-pointer"><span className="text-gray-600 group-hover:text-indigo-600 transition-colors">Book a Computer Lab</span><Badge variant="secondary" className="bg-blue-50 text-blue-600">Portal</Badge></div>
              <div className="flex justify-between items-center group cursor-pointer"><span className="text-gray-600 group-hover:text-indigo-600 transition-colors">Gym Membership</span><Badge variant="secondary" className="bg-gray-100 text-gray-600">Link</Badge></div>
              <div className="flex justify-between items-center group cursor-pointer"><span className="text-gray-600 group-hover:text-indigo-600 transition-colors">Hostel Menu</span><Badge variant="secondary" className="bg-indigo-50 text-indigo-600">PDF</Badge></div>
            </div>
          </div>
        </div>
      </div>

      <BottomBanner title="Looking for a specific facility?" subtitle="Ask CuhBot — find timings, directions, and booking rules instantly" />
    </div>
  );
}

// --- SHARED COMPONENTS BELOW ---
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
      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20 shrink-0"><Sparkles size={24} className="text-white" /></div>
      <div><h3 className="text-lg font-bold">{title}</h3><p className="text-sm text-indigo-100 mt-1">{subtitle}</p></div>
    </div>
    <Button className="bg-white text-indigo-600 hover:bg-gray-50 rounded-xl px-8 h-12 font-bold relative z-10 shadow-sm whitespace-nowrap">Ask CuhBot <ExternalLink size={16} className="ml-2" /></Button>
  </div>
);