import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'
import { UserCreateInputModel } from './dto/user-create.input.model'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { CreateUserCommand } from './usecases/commands/create-user.command'
import { DeleteUserCommand } from './usecases/commands/delete-user.command'
import { handleExceptions } from '../../base/utils/handle-exceptions'
import { UserBanInputModel } from './dto/user-ban.input.model'
import { BanUserCommand } from './usecases/commands/ban-user.command'
import { UnbanUserCommand } from './usecases/commands/unban-user-command'
import { GetAllUsersQuery } from './usecases/queries/get-users.query'
import { GetBannedUsersQuery } from './usecases/queries/get-banned-users.query'
import { GetBannedUserByIdQuery } from './usecases/queries/get-banned-user-by-id.query'
import { GetUserByIdQuery } from './usecases/queries/get-user-by-id.query'

@Controller('users')
export class UsersController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
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
  async createUser(@Body() body: UserCreateInputModel) {
    const { login, email, password, role } = body
    const command = new CreateUserCommand(login, email, password, role)
    const {
      statusCode,
      error,
      data: createdUserId,
    } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)

    const query = new GetUserByIdQuery(createdUserId)
    const {
      statusCode: code,
      error: err,
      data: user,
    } = await this.queryBus.execute(query)
    handleExceptions(code, err)
    return user
  }

  @Post('banned')
  @HttpCode(201)
  async banUser(@Body() { userId, banReason }: UserBanInputModel) {
    const command = new BanUserCommand(userId, banReason)
    const {
      statusCode,
      error,
      data: bannedUserId,
    } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)

    const query = new GetBannedUserByIdQuery(bannedUserId)
    const {
      statusCode: code,
      error: err,
      data: bannedUser,
    } = await this.queryBus.execute(query)
    handleExceptions(code, err)
    return bannedUser
  }

  @Delete('banned/:id')
  @HttpCode(204)
  async unbanUser(@Param('id') userId: string) {
    const command = new UnbanUserCommand(userId)
    const { statusCode, error } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param() userId: string) {
    const command = new DeleteUserCommand(userId)
    const { statusCode, error } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)
  }
}
