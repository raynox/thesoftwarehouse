const validateGenres = (items, { req }) => {
  const genres = Array.isArray(items) ? items : [items]
  const validation = genres.every(item => req.db.genres.includes(item))
  // eslint-disable-next-line prefer-promise-reject-errors
  if (!validation) return Promise.reject('genres can only contain predefined values')
  return Promise.resolve()
}

module.exports = validateGenres
