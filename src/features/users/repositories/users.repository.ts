import { IUsersRepository } from '../interfaces/users.repository.interface'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { User } from '../entities/user.entity'
import { EmailConfirmationType, UserDBModel } from '../types/user-db.model'
import { Injectable } from '@nestjs/common'
import { Ban } from '../entities/ban.entity'
import { BanDBModel } from '../types/ban-db.model'
import { EmailConfirmation } from '../entities/email-confirmation'

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(User) private readonly usersOrmRepo: Repository<User>,
    @InjectRepository(Ban) private readonly bansOrmRepo: Repository<Ban>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getById(userId: string): Promise<User | null> {
    try {
      const userInArray = await this.usersOrmRepo.query(
        `
          select u.*, b."banStatus", b."banReason", b."bannedAt"    
          from users as u
          left join bans as b
          on u.id = b."userId"
          where u.id = $1
        `,
        [userId],
      )
      return userInArray[0]
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async create(
    user: UserDBModel,
    emailConfirmation: EmailConfirmationType,
  ): Promise<string | null> {
    try {
      const createdUser = await this.dataSource.manager.transaction(
        async (manager) => {
          const newUser = manager.create(User, user)
          await manager.save(newUser)

          const newConfirmation = manager.create(
            EmailConfirmation,
            emailConfirmation,
          )
          await manager.save(newConfirmation)

          return newUser
        },
      )
      return createdUser.id
    } catch (e) {
      console.error(e)
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

  async banUser(ban: BanDBModel): Promise<Ban | null> {
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

  async getBannedUserById(userId: string): Promise<User | null> {
    try {
      const userInArray = await this.usersOrmRepo.query(
        `
          select u.*, b."banStatus", b."banReason", b."bannedAt" 
          from users as u
          left join bans as b
          on u.id = b."userId"
          where u.id = $1 and b."banStatus" = true
      `,
        [userId],
      )
      return userInArray[0]
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
    try {
      return await this.usersOrmRepo.findOne({
        where: [{ login: loginOrEmail }, { email: loginOrEmail }],
        relations: ['emailConfirmation', 'banInfo', 'passwordRecovery'],
      })
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async save(user: User): Promise<User | null> {
    try {
      return await this.usersOrmRepo.save(user)
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async findByConfirmationCode(code: string): Promise<User | null> {
    try {
      return await this.usersOrmRepo.findOne({
        relations: ['emailConfirmation'],
        where: {
          emailConfirmation: {
            confirmationCode: code,
          },
        },
      })
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async findUserByRecoveryCode(code: string): Promise<User | null> {
    try {
      return await this.usersOrmRepo.findOne({
        relations: ['passwordRecovery'],
        where: {
          passwordRecovery: {
            recoveryCode: code,
          },
        },
      })
    } catch (e) {
      console.error(e)
      return null
    }
  }
}
