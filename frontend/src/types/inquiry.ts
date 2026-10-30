export type InquiryStatus = 'PENDING' | 'CONTACTED' | 'SCHEDULED' | 'CLOSED';

export interface Inquiry {
  id: string;
  fullName: string;
  name?: string;
  email: string;
  subject?: string;
  phone?: string;
  preferredKarat?: string;
  message: string;
  status: InquiryStatus;
  internalNotes?: string;
  productId?: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    purity?: string;
  };
  createdAt: string;
}

export interface InquiryInput {
  fullName: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  preferredKarat?: string;
  productId?: string;
}
