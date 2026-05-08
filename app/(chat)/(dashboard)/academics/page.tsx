"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Building2,
  ChevronRight,
  FileText,
  GraduationCap,
  MessageCircle,
  MonitorPlay,
  Search,
  Users,
  ClipboardList,
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "42",   label: "Departments", icon: Building2,    accent: "text-[#5E50C8]", bg: "bg-[#F0EEFF]" },
  { value: "318",  label: "Courses",     icon: BookOpen,     accent: "text-sky-500",   bg: "bg-sky-50"    },
  { value: "12",   label: "Programs",    icon: GraduationCap,accent: "text-emerald-500",bg: "bg-emerald-50"},
  { value: "2.4k", label: "Students",    icon: Users,        accent: "text-amber-500", bg: "bg-amber-50"  },
];

const FILTERS = ["All", "Engineering", "Science", "Arts", "Commerce"];

const DEPARTMENTS = [
  { icon: "💻", name: "Computer Science",   meta: "48 courses · 6 semesters", accent: "bg-[#5E50C8]", light: "bg-[#F0EEFF]", text: "text-[#5E50C8]"   },
  { icon: "⚙️",  name: "Mechanical Engg.",   meta: "36 courses · 6 semesters", accent: "bg-sky-500",   light: "bg-sky-50",    text: "text-sky-500"    },
  { icon: "⚡", name: "Electrical Engg.",   meta: "40 courses · 6 semesters", accent: "bg-amber-400", light: "bg-amber-50",  text: "text-amber-500"  },
  { icon: "🧬", name: "Biotechnology",      meta: "28 courses · 6 semesters", accent: "bg-emerald-500",light: "bg-emerald-50",text: "text-emerald-500"},
  { icon: "📐", name: "Civil Engineering",  meta: "32 courses · 6 semesters", accent: "bg-rose-400",  light: "bg-rose-50",   text: "text-rose-500"   },
];

const CALENDAR = [
  { label: "Semester Start",  date: "Jul 15, 2025", dot: "bg-emerald-400" },
  { label: "Mid-term Exams",  date: "Sep 10, 2025", dot: "bg-amber-400"   },
  { label: "End-term Exams",  date: "Nov 20, 2025", dot: "bg-rose-400"    },
  { label: "Result Date",     date: "Dec 10, 2025", dot: "bg-[#5E50C8]"   },
];

