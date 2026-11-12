import { Link } from 'react-router-dom'
import { capitalize, formatPrice, specs } from '../format'

export default function PropertyCard({ property: p }) {
  return (
    <Link
      to={`/properties/${p._id}`}
      className="group block overflow-hidden rounded-2xl border border-charcoal/10 bg-white transition-shadow duration-200 ease-out hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        {p.images[0] && (
          <img
            src={p.images[0]}
            alt={p.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-200 ease-out motion-safe:group-hover:scale-105"
          />
        )}
        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium">
          For {p.purpose === 'rent' ? 'Rent' : 'Sale'}
        </span>
        {p.status !== 'available' && (
          <span className="absolute top-3 right-3 rounded-full bg-charcoal px-3 py-1 text-xs font-medium text-white">
            {capitalize(p.status)}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-charcoal/60">
          {capitalize(p.type)} · {p.area}
        </p>
        <h3 className="mt-1 truncate font-semibold">{p.title}</h3>
        <p className="mt-1 text-sm text-charcoal/60">{specs(p).join(' · ')}</p>
        <p className="mt-3 font-semibold text-gold-dark">{formatPrice(p.price, p.purpose)}</p>
      </div>
    </Link>
  )
}

export function PropertyGrid({ items }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <PropertyCard key={p._id} property={p} />
      ))}
    </div>
  )
}
