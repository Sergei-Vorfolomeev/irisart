import * as process from 'process'
import * as crypto from 'crypto'

// Сгенерируем ключ
const KEY = crypto.pbkdf2Sync(
  'prancypoodle',
  'sherylcrowe',
  10000,
  32,
  'sha512',
)
// const KEY = crypto.randomBytes(32) // 256 бит
// Сгенерируем инициализирующий вектор
const IV = crypto.randomBytes(16) // 128 бит

const config = () => ({
  env: process.env.NODE_ENV,
  port: (process.env.PORT && Number(process.env.PORT)) || 5000,
  db: {
    name: process.env.DB_NAME,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  emailAdapter: {
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
  },
  cryptoAdapter: {
    secretKeyForCipher: KEY,
    initVectorForCipher: IV,
  },
  jwtAdapter: {
    secretKeyOne: process.env.SECRET_KEY_ONE,
    secretKeyTwo: process.env.SECRET_KEY_TWO,
  },
})

export type ConfigType = ReturnType<typeof config>

export default config
