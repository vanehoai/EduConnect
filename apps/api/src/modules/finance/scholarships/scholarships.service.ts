import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';

@Injectable()
export class ScholarshipsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateScholarshipDto) {
    return this.prisma.scholarship.create({
      data: {
        ...dto,
        effectiveFrom: new Date(dto.effectiveFrom),
        effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : undefined,
      },
    });
  }

  findAll() {
    return this.prisma.scholarship.findMany();
  }

  async findOne(id: string) {
    const scholarship = await this.prisma.scholarship.findUnique({ where: { id } });
    if (!scholarship) throw new NotFoundException('Scholarship not found');
    return scholarship;
  }

  update(id: string, dto: UpdateScholarshipDto) {
    return this.prisma.scholarship.update({
      where: { id },
      data: {
        ...dto,
        effectiveFrom: dto.effectiveFrom ? new Date(dto.effectiveFrom) : undefined,
        effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : undefined,
      },
    });
  }

  remove(id: string) {
    return this.prisma.scholarship.delete({ where: { id } });
  }
}
