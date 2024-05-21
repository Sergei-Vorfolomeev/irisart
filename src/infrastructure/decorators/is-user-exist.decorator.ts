import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { UsersQueryRepository } from '../../features/users/repositories/users.query.repository'
import { Injectable } from '@nestjs/common'

// TODO: НЕ ЗАРЕГИСТРИРОВАН В DI

@ValidatorConstraint({ name: 'IsUserExist', async: false })
@Injectable()
export class IsUserExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  async validate(userId: string, args: ValidationArguments): Promise<boolean> {
    const user = await this.usersQueryRepository.getById(userId)
    if (user) {
      return true
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'User with current id already exists'
  }
}

export function IsUserExist(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsUserExistConstraint,
    })
  }
}
