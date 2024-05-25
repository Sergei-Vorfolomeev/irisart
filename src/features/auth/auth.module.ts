import { Module } from '@nestjs/common'
import { UsersModule } from '../users/users.module'
import { CqrsModule } from '@nestjs/cqrs'
import { AuthController } from './auth.controller'
import { RegistrationCommandHandler } from './usecases/commands/registration.command'
import { EmailAdapter } from '../../base/adapters/email.adapter'
import { CryptoAdapter } from '../../base/adapters/crypto.adapter'
import { JwtAdapter } from '../../base/adapters/jwt.adapter'
import { LoginCommandHandler } from './usecases/commands/login.command'
import { ConfirmEmailCommandHandler } from './usecases/commands/confirm-email.command'
import { ResendCodeCommandHandler } from './usecases/commands/resend-code.command'
import { LogoutCommandHandler } from './usecases/commands/logout.command'
import { RecoverPasswordCommandHandler } from './usecases/commands/recover-password.command'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PasswordRecovery } from './entities/password-recovery.entity'
import { SetNewPasswordCommandHandler } from './usecases/commands/set-new-password.command'

const authUseCases = [
  RegistrationCommandHandler,
  LoginCommandHandler,
  ConfirmEmailCommandHandler,
  ResendCodeCommandHandler,
  LogoutCommandHandler,
  RecoverPasswordCommandHandler,
  SetNewPasswordCommandHandler,
]

@Module({
  imports: [
    CqrsModule,
    UsersModule,
    TypeOrmModule.forFeature([PasswordRecovery]),
  ],
  providers: [...authUseCases, EmailAdapter, JwtAdapter, CryptoAdapter],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
