import { prisma } from '@/lib/prisma';

export interface ContentApprovalItem {
  id: string;
  type: 'blog' | 'comment' | 'user';
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  reason?: string;
}

export interface ApprovalStats {
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
  approvalRate: number;
  averageApprovalTime: number;
}

export class ContentApprovalService {
  // دریافت آیتم‌های در انتظار تأیید
  static async getPendingItems(): Promise<ContentApprovalItem[]> {
    try {
      // دریافت مقالات در انتظار تأیید
      const pendingBlogs = await prisma.blog.findMany({
        where: {
          published: false
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          author: {
            select: {
              name: true
            }
          }
        }
      });

      // دریافت نظرات در انتظار تأیید
      const pendingComments = await prisma.blogComment.findMany({
        where: {
          approved: false
        },
        select: {
          id: true,
          content: true,
          author: true,
          createdAt: true,
          blog: {
            select: {
              title: true
            }
          }
        }
      });

      const items: ContentApprovalItem[] = [
        ...pendingBlogs.map(blog => ({
          id: blog.id,
          type: 'blog' as const,
          title: blog.title,
          content: blog.content.substring(0, 200) + '...',
          author: blog.author?.name || 'ناشناس',
          createdAt: blog.createdAt,
          status: 'pending' as const,
          priority: 'medium' as const
        })),
        ...pendingComments.map(comment => ({
          id: comment.id,
          type: 'comment' as const,
          title: `نظر برای: ${comment.blog.title}`,
          content: comment.content,
          author: comment.author,
          createdAt: comment.createdAt,
          status: 'pending' as const,
          priority: 'low' as const
        }))
      ];

      return items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('خطا در دریافت آیتم‌های در انتظار تأیید:', error);
      return [];
    }
  }

  // تأیید آیتم
  static async approveItem(itemId: string, type: 'blog' | 'comment'): Promise<boolean> {
    try {
      if (type === 'blog') {
        await prisma.blog.update({
          where: { id: itemId },
          data: { 
            published: true,
            publishedAt: new Date()
          }
        });
      } else if (type === 'comment') {
        await prisma.blogComment.update({
          where: { id: itemId },
          data: { approved: true }
        });
      }

      return true;
    } catch (error) {
      console.error('خطا در تأیید آیتم:', error);
      return false;
    }
  }

  // رد آیتم
  static async rejectItem(itemId: string, type: 'blog' | 'comment', reason: string): Promise<boolean> {
    try {
      if (type === 'blog') {
        await prisma.blog.update({
          where: { id: itemId },
          data: { 
            published: false,
            // می‌توانید فیلد reason اضافه کنید
          }
        });
      } else if (type === 'comment') {
        await prisma.blogComment.update({
          where: { id: itemId },
          data: { 
            approved: false,
            // می‌توانید فیلد rejectionReason اضافه کنید
          }
        });
      }

      return true;
    } catch (error) {
      console.error('خطا در رد آیتم:', error);
      return false;
    }
  }

  // دریافت آمار تأیید
  static async getApprovalStats(): Promise<ApprovalStats> {
    try {
      const totalBlogs = await prisma.blog.count();
      const publishedBlogs = await prisma.blog.count({
        where: { published: true }
      });
      const pendingBlogs = await prisma.blog.count({
        where: { published: false }
      });

      const totalComments = await prisma.blogComment.count();
      const approvedComments = await prisma.blogComment.count({
        where: { approved: true }
      });
      const pendingComments = await prisma.blogComment.count({
        where: { approved: false }
      });

      const totalPending = pendingBlogs + pendingComments;
      const totalApproved = publishedBlogs + approvedComments;
      const totalRejected = 0; // اگر فیلد rejected اضافه کنید

      const approvalRate = totalApproved > 0 ? 
        (totalApproved / (totalApproved + totalPending)) * 100 : 0;

      return {
        totalPending,
        totalApproved,
        totalRejected,
        approvalRate: Math.round(approvalRate),
        averageApprovalTime: 24 // ساعت - می‌توانید از داده‌های واقعی محاسبه کنید
      };
    } catch (error) {
      console.error('خطا در دریافت آمار تأیید:', error);
      return {
        totalPending: 0,
        totalApproved: 0,
        totalRejected: 0,
        approvalRate: 0,
        averageApprovalTime: 0
      };
    }
  }

  // دریافت آیتم‌های تأیید شده اخیر
  static async getRecentApprovals(limit: number = 10): Promise<ContentApprovalItem[]> {
    try {
      const recentBlogs = await prisma.blog.findMany({
        where: {
          published: true,
          publishedAt: {
            not: null
          }
        },
        orderBy: {
          publishedAt: 'desc'
        },
        take: limit,
        select: {
          id: true,
          title: true,
          content: true,
          publishedAt: true,
          author: {
            select: {
              name: true
            }
          }
        }
      });

      return recentBlogs.map(blog => ({
        id: blog.id,
        type: 'blog' as const,
        title: blog.title,
        content: blog.content.substring(0, 200) + '...',
        author: blog.author?.name || 'ناشناس',
        createdAt: blog.publishedAt!,
        status: 'approved' as const,
        priority: 'medium' as const
      }));
    } catch (error) {
      console.error('خطا در دریافت آیتم‌های تأیید شده اخیر:', error);
      return [];
    }
  }

  // جستجو در آیتم‌های در انتظار تأیید
  static async searchPendingItems(query: string): Promise<ContentApprovalItem[]> {
    try {
      const items = await this.getPendingItems();
      return items.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.content.toLowerCase().includes(query.toLowerCase()) ||
        item.author.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('خطا در جستجوی آیتم‌ها:', error);
      return [];
    }
  }

  // دریافت آیتم‌های با اولویت بالا
  static async getHighPriorityItems(): Promise<ContentApprovalItem[]> {
    try {
      const items = await this.getPendingItems();
      return items.filter(item => item.priority === 'high');
    } catch (error) {
      console.error('خطا در دریافت آیتم‌های با اولویت بالا:', error);
      return [];
    }
  }

  // بچ تأیید (تأیید چندین آیتم همزمان)
  static async batchApprove(itemIds: string[], type: 'blog' | 'comment'): Promise<boolean> {
    try {
      for (const itemId of itemIds) {
        await this.approveItem(itemId, type);
      }
      return true;
    } catch (error) {
      console.error('خطا در تأیید دسته‌ای:', error);
      return false;
    }
  }

  // بچ رد (رد چندین آیتم همزمان)
  static async batchReject(itemIds: string[], type: 'blog' | 'comment', reason: string): Promise<boolean> {
    try {
      for (const itemId of itemIds) {
        await this.rejectItem(itemId, type, reason);
      }
      return true;
    } catch (error) {
      console.error('خطا در رد دسته‌ای:', error);
      return false;
    }
  }
}