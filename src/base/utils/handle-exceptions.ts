import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { FieldError, StatusCode } from '../interlayer-object'

export function handleExceptions(
  statusCode: StatusCode,
  message?: FieldError[] | string | null,
) {
  if (statusCode === StatusCode.BadRequest) {
    throw new BadRequestException(message)
  }
  if (statusCode === StatusCode.Unauthorized) {
    throw new UnauthorizedException(message)
  }
  if (statusCode === StatusCode.Forbidden) {
    throw new ForbiddenException(message)
  }
  if (statusCode === StatusCode.NotFound) {
    throw new NotFoundException(message)
  }
  if (statusCode === StatusCode.ServerError) {
    throw new InternalServerErrorException(message)
  }
}
