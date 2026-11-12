import { useState } from 'react'
import { api } from '../api'

// Sends a visitor's enquiry to the agency. Pass propertyId when it is about one listing.
export default function EnquiryForm({ propertyId }) {
  const [status, setStatus] = useState({}) // { sending } | { sent } | { error }

  async function submit(e) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus({ sending: true })
    try {
      await api('/enquiries', {
        method: 'POST',
        body: { ...Object.fromEntries(new FormData(form)), property: propertyId },
      })
      form.reset()
      setStatus({ sent: true })
    } catch (err) {
      setStatus({ error: err.message })
    }
  }

  if (status.sent) {
    return (
      <p role="status" className="rounded-xl bg-sand p-4 text-sm">
        Thank you. Your enquiry has been sent and we will call you back soon.
      </p>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label" htmlFor="enq-name">Your name</label>
        <input id="enq-name" name="name" required maxLength={80} autoComplete="name" className="field" />
      </div>
      <div>
        <label className="label" htmlFor="enq-phone">Phone number</label>
        <input id="enq-phone" name="phone" type="tel" required maxLength={30} autoComplete="tel" className="field" />
      </div>
      <div>
        <label className="label" htmlFor="enq-message">Message</label>
        <textarea id="enq-message" name="message" rows={4} maxLength={2000} className="field" />
      </div>
      {status.error && <p role="alert" className="text-sm text-red-700">{status.error}</p>}
      <button className="btn btn-dark w-full" disabled={status.sending}>
        {status.sending ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  )
}
