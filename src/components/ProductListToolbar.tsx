import { FiPackage, FiPlus, FiSearch } from 'react-icons/fi'

type ProductListToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  onCreate: () => void
}

export function ProductListToolbar({ search, onSearchChange, onCreate }: ProductListToolbarProps) {
  return (
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
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        <button className="btn btn-warning fw-semibold d-inline-flex align-items-center gap-2" onClick={onCreate}>
          <FiPlus /> New Product
        </button>
      </div>
    </div>
  )
}
