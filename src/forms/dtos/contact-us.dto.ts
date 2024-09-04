import { IsEmail, IsNotEmpty } from "class-validator";

export class ContactUsDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  message: string;
};
