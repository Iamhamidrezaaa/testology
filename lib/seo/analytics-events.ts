// مدیریت رویدادهای analytics
export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export class AnalyticsManager {
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window !== 'undefined') {
      this.isInitialized = true;
    }
  }

  public track(event: AnalyticsEvent) {
    if (!this.isInitialized) return;

    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_parameters: event.custom_parameters
      });
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', event.event, {
        content_category: event.category,
        content_name: event.label,
        value: event.value
      });
    }

    // Custom analytics
    if (typeof analytics !== 'undefined') {
      analytics.track(event.event, {
        category: event.category,
        action: event.action,
        label: event.label,
        value: event.value,
        ...event.custom_parameters
      });
    }

    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event);
    }
  }

  // Test events
  public trackTestStart(testSlug: string) {
    this.track({
      event: 'test_start',
      category: 'test',
      action: 'start',
      label: testSlug,
      custom_parameters: {
        test_slug: testSlug,
        timestamp: Date.now()
      }
    });
  }

  public trackTestComplete(testSlug: string, score: number, duration: number) {
    this.track({
      event: 'test_complete',
      category: 'test',
      action: 'complete',
      label: testSlug,
      value: score,
      custom_parameters: {
        test_slug: testSlug,
        score: score,
        duration: duration,
        timestamp: Date.now()
      }
    });
  }

  public trackTestAbandon(testSlug: string, questionNumber: number) {
    this.track({
      event: 'test_abandon',
      category: 'test',
      action: 'abandon',
      label: testSlug,
      value: questionNumber,
      custom_parameters: {
        test_slug: testSlug,
        question_number: questionNumber,
        timestamp: Date.now()
      }
    });
  }

  // Category events
  public trackCategoryView(categorySlug: string) {
    this.track({
      event: 'category_view',
      category: 'category',
      action: 'view',
      label: categorySlug,
      custom_parameters: {
        category_slug: categorySlug,
        timestamp: Date.now()
      }
    });
  }

  // City events
  public trackCityView(citySlug: string) {
    this.track({
      event: 'city_view',
      category: 'city',
      action: 'view',
      label: citySlug,
      custom_parameters: {
        city_slug: citySlug,
        timestamp: Date.now()
      }
    });
  }

  // Search events
  public trackSearchQuery(query: string, results: number) {
    this.track({
      event: 'search',
      category: 'search',
      action: 'query',
      label: query,
      value: results,
      custom_parameters: {
        search_query: query,
        results_count: results,
        timestamp: Date.now()
      }
    });
  }

  // Page events
  public trackPageView(page: string, title?: string) {
    this.track({
      event: 'page_view',
      category: 'page',
      action: 'view',
      label: page,
      custom_parameters: {
        page_path: page,
        page_title: title,
        timestamp: Date.now()
      }
    });
  }

  // Conversion events
  public trackConversion(conversionType: string, value?: number, currency?: string) {
    this.track({
      event: 'conversion',
      category: 'conversion',
      action: conversionType,
      value: value,
      custom_parameters: {
        conversion_type: conversionType,
        currency: currency || 'IRR',
        timestamp: Date.now()
      }
    });
  }

  // User engagement events
  public trackUserEngagement(action: string, element: string) {
    this.track({
      event: 'user_engagement',
      category: 'engagement',
      action: action,
      label: element,
      custom_parameters: {
        element: element,
        timestamp: Date.now()
      }
    });
  }

  // Error events
  public trackError(errorType: string, errorMessage: string, page: string) {
    this.track({
      event: 'error',
      category: 'error',
      action: errorType,
      label: errorMessage,
      custom_parameters: {
        error_type: errorType,
        error_message: errorMessage,
        page: page,
        timestamp: Date.now()
      }
    });
  }
}

// Singleton instance
let analyticsManager: AnalyticsManager | null = null;

export function initializeAnalytics(): AnalyticsManager {
  if (!analyticsManager) {
    analyticsManager = new AnalyticsManager();
  }
  return analyticsManager;
}

export function getAnalyticsManager(): AnalyticsManager {
  return analyticsManager || initializeAnalytics();
}

// Helper functions
export function trackTestStart(testSlug: string) {
  getAnalyticsManager().trackTestStart(testSlug);
}

export function trackTestComplete(testSlug: string, score: number, duration: number) {
  getAnalyticsManager().trackTestComplete(testSlug, score, duration);
}

export function trackTestAbandon(testSlug: string, questionNumber: number) {
  getAnalyticsManager().trackTestAbandon(testSlug, questionNumber);
}

export function trackCategoryView(categorySlug: string) {
  getAnalyticsManager().trackCategoryView(categorySlug);
}

export function trackCityView(citySlug: string) {
  getAnalyticsManager().trackCityView(citySlug);
}

export function trackSearchQuery(query: string, results: number) {
  getAnalyticsManager().trackSearchQuery(query, results);
}

export function trackPageView(page: string, title?: string) {
  getAnalyticsManager().trackPageView(page, title);
}

export function trackConversion(conversionType: string, value?: number, currency?: string) {
  getAnalyticsManager().trackConversion(conversionType, value, currency);
}

export function trackUserEngagement(action: string, element: string) {
  getAnalyticsManager().trackUserEngagement(action, element);
}

export function trackError(errorType: string, errorMessage: string, page: string) {
  getAnalyticsManager().trackError(errorType, errorMessage, page);
}
















