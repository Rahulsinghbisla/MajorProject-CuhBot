CREATE TABLE "students" (
	"roll" text PRIMARY KEY NOT NULL,
	"student_name" text NOT NULL,
	"pending_fee" integer DEFAULT 0 NOT NULL,
	"book_issued_date" date,
	"book_issued_due_date" date,
	"no_of_book_issued" integer DEFAULT 0 NOT NULL,
	"students_marks_obtain" integer,
	"assignment_marks" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
