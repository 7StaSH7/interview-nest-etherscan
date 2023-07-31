import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BlockEntity } from './block.entity';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
  updatedAt: Date;

  @Column({
    nullable: false,
  })
  from: string;

  @Column({
    nullable: false,
  })
  to: string;

  @Column({
    nullable: false,
  })
  value: string;

  @Column({
    nullable: false,
  })
  blockId: string;

  @ManyToOne(() => BlockEntity, (block) => block.transactions, {
    onDelete: 'CASCADE',
  })
  block: BlockEntity;
}
