import { useState } from 'react'
import { api, useApi } from '../../api'
import Status from '../../components/Status'

// Emails collected by the "Stay in the loop" section on the home page.
export default function Subscribers() {
  const { data, reload, ...status } = useApi('/subscribers')
  const [error, setError] = useState('')

  async function remove(s) {
    if (!window.confirm(`Remove ${s.email} from the list?`)) return
    try {
      await api(`/subscribers/${s._id}`, { method: 'DELETE' })
      setError('')
      reload()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <h1 className="text-2xl font-medium">Subscribers{data && ` (${data.length})`}</h1>
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      <Status {...status} />
      {data?.length === 0 && <p className="mt-6 text-sm text-charcoal/60">No subscribers yet.</p>}
      {data?.length > 0 && (
        <ul className="mt-6 divide-y divide-charcoal/10 rounded-2xl border border-charcoal/10">
          {data.map((s) => (
            <li key={s._id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 p-4 text-sm">
              <a href={`mailto:${s.email}`} className="min-w-0 font-medium break-all hover:underline">{s.email}</a>
              <div className="flex items-center gap-4">
                <time className="text-xs text-charcoal/60">{new Date(s.createdAt).toLocaleDateString()}</time>
                <button onClick={() => remove(s)} className="font-medium text-red-700 hover:underline">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
