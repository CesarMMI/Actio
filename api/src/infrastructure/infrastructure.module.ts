import { Module } from '@nestjs/common';
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

const repositories = [
  {
    provide: 'USER_REPOSITORY',
    useClass: TypeOrmUserRepository,
  },
  {
    provide: 'CAPTURED_ITEM_REPOSITORY',
    useClass: TypeOrmCapturedItemRepository,
  },
  {
    provide: 'ACTION_REPOSITORY',
    useClass: TypeOrmActionRepository,
  },
  {
    provide: 'PROJECT_REPOSITORY',
    useClass: TypeOrmProjectRepository,
  },
  {
    provide: 'CONTEXT_REPOSITORY',
    useClass: TypeOrmContextRepository,
  },
  {
    provide: 'UNIT_OF_WORK',
    useClass: TypeOrmUnitOfWork,
  },
];

const services = [
  {
    provide: 'PASSWORD_HASHER',
    useClass: BcryptPasswordHasher,
  },
  {
    provide: 'TOKEN_SERVICE',
    useClass: JwtTokenService,
  },
  {
    provide: 'ID_GENERATOR',
    useClass: UuidIdGenerator,
  },
  {
    provide: 'CLOCK',
    useClass: SystemClock,
  },
];

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
        secret: process.env.JWT_SECRET || 'super-secret', // fallback for dev
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
      }),
    }),
  ],
  providers: [...repositories, ...services],
  exports: [...repositories, ...services],
})
export class InfrastructureModule {}
