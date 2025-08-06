import { Body, Controller, Post } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { SuccessResult } from 'src/common/responses/successResult';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetWeatherDataRequestDto } from './dto/getWeatherData.request.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { ROLES } from 'src/common/constants';

@ApiTags('Weather')
@ApiBearerAuth('access-token')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}
  
  @Auth(ROLES.ADMIN, ROLES.USER)
  @Post('getWeatherData')
  async getWeatherData(@Body() getWeatherDataRequestDto: GetWeatherDataRequestDto): Promise<SuccessResult<any>> {
    return await this.weatherService.getWeatherData(getWeatherDataRequestDto.locationId);
  }
}