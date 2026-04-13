export interface MenuValidationErrors {
  name?: string
  price?: string
  category?: string
}

export function validateMenuForm(fields: {
  name: string
  price: string
  category: string
}): MenuValidationErrors {
  const errors: MenuValidationErrors = {}

  if (!fields.name.trim()) {
    errors.name = 'Name is required'
  } else if (fields.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
  }

  const parsed = parseFloat(fields.price)
  if (!fields.price || isNaN(parsed)) {
    errors.price = 'Price must be a valid number'
  } else if (parsed < 0) {
    errors.price = 'Price must be non-negative'
  }

  if (!fields.category.trim()) {
    errors.category = 'Category is required'
  }

  return errors
}

export function isValidMenuData(errors: MenuValidationErrors): boolean {
  return Object.keys(errors).length === 0
}
