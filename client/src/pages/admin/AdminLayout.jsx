import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { api, useApi } from '../../api'
import { Header } from '../../components/Layout'
import Status from '../../components/Status'

const links = [
  ['Listings', '/admin'],
  ['Enquiries', '/admin/enquiries'],
  ['Subscribers', '/admin/subscribers'],
  ['View site', '/'],
]

// Wraps every admin page: checks the login first, then shows the admin menu.
export default function AdminLayout() {
  const me = useApi('/auth/me')
  const navigate = useNavigate()

  if (me.loading) return <Status loading />
  if (me.error) return <Navigate to="/admin/login" replace />

  async function logout() {
    await api('/auth/logout', { method: 'POST' })
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen">
      <Header
        links={links}
        home="/admin"
        tag="Admin"
        action={<button onClick={logout} className="btn btn-dark">Log out</button>}
      />
      <main className="container-page py-8 sm:py-10">
        <Outlet />
      </main>
    </div>
  )
}
