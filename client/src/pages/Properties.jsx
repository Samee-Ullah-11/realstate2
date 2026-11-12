import { useSearchParams } from 'react-router-dom'
import { useApi } from '../api'
import { capitalize } from '../format'
import { TYPES } from '../site'
import { PropertyGrid } from '../components/PropertyCard'
import Status from '../components/Status'

export default function Properties() {
  // The filters live in the page address (?purpose=rent&area=...), so results can be shared and bookmarked.
  const [params, setParams] = useSearchParams()
  const areas = useApi('/properties/areas')
  const { data, ...status } = useApi(`/properties?${params}`)

  function update(changes) {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(changes)) value ? next.set(key, value) : next.delete(key)
    if (!('page' in changes)) next.delete('page') // a new filter starts again from page 1
    setParams(next)
  }

  const select = (name, label, options) => (
    <div>
      <label className="label" htmlFor={`f-${name}`}>{label}</label>
      <select
        id={`f-${name}`}
        className="field"
        value={params.get(name) ?? ''}
        onChange={(e) => update({ [name]: e.target.value })}
      >
        <option value="">Any</option>
        {options.map(([value, text]) => (
          <option key={value} value={value}>{text}</option>
        ))}
      </select>
    </div>
  )

  const purpose = params.get('purpose')
  const heading = purpose === 'rent' ? 'Properties for rent' : purpose === 'sale' ? 'Properties for sale' : 'All properties'

  return (
    <section className="container-page pt-10">
      <h1 className="text-3xl font-medium">{heading}</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl bg-sand p-4 md:grid-cols-4">
        {select('purpose', 'Buy or rent', [['sale', 'Buy'], ['rent', 'Rent']])}
        {select('type', 'Property type', TYPES.map((t) => [t, capitalize(t)]))}
        {select('area', 'Area', (areas.data ?? []).map((a) => [a.area, a.area]))}
        {select('beds', 'Bedrooms', [1, 2, 3, 4, 5].map((n) => [n, `${n}+`]))}
        <form
          key={params.toString()} // refill the boxes when the address changes
          className="col-span-2 grid grid-cols-2 gap-3 md:col-span-4 md:grid-cols-[1fr_1fr_auto_auto]"
          onSubmit={(e) => {
            e.preventDefault()
            update(Object.fromEntries(new FormData(e.currentTarget)))
          }}
        >
          <div>
            <label className="label" htmlFor="f-q">Keyword</label>
            <input id="f-q" name="q" defaultValue={params.get('q') ?? ''} placeholder="Title, area or address" className="field" />
          </div>
          <div>
            <label className="label" htmlFor="f-max">Max price (PKR)</label>
            <input id="f-max" name="maxPrice" type="number" min="0" defaultValue={params.get('maxPrice') ?? ''} className="field" />
          </div>
          <button className="btn btn-dark self-end">Apply</button>
          <button type="button" className="btn btn-outline self-end" onClick={() => setParams({})}>
            Clear
          </button>
        </form>
      </div>

      <Status {...status} />
      {data && (
        <>
          <p className="mt-6 text-sm text-charcoal/60" role="status">
            {data.total} {data.total === 1 ? 'property' : 'properties'} found
          </p>
          <div className="mt-4">
            <PropertyGrid items={data.items} />
          </div>
          {data.total === 0 && (
            <p className="py-10 text-center text-charcoal/60">No properties match these filters. Try clearing some.</p>
          )}
          {data.pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4 text-sm">
              <button className="btn btn-outline" disabled={data.page <= 1} onClick={() => update({ page: data.page - 1 })}>
                Previous
              </button>
              Page {data.page} of {data.pages}
              <button className="btn btn-outline" disabled={data.page >= data.pages} onClick={() => update({ page: data.page + 1 })}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
