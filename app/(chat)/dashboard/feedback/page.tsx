"use client";

import React from 'react';
import { 
  MessageSquare, Star, ThumbsUp, Send, Edit3, 
  ChevronRight, ExternalLink, ShieldCheck, HeartPulse
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FeedbackPage() {
  return (
    <div className="animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="text-gray-800" size={28} />
          <h1 className="text-3xl font-bold text-gray-900">Student Feedback</h1>
        </div>
        <p className="text-gray-500 text-sm mb-6">Share your thoughts to help us improve the university experience</p>

        {/* Action Buttons instead of Search for Feedback */}
        <div className="flex gap-3 mt-4">
          <Button className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 shadow-md shadow-indigo-200">
            <Edit3 size={16} className="mr-2" /> Write New Feedback
          </Button>
          <Button variant="outline" className="rounded-full border-gray-200 text-gray-600 bg-white hover:bg-gray-50 px-6">
            View My Submissions
          </Button>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Star size={20}/>} iconBg="bg-amber-100" iconColor="text-amber-500" value="4.8/5" label="Average Rating" />
        <StatCard icon={<ThumbsUp size={20}/>} iconBg="bg-indigo-100" iconColor="text-indigo-600" value="1.2k" label="Forms Submitted" />
        <StatCard icon={<Send size={20}/>} iconBg="bg-blue-100" iconColor="text-blue-500" value="24h" label="Avg Response Time" />
        <StatCard icon={<ShieldCheck size={20}/>} iconBg="bg-emerald-100" iconColor="text-emerald-500" value="100%" label="Anonymous Safe" />
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-bold text-gray-900">Active Feedback Forms</h2>
            <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">Open Now</Badge>
          </div>

          <div className="space-y-3">
            <ListCard color="border-l-indigo-500" icon={<Edit3 className="text-indigo-500"/>} title="Mid-Semester Course Evaluation" subtitle="Closes in 3 days · Academic Department" />
            <ListCard color="border-l-amber-400" icon={<HeartPulse className="text-amber-400"/>} title="Hostel Mess Food Quality" subtitle="Weekly review · Campus Services" />
            <ListCard color="border-l-emerald-400" icon={<MessageSquare className="text-emerald-400"/>} title="General Infrastructure Suggestion" subtitle="Always open · Administration" />
            <ListCard color="border-l-rose-400" icon={<ShieldCheck className="text-rose-400"/>} title="Anti-Ragging Anonymous Report" subtitle="Strictly confidential · Student Welfare" />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Good to Know</h2>
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2 mb-4"><ShieldCheck size={16}/> How it works</h3>
            <ul className="space-y-3 text-xs text-gray-500 leading-relaxed list-disc pl-4">
              <li>Your feedback goes directly to the concerned Head of Department.</li>
              <li>You can choose to remain <strong>100% anonymous</strong> on all forms except official grievances.</li>
              <li>Action taken reports are published monthly on the portal.</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
            <h3 className="font-bold text-sm text-emerald-900 flex items-center gap-2 mb-2"><ThumbsUp size={16} className="text-emerald-600"/> Recent Improvements</h3>
            <p className="text-xs text-emerald-700/80 mb-4 leading-relaxed">Based on last month's feedback, library hours have been extended to 2 AM during exam weeks!</p>
            <Button variant="outline" className="w-full bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-100 rounded-xl shadow-none">Read Full Report</Button>
          </div>
        </div>
      </div>

      <BottomBanner title="Have an urgent issue to report?" subtitle="Ask CuhBot — file an instant grievance ticket using our automated system" />
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
      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20 shrink-0"><Send size={24} className="text-white" /></div>
      <div><h3 className="text-lg font-bold">{title}</h3><p className="text-sm text-indigo-100 mt-1">{subtitle}</p></div>
    </div>
    <Button className="bg-white text-indigo-600 hover:bg-gray-50 rounded-xl px-8 h-12 font-bold relative z-10 shadow-sm whitespace-nowrap">Ask CuhBot <ExternalLink size={16} className="ml-2" /></Button>
  </div>
);