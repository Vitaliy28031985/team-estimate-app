import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiClient,
  ContactsApi,
  EmailApi,
} from '@elasticemail/elasticemail-client';

const ELASTIC_API_KEY =
  '70D3F407B0312FC21D7A7B842476CCA5D8120315AAF34D4D76C0A16F92119E8BE43D1A76C5EDAD862CEAD096F7980E97';

@Injectable()
export class EmailService {
  private contactsApi: EmailApi;

  constructor(private configService: ConfigService) {
    const client = ApiClient.instance;
    const apikey = client.authentications['apikey'];
    apikey.apiKey = this.configService.get<string>(ELASTIC_API_KEY);

    this.contactsApi = new ContactsApi();
  }

  async sendVerificationEmail(email: string, verificationLink: string) {
    const emailData = {
      from: 'vitaliyfront@gmail.com',
      to: [email],
      subject: 'Підтвердження реєстрації',
      bodyHtml: `
        <h1>Підтвердження реєстрації</h1>
        <p>Будь ласка, натисніть на посилання нижче для підтвердження вашої електронної пошти:</p>
        <a href="${verificationLink}">Підтвердити електронну пошту</a>
      `,
    };

    console.log(ELASTIC_API_KEY);

    try {
      await this.contactsApi.send(emailData);
      console.log(`Email надіслано на ${email}`);
    } catch (error) {
      console.error(`Не вдалося надіслати email: ${error.message}`);
    }
  }
}