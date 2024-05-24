import * as jwt from 'jsonwebtoken'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../../features/users/repositories/users.repository'
import { ConfigType } from '../../settings/configuration'
import { CryptoAdapter } from './crypto.adapter'
import { TokensPayloadType } from '../../features/auth/types/tokens-payload.type'
import { User } from '../../features/users/entities/user.entity'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtAdapter {
  private readonly secretKeyOne: string
  private readonly secretKeyTwo: string

  constructor(
    private readonly configService: ConfigService<ConfigType, true>,
    private readonly cryptoAdapter: CryptoAdapter,
    private readonly usersRepository: UsersRepository,
  ) {
    this.secretKeyOne = this.configService.get('jwtAdapter.secretKeyOne', {
      infer: true,
    })
    this.secretKeyTwo = this.configService.get('jwtAdapter.secretKeyTwo', {
      infer: true,
    })
  }

  createToken(user: User, type: 'access' | 'refresh'): string {
    try {
      const secretKey =
        type === 'access' ? this.secretKeyOne : this.secretKeyTwo
      return jwt.sign(
        {
          userId: user.id,
        },
        secretKey,
        { expiresIn: type === 'access' ? '24h' : '72h' },
      )
    } catch (error) {
      console.error('Ошибка создания токена: ' + error)
      return null
    }
  }

  async verifyToken(
    token: string,
    type: 'access' | 'refresh',
  ): Promise<jwt.JwtPayload | null> {
    try {
      const secretKey =
        type === 'access' ? this.secretKeyOne : this.secretKeyTwo
      return jwt.verify(token, secretKey) as jwt.JwtPayload
    } catch (error) {
      console.error('Ошибка верификации токена: ' + error)
      return null
    }
  }

  async generateTokens(
    user: User,
  ): Promise<(TokensPayloadType & { encryptedRefreshToken: string }) | null> {
    const accessToken = this.createToken(user, 'access')
    const refreshToken = this.createToken(user, 'refresh')
    const encryptedRefreshToken = this.cryptoAdapter.encrypt(refreshToken)
    return { accessToken, refreshToken, encryptedRefreshToken }
  }

  async verifyRefreshToken(refreshToken: string) {
    const payload = await this.verifyToken(refreshToken, 'refresh')
    if (!payload) {
      return null
    }
    const user = await this.usersRepository.getById(payload.userId)
    if (!user) {
      return null
    }
    const decryptedRefreshToken = this.cryptoAdapter.decrypt(user.refreshToken)
    const isMatched = refreshToken === decryptedRefreshToken
    if (!isMatched) {
      return null
    }
    return user
  }
}
