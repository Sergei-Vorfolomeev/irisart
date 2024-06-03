import { Module } from '@nestjs/common'
import { UsersModule } from '../users/users.module'
import { CqrsModule } from '@nestjs/cqrs'
import { AuthController } from './auth.controller'
import { SignUpCommandHandler } from './usecases/commands/sign-up.command'
import { EmailAdapter } from '../../base/adapters/email.adapter'
import { CryptoAdapter } from '../../base/adapters/crypto.adapter'
import { JwtAdapter } from '../../base/adapters/jwt.adapter'
import { SignInCommandHandler } from './usecases/commands/sign-in.command'
import { ConfirmEmailCommandHandler } from './usecases/commands/confirm-email.command'
import { ResendCodeCommandHandler } from './usecases/commands/resend-code.command'
import { SignOutCommandHandler } from './usecases/commands/sign-out.command'
import { RecoverPasswordCommandHandler } from './usecases/commands/recover-password.command'
import { SetNewPasswordCommandHandler } from './usecases/commands/set-new-password.command'
import { UpdateTokensCommandHandler } from './usecases/commands/update-tokens.command'
import { SignInAfterEmailConfirmationCommandHandler } from './usecases/commands/sign-in-after-email-confirmation.command'
import { MeQueryHandler } from './usecases/queries/me.query'

const authUseCases = [
  SignUpCommandHandler,
  SignInCommandHandler,
  SignInAfterEmailConfirmationCommandHandler,
  ConfirmEmailCommandHandler,
  ResendCodeCommandHandler,
  SignOutCommandHandler,
  RecoverPasswordCommandHandler,
  SetNewPasswordCommandHandler,
  UpdateTokensCommandHandler,
  MeQueryHandler,
]

@Module({
  imports: [CqrsModule, UsersModule],
  providers: [...authUseCases, EmailAdapter, JwtAdapter, CryptoAdapter],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
