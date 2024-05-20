import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { UsersQueryRepository } from '../../repositories/users.query.repository'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { User } from '../../entities/user.entity'

export class GetBannedUsersQuery {
  constructor() {}
}

@QueryHandler(GetBannedUsersQuery)
export class GetBannedUsersQueryHandler implements IQueryHandler {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  async execute(): Promise<InterLayerObject<User[]>> {
    const bannedUsers = await this.usersQueryRepository.getBannedUsers()
    if (!bannedUsers) {
      return new InterLayerObject(
        StatusCode.NotFound,
        'Ошибка получения заблокированных пользователей',
      )
    }
    return new InterLayerObject<User[]>(StatusCode.Success, null, bannedUsers)
  }
}
