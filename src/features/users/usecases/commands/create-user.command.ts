import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { BcryptAdapter } from '../../../../base/adapters/bcrypt.adapter'
import { UserDBModel } from '../../types/user-db.model'
import { UsersRepository } from '../../repositories/users.repository'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { Roles } from '../../types/roles.enum'

export class CreateUserCommand {
  constructor(
    public login: string,
    public email: string,
    public password: string,
    public role: Roles,
  ) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<InterLayerObject<string>> {
    const { login, email, password, role } = command
    const hashedPassword = await this.bcryptAdapter.generateHash(password)
    if (!hashedPassword) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка хэширования пароля',
      )
    }
    const newUser: UserDBModel = {
      login,
      email,
      password: hashedPassword,
      role,
    }
    const createdUser = await this.usersRepository.create(newUser)
    if (!createdUser) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка сохранения пользователя',
      )
    }
    return new InterLayerObject<string>(
      StatusCode.Created,
      null,
      createdUser.id,
    )
  }
}
