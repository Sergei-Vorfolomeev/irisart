import * as request from 'supertest'
import { PATHS } from '../src/base/const/paths'
import { INestApplication } from '@nestjs/common'
import { initTestSettings } from './utils/init-test-settings'
import { UsersModule } from '../src/features/users/users.module'
import { dropDb } from './utils/drop-db'
import { AuthModule } from '../src/features/auth/auth.module'
import { UsersRepository } from '../src/features/users/repositories/users.repository'

describe('AuthController (e2e)', () => {
  let app: INestApplication
  let httpServer: any
  let usersRepository: UsersRepository

  beforeAll(async () => {
    const res = await initTestSettings(app, httpServer, UsersModule, AuthModule)
    app = res.app
    httpServer = res.httpServer
    usersRepository = app.get(UsersRepository)
  })

  afterAll(async () => {
    await dropDb(app)
    await app.close()
  })

  it('successfully registration', async () => {
    await request(httpServer)
      .post(`${PATHS.auth}/sign-up`)
      .send({
        login: 'test',
        email: 'test@gmail.com',
        password: '123456',
      })
      .expect(204)
  })

  it('registration with existing login', async () => {
    const { body } = await request(httpServer)
      .post(`${PATHS.auth}/sign-up`)
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
      .post(`${PATHS.auth}/sign-up`)
      .send({
        login: 'wrong login',
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

  it('login with incorrect password', async () => {
    const { body } = await request(httpServer)
      .post(`${PATHS.auth}/sign-in`)
      .send({
        loginOrEmail: 'test@gmail.com',
        password: 'wrong password',
      })
      .expect(401)

    expect(body).toEqual({
      error: 'Unauthorized',
      message: 'Неверный логин, email или пароль',
      statusCode: 401,
    })
  })

  it('login with incorrect email', async () => {
    const { body } = await request(httpServer)
      .post(`${PATHS.auth}/sign-in`)
      .send({
        loginOrEmail: 'wrongMail@gmail.com',
        password: '123456',
      })
      .expect(401)

    expect(body).toEqual({
      error: 'Unauthorized',
      message: 'Неверный логин, email или пароль',
      statusCode: 401,
    })
  })

  let validRefreshToken: string
  it('successfully login', async () => {
    const { body, headers } = await request(httpServer)
      .post(`${PATHS.auth}/sign-in`)
      .send({
        loginOrEmail: 'test@gmail.com',
        password: '123456',
      })
      .expect(200)

    const cookieHeader = headers['set-cookie']
    validRefreshToken = cookieHeader[0].split(';')[0].split('=')[1]

    expect(body).toEqual({
      accessToken: expect.any(String),
    })
    expect(body.accessToken).toContain('.')
  })

  it('resend confirmation code with wrong email', async () => {
    const { body } = await request(httpServer)
      .post(`${PATHS.auth}/resend-code`)
      .send({
        email: 'wrongEmail@gmail.com',
      })
      .expect(400)

    expect(body).toEqual({
      error: 'Bad Request',
      message: 'Пользователь с текущим почтовым ящиком не найден',
      statusCode: 400,
    })
  })

  let user: any
  it('successfully resend confirmation code', async () => {
    user = await usersRepository.findUserByLoginOrEmail('test')
    const previousCode = user.emailConfirmation.confirmationCode

    await request(httpServer)
      .post(`${PATHS.auth}/resend-code`)
      .send({
        email: user.email,
      })
      .expect(204)

    user = await usersRepository.findUserByLoginOrEmail('test')
    expect(user.emailConfirmation.confirmationCode).not.toBe(previousCode)
  })

  it('successfully email confirmation', async () => {
    await request(httpServer)
      .post(`${PATHS.auth}/confirm-email`)
      .send({
        code: user.emailConfirmation.confirmationCode,
      })
      .expect(204)

    user = await usersRepository.findUserByLoginOrEmail('test')

    expect(user.emailConfirmation.isConfirmed).toBe(true)
  })

  it('resend confirmation code to approved account', async () => {
    const { body } = await request(httpServer)
      .post(`${PATHS.auth}/resend-code`)
      .send({
        email: user.email,
      })
      .expect(400)

    expect(body).toEqual({
      error: 'Bad Request',
      message: 'Почтовый адрес уже подтвержден',
      statusCode: 400,
    })
  })

  it('logout', async () => {
    await request(httpServer)
      .post(`${PATHS.auth}/sign-out`)
      .set('Cookie', `refreshToken=${validRefreshToken}`)
      .expect(204)
  })
})
