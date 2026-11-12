import { useEffect, useState } from 'react'

// Set VITE_API_URL when the API is hosted on a different address than the site.
const BASE = import.meta.env.VITE_API_URL ?? '/api'

// Calls the backend. Pass { method, body } to send data; body is sent as JSON.
export async function api(path, { body, ...options } = {}) {
  const res = await fetch(BASE + path, {
    credentials: 'include',
    ...options,
    ...(body && { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  })
  const data = await res.json().catch(() => ({}))
  // The admin login timed out: send them back to the login page.
  const { pathname } = window.location
  if (res.status === 401 && pathname.startsWith('/admin') && pathname !== '/admin/login') {
    window.location.assign('/admin/login')
  }
  if (!res.ok) throw new Error(data.message || 'Something went wrong. Please try again.')
  return data
}

// Loads data for a page: const { data, error, loading } = useApi('/properties')
export function useApi(path) {
  const [state, setState] = useState({ loading: true })
  const [tick, setTick] = useState(0) // reload() bumps this to fetch again
  useEffect(() => {
    let live = true // ignore the reply if the page moved on before it arrived
    setState({ loading: true })
    api(path).then(
      (data) => live && setState({ data }),
      (error) => live && setState({ error: error.message })
    )
    return () => {
      live = false
    }
  }, [path, tick])
  return { ...state, reload: () => setTick((t) => t + 1) }
}
