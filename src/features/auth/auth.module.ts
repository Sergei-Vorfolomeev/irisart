import { Module } from '@nestjs/common'
import { UsersModule } from '../users/users.module'
import { CqrsModule } from '@nestjs/cqrs'
import { AuthController } from './auth.controller'
import { RegistrationCommandHandler } from './usecases/commands/registration.command'
import { EmailAdapter } from '../../base/adapters/email.adapter'

const authUseCases = [RegistrationCommandHandler]

@Module({
  imports: [UsersModule, CqrsModule],
  providers: [...authUseCases, EmailAdapter],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
