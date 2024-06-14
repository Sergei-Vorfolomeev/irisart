import { BcryptAdapter } from './bcrypt.adapter'
import { Module } from '@nestjs/common'

@Module({
  providers: [BcryptAdapter],
  exports: [BcryptAdapter],
})
export class BcryptModule {}
