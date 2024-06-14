import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { UsersRepository } from '../../../users/repositories/users.repository'
import { Roles } from '../../../users/types/roles.enum'
import { BcryptAdapter } from '../../../../base/adapters/bcrypt/bcrypt.adapter'
import { EmailAdapter } from '../../../../base/adapters/node-mailer/email.adapter'
import { templateForRegistration } from '../../../../base/utils/template-for-registration'
import { add } from 'date-fns/add'
import { EmailConfirmation } from '../../../users/entities/email-confirmation.entity'
import { User } from '../../../users/entities/user.entity'
import { generateRandomFourDigitNumber } from '../../../../base/utils/generate-random-code'

export class SignUpCommand {
  constructor(
    public userName: string,
    public email: string,
    public password: string,
  ) {}
}

@CommandHandler(SignUpCommand)
export class SignUpCommandHandler implements ICommandHandler {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly emailAdapter: EmailAdapter,
  ) {}

  async execute({
    userName,
    email,
    password,
  }: SignUpCommand): Promise<InterLayerObject> {
    const user = await this.usersRepository.findUserByEmail(email)
    if (user) {
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
    newUser.role = Roles.user

    const newEmailConfirmation = new EmailConfirmation()
    newUser.emailConfirmation = newEmailConfirmation
    newEmailConfirmation.isConfirmed = false
    newEmailConfirmation.confirmationCode = generateRandomFourDigitNumber()
    newEmailConfirmation.expirationDate = add(new Date(), {
      hours: 1,
      minutes: 30,
    })

    const savedUser = await this.usersRepository.save(newUser)
    if (!savedUser) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка сохранения пользователя',
      )
    }

    const isSent = await this.emailAdapter.sendEmail(
      email,
      'IRISART | Подтверждение регистрации',
      templateForRegistration(newEmailConfirmation.confirmationCode),
    )
    if (!isSent) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка отправки письма',
      )
    }
    return new InterLayerObject(StatusCode.NoContent)
  }
}
