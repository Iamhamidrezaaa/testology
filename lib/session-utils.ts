import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function getSessionWithFallback() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return null;
    }
    
    // Ensure user has an id
    if (!session.user.id) {
      // If no id, try to use email as fallback
      if (session.user.email) {
        return {
          ...session,
          user: {
            ...session.user,
            id: session.user.email, // Use email as fallback id
          }
        };
      }
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export function validateSession(session: any): boolean {
  return !!(session && session.user && session.user.id);
}




