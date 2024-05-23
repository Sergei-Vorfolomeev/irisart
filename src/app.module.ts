import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration, { AppConfigServiceType } from './settings/configuration'
import { UsersModule } from './features/users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './features/users/entities/user.entity'
import { Ban } from './features/users/entities/ban.entity'
import { AuthModule } from './features/auth/auth.module'

@Module({
  imports: [
    // registration config-module
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.dev', '.env.stage', '.env.prod'],
    }),
    // registration typeorm-module
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: AppConfigServiceType) => ({
        type: 'postgres',
        host: 'localhost',
        port: configService.get('db.port', { infer: true }),
        username: configService.get('db.username', { infer: true }),
        password: configService.get('db.password', { infer: true }),
        database: configService.get('db.name', { infer: true }),
        entities: [User, Ban],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
