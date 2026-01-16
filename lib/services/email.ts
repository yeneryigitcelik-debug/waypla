import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender configuration
const FROM_EMAIL = process.env.EMAIL_FROM || 'Waypla <noreply@waypla.com>';

export interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export interface WelcomeEmailData {
    userName: string;
    email: string;
}

export interface PolicyCreatedEmailData {
    userName: string;
    email: string;
    policyId: string;
    deviceBrand: string;
    deviceModel: string;
    planName: string;
    premium: number;
    startDate: Date;
    endDate: Date;
}

export interface PasswordResetEmailData {
    userName: string;
    email: string;
    resetUrl: string;
}

/**
 * Send a generic email using Resend
 */
export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
    if (!process.env.RESEND_API_KEY) {
        console.warn('[Email Service] RESEND_API_KEY not configured, skipping email');
        return { success: false, error: 'Email service not configured' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
        });

        if (error) {
            console.error('[Email Service] Send failed:', error);
            return { success: false, error: error.message };
        }

        console.info('[Email Service] Email sent:', data?.id);
        return { success: true, id: data?.id };
    } catch (err) {
        console.error('[Email Service] Unexpected error:', err);
        return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<{ success: boolean; error?: string }> {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #111418; margin: 0; padding: 0; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #0a3d62 0%, #1e5f8a 100%); padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">Waypla'ya Hoş Geldiniz! 🎉</h1>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="font-size: 18px; margin-bottom: 24px;">Merhaba <strong>${data.userName || 'Değerli Müşterimiz'}</strong>,</p>
          <p style="margin-bottom: 16px;">Waypla ailesine katıldığınız için teşekkür ederiz! Artık elektronik cihazlarınızı en kapsamlı koruma planlarıyla güvence altına alabilirsiniz.</p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #f97316;">
            <p style="margin: 0; font-weight: 600;">Hemen başlayın:</p>
            <ul style="margin: 12px 0 0 0; padding-left: 20px;">
              <li>Cihazlarınızı ekleyin</li>
              <li>Size uygun koruma planını seçin</li>
              <li>7/24 destek hizmetimizden faydalanın</li>
            </ul>
          </div>
          <a href="https://waypla.com/teklif" style="display: inline-block; background: #f97316; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">Teklif Al</a>
          <p style="margin-top: 32px; color: #64748b; font-size: 14px;">Herhangi bir sorunuz varsa destek@waypla.com adresinden bize ulaşabilirsiniz.</p>
        </div>
        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 24px;">© ${new Date().getFullYear()} Waypla. Tüm hakları saklıdır.</p>
      </div>
    </body>
    </html>
  `;

    return sendEmail({
        to: data.email,
        subject: 'Waypla\'ya Hoş Geldiniz! 🎉',
        html,
        text: `Merhaba ${data.userName || 'Değerli Müşterimiz'}, Waypla ailesine hoş geldiniz! Hemen teklif almak için waypla.com/teklif adresini ziyaret edin.`,
    });
}

/**
 * Send policy created confirmation email
 */
export async function sendPolicyCreatedEmail(data: PolicyCreatedEmailData): Promise<{ success: boolean; error?: string }> {
    const formatDate = (date: Date) => new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long' }).format(date);
    const formatCurrency = (amount: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #111418; margin: 0; padding: 0; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #0a3d62 0%, #1e5f8a 100%); padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">Poliçeniz Oluşturuldu! ✅</h1>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="font-size: 18px; margin-bottom: 24px;">Merhaba <strong>${data.userName}</strong>,</p>
          <p style="margin-bottom: 24px;">Koruma planınız başarıyla oluşturuldu. Cihazınız artık güvence altında!</p>
          
          <div style="background: #f8fafc; padding: 24px; border-radius: 12px; margin: 24px 0;">
            <h3 style="margin: 0 0 16px 0; color: #0a3d62;">Poliçe Detayları</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Poliçe No:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.policyId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Cihaz:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.deviceBrand} ${data.deviceModel}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Plan:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.planName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Prim:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #f97316;">${formatCurrency(data.premium)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Başlangıç:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600;">${formatDate(data.startDate)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Bitiş:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600;">${formatDate(data.endDate)}</td>
              </tr>
            </table>
          </div>

          <a href="https://waypla.com/hesabim/policeler" style="display: inline-block; background: #f97316; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">Poliçemi Görüntüle</a>
          
          <p style="margin-top: 32px; color: #64748b; font-size: 14px;">Hasar durumunda hesabınızdan hasar bildirimi yapabilirsiniz.</p>
        </div>
        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 24px;">© ${new Date().getFullYear()} Waypla. Tüm hakları saklıdır.</p>
      </div>
    </body>
    </html>
  `;

    return sendEmail({
        to: data.email,
        subject: `Poliçeniz Oluşturuldu - ${data.deviceBrand} ${data.deviceModel}`,
        html,
        text: `Merhaba ${data.userName}, ${data.deviceBrand} ${data.deviceModel} cihazınız için ${data.planName} poliçeniz oluşturuldu. Poliçe No: ${data.policyId}`,
    });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(data: PasswordResetEmailData): Promise<{ success: boolean; error?: string }> {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #111418; margin: 0; padding: 0; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #0a3d62 0%, #1e5f8a 100%); padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">Şifre Sıfırlama</h1>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="font-size: 18px; margin-bottom: 24px;">Merhaba <strong>${data.userName || 'Değerli Müşterimiz'}</strong>,</p>
          <p style="margin-bottom: 24px;">Şifrenizi sıfırlamak için aşağıdaki butona tıklayın. Bu link 1 saat geçerlidir.</p>
          
          <a href="${data.resetUrl}" style="display: inline-block; background: #f97316; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">Şifremi Sıfırla</a>
          
          <p style="margin-top: 24px; color: #64748b; font-size: 14px;">Bu isteği siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
          <p style="margin-top: 16px; color: #94a3b8; font-size: 12px; word-break: break-all;">Link çalışmıyorsa bu URL'yi tarayıcınıza yapıştırın: ${data.resetUrl}</p>
        </div>
        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 24px;">© ${new Date().getFullYear()} Waypla. Tüm hakları saklıdır.</p>
      </div>
    </body>
    </html>
  `;

    return sendEmail({
        to: data.email,
        subject: 'Şifre Sıfırlama Talebi - Waypla',
        html,
        text: `Merhaba ${data.userName || 'Değerli Müşterimiz'}, şifrenizi sıfırlamak için şu linke tıklayın: ${data.resetUrl}. Bu link 1 saat geçerlidir.`,
    });
}
