// import { useState } from 'react'
// import { Link, useParams } from 'react-router-dom'
// import { useApi } from '../api'
// import { capitalize, formatPrice, specs } from '../format'
// import { site } from '../site'
// import EnquiryForm from '../components/EnquiryForm'
// import Status from '../components/Status'

// export default function PropertyDetail() {
//   const { id } = useParams()
//   const { data: p, ...status } = useApi(`/properties/${id}`)
//   const [active, setActive] = useState(0)

//   if (!p) {
//     return (
//       <section className="container-page pt-10 text-center">
//         <Status {...status} />
//         {status.error && <Link to="/properties" className="btn btn-outline">Back to properties</Link>}
//       </section>
//     )
//   }

//   const place = [p.address, p.area, 'Peshawar'].filter(Boolean).join(', ')
//   const whatsapp = `${site.whatsapp}?text=${encodeURIComponent(`Hello, I am interested in "${p.title}" (${p.area}).`)}`

//   return (
//     <section className="container-page pt-8">
//       <Link to="/properties" className="text-sm text-charcoal/60 hover:text-charcoal">← All properties</Link>

//       <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_22rem]">
//         <div className="min-w-0">
//           <div className="aspect-[16/10] overflow-hidden rounded-3xl bg-sand">
//             {p.images[active] && <img src={p.images[active]} alt={p.title} className="size-full object-cover" />}
//           </div>
//           {p.images.length > 1 && (
//             <div className="mt-3 flex gap-3 overflow-x-auto">
//               {p.images.map((src, i) => (
//                 <button
//                   key={src}
//                   onClick={() => setActive(i)}
//                   aria-label={`Photo ${i + 1}`}
//                   aria-current={i === active}
//                   className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl ring-2 ${i === active ? 'ring-gold' : 'ring-transparent'}`}
//                 >
//                   <img src={src} alt="" className="size-full object-cover" />
//                 </button>
//               ))}
//             </div>
//           )}

//           <p className="mt-6 text-sm text-charcoal/60">
//             {capitalize(p.type)} for {p.purpose === 'rent' ? 'rent' : 'sale'}
//             {p.status !== 'available' && ` · ${capitalize(p.status)}`}
//           </p>
//           <h1 className="mt-1 text-3xl font-medium">{p.title}</h1>
//           <p className="mt-1 text-charcoal/70">{place}</p>
//           <p className="mt-4 text-2xl font-semibold text-gold-dark">{formatPrice(p.price, p.purpose)}</p>

//           <ul className="mt-6 flex flex-wrap gap-3">
//             {specs(p).map((s) => (
//               <li key={s} className="rounded-full bg-sand px-4 py-2 text-sm font-medium">{s}</li>
//             ))}
//           </ul>

//           <h2 className="mt-8 text-xl font-medium">Description</h2>
//           <p className="mt-2 leading-relaxed whitespace-pre-line text-charcoal/80">{p.description}</p>

//           <h2 className="mt-8 text-xl font-medium">Location</h2>
//           <iframe
//             title={`Map of ${place}`}
//             src={`https://www.google.com/maps?q=${encodeURIComponent(place)}&output=embed`}
//             loading="lazy"
//             className="mt-3 h-72 w-full rounded-2xl border-0"
//           />
//         </div>

//         <aside className="h-fit rounded-3xl border border-charcoal/10 p-6 lg:sticky lg:top-24">
//           <h2 className="text-lg font-medium">Interested in this property?</h2>
//           <div className="mt-4 grid grid-cols-2 gap-3">
//             <a href={whatsapp} target="_blank" rel="noreferrer" className="btn btn-gold">WhatsApp</a>
//             <a href={site.tel} className="btn btn-outline">Call</a>
//           </div>
//           <p className="my-4 text-center text-xs text-charcoal/50">or leave your number</p>
//           <EnquiryForm propertyId={p._id} />
//         </aside>
//       </div>
//     </section>
//   )
// }


import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApi } from '../api'
import { capitalize, formatPrice, specs } from '../format'
import { site } from '../site'
import EnquiryForm from '../components/EnquiryForm'
import Status from '../components/Status'

