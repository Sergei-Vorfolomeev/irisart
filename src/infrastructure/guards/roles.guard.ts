import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common'
import { JwtAdapter } from '../../base/adapters/jwt/jwt.adapter'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly jwtAdapter: JwtAdapter) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = request.cookies.accessToken
    const payload = await this.jwtAdapter.verifyToken(token, 'access')
    if (!payload) {
      throw new UnauthorizedException()
    }
    if (payload.role !== 'admin') {
      throw new ForbiddenException('Нет прав')
    }
    return true
  }
}
