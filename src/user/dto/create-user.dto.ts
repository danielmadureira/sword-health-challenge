import { IsEnum, IsString } from 'class-validator';
import { RolesEnum } from 'src/common/enums/roles.enum';

export class CreateUserDTO {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;

  @IsEnum(RolesEnum)
  readonly role: RolesEnum;
}
