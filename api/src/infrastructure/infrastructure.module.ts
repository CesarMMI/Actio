import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { getDatabaseConfig } from './config/database.config';

import { UserOrmEntity } from './persistence/orm-entities/user.orm-entity';
import { CapturedItemOrmEntity } from './persistence/orm-entities/captured-item.orm-entity';
import { ActionOrmEntity } from './persistence/orm-entities/action.orm-entity';
import { ProjectOrmEntity } from './persistence/orm-entities/project.orm-entity';
import { ContextOrmEntity } from './persistence/orm-entities/context.orm-entity';

import { TypeOrmUserRepository } from './persistence/repositories/typeorm-user.repository';
import { TypeOrmCapturedItemRepository } from './persistence/repositories/typeorm-captured-item.repository';
import { TypeOrmActionRepository } from './persistence/repositories/typeorm-action.repository';
import { TypeOrmProjectRepository } from './persistence/repositories/typeorm-project.repository';
import { TypeOrmContextRepository } from './persistence/repositories/typeorm-context.repository';
import { TypeOrmUnitOfWork } from './persistence/typeorm-unit-of-work';

import { BcryptPasswordHasher } from './services/bcrypt-password-hasher';
import { JwtTokenService } from './services/jwt-token-service';
import { UuidIdGenerator } from './services/uuid-id-generator';
import { SystemClock } from './services/system-clock';

import { IUserRepository } from '../domain/interfaces/repositories/user-repository.interface';
import { ICapturedItemRepository } from '../domain/interfaces/repositories/captured-item-repository.interface';
import { IActionRepository } from '../domain/interfaces/repositories/action-repository.interface';
import { IProjectRepository } from '../domain/interfaces/repositories/project-repository.interface';
import { IContextRepository } from '../domain/interfaces/repositories/context-repository.interface';
import { IUnitOfWork } from '../application/interfaces/unit-of-work.interface';
import { IPasswordHasher } from '../application/interfaces/services/password-hasher.interface';
import { ITokenService } from '../application/interfaces/services/token-service.interface';
import { IIdGenerator } from '../application/interfaces/services/id-generator.interface';
import { IClock } from '../application/interfaces/services/clock.interface';

const repositories = [
  { provide: IUserRepository, useClass: TypeOrmUserRepository },
  { provide: ICapturedItemRepository, useClass: TypeOrmCapturedItemRepository },
  { provide: IActionRepository, useClass: TypeOrmActionRepository },
  { provide: IProjectRepository, useClass: TypeOrmProjectRepository },
  { provide: IContextRepository, useClass: TypeOrmContextRepository },
  { provide: IUnitOfWork, useClass: TypeOrmUnitOfWork },
];

const services = [
  { provide: IPasswordHasher, useClass: BcryptPasswordHasher },
  { provide: ITokenService, useClass: JwtTokenService },
  { provide: IIdGenerator, useClass: UuidIdGenerator },
  { provide: IClock, useClass: SystemClock },
];

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => getDatabaseConfig(),
    }),
    TypeOrmModule.forFeature([
      UserOrmEntity,
      CapturedItemOrmEntity,
      ActionOrmEntity,
      ProjectOrmEntity,
      ContextOrmEntity,
    ]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'super-secret',
        signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any },
      }),
    }),
  ],
  providers: [...repositories, ...services],
  exports: [...repositories, ...services],
})
export class InfrastructureModule {}
