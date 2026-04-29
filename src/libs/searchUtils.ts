import { RestaurantItem } from './getRestaurants'

export type SortOption = 'rating_desc' | 'rating_asc' | 'name_asc' | 'name_desc' | ''
export type DistanceOption = '' | '500' | '1000' | '5000' | '10000'

export interface FilterParams {
  query?: string
  category?: string
  province?: string
  district?: string
  minRating?: string
  sort?: SortOption
  // distance filtering (metres) — requires userLat/userLng
  maxDistance?: DistanceOption
  userLat?: number
  userLng?: number
}

// ── Haversine distance in metres ────────────────────────────────────────────
function haversineMetres(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ── Individual filters ───────────────────────────────────────────────────────

export function filterByKeyword(list: RestaurantItem[], query: string): RestaurantItem[] {
  if (!query.trim()) return list
  const q = query.toLowerCase()
  return list.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      (r.address ?? '').toLowerCase().includes(q) ||
      (r.province ?? '').toLowerCase().includes(q) ||
      (r.district ?? '').toLowerCase().includes(q)
  )
}

export function filterByCategory(list: RestaurantItem[], category: string): RestaurantItem[] {
  if (!category) return list
  return list.filter((r) => r.category === category)
}

export function filterByProvince(list: RestaurantItem[], province: string): RestaurantItem[] {
  if (!province) return list
  return list.filter((r) => (r.province ?? '') === province)
}

export function filterByDistrict(list: RestaurantItem[], district: string): RestaurantItem[] {
  if (!district) return list
  return list.filter((r) => (r.district ?? '') === district)
}

export function filterByRating(list: RestaurantItem[], minRating: string): RestaurantItem[] {
  if (!minRating) return list
  const min = parseFloat(minRating)
  return list.filter((r) => {
    const avg = parseFloat(String(r.averageRating))
    return !isNaN(avg) && avg >= min
  })
}

export function filterByDistance(
  list: RestaurantItem[],
  maxDistance: DistanceOption,
  userLat?: number,
  userLng?: number
): RestaurantItem[] {
  if (!maxDistance || userLat == null || userLng == null) return list
  const max = parseFloat(maxDistance)
  return list.filter((r) => {
    if (r.lat == null || r.lng == null) return false
    return haversineMetres(userLat, userLng, r.lat, r.lng) <= max
  })
}

export function sortRestaurants(list: RestaurantItem[], sort: SortOption): RestaurantItem[] {
  if (!sort) return list
  const sorted = [...list]
  sorted.sort((a, b) => {
    const rA = parseFloat(String(a.averageRating)) || 0
    const rB = parseFloat(String(b.averageRating)) || 0
    switch (sort) {
      case 'rating_desc': return rB - rA
      case 'rating_asc':  return rA - rB
      case 'name_asc':    return a.name.localeCompare(b.name)
      case 'name_desc':   return b.name.localeCompare(a.name)
      default:            return 0
    }
  })
  return sorted
}

export function applyFilters(list: RestaurantItem[], params: FilterParams): RestaurantItem[] {
  let result = filterByKeyword(list, params.query ?? '')
  result = filterByCategory(result, params.category ?? '')
  result = filterByProvince(result, params.province ?? '')
  result = filterByDistrict(result, params.district ?? '')
  result = filterByRating(result, params.minRating ?? '')
  result = filterByDistance(result, params.maxDistance ?? '', params.userLat, params.userLng)
  result = sortRestaurants(result, params.sort ?? '')
  return result
}

// ── Extract helpers ──────────────────────────────────────────────────────────

export function extractCategories(list: RestaurantItem[]): string[] {
  return Array.from(new Set(list.map((r) => r.category).filter(Boolean))).sort() as string[]
}

export function extractProvinces(list: RestaurantItem[]): string[] {
  return Array.from(new Set(list.map((r) => r.province).filter(Boolean))).sort() as string[]
}

export function extractDistricts(list: RestaurantItem[], province?: string): string[] {
  const filtered = province ? list.filter((r) => r.province === province) : list
  return Array.from(new Set(filtered.map((r) => r.district).filter(Boolean))).sort() as string[]
}
