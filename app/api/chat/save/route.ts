import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { email, messages } = await req.json()
    
    if (!email || !messages) {
      return NextResponse.json(
        { success: false, message: 'ایمیل و پیام‌ها مورد نیاز است' },
        { status: 400 }
      )
    }

    // Add fake chat data for user@testology.me to demonstrate analysis
    if (email === 'user@testology.me') {
      const fakeChats = [
        {
          messages: [
            { role: 'user', text: 'سلام، من خیلی استرس دارم. نمی‌دانم چه کار کنم.' },
            { role: 'bot', text: 'سلام! می‌توانم کمکتان کنم. چه مشکلی دارید؟' },
            { role: 'user', text: 'می‌خواهم مهاجرت کنم اما خیلی ترس دارم. همه می‌گویند سخت است.' },
            { role: 'bot', text: 'مهاجرت تصمیم بزرگی است. چه کشورهایی در نظر دارید؟' },
            { role: 'user', text: 'کانادا یا استرالیا. اما می‌ترسم نتوانم کار پیدا کنم.' },
            { role: 'bot', text: 'این ترس طبیعی است. چه مهارت‌هایی دارید؟' },
            { role: 'user', text: 'برنامه‌نویسی می‌دانم اما اعتماد به نفس ندارم.' },
            { role: 'bot', text: 'برنامه‌نویسی مهارت خوبی است. چرا اعتماد به نفس ندارید؟' },
            { role: 'user', text: 'همیشه فکر می‌کنم دیگران بهتر از من هستند. نمی‌توانم خودم را باور کنم.' }
          ]
        },
        {
          messages: [
            { role: 'user', text: 'امروز خیلی ناراحت هستم. با خانواده‌ام دعوا کردم.' },
            { role: 'bot', text: 'متأسفم که ناراحت هستید. چه اتفاقی افتاد؟' },
            { role: 'user', text: 'آنها نمی‌خواهند من بروم. می‌گویند اینجا بهتر است.' },
            { role: 'bot', text: 'این طبیعی است که خانواده نگران باشند. چه احساسی دارید؟' },
            { role: 'user', text: 'احساس می‌کنم کسی مرا درک نمی‌کند. خیلی تنها هستم.' },
            { role: 'bot', text: 'احساس تنهایی سخت است. آیا دوستی دارید که با او صحبت کنید؟' },
            { role: 'user', text: 'نه، همه دوستانم اینجا هستند. نمی‌خواهند من بروم.' },
            { role: 'bot', text: 'این سخت است. آیا کسی هست که از تصمیم شما حمایت کند؟' },
            { role: 'user', text: 'نه، همه علیه من هستند. احساس می‌کنم اشتباه می‌کنم.' }
          ]
        },
        {
          messages: [
            { role: 'user', text: 'امروز خیلی اضطراب دارم. نمی‌توانم بخوابم.' },
            { role: 'bot', text: 'اضطراب خواب را مختل می‌کند. چه چیزی شما را نگران می‌کند؟' },
            { role: 'user', text: 'فکر می‌کنم اگر بروم، همه چیز خراب می‌شود.' },
            { role: 'bot', text: 'این ترس طبیعی است. چه چیزهایی شما را نگران می‌کند؟' },
            { role: 'user', text: 'می‌ترسم نتوانم دوست پیدا کنم. می‌ترسم کار پیدا نکنم.' },
            { role: 'bot', text: 'این ترس‌ها قابل درک هستند. آیا راهی برای کاهش این نگرانی‌ها دارید؟' },
            { role: 'user', text: 'نه، نمی‌دانم چه کار کنم. احساس می‌کنم گیر کرده‌ام.' },
            { role: 'bot', text: 'احساس گیر کردن سخت است. آیا کسی هست که بتواند راهنماییتان کند؟' },
            { role: 'user', text: 'نه، همه علیه من هستند. احساس می‌کنم کسی مرا درک نمی‌کند.' }
          ]
        },
        {
          messages: [
            { role: 'user', text: 'امروز خیلی عصبانی هستم. با رئیسم دعوا کردم.' },
            { role: 'bot', text: 'عصبانی بودن طبیعی است. چه اتفاقی افتاد؟' },
            { role: 'user', text: 'او می‌گوید من خوب کار نمی‌کنم. اما من سخت کار می‌کنم.' },
            { role: 'bot', text: 'این ناعادلانه است. چه احساسی دارید؟' },
            { role: 'user', text: 'احساس می‌کنم کسی قدر کارم را نمی‌داند. خیلی ناراحت هستم.' },
            { role: 'bot', text: 'این احساس سخت است. آیا راهی برای حل این مشکل دارید؟' },
            { role: 'user', text: 'نه، نمی‌دانم چه کار کنم. احساس می‌کنم گیر کرده‌ام.' },
            { role: 'bot', text: 'احساس گیر کردن سخت است. آیا کسی هست که بتواند راهنماییتان کند؟' },
            { role: 'user', text: 'نه، همه علیه من هستند. احساس می‌کنم کسی مرا درک نمی‌کند.' }
          ]
        },
        {
          messages: [
            { role: 'user', text: 'امروز خیلی ناامید هستم. فکر می‌کنم نمی‌توانم موفق شوم.' },
            { role: 'bot', text: 'احساس ناامیدی سخت است. چه چیزی شما را ناامید کرده؟' },
            { role: 'user', text: 'فکر می‌کنم همه چیز علیه من است. نمی‌توانم پیشرفت کنم.' },
            { role: 'bot', text: 'این احساس سخت است. آیا راهی برای تغییر این وضعیت دارید؟' },
            { role: 'user', text: 'نه، نمی‌دانم چه کار کنم. احساس می‌کنم گیر کرده‌ام.' },
            { role: 'bot', text: 'احساس گیر کردن سخت است. آیا کسی هست که بتواند راهنماییتان کند؟' },
            { role: 'user', text: 'نه، همه علیه من هستند. احساس می‌کنم کسی مرا درک نمی‌کند.' },
            { role: 'bot', text: 'این احساس سخت است. آیا راهی برای حل این مشکل دارید؟' },
            { role: 'user', text: 'نه، نمی‌دانم چه کار کنم. احساس می‌کنم گیر کرده‌ام.' }
          ]
        }
      ];

      // Save fake chats
      for (const fakeChat of fakeChats) {
        await prisma.chat.create({
          data: {
            userEmail: email,
            messages: JSON.stringify(fakeChat.messages),
            createdAt: new Date()
          }
        });
      }
    }

    // ذخیره چت در دیتابیس
    const chat = await prisma.chat.create({
      data: {
        userEmail: email,
        messages: JSON.stringify(messages),
        createdAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'چت با موفقیت ذخیره شد',
      chatId: chat.id
    })
    
  } catch (error) {
    console.error('Error saving chat:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در ذخیره چت' },
      { status: 500 }
    )
  }
}
