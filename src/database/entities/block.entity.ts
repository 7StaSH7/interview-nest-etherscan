import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TransactionEntity } from './transaction.entity';

@Entity('blocks')
export class BlockEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({
    nullable: false,
    unique: true,
  })
  number: string;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.block, {
    eager: true,
  })
  transactions: TransactionEntity[];
}
