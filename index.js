require('dotenv').config()
require('express-group-routes')
const loadDB = require('./src/utils/middlewares/loadDB')
const express = require('express')
const movies = require('./src/movies')

const app = express()
const port = 4000
app.use(express.json())

app.group(router => {
  router.use(loadDB)

  // init resources
  movies(router)
})

app.listen(port, () => console.log(`App is listening at http://localhost:${port}`))

module.exports = app
