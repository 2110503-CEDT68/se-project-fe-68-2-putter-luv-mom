import { sortMenuItems, toggleDirection } from '../libs/menuSort'
import { MenuItem } from '../libs/getMenus'

const items: MenuItem[] = [
  { _id: '1', name: 'Tom Yum', price: 80, category: 'Soup', venueId: 'v1', createdAt: '' },
  { _id: '2', name: 'Pad Thai', price: 120, category: 'Main', venueId: 'v1', createdAt: '' },
  { _id: '3', name: 'Mango Sticky Rice', price: 60, category: 'Dessert', venueId: 'v1', createdAt: '' },
]

describe('sortMenuItems', () => {
  it('sorts by name ascending', () => {
    const result = sortMenuItems(items, 'name', 'asc')
    expect(result[0].name).toBe('Mango Sticky Rice')
    expect(result[2].name).toBe('Tom Yum')
  })

  it('sorts by name descending', () => {
    const result = sortMenuItems(items, 'name', 'desc')
    expect(result[0].name).toBe('Tom Yum')
  })

  it('sorts by price ascending', () => {
    const result = sortMenuItems(items, 'price', 'asc')
    expect(result[0].price).toBe(60)
    expect(result[2].price).toBe(120)
  })

  it('sorts by price descending', () => {
    const result = sortMenuItems(items, 'price', 'desc')
    expect(result[0].price).toBe(120)
  })

  it('sorts by category ascending', () => {
    const result = sortMenuItems(items, 'category', 'asc')
    expect(result[0].category).toBe('Dessert')
  })

  it('does not mutate the original array', () => {
    const original = [...items]
    sortMenuItems(items, 'price', 'asc')
    expect(items).toEqual(original)
  })
})

describe('toggleDirection', () => {
  it('toggles asc to desc', () => {
    expect(toggleDirection('asc')).toBe('desc')
  })

  it('toggles desc to asc', () => {
    expect(toggleDirection('desc')).toBe('asc')
  })
})
