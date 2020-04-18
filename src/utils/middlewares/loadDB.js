const fs = require('fs')

const loadDB = (req, _, next) => {
  const file = JSON.parse(fs.readFileSync(process.env.DB_PATH))
  req.db = file
  next()
}

module.exports = loadDB
