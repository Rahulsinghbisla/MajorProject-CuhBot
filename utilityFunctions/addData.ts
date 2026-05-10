import { addStudentData, StudentData } from "@/lib/addStudents";

// Assuming addStudentData and StudentData are imported or in the same file
// import { addStudentData, StudentData } from "./your-file-path"; 

export const studentsDatabase = [
  { roll: "240480", student_name: "Rahul Singh", pending_fee: 5000, book_issued_date: "2026-04-10", book_issued_due_date: "2026-05-10", no_of_book_issued: 2, students_marks_obtain: 85, assignment_marks: 18 },
  { roll: "240478", student_name: "Prem Singh", pending_fee: 0, book_issued_date: "2026-04-15", book_issued_due_date: "2026-05-15", no_of_book_issued: 1, students_marks_obtain: 92, assignment_marks: 20 },
  { roll: "240512", student_name: "Raman Dahiya", pending_fee: 12000, book_issued_date: "2026-05-01", book_issued_due_date: "2026-06-01", no_of_book_issued: 3, students_marks_obtain: 76, assignment_marks: 15 },
  { roll: "240496", student_name: "Kirti", pending_fee: 0, book_issued_date: "2026-04-20", book_issued_due_date: "2026-05-20", no_of_book_issued: 0, students_marks_obtain: 88, assignment_marks: 19 },
  { roll: "240497", student_name: "Manvee", pending_fee: 2500, book_issued_date: "2026-04-05", book_issued_due_date: "2026-05-05", no_of_book_issued: 4, students_marks_obtain: 65, assignment_marks: 14 },
  { roll: "240482", student_name: "Ram singh", pending_fee: 0, book_issued_date: "2026-05-02", book_issued_due_date: "2026-06-02", no_of_book_issued: 1, students_marks_obtain: 95, assignment_marks: 20 },
  { roll: "240516", student_name: "Hemant", pending_fee: 8000, book_issued_date: null, book_issued_due_date: null, no_of_book_issued: 0, students_marks_obtain: 72, assignment_marks: 16 },
  { roll: "240464", student_name: "Aditya Kumar", pending_fee: 1500, book_issued_date: "2026-04-25", book_issued_due_date: "2026-05-25", no_of_book_issued: 2, students_marks_obtain: 81, assignment_marks: 17 },
  { roll: "240467", student_name: "Anshuman Pandey", pending_fee: 0, book_issued_date: "2026-04-12", book_issued_due_date: "2026-05-12", no_of_book_issued: 1, students_marks_obtain: 89, assignment_marks: 18 },
  { roll: "240489", student_name: "Sanket Malvi", pending_fee: 4500, book_issued_date: "2026-05-03", book_issued_due_date: "2026-06-03", no_of_book_issued: 3, students_marks_obtain: 78, assignment_marks: 15 }
];

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

    // 2. Call your existing function, wrapping formattedData inside an object 
    // to match your function signature: { data: StudentData }
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


processAllStudents();

