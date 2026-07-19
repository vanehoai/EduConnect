import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FeeTypesService } from './fee-types.service';
import { CreateFeeTypeDto } from './dto/create-fee-type.dto';
import { UpdateFeeTypeDto } from './dto/update-fee-type.dto';
import { Permissions } from '../../../auth/decorators/permissions.decorator';

@Controller('fee-types')
export class FeeTypesController {
  constructor(private readonly feeTypesService: FeeTypesService) {}

  @Post()
  @Permissions('fee.manage')
  create(@Body() createFeeTypeDto: CreateFeeTypeDto) {
    return this.feeTypesService.create(createFeeTypeDto);
  }

  @Get()
  @Permissions('fee.manage')
  findAll() {
    return this.feeTypesService.findAll();
  }

  @Get(':id')
  @Permissions('fee.manage')
  findOne(@Param('id') id: string) {
    return this.feeTypesService.findOne(id);
  }

  @Patch(':id')
  @Permissions('fee.manage')
  update(@Param('id') id: string, @Body() updateFeeTypeDto: UpdateFeeTypeDto) {
    return this.feeTypesService.update(id, updateFeeTypeDto);
  }

  @Delete(':id')
  @Permissions('fee.manage')
  remove(@Param('id') id: string) {
    return this.feeTypesService.remove(id);
  }
}
