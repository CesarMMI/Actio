import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IIdGenerator } from '../../application/interfaces/services/id-generator.interface';

@Injectable()
export class UuidIdGenerator implements IIdGenerator {
  newId(): string {
    return randomUUID();
  }
}
