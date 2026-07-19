import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TuitionRatesService } from './tuition-rates.service';
import { CreateTuitionRateDto } from './dto/create-tuition-rate.dto';
import { UpdateTuitionRateDto } from './dto/update-tuition-rate.dto';
import { Permissions } from '../../../auth/decorators/permissions.decorator';

@Controller('tuition-rates')
export class TuitionRatesController {
  constructor(private readonly tuitionRatesService: TuitionRatesService) {}

  @Post()
  @Permissions('fee.manage')
  create(@Body() createTuitionRateDto: CreateTuitionRateDto) {
    return this.tuitionRatesService.create(createTuitionRateDto);
  }

  @Get()
  @Permissions('fee.manage')
  findAll() {
    return this.tuitionRatesService.findAll();
  }

  @Get(':id')
  @Permissions('fee.manage')
  findOne(@Param('id') id: string) {
    return this.tuitionRatesService.findOne(id);
  }

  @Patch(':id')
  @Permissions('fee.manage')
  update(@Param('id') id: string, @Body() updateTuitionRateDto: UpdateTuitionRateDto) {
    return this.tuitionRatesService.update(id, updateTuitionRateDto);
  }

  @Delete(':id')
  @Permissions('fee.manage')
  remove(@Param('id') id: string) {
    return this.tuitionRatesService.remove(id);
  }
}
