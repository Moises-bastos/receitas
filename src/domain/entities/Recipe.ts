export type Recipe = {
  id: string
  title: string
  description?: string
  ingredients: { name: string; quantity: number; unit: string }[]
  steps: string[]
  categoryId: string
  createdAt: Date
}
