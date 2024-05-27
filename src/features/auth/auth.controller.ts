import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common'
import { RegistrationInputModel } from './dto/registration.input.model'
import { CommandBus } from '@nestjs/cqrs'
import { handleExceptions } from '../../base/utils/handle-exceptions'
import { RegistrationCommand } from './usecases/commands/registration.command'
import { LoginCommand } from './usecases/commands/login.command'
import { Response } from 'express'
import { ConfirmEmailInputModel } from './dto/confirm-email.input.model'
import { ConfirmEmailCommand } from './usecases/commands/confirm-email.command'
import { ResendCodeInputModel } from './dto/resend-code.input.model'
import { ResendCodeCommand } from './usecases/commands/resend-code.command'
import { RefreshToken } from '../../infrastructure/decorators/refresh-token.decorator'
import { LogoutCommand } from './usecases/commands/logout.command'
import { RecoverPasswordInputModel } from './dto/recover-password.input.model'
import { RecoverPasswordCommand } from './usecases/commands/recover-password.command'
import { SetNewPasswordInputModel } from './dto/set-new-password.input.model'
import { SetNewPasswordCommand } from './usecases/commands/set-new-password.command'
import { UpdateTokensCommand } from './usecases/commands/update-tokens.command'
import { LoginInputModel } from './dto/login.input.model'

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('sign-up')
  @HttpCode(204)
  async registration(
    @Body() { userName, email, password }: RegistrationInputModel,
  ) {
    const command = new RegistrationCommand(userName, email, password)
    const { statusCode, error } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)
  }

  @Post('sign-in')
  @HttpCode(200)
  async login(
    @Body() { email, password }: LoginInputModel,
    @Res() res: Response,
  ) {
    const command = new LoginCommand(email, password)
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

  @Post('resend-code')
  @HttpCode(204)
  async resendConfirmationCode(@Body() { email }: ResendCodeInputModel) {
    const command = new ResendCodeCommand(email)
    const { statusCode, error } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)
  }

  @Post('sign-out')
  @HttpCode(204)
  async logout(@RefreshToken() refreshToken: string) {
    const command = new LogoutCommand(refreshToken)
    const { statusCode, error } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)
  }

  @Post('recover-password')
  @HttpCode(204)
  async recoverPassword(@Body() { email }: RecoverPasswordInputModel) {
    const command = new RecoverPasswordCommand(email)
    const { statusCode, error } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)
  }

  @Post('set-new-password')
  @HttpCode(204)
  async setNewPassword(
    @Body() { recoveryCode, newPassword }: SetNewPasswordInputModel,
  ) {
    const command = new SetNewPasswordCommand(recoveryCode, newPassword)
    const { statusCode, error } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)
  }

  @Post('update-tokens')
  @HttpCode(200)
  async updateTokens(
    @RefreshToken() refreshToken: string,
    @Res() res: Response,
  ) {
    const command = new UpdateTokensCommand(refreshToken)
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
}
