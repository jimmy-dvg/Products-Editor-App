import type { ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import type { ProductFormValues } from '../types/product'

type ProductFormDialogProps = {
  isEditing: boolean
  values: ProductFormValues
  onClose: () => void
  onSubmit: () => void
  onFieldChange: (field: keyof ProductFormValues, value: string) => void
  onImageSourceChange: (source: 'url' | 'upload') => void
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void
}

export function ProductFormDialog({
  isEditing,
  values,
  onClose,
  onSubmit,
  onFieldChange,
  onImageSourceChange,
  onImageUpload,
}: ProductFormDialogProps) {
  return (
    <motion.div
      className="popup-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
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
          <h4 className="h5 mb-0">{isEditing ? 'Edit Product' : 'New Product'}</h4>
          <button className="btn btn-sm btn-light" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form
          className="d-grid gap-3"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit()
          }}
        >
          <div>
            <label className="form-label">Product name</label>
            <input
              type="text"
              className="form-control"
              value={values.name}
              onChange={(event) => onFieldChange('name', event.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows={3}
              value={values.description}
              onChange={(event) => onFieldChange('description', event.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Photo</label>
            <div className="d-flex gap-2 mb-2">
              <button
                type="button"
                className={`btn btn-sm ${values.imageSource === 'url' ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => onImageSourceChange('url')}
              >
                Image URL
              </button>
              <button
                type="button"
                className={`btn btn-sm ${values.imageSource === 'upload' ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => onImageSourceChange('upload')}
              >
                Upload Image
              </button>
            </div>

            {values.imageSource === 'url' ? (
              <input
                type="url"
                className="form-control"
                placeholder="https://example.com/image.jpg"
                value={values.photoUrl}
                onChange={(event) => onFieldChange('photoUrl', event.target.value)}
              />
            ) : (
              <div className="d-grid gap-2">
                <input type="file" accept="image/*" className="form-control" onChange={onImageUpload} />
                {values.uploadedImageDataUrl && (
                  <div className="upload-preview rounded-3 overflow-hidden">
                    <img src={values.uploadedImageDataUrl} alt="Uploaded preview" className="product-image" />
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="row g-3">
            <div className="col-4">
              <label className="form-label">Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                value={values.price}
                onChange={(event) => onFieldChange('price', event.target.value)}
              />
            </div>
            <div className="col-4">
              <label className="form-label">Currency</label>
              <input
                type="text"
                className="form-control"
                maxLength={3}
                value={values.currency}
                onChange={(event) => onFieldChange('currency', event.target.value)}
              />
            </div>
            <div className="col-4">
              <label className="form-label">Unit</label>
              <input
                type="text"
                className="form-control"
                value={values.unit}
                onChange={(event) => onFieldChange('unit', event.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-warning fw-semibold">
            {isEditing ? 'Save Changes' : 'Create Product'}
          </button>
        </form>
      </motion.section>
    </motion.div>
  )
}
