import type { Product } from '../types/product'

const normalize = (value: string): string => value.trim().toLowerCase()

export const searchProducts = (products: Product[], query: string): Product[] => {
  const normalizedQuery = normalize(query)

  if (!normalizedQuery) {
    return products
  }

  const terms = normalizedQuery.split(/\s+/).filter(Boolean)

  return products.filter((product) => {
    const searchable = [
      product.name,
      product.description,
      product.currency,
      product.unit,
      product.price.toFixed(2),
      `${product.currency} ${product.price.toFixed(2)}`,
    ]
      .join(' ')
      .toLowerCase()

    return terms.every((term) => searchable.includes(term))
  })
}
