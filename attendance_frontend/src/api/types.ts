export type Track = 'frontend' | 'backend'
export type StudentStatus = 'active' | 'inactive'

export interface Student {
  studentId: string
  fullNames: string
  track: Track
  status: StudentStatus
}

export interface AttendanceRecord {
  attendanceId: string
  studentId: string
  date: string
  clockIn: string
  clockOut: string | null
}

export interface AttendanceRow {
  student: Student
  record: AttendanceRecord | null
  status: 'Not clocked in' | 'Currently in' | 'Completed'
  total: string
}

export interface AttendanceResponse {
  date: string
  isWorkingDay: boolean
  dayName: string
  notice: string
  rows: AttendanceRow[]
}

export interface AttendanceSettings {
  id: number
  workingDays: number[]
  openingTime: string
  closingTime: string
}

export interface CreateStudentInput {
  fullNames: string
  track: Track
  status: StudentStatus
}

export type UpdateStudentInput = CreateStudentInput

export interface ClockInInput {
  studentId: string
  date: string
  clockIn: string
}

export interface AttendanceCorrectionInput {
  clockIn: string
  clockOut: string | null
}

export type SettingsInput = Omit<AttendanceSettings, 'id'>