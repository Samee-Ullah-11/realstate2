// Fills the database with sample listings and creates the admin account.
// WARNING: deletes all existing properties first. Run with: npm run seed
import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import Property from './models/Property.js'
import User from './models/User.js'

if (process.env.NODE_ENV === 'production') throw new Error('Refusing to seed in production')

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=75`

// [title, purpose, type, price, area, address, size, unit, beds, baths, featured, imageIds]
const rows = [
  ['Modern 10 Marla House', 'sale', 'house', 42500000, 'Hayatabad', 'Phase 6, Sector F-10', 10, 'marla', 5, 6, true, ['1600596542815-ffad4c1539a9', '1600585154340-be6161a56a0c']],
  ['Luxury 1 Kanal Villa', 'sale', 'house', 115000000, 'DHA Peshawar', 'Sector A', 1, 'kanal', 6, 7, true, ['1512917774080-9991f1c4c750', '1564013799919-ab600027ffc6']],
  ['Family Home Near University', 'sale', 'house', 31000000, 'University Town', 'Old Jamrud Road', 7, 'marla', 4, 4, true, ['1568605114967-8130f3a36994']],
  ['5 Marla Brand New House', 'sale', 'house', 16500000, 'Regi Model Town', 'Zone 3', 5, 'marla', 3, 3, false, ['1570129477492-45c003edd2be']],
  ['Upper Portion for Rent', 'rent', 'house', 65000, 'Hayatabad', 'Phase 3, Sector K-4', 10, 'marla', 3, 3, true, ['1580587771525-78b9dba3b914']],
  ['Furnished 2 Bed Apartment', 'rent', 'apartment', 55000, 'University Town', 'Park Road', 4, 'marla', 2, 2, true, ['1522708323590-d24dbb6b0267', '1502672260266-1c1ef2d93688']],
  ['3 Bed Apartment in Deans Heights', 'sale', 'apartment', 21000000, 'Saddar', 'Deans Trade Center', 6, 'marla', 3, 3, false, ['1545324418-cc1a3fa10c00']],
  ['Studio Apartment for Rent', 'rent', 'apartment', 28000, 'Tehkal', 'University Road', 2, 'marla', 1, 1, false, ['1502672260266-1c1ef2d93688']],
  ['10 Marla Residential Plot', 'sale', 'plot', 14500000, 'DHA Peshawar', 'Sector C', 10, 'marla', 0, 0, false, ['1500382017468-9049fed747ef']],
  ['5 Marla Plot, Ideal Location', 'sale', 'plot', 5200000, 'Regi Model Town', 'Zone 4', 5, 'marla', 0, 0, false, ['1500382017468-9049fed747ef']],
  ['Commercial Office on Main Road', 'rent', 'commercial', 120000, 'Tehkal', 'University Road', 5, 'marla', 0, 2, false, ['1497366216548-37526070297c']],
  ['Commercial Plaza for Sale', 'sale', 'commercial', 185000000, 'Saddar', 'Saddar Road', 12, 'marla', 0, 6, true, ['1486406146926-c627a92ad1ab']],
]

const properties = rows.map(
  ([title, purpose, type, price, area, address, size, sizeUnit, bedrooms, bathrooms, featured, ids]) => ({
    title, purpose, type, price, area, address, size, sizeUnit, bedrooms, bathrooms, featured,
    images: ids.map(img),
    description: `Sample listing: ${title.toLowerCase()} in ${area}, Peshawar. Replace this text with the real details from the admin dashboard.`,
  })
)

await mongoose.connect(process.env.MONGO_URI)
await Property.deleteMany({})
await Property.insertMany(properties)

const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
if (ADMIN_EMAIL && ADMIN_PASSWORD) {
  await User.findOneAndUpdate(
    { email: ADMIN_EMAIL.toLowerCase() },
    { passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12) },
    { upsert: true }
  )
}
console.log(`Seeded ${properties.length} properties${ADMIN_EMAIL ? ` and admin ${ADMIN_EMAIL}` : ''}`)
await mongoose.disconnect()
