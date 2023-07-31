import { ApiProperty } from '@nestjs/swagger';

export class CommonResponseDto<T> {
  @ApiProperty()
  statusCode: number;

  data: T;
}
