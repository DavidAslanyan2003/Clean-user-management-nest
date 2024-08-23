import { IsNotEmpty, IsString } from 'class-validator';

export class CustomResponse<T> {
  @IsNotEmpty()
  @IsString()
  status: string;

  data?: T;

  @IsString()
  error?: string;

  @IsString()
  message?: string;

  constructor(status: string, data?: T, error?: string, message?: string) {
    this.status = status;
    this.data = data;
    this.error = error;
    this.message = message;
  }
}
