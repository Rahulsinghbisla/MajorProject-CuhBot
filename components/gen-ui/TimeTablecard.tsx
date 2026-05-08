import React from 'react';
import { CalendarDays, Clock, BookOpen, Coffee } from 'lucide-react';

export interface ClassSession {
  time: string;
  subject: string;
  isBreak?: boolean;
}

export interface TimetableProps {
  day: string;
  schedule: ClassSession[];
}

export function TimetableCard({ day, schedule }: TimetableProps) {
  // Edge case: No classes scheduled
  if (!schedule || schedule.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-3">
        <CalendarDays className="w-6 h-6 text-slate-400" />
        <p className="text-slate-500 text-sm">No classes scheduled for {day}.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden font-sans">
      
      {/* Header */}
      <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center gap-3">
        <div className="bg-blue-100 p-2 rounded-lg">
          <CalendarDays className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-slate-800 font-semibold text-lg">{day}</h3>
          <p className="text-slate-500 text-xs uppercase tracking-widest">MCA 4th Semester</p>
        </div>
      </div>

      {/* Schedule List */}
      <div className="p-3 flex flex-col gap-2">
        {schedule.map((session, index) => (
          <div 
            key={index} 
            className={`flex items-center gap-4 p-3 rounded-lg border ${
              session.isBreak 
                ? 'bg-amber-50 border-amber-200' 
                : 'bg-white border-slate-200 hover:bg-slate-50 transition-colors'
            }`}
          >
            {/* Time Column */}
            <div className="flex flex-col items-center justify-center min-w-[80px] border-r border-slate-200 pr-4">
              <Clock className={`w-4 h-4 mb-1 ${session.isBreak ? 'text-amber-500' : 'text-slate-400'}`} />
              <span className="text-xs font-medium text-slate-600">{session.time}</span>
            </div>

            {/* Subject Column */}
            <div className="flex items-center gap-3 flex-1">
              <div className={`p-1.5 rounded-md ${session.isBreak ? 'bg-amber-100' : 'bg-blue-100'}`}>
                {session.isBreak 
                  ? <Coffee className="w-4 h-4 text-amber-600" /> 
                  : <BookOpen className="w-4 h-4 text-blue-600" />}
              </div>
              <span className={`text-sm font-medium ${session.isBreak ? 'text-amber-700' : 'text-slate-800'}`}>
                {session.subject}
              </span>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}