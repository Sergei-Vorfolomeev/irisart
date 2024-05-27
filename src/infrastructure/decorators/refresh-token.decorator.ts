import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'

export const RefreshToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest()
    if (request.cookies) {
      return request.cookies.refreshToken
    } else {
      throw new UnauthorizedException()
    }
  },
)
