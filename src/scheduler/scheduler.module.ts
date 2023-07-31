import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockEntity, TransactionEntity } from 'src/database/entities';
import { Jobs } from './cronjobs';
import { CronJobLockService } from './lock.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([TransactionEntity, BlockEntity]),
  ],
  providers: [ConfigService, CronJobLockService, ...Jobs],
})
export class SchedulerModule {}
