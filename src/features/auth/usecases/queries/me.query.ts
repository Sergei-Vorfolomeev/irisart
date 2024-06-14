import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { JwtAdapter } from '../../../../base/adapters/jwt/jwt.adapter'
import { UsersQueryRepository } from '../../../users/repositories/users.query.repository'
import { UserViewModel } from '../../../users/dto/user.view.model'

export class MeQuery {
  constructor(public accessToken: string) {}
}

@QueryHandler(MeQuery)
export class MeQueryHandler implements IQueryHandler {
  constructor(
    private readonly jwtAdapter: JwtAdapter,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async execute({
    accessToken,
  }: MeQuery): Promise<InterLayerObject<UserViewModel>> {
    const payload = await this.jwtAdapter.verifyToken(accessToken, 'access')
    if (!payload) {
      return new InterLayerObject(StatusCode.Unauthorized)
    }

    const user = await this.usersQueryRepository.getById(payload.userId)
    if (!user) {
      return new InterLayerObject(StatusCode.Unauthorized)
    }

    return new InterLayerObject<UserViewModel>(StatusCode.Success, null, user)
  }
}
