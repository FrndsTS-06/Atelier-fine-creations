import { Request, Response } from 'express';
import { authService } from './auth.service.js';
import { AuthenticatedRequest } from '../../middleware/authenticate.js';

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const result = await authService.authenticateUser(email, password);
    res.status(200).json({
      success: true,
      data: result,
      message: 'Authentication successful. Welcome to AURÉLIEN Atelier.',
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: { code: 'AUTHENTICATION_FAILED', message: error.message },
    });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'No authenticated session.' },
      });
    }

    const user = await authService.getCurrentUser(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'PROFILE_FETCH_FAILED', message: error.message },
    });
  }
}
