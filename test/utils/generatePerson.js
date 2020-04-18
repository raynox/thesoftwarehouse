const faker = require('faker')

const generatePerson = () => `${faker.name.firstName()} ${faker.name.lastName()}`

module.exports = generatePerson
