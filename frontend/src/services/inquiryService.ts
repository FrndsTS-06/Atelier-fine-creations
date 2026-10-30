import { request } from './apiClient';
import { Inquiry, InquiryInput } from '../types/inquiry';

/**
 * Inquiry service abstraction for managing salon consultation requests.
 * Directly communicates with the backend API (`POST /api/inquiries`)
 * without fabricating false successes when the server is unavailable.
 */
export const inquiryService = {
  async submitInquiry(data: InquiryInput): Promise<Inquiry> {
    return request<Inquiry>('/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getInquiries(status?: string): Promise<Inquiry[]> {
    const qs = status ? `?status=${status}` : '';
    return request<Inquiry[]>(`/inquiries${qs}`);
  },

  async updateStatus(id: string, status: string, internalNotes?: string): Promise<Inquiry> {
    return request<Inquiry>(`/inquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, internalNotes }),
    });
  },
};
