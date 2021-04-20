import useSWR from 'swr'
import { useQueryParam, StringParam, NumberParam } from 'use-query-params'

import { useFavorites } from './useFavorites'

export const useData = () => {
  /**
   * Query params
   */
  const [query] = useQueryParam('q', StringParam)
  const [showFavorites] = useQueryParam('starred', StringParam)
  const [year] = useQueryParam('year', NumberParam)

  /**
   * Get saved meteorites from local storage
   */
  const favoriteMeteorites = useFavorites()

  /**
   * Fetch data
   */
  let { data, isValidating } = useSWR('data', () =>
    fetch('https://data.nasa.gov/resource/y77d-th95.json?$limit=50000').then((response) =>
      response.json()
    )
  )

  /**
   * Filter rows
   */
  data = data
    ?.filter(
      (row) =>
        !query ||
        row?.id?.includes(query) ||
        row.name?.toLowerCase().includes?.(query.toLowerCase())
    )
    ?.filter((row) => (showFavorites ? favoriteMeteorites.includes(row.id) : true))
    ?.filter((row) => (year && row.year ? row.year.startsWith(`${year}`) : true))
    ?.filter((row) => (year && !row.year ? false : true))

  return {
    data,
    isValidating,
  }
}