export default function PropertyDetail() {
  const { id } = useParams()
  const { data: p, ...status } = useApi(`/properties/${id}`)
  const [active, setActive] = useState(0)

  // Show loading or error status
  if (!p) {
    return (
      <section className="container-page pt-10 text-center">
        <Status {...status} />

        {status.error && (
          <Link
            to="/properties"
            className="btn btn-outline mt-4"
          >
            Back to properties
          </Link>
        )}
      </section>
    )
  }

  // Safely handle missing images
  const images = Array.isArray(p.images) ? p.images : []

  // Make sure active image index is valid
  const activeImage = images[active] || images[0]

  // Dynamic property location
  const place = [
    p.address,
    p.area,
    p.city || 'Peshawar'
  ].filter(Boolean).join(', ')

  // WhatsApp enquiry link
  const whatsapp = `${site.whatsapp}?text=${encodeURIComponent(
    `Hello, I am interested in "${p.title}" (${p.area || p.city || 'your property'}).`
  )}`

  return (
    <section className="container-page pt-8">

      {/* Back button */}
      <Link
        to="/properties"
        className="text-sm text-charcoal/60 hover:text-charcoal"
      >
        ← All properties
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_22rem]">

        {/* Left section */}
        <div className="min-w-0">

          {/* Main property image */}
          <div className="aspect-16/10 overflow-hidden rounded-3xl bg-sand">

            {activeImage ? (
              <img
                src={activeImage}
                alt={p.title || 'Property image'}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-charcoal/50">
                No image available
              </div>
            )}

          </div>

          {/* Image thumbnails */}
          {images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto">

              {images.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  onClick={() => setActive(i)}
                  aria-label={`Photo ${i + 1}`}
                  aria-current={i === active ? 'true' : undefined}
                  className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl ring-2 ${
                    i === active
                      ? 'ring-gold'
                      : 'ring-transparent'
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    className="size-full object-cover"
                  />
                </button>
              ))}

            </div>
          )}

          {/* Property information */}
          <p className="mt-6 text-sm text-charcoal/60">
            {capitalize(p.type || 'Property')} for{' '}
            {p.purpose === 'rent' ? 'rent' : 'sale'}

            {p.status !== 'available' &&
              ` · ${capitalize(p.status)}`}
          </p>

          <h1 className="mt-1 text-3xl font-medium">
            {p.title}
          </h1>

          <p className="mt-1 text-charcoal/70">
            {place}
          </p>

          {/* Price */}
          <p className="mt-4 text-2xl font-semibold text-gold-dark">
            {formatPrice(p.price, p.purpose)}
          </p>

          {/* Property specifications */}
          <ul className="mt-6 flex flex-wrap gap-3">
            {specs(p).map((s) => (
              <li
                key={s}
                className="rounded-full bg-sand px-4 py-2 text-sm font-medium"
              >
                {s}
              </li>
            ))}
          </ul>

          {/* Description */}
          <h2 className="mt-8 text-xl font-medium">
            Description
          </h2>

          <p className="mt-2 leading-relaxed whitespace-pre-line text-charcoal/80">
            {p.description || 'No description available.'}
          </p>

          {/* Location */}
          <h2 className="mt-8 text-xl font-medium">
            Location
          </h2>

          <iframe
            title={`Map of ${place}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(place)}&output=embed`}
            loading="lazy"
            className="mt-3 h-72 w-full rounded-2xl border-0"
          />

        </div>

        {/* Right section - Enquiry */}
        <aside className="h-fit rounded-3xl border border-charcoal/10 p-6 lg:sticky lg:top-24">

          <h2 className="text-lg font-medium">
            Interested in this property?
          </h2>

          {/* Contact buttons */}
          <div className="mt-4 grid grid-cols-2 gap-3">

            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="btn btn-gold"
            >
              WhatsApp
            </a>

            <a
              href={site.tel}
              className="btn btn-outline"
            >
              Call
            </a>

          </div>

          <p className="my-4 text-center text-xs text-charcoal/50">
            or leave your number
          </p>

          {/* Enquiry form */}
          <EnquiryForm propertyId={p._id} />

        </aside>

      </div>
    </section>
  )
}
