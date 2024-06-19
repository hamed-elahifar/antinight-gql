import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Smsir } from 'sms-typescript/lib';

@Injectable()
export class SmsService {
  smsWebService!: any;
  constructor(private configService: ConfigService) {
    this.smsWebService = new Smsir(
      this.configService.getOrThrow<string>('SMS_API_KEY'),
      this.configService.getOrThrow<number>('SMS_SENDER'),
    );
  }

  async sendVerify(receptor, token): Promise<void> {
    try {
      // const result = await this.smsWebService.SendVerifyCode(
      //   receptor,
      //   this.configService.getOrThrow<number>('SMS_TEMPLATE'),
      //   [{ name: 'CODE', value: token }],
      // );
      // console.log('send sms result', result.data);
    } catch (err) {
      console.log('ERROR on SMS', err.response?.data);
    }
  }
}
