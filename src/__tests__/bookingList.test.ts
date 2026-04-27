// Tests for reservation display logic in BookingList
// Mirrors: src/components/BookingList.tsx

const RESTAURANT_NAMES: Record<string, string> = {
  'rest-1': 'The Grand Palace Dining',
  'rest-2': 'Sushiro Premium Zen',
  'rest-3': 'Pony Sweet Cafe',
}

// Mirrors the rid/rname resolution used in BookingList
function resolveRestaurantId(item: any): string | undefined {
  return item.restaurantId || item.restaurant?._id || item.restaurant || item.venue
}

function resolveRestaurantName(item: any, names: Record<string, string>): string {
  const rid = resolveRestaurantId(item)
  return names[rid ?? ''] || item.restaurant?.name || rid || ''
}

function buildOrderLink(item: any, names: Record<string, string>): string | null {
  const rid = resolveRestaurantId(item)
  if (!rid) return null
  const rname = resolveRestaurantName(item, names)
  return `/menu?venueId=${rid}&venueName=${encodeURIComponent(rname)}`
}

// ── resolveRestaurantId ──────────────────────────────────────────────────────

describe('BookingList — resolveRestaurantId', () => {
  it('reads restaurantId field (primary API field)', () => {
    expect(resolveRestaurantId({ restaurantId: 'rest-1' })).toBe('rest-1')
  })

  it('falls back to restaurant._id when restaurantId is absent', () => {
    expect(resolveRestaurantId({ restaurant: { _id: 'rest-2', name: 'X' } })).toBe('rest-2')
  })

  it('falls back to restaurant string when it is a plain ID', () => {
    expect(resolveRestaurantId({ restaurant: 'rest-3' })).toBe('rest-3')
  })

  it('falls back to venue field as last resort', () => {
    expect(resolveRestaurantId({ venue: 'rest-1' })).toBe('rest-1')
  })

  it('returns undefined when no known field is present', () => {
    expect(resolveRestaurantId({})).toBeUndefined()
  })

  it('prefers restaurantId over restaurant when both exist', () => {
    expect(resolveRestaurantId({ restaurantId: 'rest-1', restaurant: 'rest-2' })).toBe('rest-1')
  })

  it('prefers restaurant._id over plain restaurant string', () => {
    expect(resolveRestaurantId({ restaurant: { _id: 'rest-1' } })).toBe('rest-1')
  })
})

// ── resolveRestaurantName ────────────────────────────────────────────────────

describe('BookingList — resolveRestaurantName', () => {
  it('returns name from lookup map using restaurantId', () => {
    const item = { restaurantId: 'rest-1' }
    expect(resolveRestaurantName(item, RESTAURANT_NAMES)).toBe('The Grand Palace Dining')
  })

  it('returns name from lookup map using restaurant string ID', () => {
    const item = { restaurant: 'rest-2' }
    expect(resolveRestaurantName(item, RESTAURANT_NAMES)).toBe('Sushiro Premium Zen')
  })

  it('returns name from lookup map using venue field', () => {
    const item = { venue: 'rest-3' }
    expect(resolveRestaurantName(item, RESTAURANT_NAMES)).toBe('Pony Sweet Cafe')
  })

  it('falls back to restaurant.name when ID not in map', () => {
    const item = { restaurant: { _id: 'unknown-id', name: 'Direct Name' } }
    expect(resolveRestaurantName(item, {})).toBe('Direct Name')
  })

  it('falls back to raw ID when no name and not in map', () => {
    const item = { restaurantId: 'some-unknown-id' }
    expect(resolveRestaurantName(item, {})).toBe('some-unknown-id')
  })

  it('returns empty string when no restaurant info at all', () => {
    expect(resolveRestaurantName({}, RESTAURANT_NAMES)).toBe('')
  })
})

// ── buildOrderLink ───────────────────────────────────────────────────────────

describe('BookingList — buildOrderLink', () => {
  it('builds correct link for a reservation with restaurantId', () => {
    const item = { restaurantId: 'rest-1' }
    const link = buildOrderLink(item, RESTAURANT_NAMES)
    expect(link).toBe('/menu?venueId=rest-1&venueName=The%20Grand%20Palace%20Dining')
  })

  it('builds correct link for a reservation with restaurant string ID', () => {
    const item = { restaurant: 'rest-2' }
    const link = buildOrderLink(item, RESTAURANT_NAMES)
    expect(link).toBe('/menu?venueId=rest-2&venueName=Sushiro%20Premium%20Zen')
  })

  it('URL-encodes special characters in restaurant name', () => {
    const item = { restaurantId: 'rest-x' }
    const names = { 'rest-x': 'ครัวเจ้งอ สาขา2' }
    const link = buildOrderLink(item, names)
    expect(link).toBe(`/menu?venueId=rest-x&venueName=${encodeURIComponent('ครัวเจ้งอ สาขา2')}`)
  })

  it('returns null when no restaurant ID can be resolved', () => {
    expect(buildOrderLink({}, RESTAURANT_NAMES)).toBeNull()
  })
})

// ── Reservation date display ─────────────────────────────────────────────────

describe('BookingList — reservationDate display', () => {
  it('formats reservationDate correctly', () => {
    const date = new Date('2026-04-28T01:38:00.000Z')
    const formatted = date.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
    expect(formatted).toContain('2026')
    expect(formatted).toContain('28')
  })

  it('handles missing reservationDate gracefully', () => {
    const item = { _id: 'r1', restaurantId: 'rest-1' }
    expect((item as any).reservationDate).toBeUndefined()
  })
})
