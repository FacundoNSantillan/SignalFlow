import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs'; 
import { ExpressAdapter } from '@bull-board/express'; 
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'; 
import { DispatcherModule } from './modules/dispatcher/dispatcher.module';
import { WorkerModule } from './modules/worker/worker.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { envValidationSchema } from './config/env.validation';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema, 
      validationOptions: {
        allowUnknown: true, 
        abortEarly: true,
      },
    }),

    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),

    BullBoardModule.forRoot({
      route: '/admin/queues',
      adapter: ExpressAdapter,
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    
    BullBoardModule.forFeature({
      name: 'notifications',
      adapter: BullMQAdapter, 
    }),

    DatabaseModule,
    DispatcherModule,
    WorkerModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}