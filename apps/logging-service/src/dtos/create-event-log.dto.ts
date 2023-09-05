import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEventLogDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  routing_key: string;

  @IsString()
  @IsNotEmpty()
  exchange: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  payload: string;

  @IsString()
  error_message?: string; // Optional, since errors might not always be present
}
