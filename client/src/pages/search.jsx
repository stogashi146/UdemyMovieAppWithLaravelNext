import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layouts/Layout'
import SideBar from '@/components/SideBar'
import MediaCard from '@/components/MediaCard'
import { Grid } from '@mui/material'

const search = () => {
  const [category, setCategory] = useState('all')
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
        console.log(validResults)
      } catch (error) {
        console.log(error)
      }
    }
    fetchMedia()
  }, [searchQuery])

  const filterdResults = results.filter(result => {
    if (category == 'all') {
      return true
    }
    return result.media_type === category
  })

  return (
    <AppLayout
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Search
        </h2>
      }>
      <Head>
        <title>Laravel - Search</title>
      </Head>
      <Layout sidebar={<SideBar setCategory={setCategory} />}>
        <Grid container spacing={3}>
          {filterdResults.map(media => (
            <MediaCard item={media} />
          ))}
        </Grid>
      </Layout>
    </AppLayout>
  )
}
export default search
