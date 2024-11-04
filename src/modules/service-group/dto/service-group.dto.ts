import { ApiProperty } from '@nestjs/swagger';

export class ServiceGroupDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description?: string;

  @ApiProperty({ type: [String] })
  tags?: string[];

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [String] })
  versions: string[];
}
