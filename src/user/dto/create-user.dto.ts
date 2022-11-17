import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { RolesEnum } from 'src/common/enums/roles.enum';

export class CreateUserDTO {
  @ApiProperty()
  @IsString()
  readonly username: string;

  @ApiProperty()
  @IsString()
  readonly password: string;

  @ApiProperty({
    name: 'role',
    enum: RolesEnum,
    description:
      'An enum with all possible user roles. ' +
      `E.g.: ${Object.values(RolesEnum)}`,
  })
  @IsEnum(RolesEnum)
  readonly role: RolesEnum;
}
