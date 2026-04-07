import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FiCheckCircle,
  FiEdit3,
  FiImage,
  FiPackage,
  FiPlus,
  FiSearch,
  FiTrash2,
} from 'react-icons/fi'
import { ToastContainer, toast } from 'react-toastify'
import './App.css'

type Product = {
  id: number
  name: string
  description: string
  photo: string
  price: number
  currency: string
  unit: string
}

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

const loadProducts = (): Product[] => {
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

function App() {
  const [products, setProducts] = useState<Product[]>(loadProducts)
  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [unit, setUnit] = useState('piece')

  useEffect(() => {
    window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))
  }, [products])

  const averagePrice = useMemo(() => {
    if (!products.length) {
      return 0
    }

    return products.reduce((total, product) => total + product.price, 0) / products.length
  }, [products])

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const query = search.trim().toLowerCase()

        if (!query) {
          return true
        }

        return (
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.unit.toLowerCase().includes(query) ||
          product.currency.toLowerCase().includes(query)
        )
      }),
    [products, search],
  )

  const handleAddProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsedPrice = Number(price)
    const photoUrl = photo.trim()

    let normalizedPhoto = ''

    try {
      normalizedPhoto = new URL(photoUrl).toString()
    } catch {
      toast.error('Please provide a valid product photo URL.')
      return
    }

    if (!name.trim() || !description.trim() || !currency.trim() || !unit.trim() || parsedPrice <= 0) {
      toast.error('Please provide valid product details before saving.')
      return
    }

    const newProduct: Product = {
      id: Date.now(),
      name: name.trim(),
      description: description.trim(),
      photo: normalizedPhoto,
      price: Number(parsedPrice.toFixed(2)),
      currency: currency.trim().toUpperCase(),
      unit: unit.trim().toLowerCase(),
    }

    setProducts((previous) => [newProduct, ...previous])
    setName('')
    setDescription('')
    setPhoto('')
    setPrice('')
    setCurrency('USD')
    setUnit('piece')
    toast.success(`${newProduct.name} added to inventory.`)
  }

  const handleDeleteProduct = (id: number, productName: string) => {
    setProducts((previous) => previous.filter((product) => product.id !== id))
    toast.info(`${productName} removed.`)
  }

  return (
    <div className="app-shell py-4 py-md-5">
      <div className="container">
        <motion.section
          className="hero-banner rounded-4 p-4 p-md-5 mb-4 mb-md-5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="d-flex flex-column flex-lg-row justify-content-between gap-4 align-items-start">
            <div>
              <span className="badge text-bg-light mb-3 hero-badge">
                <FiEdit3 className="me-2" /> Products Editor
              </span>
              <h1 className="display-5 fw-semibold mb-2">Manage your product catalog</h1>
              <p className="lead mb-0 text-body-secondary">
                Build and maintain inventory records with a fast and modern editing workflow.
              </p>
            </div>
            <div className="stats-card rounded-4 p-3 p-md-4">
              <p className="text-uppercase small mb-1">Average price</p>
              <h2 className="mb-3">${averagePrice.toFixed(2)}</h2>
              <div className="d-flex align-items-center gap-2 text-success fw-medium">
                <FiCheckCircle /> Live synced in local storage
              </div>
            </div>
          </div>
        </motion.section>

        <div className="row g-4 align-items-start">
          <motion.section
            className="col-12 col-lg-5"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="editor-card rounded-4 p-4 shadow-sm h-100">
              <h3 className="h4 mb-3 d-flex align-items-center gap-2">
                <FiPlus /> Add Product
              </h3>
              <form onSubmit={handleAddProduct} className="d-grid gap-3">
                <div>
                  <label className="form-label">Product name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="UltraWide Monitor"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Short product details"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Photo URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://example.com/image.jpg"
                    value={photo}
                    onChange={(event) => setPhoto(event.target.value)}
                  />
                </div>
                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="form-control"
                      placeholder="0.00"
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Currency</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="USD"
                      value={currency}
                      onChange={(event) => setCurrency(event.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Unit</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="piece / set / kg"
                    value={unit}
                    onChange={(event) => setUnit(event.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-warning fw-semibold py-2">
                  Save Product
                </button>
              </form>
            </div>
          </motion.section>

          <motion.section
            className="col-12 col-lg-7"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="editor-card rounded-4 p-4 shadow-sm">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <h3 className="h4 mb-0 d-flex align-items-center gap-2">
                  <FiPackage /> Product List
                </h3>
                <div className="input-group search-group">
                  <span className="input-group-text bg-white border-end-0">
                    <FiSearch />
                  </span>
                  <input
                    type="search"
                    className="form-control border-start-0"
                    placeholder="Search by name, description, unit"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
              </div>

              <div className="d-grid gap-3">
                <AnimatePresence>
                  {filteredProducts.map((product, index) => (
                    <motion.article
                      key={product.id}
                      className="product-item rounded-4 p-3"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.25, delay: index * 0.04 }}
                    >
                      <div className="d-flex flex-column flex-sm-row gap-3">
                        <div className="product-image-wrapper rounded-3 overflow-hidden">
                          <img
                            src={product.photo}
                            alt={product.name}
                            className="product-image"
                            onError={(event) => {
                              const target = event.currentTarget
                              target.onerror = null
                              target.src = 'https://placehold.co/640x480/f2f2f2/666?text=Product+Image'
                            }}
                          />
                        </div>
                        <div className="flex-grow-1 d-flex flex-column">
                          <h4 className="h5 mb-1">{product.name}</h4>
                          <p className="mb-3 text-body-secondary">{product.description}</p>
                          <div className="d-flex flex-wrap align-items-center gap-2 mt-auto">
                            <span className="badge text-bg-light">
                              {product.currency} {product.price.toFixed(2)}
                            </span>
                            <span className="badge text-bg-warning">Unit: {product.unit}</span>
                            <button
                              className="btn btn-sm btn-outline-danger ms-sm-auto"
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>

                {!filteredProducts.length && (
                  <div className="empty-state rounded-4 p-4 text-center text-body-secondary">
                    <FiImage className="me-2" /> No products match your search.
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={2200} theme="colored" />
    </div>
  )
}

export default App
