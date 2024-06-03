import {
  Body,
  Controller,
  Get,
  HttpCode,
  ParseIntPipe,
  Post,
  Res,
} from '@nestjs/common'
import { RegistrationInputModel } from './dto/registration.input.model'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { handleExceptions } from '../../base/utils/handle-exceptions'
import { SignUpCommand } from './usecases/commands/sign-up.command'
import { SignInCommand } from './usecases/commands/sign-in.command'
import { Response } from 'express'
import { ConfirmEmailCommand } from './usecases/commands/confirm-email.command'
import { ResendCodeInputModel } from './dto/resend-code.input.model'
import { ResendCodeCommand } from './usecases/commands/resend-code.command'
import { RefreshToken } from '../../infrastructure/decorators/refresh-token.decorator'
import { SignOutCommand } from './usecases/commands/sign-out.command'
import { RecoverPasswordInputModel } from './dto/recover-password.input.model'
import { RecoverPasswordCommand } from './usecases/commands/recover-password.command'
import { SetNewPasswordInputModel } from './dto/set-new-password.input.model'
import { SetNewPasswordCommand } from './usecases/commands/set-new-password.command'
import { UpdateTokensCommand } from './usecases/commands/update-tokens.command'
import { LoginInputModel } from './dto/login.input.model'
import { add } from 'date-fns/add'
import { SignInAfterEmailConfirmationCommand } from './usecases/commands/sign-in-after-email-confirmation.command'
import { AccessToken } from '../../infrastructure/decorators/access-token.decorator'
import { MeQuery } from './usecases/queries/me.query'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('sign-up')
  @HttpCode(204)
  async registration(
    @Body() { userName, email, password }: RegistrationInputModel,
  ) {
    const command = new SignUpCommand(userName, email, password)
    const { statusCode, error } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)
  }

  @Post('sign-in')
  @HttpCode(200)
  async login(
    @Body() { email, password }: LoginInputModel,
    @Res() res: Response,
  ) {
    const command = new SignInCommand(email, password)
    const { statusCode, error, data } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)
    res.cookie('accessToken', data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: add(Date.now(), { hours: 24 }),
    })
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: add(Date.now(), { hours: 72 }),
    })
    res.end()
  }

  @Post('confirm-email')
  @HttpCode(200)
  async confirmEmail(
    @Body('code', ParseIntPipe) code: number,
    @Res() res: Response,
  ) {
    const confirmEmailCommand = new ConfirmEmailCommand(code)
    const {
      statusCode: code1,
      error: error1,
      data: user,
    } = await this.commandBus.execute(confirmEmailCommand)
    handleExceptions(code1, error1)

    const signInCommand = new SignInAfterEmailConfirmationCommand(user.email)
    const {
      statusCode: code2,
      error: error2,
      data: { accessToken, refreshToken },
    } = await this.commandBus.execute(signInCommand)
    handleExceptions(code2, error2)

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: add(Date.now(), { hours: 24 }),
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: add(Date.now(), { hours: 72 }),
    })
    res.send({ email: user.email })
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
  async logout(@RefreshToken() refreshToken: string, @Res() res: Response) {
    const command = new SignOutCommand(refreshToken)
    const { statusCode, error } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)

    res.cookie('accessToken', null, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(),
    })
    res.cookie('refreshToken', null, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(),
    })
    res.end()
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

    res.cookie('accessToken', data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: add(Date.now(), { hours: 24 }),
    })
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: add(Date.now(), { hours: 72 }),
    })
    res.end()
  }

  @Get('/me')
  @HttpCode(200)
  async getMe(@AccessToken() accessToken: string) {
    const query = new MeQuery(accessToken)
    const { statusCode, error, data: user } = await this.queryBus.execute(query)
    handleExceptions(statusCode, error)
    return user
  }
}
