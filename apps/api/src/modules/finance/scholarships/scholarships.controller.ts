import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScholarshipsService } from './scholarships.service';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';
import { Permissions } from '../../../auth/decorators/permissions.decorator';

@Controller('scholarships')
export class ScholarshipsController {
  constructor(private readonly scholarshipsService: ScholarshipsService) {}

  @Post()
  @Permissions('fee.manage')
  create(@Body() createScholarshipDto: CreateScholarshipDto) {
    return this.scholarshipsService.create(createScholarshipDto);
  }

  @Get()
  @Permissions('fee.manage')
  findAll() {
    return this.scholarshipsService.findAll();
  }

  @Get(':id')
  @Permissions('fee.manage')
  findOne(@Param('id') id: string) {
    return this.scholarshipsService.findOne(id);
  }

  @Patch(':id')
  @Permissions('fee.manage')
  update(@Param('id') id: string, @Body() updateScholarshipDto: UpdateScholarshipDto) {
    return this.scholarshipsService.update(id, updateScholarshipDto);
  }

  @Delete(':id')
  @Permissions('fee.manage')
  remove(@Param('id') id: string) {
    return this.scholarshipsService.remove(id);
  }
}
