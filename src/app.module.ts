import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration, { AppConfigServiceType } from './configuration'
import { UsersModule } from './features/users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './features/users/domain/user.entity'

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
      useFactory: (configService: AppConfigServiceType) => ({
        type: 'postgres',
        host: 'localhost',
        port: configService.get('db.port', { infer: true }),
        username: configService.get('db.username', { infer: true }),
        password: configService.get('db.password', { infer: true }),
        database: configService.get('db.name', { infer: true }),
        entities: [User],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
