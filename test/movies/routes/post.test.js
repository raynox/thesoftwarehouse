process.env.NODE_ENV = 'test'
process.env.DB_PATH = './test/movies/testdb.json'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../../index')
const chaiSubset = require('chai-subset')
const faker = require('faker')
const fs = require('fs')
const setDB = require('../../utils/setDB')
const { dbPath } = setDB
const generatePerson = require('../../utils/generatePerson')

chai.should()
chai.use(chaiHttp)
chai.use(chaiSubset)

describe('POST movies', () => {
  beforeEach(() => setDB())
  afterEach(() => fs.unlinkSync(dbPath))

  it('should create a movie', async () => {
    const id = 1
    const genres = [faker.lorem.word()]
    const title = faker.lorem.word()
    const year = faker.random.number()
    const runtime = faker.random.number()
    const director = generatePerson()

    setDB(genres)
    const movie = { id, genres, title, year, runtime, director }
    const res = await chai.request(server).post('/movies').send(movie)
    const { movies } = JSON.parse(fs.readFileSync(dbPath))

    res.should.have.status(201)
    movies[0].should.be.eql(movie)
  })

  it('should validate required fields', async () => {
    const movie = {}
    const res = await chai.request(server).post('/movies').send(movie)

    res.should.have.status(422)
    res.body.errors.should.containSubset([{ param: 'title', msg: 'title is required' }])
    res.body.errors.should.containSubset([{ param: 'genres', msg: 'genres is required' }])
    res.body.errors.should.containSubset([{ param: 'year', msg: 'year is required' }])
    res.body.errors.should.containSubset([{ param: 'runtime', msg: 'runtime is required' }])
    res.body.errors.should.containSubset([{ param: 'director', msg: 'director is required' }])
  })

  it('should validate empty title', async () => {
    const movie = { title: '' }
    const res = await chai.request(server).post('/movies').send(movie)

    res.should.have.status(422)
    res.body.errors.should.containSubset([{ param: 'title', msg: 'title has to be longer than 1 character' }])
  })

  it('should validate too long title', async () => {
    const movie = { title: faker.lorem.sentence(256) }
    const res = await chai.request(server).post('/movies').send(movie)

    res.should.have.status(422)
    res.body.errors.should.containSubset([{ param: 'title', msg: 'title cannot be longer than 255 characters' }])
  })

  it('should validate title has to be string', async () => {
    const movie = { title: 124 }
    const res = await chai.request(server).post('/movies').send(movie)

    res.should.have.status(422)
    res.body.errors.should.containSubset([{ param: 'title', msg: 'title has to be a string' }])
  })

  it('should validate empty genres', async () => {
    const movie = { genres: [] }
    const res = await chai.request(server).post('/movies').send(movie)

    res.should.have.status(422)
    res.body.errors.should.containSubset([{ param: 'genres', msg: 'genres cannot be empty' }])
  })

  it('should validate genres are predefined values', async () => {
    const movie = { genres: ['Random genre'] }
    const res = await chai.request(server).post('/movies').send(movie)

    res.should.have.status(422)
    res.body.errors.should.containSubset([{ param: 'genres', msg: 'genres can only contain predefined values' }])
  })

  it('should validate year is numeric', async () => {
    const movie = { year: 'year' }
    const res = await chai.request(server).post('/movies').send(movie)

    res.should.have.status(422)
    res.body.errors.should.containSubset([{ param: 'year', msg: 'year has to be numeric' }])
  })

  it('should validate runtime is numeric', async () => {
    const movie = { runtime: 'runtime' }
    const res = await chai.request(server).post('/movies').send(movie)

    res.should.have.status(422)
    res.body.errors.should.containSubset([{ param: 'runtime', msg: 'runtime has to be numeric' }])
  })

  it('should validate empty director', async () => {
    const movie = { director: '' }
    const res = await chai.request(server).post('/movies').send(movie)

    res.should.have.status(422)
    res.body.errors.should.containSubset([{ param: 'director', msg: 'director has to be longer than 1 character' }])
  })

  it('should validate too long director', async () => {
    const movie = { director: faker.lorem.sentence(256) }
    const res = await chai.request(server).post('/movies').send(movie)

    res.should.have.status(422)
    res.body.errors.should.containSubset([{ param: 'director', msg: 'director cannot be longer than 255 characters' }])
  })

  it('should validate director is a string', async () => {
    const movie = { director: 123 }
    const res = await chai.request(server).post('/movies').send(movie)

    res.should.have.status(422)
    res.body.errors.should.containSubset([{ param: 'director', msg: 'director has to be a string' }])
  })

  it('should validate actors is a string', async () => {
    const movie = { actors: 123 }
    const res = await chai.request(server).post('/movies').send(movie)

    res.should.have.status(422)
    res.body.errors.should.containSubset([{ param: 'actors', msg: 'actors has to be a string' }])
  })

  it('should validate plot is a string', async () => {
    const movie = { plot: 123 }
    const res = await chai.request(server).post('/movies').send(movie)

    res.should.have.status(422)
    res.body.errors.should.containSubset([{ param: 'plot', msg: 'plot has to be a string' }])
  })

  it('should validate posterUrl is a string', async () => {
    const movie = { posterUrl: 123 }
    const res = await chai.request(server).post('/movies').send(movie)

    res.should.have.status(422)
    res.body.errors.should.containSubset([{ param: 'posterUrl', msg: 'posterUrl has to be a string' }])
  })
})
