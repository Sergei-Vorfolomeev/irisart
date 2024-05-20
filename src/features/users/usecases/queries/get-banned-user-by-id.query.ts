import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { UsersQueryRepository } from '../../repositories/users.query.repository'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { User } from '../../entities/user.entity'

export class GetBannedUserByIdQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetBannedUserByIdQuery)
export class GetBannedUserByIdQueryHandler implements IQueryHandler {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  async execute(
    query: GetBannedUserByIdQuery,
  ): Promise<InterLayerObject<User>> {
    const bannedUser = await this.usersQueryRepository.getBannedUserById(
      query.userId,
    )
    if (!bannedUser) {
      return new InterLayerObject(
        StatusCode.NotFound,
        'Заблокированный пользователь с текущим id не найден',
      )
    }
    return new InterLayerObject<User>(StatusCode.Success, null, bannedUser)
  }
}
