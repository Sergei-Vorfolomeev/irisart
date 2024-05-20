import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common'
import { UserInputModel } from './dto/user-input.model'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { CreateUserCommand } from './usecases/commands/create-user.command'
import { DeleteUserCommand } from './usecases/commands/delete-user.command'
import { handleExceptions } from '../../base/utils/handle-exceptions'
import { UsersQueryRepository } from './repositories/users.query.repository'
import { UserBanModel } from './dto/user-ban.model'
import { BanUserCommand } from './usecases/commands/ban-user.command'
import { StatusCode } from '../../base/interlayer-object'
import { Response } from 'express'
import { UnbanUserCommand } from './usecases/commands/unban-user-command'
import { GetAllUsersQuery } from './usecases/queries/get-users.query'
import { GetBannedUsersQuery } from './usecases/queries/get-banned-users.query'
import { GetBannedUserByIdQuery } from './usecases/queries/get-banned-user-by-id.query'
import { GetUserByIdQuery } from './usecases/queries/get-user-by-id.query'

@Controller('/users')
export class UsersController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  @Get()
  async getAllUsers() {
    const query = new GetAllUsersQuery()
    const { statusCode, error, data } = await this.queryBus.execute(query)
    handleExceptions(statusCode, error)
    return data
  }

  @Get('banned')
  async getBannedUsers() {
    const query = new GetBannedUsersQuery()
    const { statusCode, error, data } = await this.queryBus.execute(query)
    handleExceptions(statusCode, error)
    return data
  }

  @Get('banned/:id')
  async getBannedUserById(@Param('id') userId: string) {
    const query = new GetBannedUserByIdQuery(userId)
    const { statusCode, error, data } = await this.queryBus.execute(query)
    handleExceptions(statusCode, error)
    return data
  }

  @Get(':id')
  async getById(@Param('id') userId: string) {
    const query = new GetUserByIdQuery(userId)
    const { statusCode, error, data } = await this.queryBus.execute(query)
    handleExceptions(statusCode, error)
    return data
  }

  @Post()
  @HttpCode(201)
  async createUser(@Body() body: UserInputModel) {
    const { login, email, password, role } = body
    const command = new CreateUserCommand(login, email, password, role)
    const { statusCode, error, data } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)
    return data
  }

  @Post('banned')
  @HttpCode(201)
  async banUser(
    @Body() { userId, banReason }: UserBanModel,
    @Res() res: Response,
  ) {
    const command = new BanUserCommand(userId, banReason)
    const { statusCode, error } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)
    if (statusCode === StatusCode.Created) {
      const user = await this.usersQueryRepository.getBannedUserById(userId)
      if (!user) {
        throw new NotFoundException()
      }
      res.send(user)
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param() userId: string) {
    const command = new DeleteUserCommand(userId)
    const { statusCode, error } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)
  }

  @Delete('banned/:id')
  @HttpCode(204)
  async unbanUser(@Param('id') userId: string) {
    const command = new UnbanUserCommand(userId)
    const { statusCode, error } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)
  }
}
