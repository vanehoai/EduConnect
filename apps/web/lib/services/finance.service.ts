import { apiRequest } from '../api-client';

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FeeTypeDto {
  id: string;
  code: string;
  name: string;
  description?: string;
  isRecurring: boolean;
  isMandatory: boolean;
}

export interface TuitionRateDto {
  id: string;
  academicYearId: string;
  semesterId?: string;
  programId?: string;
  courseId?: string;
  calculationMethod: string;
  amountPerCredit?: number;
  fixedAmount?: number;
  effectiveFrom: string;
  effectiveTo?: string;
  academicYear?: { name: string };
  semester?: { name: string };
  course?: { code: string; name: string };
  department?: { name: string };
}

export interface ScholarshipDto {
  id: string;
  code: string;
  name: string;
  type: string;
  amount: number;
  percentage?: number;
  valueType?: string;
  value?: number;
  isActive: boolean;
}

export interface InvoiceItemDto {
  id: string;
  description: string;
  quantity: number;
  unitAmount: number;
  totalAmount: number;
  discountAmount: number;
}

export interface InvoiceDto {
  id: string;
  invoiceCode: string;
  studentId: string;
  semesterId: string;
  totalAmount: number;
  balanceAmount: number;
  paidAmount: number;
  dueDate: string;
  status: string;
  items: InvoiceItemDto[];
  student?: { studentCode: string; user?: { fullName: string } };
  semester?: { name: string };
}

export interface ReceiptDto {
  id: string;
  receiptNumber: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  invoice?: { invoiceCode: string };
  student?: { studentCode: string; user?: { fullName: string } };
}

export interface PaymentDto {
  id: string;
  amount: number;
  status: string;
  paymentMethod: string;
}

function buildQuery(params?: Record<string, unknown>): string {
  if (!params) return '';
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
}

export const FinanceService = {
  getFeeTypes: (params?: Record<string, unknown>): Promise<PaginatedResponse<FeeTypeDto>> =>
    apiRequest(`/finance/fee-types${buildQuery(params)}`),
  getFeeType: (id: string): Promise<{ data: FeeTypeDto }> => apiRequest(`/finance/fee-types/${id}`),
  createFeeType: (data: Record<string, unknown>): Promise<{ data: FeeTypeDto }> =>
    apiRequest('/finance/fee-types', { method: 'POST', body: JSON.stringify(data) }),
  updateFeeType: (id: string, data: Record<string, unknown>): Promise<{ data: FeeTypeDto }> =>
    apiRequest(`/finance/fee-types/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteFeeType: (id: string): Promise<void> =>
    apiRequest(`/finance/fee-types/${id}`, { method: 'DELETE' }),

  getTuitionRates: (params?: Record<string, unknown>): Promise<PaginatedResponse<TuitionRateDto>> =>
    apiRequest(`/finance/tuition-rates${buildQuery(params)}`),
  createTuitionRate: (data: Record<string, unknown>): Promise<{ data: TuitionRateDto }> =>
    apiRequest('/finance/tuition-rates', { method: 'POST', body: JSON.stringify(data) }),
  updateTuitionRate: (
    id: string,
    data: Record<string, unknown>,
  ): Promise<{ data: TuitionRateDto }> =>
    apiRequest(`/finance/tuition-rates/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteTuitionRate: (id: string): Promise<void> =>
    apiRequest(`/finance/tuition-rates/${id}`, { method: 'DELETE' }),

  getScholarships: (params?: Record<string, unknown>): Promise<PaginatedResponse<ScholarshipDto>> =>
    apiRequest(`/finance/scholarships${buildQuery(params)}`),
  createScholarship: (data: Record<string, unknown>): Promise<{ data: ScholarshipDto }> =>
    apiRequest('/finance/scholarships', { method: 'POST', body: JSON.stringify(data) }),
  updateScholarship: (
    id: string,
    data: Record<string, unknown>,
  ): Promise<{ data: ScholarshipDto }> =>
    apiRequest(`/finance/scholarships/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteScholarship: (id: string): Promise<void> =>
    apiRequest(`/finance/scholarships/${id}`, { method: 'DELETE' }),

  getInvoices: (params?: Record<string, unknown>): Promise<PaginatedResponse<InvoiceDto>> =>
    apiRequest(`/finance/invoices${buildQuery(params)}`),
  getInvoice: (id: string): Promise<{ data: InvoiceDto }> => apiRequest(`/finance/invoices/${id}`),
  createInvoice: (data: Record<string, unknown>): Promise<{ data: InvoiceDto }> =>
    apiRequest('/finance/invoices', { method: 'POST', body: JSON.stringify(data) }),
  updateInvoice: (id: string, data: Record<string, unknown>): Promise<{ data: InvoiceDto }> =>
    apiRequest(`/finance/invoices/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  getPayments: (params?: Record<string, unknown>): Promise<PaginatedResponse<PaymentDto>> =>
    apiRequest(`/finance/payments${buildQuery(params)}`),
  createPayment: (data: Record<string, unknown>): Promise<{ data: PaymentDto }> =>
    apiRequest('/finance/payments', { method: 'POST', body: JSON.stringify(data) }),

  getReceipts: (params?: Record<string, unknown>): Promise<PaginatedResponse<ReceiptDto>> =>
    apiRequest(`/finance/receipts${buildQuery(params)}`),
  getReceipt: (id: string): Promise<{ data: ReceiptDto }> => apiRequest(`/finance/receipts/${id}`),
};
