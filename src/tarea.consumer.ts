import { InjectRedis } from '@nestjs-modules/ioredis';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Redis } from 'ioredis';

@Processor('tareas')
export class TareasProcessor extends WorkerHost {
  constructor(@InjectRedis() private readonly redis: Redis) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    console.log(job.data);
    const listOfTask = await this.redis.lrange(job.data as string, 0, -1);
    console.log(listOfTask);
    this.redis.del(job.data)
    // do some stuff
  }

  @OnWorkerEvent('completed')
  onCompleted() {
    console.log('completed');
  }

  @OnWorkerEvent('active')
  onWaiting() {
    console.log('active');
  }
  @OnWorkerEvent('progress')
  onProcess() {
    console.log('progress');
  }
}
