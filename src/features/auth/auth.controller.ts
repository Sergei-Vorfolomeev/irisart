import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { RegistrationInputModel } from './dto/registration-input.model'
import { CommandBus } from '@nestjs/cqrs'
import { handleExceptions } from '../../base/utils/handle-exceptions'
import { RegistrationCommand } from './usecases/commands/registration.command'

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('registration')
  @HttpCode(204)
  async registration(
    @Body() { login, email, password }: RegistrationInputModel,
  ) {
    const command = new RegistrationCommand(login, email, password)
    const { statusCode, error } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)
  }
}
