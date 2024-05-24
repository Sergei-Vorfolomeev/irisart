import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { UsersQueryRepository } from '../../repositories/users.query.repository'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { UserBanViewModel } from '../../dto/user-ban.view.model'

export class GetBannedUserByIdQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetBannedUserByIdQuery)
export class GetBannedUserByIdQueryHandler implements IQueryHandler {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  async execute(
    query: GetBannedUserByIdQuery,
  ): Promise<InterLayerObject<UserBanViewModel>> {
    const bannedUser = await this.usersQueryRepository.getBannedUserById(
      query.userId,
    )
    if (!bannedUser) {
      return new InterLayerObject(
        StatusCode.NotFound,
        'Заблокированный пользователь с текущим id не найден',
      )
    }
    return new InterLayerObject<UserBanViewModel>(
      StatusCode.Success,
      null,
      bannedUser,
    )
  }
}
