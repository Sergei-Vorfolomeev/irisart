import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UsersRepository } from '../../repositories/users.repository'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'

export class UnbanUserCommand {
  constructor(public userId: string) {}
}

@CommandHandler(UnbanUserCommand)
export class UnbanUserCommandHandler implements ICommandHandler {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({ userId }: UnbanUserCommand): Promise<InterLayerObject> {
    const user = await this.usersRepository.getById(userId)
    if (!user) {
      return new InterLayerObject(
        StatusCode.NotFound,
        'Пользователь с текущим id не найден',
      )
    }
    if (!user.banInfo || !user.banInfo.status) {
      return new InterLayerObject(
        StatusCode.NotFound,
        'Заблокированный пользователь с текущим id не найден',
      )
    }

    user.banInfo.status = false
    const savedUser = await this.usersRepository.save(user)
    if (!savedUser) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка разблокировки пользователя',
      )
    }

    return new InterLayerObject(StatusCode.NoContent)
  }
}
