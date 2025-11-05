const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// تولید کلید خصوصی و عمومی
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

// ذخیره کلیدها
const keysDir = path.join(__dirname, '..', 'keys');
if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir, { recursive: true });
}

fs.writeFileSync(path.join(keysDir, 'private.pem'), privateKey);
fs.writeFileSync(path.join(keysDir, 'public.pem'), publicKey);

console.log('✅ کلیدهای رمزنگاری با موفقیت تولید شدند');
console.log('📁 مسیر کلید خصوصی:', path.join(keysDir, 'private.pem'));
console.log('📁 مسیر کلید عمومی:', path.join(keysDir, 'public.pem'));











