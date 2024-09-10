import { IsEmail, IsNotEmpty } from 'class-validator';

export class NewsLetterDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
