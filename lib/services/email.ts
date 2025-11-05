import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions) {
    try {
      const result = await this.transporter.sendMail({
        from: options.from || process.env.SMTP_FROM || 'Testology <noreply@testology.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(to: string, name: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">خوش آمدید به تستولوژی!</h1>
        <p>سلام ${name}،</p>
        <p>به پلتفرم تستولوژی خوش آمدید! ما خوشحالیم که شما را در جمع کاربرانمان داریم.</p>
        <p>با تستولوژی می‌توانید:</p>
        <ul>
          <li>تست‌های روانشناختی مختلف انجام دهید</li>
          <li>نتایج خود را با تحلیل هوش مصنوعی دریافت کنید</li>
          <li>پیشرفت خود را دنبال کنید</li>
        </ul>
        <div style="margin: 20px 0;">
          <a href="${process.env.NEXTAUTH_URL}/dashboard" 
             style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            شروع کنید
          </a>
        </div>
        <p>موفق باشید!</p>
        <p>تیم تستولوژی</p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'خوش آمدید به تستولوژی!',
      html,
    });
  }

  async sendTestResultEmail(to: string, testName: string, result: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">نتایج تست ${testName}</h1>
        <p>نتایج تست شما آماده است:</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          ${result}
        </div>
        <div style="margin: 20px 0;">
          <a href="${process.env.NEXTAUTH_URL}/dashboard" 
             style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            مشاهده جزئیات
          </a>
        </div>
        <p>موفق باشید!</p>
        <p>تیم تستولوژی</p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: `نتایج تست ${testName}`,
      html,
    });
  }
}

export const sendEmail = async (options: EmailOptions) => {
  const emailService = new EmailService();
  return emailService.sendEmail(options);
};