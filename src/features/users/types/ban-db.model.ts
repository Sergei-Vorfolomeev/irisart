export type BanDbModel = {
  userId: string
  banStatus: boolean
  banReason: string | null
  bannedAt: Date
}
