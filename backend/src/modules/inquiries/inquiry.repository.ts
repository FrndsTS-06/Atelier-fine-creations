import { prisma } from '../../config/database.js';

export class InquiryRepository {
  async create(data: {
    name: string;
    fullName?: string;
    email: string;
    subject?: string;
    phone?: string;
    preferredKarat?: string;
    message: string;
    productId?: string;
    status?: string;
  }) {
    return prisma.inquiry.create({
      data: {
        name: data.name,
        fullName: data.fullName || data.name,
        email: data.email,
        subject: data.subject,
        phone: data.phone || 'N/A',
        preferredKarat: data.preferredKarat,
        message: data.message,
        productId: data.productId,
        status: data.status || 'PENDING',
      },
      include: {
        product: {
          select: { id: true, name: true, slug: true, purity: true, price: true },
        },
      },
    });
  }

  async findMany(statusFilter?: string) {
    const where: any = {};
    if (statusFilter && statusFilter !== 'ALL') {
      where.status = statusFilter;
    }
    return prisma.inquiry.findMany({
      where,
      include: {
        product: {
          select: { id: true, name: true, slug: true, purity: true, price: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.inquiry.findUnique({
      where: { id },
      include: {
        product: {
          select: { id: true, name: true, slug: true, price: true },
        },
      },
    });
  }

  async updateStatus(id: string, status: string, internalNotes?: string) {
    const data: any = { status };
    if (internalNotes !== undefined) {
      data.internalNotes = internalNotes;
    }
    return prisma.inquiry.update({
      where: { id },
      data,
      include: {
        product: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }
}

export const inquiryRepository = new InquiryRepository();
