import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { UsersQueryRepository } from '../../repositories/users.query.repository'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { User } from '../../entities/user.entity'
import { UserBanViewModel } from '../../dto/user-ban-view.model'

export class GetBannedUsersQuery {
  constructor() {}
}

@QueryHandler(GetBannedUsersQuery)
export class GetBannedUsersQueryHandler implements IQueryHandler {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  async execute(): Promise<InterLayerObject<UserBanViewModel[]>> {
    const bannedUsers = await this.usersQueryRepository.getBannedUsers()
    if (!bannedUsers) {
      return new InterLayerObject(
        StatusCode.NotFound,
        'Ошибка получения заблокированных пользователей',
      )
    }
    return new InterLayerObject<UserBanViewModel[]>(
      StatusCode.Success,
      null,
      bannedUsers,
    )
  }
}
