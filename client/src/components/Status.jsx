// Shows "Loading…" or the error from useApi; renders nothing once data is ready.
export default function Status({ loading, error }) {
  if (loading) return <p className="py-10 text-center text-sm text-charcoal/60">Loading…</p>
  if (error) return <p role="alert" className="py-10 text-center text-sm text-red-700">{error}</p>
  return null
}
