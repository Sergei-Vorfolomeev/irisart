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
import { CreateUserCommand } from '../application/usecases/commands/create-user.usecase'
import { DeleteUserCommand } from '../application/usecases/commands/delete-user.usecase'
import { handleExceptions } from '../../../base/utils/handle-exceptions'

@Controller('/users')
export class UsersController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get()
  async getAllUsers() {
    return 'All users'
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
