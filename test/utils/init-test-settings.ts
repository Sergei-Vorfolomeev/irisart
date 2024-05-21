import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration, {
  AppConfigServiceType,
} from '../../src/settings/configuration'
import { TypeOrmModule } from '@nestjs/typeorm'
import { applyAppSettings } from '../apply-app-settings'
import { dropDb } from './drop-db'

export const initTestSettings = async (
  app: any,
  httpServer: any,
  ...modules
) => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [configuration],
        envFilePath: ['.env.dev', '.env.stage', '.env.prod'],
      }),
      TypeOrmModule.forRootAsync({
        useFactory: (configService: AppConfigServiceType) => ({
          type: 'postgres',
          host: 'localhost',
          port: configService.get('db.port', { infer: true }),
          username: configService.get('db.username', { infer: true }),
          password: configService.get('db.password', { infer: true }),
          database: 'test_db',
          // entities: [],
          autoLoadEntities: true,
          synchronize: true,
        }),
        inject: [ConfigService],
      }),
      ...modules,
    ],
  }).compile()

  app = moduleFixture.createNestApplication()
  await app.init()
  await applyAppSettings(app)

  await dropDb(app)

  httpServer = app.getHttpServer()

  return { app, httpServer }
}
