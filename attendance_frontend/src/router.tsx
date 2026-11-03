import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { AppLayout } from './components/AppLayout'
import { AttendancePage } from './features/attendance/AttendancePage'
import { StudentsPage } from './features/students/StudentsPage'

const rootRoute = createRootRoute({ component: AppLayout })

const attendanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AttendancePage,
})

const studentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/students',
  component: StudentsPage,
})

const routeTree = rootRoute.addChildren([attendanceRoute, studentsRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}