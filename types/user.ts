export interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export type ExtendedUser = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  firstName?: string | null;
  lastName?: string | null;
  birthDate?: Date | null;
  isAdmin: boolean;
  role: 'user' | 'admin';
  hashedPassword?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserLevel {
  id: string;
  level: number;
  title: string;
  minPoints: number;
  badgeUrl?: string;
  benefits?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  location?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: boolean;
    emailUpdates: boolean;
  };
  createdAt: string;
  updatedAt: string;
}