import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'
import { UserInputModel } from './dto/user-input.model'
import { CommandBus } from '@nestjs/cqrs'
import { CreateUserCommand } from './usecases/commands/create-user.usecase'
import { DeleteUserCommand } from './usecases/commands/delete-user.usecase'
import { handleExceptions } from '../../base/utils/handle-exceptions'
import { UsersQueryRepository } from './repositories/users.query.repository'

@Controller('/users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  @Get()
  async getAllUsers() {
    return await this.usersQueryRepository.getAll()
  }

  @Get('banned')
  async getBannedUsers() {
    return await this.usersQueryRepository.getBannedUsers()
  }

  @Get(':id')
  async getById(@Param('id') userId: string) {
    return await this.usersQueryRepository.getById(userId)
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

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param() userId: string) {
    const command = new DeleteUserCommand(userId)
    const { statusCode, error } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)
  }
}
