import { useEffect } from 'react'
import { usePreorder } from './usePreorder'

const STORAGE_KEY = 'preorder_backup'

/**
 * Syncs preorder state to localStorage as a secondary backup
 * (primary persistence is handled by redux-persist)
 */
export function usePreorderPersist() {
  const { items } = usePreorder()

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])
}
