import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { BlockEntity, TransactionEntity } from 'src/database/entities';
import { bigIntToHex } from 'src/helpers';
import { CronJobLockService } from 'src/scheduler/lock.service';
import { Repository } from 'typeorm';

@Injectable()
export class SaveBlocksJob {
  private apiKey: bigint;
  private startBlockNumber: bigint;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly cronJobLockService: CronJobLockService,

    @InjectRepository(BlockEntity)
    private blockRepository: Repository<BlockEntity>,

    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
  ) {
    this.apiKey = this.configService.get('ETHERSCAN_API_KEY');
    this.startBlockNumber = BigInt(17583000);
  }

  @Cron('* * * * *')
  async saveBlocks() {
    if (this.cronJobLockService.acquireLock()) {
      return;
    }

    try {
      this.startBlockNumber = await this.getLastSavedBlockNumber();

      const { data } = await firstValueFrom(
        this.httpService
          .get<{ result: string }>(
            `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${this.apiKey}`,
          )
          .pipe(
            catchError((error: AxiosError) => {
              console.error(error.response.data);
              throw new Error('An error while getting block');
            }),
          ),
      );

      const currentBlock = BigInt(data.result);

      if (this.startBlockNumber < currentBlock) {
        for (
          let blockNumber = this.startBlockNumber;
          blockNumber < currentBlock;
          blockNumber += BigInt(1)
        ) {
          await this.saveBlockAndTransactions(bigIntToHex(blockNumber));

          // Delay because of api call limit
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    } finally {
      this.cronJobLockService.releaseLock();
    }
  }

  private async saveBlockAndTransactions(blockNumber: string): Promise<void> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<{
          result: {
            transactions: { from: string; to: string; value: string }[];
          };
        }>(
          `https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${blockNumber}&boolean=true&apikey=${this.apiKey}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error.response.data);
            throw new Error('An error while getting transactions');
          }),
        ),
    );

    const newBlock = this.blockRepository.create({
      number: blockNumber,
    });

    await this.blockRepository.save(newBlock);

    const transactions = data.result.transactions
      .filter((transaction) => transaction.from && transaction.to)
      .map((transaction) =>
        this.transactionRepository.create({
          ...transaction,
          blockId: newBlock.id,
        }),
      );

    await this.transactionRepository.save(transactions);
  }

  private async getLastSavedBlockNumber(): Promise<bigint> {
    const savedBlocks = await this.blockRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    return savedBlocks[0]
      ? BigInt(savedBlocks[0].number) + BigInt(1)
      : this.startBlockNumber;
  }
}
