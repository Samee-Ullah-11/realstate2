import { Link } from 'react-router-dom'
import { site } from '../site'

const services = [
  ['Buying', 'Houses, plots, apartments and commercial property for sale across Peshawar.'],
  ['Renting', 'Homes, portions, apartments and offices available for rent.'],
  ['Selling and letting', 'Want to sell or rent out your property? Share the details and we will list it.'],
]

export default function About() {
  return (
    <section className="container-page pt-10">
      <h1 className="text-3xl font-medium">About {site.name}</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-charcoal/80">
        {site.name} is a property management company on University Road, Rahat Abad Tehkal, Peshawar. We help
        people buy, rent and sell property in the city.
      </p>
      <p className="mt-4 inline-block rounded-full bg-sand px-4 py-2 text-sm font-medium">
        ★ {site.rating} on Google ({site.reviews} reviews)
      </p>

      <h2 className="mt-12 text-2xl font-medium">What we do</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {services.map(([title, text]) => (
          <div key={title} className="rounded-2xl border border-charcoal/10 p-6">
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-charcoal/70">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/properties" className="btn btn-dark">Browse properties</Link>
        <Link to="/contact" className="btn btn-outline">Contact us</Link>
      </div>
    </section>
  )
}
