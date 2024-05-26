import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { BcryptAdapter } from '../../../../base/adapters/bcrypt.adapter'
import { UsersRepository } from '../../repositories/users.repository'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { Roles } from '../../types/roles.enum'
import { User } from '../../entities/user.entity'
import { EmailConfirmation } from '../../entities/email-confirmation'

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

  async execute({
    login,
    email,
    password,
    role,
  }: CreateUserCommand): Promise<InterLayerObject<string>> {
    const userByLogin = await this.usersRepository.findUserByLoginOrEmail(login)
    if (userByLogin) {
      return new InterLayerObject(
        StatusCode.BadRequest,
        'Пользователь с указанным логином уже существует',
      )
    }

    const userByEmail = await this.usersRepository.findUserByLoginOrEmail(email)
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
    newUser.login = login
    newUser.email = email
    newUser.password = hashedPassword
    newUser.role = role

    const newEmailConfirmation = new EmailConfirmation()
    newEmailConfirmation.user = newUser
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
