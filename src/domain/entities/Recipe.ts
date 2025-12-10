export type Recipe = {
  id: string
  title: string
  description?: string
  ingredients: string[]
  steps: string[]
  categoryId: string
  createdAt: Date
}

