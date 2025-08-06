import { Body, Controller, Post, Req } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationRequestDto } from './dto/createLocation.request.dto';
import { createLocationResponseDto } from './dto/createLocation.response.dto';
import { SuccessResult } from 'src/common/responses/successResult';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { ROLES } from 'src/common/constants';
import { LocationDto } from './dto/location.dto';

@ApiTags('Location')
@ApiBearerAuth('access-token')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Auth(ROLES.ADMIN)
  @Post('create')
  async createLocation(@Body() createLocationRequestDto: CreateLocationRequestDto): Promise<SuccessResult<createLocationResponseDto>> {
    return await this.locationService.createLocation(createLocationRequestDto);
  }

  @Auth(ROLES.ADMIN, ROLES.USER)
  @Post('get')
  async getLocations(@Req() req): Promise<SuccessResult<LocationDto[]>> {
    return await this.locationService.getLocations(req.user.role);
  }
}