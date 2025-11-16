@echo off
REM اسکریپت برای encode کردن ویدئو با H.264 (Windows)
REM استفاده: encode-video.bat input.mp4 output.mp4

if "%1"=="" (
    echo استفاده: encode-video.bat input.mp4 output.mp4
    exit /b 1
)

if "%2"=="" (
    echo استفاده: encode-video.bat input.mp4 output.mp4
    exit /b 1
)

set INPUT=%1
set OUTPUT=%2

if not exist "%INPUT%" (
    echo خطا: فایل %INPUT% پیدا نشد!
    exit /b 1
)

echo شروع encode کردن %INPUT% به %OUTPUT%...
echo این کار ممکن است چند دقیقه طول بکشد...

ffmpeg -i "%INPUT%" ^
  -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p ^
  -c:a aac -b:a 192k ^
  -movflags +faststart ^
  "%OUTPUT%"

if %ERRORLEVEL% EQU 0 (
    echo ✅ Encode با موفقیت انجام شد!
    echo فایل جدید: %OUTPUT%
    echo.
    echo حجم فایل‌ها:
    dir "%INPUT%" "%OUTPUT%" | findstr /C:"%INPUT%" /C:"%OUTPUT%"
) else (
    echo ❌ خطا در encode کردن ویدئو!
    exit /b 1
)

