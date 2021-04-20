import useSWR from 'swr'

/**
 * Key used for local storage
 */
export const LOCAL_STORAGE_KEY = 'FAVORITE_METEORITES'

/**
 * Get saved meteorites from local storage
 */
export const useFavorites = () => {
  const { data: favoriteMeteorites } = useSWR(
    'favorites',
    async () => {
      try {
        return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || [])
      } catch (e) {
        return []
      }
    },
    {
      revalidateOnFocus: true,
    }
  )

  return favoriteMeteorites
}
