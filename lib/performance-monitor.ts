// Performance monitoring for production
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track page load time
  trackPageLoad(pageName: string) {
    if (typeof window === 'undefined') return;

    const startTime = performance.now();
    
    window.addEventListener('load', () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      this.metrics.set(`${pageName}_load_time`, loadTime);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ ${pageName} loaded in ${loadTime.toFixed(2)}ms`);
      }
      
      // Send to analytics
      this.sendToAnalytics('page_load', {
        page: pageName,
        loadTime: Math.round(loadTime)
      });
    });
  }

  // Track component render time
  trackComponentRender(componentName: string, startTime: number) {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    this.metrics.set(`${componentName}_render_time`, renderTime);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎨 ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
    }
  }

  // Track API response time
  trackApiCall(endpoint: string, startTime: number) {
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    this.metrics.set(`${endpoint}_response_time`, responseTime);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🌐 ${endpoint} responded in ${responseTime.toFixed(2)}ms`);
    }
  }

  // Track bundle size
  trackBundleSize() {
    if (typeof window === 'undefined') return;

    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;

    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && src.includes('_next/static')) {
        // Estimate size based on URL
        const size = this.estimateScriptSize(src);
        totalSize += size;
      }
    });

    this.metrics.set('bundle_size', totalSize);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📦 Estimated bundle size: ${(totalSize / 1024).toFixed(2)} KB`);
    }
  }

  // Track Core Web Vitals
  trackCoreWebVitals() {
    if (typeof window === 'undefined') return;

    // First Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.set('fcp', entry.startTime);
          this.sendToAnalytics('fcp', { value: entry.startTime });
        }
      }
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.metrics.set('lcp', entry.startTime);
        this.sendToAnalytics('lcp', { value: entry.startTime });
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      this.metrics.set('cls', clsValue);
      this.sendToAnalytics('cls', { value: clsValue });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // Get performance report
  getPerformanceReport() {
    const report = {
      metrics: Object.fromEntries(this.metrics),
      recommendations: this.getRecommendations()
    };

    return report;
  }

  // Get performance recommendations
  private getRecommendations(): string[] {
    const recommendations: string[] = [];
    
    const fcp = this.metrics.get('fcp') || 0;
    const lcp = this.metrics.get('lcp') || 0;
    const cls = this.metrics.get('cls') || 0;
    
    if (fcp > 1800) {
      recommendations.push('First Contentful Paint is slow (>1.8s). Consider optimizing critical resources.');
    }
    
    if (lcp > 2500) {
      recommendations.push('Largest Contentful Paint is slow (>2.5s). Optimize images and fonts.');
    }
    
    if (cls > 0.1) {
      recommendations.push('Cumulative Layout Shift is high (>0.1). Fix layout shifts.');
    }
    
    return recommendations;
  }

  // Estimate script size
  private estimateScriptSize(src: string): number {
    // Rough estimation based on common patterns
    if (src.includes('framework')) return 50000; // ~50KB
    if (src.includes('main')) return 100000; // ~100KB
    if (src.includes('chunk')) return 30000; // ~30KB
    return 20000; // Default ~20KB
  }

  // Send metrics to analytics
  private sendToAnalytics(event: string, data: any) {
    if (process.env.NODE_ENV === 'production') {
      // Send to your analytics service
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', event, data);
      }
    }
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

