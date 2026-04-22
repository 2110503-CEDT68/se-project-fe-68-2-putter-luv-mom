'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  BookmarkedRestaurant,
  addBookmark,
  removeBookmark,
  isBookmarked,
  getBookmarks,
} from '@/libs/bookmarkService'

export function useBookmark(restaurantId: string, restaurantName: string = '') {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSaved(isBookmarked(restaurantId))
  }, [restaurantId])

  const toggle = useCallback(() => {
    setSaved((prev) => {
      if (prev) {
        removeBookmark(restaurantId)
      } else {
        addBookmark({ id: restaurantId, name: restaurantName })
      }
      return !prev
    })
  }, [restaurantId, restaurantName])

  return { saved, toggle }
}

export function useBookmarkList() {
  const [bookmarks, setBookmarks] = useState<BookmarkedRestaurant[]>([])

  useEffect(() => {
    setBookmarks(getBookmarks())
  }, [])

  const remove = useCallback((id: string) => {
    removeBookmark(id)
    setBookmarks((prev) => prev.filter((r) => r.id !== id))
  }, [])

  return { bookmarks, remove }
}
