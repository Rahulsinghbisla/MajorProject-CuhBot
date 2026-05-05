"use client";

import React from 'react';
import { 
  GraduationCap, FileText, Home, Bell, Send, Search 
} from 'lucide-react';

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <>
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

          <div className="mt-6 flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Try asking about:</span>
            <SuggestionTag label="Admission Process" />
            <SuggestionTag label="Exam Schedule" />
            <SuggestionTag label="Campus Facilities" />
          </div>
        </div>
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
    </>
  );
}

// --- SUB-COMPONENTS FOR PAGE ---

const SuggestionTag = ({ label }: { label: string }) => (
  <Badge variant="outline" className="px-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-white transition-all shadow-sm cursor-pointer">
    {label}
  </Badge>
);

const ActionCard = ({ icon, title, desc }: { icon: React.ReactElement, title: string, desc: string }) => (
  <Card className="group p-6 bg-gray-50/50 border border-gray-100 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-indigo-50 transition-all cursor-pointer flex flex-col h-full shadow-none">
    <CardHeader className="p-0 pb-0 flex-none">
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 mb-4 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <CardTitle className="font-bold text-gray-900 text-base mb-2">{title}</CardTitle>
    </CardHeader>
    <CardContent className="p-0 pt-0 flex-grow flex flex-col">
      <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-grow">{desc}</p>
      <div className="text-gray-300 group-hover:text-indigo-600 self-end transition-colors">
        <Send size={16} />
      </div>
    </CardContent>
  </Card>
);