CREATE TYPE "public"."status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."track" AS ENUM('frontend', 'backend');--> statement-breakpoint
CREATE TABLE "attendance" (
	"attendance_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"date" date NOT NULL,
	"clock_in" text NOT NULL,
	"clock_out" text
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"working_days" jsonb DEFAULT '[0,1,2,3,4]'::jsonb NOT NULL,
	"opening_time" text DEFAULT '09:00' NOT NULL,
	"closing_time" text DEFAULT '17:00' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"student_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_names" text NOT NULL,
	"track" "track" NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_student_id_students_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("student_id") ON DELETE cascade ON UPDATE no action;