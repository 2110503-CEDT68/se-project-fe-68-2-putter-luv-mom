import { validateMenuForm, isValidMenuData } from '../libs/menuValidation'

describe('validateMenuForm', () => {
  it('returns no errors for valid input', () => {
    const errors = validateMenuForm({ name: 'Pad Thai', price: '120', category: 'Main' })
    expect(isValidMenuData(errors)).toBe(true)
  })

  it('requires name field', () => {
    const errors = validateMenuForm({ name: '', price: '100', category: 'Main' })
    expect(errors.name).toBeDefined()
  })

  it('rejects name shorter than 2 characters', () => {
    const errors = validateMenuForm({ name: 'A', price: '100', category: 'Main' })
    expect(errors.name).toBeDefined()
  })

  it('requires price field', () => {
    const errors = validateMenuForm({ name: 'Pad Thai', price: '', category: 'Main' })
    expect(errors.price).toBeDefined()
  })

  it('rejects non-numeric price', () => {
    const errors = validateMenuForm({ name: 'Pad Thai', price: 'abc', category: 'Main' })
    expect(errors.price).toBeDefined()
  })

  it('rejects negative price', () => {
    const errors = validateMenuForm({ name: 'Pad Thai', price: '-10', category: 'Main' })
    expect(errors.price).toBeDefined()
  })

  it('allows price of 0', () => {
    const errors = validateMenuForm({ name: 'Complimentary Item', price: '0', category: 'Extras' })
    expect(errors.price).toBeUndefined()
  })

  it('requires category field', () => {
    const errors = validateMenuForm({ name: 'Pad Thai', price: '120', category: '' })
    expect(errors.category).toBeDefined()
  })

  it('returns multiple errors when multiple fields invalid', () => {
    const errors = validateMenuForm({ name: '', price: 'bad', category: '' })
    expect(errors.name).toBeDefined()
    expect(errors.price).toBeDefined()
    expect(errors.category).toBeDefined()
    expect(isValidMenuData(errors)).toBe(false)
  })
})
