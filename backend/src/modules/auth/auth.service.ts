import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authRepository } from './auth.repository.js';
import { ENV } from '../../config/env.js';

export class AuthService {
  async authenticateUser(email: string, passwordAttempt: string) {
    const user = await authRepository.findAdminByEmail(email);

    if (!user) {
      throw new Error('Invalid email or credentials for atelier access.');
    }

    const isValid = await bcrypt.compare(passwordAttempt, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or credentials for atelier access.');
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN as any,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName || 'Admin',
        role: user.role,
      },
      token,
    };
  }

  async getCurrentUser(userId: string) {
    return authRepository.findAdminById(userId);
  }
}

export const authService = new AuthService();
