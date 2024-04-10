import axios from '@/lib/laravelAxios'
import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Container,
  Fab,
  Grid,
  Modal,
  Rating,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { TextareaAutosize } from '@mui/base/TextareaAutosize'
import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import laravelAxios from '@/lib/laravelAxios'
import AddIcon from '@mui/icons-material/Add'
import StarIcon from '@mui/icons-material/Star'
import { useAuth } from '@/hooks/auth'
import Link from 'next/link'

const Detail = ({ detail, media_type, media_id }) => {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [reviews, setReviews] = useState([])
  const [averageReviews, setAverageRating] = useState(null)
  const [editMode, setEditMode] = useState(null)
  const [editedRating, setEditedRating] = useState(null)
  const [editedContent, setEditedContent] = useState('')
  const { user } = useAuth({ middleware: 'auth' })

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleReviewChange = e => {
    console.log(e.target.value)
    setReview(e.target.value)
  }

  const handleRatingChange = (e, newValue) => {
    setRating(newValue)
  }

  const isButtonDisabled = (rating, content) => {
    return !rating || !content.trim()
  }

  const isReviewButtonDisabled = isButtonDisabled(rating, review)
  const isEditButtonDisabled = isButtonDisabled(editedRating, editedContent)

  const updateAverageRating = updatedReviews => {
    if (updatedReviews.length > 0) {
      const totalRating = updatedReviews.reduce((acc, review) => {
        return acc + review.rating
      }, 0)

      const average = (totalRating / updatedReviews.length).toFixed(1)
      setAverageRating(average)
    } else {
      setAverageRating(null)
    }
  }

  const handleReviewAdd = async () => {
    handleClose()
    try {
      const response = await laravelAxios.post(`api/reviews`, {
        content: review,
        rating: rating,
        media_type: media_type,
        media_id: media_id,
      })
      const newRevew = response.data

      setReviews([...reviews, newRevew])
      console.log(reviews)

      setReview('')
      setRating(0)
      const updateReviews = [...reviews, newRevew]
      updateAverageRating(updateReviews)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async id => {
    if (window.confirm('レビューを削除してもよろしいですか？')) {
      try {
        const response = await laravelAxios.delete(`api/reviews/${id}`)
        console.log(response)
        const filterdReviews = reviews.filter(review => review.id !== id)
        setReviews(filterdReviews)
        updateAverageRating(filterdReviews)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleEdit = review => {
    setEditMode(review.id)
    setEditedRating(review.rating)
    setEditedContent(review.content)
  }

  const handleConfirmEdit = async reviewId => {
    try {
      const response = await laravelAxios.put(`api/review/${reviewId}`, {
        content: editedContent,
        rating: editedRating,
      })
      console.log(response)
      const updatedReview = response.data
      const updatedReviews = reviews.map(review => {
        if (review.id === reviewId) {
          return {
            ...review,
            content: updatedReview.content,
            rating: updatedReview.rating,
          }
        }
        return review
      })
      setEditMode(null)
      setReviews(updatedReviews)
      updateAverageRating(updatedReviews)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await laravelAxios.get(
          `api/reviews/${media_type}/${media_id}`,
        )
        console.log(response)
        const fetchReviews = response.data
        setReviews(fetchReviews)
        updateAverageRating(fetchReviews)
      } catch (error) {
        console.log(error)
      }
    }
    fetchReviews()
  }, [media_type, media_id])

  return (
    <AppLayout
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Detail
        </h2>
      }>
      <Head>
        <title>Laravel - Detail</title>
      </Head>
      <Box
        sx={{
          height: { xs: 'auto', md: '70vh' },
          bgcolor: 'red',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}>
        <Box
          sx={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${detail.backdrop_path})`,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(10px)',
            },
          }}
        />
        <Container sx={{ zIndex: 1 }}>
          <Grid sx={{ color: 'white' }} container alignItems={'center'}>
            <Grid
              item
              md={4}
              sx={{ display: 'flex', justifyContent: 'center' }}>
              <img
                width={'70%'}
                src={`https://image.tmdb.org/t/p/original${detail.poster_path}`}
              />
            </Grid>
            {/* <Grid md={8}> */}
            <Grid>
              <Typography variant="h4" paragraph>
                {detail.title || detail.name}
              </Typography>
              <Typography paragraph>{detail.overview}</Typography>
              <Box
                gap={2}
                sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating
                  readOnly
                  precision={0.5}
                  value={parseFloat(averageReviews)}
                  emptyIcon={<StarIcon style={{ color: 'white' }} />}
                />
                <Typography
                  sx={{ ml: 1, fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {averageReviews}
                </Typography>
              </Box>
              <Typography variant="h6">
                {media_type == 'movie'
                  ? `公開日：${detail.release_date}`
                  : `初回放送日：${detail.first_air_date}`}
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/* レビュー内容表示 */}
      <Container sx={{ py: 4 }}>
        <Typography content={'h1'} variant="h4" align="center" gutterBottom>
          レビュー一覧
        </Typography>
        <Grid container spacing={3}>
          {reviews.map(review => (
            <Grid item xs={12} key={review.id}>
              <Card>
                <CardContent>
                  {editMode === review.id ? (
                    <>
                      {/* 編集ボタンを押されたレビューの見た目 */}
                      <div>
                        <Rating
                          value={editedRating}
                          onChange={e => setEditedRating(e.target.value)}
                        />
                      </div>
                      <TextField
                        multiline
                        rows={3}
                        style={{ width: '100%' }}
                        value={editedContent}
                        onChange={e => setEditedContent(e.target.value)}
                      />
                    </>
                  ) : (
                    <>
                      <Typography variant="h6" component={'div'}>
                        {review.user.name}
                      </Typography>
                      <Rating value={review.rating} readOnly />
                      <Link
                        href={`/detail/${media_type}/${media_id}/review/${review.id}`}>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          paragraph>
                          {review.content}
                        </Typography>
                      </Link>
                    </>
                  )}

                  {user.id === review.user.id && (
                    <Grid sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      {editMode === review.id ? (
                        <Button
                          onClick={() => handleConfirmEdit(review.id)}
                          disabled={isEditButtonDisabled}>
                          編集確定
                        </Button>
                      ) : (
                        <ButtonGroup>
                          <Button onClick={() => handleEdit(review)}>
                            編集
                          </Button>
                          <Button
                            color="error"
                            onClick={() => handleDelete(review.id)}>
                            削除
                          </Button>
                        </ButtonGroup>
                      )}
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box
        sx={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 5,
        }}>
        <Tooltip title="レビュー追加">
          <Fab
            style={{ background: '#1976d2', color: 'white' }}
            onClick={handleOpen}>
            <AddIcon />
          </Fab>
        </Tooltip>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 400,
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}>
          <Typography variant="h6" component="h2">
            レビューを書く
          </Typography>
          <Rating required onChange={handleRatingChange} value={rating} />
          <TextareaAutosize
            required
            minRows={5}
            placeholder="レビュー内容"
            onChange={handleReviewChange}
            value={review}
            style={{ width: '100%', marginTop: '10px' }}
          />
          <Button
            variant="outlined"
            disabled={isReviewButtonDisabled}
            onClick={handleReviewAdd}>
            送信
          </Button>
        </Box>
      </Modal>
    </AppLayout>
  )
}

export async function getServerSideProps(context) {
  const { media_type, media_id } = context.params

  try {
    const jpResponse = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${process.env.TMDB_API_KEY}&language=ja-JP`,
    )

    let combinedData = { ...jpResponse.data }

    if (!jpResponse.data.overview) {
      const enResponse = await axios.get(
        `https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
      )
      combinedData.overview = `${enResponse.data.overview} ※日本語データがないため英語で表示しています`
    }

    return {
      props: { detail: combinedData, media_type: media_type, media_id },
    }
  } catch {
    return { notFound: true }
  }
}
export default Detail