const RESOURCES = [
  { icon: FileText,      label: "Syllabus 2024-25",     tag: "PDF"    },
  { icon: BookOpen,      label: "Study Material",        tag: "Portal" },
  { icon: MonitorPlay,   label: "Lecture Recordings",    tag: "Video"  },
  { icon: ClipboardList, label: "Assignment Portal",     tag: "Link"   },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AcademicsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredDepts = DEPARTMENTS.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "All" ||
      d.name.toLowerCase().includes(activeFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#F5F6FC] p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Page Header ── */}
        <div>
          <h1 className="text-3xl font-bold text-[#2D2B4E] flex items-center gap-2">
            <GraduationCap className="text-[#5E50C8]" size={32} />
            Academics
          </h1>
          <p className="text-[#7B75A8] mt-1 text-sm">
            Explore courses, departments, programs and academic resources
          </p>
        </div>

        {/* ── Search + Filter ── */}
        <div className="space-y-3">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B93D8]" size={16} />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses, departments, subjects…"
              className="pl-10 rounded-full border-[#E8E6F8] bg-white shadow-[0_4px_16px_rgba(94,80,200,0.08)] focus-visible:ring-[#5E50C8] text-[#2D2B4E] placeholder:text-[#9B93D8]"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <Button
                key={f}
                variant={activeFilter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(f)}
                className={
                  activeFilter === f
                    ? "rounded-full bg-[#5E50C8] hover:bg-[#4A3CB8] text-white border-none shadow-[0_4px_12px_rgba(94,80,200,0.30)]"
                    : "rounded-full border-[#E8E6F8] text-[#7B75A8] hover:bg-[#F0EEFF] hover:text-[#5E50C8] bg-white"
                }
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(({ value, label, icon: Icon, accent, bg }) => (
            <Card
              key={label}
              className="border-[#E8E6F8] bg-white shadow-[0_2px_12px_rgba(94,80,200,0.07)] rounded-2xl"
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`${bg} p-3 rounded-xl`}>
                  <Icon className={`${accent}`} size={22} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#2D2B4E]">{value}</p>
                  <p className="text-xs text-[#9B93D8]">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Two-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

          {/* ── LEFT: Departments ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#2D2B4E]">Departments</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#5E50C8] hover:bg-[#F0EEFF] text-xs font-medium"
              >
                View all <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>

            <div className="space-y-3">
              {filteredDepts.length === 0 ? (
                <Card className="border-[#E8E6F8] bg-white rounded-2xl">
                  <CardContent className="py-10 text-center text-[#9B93D8] text-sm">
                    No departments found.
                  </CardContent>
                </Card>
              ) : (
                filteredDepts.map(({ icon, name, meta, accent, light, text }) => (
                  <Card
                    key={name}
                    className="border-[#E8E6F8] bg-white shadow-[0_2px_8px_rgba(94,80,200,0.06)] rounded-2xl hover:shadow-[0_4px_16px_rgba(94,80,200,0.12)] transition-shadow cursor-pointer group overflow-hidden"
                  >
                    <CardContent className="flex items-center gap-4 p-4 relative">
                      {/* Accent bar */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accent} rounded-l-2xl`} />

                      <div className={`${light} p-2.5 rounded-xl ml-2`}>
                        <span className="text-xl">{icon}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#2D2B4E] text-sm">{name}</p>
                        <p className="text-xs text-[#9B93D8] mt-0.5">{meta}</p>
                      </div>

                      <ChevronRight
                        size={18}
                        className={`${text} opacity-0 group-hover:opacity-100 transition-opacity shrink-0`}
                      />
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* ── RIGHT: Quick Info ── */}
          <div className="space-y-4">

            {/* Academic Calendar */}
            <Card className="border-[#E8E6F8] bg-white shadow-[0_2px_12px_rgba(94,80,200,0.07)] rounded-2xl">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-[#2D2B4E] flex items-center gap-2">
                  📅 Academic Calendar
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-2.5">
                {CALENDAR.map(({ label, date, dot }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
                      <span className="text-xs text-[#7B75A8]">{label}</span>
                    </div>
                    <span className="text-xs font-medium text-[#2D2B4E]">{date}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* CGPA Overview */}
            <Card className="border-[#E8E6F8] bg-white shadow-[0_2px_12px_rgba(94,80,200,0.07)] rounded-2xl">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-[#2D2B4E]">
                  📊 CGPA Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#7B75A8]">Current CGPA</span>
                  <span className="text-xs font-semibold text-[#5E50C8]">8.4 / 10</span>
                </div>
                <Progress
                  value={84}
                  className="h-2 bg-[#F0EEFF] [&>div]:bg-[#5E50C8] rounded-full"
                />
                <p className="text-[11px] text-[#9B93D8]">
                  Rank: 12 / 180 &nbsp;·&nbsp; Credits: 96 / 120
                </p>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="border-[#E8E6F8] bg-white shadow-[0_2px_12px_rgba(94,80,200,0.07)] rounded-2xl">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-[#2D2B4E]">
                  📁 Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                {RESOURCES.map(({ icon: Icon, label, tag }) => (
                  <div key={label} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Icon size={14} className="text-[#9B93D8] group-hover:text-[#5E50C8] transition-colors" />
                      <span className="text-xs text-[#2D2B4E] group-hover:text-[#5E50C8] transition-colors">
                        {label}
                      </span>
                    </div>
                    <Badge className="bg-[#F0EEFF] text-[#5E50C8] hover:bg-[#E8E6F8] text-[10px] px-2 py-0.5 rounded-full border-none">
                      {tag}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>
        </div>

        {/* ── Ask ChatBot Banner ── */}
        <Card className="border-none bg-[#5E50C8] shadow-[0_4px_24px_rgba(94,80,200,0.35)] rounded-2xl overflow-hidden">
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <MessageCircle className="text-white" size={22} />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">
                  Have a question about academics?
                </p>
                <p className="text-[#C4BEFF] text-xs mt-0.5">
                  Ask ChatBot — get instant answers about courses, departments & more
                </p>
              </div>
            </div>
            <Button className="bg-white text-[#5E50C8] hover:bg-[#F0EEFF] font-semibold text-sm rounded-full px-5 shadow-none shrink-0">
              Ask ChatBot →
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}