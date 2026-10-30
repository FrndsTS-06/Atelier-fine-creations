import { prisma } from '../../config/database.js';

export class AuthRepository {
  async findAdminByEmail(email: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const admin = await prisma.adminUser.findUnique({
      where: { email: normalizedEmail },
    });
    if (admin) return admin;

    // Fallback to legacy users table if present
    return prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
  }

  async findAdminById(id: string) {
    const admin = await prisma.adminUser.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (admin) return admin;

    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}

export const authRepository = new AuthRepository();
