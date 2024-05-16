import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { UsersController } from './api/users.controller'
import { User } from './domain/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersService } from './application/users.service'

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [],
})
export class UsersModule {}
