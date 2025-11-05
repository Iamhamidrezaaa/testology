// مدیریت performance و Core Web Vitals برای سئو
export interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

export function generatePerformanceScript(): string {
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

export function generateResourceHints(): string {
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

export function generateCriticalCSS(): string {
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

export function generateLazyLoadingScript(): string {
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

export function generateServiceWorkerScript(): string {
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

export function generateWebAppManifest(): string {
  return `
    <!-- Web App Manifest -->
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#3b82f6">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="تستولوژی">
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png">
  `
}

export function generatePreloadScripts(): string {
  return `
    <!-- Preload Critical Scripts -->
    <link rel="preload" href="/js/critical.js" as="script">
    <link rel="preload" href="/js/analytics.js" as="script">
    <link rel="preload" href="/js/performance.js" as="script">
  `
}

export function generateImageOptimization(): string {
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
















