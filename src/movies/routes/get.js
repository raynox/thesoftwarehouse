const findMovies = require('../findMovies')

const init = app => {
  app.get('/movies', (req, res) => {
    try {
      const duration = parseInt(req.query.duration)
      const genres = req.query.genres
        ? (Array.isArray(req.query.genres) ? req.query.genres : [req.query.genres])
        : []

      return res.send(findMovies(req.db.movies, duration, genres))
    } catch (e) {
      // todo: log an error
      return res.sendStatus(409)
    }
  })
}

module.exports = init
