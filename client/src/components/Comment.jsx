import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'

const Comment = ({
  comment,
  handleDelete,
  handleEdit,
  editMode,
  editedContent,
  setEditedContent,
  handleConfirmEdit,
}) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {comment.user.name}
        </Typography>
        {editMode === comment.id ? (
          <TextField
            minRows={3}
            rows={3}
            onChange={e => setEditedContent(e.target.value)}
            value={editedContent}
            sx={{ width: '100%' }}
          />
        ) : (
          <>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              gutterBottom
              paragraph>
              {comment.content}
            </Typography>
          </>
        )}

        <Grid container justifyContent="flex-end">
          {editMode === comment.id ? (
            <Button onClick={() => handleConfirmEdit(comment.id)}>
              編集確定
            </Button>
          ) : (
            <ButtonGroup>
              <Button onClick={() => handleEdit(comment)}>編集</Button>
              <Button color="error" onClick={() => handleDelete(comment.id)}>
                削除
              </Button>
            </ButtonGroup>
          )}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Comment
