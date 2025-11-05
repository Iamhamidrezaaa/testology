import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return false;
  }

  // اگر ایمیل کاربر h.asgarizade@gmail.com است، اجازه دسترسی می‌دهیم
  if (session.user.email === 'h.asgarizade@gmail.com') {
    // اطمینان حاصل می‌کنیم که نقش کاربر در دیتابیس admin است
    await prisma.user.update({
      where: { email: session.user.email },
      data: { role: 'admin' }
    });
    return true;
  }

  // برای سایر کاربران، نقش را از دیتابیس بررسی می‌کنیم
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  });

  return user?.role === 'admin';
} 