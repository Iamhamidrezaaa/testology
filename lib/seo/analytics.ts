// مدیریت analytics و tracking برای سئو
export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
}

export function trackTestStart(testSlug: string): AnalyticsEvent {
  return {
    event: 'test_start',
    category: 'test',
    action: 'start',
    label: testSlug
  }
}

export function trackTestComplete(testSlug: string, score: number): AnalyticsEvent {
  return {
    event: 'test_complete',
    category: 'test',
    action: 'complete',
    label: testSlug,
    value: score
  }
}

export function trackCategoryView(categorySlug: string): AnalyticsEvent {
  return {
    event: 'category_view',
    category: 'category',
    action: 'view',
    label: categorySlug
  }
}

export function trackCityView(citySlug: string): AnalyticsEvent {
  return {
    event: 'city_view',
    category: 'city',
    action: 'view',
    label: citySlug
  }
}

export function trackSearchQuery(query: string): AnalyticsEvent {
  return {
    event: 'search',
    category: 'search',
    action: 'query',
    label: query
  }
}

export function trackPageView(page: string): AnalyticsEvent {
  return {
    event: 'page_view',
    category: 'page',
    action: 'view',
    label: page
  }
}

export function trackConversion(conversionType: string, value?: number): AnalyticsEvent {
  return {
    event: 'conversion',
    category: 'conversion',
    action: conversionType,
    value: value
  }
}

export function generateGoogleAnalyticsScript(gaId: string): string {
  return `
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}', {
        page_title: document.title,
        page_location: window.location.href,
        custom_map: {
          'custom_parameter_1': 'test_slug',
          'custom_parameter_2': 'category_slug',
          'custom_parameter_3': 'city_slug'
        }
      });
    </script>
  `
}

export function generateGoogleTagManagerScript(gtmId: string): string {
  return `
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');</script>
    <!-- End Google Tag Manager -->
  `
}

export function generateGoogleTagManagerNoScript(gtmId: string): string {
  return `
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
  `
}

export function generateFacebookPixelScript(pixelId: string): string {
  return `
    <!-- Facebook Pixel Code -->
    <script>
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"
    /></noscript>
    <!-- End Facebook Pixel Code -->
  `
}

export function generateHotjarScript(hotjarId: string): string {
  return `
    <!-- Hotjar Tracking Code -->
    <script>
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${hotjarId},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    </script>
    <!-- End Hotjar Tracking Code -->
  `
}
















