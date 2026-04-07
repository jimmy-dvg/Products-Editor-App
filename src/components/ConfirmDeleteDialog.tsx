import { motion } from 'framer-motion'

type ConfirmDeleteDialogProps = {
  productName: string
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDeleteDialog({ productName, onCancel, onConfirm }: ConfirmDeleteDialogProps) {
  return (
    <motion.div
      className="popup-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.section
        className="popup-card rounded-4 p-4"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        onClick={(event) => event.stopPropagation()}
      >
        <h4 className="h5 mb-2">Confirm Delete</h4>
        <p className="text-body-secondary mb-4">
          Are you sure you want to delete <strong>{productName}</strong>?
        </p>
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-light" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </motion.section>
    </motion.div>
  )
}
