import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { TareasProcessor } from './tarea.consumer';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'tareas',
    }),
    RedisModule.forRoot({
      config: { 
        url: 'redis://localhost:6379',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, TareasProcessor],
})
export class AppModule {}
