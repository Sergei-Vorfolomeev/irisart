import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { User } from './entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BcryptAdapter } from '../../base/adapters/bcrypt.adapter'
import { CreateUserCommandHandler } from './usecases/commands/create-user.command'
import { UsersRepository } from './repositories/users.repository'
import { CqrsModule } from '@nestjs/cqrs'
import { DeleteUserCommandHandler } from './usecases/commands/delete-user.command'
import { UsersQueryRepository } from './repositories/users.query.repository'
import { Ban } from './entities/ban.entity'
import { BanUserCommandHandler } from './usecases/commands/ban-user.command'
import { UnbanUserCommandHandler } from './usecases/commands/unban-user-command'
import { GetUsersQueryHandler } from './usecases/queries/get-users.query'
import { GetBannedUsersQueryHandler } from './usecases/queries/get-banned-users.query'
import { GetBannedUserByIdQueryHandler } from './usecases/queries/get-banned-user-by-id.query'
import { GetUserByIdQueryHandler } from './usecases/queries/get-user-by-id.query'
import { Mapper } from '../../base/utils/mapper'
import { EmailConfirmation } from './entities/email-confirmation'
import { PasswordRecovery } from './entities/password-recovery.entity'

const usersUseCases = [
  GetUsersQueryHandler,
  GetBannedUsersQueryHandler,
  GetBannedUserByIdQueryHandler,
  GetUserByIdQueryHandler,

  CreateUserCommandHandler,
  DeleteUserCommandHandler,
  BanUserCommandHandler,
  UnbanUserCommandHandler,
]

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Ban, EmailConfirmation, PasswordRecovery]),
    CqrsModule,
  ],
  providers: [
    ...usersUseCases,
    BcryptAdapter,
    UsersRepository,
    UsersQueryRepository,
    Mapper,
  ],
  controllers: [UsersController],
  exports: [TypeOrmModule, UsersRepository, BcryptAdapter],
})
export class UsersModule {}
