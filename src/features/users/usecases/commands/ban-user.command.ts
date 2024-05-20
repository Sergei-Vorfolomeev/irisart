import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { UsersRepository } from '../../repositories/users.repository'
import { BanDbModel } from '../../types/ban-db.model'
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

  async execute(command: BanUserCommand): Promise<InterLayerObject<Ban>> {
    const newBan: BanDbModel = {
      userId: command.userId,
      banStatus: true,
      banReason: command.banReason,
      bannedAt: new Date(),
    }
    const createdBan = await this.usersRepository.banUser(newBan)
    if (!createdBan) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка создания нового бана',
      )
    }
    return new InterLayerObject(StatusCode.Created, null, createdBan)
  }
}
