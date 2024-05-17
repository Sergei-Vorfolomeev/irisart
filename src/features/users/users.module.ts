import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { UsersController } from './api/users.controller'
import { User } from './entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BcryptAdapter } from '../../base/adapters/bcrypt.adapter'
import { CreateUserUseCase } from './application/usecases/commands/create-user.usecase'
import { UsersRepository } from './infrastructure/users.repository'
import { CqrsModule } from '@nestjs/cqrs'
import { DeleteUserUseCase } from './application/usecases/commands/delete-user.usecase'

const usersUseCases = [CreateUserUseCase, DeleteUserUseCase]

@Module({
  imports: [TypeOrmModule.forFeature([User]), CqrsModule, AuthModule],
  providers: [...usersUseCases, BcryptAdapter, UsersRepository],
  controllers: [UsersController],
  exports: [],
})
export class UsersModule {}
