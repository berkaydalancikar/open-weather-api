import { HttpStatus, Injectable } from '@nestjs/common';
import { LocationService } from '../location/location.service';
import { AppException } from 'src/common/exceptions/app-exception';
import axios from 'axios';
import { SuccessResult } from 'src/common/responses/successResult';
import { RedisService } from 'src/core/redis/redis.service';

@Injectable()
export class WeatherService {
  constructor(
    private readonly locationService: LocationService,
    private readonly redisService: RedisService,
  ) {}

  async getWeatherData(locationId: string) {
    try {
      const location = await this.locationService.getLocation(locationId);

      const cached = await this.redisService.get(`weather:${locationId}`);

      if (cached) {
        return new SuccessResult(JSON.parse(cached));
      }

      const response = await axios.get(
        'http://api.openweathermap.org/data/2.5/forecast',
        {
          params: {
            lat: location.lat,
            lon: location.lon,
            appid: process.env.OPEN_WEATHER_API_KEY,
          },
        },
      );

      const data = response.data.list;

      await this.redisService.set(`weather:${locationId}`, JSON.stringify(data), 3600);

      return new SuccessResult(data);
    } catch (error) {
      throw new AppException({ message: error.message, code: error.status, status: HttpStatus.INTERNAL_SERVER_ERROR});
    }
  }
}