import React from 'react'
import Typography from '@mui/material/Typography'
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Grid,
} from '@mui/material'

const MediaCard = () => {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card>
        <CardActionArea>
          <CardMedia component={'img'} sx={{ aspectRatio: '2/3' }} />
          <CardContent>
            <Typography variant="h6" component={'div'} noWrap>
              作品名
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              公開日
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  )
}

export default MediaCard
