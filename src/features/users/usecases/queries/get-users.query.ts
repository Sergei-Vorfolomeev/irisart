import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { UsersQueryRepository } from '../../repositories/users.query.repository'
import { User } from '../../entities/user.entity'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { isLogLevelEnabled } from '@nestjs/common/services/utils'
import { UserViewModel } from '../../dto/user.view.model'

export class GetAllUsersQuery {
  constructor() {}
}

@QueryHandler(GetAllUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  async execute(): Promise<InterLayerObject<UserViewModel[]>> {
    const users = await this.usersQueryRepository.getAll()
    if (!users) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка получения всех пользователей',
      )
    }
    return new InterLayerObject(StatusCode.Success, null, users)
  }
}
