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
      banStatus: true,
      createdAt: expect.any(String),
      banReason: "It's a test block. Actually he's a good boy!",
      bannedAt: expect.any(String),
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
        banStatus: true,
        createdAt: expect.any(String),
        banReason: "It's a test block. Actually he's a good boy!",
        bannedAt: expect.any(String),
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
      banStatus: true,
      createdAt: expect.any(String),
      banReason: "It's a test block. Actually he's a good boy!",
      bannedAt: expect.any(String),
    })
  })

  it('unblock user', async () => {
    await request(httpServer)
      .delete(`${PATHS.users}/banned/${user.id}`)
      .expect(204)
  })
})
