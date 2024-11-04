import { Role } from '../../../common/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  teamId: string;

  @ApiProperty()
  roles: Role[];
}
