import { InjectRedis } from '@nestjs-modules/ioredis';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

@Injectable()
export class AppService {
  constructor(
    @InjectQueue('tareas') private readonly tareaQueue: Queue,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async agregarTarea(tarea: { id: string; nombre: string }) {
    const listExist = await this.redis.exists(tarea.id);
    if (!listExist) {
      await this.redis.rpush(tarea.id, tarea.nombre);
      this.tareaQueue.add('tareas', tarea.id, { delay: 10000 });
    }else {
      await this.redis.rpush(tarea.id, tarea.nombre);
    }

    return {
      message: 'sucess',
    };
  }

  generarNumero() {
    return Math.floor(Math.random() * 5000) + 1;
  }

  generateUID() {
    const timestamp = Date.now().toString(36);
    const randomPart = (Math.random() * 1000000000)
      .toString(36)
      .replace('.', '');
    return timestamp + randomPart;
  }
}
