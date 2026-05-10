import { pgTable, text, integer, date, timestamp } from "drizzle-orm/pg-core";

export const studentDetails = pgTable("students", {
  // Using 'roll' as the Primary Key since it serves as a unique identifier
  roll: text("roll").primaryKey(), 
  
  studentName: text("student_name").notNull(),
  
  // Using integer for numerical values. Added a default to prevent null errors.
  pendingFee: integer("pending_fee").notNull().default(0),
  
  // Using the 'date' type since your payload ("2026-04-10") represents a calendar date without time
  bookIssuedDate: date("book_issued_date"),
  bookIssuedDueDate: date("book_issued_due_date"),
  
  noOfBookIssued: integer("no_of_book_issued").notNull().default(0),
  
  // Marks can be nullable in case a student hasn't taken the exam/assignment yet
  studentsMarksObtain: integer("students_marks_obtain"),
  assignmentMarks: integer("assignment_marks"),

  // Keeping your automated lifecycle timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});



// command 
// npx tsx --env-file=.env .\utilityFunctions\addData.ts