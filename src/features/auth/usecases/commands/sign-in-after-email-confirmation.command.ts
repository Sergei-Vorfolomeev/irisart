import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { UsersRepository } from '../../../users/repositories/users.repository'
import { TokensPayload } from '../../types/tokens-payload.type'
import { JwtAdapter } from '../../../../base/adapters/jwt/jwt.adapter'

export class SignInAfterEmailConfirmationCommand {
  constructor(public email: string) {}
}

@CommandHandler(SignInAfterEmailConfirmationCommand)
export class SignInAfterEmailConfirmationCommandHandler
  implements ICommandHandler
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtAdapter: JwtAdapter,
  ) {}

  async execute({
    email,
  }: SignInAfterEmailConfirmationCommand): Promise<
    InterLayerObject<TokensPayload>
  > {
    const user = await this.usersRepository.findUserByEmail(email)
    if (!user) {
      return new InterLayerObject(StatusCode.Unauthorized, 'Неверный email')
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
