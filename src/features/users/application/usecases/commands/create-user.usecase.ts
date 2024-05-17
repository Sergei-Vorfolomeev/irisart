import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { User } from '../../../entities/user.entity'
import { BcryptAdapter } from '../../../../../base/adapters/bcrypt.adapter'
import { UserDBModel } from '../../types/user-db.model'
import { UsersRepository } from '../../../infrastructure/users.repository'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../../base/interlayer-object'
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
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<InterLayerObject<User>> {
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
    return new InterLayerObject(StatusCode.Created, null, createdUser)
  }
}
