const { check, validationResult } = require('express-validator')
const fs = require('fs')

const validateGenres = (items, { req }) => {
  const validation = items.every(item => req.db.genres.includes(item))
  // eslint-disable-next-line prefer-promise-reject-errors
  if (!validation) return Promise.reject('genres can only contain predefined values')
  return Promise.resolve()
}

const validators = [
  check('genres')
    .exists().withMessage('genres is required')
    .isArray({ min: 1 }).withMessage('genres cannot be empty')
    .custom(validateGenres),
  check('title')
    .exists().withMessage('title is required')
    .isString().withMessage('title has to be a string')
    .isLength({ min: 1 }).withMessage('title has to be longer than 1 character')
    .isLength({ max: 255 }).withMessage('title cannot be longer than 255 characters'),
  check('year')
    .exists().withMessage('year is required')
    .isNumeric().withMessage('year has to be numeric'),
  check('runtime')
    .exists().withMessage('runtime is required')
    .isNumeric().withMessage('runtime has to be numeric'),
  check('director')
    .exists().withMessage('director is required')
    .isString().withMessage('director has to be a string')
    .isLength({ min: 1 }).withMessage('director has to be longer than 1 character')
    .isLength({ max: 255 }).withMessage('director cannot be longer than 255 characters'),
  check('actors').optional()
    .isString().withMessage('actors has to be a string'),
  check('plot').optional()
    .isString().withMessage('plot has to be a string'),
  check('posterUrl').optional()
    .isString().withMessage('posterUrl has to be a string')
]

const init = app => {
  app.post('/movies', validators, (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    try {
      const { genres, title, year, runtime, director, actors, plot, posterUrl } = req.body
      const id = req.db.movies.length ? Math.max(...req.db.movies.map(movie => movie.id)) + 1 : 1

      const movie = { id, genres, title, year, runtime, director, actors, plot, posterUrl }

      const newDb = { ...req.db, movies: [...req.db.movies, movie] }
      fs.writeFileSync(process.env.DB_PATH, JSON.stringify(newDb))

      return res.sendStatus(201)
    } catch (e) {
      // todo: log an error
      return res.sendStatus(409)
    }
  })
}

module.exports = init
