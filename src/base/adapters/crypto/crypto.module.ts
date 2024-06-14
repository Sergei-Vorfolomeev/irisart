import { Module } from '@nestjs/common'
import { CryptoAdapter } from './crypto.adapter'

@Module({
  providers: [CryptoAdapter],
  exports: [CryptoAdapter],
})
export class CryptoModule {}
