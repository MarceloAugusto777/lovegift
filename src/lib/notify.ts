import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'marcelin5522@gmail.com'

interface NotifyPublishProps {
  slug: string
  coupleName: string
  templateName?: string
  clientName?: string
}

export async function notifyGiftPublished({ slug, coupleName, templateName, clientName }: NotifyPublishProps) {
  if (!resend) {
    console.warn('[Notify] RESEND_API_KEY não configurado. Email não enviado.')
    return
  }

  const giftUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://lovegift.com'}/gift/${slug}`

  try {
    await resend.emails.send({
      from: 'LoveGift <onboarding@resend.dev>',
      to: OWNER_EMAIL,
      subject: `🎁 Novo presente publicado: ${coupleName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8f9fa; padding: 40px 20px;">
          <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <div style="background: linear-gradient(135deg, #e11d48, #ec4899); padding: 32px; text-align: center;">
              <div style="font-size: 40px; margin-bottom: 8px;">🎁</div>
              <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 600;">Presente Publicado!</h1>
            </div>
            <div style="padding: 32px;">
              <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
                Um novo presente foi publicado e está pronto pra configurar a tag NFC.
              </p>
              <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 4px;">Casal</p>
                <p style="color: #111827; font-size: 18px; font-weight: 600; margin: 0 0 16px;">${coupleName}</p>
                ${clientName ? `<p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 4px;">Cliente</p>
                <p style="color: #111827; font-size: 14px; margin: 0 0 16px;">${clientName}</p>` : ''}
                ${templateName ? `<p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 4px;">Template</p>
                <p style="color: #111827; font-size: 14px; margin: 0;">${templateName}</p>` : ''}
              </div>
              <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 12px; padding: 16px; margin: 20px 0;">
                <p style="color: #92400e; font-size: 13px; margin: 0; line-height: 1.5;">
                  <strong>URL da Tag NFC:</strong><br>
                  <code style="background: #fde68a; padding: 2px 6px; border-radius: 4px; font-size: 13px;">${giftUrl}</code>
                </p>
              </div>
              <a href="${giftUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #e11d48, #ec4899); color: white; text-decoration: none; padding: 12px 32px; border-radius: 10px; font-weight: 600; font-size: 14px; text-align: center; width: 100%; box-sizing: border-box;">
                Ver Presente
              </a>
            </div>
            <div style="padding: 16px 32px; background: #f9fafb; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">LoveGift — Configure a tag NFC e envie o presente</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })
    console.log(`[Notify] Email enviado para ${OWNER_EMAIL} — gift: ${slug}`)
  } catch (error) {
    console.error('[Notify] Erro ao enviar email:', error)
  }
}
