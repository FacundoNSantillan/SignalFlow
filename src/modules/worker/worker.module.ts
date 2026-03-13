import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { ProvidersModule } from '../../infrastructure/providers/providers.module';

@Module({
  imports: [ProvidersModule],
  providers: [WorkerService],
})
export class WorkerModule {}