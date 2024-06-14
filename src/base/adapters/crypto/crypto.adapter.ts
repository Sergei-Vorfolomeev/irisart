import * as crypto from 'crypto'
import { Injectable } from '@nestjs/common'
import { ConfigType } from '../../../settings/configuration'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class CryptoAdapter {
  private readonly secretKey: crypto.CipherKey
  private readonly initVector: crypto.BinaryLike

  constructor(private readonly configService: ConfigService<ConfigType, true>) {
    this.secretKey = this.configService.get(
      'cryptoAdapter.secretKeyForCipher',
      {
        infer: true,
      },
    )
    this.initVector = this.configService.get(
      'cryptoAdapter.initVectorForCipher',
      { infer: true },
    )
  }

  encrypt(data: string) {
    // Создадим шифратор
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      this.secretKey,
      this.initVector,
    )
    // Зашифруем данные
    let encryptedData = cipher.update(data, 'utf8', 'hex')
    encryptedData += cipher.final('hex')
    return encryptedData
  }

  decrypt(encryptedData: string) {
    // Создадим дешифратор
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      this.secretKey,
      this.initVector,
    )
    // Дешифруем данные
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf8')
    decryptedData += decipher.final('utf8')
    return decryptedData
  }
}
