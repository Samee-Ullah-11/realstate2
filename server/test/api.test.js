// Smoke test for the API. Runs against a throwaway in-memory MongoDB, so nothing needs to be installed.
// The first run downloads the MongoDB binary, which can take several minutes.
import { MongoMemoryServer } from 'mongodb-memory-server'
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import app from '../src/app.js'
import Property from '../src/models/Property.js'
import Enquiry from '../src/models/Enquiry.js'
import User from '../src/models/User.js'
import { sign } from '../src/routes/uploads.js'

let mongo, server, base, cookie
const json = (body, extra = {}) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json', ...extra },
  body: JSON.stringify(body),
})
const house = { title: 'Test House', purpose: 'sale', type: 'house', price: 9000000, area: 'Hayatabad', bedrooms: 4 }

before(async () => {
  mongo = await MongoMemoryServer.create()
  await mongoose.connect(mongo.getUri())
  await User.create({ email: 'a@test.local', passwordHash: await bcrypt.hash('test-pass', 4) })
  await Property.create([house, { ...house, title: 'Flat', purpose: 'rent', type: 'apartment', price: 40000, area: 'Saddar', bedrooms: 2 }])
  server = app.listen(0)
  base = `http://127.0.0.1:${server.address().port}/api`
})

after(async () => {
  server?.close()
  await mongoose.disconnect()
  await mongo?.stop()
})

test('list filters by purpose, price and beds', async () => {
  const all = await (await fetch(`${base}/properties`)).json()
  assert.equal(all.total, 2)
  const rent = await (await fetch(`${base}/properties?purpose=rent`)).json()
  assert.deepEqual(rent.items.map((p) => p.title), ['Flat'])
  const big = await (await fetch(`${base}/properties?minPrice=1000000&beds=3`)).json()
  assert.deepEqual(big.items.map((p) => p.title), ['Test House'])
  const paged = await (await fetch(`${base}/properties?limit=1&page=2`)).json()
  assert.deepEqual([paged.items.length, paged.page, paged.pages], [1, 2, 2])
  const cheap = await (await fetch(`${base}/properties?maxPrice=50000`)).json()
  assert.deepEqual(cheap.items.map((p) => p.title), ['Flat'])
  const areas = await (await fetch(`${base}/properties/areas`)).json()
  assert.equal(areas.length, 2)
})

test('bad id gives 404, not a crash', async () => {
  assert.equal((await fetch(`${base}/properties/not-an-id`)).status, 404)
})

test('writing needs admin login', async () => {
  assert.equal((await fetch(`${base}/properties`, json(house))).status, 401)
  assert.equal((await fetch(`${base}/enquiries`)).status, 401)
  assert.equal((await fetch(`${base}/auth/login`, json({ email: 'a@test.local', password: 'wrong' }))).status, 401)
  // an object instead of a string must not bypass the password check
  assert.equal((await fetch(`${base}/auth/login`, json({ email: { $ne: '' }, password: { $ne: '' } }))).status, 401)

  const login = await fetch(`${base}/auth/login`, json({ email: 'a@test.local', password: 'test-pass' }))
  assert.equal(login.status, 200)
  cookie = login.headers.get('set-cookie').split(';')[0]
  assert.match(login.headers.get('set-cookie'), /HttpOnly/)

  const created = await fetch(`${base}/properties`, json({ ...house, title: 'New' }, { cookie }))
  assert.equal(created.status, 201)
  const { _id } = await created.json()

  const invalid = await fetch(`${base}/properties`, json({ title: 'No price' }, { cookie }))
  assert.equal(invalid.status, 400)

  const updated = await fetch(`${base}/properties/${_id}`, { ...json({ price: 1 }, { cookie }), method: 'PUT' })
  assert.equal((await updated.json()).price, 1)
  assert.equal((await fetch(`${base}/properties/${_id}`, { method: 'DELETE', headers: { cookie } })).status, 200)
})

test('visitor enquiry is saved unread, admin can read it', async () => {
  const res = await fetch(`${base}/enquiries`, json({ name: 'Ali', phone: '0300', message: 'Hi', read: true }))
  assert.equal(res.status, 201)
  assert.equal((await Enquiry.findOne()).read, false)
  assert.equal((await fetch(`${base}/enquiries`, json({ name: 'No phone' }))).status, 400)
  const list = await (await fetch(`${base}/enquiries`, { headers: { cookie } })).json()
  assert.equal(list.length, 1)
})

test('photo upload signature: admin only, and matches Cloudinary’s documented example', async () => {
  // example from Cloudinary's "signed upload" documentation
  assert.equal(
    sign({ public_id: 'sample_image', timestamp: 1315060510, eager: 'w_400,h_300,c_pad|w_260,h_200,c_crop' }, 'abcd'),
    'bfd09f95f331f558cbd1320e67aa8d488770583e'
  )
  assert.equal((await fetch(`${base}/uploads/signature`)).status, 401)

  delete process.env.CLOUDINARY_API_SECRET
  assert.equal((await fetch(`${base}/uploads/signature`, { headers: { cookie } })).status, 503)

  Object.assign(process.env, { CLOUDINARY_CLOUD_NAME: 'demo', CLOUDINARY_API_KEY: '123', CLOUDINARY_API_SECRET: 'test-secret' })
  const slip = await (await fetch(`${base}/uploads/signature`, { headers: { cookie } })).json()
  assert.equal(slip.signature, sign({ folder: slip.folder, timestamp: slip.timestamp }, 'test-secret'))
  assert.equal(slip.api_secret, undefined)
})

test('admin login times out: expired token is refused, activity renews it', async () => {
  const expired = jwt.sign({ id: 'x' }, process.env.JWT_SECRET, { expiresIn: -1 })
  assert.equal((await fetch(`${base}/enquiries`, { headers: { cookie: `token=${expired}` } })).status, 401)

  const res = await fetch(`${base}/enquiries`, { headers: { cookie } })
  assert.equal(res.status, 200)
  assert.match(res.headers.get('set-cookie'), /token=.+Max-Age=1800/)
})

test('stay in the loop: signup validates email, hides duplicates, list is admin only', async () => {
  assert.equal((await fetch(`${base}/subscribers`, json({ email: 'not-an-email' }))).status, 400)
  assert.equal((await fetch(`${base}/subscribers`, json({ email: { $ne: '' } }))).status, 400)
  assert.equal((await fetch(`${base}/subscribers`, json({ email: 'Ali@Example.com' }))).status, 201)
  assert.equal((await fetch(`${base}/subscribers`, json({ email: 'ali@example.com' }))).status, 201)
  assert.equal((await fetch(`${base}/subscribers`)).status, 401)
  const list = await (await fetch(`${base}/subscribers`, { headers: { cookie } })).json()
  assert.deepEqual(list.map((s) => s.email), ['ali@example.com'])
})
