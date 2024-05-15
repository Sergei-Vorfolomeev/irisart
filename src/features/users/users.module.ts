import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  providers: [],
  controllers: [],
  exports: [],
})
export class UsersModule {}
