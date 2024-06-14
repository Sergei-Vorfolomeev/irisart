import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration, { ConfigType } from '../../src/settings/configuration'
import { TypeOrmModule } from '@nestjs/typeorm'
import { applyAppSettings } from '../apply-app-settings'
import { dropDb } from './drop-db'
import { EmailAdapter } from '../../src/base/adapters/node-mailer/email.adapter'
import { EmailAdapterMock } from '../mocks/email.adapter.mock'

export const initTestSettings = async (
  app: any,
  httpServer: any,
  ...modules
) => {
  const testingModule: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [configuration],
        envFilePath: ['.env.dev', '.env.stage', '.env.prod'],
      }),
      TypeOrmModule.forRootAsync({
        useFactory: (configService: ConfigService<ConfigType, true>) => ({
          type: 'postgres',
          host: 'localhost',
          port: configService.get('db.port', { infer: true }),
          username: configService.get('db.username', { infer: true }),
          password: configService.get('db.password', { infer: true }),
          database: 'test_db',
          autoLoadEntities: true,
          synchronize: true,
        }),
        inject: [ConfigService],
      }),
      ...modules,
    ],
  })
    .overrideProvider(EmailAdapter)
    .useClass(EmailAdapterMock)
    .compile()

  app = testingModule.createNestApplication()
  applyAppSettings(app)
  await app.init()

  await dropDb(app)

  httpServer = app.getHttpServer()

  return { app, httpServer }
}
