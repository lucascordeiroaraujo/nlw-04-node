import request from 'supertest'

import app from '@config/app'

import createConnection from '@database/index'

describe('Users', () => {
  beforeAll(async () => {
    const connection = await createConnection()

    await connection.runMigrations()
  })

  it('Should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
    })

    expect(response.status).toBe(201)
  })

  it('Should not be able to create a user with exists email', async () => {
    const response = await request(app).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
    })

    expect(response.status).toBe(400)
  })
})
