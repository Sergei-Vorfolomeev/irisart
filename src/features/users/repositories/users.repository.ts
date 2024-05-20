import { IUsersRepository } from '../interfaces/users.repository.interface'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities/user.entity'
import { UserDBModel } from '../types/user-db.model'
import { Injectable } from '@nestjs/common'
import { Ban } from '../entities/ban.entity'
import { BanDbModel } from '../types/ban-db.model'

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(User) private readonly usersOrmRepo: Repository<User>,
    @InjectRepository(Ban) private readonly bansOrmRepo: Repository<Ban>,
  ) {}

  async getById(userId: string): Promise<User[]> {
    try {
      return this.usersOrmRepo.findBy({ id: userId })
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async create(user: UserDBModel): Promise<User | null> {
    try {
      return await this.usersOrmRepo.save(user)
    } catch (e) {
      console.error('Ошибка сохранения пользователя: ' + e)
      return null
    }
  }

  async delete(userId: string): Promise<boolean> {
    try {
      const res = await this.usersOrmRepo.delete(userId)
      return res.affected === 1
    } catch (e) {
      console.error(e)
      return false
    }
  }

  async banUser(ban: BanDbModel): Promise<Ban | null> {
    try {
      return await this.bansOrmRepo.save(ban)
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async unbanUser(userId: string): Promise<boolean> {
    try {
      const res = await this.bansOrmRepo.delete({ userId })
      return res.affected === 1
    } catch (e) {
      console.error(e)
      return false
    }
  }
}
