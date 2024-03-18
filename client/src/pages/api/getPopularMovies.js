import axios from '@/lib/axios'

async function handler(req, res) {
  try {
    const response = await axios(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=ja-JP`,
    )
    res.status(200).json(response.data)
    console.log('取得した結果は。。。', response.data)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'エラー発生しました' })
  }
}

export default handler
