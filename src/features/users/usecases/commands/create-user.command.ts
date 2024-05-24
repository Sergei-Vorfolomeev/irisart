import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { BcryptAdapter } from '../../../../base/adapters/bcrypt.adapter'
import { EmailConfirmationType, UserDBModel } from '../../types/user-db.model'
import { UsersRepository } from '../../repositories/users.repository'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { Roles } from '../../types/roles.enum'
import { randomUUID } from 'crypto'
import { add } from 'date-fns/add'

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
    const newUser: UserDBModel = {
      id: randomUUID(),
      login,
      email,
      password: hashedPassword,
      role,
    }

    const emailConfirmation: EmailConfirmationType = {
      userId: newUser.id,
      isConfirmed: true,
      confirmationCode: randomUUID(),
      expirationDate: add(new Date(), {
        hours: 1,
        minutes: 30,
      }),
    }
    const createdUserId = await this.usersRepository.create(
      newUser,
      emailConfirmation,
    )
    if (!createdUserId) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка сохранения пользователя',
      )
    }
    return new InterLayerObject<string>(StatusCode.Created, null, createdUserId)
  }
}
