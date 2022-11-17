import { IsEnum, IsString } from 'class-validator';
import { RolesEnum } from 'src/common/enums/roles.enum';

export class CreateUserDTO {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEnum(RolesEnum)
  role: RolesEnum;
}
