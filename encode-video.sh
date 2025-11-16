#!/bin/bash

# اسکریپت برای encode کردن ویدئو با H.264
# استفاده: ./encode-video.sh input.mp4 output.mp4

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "استفاده: ./encode-video.sh input.mp4 output.mp4"
    exit 1
fi

INPUT="$1"
OUTPUT="$2"

if [ ! -f "$INPUT" ]; then
    echo "خطا: فایل $INPUT پیدا نشد!"
    exit 1
fi

echo "شروع encode کردن $INPUT به $OUTPUT..."
echo "این کار ممکن است چند دقیقه طول بکشد..."

ffmpeg -i "$INPUT" \
  -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p \
  -c:a aac -b:a 192k \
  -movflags +faststart \
  "$OUTPUT"

if [ $? -eq 0 ]; then
    echo "✅ Encode با موفقیت انجام شد!"
    echo "فایل جدید: $OUTPUT"
    
    # نمایش حجم فایل‌ها
    echo ""
    echo "حجم فایل‌ها:"
    ls -lh "$INPUT" "$OUTPUT" | awk '{print $5, $9}'
else
    echo "❌ خطا در encode کردن ویدئو!"
    exit 1
fi

