import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { UsersRepository } from '../../../users/repositories/users.repository'
import { randomUUID } from 'crypto'
import { EmailAdapter } from '../../../../base/adapters/node-mailer/email.adapter'
import { templateForPasswordRecovery } from '../../../../base/utils/template-for-password-recovery'
import { PasswordRecovery } from '../../../users/entities/password-recovery.entity'
import { add } from 'date-fns/add'

export class RecoverPasswordCommand {
  constructor(public email: string) {}
}

@CommandHandler(RecoverPasswordCommand)
export class RecoverPasswordCommandHandler implements ICommandHandler {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly emailAdapter: EmailAdapter,
  ) {}

  async execute({ email }: RecoverPasswordCommand): Promise<InterLayerObject> {
    const user = await this.usersRepository.findUserByEmail(email)
    if (!user) {
      return new InterLayerObject(StatusCode.NoContent)
    }

    if (!user.passwordRecovery) {
      user.passwordRecovery = new PasswordRecovery()
      user.passwordRecovery.user = user // устанавливаем связь
    }

    // user.passwordRecovery.userId = user.id
    user.passwordRecovery.recoveryCode = randomUUID()
    user.passwordRecovery.expiredAt = add(new Date(), {
      seconds: 120,
    })
    const savedUser = await this.usersRepository.save(user)
    if (!savedUser) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка сохранения пользователя',
      )
    }

    const isSent = await this.emailAdapter.sendEmail(
      email,
      'IRISART | Восстановление пароля',
      templateForPasswordRecovery(user.passwordRecovery.recoveryCode),
    )
    if (!isSent) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка отправки письма',
      )
    }

    return new InterLayerObject(StatusCode.NoContent)
  }
}
