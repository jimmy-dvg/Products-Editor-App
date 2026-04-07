import { FiEdit, FiTrash2 } from 'react-icons/fi'
import type { Product } from '../types/product'

type ProductCardProps = {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
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
          onClick={() => onEdit(product)}
        >
          <FiEdit />
        </button>
        <button
          className="btn btn-sm btn-outline-danger"
          type="button"
          aria-label="Delete product"
          title="Delete"
          onClick={() => onDelete(product)}
        >
          <FiTrash2 />
        </button>
      </div>
    </article>
  )
}
