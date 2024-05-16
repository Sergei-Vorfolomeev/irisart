import { IUsersService } from './interfaces/users.service.interface'
import { User } from '../domain/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

export class UsersService implements IUsersService {
  constructor(@InjectRepository(User) usersRepository: Repository<User>) {}
}
