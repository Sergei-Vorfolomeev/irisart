import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { UsersRepository } from '../../../users/repositories/users.repository'
import { randomUUID } from 'crypto'
import { add } from 'date-fns/add'
import { EmailAdapter } from '../../../../base/adapters/email.adapter'
import { templateForRegistration } from '../../../../base/utils/template-for-registration'
import { generateRandomFourDigitNumber } from '../../../../base/utils/generate-random-code'

export class ResendCodeCommand {
  constructor(public email: string) {}
}

@CommandHandler(ResendCodeCommand)
export class ResendCodeCommandHandler implements ICommandHandler {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly emailAdapter: EmailAdapter,
  ) {}

  async execute({ email }: ResendCodeCommand): Promise<InterLayerObject> {
    const user = await this.usersRepository.findUserByEmail(email)
    if (!user) {
      return new InterLayerObject(
        StatusCode.BadRequest,
        'Пользователь с текущим почтовым ящиком не найден',
      )
    }

    if (user.emailConfirmation.isConfirmed) {
      return new InterLayerObject(
        StatusCode.BadRequest,
        'Почтовый адрес уже подтвержден',
      )
    }

    user.emailConfirmation.confirmationCode = generateRandomFourDigitNumber()
    user.emailConfirmation.expirationDate = add(new Date(), {
      hours: 1,
      minutes: 30,
    })
    const isUpdated = await this.usersRepository.save(user)
    if (!isUpdated) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка обновления кода подтверждения',
      )
    }

    const isSent = await this.emailAdapter.sendEmail(
      email,
      'IRISART | Подтверждение регистрации',
      templateForRegistration(user.emailConfirmation.confirmationCode),
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
