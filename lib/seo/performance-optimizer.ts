// بهینه‌سازی عملکرد برای سئو
export interface PerformanceConfig {
  enableLazyLoading: boolean;
  enableImageOptimization: boolean;
  enableCodeSplitting: boolean;
  enableServiceWorker: boolean;
  enablePreloading: boolean;
  enableCompression: boolean;
}

export const defaultPerformanceConfig: PerformanceConfig = {
  enableLazyLoading: true,
  enableImageOptimization: true,
  enableCodeSplitting: true,
  enableServiceWorker: true,
  enablePreloading: true,
  enableCompression: true
}

export class PerformanceOptimizer {
  private config: PerformanceConfig

  constructor(config: PerformanceConfig = defaultPerformanceConfig) {
    this.config = config
  }

  public generateResourceHints(): string {
    if (!this.config.enablePreloading) return ''

    return `
      <!-- Resource Hints -->
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link rel="dns-prefetch" href="https://www.google-analytics.com">
      <link rel="dns-prefetch" href="https://www.googletagmanager.com">
      <link rel="preload" href="/fonts/vazir.woff2" as="font" type="font/woff2" crossorigin>
      <link rel="preload" href="/images/logo.png" as="image">
    `
  }

  public generateCriticalCSS(): string {
    return `
      <!-- Critical CSS -->
      <style>
        /* Critical above-the-fold styles */
        body {
          font-family: 'Vazir', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f9fafb;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .header {
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 0;
          text-align: center;
        }
        
        .btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: #3b82f6;
          color: white;
          text-decoration: none;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        
        .btn:hover {
          background: #2563eb;
        }
      </style>
    `
  }

  public generateLazyLoadingScript(): string {
    if (!this.config.enableLazyLoading) return ''

    return `
      <!-- Lazy Loading -->
      <script>
        // Intersection Observer for lazy loading
        if ('IntersectionObserver' in window) {
          const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
              }
            });
          });
          
          document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
          });
        }
        
        // Lazy load non-critical CSS
        function loadCSS(href) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = href;
          document.head.appendChild(link);
        }
        
        // Load non-critical CSS after page load
        window.addEventListener('load', () => {
          loadCSS('/styles/non-critical.css');
        });
      </script>
    `
  }

  public generateServiceWorkerScript(): string {
    if (!this.config.enableServiceWorker) return ''

    return `
      <!-- Service Worker -->
      <script>
        if ('serviceWorker' in navigator) {
          window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
              .then(registration => {
                console.log('SW registered: ', registration);
              })
              .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
              });
          });
        }
      </script>
    `
  }

  public generateImageOptimization(): string {
    if (!this.config.enableImageOptimization) return ''

    return `
      <!-- Image Optimization -->
      <script>
        // Responsive images
        function generateResponsiveImages(src, alt, sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw') {
          return \`
            <picture>
              <source media="(max-width: 768px)" srcset="\${src}-mobile.webp" type="image/webp">
              <source media="(max-width: 1200px)" srcset="\${src}-tablet.webp" type="image/webp">
              <source srcset="\${src}-desktop.webp" type="image/webp">
              <img src="\${src}.jpg" alt="\${alt}" loading="lazy" sizes="\${sizes}">
            </picture>
          \`;
        }
        
        // WebP support detection
        function supportsWebP() {
          return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => resolve(webP.height === 2);
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
          });
        }
      </script>
    `
  }

  public generateCodeSplitting(): string {
    if (!this.config.enableCodeSplitting) return ''

    return `
      <!-- Code Splitting -->
      <script>
        // Dynamic imports for non-critical components
        function loadComponent(componentName) {
          return import(\`/components/\${componentName}.js\`)
            .then(module => module.default)
            .catch(error => console.error('Failed to load component:', error));
        }
        
        // Load components on demand
        document.addEventListener('DOMContentLoaded', () => {
          // Load analytics only if needed
          if (document.querySelector('[data-analytics]')) {
            loadComponent('Analytics');
          }
          
          // Load charts only if needed
          if (document.querySelector('[data-chart]')) {
            loadComponent('Chart');
          }
        });
      </script>
    `
  }

  public generateCompressionHeaders(): Record<string, string> {
    if (!this.config.enableCompression) return {}

    return {
      'Content-Encoding': 'gzip',
      'Vary': 'Accept-Encoding',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  }

  public generatePerformanceScript(): string {
    return `
      <!-- Performance Monitoring -->
      <script>
        // Core Web Vitals
        function sendToAnalytics(metric) {
          // Send to Google Analytics
          if (typeof gtag !== 'undefined') {
            gtag('event', metric.name, {
              event_category: 'Web Vitals',
              event_label: metric.id,
              value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
              non_interaction: true,
            });
          }
          
          // Send to custom analytics
          if (typeof analytics !== 'undefined') {
            analytics.track('Web Vitals', {
              metric: metric.name,
              value: metric.value,
              id: metric.id,
              delta: metric.delta
            });
          }
        }
        
        // LCP
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            sendToAnalytics({
              name: 'LCP',
              value: entry.startTime,
              id: entry.id,
              delta: entry.startTime
            });
          }
        }).observe({entryTypes: ['largest-contentful-paint']});
        
        // FID
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            sendToAnalytics({
              name: 'FID',
              value: entry.processingStart - entry.startTime,
              id: entry.id,
              delta: entry.processingStart - entry.startTime
            });
          }
        }).observe({entryTypes: ['first-input']});
        
        // CLS
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              sendToAnalytics({
                name: 'CLS',
                value: clsValue,
                id: entry.id,
                delta: entry.value
              });
            }
          }
        }).observe({entryTypes: ['layout-shift']});
      </script>
    `
  }

  public generateAllOptimizations(): string {
    return [
      this.generateResourceHints(),
      this.generateCriticalCSS(),
      this.generateLazyLoadingScript(),
      this.generateServiceWorkerScript(),
      this.generateImageOptimization(),
      this.generateCodeSplitting(),
      this.generatePerformanceScript()
    ].join('\n')
  }
}

// Singleton instance
let performanceOptimizer: PerformanceOptimizer | null = null

export function initializePerformanceOptimizer(config?: PerformanceConfig): PerformanceOptimizer {
  if (!performanceOptimizer) {
    performanceOptimizer = new PerformanceOptimizer(config)
  }
  return performanceOptimizer
}

export function getPerformanceOptimizer(): PerformanceOptimizer {
  return performanceOptimizer || initializePerformanceOptimizer()
}
















