import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'

export const AccessToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest()
    if (request.cookies.accessToken) {
      return request.cookies.accessToken
    } else {
      throw new UnauthorizedException()
    }
  },
)
