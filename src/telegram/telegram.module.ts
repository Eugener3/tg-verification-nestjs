import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [TelegramService],
  controllers: [TelegramController],
  imports: [
    HttpModule,
  ]
})
export class TelegramModule {}
