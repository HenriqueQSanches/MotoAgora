import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { HomePage } from './pages/HomePage/HomePage'
import { DashboardPage } from './pages/DashboardPage/DashboardPage'

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '*', element: <Navigate to="/" replace /> },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
