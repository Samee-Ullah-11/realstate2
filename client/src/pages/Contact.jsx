import { site } from '../site'
import EnquiryForm from '../components/EnquiryForm'

export default function Contact() {
  return (
    <section className="container-page pt-10">
      <h1 className="text-3xl font-medium">Contact us</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="font-medium text-gold-dark">Address</dt>
              <dd className="mt-1">{site.address}</dd>
            </div>
            <div>
              <dt className="font-medium text-gold-dark">Phone</dt>
              <dd className="mt-1"><a href={site.tel} className="hover:underline">{site.phone}</a></dd>
            </div>
            <div>
              <dt className="font-medium text-gold-dark">Hours</dt>
              <dd className="mt-1">{site.hours}</dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={site.whatsapp} target="_blank" rel="noreferrer" className="btn btn-gold">WhatsApp</a>
            <a href={site.tel} className="btn btn-outline">Call</a>
            <a href={site.mapLink} target="_blank" rel="noreferrer" className="btn btn-outline">Get directions</a>
          </div>
          <iframe
            title={`Map showing ${site.name}`}
            src={site.mapEmbed}
            loading="lazy"
            className="mt-6 h-72 w-full rounded-2xl border-0"
          />
        </div>
        <div className="h-fit rounded-3xl border border-charcoal/10 p-6">
          <h2 className="mb-4 text-lg font-medium">Send an enquiry</h2>
          <EnquiryForm />
        </div>
      </div>
    </section>
  )
}
