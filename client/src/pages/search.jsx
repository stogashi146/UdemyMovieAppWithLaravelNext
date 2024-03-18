import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const search = () => {
  const [results, setResults] = useState([])
  const router = useRouter()
  const { query: searchQuery } = router.query

  useEffect(() => {
    if (!searchQuery) {
      return
    }
    const fetchMedia = async () => {
      try {
        const response = await axios.get(
          `api/searchMedia?searchQuery=${encodeURI(searchQuery)}`,
        )
        const searchResults = response.data.results

        const validResults = searchResults.filter(
          item => item.media_type == 'movie' || item.media_type == 'tv',
        )
        setResults(validResults)
        console.log(results)
      } catch (error) {
        console.log(error)
      }
    }
    fetchMedia()
  }, [searchQuery])

  return <div>search</div>
}
export default search
