import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { InvoicePreviewDto, InvoicePreviewItemDto } from './dto/invoice-preview.dto';

@Injectable()
export class InvoiceCalculationService {
  private readonly logger = new Logger(InvoiceCalculationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async calculate(studentId: string, semesterId: string): Promise<InvoicePreviewDto> {
    const warnings: string[] = [];
    let eligibleToGenerate = true;

    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new Error('Student not found');
    }

    const semester = await this.prisma.semester.findUnique({
      where: { id: semesterId },
    });

    if (!semester) {
      throw new Error('Semester not found');
    }

    // 1. Get active enrollments (not dropped/cancelled)
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        studentId,
        classSection: {
          semesterId,
        },
        status: 'ENROLLED',
      },
      include: {
        classSection: {
          include: {
            course: true,
          },
        },
      },
    });

    // 2. Resolve default tuition fee type
    const tuitionFeeType = await this.prisma.feeType.findFirst({
      where: { code: 'TUITION' }, // Assuming 'TUITION' is seeded
    });

    if (!tuitionFeeType) {
      eligibleToGenerate = false;
      warnings.push('Hệ thống thiếu cấu hình loại phí TUITION (học phí).');
    }

    // Resolve rates based on semester and maybe department, etc.
    const activeRates = await this.prisma.tuitionRate.findMany({
      where: {
        semesterId: semester.id,
        isActive: true,
      },
      orderBy: {
        effectiveFrom: 'desc',
      },
    });

    const items: InvoicePreviewItemDto[] = [];
    let subtotal = new Prisma.Decimal(0);

    for (const enrollment of enrollments) {
      const course = enrollment.classSection.course;

      // Find matching rate
      const rate = activeRates.find(
        (r) =>
          (r.courseId === course.id || !r.courseId) &&
          (r.departmentId === course.departmentId || !r.departmentId),
      );

      if (!rate) {
        eligibleToGenerate = false;
        warnings.push(
          `Môn học ${course.courseCode} (${course.name}) không có đơn giá học phí áp dụng.`,
        );
        continue;
      }

      const unitAmount = rate.amountPerCredit
        ? new Prisma.Decimal(rate.amountPerCredit)
        : new Prisma.Decimal(0);
      const quantity = course.credits;
      const totalAmount = unitAmount.mul(quantity);

      subtotal = subtotal.add(totalAmount);

      items.push({
        enrollmentId: enrollment.id,
        courseId: course.id,
        courseCode: course.courseCode,
        courseName: course.name,
        credits: course.credits,
        feeTypeId: tuitionFeeType?.id ?? '',
        calculationMethod: 'CREDIT_BASED',
        rateSource: `TuitionRate:${rate.id}`,
        quantity,
        unitAmount: unitAmount.toString(),
        discountAmount: '0',
        totalAmount: totalAmount.toString(),
        calculationSnapshot: {
          rateId: rate.id,
          rateAmount: rate.amountPerCredit ? rate.amountPerCredit.toString() : '0',
          credits: course.credits,
        },
      });
    }

    // 3. Resolve scholarships
    let scholarshipDiscount = new Prisma.Decimal(0);
    const studentScholarships = await this.prisma.studentScholarship.findMany({
      where: {
        studentId,
        semesterId: semester.id,
        status: 'APPROVED',
      },
      include: {
        scholarship: true,
      },
    });

    for (const ss of studentScholarships) {
      const sch = ss.scholarship;
      if (sch.discountType === 'PERCENTAGE') {
        const discount = subtotal.mul(new Prisma.Decimal(sch.discountValue.toString())).div(100);
        scholarshipDiscount = scholarshipDiscount.add(discount);
      } else {
        scholarshipDiscount = scholarshipDiscount.add(
          new Prisma.Decimal(sch.discountValue.toString()),
        );
      }
    }

    // discount cannot exceed subtotal
    if (scholarshipDiscount.greaterThan(subtotal)) {
      scholarshipDiscount = subtotal;
    }

    const adjustmentAmount = new Prisma.Decimal(0);
    // Optional: resolve existing draft adjustments? We will keep it simple.

    const totalAmount = subtotal.sub(scholarshipDiscount).add(adjustmentAmount);

    return {
      student: {
        id: student.id,
        studentCode: student.studentCode,
        fullName: student.fullName,
      },
      semester: {
        id: semester.id,
        code: semester.code,
        name: semester.name,
      },
      items,
      subtotal: subtotal.toString(),
      scholarshipDiscount: scholarshipDiscount.toString(),
      adjustmentAmount: adjustmentAmount.toString(),
      totalAmount: totalAmount.toString(),
      currency: 'VND',
      warnings,
      eligibleToGenerate: eligibleToGenerate && items.length > 0,
    };
  }
}
