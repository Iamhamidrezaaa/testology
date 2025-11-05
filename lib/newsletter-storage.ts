// Shared newsletter storage for demo purposes
// This will be replaced with database in production

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: Date;
  isActive: boolean;
}

// In-memory storage (will be lost on server restart)
let newsletterSubscribers: NewsletterSubscriber[] = [];

export const newsletterStorage = {
  // Add new subscriber
  addSubscriber: (email: string): NewsletterSubscriber => {
    const newSubscriber: NewsletterSubscriber = {
      id: Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      subscribedAt: new Date(),
      isActive: true
    };
    
    newsletterSubscribers.push(newSubscriber);
    console.log(`📧 Newsletter subscription: ${email}`);
    console.log(`📊 Total subscribers: ${newsletterSubscribers.length}`);
    
    return newSubscriber;
  },

  // Check if email exists
  emailExists: (email: string): boolean => {
    return newsletterSubscribers.some(
      sub => sub.email.toLowerCase() === email.toLowerCase()
    );
  },

  // Get all subscribers
  getAllSubscribers: (): NewsletterSubscriber[] => {
    return newsletterSubscribers;
  },

  // Get active subscribers
  getActiveSubscribers: (): NewsletterSubscriber[] => {
    return newsletterSubscribers.filter(sub => sub.isActive);
  },

  // Get recent subscribers
  getRecentSubscribers: (limit: number = 10): NewsletterSubscriber[] => {
    return newsletterSubscribers
      .sort((a, b) => b.subscribedAt.getTime() - a.subscribedAt.getTime())
      .slice(0, limit);
  },

  // Get stats
  getStats: () => {
    const total = newsletterSubscribers.length;
    const active = newsletterSubscribers.filter(sub => sub.isActive).length;
    const inactive = total - active;
    
    return {
      total,
      active,
      inactive,
      activeRate: total > 0 ? Math.round((active / total) * 100) : 0
    };
  },

  // Export to CSV format
  exportToCSV: (): string => {
    const csvHeader = "ایمیل,تاریخ عضویت,وضعیت\n";
    const csvRows = newsletterSubscribers.map(sub => 
      `${sub.email},${sub.subscribedAt.toISOString()},${sub.isActive ? 'فعال' : 'غیرفعال'}`
    ).join('\n');
    
    return csvHeader + csvRows;
  }
};

