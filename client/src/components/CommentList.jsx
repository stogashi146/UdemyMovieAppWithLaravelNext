import { Grid } from '@mui/material'
import React from 'react'
import Comment from './Comment'
import laravelAxios from '@/lib/laravelAxios'

const CommentList = ({ comments, setComments }) => {
  const handleDelete = async commentId => {
    try {
      const response = await laravelAxios.delete(`api/comments/${commentId}`)
      console.log(response)

      const filterdComments = comments.filter(
        comment => comment.id !== commentId,
      )
      setComments(filterdComments)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {comments.map(comment => (
        <Grid item xs={12} key={comment.id}>
          <Comment comment={comment} handleDelete={handleDelete} />
        </Grid>
      ))}
    </Grid>
  )
}

export default CommentList
