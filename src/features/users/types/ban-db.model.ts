export type BanDBModel = {
  userId: string
  banStatus: boolean
  banReason: string | null
  bannedAt: Date
}
