import { ApiProperty } from '@nestjs/swagger';

export class GetAddressDto {
  constructor(address: string, value: string) {
    this.address = address;
    this.value = value;
  }

  @ApiProperty()
  address: string;

  @ApiProperty()
  value: string;
}
