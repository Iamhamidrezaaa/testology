// سیستم نوتیفیکیشن real-time
export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

class NotificationManager {
  private notifications = new Map<string, Notification>();
  private subscribers = new Map<string, Set<(notification: Notification) => void>>();

  // ایجاد نوتیفیکیشن جدید
  create(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>): Notification {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      read: false,
      createdAt: new Date()
    };

    this.notifications.set(id, newNotification);
    
    // اطلاع‌رسانی به subscribers
    this.notifySubscribers(newNotification);
    
    // حذف خودکار پس از انقضا
    if (notification.expiresAt) {
      const ttl = notification.expiresAt.getTime() - Date.now();
      if (ttl > 0) {
        setTimeout(() => {
          this.delete(id);
        }, ttl);
      }
    }

    return newNotification;
  }

  // دریافت نوتیفیکیشن‌های کاربر
  getUserNotifications(userId: string): Notification[] {
    return Array.from(this.notifications.values())
      .filter(notif => notif.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // علامت‌گذاری به عنوان خوانده شده
  markAsRead(id: string, userId: string): boolean {
    const notification = this.notifications.get(id);
    if (notification && notification.userId === userId) {
      notification.read = true;
      this.notifySubscribers(notification);
      return true;
    }
    return false;
  }

  // حذف نوتیفیکیشن
  delete(id: string): boolean {
    const notification = this.notifications.get(id);
    if (notification) {
      this.notifications.delete(id);
      this.notifySubscribers(notification, 'delete');
      return true;
    }
    return false;
  }

  // اشتراک در نوتیفیکیشن‌های کاربر
  subscribe(userId: string, callback: (notification: Notification) => void): () => void {
    if (!this.subscribers.has(userId)) {
      this.subscribers.set(userId, new Set());
    }
    
    this.subscribers.get(userId)!.add(callback);
    
    // تابع لغو اشتراک
    return () => {
      const userSubscribers = this.subscribers.get(userId);
      if (userSubscribers) {
        userSubscribers.delete(callback);
        if (userSubscribers.size === 0) {
          this.subscribers.delete(userId);
        }
      }
    };
  }

  // اطلاع‌رسانی به subscribers
  private notifySubscribers(notification: Notification, action: 'create' | 'update' | 'delete' = 'create') {
    const userSubscribers = this.subscribers.get(notification.userId);
    if (userSubscribers) {
      userSubscribers.forEach(callback => {
        try {
          callback({ ...notification, action });
        } catch (error) {
          console.error('Error in notification callback:', error);
        }
      });
    }
  }

  // آمار نوتیفیکیشن‌ها
  getStats() {
    const total = this.notifications.size;
    const unread = Array.from(this.notifications.values())
      .filter(notif => !notif.read).length;
    
    return { total, unread };
  }
}

// نمونه سراسری
export const notificationManager = new NotificationManager();

// توابع کمکی
export function createNotification(
  userId: string,
  type: Notification['type'],
  title: string,
  message: string,
  data?: any,
  expiresIn?: number
): Notification {
  const expiresAt = expiresIn ? new Date(Date.now() + expiresIn) : undefined;
  
  return notificationManager.create({
    userId,
    type,
    title,
    message,
    data,
    expiresAt
  });
}

// انواع نوتیفیکیشن‌های پیش‌فرض
export const NotificationTemplates = {
  // تست جدید
  newTest: (userId: string, testName: string) => createNotification(
    userId,
    'info',
    'تست جدید',
    `تست "${testName}" برای شما در دسترس است`,
    { testName },
    24 * 60 * 60 * 1000 // 24 ساعت
  ),

  // تکمیل تست
  testCompleted: (userId: string, testName: string) => createNotification(
    userId,
    'success',
    'تست تکمیل شد',
    `تست "${testName}" با موفقیت تکمیل شد`,
    { testName }
  ),

  // گزارش آماده
  reportReady: (userId: string) => createNotification(
    userId,
    'success',
    'گزارش آماده',
    'گزارش روانشناختی شما آماده است',
    { type: 'report' }
  ),

  // یادآوری تمرین
  exerciseReminder: (userId: string, exerciseName: string) => createNotification(
    userId,
    'info',
    'یادآوری تمرین',
    `زمان انجام تمرین "${exerciseName}" فرا رسیده است`,
    { exerciseName },
    2 * 60 * 60 * 1000 // 2 ساعت
  ),

  // هشدار خلق
  moodAlert: (userId: string, mood: string) => createNotification(
    userId,
    'warning',
    'توجه به خلق',
    `خلق شما "${mood}" گزارش شده است. مراقب خود باشید.`,
    { mood }
  )
};