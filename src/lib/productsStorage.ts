import type { Product } from '../types/product'

const PRODUCTS_STORAGE_KEY = 'products-editor:data:v1'

const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'Organic Arabica Coffee Beans',
    description: 'Freshly roasted whole beans with notes of chocolate and caramel.',
    photo:
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80',
    price: 18.5,
    currency: 'USD',
    unit: 'bag',
  },
  {
    id: 2,
    name: 'Ceramic Pour Over Set',
    description: 'Minimal dripper and cup bundle for smooth morning brewing.',
    photo:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
    price: 34.99,
    currency: 'USD',
    unit: 'set',
  },
  {
    id: 3,
    name: 'Cold Brew Bottle 1L',
    description: 'Leak-proof glass bottle designed for overnight cold brew extraction.',
    photo:
      'https://images.unsplash.com/photo-1517701550927-30cf4ba1f490?auto=format&fit=crop&w=900&q=80',
    price: 21,
    currency: 'USD',
    unit: 'piece',
  },
]

const isValidProduct = (value: unknown): value is Product => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Product

  return (
    typeof candidate.id === 'number' &&
    typeof candidate.name === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.photo === 'string' &&
    typeof candidate.price === 'number' &&
    typeof candidate.currency === 'string' &&
    typeof candidate.unit === 'string'
  )
}

export const loadProducts = (): Product[] => {
  if (typeof window === 'undefined') {
    return sampleProducts
  }

  const existing = window.localStorage.getItem(PRODUCTS_STORAGE_KEY)

  if (!existing) {
    window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(sampleProducts))
    return sampleProducts
  }

  try {
    const parsed = JSON.parse(existing)

    if (Array.isArray(parsed) && parsed.every(isValidProduct)) {
      return parsed
    }
  } catch {
    // Fall back to generated sample data if local storage is corrupted.
  }

  window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(sampleProducts))
  return sampleProducts
}

export const saveProducts = (products: Product[]): void => {
  window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))
}
