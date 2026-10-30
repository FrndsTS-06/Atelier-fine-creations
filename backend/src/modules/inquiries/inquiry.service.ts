import { inquiryRepository } from './inquiry.repository.js';
import { CreateInquiryInput } from './inquiry.schema.js';

export class InquiryService {
  async createInquiry(data: CreateInquiryInput) {
    const clientName = (data.name || data.fullName || '').trim();
    const clientFullName = (data.fullName || data.name || '').trim();
    const normalizedEmail = data.email.trim().toLowerCase();
    const normalizedPhone = data.phone?.trim() || undefined;
    const normalizedSubject = data.subject?.trim() || undefined;

    return inquiryRepository.create({
      name: clientName,
      fullName: clientFullName,
      email: normalizedEmail,
      subject: normalizedSubject,
      phone: normalizedPhone,
      preferredKarat: data.preferredKarat,
      message: data.message.trim(),
      productId: data.productId,
    });
  }

  async getAllInquiries(statusFilter?: string) {
    return inquiryRepository.findMany(statusFilter);
  }

  async updateInquiryStatus(id: string, status: string, internalNotes?: string) {
    return inquiryRepository.updateStatus(id, status, internalNotes);
  }
}

export const inquiryService = new InquiryService();
