import React from 'react';
import { User, Hash, GraduationCap, WalletCards, BookMarked, FileText, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

// 1. Updated interface to match Drizzle's camelCase output
export interface StudentDetailsProps {
  roll: string;
  studentName: string;         // changed from student_name
  pendingFee: number;          // changed from pending_fee
  bookIssuedDate: string | null;    // changed from book_issued_date
  bookIssuedDueDate: string | null; // changed from book_issued_due_date
  noOfBookIssued: number;      // changed from no_of_book_issued
  studentsMarksObtain: number; // changed from students_marks_obtain
  assignmentMarks: number;     // changed from assignment_marks
  // You can optionally add createdAt/updatedAt here if you ever want to show them
}

export function StudentDetailsCard(props: StudentDetailsProps) {
  // 2. Destructure using the new camelCase names
  const {
    roll, studentName, pendingFee, 
    bookIssuedDate, bookIssuedDueDate, noOfBookIssued, 
    studentsMarksObtain, assignmentMarks
  } = props;

  // 3. Update the logic checks
  const hasPendingDues = pendingFee > 0;
  const hasBooks = noOfBookIssued > 0;
  // Total marks calculation (if you want to use it later)
  const totalMarks = studentsMarksObtain + assignmentMarks;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-lg flex flex-col gap-5 font-sans min-w-[320px]">
      
      {/* --- HEADER: Profile --- */}
      <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
        <div className="bg-gradient-to-br from-emerald-100 to-teal-50 p-3 rounded-full border border-emerald-200">
          <User className="w-7 h-7 text-emerald-600" />
        </div>
        <div>
          {/* Updated variable name here */}
          <h3 className="text-slate-800 font-bold text-xl uppercase tracking-wide">{studentName}</h3>
          <p className="text-slate-500 text-sm flex items-center gap-1.5 font-medium mt-0.5">
            <Hash className="w-3.5 h-3.5" /> Roll: {roll}
          </p>
        </div>
      </div>

      {/* --- SECTION 1: Academics --- */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="flex items-center gap-2 mb-2 text-slate-500">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold uppercase tracking-wider">Exam</span>
          </div>
          {/* Updated variable name here */}
          <div className="text-2xl font-bold text-slate-800">{studentsMarksObtain}</div>
        </div>
        
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="flex items-center gap-2 mb-2 text-slate-500">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold uppercase tracking-wider">Assignment</span>
          </div>
          {/* Updated variable name here */}
          <div className="text-2xl font-bold text-slate-800">{assignmentMarks}</div>
        </div>
      </div>

      {/* --- SECTION 2: Finance & Library --- */}
      <div className="flex flex-col gap-3">
        
        {/* Fee Status */}
        <div className={`flex items-center justify-between p-3 rounded-lg border ${hasPendingDues ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <div className="flex items-center gap-3">
            <WalletCards className={`w-5 h-5 ${hasPendingDues ? 'text-red-500' : 'text-emerald-600'}`} />
            <span className="text-sm font-medium text-slate-700">Pending Fees</span>
          </div>
          <div className={`font-bold ${hasPendingDues ? 'text-red-600' : 'text-emerald-600'}`}>
            {/* Updated variable name here */}
            {hasPendingDues ? `₹${pendingFee}` : 'Cleared'}
          </div>
        </div>

        {/* Library Status */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
             <div className="flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Library Account</span>
             </div>
             <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2 py-1 rounded-md">
               {/* Updated variable name here */}
               {noOfBookIssued} {noOfBookIssued === 1 ? 'Book' : 'Books'}
             </span>
          </div>
          
          {hasBooks ? (
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> Issued:</span>
                {/* Updated variable name here */}
                <span className="text-slate-700">{bookIssuedDate}</span>
              </div>
              <div className="flex items-center justify-between text-amber-600 font-medium">
                <span className="flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5"/> Due Date:</span>
                {/* Updated variable name here */}
                <span>{bookIssuedDueDate}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-slate-500 py-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              No books currently issued.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}