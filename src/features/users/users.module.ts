import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { UsersController } from './users.controller'
import { User } from './entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BcryptAdapter } from '../../base/adapters/bcrypt.adapter'
import { CreateUserUseCase } from './usecases/commands/create-user.usecase'
import { UsersRepository } from './repositories/users.repository'
import { CqrsModule } from '@nestjs/cqrs'
import { DeleteUserUseCase } from './usecases/commands/delete-user.usecase'
import { UsersQueryRepository } from './repositories/users.query.repository'
import { Ban } from './entities/ban.entity'

const usersUseCases = [CreateUserUseCase, DeleteUserUseCase]

@Module({
  imports: [TypeOrmModule.forFeature([User, Ban]), CqrsModule, AuthModule],
  providers: [
    ...usersUseCases,
    BcryptAdapter,
    UsersRepository,
    UsersQueryRepository,
  ],
  controllers: [UsersController],
  exports: [],
})
export class UsersModule {}
