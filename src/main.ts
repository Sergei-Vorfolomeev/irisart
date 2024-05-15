import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ConfigType } from './configuration'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get(ConfigService<ConfigType, true>)
  const port = configService.get('PORT')
  const env = configService.get('ENV')

  await app.listen(port)

  console.log(`Nest application has been successfully started on ${port} port`)
  console.log(`Current environment: ${env}`)
}

bootstrap()
