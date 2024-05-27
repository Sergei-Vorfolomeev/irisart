import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UsersRepository } from '../../../users/repositories/users.repository'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { TokensPayload } from '../../types/tokens-payload.type'
import { JwtAdapter } from '../../../../base/adapters/jwt.adapter'

export class UpdateTokensCommand {
  constructor(public refreshToken: string) {}
}

@CommandHandler(UpdateTokensCommand)
export class UpdateTokensCommandHandler implements ICommandHandler {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtAdapter: JwtAdapter,
  ) {}

  async execute({
    refreshToken,
  }: UpdateTokensCommand): Promise<InterLayerObject<TokensPayload>> {
    const user = await this.jwtAdapter.verifyRefreshToken(refreshToken)
    if (!user) {
      return new InterLayerObject(StatusCode.Unauthorized)
    }

    const tokens = await this.jwtAdapter.generateTokens(user)
    if (!tokens) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка генерации токенов',
      )
    }

    user.refreshToken = tokens.encryptedRefreshToken
    const savedUser = await this.usersRepository.save(user)
    if (!savedUser) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка сохранения пользователя',
      )
    }

    return new InterLayerObject<TokensPayload>(StatusCode.Success, null, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    })
  }
}
