import SavedRestaurantList from '@/components/SavedRestaurantList'
import { Bookmark } from 'lucide-react'

export default function SavedPage() {
  return (
    <main className="min-h-screen bg-neutral-900 px-6 py-10 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Bookmark className="text-yellow-500" size={24} />
        <h1 className="font-playfair text-2xl text-yellow-500">Saved Restaurants</h1>
      </div>
      <SavedRestaurantList />
    </main>
  )
}
