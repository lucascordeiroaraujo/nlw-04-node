import nodemailer, { Transporter } from 'nodemailer'

import handlebars from 'handlebars'

import fs from 'fs'

interface ISendMailDTO {
  to: string
  subject: string
  variables: object
  path: string
}

class SendMailService {
  private client: Transporter

  constructor() {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      })

      this.client = transporter
    })
  }

  async execute({ to, subject, variables, path }: ISendMailDTO) {
    const templateFileContent = fs.readFileSync(path).toString('utf-8')

    const mailTemplateParse = handlebars.compile(templateFileContent)

    const html = mailTemplateParse(variables)

    const message = await this.client.sendMail({
      from: {
        name: 'NPS',
        address: 'noreply@nps.com.br',
      },
      to,
      subject,
      html,
    })

    console.log('Message sent: %s', message.messageId)

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message))
  }
}

export default new SendMailService()
