import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServiceGroupService } from '../services/service-group.service';
import { CreateServiceGroupDto } from '../dto/create-service-group.dto';
import { UpdateServiceGroupDto } from '../dto/update-service-group.dto';

@Controller('service-group')
export class ServiceGroupController {
  constructor(private readonly serviceGroupService: ServiceGroupService) {}

  @Post()
  create(@Body() createServiceGroupDto: CreateServiceGroupDto) {
    return this.serviceGroupService.create(createServiceGroupDto);
  }

  @Get()
  findAll() {
    return this.serviceGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceGroupService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServiceGroupDto: UpdateServiceGroupDto,
  ) {
    return this.serviceGroupService.update(id, updateServiceGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceGroupService.remove(id);
  }
}
