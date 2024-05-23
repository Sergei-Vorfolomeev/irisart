import { IUsersQueryRepository } from '../interfaces/users.query.repository.interface'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities/user.entity'
import { Injectable } from '@nestjs/common'
import { UserViewModel } from '../dto/user-view.model'
import { UserBanViewModel } from '../dto/user-ban-view.model'
import { Mapper } from '../../../base/utils/mapper'

@Injectable()
export class UsersQueryRepository implements IUsersQueryRepository {
  constructor(
    @InjectRepository(User) private readonly usersOrmRepo: Repository<User>,
    private readonly mapper: Mapper,
  ) {}

  async getAll(): Promise<UserViewModel[] | null> {
    try {
      const users = await this.usersOrmRepo.query(
        `
          select u.*, b."banStatus"   
          from users as u
          left join bans as b
          on u.id = b."userId"
      `,
      )
      return users.map(this.mapper.mapUserToView)
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async getById(userId: string): Promise<UserViewModel | null> {
    try {
      const res = await this.usersOrmRepo.query(
        `
          select u.*, b."banStatus"    
          from users as u
          left join bans as b
          on u.id = b."userId"
          where u.id = $1
        `,
        [userId],
      )
      return res.map(this.mapper.mapUserToView)[0]
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async getBannedUsers(): Promise<UserBanViewModel[] | null> {
    try {
      const users = await this.usersOrmRepo.query(
        `
          select u.*, b."banStatus", b."banReason", b."bannedAt" 
          from users as u
          left join bans as b
          on u.id = b."userId"
          where b."banStatus" = true
      `,
      )
      return users.map(this.mapper.mapBannedUserToView)
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async getBannedUserById(userId: string): Promise<UserBanViewModel | null> {
    try {
      const res = await this.usersOrmRepo.query(
        `
        select u.*, b."banStatus", b."banReason", b."bannedAt" 
        from users as u
        left join bans as b
        on u.id = b."userId"
        where u.id = $1 and b."banStatus" = true
      `,
        [userId],
      )
      return res.map(this.mapper.mapBannedUserToView)[0]
    } catch (e) {
      console.error(e)
      return null
    }
  }
}
