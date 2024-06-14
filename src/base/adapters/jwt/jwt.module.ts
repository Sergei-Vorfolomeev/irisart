import { Global, Module } from '@nestjs/common'
import { JwtAdapter } from './jwt.adapter'
import { UsersModule } from '../../../features/users/users.module'
import { CryptoModule } from '../crypto/crypto.module'

@Global()
@Module({
  imports: [UsersModule, CryptoModule],
  providers: [JwtAdapter],
  exports: [JwtAdapter],
})
export class JwtModule {}
