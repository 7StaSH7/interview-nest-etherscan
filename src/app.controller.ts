import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ApiOkCommonResponse } from './decorators/ApiOkCommonResponse';
import { GetAddressDto } from './dto/get-address.dto';

@Controller('addresses')
@ApiTags('addresses')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Get address with most change balance in 100 blocks',
  })
  @ApiOkCommonResponse(GetAddressDto)
  @Get('most-change-balance-in-100-blocks')
  getMostChangeBalanceAddress(): Promise<GetAddressDto> {
    return this.appService.getMostChangeBalanceAddress();
  }
}
