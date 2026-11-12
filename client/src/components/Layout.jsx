import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { site } from '../site'

const links = [
  ['Home', '/'],
  ['Buy', '/properties?purpose=sale'],
  ['Rent', '/properties?purpose=rent'],
  ['About', '/about'],
  ['Contact', '/contact'],
]

// The top bar used by both the public site and the admin area.
export function Header({ links, action, home = '/', tag }) {
  const [open, setOpen] = useState(false)
  const { pathname, search } = useLocation()

  // On every page change: close the phone menu and go back to the top.
  useEffect(() => {
    setOpen(false)
    window.scrollTo(0, 0)
  }, [pathname, search])

  return (
    <header className="sticky top-0 z-20 border-b border-charcoal/10 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to={home} className="flex items-center gap-2 text-lg font-semibold">
          <span className="grid size-7 place-items-center rounded-md bg-charcoal text-sm font-bold text-gold">S</span>
          {site.name}
          {tag && <span className="text-sm font-medium text-gold-dark">{tag}</span>}
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 rounded-full bg-sand p-1 md:flex">
          {links.map(([label, to]) => (
            <Link key={label} to={to} className="rounded-full px-4 py-1.5 text-sm hover:bg-white">
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">{action}</div>
        <button
          className="rounded-lg p-2 md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} />
          </svg>
        </button>
      </div>
      {open && (
        <nav
          aria-label="Main"
          className="absolute inset-x-0 top-full flex origin-top flex-col gap-1 border-b border-charcoal/10 bg-white px-4 pt-2 pb-4 shadow-lg transition-[opacity,transform] duration-200 ease-out md:hidden starting:opacity-0 motion-safe:starting:-translate-y-2"
        >
          {links.map(([label, to]) => (
            <Link key={label} to={to} className="rounded-lg px-3 py-2.5 hover:bg-sand">
              {label}
            </Link>
          ))}
          <div className="mt-2 px-3">{action}</div>
        </nav>
      )}
    </header>
  )
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header links={links} action={
          <a href={site.tel} aria-label={`Call ${site.phone}`} className="btn btn-dark group relative size-10 p-0">
            {/* Label that slides out of the button on hover, keyboard focus or tap. Always shown in the phone menu. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute rounded-full bg-sand px-3 py-1.5 text-xs font-medium whitespace-nowrap text-charcoal transition-[opacity,transform] duration-150 ease-out max-md:left-full max-md:ml-2 md:right-full md:mr-2 md:origin-right md:scale-95 md:opacity-0 md:group-hover:scale-100 md:group-hover:opacity-100 md:group-focus:scale-100 md:group-focus:opacity-100"
            >
              Call for a better future
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </a>
        }
      />

      <main className="flex-1">
        <Outlet />
        <div className="h-20" /> {/* space above the footer; kept inside <main> so the button can travel down to it */}
        {/* Floating WhatsApp button. "sticky" keeps it at the bottom of the screen while scrolling,
            and because it lives inside <main> it stops at the top of the footer by itself. */}
        <div className="pointer-events-none sticky bottom-2 z-10 h-0">
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="pointer-events-auto absolute right-4 bottom-4 grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-lg transition-transform duration-150 ease-out hover:scale-105 motion-safe:active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal sm:right-6"
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>
      </main>

      <footer className="bg-charcoal text-white">
        <div className="container-page grid gap-8 py-12 sm:grid-cols-3">
          <div>
            <p className="text-lg font-semibold">{site.name}</p>
            <p className="mt-2 text-sm text-white/70">
              Houses, plots, apartments and commercial property for sale and rent in Peshawar.
            </p>
          </div>
          <div className="text-sm">
            <p className="font-medium text-gold">Visit us</p>
            <p className="mt-2 text-white/70">{site.address}</p>
            <p className="mt-1 text-white/70">{site.hours}</p>
          </div>
          <div className="text-sm">
            <p className="font-medium text-gold">Contact</p>
            <a href={site.tel} className="mt-2 block text-white/70 hover:text-white">{site.phone}</a>
            <a href={site.whatsapp} target="_blank" rel="noreferrer" className="mt-1 block text-white/70 hover:text-white">
              WhatsApp
            </a>
            <Link to="/contact" className="mt-1 block text-white/70 hover:text-white">Send an enquiry</Link>
          </div>
        </div>
        <p className="border-t border-white/10 py-4 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
