import { Module } from '@nestjs/common';
import { CrawlersService } from './crawlers.service';
import { CrawlersController } from './crawlers.controller';

@Module({
  controllers: [CrawlersController],
  providers: [CrawlersService],
  exports: [CrawlersService],
})
export class CrawlersModule {}