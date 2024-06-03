import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'

const APP_PREFIX = '/api'

export const applyAppSettings = (app: INestApplication) => {
  // useContainer(app.select(AppModule), { fallbackOnErrors: true })

  app.enableCors({
    origin: 'http://localhost:3000', // URL клиента
    credentials: true, // Разрешить передачу cookies
  })

  app.use(cookieParser())
  app.setGlobalPrefix(APP_PREFIX)

  app.useGlobalPipes(
    new ValidationPipe({
      // автоматическое преобразование полезной нагрузки (payload) к указанному в DTO типу(классу)
      transform: true,
      // отправляет только первую ошибку
      stopAtFirstError: true,
      // удаляет лишние переданные свойства
      // whitelist: true,
      // генерирует ошибку, если в объекте запроса присутствуют свойства, которых нет в DTO
      // forbidNonWhitelisted: true,
      // объект настроек для validationError
      // validationError: { target: false, value: false }
    }),
  )
}
