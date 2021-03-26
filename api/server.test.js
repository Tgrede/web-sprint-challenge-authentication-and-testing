// Write your tests here
const db = require('.././data/dbConfig')
const server = require('./server')
const request = require('supertest')
const Users = require('./auth/auth-model')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db('users').truncate
  await db.seed.run()
})
afterAll(async () => {
  await db.destroy() 
})

test('sanity', () => {
  expect(true).toBe(true)
})

it('process.env.DB_ENV must be "testing"', () => {
  expect(process.env.NODE_ENV).toBe('testing')
})

describe('users endpoints', () => {
  describe('[POST] /register', () => {
    it('creates a hash of the user entered password', async () => {
      const userToAdd = {username: 'trenten', password: '1234'}
      const res = await request(server).post('/api/auth/register').send(userToAdd)
      expect(res.body.password).not.toBe(userToAdd.password) 
    })
    it('adds the new user to the database', async () => {
      const userToAdd = {username: 'trenten', password: '1234'}
      const res = await request(server)
      .post('/register')
      .send(userToAdd)
      const newUser = await Users.findBy({username: userToAdd.username})
      expect(newUser).toBeDefined()
    })
  })
  describe('[POST] /login', () => {
    it('creates a token', async () => {
      const user = {username: 'admin', password: '1234'}
      const res = await request(server).post('/api/auth/login').send(user)
      expect(res.body.token).toBeDefined() 
    })
    it('responds with 200 status', async () => {
      const user = {username: 'admin', password: '1234'}
      const res = await request(server).post('/api/auth/login').send(user)
      expect(res.status).toBe(200)
    })
  })
})
