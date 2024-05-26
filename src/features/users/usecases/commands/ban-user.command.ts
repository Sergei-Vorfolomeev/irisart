import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { UsersRepository } from '../../repositories/users.repository'
import { Ban } from '../../entities/ban.entity'

export class BanUserCommand {
  constructor(
    public userId: string,
    public banReason: string,
  ) {}
}

@CommandHandler(BanUserCommand)
export class BanUserCommandHandler implements ICommandHandler {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: BanUserCommand): Promise<InterLayerObject<string>> {
    const user = await this.usersRepository.getById(command.userId)
    if (!user) {
      return new InterLayerObject(
        StatusCode.BadRequest,
        'Пользователь с текущим id не найден',
      )
    }

    if (!user.banInfo) {
      user.banInfo = new Ban()
      user.banInfo.user = user
    }

    user.banInfo.status = true
    user.banInfo.reason = command.banReason

    const savedUser = await this.usersRepository.save(user)
    if (!savedUser) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка блокировки пользователя',
      )
    }

    return new InterLayerObject<string>(
      StatusCode.Created,
      null,
      user.banInfo.userId,
    )
  }
}
