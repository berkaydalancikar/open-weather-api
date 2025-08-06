import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { LocationModule } from '../location/location.module';
import { RedisModule } from 'src/core/redis/redis.module';

@Module({
  imports: [LocationModule, RedisModule],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}