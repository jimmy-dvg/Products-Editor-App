export type Product = {
  id: number
  name: string
  description: string
  photo: string
  price: number
  currency: string
  unit: string
}

export type ImageSource = 'url' | 'upload'

export type ProductFormValues = {
  name: string
  description: string
  imageSource: ImageSource
  photoUrl: string
  uploadedImageDataUrl: string
  price: string
  currency: string
  unit: string
}

export const createEmptyProductFormValues = (): ProductFormValues => ({
  name: '',
  description: '',
  imageSource: 'url',
  photoUrl: '',
  uploadedImageDataUrl: '',
  price: '',
  currency: 'USD',
  unit: 'piece',
})
