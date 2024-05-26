import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { PATHS } from '../src/base/const/paths'
import { UsersModule } from '../src/features/users/users.module'
import { dropDb } from './utils/drop-db'
import { initTestSettings } from './utils/init-test-settings'

describe('UsersController (e2e)', () => {
  let app: INestApplication
  let httpServer: any

  beforeAll(async () => {
    const res = await initTestSettings(app, httpServer, UsersModule)
    app = res.app
    httpServer = res.httpServer
  })

  afterAll(async () => {
    await dropDb(app)
    await app.close()
  })

  it('get empty users', async () => {
    await request(httpServer).get(PATHS.users).expect(200, [])
  })

  it('create user with incorrect input data', async () => {
    const { body } = await request(httpServer)
      .post(PATHS.users)
      .send({
        email: 'test.com',
        password: '12',
        role: false,
      })
      .expect(400)

    expect(body).toEqual({
      message: [
        'login should not be empty',
        'email must be an email',
        'password must be longer than or equal to 6 characters',
        'role must be one of the following values: user, admin',
      ],
      error: 'Bad Request',
      statusCode: 400,
    })
  })

  let user: any
  it('create user', async () => {
    const { body } = await request(httpServer)
      .post(PATHS.users)
      .send({
        login: 'testLogin',
        email: 'test@gmail.com',
        password: '123456',
        role: 'user',
      })
      .expect(201)

    user = body

    expect(user).toEqual({
      id: expect.any(String),
      login: 'testLogin',
      email: 'test@gmail.com',
      role: 'user',
      createdAt: expect.any(String),
      banStatus: expect.any(Boolean),
    })
  })

  it('get user by wrong id', async () => {
    const { body } = await request(httpServer)
      .get(`${PATHS.users}/5312875b-ab0f-4cf1-a9d4-ab2c5d6d40a4`)
      .expect(404)

    expect(body).toEqual({
      message: 'Пользователь с текущим id не найден',
      error: 'Not Found',
      statusCode: 404,
    })
  })

  it('get user by id', async () => {
    const { body } = await request(httpServer)
      .get(`${PATHS.users}/${user.id}`)
      .expect(200)

    expect(body).toEqual({
      id: user.id,
      login: user.login,
      email: user.email,
      role: user.role,
      banStatus: false,
      createdAt: expect.any(String),
    })
  })

  it('block user with wrong input data', async () => {
    const { body } = await request(httpServer)
      .post(`${PATHS.users}/banned`)
      .send({
        banReason: null,
      })
      .expect(400)

    expect(body).toEqual({
      message: ['userId should not be empty', 'banReason should not be empty'],
      error: 'Bad Request',
      statusCode: 400,
    })
  })

  it('block user with wrong user id', async () => {
    const { body } = await request(httpServer)
      .post(`${PATHS.users}/banned`)
      .send({
        userId: '5312875b-ab0f-4cf1-a9d4-ab2c5d6d40a4',
        banReason: 'exists',
      })
      .expect(400)

    expect(body).toEqual({
      message: 'Пользователь с текущим id не найден',
      error: 'Bad Request',
      statusCode: 400,
    })
  })

  it('block user', async () => {
    const { body } = await request(httpServer)
      .post(`${PATHS.users}/banned`)
      .send({
        userId: user.id,
        banReason: "It's a test block. Actually he's a good boy!",
      })
      .expect(201)

    expect(body).toEqual({
      id: user.id,
      login: user.login,
      email: user.email,
      role: user.role,
      createdAt: expect.any(String),
      banInfo: {
        status: true,
        reason: "It's a test block. Actually he's a good boy!",
        bannedAt: expect.any(String),
      },
    })
  })

  it('get blocked user', async () => {
    const { body } = await request(httpServer)
      .get(`${PATHS.users}/banned`)
      .expect(200)

    expect(body).toEqual([
      {
        id: user.id,
        login: user.login,
        email: user.email,
        role: user.role,
        createdAt: expect.any(String),
        banInfo: {
          status: true,
          reason: "It's a test block. Actually he's a good boy!",
          bannedAt: expect.any(String),
        },
      },
    ])
  })

  it('get blocked user by id', async () => {
    const { body } = await request(httpServer)
      .get(`${PATHS.users}/banned/${user.id}`)
      .expect(200)

    expect(body).toEqual({
      id: user.id,
      login: user.login,
      email: user.email,
      role: user.role,
      createdAt: expect.any(String),
      banInfo: {
        status: true,
        reason: "It's a test block. Actually he's a good boy!",
        bannedAt: expect.any(String),
      },
    })
  })

  it('get blocked user with wrong id', async () => {
    const { body } = await request(httpServer)
      .get(`${PATHS.users}/banned/01897252-72d5-491c-85d6-cdf97a1d5f2d`)
      .expect(404)

    expect(body).toEqual({
      message: 'Заблокированный пользователь с текущим id не найден',
      error: 'Not Found',
      statusCode: 404,
    })
  })

  it('unblock user', async () => {
    await request(httpServer)
      .delete(`${PATHS.users}/banned/${user.id}`)
      .expect(204)
  })

  it('unblock user with wrong id', async () => {
    const { body } = await request(httpServer)
      .delete(`${PATHS.users}/banned/${user.id}`)
      .expect(404)

    expect(body).toEqual({
      message: 'Заблокированный пользователь с текущим id не найден',
      error: 'Not Found',
      statusCode: 404,
    })
  })
})
