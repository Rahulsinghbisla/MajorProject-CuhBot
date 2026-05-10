import { db } from "@/db";
import { studentDetails } from "@/db/schema/student-details";

export async function getAllStudents() {
  try {
    // Equivalent to SQL: SELECT * FROM studentDetails;
    const students = await db.select().from(studentDetails);
    return students;
    
  } catch (error) {
    console.error("Failed to fetch students:", error);
    throw new Error("Could not retrieve student data.");
  }
}

// console.log("Students are : ",getAllStudents());