import * as request from 'supertest'
import { PATHS } from '../src/base/const/paths'
import { INestApplication } from '@nestjs/common'
import { initTestSettings } from './utils/init-test-settings'
import { UsersModule } from '../src/features/users/users.module'
import { dropDb } from './utils/drop-db'
import { AuthModule } from '../src/features/auth/auth.module'

describe('AuthController (e2e)', () => {
  let app: INestApplication
  let httpServer: any

  beforeAll(async () => {
    const res = await initTestSettings(app, httpServer, UsersModule, AuthModule)
    app = res.app
    httpServer = res.httpServer
  })

  afterAll(async () => {
    await dropDb(app)
    await app.close()
  })

  it('successfully registration', async () => {
    await request(httpServer)
      .post(`${PATHS.auth}/registration`)
      .send({
        login: 'test',
        email: 'test@gmail.com',
        password: '123456',
      })
      .expect(204)
  })

  it('registration with existing login', async () => {
    const { body } = await request(httpServer)
      .post(`${PATHS.auth}/registration`)
      .send({
        login: 'test',
        email: 'test1@gmail.com',
        password: '123456',
      })
      .expect(400)

    expect(body).toEqual({
      error: 'Bad Request',
      message: 'Пользователь с указанным логином уже существует',
      statusCode: 400,
    })
  })

  it('registration with existing email', async () => {
    const { body } = await request(httpServer)
      .post(`${PATHS.auth}/registration`)
      .send({
        login: 'test1',
        email: 'test@gmail.com',
        password: '123456',
      })
      .expect(400)

    expect(body).toEqual({
      error: 'Bad Request',
      message: 'Пользователь с указанным почтовым ящиком уже существует',
      statusCode: 400,
    })
  })
})
