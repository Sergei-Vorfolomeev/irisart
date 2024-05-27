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
        userName: 'test',
        email: 'test@gmail.com',
        password: '123456',
      })
      .expect(204)
  })

  it('registration with existing email', async () => {
    const { body } = await request(httpServer)
      .post(`${PATHS.auth}/sign-up`)
      .send({
        userName: 'userName',
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
        email: 'test@gmail.com',
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
        email: 'wrongMail@gmail.com',
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
        email: 'test@gmail.com',
        password: '123456',
      })
      .expect(200)

    const cookieHeader = headers['set-cookie']
    validRefreshToken = cookieHeader[0].split(';')[0].split('=')[1]

    expect(body).toEqual({
      accessToken: expect.any(String),
    })
    expect(body.accessToken).toContain('.')

    const user = await usersRepository.findUserByEmail('test@gmail.com')
    expect(user).not.toBeNull()
    expect(user?.refreshToken).not.toBeNull()
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
    user = await usersRepository.findUserByEmail('test@gmail.com')
    const previousCode = user.emailConfirmation.confirmationCode

    await request(httpServer)
      .post(`${PATHS.auth}/resend-code`)
      .send({
        email: user.email,
      })
      .expect(204)

    user = await usersRepository.findUserByEmail(user.email)
    expect(user.emailConfirmation.confirmationCode).not.toBe(previousCode)
  })

  it('successfully email confirmation', async () => {
    await request(httpServer)
      .post(`${PATHS.auth}/confirm-email`)
      .send({
        code: user.emailConfirmation.confirmationCode,
      })
      .expect(204)

    user = await usersRepository.findUserByEmail(user.email)

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

  it('request to recover password', async () => {
    let previousRecoveryCode: string | null = null
    if (user.passwordRecovery) {
      previousRecoveryCode = user.passwordRecovery.recoveryCode
    }

    await request(httpServer)
      .post(`${PATHS.auth}/recover-password`)
      .send({
        email: user.email,
      })
      .expect(204)

    user = await usersRepository.findUserByEmail(user.email)
    expect(user.passwordRecovery.recoveryCode).not.toBe(null)
    expect(user.passwordRecovery.recoveryCode).not.toBe(previousRecoveryCode)
  })

  it('setting new password with incorrect recovery code', async () => {
    const { body } = await request(httpServer)
      .post(`${PATHS.auth}/set-new-password`)
      .send({
        recoveryCode: 'dfbe5440-bc2a-4176-aa38-8b1f5811af4c',
        newPassword: 'my_new_password',
      })
      .expect(400)

    expect(body).toEqual({
      error: 'Bad Request',
      message: 'Неверный код восстановления',
      statusCode: 400,
    })
  })

  let previousPassword: string
  it('successfully setting new password', async () => {
    previousPassword = user.password

    await request(httpServer)
      .post(`${PATHS.auth}/set-new-password`)
      .send({
        recoveryCode: user.passwordRecovery.recoveryCode,
        newPassword: 'my_new_password',
      })
      .expect(204)

    user = await usersRepository.findUserByEmail(user.email)
    expect(user.password).not.toBe(previousPassword)
  })

  it('try to login with old password', async () => {
    const { body } = await request(httpServer)
      .post(`${PATHS.auth}/sign-in`)
      .send({
        email: user.email,
        password: previousPassword,
      })
      .expect(401)

    expect(body).toEqual({
      error: 'Unauthorized',
      message: 'Неверный логин, email или пароль',
      statusCode: 401,
    })
  })

  let invalidRefreshToken: string
  it('successful updating tokens', async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(1)
      }, 1000)
    })

    const { body, headers } = await request(httpServer)
      .post(`${PATHS.auth}/update-tokens`)
      .set('Cookie', `refreshToken=${validRefreshToken}`)
      .expect(200)

    expect(body).toEqual({
      accessToken: expect.any(String),
    })
    expect(body.accessToken).toContain('.')

    invalidRefreshToken = validRefreshToken
    const cookieHeader = headers['set-cookie']
    validRefreshToken = cookieHeader[0].split(';')[0].split('=')[1]

    expect(validRefreshToken).toBeDefined()
    expect(validRefreshToken).toEqual(expect.any(String))
    expect(validRefreshToken).toContain('.')
    expect(validRefreshToken).not.toBe(invalidRefreshToken)
  })

  it('refresh all tokens with invalid refresh token', async () => {
    await request(httpServer)
      .post(`${PATHS.auth}/update-tokens`)
      .set('Cookie', `refreshToken=${invalidRefreshToken}`)
      .expect(401)
  })

  it('logout', async () => {
    await request(httpServer)
      .post(`${PATHS.auth}/sign-out`)
      .set('Cookie', `refreshToken=${validRefreshToken}`)
      .expect(204)
  })

  it('try to refresh tokens after logout', async () => {
    const { body } = await request(httpServer)
      .post(`${PATHS.auth}/update-tokens`)
      .set('Cookie', `refreshToken=${validRefreshToken}`)
      .expect(401)

    expect(body).toEqual({
      message: 'Unauthorized',
      statusCode: 401,
    })
  })
})
