import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { BcryptAdapter } from '../../../../base/adapters/bcrypt/bcrypt.adapter'
import { UsersRepository } from '../../repositories/users.repository'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { Roles } from '../../types/roles.enum'
import { User } from '../../entities/user.entity'
import { EmailConfirmation } from '../../entities/email-confirmation.entity'

export class CreateUserCommand {
  constructor(
    public userName: string,
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

  async execute({
    userName,
    email,
    password,
    role,
  }: CreateUserCommand): Promise<InterLayerObject<string>> {
    const userByEmail = await this.usersRepository.findUserByEmail(email)
    if (userByEmail) {
      return new InterLayerObject(
        StatusCode.BadRequest,
        'Пользователь с указанным почтовым ящиком уже существует',
      )
    }
    const hashedPassword = await this.bcryptAdapter.generateHash(password)
    if (!hashedPassword) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка хэширования пароля',
      )
    }

    const newUser = new User()
    newUser.userName = userName
    newUser.email = email
    newUser.password = hashedPassword
    newUser.role = role

    const newEmailConfirmation = new EmailConfirmation()
    newUser.emailConfirmation = newEmailConfirmation
    newEmailConfirmation.isConfirmed = true

    const savedUser = await this.usersRepository.save(newUser)
    if (!savedUser) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка сохранения пользователя',
      )
    }
    return new InterLayerObject<string>(StatusCode.Created, null, savedUser.id)
  }
}
