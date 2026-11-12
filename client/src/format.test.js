import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatPrice, specs } from './format.js'

test('formatPrice uses crore, lakh and plain numbers', () => {
  assert.equal(formatPrice(42500000, 'sale'), 'PKR 4.25 Crore')
  assert.equal(formatPrice(10000000, 'sale'), 'PKR 1 Crore')
  assert.equal(formatPrice(5200000, 'sale'), 'PKR 52 Lakh')
  assert.equal(formatPrice(120000, 'rent'), 'PKR 1.2 Lakh / month')
  assert.equal(formatPrice(65000, 'rent'), 'PKR 65,000 / month')
})

test('specs skips zero values', () => {
  assert.deepEqual(specs({ bedrooms: 0, bathrooms: 0, size: 5, sizeUnit: 'marla' }), ['5 Marla'])
  assert.deepEqual(specs({ bedrooms: 1, bathrooms: 2, size: 1, sizeUnit: 'kanal' }), ['1 Bed', '2 Baths', '1 Kanal'])
})
