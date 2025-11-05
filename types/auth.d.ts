import type { Adapter } from 'next-auth/adapters'
import type { AdapterUser } from '@auth/core/adapters'

declare module '@auth/prisma-adapter' {
  interface PrismaAdapter extends Adapter {
    createUser: (user: Omit<AdapterUser, 'id'>) => Promise<AdapterUser>
    getUser: (id: string) => Promise<AdapterUser | null>
    getUserByEmail: (email: string) => Promise<AdapterUser | null>
    getUserByAccount: (providerAccountId: { provider: string; providerAccountId: string }) => Promise<AdapterUser | null>
    updateUser: (user: AdapterUser) => Promise<AdapterUser>
    deleteUser: (userId: string) => Promise<void>
    linkAccount: (account: any) => Promise<void>
    unlinkAccount: (providerAccountId: { provider: string; providerAccountId: string }) => Promise<void>
    createSession: (session: any) => Promise<any>
    getSessionAndUser: (sessionToken: string) => Promise<{ session: any; user: AdapterUser } | null>
    updateSession: (session: any) => Promise<any>
    deleteSession: (sessionToken: string) => Promise<void>
    createVerificationToken: (verificationToken: any) => Promise<any>
    useVerificationToken: (identifier: string, token: string) => Promise<any>
  }
} 