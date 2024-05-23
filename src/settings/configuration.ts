import * as process from 'process'
import { ConfigService } from '@nestjs/config'

const config = () => ({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT) || 5000,
  db: {
    name: process.env.DB_NAME,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  emailAdapter: {
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
  },
})

export type ConfigType = ReturnType<typeof config>
export type AppConfigServiceType = ConfigService<ConfigType, true>

export default config
