const faker = require('faker')
const generatePerson = require('../../test/utils/generatePerson')

const generateMovie = (id = 1, genres = [], runtime) => ({
  id,
  genres,
  title: faker.lorem.word(),
  year: faker.random.number(),
  runtime: runtime || faker.random.number(),
  director: generatePerson(),
  actors: [generatePerson(), generatePerson()],
  plot: faker.lorem.word(),
  posterUrl: faker.internet.url()
})

module.exports = generateMovie
