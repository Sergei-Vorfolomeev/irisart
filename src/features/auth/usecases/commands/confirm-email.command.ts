import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { UsersRepository } from '../../../users/repositories/users.repository'

export class ConfirmEmailCommand {
  constructor(public code: string) {}
}

@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailCommandHandler implements ICommandHandler {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({ code }: ConfirmEmailCommand): Promise<InterLayerObject> {
    const user = await this.usersRepository.findByConfirmationCode(code)
    if (!user) {
      return new InterLayerObject(
        StatusCode.BadRequest,
        'Неверный код подтверждения',
      )
    }

    if (user.emailConfirmation.isConfirmed) {
      return new InterLayerObject(
        StatusCode.BadRequest,
        'Почтовый адрес уже подтвержден',
      )
    }

    if (user.emailConfirmation.expirationDate < new Date()) {
      return new InterLayerObject(
        StatusCode.BadRequest,
        'Код подтверждения истек',
      )
    }

    user.emailConfirmation.isConfirmed = true
    const updatedUser = await this.usersRepository.save(user)

    if (!updatedUser || !updatedUser.emailConfirmation.isConfirmed) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка подтверждения электронной почты',
      )
    }

    return new InterLayerObject(StatusCode.NoContent)
  }
}
