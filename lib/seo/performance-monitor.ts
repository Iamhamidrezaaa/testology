// مانیتورینگ عملکرد و Core Web Vitals
export interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

export class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // LCP Observer
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        this.sendMetric('LCP', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // FID Observer
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          this.metrics.fid = (entry as any).processingStart - entry.startTime;
          this.sendMetric('FID', (entry as any).processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // CLS Observer
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            this.metrics.cls = clsValue;
            this.sendMetric('CLS', clsValue);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);

      // FCP Observer
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          this.metrics.fcp = entry.startTime;
          this.sendMetric('FCP', entry.startTime);
        });
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(fcpObserver);
    }
  }

  private sendMetric(name: string, value: number) {
    // Send to Google Analytics
    if (typeof (globalThis as any).gtag !== 'undefined') {
      (globalThis as any).gtag('event', name, {
        event_category: 'Web Vitals',
        event_label: name,
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        non_interaction: true,
      });
    }

    // Send to custom analytics
    if (typeof (globalThis as any).analytics !== 'undefined') {
      (globalThis as any).analytics.track('Web Vitals', {
        metric: name,
        value: value,
        timestamp: Date.now()
      });
    }

    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metric - ${name}:`, value);
    }
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  public disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export function initializePerformanceMonitoring(): PerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor();
  }
  return performanceMonitor;
}

export function getPerformanceMetrics(): Partial<PerformanceMetrics> {
  return performanceMonitor?.getMetrics() || {};
}

export function disconnectPerformanceMonitoring(): void {
  if (performanceMonitor) {
    performanceMonitor.disconnect();
    performanceMonitor = null;
  }
}

// Performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  LCP: {
    good: 2500,
    needsImprovement: 4000
  },
  FID: {
    good: 100,
    needsImprovement: 300
  },
  CLS: {
    good: 0.1,
    needsImprovement: 0.25
  },
  FCP: {
    good: 1800,
    needsImprovement: 3000
  },
  TTFB: {
    good: 800,
    needsImprovement: 1800
  }
};

export function getPerformanceScore(metric: keyof PerformanceMetrics, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = PERFORMANCE_THRESHOLDS[metric.toUpperCase() as keyof typeof PERFORMANCE_THRESHOLDS];
  if (!thresholds) return 'good';

  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needsImprovement) return 'needs-improvement';
  return 'poor';
}

export function getOverallPerformanceScore(metrics: Partial<PerformanceMetrics>): 'good' | 'needs-improvement' | 'poor' {
  const scores = Object.entries(metrics).map(([key, value]) => 
    getPerformanceScore(key as keyof PerformanceMetrics, value)
  );

  if (scores.every(score => score === 'good')) return 'good';
  if (scores.some(score => score === 'poor')) return 'poor';
  return 'needs-improvement';
}
















