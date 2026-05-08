type DaySchedule = { [time: string]: string };
type WeeklySchedule = { [day: string]: DaySchedule };

// Your existing data source
export const mcaFourthSemSchedule: Record<string, Record<string, string>> = {
  Monday: {
    "09:00": "WSNOIT by Dr. Suraj Arya",
    "10:00": "CD by Dr. Keshav Singh Rawat",
    "11:00": "DSR Theory by Dr. Priti Maratha",
    "12:00": "AADP Lab by Dr. Vinmarta",
    "13:00": "Lunch",
    "14:00": "DSR Lab by Dr. Priti Maratha",
    "15:00": "Major Project (MP)",
    "16:00": "Major Project (MP)"
  },
  Tuesday: {
    "09:00": "DSR Lab by Dr. Priti Maratha",
    "10:00": "WSNOIT by Dr. Suraj Arya",
    "11:00": "CD by Dr. Keshav Singh Rawat",
    "12:00": "DSR Theory by Dr. Priti Maratha",
    "13:00": "Lunch",
    "14:00": "AADP Lab by Dr. Vinmarta",
    "15:00": "Major Project (MP)",
    "16:00": "Major Project (MP)"
  },
  Wednesday: {
    "09:00": "AADP Lab by Dr. Vinmarta",
    "10:00": "DSR Lab by Dr. Priti Maratha",
    "11:00": "WSNOIT by Dr. Suraj Arya",
    "12:00": "CD by Dr. Keshav Singh Rawat",
    "13:00": "Lunch",
    "14:00": "DSR Theory by Dr. Priti Maratha",
    "15:00": "Major Project (MP)",
    "16:00": "Major Project (MP)"
  },
  Thursday: {
    "09:00": "DSR Theory by Dr. Priti Maratha",
    "10:00": "AADP Lab by Dr. Vinmarta",
    "11:00": "DSR Lab by Dr. Priti Maratha",
    "12:00": "WSNOIT by Dr. Suraj Arya",
    "13:00": "Lunch",
    "14:00": "CD by Dr. Keshav Singh Rawat",
    "15:00": "Major Project (MP)",
    "16:00": "Major Project (MP)"
  },
  Friday: {
    "09:00": "Major Project (MP)",
    "10:00": "Major Project (MP)",
    "11:00": "Major Project (MP)",
    "12:00": "Major Project (MP)",
    "13:00": "Lunch",
    "14:00": "Major Project (MP)",
    "15:00": "Major Project (MP)",
    "16:00": "Major Project (MP)"
  }
};

// The predefined list of campus locations
export const cuhLocations = [
  "wifi",
  "cafeteria",
  "Dispensary",
  "Vc House",
  "Admin",
  "Gate 1",
  "Gate 2",
  "New Girls Hostel",
  "Boys Hostel"
];

export const cuhFacilitiesData: Record<string, string> = {
  hostel: "CUH has multiple hostels including the Boys Hostel and New Girls Hostel. Facilities include 24x7 Wi-Fi, reading rooms, common rooms with TVs, and mess facilities providing daily meals.",
  library: "The Central Library is fully air-conditioned and automated. It offers a vast collection of books, journals, and digital resources with dedicated reading halls for students and scholars.",
  medical: "The University Dispensary provides primary health care facilities with a visiting medical officer, nursing staff, and an ambulance available 24x7 for emergencies.",
  transport: "Campus buses and e-rickshaws run continuously connecting Gate 1, Gate 2, Academic Blocks, Hostels, Admin Block, and the VC House for easy commuting within the campus.",
  food: "The campus features a central Cafeteria, hostel messes, and several tuck shops/kiosks serving hygienic food, snacks, and beverages.",
  it_infrastructure: "The entire campus is Wi-Fi enabled, providing high-speed internet access in academic blocks, hostels, and the library.",
  sports: "CUH offers various sports facilities including a cricket/football ground, basketball courts, volleyball courts, and indoor games facilities.",
  admin: "The Admin block handles all student queries related to admissions, examinations, and administrative work.",
  general: "Other facilities include a Bank/ATM on campus, a post office, and 24/7 security at Gate 1 and Gate 2."
};


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