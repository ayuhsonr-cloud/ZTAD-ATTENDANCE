import { useState, type MouseEvent } from 'react'
import { Link, Outlet } from '@tanstack/react-router'

export function AppLayout() {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)

  function keepNavigationOpen(event: MouseEvent<HTMLElement>) {
    event.stopPropagation()
  }

  return (
    <>
      <header className="site-header">
        <Link className="brand" to="/">Student Attendance System</Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ 'aria-current': 'page' }}>
            Attendance
          </Link>
          <Link to="/students" activeProps={{ 'aria-current': 'page' }}>
            Students
          </Link>
        </nav>
        <button
          className="navigation-trigger"
          type="button"
          aria-label="Open navigation"
          aria-controls="mobile-navigation"
          aria-expanded={mobileNavigationOpen}
          onClick={() => setMobileNavigationOpen(true)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </header>

      {mobileNavigationOpen ? (
        <div
          className="navigation-backdrop"
          role="presentation"
          onMouseDown={() => setMobileNavigationOpen(false)}
        >
          <aside
            id="mobile-navigation"
            className="navigation-sheet react-navigation-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="navigation-title"
            onMouseDown={keepNavigationOpen}
          >
            <div className="sheet-header">
              <strong id="navigation-title">Navigation</strong>
              <button
                className="sheet-close"
                type="button"
                aria-label="Close navigation"
                onClick={() => setMobileNavigationOpen(false)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <nav className="sheet-nav" aria-label="Mobile navigation">
              <Link
                to="/"
                activeOptions={{ exact: true }}
                activeProps={{ 'aria-current': 'page' }}
                onClick={() => setMobileNavigationOpen(false)}
              >
                Attendance
              </Link>
              <Link
                to="/students"
                activeProps={{ 'aria-current': 'page' }}
                onClick={() => setMobileNavigationOpen(false)}
              >
                Students
              </Link>
            </nav>
          </aside>
        </div>
      ) : null}

      <main className="page-shell">
        <Outlet />
      </main>
    </>
  )
}