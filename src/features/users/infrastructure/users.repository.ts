import { IUsersRepository } from '../application/interfaces/users.repository.interface'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities/user.entity'
import { UserDBModel } from '../application/types/user-db.model'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async create(user: UserDBModel): Promise<User | null> {
    try {
      return await this.usersRepo.save(user)
    } catch (e) {
      console.error('Ошибка сохранения пользователя: ' + e)
      return null
    }
  }

  async delete(userId: string): Promise<boolean> {
    try {
      const res = await this.usersRepo.delete(userId)
      return res.affected === 1
    } catch (e) {
      console.error(e)
      return false
    }
  }
}
