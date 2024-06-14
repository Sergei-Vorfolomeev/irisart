import { Module } from '@nestjs/common'
import { EmailAdapter } from './email.adapter'

@Module({
  providers: [EmailAdapter],
  exports: [EmailAdapter],
})
export class NodeMailerModule {}
