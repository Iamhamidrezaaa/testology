export enum TriggerEvent {
  NEW_USER = 'NEW_USER',
  NEW_TEST_RESULT = 'NEW_TEST_RESULT',
  NEW_CONTACT_MESSAGE = 'NEW_CONTACT_MESSAGE',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  NEW_SUPPORT_TICKET = 'NEW_SUPPORT_TICKET',
  NEW_COMMENT = 'NEW_COMMENT',
  NEW_BLOG_POST = 'NEW_BLOG_POST',
  USER_LEVEL_UP = 'USER_LEVEL_UP',
  REFERRAL_COMPLETED = 'REFERRAL_COMPLETED'
}

export interface NotificationData {
  [TriggerEvent.NEW_USER]: {
    id: string
    name: string
    email: string
    createdAt: string
    phoneNumber?: string
  }
  [TriggerEvent.NEW_TEST_RESULT]: {
    id: string
    userId: string
    testId: string
    score: number
    completedAt: string
    phoneNumber?: string
  }
  [TriggerEvent.NEW_CONTACT_MESSAGE]: {
    id: string
    name: string
    email: string
    message: string
    createdAt: string
  }
  [TriggerEvent.SYSTEM_ERROR]: {
    id: string
    message: string
    stack: string
    timestamp: string
  }
  [TriggerEvent.NEW_SUPPORT_TICKET]: {
    id: string
    userId: string
    subject: string
    message: string
    createdAt: string
    phoneNumber?: string
  }
  [TriggerEvent.NEW_COMMENT]: {
    id: string
    userId: string
    content: string
    createdAt: string
    phoneNumber?: string
  }
  [TriggerEvent.NEW_BLOG_POST]: {
    id: string
    title: string
    content: string
    createdAt: string
  }
  [TriggerEvent.USER_LEVEL_UP]: {
    id: string
    userId: string
    oldLevel: number
    newLevel: number
    updatedAt: string
    phoneNumber?: string
  }
  [TriggerEvent.REFERRAL_COMPLETED]: {
    id: string
    referrerId: string
    referredId: string
    completedAt: string
    phoneNumber?: string
  }
}

export interface NotificationResult {
  success: boolean
  emailSent: boolean
  smsSent: boolean
  error?: string
} 