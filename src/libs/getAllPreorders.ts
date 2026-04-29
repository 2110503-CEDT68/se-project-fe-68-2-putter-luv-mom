const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')

export interface PreorderItemData {
  menuId: string
  name: string
  price: number
  quantity: number
}

export interface PreorderData {
  _id: string
  venueId: string
  items: PreorderItemData[]
  total: number
  updatedAt: string
}

// Admin: GET /preorders returns all. Regular user: must fetch per venueId.
export async function getAllPreorders(token: string, role?: string): Promise<{ success: boolean; data: PreorderData[] }> {
  const headers = { Authorization: `Bearer ${token}` }

  if (role !== 'admin') {
    // Get all restaurant IDs, then fetch each preorder in parallel
    const venuesRes = await fetch(`${API_URL}/api/v1/restaurants?limit=100`, { headers, cache: 'no-store' })
    if (!venuesRes.ok) throw new Error(`Failed to fetch restaurants (${venuesRes.status})`)
    const venuesJson = await venuesRes.json()
    const venueIds: string[] = (venuesJson.data ?? []).map((v: { _id: string }) => v._id)

    const results = await Promise.all(
      venueIds.map(async (id) => {
        const r = await fetch(`${API_URL}/api/v1/preorders/${id}`, { headers, cache: 'no-store' })
        if (!r.ok) return null
        const j = await r.json()
        const d = j.data
        if (!d || !d.items || d.items.length === 0) return null
        return { _id: d._id ?? id, venueId: id, items: d.items, total: d.total ?? 0, updatedAt: d.updatedAt ?? '' } as PreorderData
      })
    )
    const data = results.filter(Boolean) as PreorderData[]
    return { success: true, data }
  }

  // Admin path
  const res = await fetch(`${API_URL}/api/v1/preorders`, { headers, cache: 'no-store' })
  if (res.status === 404) return { success: true, data: [] }
  if (!res.ok) throw new Error(`Failed to fetch preorders (${res.status})`)
  const json = await res.json()
  return { ...json, data: json.data ?? [] }
}

export async function updatePreorderItemQty(venueId: string, menuId: string, quantity: number, token?: string): Promise<void> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_URL}/api/v1/preorders/${venueId}/items/${menuId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ quantity }),
  })
  if (!res.ok) throw new Error('Failed to update item')
}

export async function removePreorderItem(venueId: string, menuId: string, token?: string): Promise<void> {
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_URL}/api/v1/preorders/${venueId}/items/${menuId}`, {
    method: 'DELETE',
    headers,
  })
  if (!res.ok) throw new Error('Failed to remove item')
}

export async function confirmPreorder(
  venueId: string,
  items: { menuId: string; name: string; price: number; quantity: number }[],
  token?: string
): Promise<void> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_URL}/api/v1/preorders/${venueId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ items }),
  })
  if (!res.ok) throw new Error('Failed to confirm preorder')
}
