import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export function PaginatedResponseDto<T>(itemType: Type<T>) {
  class PaginatedResponseClass {
    @ApiProperty({ type: [itemType] })
    items: T[];

    @ApiProperty({
      description: 'Total number of items',
      example: 100,
    })
    total: number;
  }

  return PaginatedResponseClass;
}
