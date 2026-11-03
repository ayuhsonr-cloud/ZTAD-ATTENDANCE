import { useState, type FormEvent } from 'react'
import { Link } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../api/client'
import type { AttendanceRecord, Student } from '../../api/types'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Modal } from '../../components/Modal'
import { SearchIcon } from '../../components/SearchIcon'
import { getLocalDate, getLocalTime } from '../../utils/dateTime'
import { SettingsModal } from './SettingsModal'

type AttendanceDialog =
  | { type: 'clock-in'; student: Student | null }
  | { type: 'clock-out'; student: Student; record: AttendanceRecord }
  | { type: 'correct'; student: Student; record: AttendanceRecord }

export function AttendancePage() {
  const queryClient = useQueryClient()
  const [date, setDate] = useState(getLocalDate)
  const [search, setSearch] = useState('')
  const [dialog, setDialog] = useState<AttendanceDialog | null>(null)
  const [confirmingRemove, setConfirmingRemove] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const attendance = useQuery({
    queryKey: ['attendance', date, search],
    queryFn: () => api.getAttendance(date, search),
    enabled: Boolean(date),
  })

  const settings = useQuery({
    queryKey: ['settings'],
    queryFn: api.getSettings,
  })

  const students = useQuery({
    queryKey: ['students'],
    queryFn: () => api.getStudents(),
  })

  const refreshAttendance = () => queryClient.invalidateQueries({ queryKey: ['attendance'] })

  const clockIn = useMutation({
    mutationFn: api.clockIn,
    onSuccess: async () => {
      setDialog(null)
      await refreshAttendance()
    },
  })

  const clockOut = useMutation({
    mutationFn: ({ attendanceId, time }: { attendanceId: string; time: string }) =>
      api.clockOut(attendanceId, time),
    onSuccess: async () => {
      setDialog(null)
      await refreshAttendance()
    },
  })

  const correctAttendance = useMutation({
    mutationFn: ({
      attendanceId,
      clockIn: start,
      clockOut: end,
    }: {
      attendanceId: string
      clockIn: string
      clockOut: string
    }) => api.correctAttendance(attendanceId, { clockIn: start, clockOut: end || null }),
    onSuccess: async () => {
      setDialog(null)
      await refreshAttendance()
    },
  })

  const removeAttendance = useMutation({
    mutationFn: api.removeAttendance,
    onSuccess: async () => {
      setConfirmingRemove(false)
      setDialog(null)
      await refreshAttendance()
    },
  })

  const rows = attendance.data?.rows ?? []
  const activeStudents = (students.data ?? []).filter((student) => student.status === 'active')

  function submitClockIn(event: FormEvent<HTMLFormElement>, student: Student | null) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    clockIn.mutate({
      studentId: student?.studentId ?? String(form.get('studentId') ?? ''),
      date,
      clockIn: String(form.get('clockIn') ?? ''),
    })
  }

  function submitClockOut(event: FormEvent<HTMLFormElement>, record: AttendanceRecord) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    clockOut.mutate({
      attendanceId: record.attendanceId,
      time: String(form.get('clockOut') ?? ''),
    })
  }

  function submitCorrection(event: FormEvent<HTMLFormElement>, record: AttendanceRecord) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    correctAttendance.mutate({
      attendanceId: record.attendanceId,
      clockIn: String(form.get('clockIn') ?? ''),
      clockOut: String(form.get('clockOut') ?? ''),
    })
  }

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">Daily register</p>
        <h1>Attendance</h1>
        <p>Record and review attendance for the selected date.</p>
      </section>

      {attendance.data ? <p className="notice" aria-live="polite">{attendance.data.notice}</p> : null}
      <ErrorBanner error={attendance.error} />

      <section className="panel" aria-label="Attendance register">
        <div className="toolbar">
          <div className="toolbar-filters">
            <label className="inline-field">
              <span>Date</span>
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            </label>
            <label className="search-field">
              <SearchIcon />
              <span className="sr-only">Search attendance</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search students"
              />
            </label>
          </div>
          <div className="toolbar-actions">
            <button
              type="button"
              onClick={() => {
                clockIn.reset()
                setDialog({ type: 'clock-in', student: null })
              }}
            >
              Clock in
            </button>
            <button className="secondary-button" type="button" onClick={() => setSettingsOpen(true)}>
              Settings
            </button>
          </div>
        </div>

        {attendance.isPending ? <p className="loading-state">Loading attendance…</p> : null}

        {!attendance.isPending && !attendance.error ? (
          <div className="table-wrap" tabIndex={0}>
            <table>
              <caption>{rows.length} active {rows.length === 1 ? 'student' : 'students'}</caption>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Student</th>
                  <th scope="col">Track</th>
                  <th scope="col">Status</th>
                  <th scope="col">Clock in</th>
                  <th scope="col">Clock out</th>
                  <th scope="col">Total</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const record = row.record

                  return (
                    <tr key={row.student.studentId}>
                    <td>{String(index + 1).padStart(3, '0')}</td>
                    <td>{row.student.fullNames}</td>
                    <td className="capitalize">{row.student.track}</td>
                    <td>
                      <span className={`status-pill ${row.status === 'Currently in' ? 'status-green' : row.status === 'Not clocked in' ? 'status-red' : ''}`}>
                        {row.status}
                      </span>
                    </td>
                    <td>{record?.clockIn || '—'}</td>
                    <td>{record?.clockOut || '—'}</td>
                    <td>{row.total}</td>
                    <td>
                      {!record ? (
                        <button
                          className="table-action"
                          type="button"
                          onClick={() => {
                            clockIn.reset()
                            setDialog({ type: 'clock-in', student: row.student })
                          }}
                        >
                          Clock in
                        </button>
                      ) : !record.clockOut ? (
                        <>
                          <button
                            className="table-action"
                            type="button"
                            onClick={() => setDialog({ type: 'clock-out', student: row.student, record })}
                          >
                            Clock out
                          </button>
                          <button
                            className="table-action"
                            type="button"
                            onClick={() => setDialog({ type: 'correct', student: row.student, record })}
                          >
                            Edit
                          </button>
                        </>
                      ) : (
                        <button
                          className="table-action"
                          type="button"
                          onClick={() => setDialog({ type: 'correct', student: row.student, record })}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {rows.length === 0 ? (
              <div className="table-empty">
                <strong>No students to show</strong>
                <span>Add an active student or clear the search.</span>
                <Link className="empty-state-action" to="/students">Manage students</Link>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      {dialog?.type === 'clock-in' ? (
        <Modal
          title="Clock in student"
          description={dialog.student ? `${dialog.student.fullNames} on ${date}` : `Choose a student for ${date}.`}
          onClose={() => setDialog(null)}
        >
          <form className="modal-form" onSubmit={(event) => submitClockIn(event, dialog.student)}>
            {!dialog.student ? (
              <label className="form-field">
                Student
                <select name="studentId" defaultValue="" required autoFocus>
                  <option value="" disabled>Select a student</option>
                  {activeStudents.map((student) => (
                    <option key={student.studentId} value={student.studentId}>{student.fullNames}</option>
                  ))}
                </select>
              </label>
            ) : null}
            <label className="form-field">
              Clock-in time
              <input
                name="clockIn"
                type="time"
                defaultValue={getLocalTime()}
                autoFocus={Boolean(dialog.student)}
                required
              />
            </label>
            <ErrorBanner error={clockIn.error || (!dialog.student ? students.error : null)} />
            {!dialog.student && !students.isPending && activeStudents.length === 0 ? (
              <p className="form-hint">There are no active students to clock in.</p>
            ) : null}
            <div className="dialog-actions">
              <button className="secondary-button" type="button" onClick={() => setDialog(null)}>Cancel</button>
              <button
                type="submit"
                disabled={clockIn.isPending || (!dialog.student && activeStudents.length === 0)}
              >
                {clockIn.isPending ? 'Saving…' : 'Clock in'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {dialog?.type === 'clock-out' ? (
        <Modal title="Clock out student" description={dialog.student.fullNames} onClose={() => setDialog(null)}>
          <form className="modal-form" onSubmit={(event) => submitClockOut(event, dialog.record)}>
            <label className="form-field">
              Clock-out time
              <input name="clockOut" type="time" defaultValue={getLocalTime()} required />
            </label>
            <ErrorBanner error={clockOut.error} />
            <div className="dialog-actions">
              <button className="secondary-button" type="button" onClick={() => setDialog(null)}>Cancel</button>
              <button type="submit" disabled={clockOut.isPending}>
                {clockOut.isPending ? 'Saving…' : 'Clock out'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {dialog?.type === 'correct' ? (
        <Modal
          title="Correct attendance"
          description={`${dialog.student.fullNames} on ${date}`}
          onClose={() => setDialog(null)}
        >
          <form className="modal-form" onSubmit={(event) => submitCorrection(event, dialog.record)}>
            <label className="form-field">
              Clock-in time
              <input name="clockIn" type="time" defaultValue={dialog.record.clockIn} required />
            </label>
            <label className="form-field">
              Clock-out time
              <input name="clockOut" type="time" defaultValue={dialog.record.clockOut || ''} />
            </label>
            <ErrorBanner error={correctAttendance.error} />
            <div className="dialog-actions split-actions">
              <button
                className="danger-button"
                type="button"
                disabled={removeAttendance.isPending}
                onClick={() => {
                  removeAttendance.reset()
                  setConfirmingRemove(true)
                }}
              >
                Remove
              </button>
              <span className="action-spacer" />
              <button className="secondary-button" type="button" onClick={() => setDialog(null)}>Cancel</button>
              <button type="submit" disabled={correctAttendance.isPending}>
                {correctAttendance.isPending ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {dialog?.type === 'correct' && confirmingRemove ? (
        <Modal
          title="Remove attendance record?"
          description="This action cannot be undone."
          onClose={() => setConfirmingRemove(false)}
        >
          <form
            className="modal-form"
            onSubmit={(event) => {
              event.preventDefault()
              removeAttendance.mutate(dialog.record.attendanceId)
            }}
          >
            <p className="confirmation-message">
              Remove {dialog.student.fullNames}’s attendance record for {date}?
            </p>
            <ErrorBanner error={removeAttendance.error} />
            <div className="dialog-actions">
              <button className="secondary-button" type="button" onClick={() => setConfirmingRemove(false)}>
                Cancel
              </button>
              <button className="danger-button" type="submit" disabled={removeAttendance.isPending}>
                {removeAttendance.isPending ? 'Removing…' : 'Remove record'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {settingsOpen ? (
        <SettingsModal
          settings={settings.data}
          error={settings.error}
          onClose={() => setSettingsOpen(false)}
        />
      ) : null}
    </>
  )
}

