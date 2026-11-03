import { useState, type SubmitEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../api/client'
import type {
  CreateStudentInput,
  Student,
  StudentStatus,
  Track,
} from '../../api/types'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Modal } from '../../components/Modal'
import { SearchIcon } from '../../components/SearchIcon'

type StudentDialog =
  | { type: 'add' }
  | { type: 'edit'; student: Student }
  | { type: 'delete'; student: Student }

export function StudentsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [dialog, setDialog] = useState<StudentDialog | null>(null)

  const students = useQuery({
    queryKey: ['students', search],
    queryFn: () => api.getStudents(search),
  })

  async function refreshStudentsAndAttendance() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['students'] }),
      queryClient.invalidateQueries({ queryKey: ['attendance'] }),
    ])
  }

  const addStudent = useMutation({
    mutationFn: api.createStudent,
    onSuccess: async () => {
      setDialog(null)
      await refreshStudentsAndAttendance()
    },
  })

  const editStudent = useMutation({
    mutationFn: ({ studentId, student }: { studentId: string; student: CreateStudentInput }) =>
      api.updateStudent(studentId, student),
    onSuccess: async () => {
      setDialog(null)
      await refreshStudentsAndAttendance()
    },
  })

  const deleteStudent = useMutation({
    mutationFn: api.deleteStudent,
    onSuccess: async () => {
      setDialog(null)
      await refreshStudentsAndAttendance()
    },
  })

  function openAddDialog() {
    addStudent.reset()
    setDialog({ type: 'add' })
  }

  function openEditDialog(student: Student) {
    editStudent.reset()
    setDialog({ type: 'edit', student })
  }

  function openDeleteDialog(student: Student) {
    deleteStudent.reset()
    setDialog({ type: 'delete', student })
  }

  function submitStudent(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const track = String(form.get('track'))
    const status = String(form.get('status'))

    if (!isTrack(track) || !isStudentStatus(status)) {
      return
    }

    const student: CreateStudentInput = {
      fullNames: String(form.get('fullNames') ?? '').trim(),
      track,
      status,
    }

    if (dialog?.type === 'edit') {
      editStudent.mutate({ studentId: dialog.student.studentId, student })
    } else {
      addStudent.mutate(student)
    }
  }

  function confirmDelete(event: SubmitEvent<HTMLFormElement>, studentId: string) {
    event.preventDefault()
    deleteStudent.mutate(studentId)
  }

  const rows = students.data ?? []
  const studentBeingEdited = dialog?.type === 'edit' ? dialog.student : null
  const isSaving = addStudent.isPending || editStudent.isPending

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">Roster</p>
        <h1>Students</h1>
        <p>Manage the students whose attendance is tracked.</p>
      </section>

      <ErrorBanner error={students.error} />

      <section className="panel" aria-label="Students">
        <div className="toolbar">
          <div className="toolbar-filters">
            <label className="search-field">
              <SearchIcon />
              <span className="sr-only">Search students</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search students"
              />
            </label>
          </div>
          <div className="toolbar-actions">
            <button type="button" onClick={openAddDialog}>Add student</button>
          </div>
        </div>

        {students.isPending ? <p className="loading-state">Loading students…</p> : null}
        {!students.isPending && !students.error ? (
          <div className="table-wrap" tabIndex={0}>
            <table>
              <caption>{rows.length} {rows.length === 1 ? 'student' : 'students'}</caption>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Student</th>
                  <th scope="col">Track</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((student, index) => (
                  <tr key={student.studentId}>
                    <td>{String(index + 1).padStart(3, '0')}</td>
                    <td>{student.fullNames}</td>
                    <td className="capitalize">{student.track}</td>
                    <td>
                      <span className={`status-pill ${student.status === 'active' ? 'status-green' : 'status-red'}`}>
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="table-action"
                        type="button"
                        onClick={() => openEditDialog(student)}
                      >
                        Edit
                      </button>
                      <button
                        className="table-action"
                        type="button"
                        onClick={() => openDeleteDialog(student)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 ? (
              <div className="table-empty">
                <strong>No students found</strong>
                <span>Add a student or clear the search to show the roster.</span>
                <button className="empty-state-action" type="button" onClick={openAddDialog}>
                  Add student
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      {dialog?.type === 'add' || dialog?.type === 'edit' ? (
        <Modal
          title={studentBeingEdited ? 'Edit student' : 'Add student'}
          description={studentBeingEdited
            ? 'Update this student’s name, track, or status.'
            : 'Create a student record in the backend.'}
          onClose={() => setDialog(null)}
        >
          <form className="modal-form" onSubmit={submitStudent}>
            <label className="form-field">
              Student name
              <input
                name="fullNames"
                type="text"
                defaultValue={studentBeingEdited?.fullNames ?? ''}
                autoFocus
                required
              />
            </label>
            <div className="form-grid">
              <label className="form-field">
                Track
                <select name="track" defaultValue={studentBeingEdited?.track ?? 'frontend'}>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                </select>
              </label>
              <label className="form-field">
                Status
                <select name="status" defaultValue={studentBeingEdited?.status ?? 'active'}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
            </div>
            <ErrorBanner error={studentBeingEdited ? editStudent.error : addStudent.error} />
            <div className="dialog-actions">
              <button className="secondary-button" type="button" onClick={() => setDialog(null)}>Cancel</button>
              <button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving…' : studentBeingEdited ? 'Save changes' : 'Add student'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {dialog?.type === 'delete' ? (
        <Modal
          title="Delete student?"
          description="This action cannot be undone."
          onClose={() => setDialog(null)}
        >
          <form
            className="modal-form"
            onSubmit={(event) => confirmDelete(event, dialog.student.studentId)}
          >
            <p className="confirmation-message">
              Delete <strong>{dialog.student.fullNames}</strong>? Their attendance records will also be deleted.
            </p>
            <ErrorBanner error={deleteStudent.error} />
            <div className="dialog-actions">
              <button className="secondary-button" type="button" onClick={() => setDialog(null)}>Cancel</button>
              <button className="danger-button" type="submit" disabled={deleteStudent.isPending}>
                {deleteStudent.isPending ? 'Deleting…' : 'Delete student'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  )
}

function isTrack(value: string): value is Track {
  return value === 'frontend' || value === 'backend'
}

function isStudentStatus(value: string): value is StudentStatus {
  return value === 'active' || value === 'inactive'
}