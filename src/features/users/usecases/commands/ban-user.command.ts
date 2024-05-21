import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { UsersRepository } from '../../repositories/users.repository'
import { BanDBModel } from '../../types/ban-db.model'

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
    const newBan: BanDBModel = {
      userId: command.userId,
      banStatus: true,
      banReason: command.banReason,
      bannedAt: new Date(),
    }
    const createdBan = await this.usersRepository.banUser(newBan)
    if (!createdBan) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка блокировки пользователя',
      )
    }
    return new InterLayerObject<string>(
      StatusCode.Created,
      null,
      createdBan.userId,
    )
  }
}
