import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiImage } from 'react-icons/fi'
import { ProductCard } from './ProductCard'
import { ProductFormDialog } from './ProductFormDialog'
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog'
import { ProductEditorHero } from './ProductEditorHero'
import { ProductListToolbar } from './ProductListToolbar'
import { fileToDataUrl } from '../lib/fileToDataUrl'
import { loadProducts, saveProducts } from '../lib/productsStorage'
import { searchProducts } from '../lib/searchProducts'
import type { Product, ProductFormValues } from '../types/product'
import { createEmptyProductFormValues } from '../types/product'

type EditState = {
  show: boolean
  productId: number | null
}

const validateProductForm = (values: ProductFormValues): Product | null => {
  const parsedPrice = Number(values.price)

  if (
    !values.name.trim() ||
    !values.description.trim() ||
    !values.currency.trim() ||
    !values.unit.trim() ||
    !Number.isFinite(parsedPrice) ||
    parsedPrice <= 0
  ) {
    return null
  }

  let normalizedPhoto = ''

  if (values.imageSource === 'url') {
    try {
      normalizedPhoto = new URL(values.photoUrl.trim()).toString()
    } catch {
      return null
    }
  } else {
    if (!values.uploadedImageDataUrl.startsWith('data:image/')) {
      return null
    }

    normalizedPhoto = values.uploadedImageDataUrl
  }

  return {
    id: 0,
    name: values.name.trim(),
    description: values.description.trim(),
    photo: normalizedPhoto,
    price: Number(parsedPrice.toFixed(2)),
    currency: values.currency.trim().toUpperCase(),
    unit: values.unit.trim().toLowerCase(),
  }
}

export function ProductEditorApp() {
  const [products, setProducts] = useState<Product[]>(loadProducts)
  const [search, setSearch] = useState('')
  const [formValues, setFormValues] = useState<ProductFormValues>(createEmptyProductFormValues)
  const [editor, setEditor] = useState<EditState>({ show: false, productId: null })
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  useEffect(() => {
    saveProducts(products)
  }, [products])

  const averagePrice = useMemo(() => {
    if (!products.length) {
      return 0
    }

    return products.reduce((total, product) => total + product.price, 0) / products.length
  }, [products])

  const filteredProducts = useMemo(() => searchProducts(products, search), [products, search])

  const openAddDialog = () => {
    setFormValues(createEmptyProductFormValues())
    setEditor({ show: true, productId: null })
  }

  const openEditDialog = (product: Product) => {
    const editingValues: ProductFormValues = {
      name: product.name,
      description: product.description,
      imageSource: product.photo.startsWith('data:image/') ? 'upload' : 'url',
      photoUrl: product.photo.startsWith('data:image/') ? '' : product.photo,
      uploadedImageDataUrl: product.photo.startsWith('data:image/') ? product.photo : '',
      price: String(product.price),
      currency: product.currency,
      unit: product.unit,
    }

    setFormValues(editingValues)
    setEditor({ show: true, productId: product.id })
  }

  const closeFormDialog = () => {
    setEditor((previous) => ({ ...previous, show: false }))
  }

  const handleFormFieldChange = (field: keyof ProductFormValues, value: string) => {
    setFormValues((previous) => ({ ...previous, [field]: value }))
  }

  const handleImageSourceChange = (source: 'url' | 'upload') => {
    setFormValues((previous) => ({ ...previous, imageSource: source }))
  }

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file || !file.type.startsWith('image/')) {
      return
    }

    const dataUrl = await fileToDataUrl(file)

    setFormValues((previous) => ({
      ...previous,
      imageSource: 'upload',
      uploadedImageDataUrl: dataUrl,
    }))

    event.target.value = ''
  }

  const submitProductForm = () => {
    const parsed = validateProductForm(formValues)

    if (!parsed) {
      return
    }

    const payload: Product = {
      ...parsed,
      id: editor.productId ?? Date.now(),
    }

    if (editor.productId === null) {
      setProducts((previous) => [payload, ...previous])
    } else {
      setProducts((previous) =>
        previous.map((product) => (product.id === editor.productId ? payload : product)),
      )
    }

    setEditor({ show: false, productId: null })
    setFormValues(createEmptyProductFormValues())
  }

  const confirmDelete = () => {
    if (!deletingProduct) {
      return
    }

    setProducts((previous) => previous.filter((product) => product.id !== deletingProduct.id))
    setDeletingProduct(null)
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
          <ProductEditorHero averagePrice={averagePrice} />
        </motion.section>

        <motion.section
          className="editor-card rounded-4 p-4 shadow-sm"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <ProductListToolbar search={search} onSearchChange={setSearch} onCreate={openAddDialog} />

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
                  <ProductCard
                    product={product}
                    onEdit={openEditDialog}
                    onDelete={(selectedProduct) => setDeletingProduct(selectedProduct)}
                  />
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
        {editor.show && (
          <ProductFormDialog
            isEditing={editor.productId !== null}
            values={formValues}
            onClose={closeFormDialog}
            onSubmit={submitProductForm}
            onFieldChange={handleFormFieldChange}
            onImageSourceChange={handleImageSourceChange}
            onImageUpload={handleImageUpload}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletingProduct && (
          <ConfirmDeleteDialog
            productName={deletingProduct.name}
            onCancel={() => setDeletingProduct(null)}
            onConfirm={confirmDelete}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
