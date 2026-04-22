import { addBookmark, removeBookmark, isBookmarked, getBookmarks } from '@/libs/bookmarkService'

const mockStorage: Record<string, string> = {}

beforeEach(() => {
  Object.keys(mockStorage).forEach((k) => delete mockStorage[k])
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: (k: string) => mockStorage[k] ?? null,
      setItem: (k: string, v: string) => { mockStorage[k] = v },
      removeItem: (k: string) => { delete mockStorage[k] },
      clear: () => { Object.keys(mockStorage).forEach((k) => delete mockStorage[k]) },
    },
    writable: true,
  })
})

describe('bookmarkService', () => {
  it('returns empty list initially', () => {
    expect(getBookmarks()).toEqual([])
  })

  it('adds a bookmark', () => {
    addBookmark({ id: 'r1', name: 'Test Restaurant' })
    expect(getBookmarks()).toHaveLength(1)
    expect(getBookmarks()[0].id).toBe('r1')
  })

  it('does not add duplicate bookmark', () => {
    addBookmark({ id: 'r1', name: 'Test Restaurant' })
    addBookmark({ id: 'r1', name: 'Test Restaurant' })
    expect(getBookmarks()).toHaveLength(1)
  })

  it('checks isBookmarked correctly', () => {
    addBookmark({ id: 'r2', name: 'Another Restaurant' })
    expect(isBookmarked('r2')).toBe(true)
    expect(isBookmarked('r3')).toBe(false)
  })

  it('removes a bookmark', () => {
    addBookmark({ id: 'r1', name: 'Test Restaurant' })
    removeBookmark('r1')
    expect(getBookmarks()).toHaveLength(0)
    expect(isBookmarked('r1')).toBe(false)
  })

  it('persists multiple bookmarks', () => {
    addBookmark({ id: 'r1', name: 'Restaurant A' })
    addBookmark({ id: 'r2', name: 'Restaurant B' })
    addBookmark({ id: 'r3', name: 'Restaurant C' })
    removeBookmark('r2')
    const result = getBookmarks()
    expect(result).toHaveLength(2)
    expect(result.map((r) => r.id)).toEqual(['r1', 'r3'])
  })
})
