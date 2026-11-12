import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, useApi } from '../../api'
import Status from '../../components/Status'

export default function Enquiries() {
  const { data, reload, ...status } = useApi('/enquiries')
  const [error, setError] = useState('')

  async function act(path, options) {
    try {
      await api(path, options)
      setError('')
      reload()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <h1 className="text-2xl font-medium">Enquiries{data && ` (${data.filter((e) => !e.read).length} unread)`}</h1>
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      <Status {...status} />
      {data?.length === 0 && <p className="mt-6 text-sm text-charcoal/60">No enquiries yet.</p>}
      <ul className="mt-6 space-y-3">
        {data?.map((e) => (
          <li key={e._id} className={`rounded-2xl border p-5 ${e.read ? 'border-charcoal/10 opacity-70' : 'border-gold'}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-medium">
                {e.name} · <a href={`tel:${e.phone}`} className="hover:underline">{e.phone}</a>
                {!e.read && <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-xs">New</span>}
              </p>
              <time className="text-xs text-charcoal/60">{new Date(e.createdAt).toLocaleString()}</time>
            </div>
            {e.property && (
              <p className="mt-1 text-xs text-charcoal/60">
                About: <Link to={`/properties/${e.property._id}`} className="underline">{e.property.title}</Link>
              </p>
            )}
            {e.message && <p className="mt-2 text-sm whitespace-pre-line">{e.message}</p>}
            <div className="mt-3 flex gap-4 text-sm font-medium">
              <button onClick={() => act(`/enquiries/${e._id}`, { method: 'PATCH', body: { read: !e.read } })} className="hover:underline">
                Mark as {e.read ? 'unread' : 'read'}
              </button>
              <button
                onClick={() => window.confirm(`Delete the enquiry from ${e.name}?`) && act(`/enquiries/${e._id}`, { method: 'DELETE' })}
                className="text-red-700 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
