import { IUsersQueryRepository } from '../interfaces/users.query.repository.interface'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities/user.entity'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UsersQueryRepository implements IUsersQueryRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async getAll(): Promise<User[]> {
    try {
      return this.usersRepo.query(`
      select * from users
      `)
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async getById(userId: string): Promise<User | null> {
    try {
      return this.usersRepo.query(
        `
        select u.* from users as u
        where u.id = $1
        `,
        [userId],
      )

      // const userInArray = await this.usersRepo.findOne({
      //   relations: ['id'],
      //   where: { id: userId },
      // })
      // console.log(userInArray)
      // return userInArray

      // return (
      //   this.usersRepo
      //     .createQueryBuilder('user')
      //     .leftJoinAndSelect('user.id', 'ban')
      //     // .where(`user.id = ${userId}`)
      //     .getOne()
      // )
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async getBannedUsers(): Promise<User[] | null> {
    try {
      return await this.usersRepo.query(`
        select u.*, b."banStatus", b."banReason", b."bannedAt" from users as u
        left join bans as b
        on u.id = b."userId"
        where b."banStatus" = true
      `)
    } catch (e) {
      console.error(e)
      return null
    }
  }
}
