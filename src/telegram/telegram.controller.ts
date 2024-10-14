import { Body, Controller, Post } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}
  @Post('send-code')
  async sendCode(
    @Body('phone') phone: string,
    @Body('payload') payload: string,
  ) {
    const result = await this.telegramService.sendVerificationMessage(
      phone,
      payload,
    );
    return result;
  }

  @Post('auth')
  async handleTelegramCallback(@Body() body: any) {
    console.log('Received callback:', body);
  }

  @Post('check-code')
  async checkCode(
    @Body('requestId') requestId: string,
    @Body('code') code: string,
  ) {
    return await this.telegramService.checkVerificationStatus(requestId, code);
  }

  @Post('check-ability')
  async checkAbility(@Body('phone') phone: string) {
    return await this.telegramService.checkSendAbility(phone);
  }

  @Post('revoke-code')
  async revokeCode(@Body('requestId') requestId: string) {
    return await this.telegramService.revokeVerificationMessage(requestId);
  }
}
