import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common'
import { RegistrationInputModel } from './dto/registration.input.model'
import { CommandBus } from '@nestjs/cqrs'
import { handleExceptions } from '../../base/utils/handle-exceptions'
import { RegistrationCommand } from './usecases/commands/registration.command'
import { LoginCommand } from './usecases/commands/login.command'
import { Response } from 'express'
import { ConfirmEmailInputModel } from './dto/confirm-email.input.model'
import { ConfirmEmailCommand } from './usecases/commands/confirm-email.command'

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('sign-up')
  @HttpCode(204)
  async registration(
    @Body() { login, email, password }: RegistrationInputModel,
  ) {
    const command = new RegistrationCommand(login, email, password)
    const { statusCode, error } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)
  }

  @Post('sign-in')
  @HttpCode(200)
  async login(@Body() { loginOrEmail, password }, @Res() res: Response) {
    const command = new LoginCommand(loginOrEmail, password)
    const { statusCode, error, data } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: true,
    })
    res.send({
      accessToken: data.accessToken,
    })
  }

  @Post('confirm-email')
  @HttpCode(204)
  async confirmEmail(@Body() { code }: ConfirmEmailInputModel) {
    const command = new ConfirmEmailCommand(code)
    const { statusCode, error } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)
  }
}
