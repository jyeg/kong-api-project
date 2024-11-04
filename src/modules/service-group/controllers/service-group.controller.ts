import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
  Res,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ServiceGroupService } from '../services/service-group.service';
import { CreateServiceGroupDto } from '../dto/create-service-group.dto';
import { UpdateServiceGroupDto } from '../dto/update-service-group.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { FindServiceGroupsDto } from '../dto/find-service-groups.dto';
import { OwnershipGuard } from '../../../common/guards/ownership.guard';
import { ServiceGroupDto } from '../dto/service-group.dto';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';
import { ErrorResponseDto } from '../../../common/dto/error-response.dto';

@ApiTags('service-group')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
  type: ErrorResponseDto,
})
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
  type: ErrorResponseDto,
})
@Controller('service-group')
export class ServiceGroupController {
  constructor(private readonly serviceGroupService: ServiceGroupService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Service group created successfully.',
    type: ServiceGroupDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request - invalid input',
    type: ErrorResponseDto,
  })
  async create(
    @Body() createServiceGroupDto: CreateServiceGroupDto,
    @Request() req,
    @Res() res,
  ) {
    try {
      const user = req.user;
      const result = await this.serviceGroupService.create({
        ...createServiceGroupDto,
        userId: user.id,
      });
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Service groups retrieved successfully.',
    type: PaginatedResponseDto,
  })
  async findAll(
    @Query() query: FindServiceGroupsDto,
    @Request() req,
    @Res() res,
  ) {
    try {
      const user = req.user;
      const [result, total] = await this.serviceGroupService.findAll(
        query,
        user,
      );
      return res.status(HttpStatus.OK).json({ items: result, total });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @ApiOkResponse({
    description: 'Service group retrieved successfully.',
    type: ServiceGroupDto,
  })
  @ApiNotFoundResponse({
    description: 'Service group not found',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      const result = await this.serviceGroupService.findOne(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @ApiOkResponse({
    description: 'Service group updated successfully.',
    type: ServiceGroupDto,
  })
  @ApiNotFoundResponse({
    description: 'Service group not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request - invalid input',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateServiceGroupDto: UpdateServiceGroupDto,
    @Request() req,
    @Res() res,
  ) {
    try {
      const user = req.user;
      const result = await this.serviceGroupService.update(id, {
        ...updateServiceGroupDto,
        userId: user.id,
      });
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @ApiOkResponse({
    description: 'Service group deleted successfully.',
    type: ServiceGroupDto,
  })
  @ApiNotFoundResponse({
    description: 'Service group not found',
    type: ErrorResponseDto,
  })
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const result = await this.serviceGroupService.remove(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
