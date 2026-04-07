import { FiCheckCircle, FiEdit3 } from 'react-icons/fi'

type ProductEditorHeroProps = {
  averagePrice: number
}

export function ProductEditorHero({ averagePrice }: ProductEditorHeroProps) {
  return (
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
  )
}
