import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeeTypeDto } from './dto/create-fee-type.dto';
import { UpdateFeeTypeDto } from './dto/update-fee-type.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class FeeTypesService {
  constructor(private prisma: PrismaService) {}

  create(createFeeTypeDto: CreateFeeTypeDto) {
    return this.prisma.feeType.create({ data: createFeeTypeDto });
  }

  findAll() {
    return this.prisma.feeType.findMany();
  }

  async findOne(id: string) {
    const feeType = await this.prisma.feeType.findUnique({ where: { id } });
    if (!feeType) throw new NotFoundException('FeeType not found');
    return feeType;
  }

  update(id: string, updateFeeTypeDto: UpdateFeeTypeDto) {
    return this.prisma.feeType.update({
      where: { id },
      data: updateFeeTypeDto,
    });
  }

  remove(id: string) {
    return this.prisma.feeType.delete({ where: { id } });
  }
}
