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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { ServiceGroupService } from '../services/service-group.service';
import { CreateServiceGroupDto } from '../dto/create-service-group.dto';
import { UpdateServiceGroupDto } from '../dto/update-service-group.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { FindServiceGroupsDto } from '../dto/find-service-groups.dto';

@ApiTags('service-group')
@ApiBearerAuth('access-token')
@Controller('service-group')
export class ServiceGroupController {
  constructor(private readonly serviceGroupService: ServiceGroupService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Service group created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createServiceGroupDto: CreateServiceGroupDto, @Request() req) {
    const user = req.user; // Get the logged-in user from the request
    return this.serviceGroupService.create({
      ...createServiceGroupDto,
      userId: user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: FindServiceGroupsDto, @Request() req) {
    const user = req.user;
    return this.serviceGroupService.findAll(query, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Service group retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Service group not found.' })
  findOne(@Param('id') id: string) {
    return this.serviceGroupService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Service group updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Service group not found.' })
  update(
    @Param('id') id: string,
    @Body() updateServiceGroupDto: UpdateServiceGroupDto,
    @Request() req,
  ) {
    const user = req.user;
    return this.serviceGroupService.update(id, {
      ...updateServiceGroupDto,
      userId: user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Service group deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Service group not found.' })
  remove(@Param('id') id: string) {
    return this.serviceGroupService.remove(id);
  }
}
