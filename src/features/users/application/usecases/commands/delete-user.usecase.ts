import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../../base/interlayer-object'
import { UsersRepository } from '../../../infrastructure/users.repository'

export class DeleteUserCommand {
  constructor(public userId: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: DeleteUserCommand): Promise<InterLayerObject> {
    const isDeleted = await this.usersRepository.delete(command.userId)
    if (!isDeleted) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка удаления пользователя',
      )
    }
    return new InterLayerObject(StatusCode.NoContent)
  }
}
