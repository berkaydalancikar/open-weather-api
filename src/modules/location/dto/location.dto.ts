import { IsNumber, IsString } from 'class-validator';

export class LocationDto {
  @IsString()
  id: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lon: number;


  constructor(data: { id: string, latitude: number, longitude: number }) {
    this.id = data.id;
    this.lat = data.latitude;
    this.lon = data.longitude;
  }
}