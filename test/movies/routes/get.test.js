const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../../index')
const chaiSubset = require('chai-subset')
const fs = require('fs')
const setDB = require('../../utils/setDB')
const { dbPath } = setDB
const generateMovie = require('../../../src/movies/generateMovie')

const genres = [
  'Fantasy',
  'Crime',
  'Drama',
  'Music',
  'Adventure',
  'History',
  'Thriller',
  'Animation',
  'Family'
]

const movies = [
  generateMovie(1, ['Music', 'Thriller', 'Family', 'Drama'], 100), // 3
  generateMovie(2, ['Music', 'Animation', 'Adventure'], 92), // 1
  generateMovie(3, ['Crime', 'History', 'Music', 'Fantasy', 'Family'], 127), // 2x
  generateMovie(4, ['Animation', 'Family'], 156), // 1x
  generateMovie(5, ['Thriller', 'Fantasy', 'Family'], 93), // 2
  generateMovie(6, ['History', 'Animation'], 143),
  generateMovie(7, ['Music', 'Thriller', 'Animation', 'Drama'], 98), // 2
  generateMovie(8, ['Animation'], 153),
  generateMovie(9, ['Drama', 'Thriller'], 104), // 1
  generateMovie(10, ['Crime', 'Fantasy', 'History'], 97),
  generateMovie(11, ['Music', 'Thriller', 'Family'], 105) // 3
]

chai.should()
chai.use(chaiHttp)
chai.use(chaiSubset)

describe('GET movies', () => {
  beforeEach(() => setDB(genres, movies))
  afterEach(() => fs.unlinkSync(dbPath))

  // not a perfect solution: testing randomness requires some statistical tests
  it('should get a random movie when no params are given', async () => {
    const res = await chai.request(server).get('/movies')
    const movie = movies.find(item => item.id === res.body[0].id)

    res.should.have.status(200);
    (!!movie).should.be.eql(true)
  })

  // not a perfect solution: testing randomness requires some statistical tests
  it('should get a random movie with given duration when geners param is not given', async () => {
    const duration = 100
    const availableMovies = movies.filter(({ runtime }) => runtime >= duration - 10 && runtime <= duration + 10)
    const res = await chai.request(server).get('/movies').query({ duration })

    res.body.length.should.be.eql(1)
    const movie = availableMovies.find(item => item.id === res.body[0].id)

    res.should.have.status(200);
    (!!movie).should.be.eql(true)
  })

  it('should get an empty array when a movie with given duration does not exist and geners param is not given', async () => {
    const duration = 100
    setDB(genres, movies.filter(({ runtime }) => runtime < duration - 10 || runtime > duration + 10))
    const res = await chai.request(server).get('/movies').query({ duration })

    res.body.length.should.be.eql(0)
    res.should.have.status(200)
    res.body.should.be.eql([])
  })

  it('should get all movies with given one genre when no duration is given', async () => {
    const res = await chai.request(server).get('/movies').query({ genres: ['Thriller'] })

    res.body.length.should.be.eql(5)
    res.should.have.status(200)
    res.body[0].should.be.eql(movies[0])
    res.body[1].should.be.eql(movies[4])
    res.body[2].should.be.eql(movies[6])
    res.body[3].should.be.eql(movies[8])
    res.body[4].should.be.eql(movies[10])
  })

  it('should get all movies with given two genres when no duration is given', async () => {
    const res = await chai.request(server).get('/movies').query({ genres: ['Thriller', 'Family'] })

    res.body.length.should.be.eql(7)
    res.should.have.status(200)
    res.body[0].should.be.eql(movies[0])
    res.body[1].should.be.eql(movies[4])
    res.body[2].should.be.eql(movies[10])
    res.body[3].should.be.eql(movies[2])
    res.body[4].should.be.eql(movies[3])
    res.body[5].should.be.eql(movies[6])
    res.body[6].should.be.eql(movies[8])
  })

  it('should get all movies with given three genres when no duration is given', async () => {
    const res = await chai.request(server).get('/movies').query({ genres: ['Thriller', 'Family', 'Music'] })

    res.body.length.should.be.eql(8)
    res.should.have.status(200)
    res.body[0].should.be.eql(movies[0])
    res.body[1].should.be.eql(movies[10])
    res.body[2].should.be.eql(movies[2])
    res.body[3].should.be.eql(movies[4])
    res.body[4].should.be.eql(movies[6])
    res.body[5].should.be.eql(movies[1])
    res.body[6].should.be.eql(movies[3])
    res.body[7].should.be.eql(movies[8])
  })

  it('should get all movies with given three genres when duration is given', async () => {
    const res = await chai
      .request(server)
      .get('/movies')
      .query({ genres: ['Thriller', 'Family', 'Music'], duration: 100 })

    res.body.length.should.be.eql(6)
    res.should.have.status(200)
    res.body[0].should.be.eql(movies[0])
    res.body[1].should.be.eql(movies[10])
    res.body[2].should.be.eql(movies[4])
    res.body[3].should.be.eql(movies[6])
    res.body[4].should.be.eql(movies[1])
    res.body[5].should.be.eql(movies[8])
  })

  it('should get an empty array when no movie fits params', async () => {
    setDB(genres, [
      generateMovie(1, ['Music', 'Drama'], 130),
      generateMovie(2, ['Music', 'Animation', 'Adventure'], 88),
      generateMovie(3, ['Crime', 'History', 'Music', 'Fantasy', 'Family'], 127),
      generateMovie(4, ['Animation', 'Family'], 156),
      generateMovie(5, ['Fantasy'], 93),
      generateMovie(6, ['History', 'Animation'], 143),
      generateMovie(7, ['Music', 'Thriller', 'Animation', 'Drama'], 77),
      generateMovie(8, ['Animation'], 153),
      generateMovie(9, ['Drama'], 104),
      generateMovie(10, ['Crime', 'Fantasy', 'History'], 97),
      generateMovie(11, ['Music', 'Thriller', 'Family'], 125)
    ])

    const res = await chai
      .request(server)
      .get('/movies')
      .query({ genres: ['Thriller', 'Family', 'Music'], duration: 100 })

    res.body.length.should.be.eql(0)
    res.should.have.status(200)
    res.body.should.be.eql([])
  })

  it('should validate duriation has to be numeric', async () => {
    const res = await chai.request(server).get('/movies').query({ duration: 'abc' })

    res.should.have.status(422)
    res.body.errors.should.containSubset([{ param: 'duration', msg: 'duration has to be numeric' }])
  })

  it('should validate genres cannot be numeric', async () => {
    const res = await chai.request(server).get('/movies').query({ genres: 123 })

    res.should.have.status(422)
    res.body.errors.should.containSubset([{ param: 'genres', msg: 'genres has to be an array or a string' }])
  })

  it('should validate genres are predefined values', async () => {
    const res = await chai.request(server).get('/movies').query({ genres: ['Random genre'] })

    res.should.have.status(422)
    res.body.errors.should.containSubset([{ param: 'genres', msg: 'genres can only contain predefined values' }])
  })
})
