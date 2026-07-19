import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTuitionRateDto } from './dto/create-tuition-rate.dto';
import { UpdateTuitionRateDto } from './dto/update-tuition-rate.dto';

@Injectable()
export class TuitionRatesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateTuitionRateDto) {
    return this.prisma.tuitionRate.create({
      data: {
        ...dto,
        effectiveFrom: new Date(dto.effectiveFrom),
        effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : undefined,
      },
    });
  }

  findAll() {
    return this.prisma.tuitionRate.findMany();
  }

  async findOne(id: string) {
    const rate = await this.prisma.tuitionRate.findUnique({ where: { id } });
    if (!rate) throw new NotFoundException('TuitionRate not found');
    return rate;
  }

  update(id: string, dto: UpdateTuitionRateDto) {
    return this.prisma.tuitionRate.update({
      where: { id },
      data: {
        ...dto,
        effectiveFrom: dto.effectiveFrom ? new Date(dto.effectiveFrom) : undefined,
        effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : undefined,
      },
    });
  }

  remove(id: string) {
    return this.prisma.tuitionRate.delete({ where: { id } });
  }
}
