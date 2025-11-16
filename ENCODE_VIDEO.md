# راهنمای Encode کردن ویدئو با H.264

## مشکل
اگر ویدئو در دسکتاپ نمایش داده نمی‌شود (فقط صدا پخش می‌شود)، احتمالاً مشکل از codec ویدئو است.

## راه‌حل: Encode مجدد با H.264

### نصب FFmpeg

**Windows:**
1. دانلود از: https://ffmpeg.org/download.html
2. یا با Chocolatey: `choco install ffmpeg`
3. یا با Scoop: `scoop install ffmpeg`

**Linux/Mac:**
```bash
# Ubuntu/Debian
sudo apt install ffmpeg

# Mac
brew install ffmpeg
```

### دستور Encode

```bash
ffmpeg -i input.mp4 \
  -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p \
  -c:a aac -b:a 192k \
  -movflags +faststart \
  output.mp4
```

### توضیح گزینه‌ها

- `-c:v libx264` → تبدیل ویدئو به H.264 (سازگار با همه مرورگرها)
- `-profile:v high -level 4.1` → پروفایل و سطح H.264 برای سازگاری بهتر
- `-pix_fmt yuv420p` → فرمت پیکسلی سازگار با اکثر پلیرها
- `-movflags +faststart` → بهتر شدن استریم روی وب (فایل را برای streaming بهینه می‌کند)
- `-c:a aac -b:a 192k` → صدا با AAC که همه مرورگرها ساپورتش می‌کنند

### مثال کامل

```bash
# اگر فایل شما introduction.mp4 است:
ffmpeg -i introduction.mp4 \
  -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p \
  -c:a aac -b:a 192k \
  -movflags +faststart \
  introduction_h264.mp4
```

### گزینه‌های اضافی (اختیاری)

**برای کاهش حجم فایل:**
```bash
ffmpeg -i input.mp4 \
  -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p \
  -crf 23 \
  -c:a aac -b:a 192k \
  -movflags +faststart \
  output.mp4
```

- `-crf 23` → کیفیت (18-28: 18 بهترین کیفیت، 28 کمترین حجم)

**برای حفظ کیفیت اصلی:**
```bash
ffmpeg -i input.mp4 \
  -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p \
  -preset slow \
  -c:a aac -b:a 192k \
  -movflags +faststart \
  output.mp4
```

- `-preset slow` → کیفیت بهتر (slow, medium, fast, ultrafast)

### بررسی codec فعلی ویدئو

برای بررسی codec فعلی ویدئو:
```bash
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,codec_type input.mp4
```

### بعد از Encode

1. فایل جدید را در `public/videos/` قرار دهید
2. نام فایل را به `introduction.mp4` یا `introduction1.mp4` تغییر دهید
3. فایل قدیمی را backup کنید
4. تغییرات را commit و push کنید
5. روی سرور deploy کنید

### نکات مهم

- همیشه از فایل اصلی backup بگیرید
- `-movflags +faststart` مهم است برای streaming روی وب
- `-pix_fmt yuv420p` ضروری است برای سازگاری با مرورگرها
- بعد از encode، فایل را در مرورگرهای مختلف تست کنید

