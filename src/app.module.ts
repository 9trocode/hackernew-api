import { Module } from '@nestjs/common';
import {AppController} from './controllers/app.controller';
import {HackerNewsController} from './controllers/hackernews.controller';
import { AppService } from './services/app.service';
import { HackernewsService } from './services/hackernews.service';

@Module({
  imports: [],
  controllers: [AppController, HackerNewsController],
  providers: [AppService, HackernewsService],
})
export class AppModule {}
