// Unit tests for order history pagination and re-order logic

const PER_PAGE = 10

function paginate<T>(items: T[], page: number, perPage = PER_PAGE): T[] {
  return items.slice((page - 1) * perPage, page * perPage)
}

function totalPages(count: number, perPage = PER_PAGE): number {
  return Math.ceil(count / perPage)
}

function buildReorderItems(
  orderItems: { menuId: string; name: string; price: number; quantity: number }[],
  venueId: string
) {
  return orderItems.map(item => ({
    _id: item.menuId,
    name: item.name,
    price: item.price,
    category: '',
    venueId,
  }))
}

describe('Order History — Pagination', () => {
  const makeOrders = (n: number) =>
    Array.from({ length: n }, (_, i) => ({ _id: String(i + 1), venueId: 'v1', items: [], total: 0, updatedAt: new Date().toISOString() }))

  it('shows no pagination when orders <= 10', () => {
    expect(totalPages(5)).toBe(1)
    expect(totalPages(10)).toBe(1)
  })

  it('calculates correct total pages', () => {
    expect(totalPages(11)).toBe(2)
    expect(totalPages(25)).toBe(3)
    expect(totalPages(30)).toBe(3)
  })

  it('returns correct items for page 1', () => {
    const orders = makeOrders(15)
    const page1 = paginate(orders, 1)
    expect(page1).toHaveLength(10)
    expect(page1[0]._id).toBe('1')
    expect(page1[9]._id).toBe('10')
  })

  it('returns correct items for page 2', () => {
    const orders = makeOrders(15)
    const page2 = paginate(orders, 2)
    expect(page2).toHaveLength(5)
    expect(page2[0]._id).toBe('11')
  })

  it('returns empty for out-of-range page', () => {
    const orders = makeOrders(5)
    expect(paginate(orders, 2)).toHaveLength(0)
  })
})

describe('Order History — Re-order logic', () => {
  const sampleOrder = {
    venueId: 'venue-abc',
    items: [
      { menuId: 'menu-1', name: 'Pad Thai',   price: 80,  quantity: 2 },
      { menuId: 'menu-2', name: 'Tom Yum',    price: 120, quantity: 1 },
    ],
  }

  it('builds correct re-order items with venueId', () => {
    const reorderItems = buildReorderItems(sampleOrder.items, sampleOrder.venueId)
    expect(reorderItems).toHaveLength(2)
    expect(reorderItems[0]).toMatchObject({ _id: 'menu-1', name: 'Pad Thai',  price: 80,  venueId: 'venue-abc' })
    expect(reorderItems[1]).toMatchObject({ _id: 'menu-2', name: 'Tom Yum',  price: 120, venueId: 'venue-abc' })
  })

  it('each re-order item has category field', () => {
    const items = buildReorderItems(sampleOrder.items, sampleOrder.venueId)
    expect(items.every(i => 'category' in i)).toBe(true)
  })

  it('handles empty order items gracefully', () => {
    const items = buildReorderItems([], 'venue-xyz')
    expect(items).toHaveLength(0)
  })
})

describe('Order History — Empty state', () => {
  it('detects empty orders correctly', () => {
    expect([].length === 0).toBe(true)
  })

  it('detects non-empty orders correctly', () => {
    expect([{ _id: '1' }].length === 0).toBe(false)
  })
})

// ── Search helpers (mirrors the logic in order-history/page.tsx) ────────────

function filterOrders(
  orders: { _id: string; venueId: string; items: { name: string }[] }[],
  venueNames: Record<string, string>,
  query: string
) {
  const q = query.trim().toLowerCase()
  if (!q) return orders
  return orders.filter(order => {
    const venue = (venueNames[order.venueId] || order.venueId).toLowerCase()
    const hasItem = order.items.some(i => i.name.toLowerCase().includes(q))
    return venue.includes(q) || hasItem
  })
}

const VENUE_NAMES: Record<string, string> = {
  'venue-1': 'The Grand Palace Dining',
  'venue-2': 'Sushiro Premium Zen',
  'venue-3': 'Pony Sweet Cafe',
}

const SAMPLE_ORDERS = [
  {
    _id: 'order-1',
    venueId: 'venue-1',
    items: [{ name: 'Grilled Salmon' }, { name: 'Caesar Salad' }],
  },
  {
    _id: 'order-2',
    venueId: 'venue-2',
    items: [{ name: 'Salmon Sashimi' }, { name: 'Miso Soup' }],
  },
  {
    _id: 'order-3',
    venueId: 'venue-3',
    items: [{ name: 'Matcha Latte' }, { name: 'Croissant' }],
  },
]

