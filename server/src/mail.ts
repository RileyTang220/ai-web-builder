import nodemailer from 'nodemailer';

// 简单的 Mailtrap 或其他 SMTP 配置
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(to: string, token: string): Promise<void> {
  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/verify?token=${encodeURIComponent(token)}`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'no-reply@example.com',
      to,
      subject: 'Verify your email address',
      html: `
        <h2>Welcome to AI Web Builder!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verifyUrl}" style="background: #0284c7; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
          Verify Email
        </a>
        <p>Or copy this link: <code>${verifyUrl}</code></p>
        <p>This link expires in 24 hours.</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Email sending failed');
  }
}