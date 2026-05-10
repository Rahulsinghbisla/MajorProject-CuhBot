import { db } from "@/db";
import { studentDetails } from "@/db/schema/student-details";

export interface StudentData {
  roll: string;
  studentName: string;
  pendingFee: number;
  bookIssuedDate?: string | null;
  bookIssuedDueDate?: string | null;
  noOfBookIssued: number;
  studentsMarksObtain?: number | null;
  assignmentMarks?: number | null;
}

export async function addStudentData({data}: {data: StudentData}) {
  try {
    const insertedStudent = await db.insert(studentDetails).values({
      roll: data.roll,
      studentName: data.studentName,
      pendingFee: data.pendingFee,
      bookIssuedDate: data.bookIssuedDate,
      bookIssuedDueDate: data.bookIssuedDueDate,
      noOfBookIssued: data.noOfBookIssued,
      studentsMarksObtain: data.studentsMarksObtain,
      assignmentMarks: data.assignmentMarks
    })
    .returning(); // .returning() asks Postgres to send back the row it just created

    console.log("Successfully inserted:", insertedStudent);
    return insertedStudent;
    
  } catch (error) {
    console.error("Error inserting student:", error);
    throw error;
  }
}