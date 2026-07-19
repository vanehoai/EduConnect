export class InvoicePreviewItemDto {
  enrollmentId!: string;
  courseId!: string;
  courseCode!: string;
  courseName!: string;
  credits!: number;
  feeTypeId!: string;
  calculationMethod!: string;
  rateSource!: string;
  quantity!: number;
  unitAmount!: number | string;
  discountAmount!: number | string;
  totalAmount!: number | string;
  calculationSnapshot!: Record<string, unknown>;
}

export class InvoicePreviewDto {
  student!: {
    id: string;
    studentCode: string;
    fullName: string;
  };
  semester!: {
    id: string;
    code: string;
    name: string;
  };
  items!: InvoicePreviewItemDto[];
  subtotal!: number | string;
  scholarshipDiscount!: number | string;
  adjustmentAmount!: number | string;
  totalAmount!: number | string;
  currency!: string;
  warnings!: string[];
  eligibleToGenerate!: boolean;
}
