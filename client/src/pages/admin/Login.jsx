import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api'
import { site } from '../../site'

export default function Login() {
  const navigate = useNavigate()
  const [status, setStatus] = useState({})

  async function submit(e) {
    e.preventDefault()
    setStatus({ busy: true })
    try {
      await api('/auth/login', { method: 'POST', body: Object.fromEntries(new FormData(e.currentTarget)) })
      navigate('/admin')
    } catch (err) {
      setStatus({ error: err.message })
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-sand px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-xl font-medium">{site.name} admin</h1>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="username" className="field" />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" className="field" />
        </div>
        {status.error && <p role="alert" className="text-sm text-red-700">{status.error}</p>}
        <button className="btn btn-dark w-full" disabled={status.busy}>
          {status.busy ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </div>
  )
}
