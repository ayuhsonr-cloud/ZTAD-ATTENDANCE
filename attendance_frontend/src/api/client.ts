import type {
  AttendanceCorrectionInput,
  AttendanceRecord,
  AttendanceResponse,
  AttendanceSettings,
  ClockInInput,
  CreateStudentInput,
  SettingsInput,
  Student,
  UpdateStudentInput,
} from './types'

 const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...requestOptions } = options
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: {
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
  })

  const payload = response.status === 204
    ? null
    : await response.json().catch(() => null) as unknown

  if (!response.ok) {
    const message = isErrorPayload(payload)
      ? payload.error
      : `The server returned ${response.status}.`
    throw new ApiError(message, response.status)
  }

  return payload as T
}

function isErrorPayload(payload: unknown): payload is { error: string } {
  return typeof payload === 'object'
    && payload !== null
    && 'error' in payload
    && typeof payload.error === 'string'
}

function queryString(values: Record<string, string | undefined>): string {
  const params = new URLSearchParams()

  Object.entries(values).forEach(([key, value]) => {
    if (value) params.set(key, value)
  })

  const query = params.toString()
  return query ? `?${query}` : ''
}

export const api = {
  getStudents(search = ''): Promise<Student[]> {
    return request(`/students${queryString({ search })}`)
  },

  createStudent(student: CreateStudentInput): Promise<Student> {
    return request('/students', { method: 'POST', body: student })
  },

  updateStudent(studentId: string, student: UpdateStudentInput): Promise<Student> {
    return request(`/students/${studentId}`, { method: 'PUT', body: student })
  },

  deleteStudent(studentId: string): Promise<void> {
    return request(`/students/${studentId}`, { method: 'DELETE' })
  },

  getAttendance(date: string, search = ''): Promise<AttendanceResponse> {
    return request(`/attendance${queryString({ date, search })}`)
  },

  clockIn(input: ClockInInput): Promise<AttendanceRecord> {
    return request('/attendance/clock-in', { method: 'POST', body: input })
  },

  clockOut(attendanceId: string, clockOut: string): Promise<AttendanceRecord> {
    return request(`/attendance/${attendanceId}/clock-out`, {
      method: 'PUT',
      body: { clockOut },
    })
  },

  correctAttendance(
    attendanceId: string,
    input: AttendanceCorrectionInput,
  ): Promise<AttendanceRecord> {
    return request(`/attendance/${attendanceId}`, { method: 'PUT', body: input })
  },

  removeAttendance(attendanceId: string): Promise<void> {
    return request(`/attendance/${attendanceId}`, { method: 'DELETE' })
  },

  getSettings(): Promise<AttendanceSettings> {
    return request('/settings')
  },

  updateSettings(settings: SettingsInput): Promise<AttendanceSettings> {
    return request('/settings', { method: 'PUT', body: settings })
  },
}