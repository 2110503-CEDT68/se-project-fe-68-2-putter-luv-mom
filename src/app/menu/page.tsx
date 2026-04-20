import { getMenusByVenue } from '@/libs/getMenus'
import getVenues from '@/libs/getVenues'
import MenuGalleryClient from './MenuGalleryClient'
import VenueMenuPicker from './VenueMenuPicker'

interface MenuPageProps {
  searchParams: Promise<{ venueId?: string; venueName?: string }>
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const { venueId, venueName } = await searchParams

  if (!venueId) {
    const venuesJson = await getVenues().catch(() => ({ data: [] }))
    return <VenueMenuPicker venues={venuesJson.data} />
  }

  let initialMenus: Awaited<ReturnType<typeof getMenusByVenue>>['data'] = []
  try {
    const json = await getMenusByVenue(venueId)
    initialMenus = json.data
  } catch {
    // Server-side fetch failure — client will show empty state
  }

  return <MenuGalleryClient initialMenus={initialMenus} venueName={venueName} />
}
