#!/usr/bin/env node

/**
 * اسکریپت بهینه‌سازی خودکار Testology
 * این اسکریپت مدل را به صورت خودکار بهینه‌سازی می‌کند
 */

const https = require('https');
const http = require('http');

// تنظیمات
const CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  timeout: 600000, // 10 دقیقه (بهینه‌سازی زمان‌بر است)
  retries: 2
};

/**
 * ارسال درخواست HTTP
 */
async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    const requestOptions = {
      timeout: CONFIG.timeout,
      ...options
    };
    
    const req = client.request(url, requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

/**
 * اجرای بهینه‌سازی با retry
 */
async function optimizeWithRetry() {
  const url = `${CONFIG.baseUrl}/api/ml/optimize`;
  
  for (let attempt = 1; attempt <= CONFIG.retries; attempt++) {
    try {
      console.log(`⚙️ تلاش ${attempt}/${CONFIG.retries} برای بهینه‌سازی مدل...`);
      
      const response = await makeRequest(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Testology-Auto-Optimize/1.0'
        }
      });
      
      if (response.status === 200 && response.data.success) {
        console.log('✅ بهینه‌سازی موفق!');
        console.log(`📊 دقت: ${response.data.data.accuracy}`);
        console.log(`🔧 روش: ${response.data.data.method}`);
        console.log(`⚙️ پارامترها: ${JSON.stringify(response.data.data.best_params)}`);
        return true;
      } else {
        throw new Error(`HTTP ${response.status}: ${JSON.stringify(response.data)}`);
      }
    } catch (error) {
      console.error(`❌ خطا در تلاش ${attempt}:`, error.message);
      
      if (attempt === CONFIG.retries) {
        console.error('💥 تمام تلاش‌ها ناموفق بود');
        return false;
      }
      
      // انتظار قبل از تلاش بعدی
      const delay = Math.pow(2, attempt) * 2000; // Exponential backoff
      console.log(`⏳ انتظار ${delay}ms قبل از تلاش بعدی...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return false;
}

/**
 * بررسی وضعیت سیستم
 */
async function checkSystemHealth() {
  try {
    console.log('🔍 بررسی وضعیت سیستم...');
    
    const response = await makeRequest(`${CONFIG.baseUrl}/api/ml/optimize`, {
      method: 'GET'
    });
    
    if (response.status === 200) {
      console.log('✅ سیستم در دسترس است');
      if (response.data.lastOptimization) {
        console.log(`📅 آخرین بهینه‌سازی: ${response.data.lastOptimization.timestamp}`);
        console.log(`📊 دقت آخرین بهینه‌سازی: ${response.data.lastOptimization.accuracy}`);
      }
      return true;
    } else {
      console.error('❌ سیستم در دسترس نیست');
      return false;
    }
  } catch (error) {
    console.error('❌ خطا در بررسی وضعیت:', error.message);
    return false;
  }
}

/**
 * تابع اصلی
 */
async function main() {
  const startTime = new Date();
  console.log('⚙️ شروع بهینه‌سازی خودکار Testology');
  console.log('=' * 50);
  console.log(`🕒 زمان شروع: ${startTime.toISOString()}`);
  console.log(`🌐 URL: ${CONFIG.baseUrl}`);
  
  try {
    // بررسی وضعیت سیستم
    const isHealthy = await checkSystemHealth();
    if (!isHealthy) {
      console.error('💥 سیستم در دسترس نیست. بهینه‌سازی لغو شد.');
      process.exit(1);
    }
    
    // اجرای بهینه‌سازی
    const success = await optimizeWithRetry();
    
    const endTime = new Date();
    const duration = endTime - startTime;
    
    if (success) {
      console.log('🎉 بهینه‌سازی خودکار با موفقیت تکمیل شد!');
      console.log(`⏱️ مدت زمان: ${Math.round(duration / 1000)} ثانیه`);
      process.exit(0);
    } else {
      console.error('💥 بهینه‌سازی خودکار ناموفق بود');
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 خطای غیرمنتظره:', error);
    process.exit(1);
  }
}

// اجرای اسکریپت
if (require.main === module) {
  main().catch(error => {
    console.error('💥 خطای فاجعه‌بار:', error);
    process.exit(1);
  });
}

module.exports = { main, optimizeWithRetry, checkSystemHealth };