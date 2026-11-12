import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, useApi } from '../api'
import { reviews, site } from '../site'
import { PropertyGrid } from '../components/PropertyCard'
import Status from '../components/Status'

const HERO = 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1920&q=75'

function SearchBar({ areas }) {
  const navigate = useNavigate()
  const [purpose, setPurpose] = useState('sale')

  function submit(e) {
    e.preventDefault()
    const params = new URLSearchParams({ purpose })
    for (const [key, value] of new FormData(e.currentTarget)) if (value) params.set(key, value)
    navigate(`/properties?${params}`)
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-3 rounded-3xl bg-white p-3 shadow-xl ring-1 ring-charcoal/5 md:flex-row md:items-center md:rounded-full"
    >
      <div className="flex gap-1 rounded-full bg-sand p-1" role="group" aria-label="Buy or rent">
        {[['sale', 'Buy'], ['rent', 'Rent']].map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={purpose === value}
            onClick={() => setPurpose(value)}
            className={`flex-1 rounded-full px-4 py-1.5 text-sm font-medium ${purpose === value ? 'bg-white shadow-sm' : 'text-charcoal/60'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <select name="area" aria-label="Area" className="field md:w-44 md:border-0 md:focus:ring-0">
        <option value="">All areas</option>
        {areas.map((a) => (
          <option key={a.area}>{a.area}</option>
        ))}
      </select>
      <input
        name="q"
        aria-label="Keyword"
        placeholder="Search by title, area or address"
        className="field md:flex-1 md:rounded-full md:border-0 md:bg-sand"
      />
      <button className="btn btn-dark">Search properties</button>
    </form>
  )
}

const RING_CARDS = 14 // how many cards fit around the ring

function Reviews() {
  // The two real reviews plus a rating card, repeated to fill the ring.
  const cards = [...reviews, null]
  return (
    <section className="mt-16">
      <div className="container-page flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-2xl font-medium">What our clients say</h2>
        <a href={site.mapLink} target="_blank" rel="noreferrer" className="text-sm font-medium hover:text-gold-dark">
          ★ {site.rating} on Google ({site.reviews} reviews) →
        </a>
      </div>
      <div className="review-stage mt-4 h-72">
        <ul className="review-ring">
          {Array.from({ length: RING_CARDS }, (_, i) => {
            const review = cards[i % cards.length]
            return (
              <li
                key={i}
                aria-hidden={i >= cards.length} // repeats are decoration; screen readers hear each review once
                className="review-card flex flex-col rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm"
                style={{ '--angle': `${(360 / RING_CARDS) * i}deg` }}
              >
                {review ? (
                  <>
                    <p className="text-gold" aria-label="5 out of 5 stars">★★★★★</p>
                    <p className="mt-2 line-clamp-4 text-sm leading-relaxed">“{review.text}”</p>
                    <p className="mt-auto text-sm font-medium">{review.name}</p>
                    <p className="text-xs text-charcoal/60">Google review · {review.when}</p>
                  </>
                ) : (
                  <div className="m-auto text-center">
                    <p className="text-4xl font-medium">{site.rating}</p>
                    <p className="text-gold">★★★★★</p>
                    <p className="mt-1 text-xs text-charcoal/60">Rated on Google</p>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function StayInTheLoop() {
  const [status, setStatus] = useState({}) // { sending } | { sent } | { error }

  async function submit(e) {
    e.preventDefault()
    setStatus({ sending: true })
    try {
      await api('/subscribers', { method: 'POST', body: Object.fromEntries(new FormData(e.currentTarget)) })
      setStatus({ sent: true })
    } catch (err) {
      setStatus({ error: err.message })
    }
  }

  return (
    <section className="container-page mt-16">
      <div className="rounded-3xl bg-charcoal px-6 py-10 text-center text-white sm:px-10 sm:py-14">
        <h2 className="text-2xl font-medium sm:text-3xl">Stay in the loop</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/70">
          Get new listings and price updates from {site.name} in your inbox.
        </p>
        {status.sent ? (
          <p role="status" className="mt-6 font-medium text-gold">Thank you. You are on the list.</p>
        ) : (
          <form onSubmit={submit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="loop-email">Email address</label>
            <input
              id="loop-email"
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              placeholder="Your email address"
              className="field rounded-full text-charcoal sm:flex-1"
            />
            <button className="btn btn-gold" disabled={status.sending}>
              {status.sending ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
        )}
        {status.error && <p role="alert" className="mt-3 text-sm text-red-300">{status.error}</p>}
      </div>
    </section>
  )
}

export default function Home() {
  const areas = useApi('/properties/areas')
  const featured = useApi('/properties?featured=true&limit=6')

  return (
    <>
      {/* On desktop the hero is exactly one screen tall (minus the 4rem header) and runs almost edge to edge.
          The text sits over the sky, which fades to white, and the search bar sits over the lawn,
          so the houses in between stay fully visible. On phones text, photo and search stack. */}
      <section className="flex flex-col px-4 pt-6 md:h-[calc(100svh-4rem)] md:min-h-[30rem] md:px-3 md:pt-3 md:pb-3">
        <div className="relative md:min-h-0 md:flex-1">
          <div className="relative z-10 mx-auto max-w-6xl md:px-6 md:pt-8">
            <p className="inline-block rounded-full bg-sand px-4 py-1.5 text-xs font-medium text-gold-dark">
              Property in Peshawar
            </p>
            <h1 className="mt-3 text-4xl font-medium tracking-tight lg:text-5xl">Find your next home in Peshawar</h1>
            <p className="mt-2 text-charcoal/80">
              Houses, plots, apartments and commercial property for sale and rent. Tell us what you need and we
              will help you find it.
            </p>
          </div>
          <img
            src={HERO}
            alt="A row of family houses with front lawns"
            className="mt-5 h-56 w-full rounded-3xl object-cover md:absolute md:inset-0 md:mt-0 md:h-full"
            fetchPriority="high"
          />
          <div className="absolute inset-x-0 top-0 hidden h-1/2 rounded-t-3xl bg-gradient-to-b from-white from-25% via-white/70 via-60% to-transparent md:block" />
          <div className="z-10 mt-4 md:absolute md:inset-x-0 md:bottom-5 md:mt-0">
            <div className="mx-auto max-w-6xl md:px-6">
              <SearchBar areas={areas.data ?? []} />
            </div>
          </div>
        </div>
      </section>

      <section className="container-page mt-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-medium">Explore top areas</h2>
          <p className="max-w-sm text-sm text-charcoal/70">
            Browse listings in the most sought-after parts of Peshawar.
          </p>
        </div>
        <Status {...areas} />
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {areas.data?.slice(0, 5).map((a) => (
            <Link
              key={a.area}
              to={`/properties?area=${encodeURIComponent(a.area)}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-charcoal"
            >
              {a.image && (
                <img
                  src={a.image}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover opacity-80 transition-transform duration-200 ease-out motion-safe:group-hover:scale-105"
                />
              )}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-10 text-white">
                <span className="block text-sm font-semibold tracking-wide uppercase">{a.area}</span>
                <span className="block text-xs text-white/80">
                  {a.count} {a.count === 1 ? 'listing' : 'listings'}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page mt-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium">Popular homes</h2>
          <Link to="/properties" className="text-sm font-medium hover:text-gold-dark">
            Explore all →
          </Link>
        </div>
        <Status {...featured} />
        <div className="mt-6">{featured.data && <PropertyGrid items={featured.data.items} />}</div>
      </section>

      <Reviews />

      <section className="container-page mt-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-sand p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-2xl font-medium">Looking to buy, rent or sell?</h2>
            <p className="mt-2 text-sm text-charcoal/70">
              Talk to {site.name} on University Road, Tehkal. Rated {site.rating} on Google.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={site.whatsapp} target="_blank" rel="noreferrer" className="btn btn-gold">
              WhatsApp us
            </a>
            <Link to="/contact" className="btn btn-outline">
              Contact
            </Link>
          </div>
        </div>
      </section>

      <StayInTheLoop />
    </>
  )
}
