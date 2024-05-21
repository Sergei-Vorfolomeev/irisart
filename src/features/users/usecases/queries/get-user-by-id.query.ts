import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { UsersQueryRepository } from '../../repositories/users.query.repository'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { UserViewModel } from '../../dto/user-view.model'

export class GetUserByIdQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler implements IQueryHandler {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  async execute(
    query: GetUserByIdQuery,
  ): Promise<InterLayerObject<UserViewModel>> {
    const user = await this.usersQueryRepository.getById(query.userId)
    if (!user) {
      return new InterLayerObject(
        StatusCode.NotFound,
        'Пользователь с текущим id не найден',
      )
    }
    return new InterLayerObject(StatusCode.Success, null, user)
  }
}
