import { prisma } from '@/lib/prisma';
import { sendEmail } from './email';

export interface NotificationData {
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  actionUrl?: string;
  email?: boolean;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

export class NotificationService {
  static async createNotification(data: NotificationData) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId: data.userId,
          title: data.title,
          message: data.message,
          type: data.type,
          actionUrl: data.actionUrl,
          read: false,
        },
      });

      // Send email if requested
      if (data.email) {
        const user = await prisma.user.findUnique({
          where: { id: data.userId },
        });

        if (user?.email) {
          await sendEmail({
            to: user.email,
            subject: data.title,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">${data.title}</h2>
                <p style="color: #666; line-height: 1.6;">${data.message}</p>
                ${data.actionUrl ? `
                  <div style="margin: 20px 0;">
                    <a href="${data.actionUrl}" 
                       style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                      View Details
                    </a>
                  </div>
                ` : ''}
              </div>
            `,
          });
        }
      }

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  static async getUserNotifications(userId: string, limit = 50) {
    try {
      return await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  static async markAsRead(notificationId: string) {
    try {
      return await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true },
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  static async markAllAsRead(userId: string) {
    try {
      return await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  static async deleteNotification(notificationId: string) {
    try {
      return await prisma.notification.delete({
        where: { id: notificationId },
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  static async getUnreadCount(userId: string) {
    try {
      return await prisma.notification.count({
        where: { userId, read: false },
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  static async sendBulkNotification(userIds: string[], data: Omit<NotificationData, 'userId'>) {
    try {
      const notifications = await Promise.all(
        userIds.map(userId => 
          this.createNotification({ ...data, userId })
        )
      );
      return notifications;
    } catch (error) {
      console.error('Error sending bulk notification:', error);
      throw error;
    }
  }

  static async createTemplate(template: Omit<NotificationTemplate, 'id'>) {
    try {
      // مدل notificationTemplate در schema وجود ندارد
      return null as any
    } catch (error) {
      console.error('Error creating notification template:', error);
      throw error;
    }
  }

  static async getTemplates() {
    try {
      // مدل notificationTemplate در schema وجود ندارد
      return [] as any
    } catch (error) {
      console.error('Error fetching notification templates:', error);
      throw error;
    }
  }

  static async sendFromTemplate(templateId: string, userId: string, variables: Record<string, string>) {
    try {
      // مدل notificationTemplate در schema وجود ندارد
      const template = null as any

      if (!template) {
        throw new Error('Template not found');
      }

      let subject = template.subject;
      let body = template.body;

      // Replace variables in template
      const templateVariables = typeof template.variables === 'string' 
        ? JSON.parse(template.variables) 
        : template.variables;
      
      templateVariables.forEach((variable: string) => {
        const value = variables[variable] || '';
        subject = subject.replace(`{{${variable}}}`, value);
        body = body.replace(`{{${variable}}}`, value);
      });

      return await this.createNotification({
        userId,
        title: subject,
        message: body,
        type: 'info',
        email: true,
      });
    } catch (error) {
      console.error('Error sending notification from template:', error);
      throw error;
    }
  }
}

export const sendAdminNotification = async (data: NotificationData) => {
  return await NotificationService.createNotification(data);
};

