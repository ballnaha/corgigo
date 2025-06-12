import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRole } from '@/types';

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret';
const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, NEXTAUTH_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, NEXTAUTH_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `CG${timestamp}${random}`.toUpperCase();
} 