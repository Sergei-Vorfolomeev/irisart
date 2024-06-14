import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UsersRepository } from '../../../users/repositories/users.repository'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { BcryptAdapter } from '../../../../base/adapters/bcrypt/bcrypt.adapter'

export class SetNewPasswordCommand {
  constructor(
    public recoveryCode: string,
    public newPassword: string,
  ) {}
}

@CommandHandler(SetNewPasswordCommand)
export class SetNewPasswordCommandHandler implements ICommandHandler {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly bcryptAdapter: BcryptAdapter,
  ) {}

  async execute({
    recoveryCode,
    newPassword,
  }: SetNewPasswordCommand): Promise<InterLayerObject> {
    const user = await this.usersRepository.findUserByRecoveryCode(recoveryCode)
    if (!user || user.passwordRecovery.recoveryCode !== recoveryCode) {
      return new InterLayerObject(
        StatusCode.BadRequest,
        'Неверный код восстановления',
      )
    }

    if (!user.passwordRecovery) {
      return new InterLayerObject(
        StatusCode.BadRequest,
        'Ошибка! Запросите код восстановления еще раз',
      )
    }

    if (user.passwordRecovery.expiredAt < new Date()) {
      return new InterLayerObject(
        StatusCode.BadRequest,
        'Код восстановления истек',
      )
    }

    const hashedNewPassword = await this.bcryptAdapter.generateHash(newPassword)
    if (!hashedNewPassword) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка хэширования пароля',
      )
    }

    user.password = hashedNewPassword
    const savedUser = await this.usersRepository.save(user)
    if (!savedUser) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка сохранения пользователя',
      )
    }

    return new InterLayerObject(StatusCode.NoContent)
  }
}
