import type { FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../api/client'
import type { AttendanceSettings } from '../../api/types'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Modal } from '../../components/Modal'

const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

interface SettingsModalProps {
  settings: AttendanceSettings | undefined
  error: unknown
  onClose: () => void
}

export function SettingsModal({ settings, error, onClose }: SettingsModalProps) {
  const queryClient = useQueryClient()
  const update = useMutation({
    mutationFn: api.updateSettings,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['settings'] }),
        queryClient.invalidateQueries({ queryKey: ['attendance'] }),
      ])
      onClose()
    },
  })

  function submitSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    update.mutate({
      workingDays: form.getAll('workingDays').map(Number),
      openingTime: String(form.get('openingTime') ?? ''),
      closingTime: String(form.get('closingTime') ?? ''),
    })
  }

  return (
    <Modal
      title="Attendance settings"
      description="Choose working days and operating hours."
      onClose={onClose}
    >
      <ErrorBanner error={error || update.error} />
      {!settings ? (
        <p className="loading-state">Loading settings…</p>
      ) : (
        <form className="modal-form" onSubmit={submitSettings}>
          <fieldset className="weekday-group">
            <legend>Working days</legend>
            <div className="weekday-grid">
              {WEEKDAYS.map((weekday, index) => (
                <label key={weekday}>
                  <input
                    name="workingDays"
                    type="checkbox"
                    value={index}
                    defaultChecked={settings.workingDays.includes(index)}
                  />
                  {weekday.slice(0, 3)}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="form-grid">
            <label className="form-field">
              Opening time
              <input name="openingTime" type="time" defaultValue={settings.openingTime} required />
            </label>
            <label className="form-field">
              Closing time
              <input name="closingTime" type="time" defaultValue={settings.closingTime} required />
            </label>
          </div>
          <div className="dialog-actions">
            <button className="secondary-button" type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={update.isPending}>
              {update.isPending ? 'Saving…' : 'Save settings'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}