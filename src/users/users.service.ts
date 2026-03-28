import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserInput } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // ─── GET ALL USERS (admin only) ─────────────
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false,      // never return password
        refreshToken: false,  // never return refresh token
      },
    });
  }

  // ─── GET ONE USER ───────────────────────────
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false,
        refreshToken: false,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // ─── UPDATE USER ────────────────────────────
  async update(id: string, input: UpdateUserInput) {
    await this.findOne(id); // check user exists first

    return this.prisma.user.update({
      where: { id },
      data: { ...input },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false,
        refreshToken: false,
      },
    });
  }

  // ─── DELETE USER ────────────────────────────
  async remove(id: string) {
    await this.findOne(id); // check user exists first

    await this.prisma.user.delete({ where: { id } });
    return true;
  }
}