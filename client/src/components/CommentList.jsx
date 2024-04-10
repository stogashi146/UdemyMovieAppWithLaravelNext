import { Grid } from '@mui/material'
import React, { useState } from 'react'
import Comment from './Comment'
import laravelAxios from '@/lib/laravelAxios'
import { content } from '../../tailwind.config'

const CommentList = ({ comments, setComments }) => {
  const [editMode, setEditMode] = useState(null)
  const [editedContent, setEditedContent] = useState('')

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

  const handleEdit = comment => {
    setEditMode(comment.id)
    setEditedContent(comment.content)
  }

  const handleConfirmEdit = async commentId => {
    try {
      const response = await laravelAxios.put(`api/comments/${commentId}`, {
        content: editedContent,
      })
      setEditMode(null)
      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            content: response.data.content,
          }
        }
        return comment
      })
      setComments(updatedComments)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {comments.map(comment => (
        <Grid item xs={12} key={comment.id}>
          <Comment
            comment={comment}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            editMode={editMode}
            editedContent={editedContent}
            setEditedContent={setEditedContent}
            handleConfirmEdit={handleConfirmEdit}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default CommentList
