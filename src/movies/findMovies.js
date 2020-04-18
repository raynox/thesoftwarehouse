const sample = require('lodash.sample')
const intersection = require('lodash.intersection')
const sortBy = require('lodash.sortby')

const checkDuration = (runtime, duration) =>
  runtime >= duration - 10 && runtime <= duration + 10

const findMovies = (items, duration = null, genres = []) => {
  let movie, movies

  if (!duration && !genres.length) {
    movie = sample(items)
    movies = movie ? [movie] : []
  }

  if (duration && !genres.length) {
    movie = sample(items.filter(({ runtime }) => checkDuration(runtime, duration)))
    movies = movie ? [movie] : []
  }

  if (!duration && genres.length) {
    movies = sortBy(
      items.filter(item => intersection(genres, item.genres).length !== 0),
      [item => (genres.length + 1) - intersection(genres, item.genres).length]
    )
  }

  if (duration && genres.length) {
    movies = sortBy(
      items.filter(item => intersection(genres, item.genres).length !== 0 && checkDuration(item.runtime, duration)),
      [item => (genres.length + 1) - intersection(genres, item.genres).length]
    )
  }

  return movies
}

module.exports = findMovies
