import { UserViewModel } from '../../features/users/dto/user.view.model'
import { Injectable } from '@nestjs/common'
import { UserBanViewModel } from '../../features/users/dto/user-ban.view.model'
import { User } from '../../features/users/entities/user.entity'

@Injectable()
export class Mapper {
  mapUserToView(user: User & { banStatus: boolean }): UserViewModel {
    return {
      id: user.id,
      email: user.email,
      userName: user.userName,
      role: user.role,
      createdAt: user.createdAt,
      banStatus: user.banStatus ?? false,
    }
  }

  mapBannedUserToView(user: User): UserBanViewModel {
    return {
      id: user.id,
      email: user.email,
      userName: user.userName,
      role: user.role,
      createdAt: user.createdAt,
      banInfo: {
        status: user.banInfo?.status ?? false,
        reason: user.banInfo?.reason,
        bannedAt: user.banInfo.bannedAt,
      },
    }
  }
}
