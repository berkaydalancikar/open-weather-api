import { Injectable } from '@nestjs/common';
import { ERRORS } from 'src/common/errors';
import { AppException } from 'src/common/exceptions/app-exception';
import { SuccessResult } from 'src/common/responses/successResult';
import { DatabaseService } from 'src/core/database/database.service';
import { CreateLocationRequestDto } from './dto/createLocation.request.dto';
import { createLocationResponseDto } from './dto/createLocation.response.dto';
import { ROLES } from 'src/common/constants';
import { LocationDto } from './dto/location.dto';

@Injectable()
export class LocationService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createLocation(createLocationRequestDto: CreateLocationRequestDto): Promise<SuccessResult<createLocationResponseDto>> {
    try {
      const location = await this.databaseService.locations.findFirst({
        where: {
          latitude: createLocationRequestDto.lat,
          longitude: createLocationRequestDto.lon,
        },
      });

      if (location) {
        throw new AppException(ERRORS.LOCATION_ALREADY_EXISTS);
      }

      const newLocation = await this.databaseService.locations.create({
        data: {
          latitude: createLocationRequestDto.lat,
          longitude: createLocationRequestDto.lon,
        },
      });

      return new SuccessResult({ id: newLocation.id });
    } catch (error) {
      throw new AppException(error);
    }
  }

  async getLocations(role: number): Promise<SuccessResult<LocationDto[]>> {
    const query = role === ROLES.USER ? { role: ROLES.USER } : { role: { in: [ROLES.ADMIN, ROLES.USER] } };
    
    try {
      const locations = await this.databaseService.locations.findMany({
        where: query,
      });

      return new SuccessResult(locations.map((location) => new LocationDto(location)));
    } catch (error) {
      throw new AppException(error);
    }
  }

  async getLocation(locationId: string): Promise<LocationDto> {
    try {
      const location = await this.databaseService.locations.findUnique({
        where: { id: locationId },
      });

      if (!location) {
        throw new AppException(ERRORS.LOCATION_NOT_FOUND);
      }

      return new LocationDto(location);
    } catch (error) {
      throw new AppException(error);
    }
  }
}