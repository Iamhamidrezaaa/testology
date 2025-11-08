// Performance monitoring and optimization
export const performanceConfig = {
  // Lazy load threshold
  lazyLoadThreshold: 100,
  
  // Image optimization
  imageQuality: 80,
  imageFormats: ['webp', 'avif'],
  
  // Bundle optimization
  chunkSizeLimit: 250000, // 250KB
  maxChunks: 10,
  
  // Cache settings
  cacheTTL: 3600, // 1 hour
  maxCacheSize: 50 * 1024 * 1024, // 50MB
};

// Performance metrics
export const trackPerformance = (name: string, startTime: number) => {
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`);
  }
  
  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'timing_complete', {
        name,
        value: Math.round(duration)
      });
    }
  }
};

// Resource hints
export const addResourceHints = () => {
  if (typeof window === 'undefined') return;
  
  // Preconnect to external domains
  const domains = [
    'https://api.openai.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  
  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Critical resource loading
export const loadCriticalResources = async () => {
  const startTime = performance.now();
  
  try {
    // Load critical CSS
    // await import('@/app/globals.css');
    
    // Load critical fonts
    await loadFont('Vazir', '/fonts/vazir.woff2');
    
    trackPerformance('Critical Resources', startTime);
  } catch (error) {
    console.error('Failed to load critical resources:', error);
  }
};

// Font loading utility
const loadFont = (fontFamily: string, fontUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const font = new FontFace(fontFamily, `url(${fontUrl})`);
    
    font.load().then(() => {
      document.fonts.add(font);
      resolve();
    }).catch(reject);
  });
};

// Image optimization
export const optimizeImage = (src: string, width?: number, height?: number) => {
  const params = new URLSearchParams();
  
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('q', performanceConfig.imageQuality.toString());
  params.set('f', 'webp');
  
  return `${src}?${params.toString()}`;
};

// Bundle analysis
export const analyzeBundle = () => {
  if (process.env.NODE_ENV === 'development') {
    const scripts = document.querySelectorAll('script[src]');
    const styles = document.querySelectorAll('link[rel="stylesheet"]');
    
    console.log(`📦 Scripts: ${scripts.length}`);
    console.log(`🎨 Styles: ${styles.length}`);
    
    // Log large resources
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && src.includes('_next/static')) {
        console.log(`📄 Script: ${src}`);
      }
    });
  }
};

