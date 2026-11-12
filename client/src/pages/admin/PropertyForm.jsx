import { useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, useApi } from '../../api'
import { capitalize } from '../../format'
import { TYPES } from '../../site'
import Status from '../../components/Status'

// Sends each photo from the admin's browser straight to Cloudinary and returns the image links.
async function uploadToCloudinary(files) {
  const slip = await api('/uploads/signature')
  const urls = []
  for (const file of files) {
    const form = new FormData()
    form.append('file', file)
    for (const key of ['api_key', 'timestamp', 'signature', 'folder']) form.append(key, slip[key])
    const res = await fetch(`https://api.cloudinary.com/v1_1/${slip.cloudName}/image/upload`, { method: 'POST', body: form })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error?.message || 'Photo upload failed')
    urls.push(data.secure_url)
  }
  return urls
}

function Form({ initial }) {
  const navigate = useNavigate()
  const areas = useApi('/properties/areas')
  const [images, setImages] = useState(initial?.images ?? [])
  const [status, setStatus] = useState({}) // { busy } | { error }
  const linkInput = useRef(null)

  async function save(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const body = { ...Object.fromEntries(form), featured: form.has('featured'), images }
    setStatus({ busy: true })
    try {
      await api(initial ? `/properties/${initial._id}` : '/properties', { method: initial ? 'PUT' : 'POST', body })
      navigate('/admin')
    } catch (err) {
      setStatus({ error: err.message })
    }
  }

  async function addPhotos(e) {
    const files = [...e.target.files]
    e.target.value = ''
    setStatus({ busy: true })
    try {
      const urls = await uploadToCloudinary(files)
      setImages((list) => [...list, ...urls])
      setStatus({})
    } catch (err) {
      setStatus({ error: err.message })
    }
  }

  function addLink() {
    const url = linkInput.current.value.trim()
    if (!/^https:\/\//.test(url)) return setStatus({ error: 'Image link must start with https://' })
    setImages((list) => [...list, url])
    linkInput.current.value = ''
    setStatus({})
  }

  const input = (name, label, props = {}) => (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <input id={name} name={name} defaultValue={initial?.[name] ?? ''} className="field" {...props} />
    </div>
  )
  const select = (name, label, options) => (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <select id={name} name={name} defaultValue={initial?.[name] ?? options[0]} className="field">
        {options.map((o) => (
          <option key={o} value={o}>{capitalize(o)}</option>
        ))}
      </select>
    </div>
  )

  return (
    <form onSubmit={save} className="mt-6 space-y-6 rounded-2xl border border-charcoal/10 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">{input('title', 'Title', { required: true, maxLength: 120 })}</div>
        {select('purpose', 'For', ['sale', 'rent'])}
        {select('type', 'Property type', TYPES)}
        {input('price', 'Price in PKR (per month for rent)', { type: 'number', min: 0, required: true })}
        {select('status', 'Status', ['available', 'sold', 'rented'])}
        {input('area', 'Area (e.g. Hayatabad)', { required: true, list: 'area-list' })}
        <datalist id="area-list">
          {areas.data?.map((a) => <option key={a.area} value={a.area} />)}
        </datalist>
        {input('address', 'Address')}
        <div className="grid grid-cols-2 gap-4">
          {input('size', 'Size', { type: 'number', min: 0, step: 'any' })}
          {select('sizeUnit', 'Unit', ['marla', 'kanal'])}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {input('bedrooms', 'Bedrooms', { type: 'number', min: 0, defaultValue: initial?.bedrooms ?? 0 })}
          {input('bathrooms', 'Bathrooms', { type: 'number', min: 0, defaultValue: initial?.bathrooms ?? 0 })}
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={5} maxLength={5000} defaultValue={initial?.description ?? ''} className="field" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={initial?.featured} className="size-4 accent-charcoal" />
          Show in "Popular homes" on the home page
        </label>
      </div>

      <fieldset>
        <legend className="label">Photos (the first one is the cover)</legend>
        {images.length > 0 && (
          <ul className="mb-3 flex flex-wrap gap-3">
            {images.map((src, i) => (
              <li key={src + i} className="relative size-24 overflow-hidden rounded-xl bg-sand">
                <img src={src} alt={`Photo ${i + 1}`} className="size-full object-cover" />
                <button
                  type="button"
                  aria-label={`Remove photo ${i + 1}`}
                  onClick={() => setImages(images.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 grid size-6 place-items-center rounded-full bg-charcoal text-xs text-white"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <label className="btn btn-outline cursor-pointer">
            Upload photos
            <input type="file" accept="image/*" multiple onChange={addPhotos} className="sr-only" />
          </label>
          <span className="text-xs text-charcoal/50">or</span>
          <input ref={linkInput} type="url" aria-label="Image link" placeholder="Paste an image link (https://…)" className="field max-w-xs" />
          <button type="button" onClick={addLink} className="btn btn-outline">Add link</button>
        </div>
      </fieldset>

      {status.error && <p role="alert" className="text-sm text-red-700">{status.error}</p>}
      <div className="flex gap-3">
        <button className="btn btn-dark" disabled={status.busy}>{status.busy ? 'Please wait…' : 'Save property'}</button>
        <Link to="/admin" className="btn btn-outline">Cancel</Link>
      </div>
    </form>
  )
}

export default function PropertyForm() {
  const { id } = useParams()
  return (
    <>
      <h1 className="text-2xl font-medium">{id ? 'Edit property' : 'Add property'}</h1>
      {id ? <EditLoader id={id} /> : <Form />}
    </>
  )
}

function EditLoader({ id }) {
  const { data, ...status } = useApi(`/properties/${id}`)
  return data ? <Form initial={data} /> : <Status {...status} />
}
