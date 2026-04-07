import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FiCheckCircle,
  FiEdit,
  FiEdit3,
  FiImage,
  FiPackage,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiX,
} from 'react-icons/fi'
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
  const [products] = useState<Product[]>(loadProducts)
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [unit, setUnit] = useState('piece')

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
                <FiCheckCircle /> Data sourced from local storage
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="editor-card rounded-4 p-4 shadow-sm"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
            <h3 className="h4 mb-0 d-flex align-items-center gap-2">
              <FiPackage /> List Products
            </h3>
            <div className="d-flex flex-column flex-sm-row gap-2 align-items-stretch">
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
              <button
                className="btn btn-warning fw-semibold d-inline-flex align-items-center gap-2"
                onClick={() => setShowAddModal(true)}
              >
                <FiPlus /> New Product
              </button>
            </div>
          </div>

          <div className="row g-3">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="col-12 col-md-6 col-xl-4"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                >
                  <article className="product-item rounded-4 p-3 h-100 d-flex flex-column">
                    <div className="product-image-wrapper rounded-3 overflow-hidden mb-3">
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

                    <h4 className="h5 mb-1">{product.name}</h4>
                    <p className="mb-3 text-body-secondary">{product.description}</p>
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                      <span className="badge text-bg-light">
                        {product.currency} {product.price.toFixed(2)}
                      </span>
                      <span className="badge text-bg-warning">Unit: {product.unit}</span>
                    </div>

                    <div className="d-flex gap-2 mt-auto justify-content-end">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        type="button"
                        aria-label="Edit product"
                        title="Edit"
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        type="button"
                        aria-label="Delete product"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </article>
                </motion.div>
              ))}
            </AnimatePresence>

            {!filteredProducts.length && (
              <div className="col-12">
                <div className="empty-state rounded-4 p-4 text-center text-body-secondary">
                  <FiImage className="me-2" /> No products match your search.
                </div>
              </div>
            )}
          </div>
        </motion.section>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.section
              className="popup-card rounded-4 p-4"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="h5 mb-0">Add Product (Popup)</h4>
                <button className="btn btn-sm btn-light" onClick={() => setShowAddModal(false)}>
                  <FiX />
                </button>
              </div>

              <form className="d-grid gap-3">
                <div>
                  <label className="form-label">Product name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Photo URL</label>
                  <input
                    type="url"
                    className="form-control"
                    value={photo}
                    onChange={(event) => setPhoto(event.target.value)}
                  />
                </div>
                <div className="row g-3">
                  <div className="col-4">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
                    />
                  </div>
                  <div className="col-4">
                    <label className="form-label">Currency</label>
                    <input
                      type="text"
                      className="form-control"
                      value={currency}
                      onChange={(event) => setCurrency(event.target.value)}
                    />
                  </div>
                  <div className="col-4">
                    <label className="form-label">Unit</label>
                    <input
                      type="text"
                      className="form-control"
                      value={unit}
                      onChange={(event) => setUnit(event.target.value)}
                    />
                  </div>
                </div>
                <button type="button" className="btn btn-warning fw-semibold" disabled>
                  Save Product (Coming Soon)
                </button>
              </form>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
