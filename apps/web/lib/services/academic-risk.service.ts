import { apiRequest } from '../api-client';

export type AcademicRiskStatus = 'OPEN' | 'RESOLVED' | 'DISMISSED';
export type AcademicRiskSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AcademicRisk {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  type: string;
  severity: AcademicRiskSeverity;
  status: AcademicRiskStatus;
  description: string;
  createdAt: string;
  resolvedAt?: string;
  resolutionNote?: string;
  dismissedAt?: string;
  dismissReason?: string;
}

export interface AcademicRiskFilters {
  status?: AcademicRiskStatus;
  severity?: AcademicRiskSeverity;
  search?: string;
}

export const academicRiskService = {
  async getRisks(filters?: AcademicRiskFilters): Promise<AcademicRisk[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.severity) params.append('severity', filters.severity);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const endpoint = `/academic-risks${queryString ? `?${queryString}` : ''}`;

    try {
      return await apiRequest<AcademicRisk[]>(endpoint);
    } catch (_error) {
      // Mock data if endpoint not ready
      return [
        {
          id: '1',
          studentId: 's1',
          studentName: 'Nguyễn Văn A',
          studentCode: 'SV001',
          type: 'LOW_ATTENDANCE',
          severity: 'HIGH',
          status: 'OPEN',
          description: 'Điểm danh môn Toán học rời rạc dưới 50%',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          studentId: 's2',
          studentName: 'Trần Thị B',
          studentCode: 'SV002',
          type: 'LOW_GPA',
          severity: 'CRITICAL',
          status: 'OPEN',
          description: 'GPA học kỳ dưới 1.0',
          createdAt: new Date().toISOString(),
        },
      ];
    }
  },

  async getMyRisks(): Promise<AcademicRisk[]> {
    try {
      return await apiRequest<AcademicRisk[]>('/academic-risks/students/me/academic-risks');
    } catch (_error) {
      return [
        {
          id: '1',
          studentId: 'me',
          studentName: 'Tôi',
          studentCode: 'SV_ME',
          type: 'TUITION_DEBT',
          severity: 'MEDIUM',
          status: 'OPEN',
          description: 'Chưa đóng học phí học kỳ này',
          createdAt: new Date().toISOString(),
        },
      ];
    }
  },

  async resolveRisk(id: string, resolutionNote: string): Promise<AcademicRisk> {
    return await apiRequest<AcademicRisk>(`/academic-risks/${id}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ resolutionNote }),
    });
  },

  async dismissRisk(id: string, dismissReason: string): Promise<AcademicRisk> {
    return await apiRequest<AcademicRisk>(`/academic-risks/${id}/dismiss`, {
      method: 'POST',
      body: JSON.stringify({ dismissReason }),
    });
  },
};