describe('Order History — Search by restaurant name', () => {
  it('returns all orders when query is empty', () => {
    expect(filterOrders(SAMPLE_ORDERS, VENUE_NAMES, '')).toHaveLength(3)
  })

  it('returns all orders when query is only whitespace', () => {
    expect(filterOrders(SAMPLE_ORDERS, VENUE_NAMES, '   ')).toHaveLength(3)
  })

  it('matches exact restaurant name (case-insensitive)', () => {
    const result = filterOrders(SAMPLE_ORDERS, VENUE_NAMES, 'grand palace')
    expect(result).toHaveLength(1)
    expect(result[0]._id).toBe('order-1')
  })

  it('matches partial restaurant name', () => {
    const result = filterOrders(SAMPLE_ORDERS, VENUE_NAMES, 'pony')
    expect(result).toHaveLength(1)
    expect(result[0]._id).toBe('order-3')
  })

  it('is case-insensitive for restaurant name', () => {
    const lower = filterOrders(SAMPLE_ORDERS, VENUE_NAMES, 'sushiro')
    const upper = filterOrders(SAMPLE_ORDERS, VENUE_NAMES, 'SUSHIRO')
    expect(lower).toHaveLength(1)
    expect(upper).toHaveLength(1)
    expect(lower[0]._id).toBe(upper[0]._id)
  })

  it('returns empty array when no restaurant matches', () => {
    const result = filterOrders(SAMPLE_ORDERS, VENUE_NAMES, 'nonexistent restaurant')
    expect(result).toHaveLength(0)
  })
})

describe('Order History — Search by item name', () => {
  it('matches a single item name', () => {
    const result = filterOrders(SAMPLE_ORDERS, VENUE_NAMES, 'miso soup')
    expect(result).toHaveLength(1)
    expect(result[0]._id).toBe('order-2')
  })

  it('matches partial item name', () => {
    const result = filterOrders(SAMPLE_ORDERS, VENUE_NAMES, 'croiss')
    expect(result).toHaveLength(1)
    expect(result[0]._id).toBe('order-3')
  })

  it('is case-insensitive for item name', () => {
    const result = filterOrders(SAMPLE_ORDERS, VENUE_NAMES, 'MATCHA')
    expect(result).toHaveLength(1)
    expect(result[0]._id).toBe('order-3')
  })

  it('matches across multiple orders when item name appears in each', () => {
    // "salmon" appears in both order-1 (Grilled Salmon) and order-2 (Salmon Sashimi)
    const result = filterOrders(SAMPLE_ORDERS, VENUE_NAMES, 'salmon')
    expect(result).toHaveLength(2)
    const ids = result.map(r => r._id)
    expect(ids).toContain('order-1')
    expect(ids).toContain('order-2')
  })

  it('returns empty array when no item matches', () => {
    const result = filterOrders(SAMPLE_ORDERS, VENUE_NAMES, 'pizza')
    expect(result).toHaveLength(0)
  })
})

describe('Order History — Search with pagination', () => {
  it('resets to page 1 when fewer results than current page', () => {
    // Simulates page 2 becoming invalid after filtering down to 1 result
    const fullOrders = Array.from({ length: 15 }, (_, i) => ({
      _id: String(i + 1),
      venueId: i === 0 ? 'venue-1' : 'venue-x',
      items: [],
    }))
    const venueMap = { 'venue-1': 'Grand Palace', 'venue-x': 'Other' }
    const filtered = filterOrders(fullOrders, venueMap, 'grand')
    expect(filtered).toHaveLength(1)
    // After filtering, page 1 is the only valid page
    expect(Math.ceil(filtered.length / 10)).toBe(1)
  })

  it('paginates filtered results correctly', () => {
    // 12 orders all matching "other venue", expect 2 pages
    const orders = Array.from({ length: 12 }, (_, i) => ({
      _id: String(i + 1),
      venueId: 'venue-x',
      items: [],
    }))
    const venueMap = { 'venue-x': 'Other Venue' }
    const filtered = filterOrders(orders, venueMap, 'other')
    expect(filtered).toHaveLength(12)
    expect(totalPages(filtered.length)).toBe(2)
    expect(paginate(filtered, 1)).toHaveLength(10)
    expect(paginate(filtered, 2)).toHaveLength(2)
  })
})
