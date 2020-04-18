const post = require('./routes/post')
const get = require('./routes/get')

const init = (app) => {
  post(app)
  get(app)
}

module.exports = init
