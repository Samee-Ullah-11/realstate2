// 42500000 -> "PKR 4.25 Crore", 65000 rent -> "PKR 65,000 / month"
export function formatPrice(price, purpose) {
  let text
  if (price >= 1e7) text = `${+(price / 1e7).toFixed(2)} Crore`
  else if (price >= 1e5) text = `${+(price / 1e5).toFixed(2)} Lakh`
  else text = price.toLocaleString('en-US')
  return `PKR ${text}${purpose === 'rent' ? ' / month' : ''}`
}

export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

// "5 Beds · 6 Baths · 10 Marla", leaving out anything that is zero (plots have no rooms)
export function specs(p) {
  return [
    p.bedrooms > 0 && `${p.bedrooms} ${p.bedrooms === 1 ? 'Bed' : 'Beds'}`,
    p.bathrooms > 0 && `${p.bathrooms} ${p.bathrooms === 1 ? 'Bath' : 'Baths'}`,
    p.size > 0 && `${p.size} ${capitalize(p.sizeUnit)}`,
  ].filter(Boolean)
}
