import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { UsersRepository } from '../../features/users/repositories/users.repository'
import { JwtAdapter } from '../../base/adapters/jwt/jwt.adapter'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtAdapter: JwtAdapter,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = request.cookies.accessToken
    const payload = await this.jwtAdapter.verifyToken(token, 'access')
    if (!payload) {
      throw new UnauthorizedException()
    }
    const user = await this.usersRepository.getById(payload.userId)
    if (!user) {
      throw new UnauthorizedException()
    }
    request.user = { id: user.id }
    return true
  }
}
