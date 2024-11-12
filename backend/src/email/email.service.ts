import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmationEmail(email: string, verificationLink: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Підтвердження електронної скриньки!',
        html: `<div><p>Будь ласка, натисніть на посилання нижче для підтвердження вашої електронної пошти:</p><a href="${verificationLink}">Підтвердити електронну пошту</a></div>`,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Email sending failed');
    }
  }

  async sendPinEmail(email: string, number: number) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Код підтвердження!',
        html: `<div><p>Будь ласка, введіть цей код:${number} у діалоговому вікні застосунку!</p></div>`,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Email sending failed');
    }
  }
}
