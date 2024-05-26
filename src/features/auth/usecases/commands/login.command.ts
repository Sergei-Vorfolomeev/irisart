import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { UsersRepository } from '../../../users/repositories/users.repository'
import { BcryptAdapter } from '../../../../base/adapters/bcrypt.adapter'
import { JwtAdapter } from '../../../../base/adapters/jwt.adapter'
import { TokensPayload } from '../../types/tokens-payload.type'

export class LoginCommand {
  constructor(
    public loginOrEmail: string,
    public password: string,
  ) {}
}

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly jwtAdapter: JwtAdapter,
  ) {}

  async execute({
    loginOrEmail,
    password,
  }: LoginCommand): Promise<InterLayerObject<TokensPayload>> {
    const user = await this.usersRepository.findUserByLoginOrEmail(loginOrEmail)
    if (!user) {
      return new InterLayerObject(
        StatusCode.Unauthorized,
        'Неверный логин, email или пароль',
      )
    }

    const isMatched = await this.bcryptAdapter.comparePasswords(
      password,
      user.password,
    )
    if (!isMatched) {
      return new InterLayerObject(
        StatusCode.Unauthorized,
        'Неверный логин, email или пароль',
      )
    }

    const tokens = await this.jwtAdapter.generateTokens(user)
    if (!tokens) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка генерации токенов',
      )
    }

    user.refreshToken = tokens.encryptedRefreshToken
    const updatedUser = await this.usersRepository.save(user)
    if (!updatedUser) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Не удалось сохранить refresh token',
      )
    }

    return new InterLayerObject<TokensPayload>(StatusCode.Success, null, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    })
  }
}
