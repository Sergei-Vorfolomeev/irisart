import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { UsersRepository } from '../../../users/repositories/users.repository'
import { JwtAdapter } from '../../../../base/adapters/jwt.adapter'
import { MeOutputModel } from '../../dto/me.output.model'

export class MeQuery {
  constructor(public accessToken: string) {}
}

@QueryHandler(MeQuery)
export class MeQueryHandler implements IQueryHandler {
  constructor(
    private readonly jwtAdapter: JwtAdapter,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute({
    accessToken,
  }: MeQuery): Promise<InterLayerObject<MeOutputModel>> {
    const payload = await this.jwtAdapter.verifyToken(accessToken, 'access')
    if (!payload) {
      return new InterLayerObject(StatusCode.Unauthorized)
    }

    const user = await this.usersRepository.getById(payload.userId)
    if (!user) {
      return new InterLayerObject(StatusCode.Unauthorized)
    }

    return new InterLayerObject<MeOutputModel>(StatusCode.Success, null, {
      userName: user.userName,
      email: user.email,
      userId: user.id,
    })
  }
}
