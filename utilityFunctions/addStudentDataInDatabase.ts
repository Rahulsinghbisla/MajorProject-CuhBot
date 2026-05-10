import { addStudentData, StudentData } from "@/utilityFunctions/addStudents";
import { studentsDatabase } from "./studentData";


async function processAllStudents() {
  console.log("Starting to add students to the database...");

  // Use a for...of loop to handle async/await cleanly for each record
  for (const rawStudent of studentsDatabase) {
    
    // 1. Map the snake_case data to your StudentData camelCase interface
    const formattedData: StudentData = {
      roll: rawStudent.roll,
      studentName: rawStudent.student_name,
      pendingFee: rawStudent.pending_fee,
      bookIssuedDate: rawStudent.book_issued_date,
      bookIssuedDueDate: rawStudent.book_issued_due_date,
      noOfBookIssued: rawStudent.no_of_book_issued,
      studentsMarksObtain: rawStudent.students_marks_obtain,
      assignmentMarks: rawStudent.assignment_marks,
    };

  
    try {
      await addStudentData({ data: formattedData });
      console.log(`✅ Finished processing: ${formattedData.studentName}`);
    } catch (error) {
      console.error(`❌ Error processing ${formattedData.studentName}:`, error);
      // It's usually best not to 'throw' here so one bad record doesn't stop the whole loop
    }
  }

  console.log("All student processing completed!");
}

// Run the function to process all students
// processAllStudents();

// npx tsx --env-file=.env ./utilityFunctions/addStudentDataInDatabase.ts