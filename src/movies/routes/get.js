const findMovies = require('../findMovies')
const { check, validationResult } = require('express-validator')
const validateGenres = require('../validateGenres')

const validators = [
  check('genres').optional()
    .not().isNumeric().withMessage('genres has to be an array or a string')
    .custom(validateGenres),
  check('duration').optional()
    .isNumeric().withMessage('duration has to be numeric')
]

const init = app => {
  app.get('/movies', validators, (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
      }

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
