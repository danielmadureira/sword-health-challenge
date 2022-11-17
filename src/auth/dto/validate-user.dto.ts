import { IsString } from 'class-validator';

export class ValidateUserDTO {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
