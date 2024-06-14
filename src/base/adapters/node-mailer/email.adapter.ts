import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { ConfigService } from '@nestjs/config'
import { ConfigType } from '../../../settings/configuration'

@Injectable()
export class EmailAdapter {
  constructor(
    protected readonly configService: ConfigService<ConfigType, true>,
  ) {}

  async sendEmail(
    email: string,
    subject: string,
    message: string,
  ): Promise<nodemailer.SentMessageInfo | null> {
    try {
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: this.configService.get('emailAdapter.email', { infer: true }),
          pass: this.configService.get('emailAdapter.password', {
            infer: true,
          }),
        },
      })

      return await transporter.sendMail({
        from: 'Sergey <vorfo1897@gmail.com>',
        to: email,
        subject: subject,
        html: message,
      })
    } catch (error) {
      console.error(error)
      return null
    }
  }
}
