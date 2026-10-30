import { Request, Response } from 'express';
import { inquiryService } from './inquiry.service.js';

export async function submitInquiry(req: Request, res: Response) {
  try {
    const inquiry = await inquiryService.createInquiry(req.body);
    res.status(201).json({
      success: true,
      data: inquiry,
      message: 'Thank you for your interest. A master concierge will contact you within 2 business hours.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'INQUIRY_SUBMISSION_FAILED', message: error.message },
    });
  }
}

export async function listInquiries(req: Request, res: Response) {
  try {
    const status = req.query.status as string | undefined;
    const inquiries = await inquiryService.getAllInquiries(status);
    res.status(200).json({
      success: true,
      data: inquiries,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'INQUIRY_FETCH_FAILED', message: error.message },
    });
  }
}

export async function updateInquiry(req: Request, res: Response) {
  try {
    const { status, internalNotes } = req.body;
    const inquiry = await inquiryService.updateInquiryStatus(req.params.id, status, internalNotes);
    res.status(200).json({
      success: true,
      data: inquiry,
      message: 'Inquiry record updated.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'INQUIRY_UPDATE_FAILED', message: error.message },
    });
  }
}
