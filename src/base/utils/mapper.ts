import { UserDBModel } from '../../features/users/types/user-db.model'
import { UserViewModel } from '../../features/users/dto/user.view.model'
import { Injectable } from '@nestjs/common'
import { BanDBModel } from '../../features/users/types/ban-db.model'
import { UserBanViewModel } from '../../features/users/dto/user-ban.view.model'

@Injectable()
export class Mapper {
  mapUserToView(user: UserDBModel & { banStatus: boolean }): UserViewModel {
    return {
      id: user.id,
      email: user.email,
      login: user.login,
      role: user.role,
      createdAt: user.createdAt,
      banStatus: user.banStatus ?? false,
    }
  }

  mapBannedUserToView(
    user: UserDBModel & Omit<BanDBModel, 'userId'>,
  ): UserBanViewModel {
    return {
      id: user.id,
      email: user.email,
      login: user.login,
      role: user.role,
      createdAt: user.createdAt,
      banStatus: user.banStatus ?? false,
      banReason: user.banReason,
      bannedAt: user.bannedAt,
    }
  }
}
