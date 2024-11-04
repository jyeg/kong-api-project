import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Error message',
    example: 'Service group not found',
  })
  message: string;

  @ApiProperty({
    description: 'Error code',
    example: 404,
    required: false,
  })
  statusCode?: number;

  @ApiProperty({
    description: 'Error details',
    example: ['field must not be empty'],
    required: false,
    isArray: true,
    type: String,
  })
  errors?: string[];
}
