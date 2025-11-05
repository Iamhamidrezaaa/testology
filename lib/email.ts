import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendEmail(
  options: EmailOptions,
  template: string,
  type: string
) {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email Send Error:", error);
    throw new Error("Failed to send email");
  }
}

export async function sendVerificationEmail(email: string, code: string) {
  const subject = "کد تأیید حساب کاربری";
  const html = `
    <div dir="rtl">
      <h2>کد تأیید حساب کاربری</h2>
      <p>کد تأیید شما: <strong>${code}</strong></p>
      <p>این کد برای ۵ دقیقه معتبر است.</p>
    </div>
  `;

  await sendEmail({ to: email, subject, html }, "verification", "verification");
}

export async function sendPasswordResetEmail(email: string, code: string) {
  const subject = "بازنشانی رمز عبور";
  const html = `
    <div dir="rtl">
      <h2>بازنشانی رمز عبور</h2>
      <p>کد بازنشانی رمز عبور شما: <strong>${code}</strong></p>
      <p>این کد برای ۵ دقیقه معتبر است.</p>
    </div>
  `;

  await sendEmail({ to: email, subject, html }, "password-reset", "password-reset");
}

export async function sendWelcomeEmail(email: string, name: string) {
  const subject = "خوش‌آمدگویی به تستولوژی";
  const html = `
    <div dir="rtl">
      <h2>سلام ${name} عزیز!</h2>
      <p>به تستولوژی خوش آمدید.</p>
      <p>ما خوشحالیم که شما را در جمع کاربران خود داریم.</p>
    </div>
  `;

  await sendEmail({ to: email, subject, html }, "welcome", "welcome");
} 