import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs'; 
import { ExpressAdapter } from '@bull-board/express'; 
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'; 
import * as Joi from 'joi';
import { DispatcherModule } from './modules/dispatcher/dispatcher.module';
import { WorkerModule } from './modules/worker/worker.module';
import { DatabaseModule } from './infrastructure/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().default(6379),
      }),
    }),

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
})
export class AppModule {}