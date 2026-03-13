import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { DispatcherController } from './dispatcher.controller';
import { DispatcherService } from './dispatcher.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'notifications' }),
  ],
  controllers: [DispatcherController],
  providers: [DispatcherService],
})
export class DispatcherModule {}