const fs = require('fs')
const dbPath = process.env.DB_PATH

const setDB = (genres = [], movies = []) => fs.writeFileSync(dbPath, JSON.stringify({ genres, movies }))

module.exports = setDB
module.exports.dbPath = dbPath
