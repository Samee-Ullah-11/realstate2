import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, useApi } from '../../api'
import { capitalize, formatPrice } from '../../format'
import Status from '../../components/Status'

export default function Listings() {
  const [page, setPage] = useState(1)
  const { data, reload, ...status } = useApi(`/properties?limit=50&page=${page}`)
  const [error, setError] = useState('')

  async function remove(p) {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return
    try {
      await api(`/properties/${p._id}`, { method: 'DELETE' })
      setError('')
      reload()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-medium">Listings{data && ` (${data.total})`}</h1>
        <Link to="/admin/properties/new" className="btn btn-dark">Add property</Link>
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      <Status {...status} />
      {/* One row per listing. On a phone the details wrap under the title instead of running off screen. */}
      <ul className="mt-6 divide-y divide-charcoal/10 rounded-2xl border border-charcoal/10">
        {data?.items.map((p) => (
          <li key={p._id} className="flex flex-wrap items-center gap-x-6 gap-y-3 p-4 text-sm">
            <div className="flex min-w-0 flex-1 basis-64 items-center gap-3">
              <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-sand">
                {p.images[0] && <img src={p.images[0]} alt="" loading="lazy" className="size-full object-cover" />}
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">{p.title}</p>
                <p className="text-xs text-charcoal/60">
                  {capitalize(p.type)} for {p.purpose} · {p.area}
                  {p.featured && <span className="text-gold-dark"> · ★ Featured</span>}
                </p>
              </div>
            </div>
            <p className="font-semibold text-gold-dark md:w-40">{formatPrice(p.price, p.purpose)}</p>
            <p className="rounded-full bg-sand px-3 py-1 text-xs font-medium">{capitalize(p.status)}</p>
            <div className="ml-auto flex gap-4 font-medium">
              <Link to={`/admin/properties/${p._id}`} className="hover:underline">Edit</Link>
              <button onClick={() => remove(p)} className="text-red-700 hover:underline">Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {data?.pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4 text-sm">
          <button className="btn btn-outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          Page {page} of {data.pages}
          <button className="btn btn-outline" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </>
  )
}
