import * as process from 'process'
import { ConfigService } from '@nestjs/config'

const config = () => ({
  ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT) || 5000,
})

export type ConfigType = ReturnType<typeof config>
export type AppConfigServiceType = ConfigService<ConfigType, true>

export default config
