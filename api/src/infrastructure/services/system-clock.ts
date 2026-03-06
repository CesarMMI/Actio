import { Injectable } from '@nestjs/common';
import { IClock } from '../../application/interfaces/services/clock.interface';

@Injectable()
export class SystemClock implements IClock {
  now(): Date {
    return new Date();
  }
}
