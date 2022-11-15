import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../../common/enums/roles.enum';

export const Roles = (...roles: RolesEnum[]) => SetMetadata('roles', roles);
