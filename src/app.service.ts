import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockEntity } from './database/entities';
import { GetAddressDto } from './dto/get-address.dto';
import { bigIntToHex } from './helpers';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(BlockEntity)
    private blockRepository: Repository<BlockEntity>,
  ) {}

  async getMostChangeBalanceAddress(): Promise<GetAddressDto> {
    const blocks = await this.blockRepository.find({
      order: { createdAt: 'DESC' },
      take: 100,
      relations: {
        transactions: true,
      },
    });

    const addresses = new Map<string, bigint>();

    blocks.forEach((block) => {
      block.transactions.forEach((transaction) => {
        const { from, to, value } = transaction;
        const transactionValue = BigInt(value);

        if (addresses.has(from)) {
          const previousValue = addresses.get(from);
          addresses.set(from, previousValue - transactionValue);
        } else {
          addresses.set(from, -transactionValue);
        }

        if (addresses.has(to)) {
          const previousValue = addresses.get(to);
          addresses.set(to, previousValue + transactionValue);
        } else {
          addresses.set(to, transactionValue);
        }
      });
    });

    let maxValueChange = BigInt(0);
    let addressWithMaxChange = '';

    addresses.forEach((value, key) => {
      if (value < BigInt(0)) {
        value *= BigInt(-1);
      }
      if (value > maxValueChange) {
        maxValueChange = value;
        addressWithMaxChange = key;
      }
    });

    return new GetAddressDto(addressWithMaxChange, bigIntToHex(maxValueChange));
  }
}
