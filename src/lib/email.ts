import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export const sendOrderConfirmationEmail = async (
  customerEmail: string,
  orderData: {
    orderNumber: string
    customerName: string
    eggQuantity: number
    deliveryDate: string
    address: string
  }
) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { border-bottom: 2px solid #8B7355; padding-bottom: 20px; }
          .content { margin: 20px 0; }
          .order-details { background: #f5f5f5; padding: 15px; border-radius: 5px; }
          .footer { border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🐓 Rolnik Leszek</h1>
            <p>Potwierdzenie zamówienia</p>
          </div>
          
          <div class="content">
            <p>Cześć ${orderData.customerName},</p>
            <p>Dziękujemy za Twoje zamówienie! Poniżej znajdziesz szczegóły:</p>
            
            <div class="order-details">
              <p><strong>Numer zamówienia:</strong> ${orderData.orderNumber}</p>
              <p><strong>Liczba jajek:</strong> ${orderData.eggQuantity} szt.</p>
              <p><strong>Data dostawy:</strong> ${orderData.deliveryDate}</p>
              <p><strong>Adres dostawy:</strong> ${orderData.address}</p>
            </div>
            
            <p>Wkrótce skontaktujemy się z Tobą w celu potwierdzenia dostawy.</p>
            
            <p>
              W razie pytań, napisz do nas na <strong>tkachmaksim2007@gmail.com</strong> 
              lub zadzwoń <strong>607 80 80 89</strong>
            </p>
          </div>
          
          <div class="footer">
            <p>Rolnik Leszek | Krzydlina Wielka</p>
            <p>Naturalne jedzenie prosto z gospodarstwa</p>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: `"Rolnik Leszek" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `Potwierdzenie zamówienia #${orderData.orderNumber}`,
      html,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

export const sendAdminNotificationEmail = async (
  orderData: {
    orderNumber: string
    customerName: string
    phone: string
    eggQuantity: number
    deliveryDate: string
    address: string
    notes?: string
  }
) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .order-details { background: #f5f5f5; padding: 15px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>📋 Nowe zamówienie</h2>
          
          <div class="order-details">
            <p><strong>Numer zamówienia:</strong> ${orderData.orderNumber}</p>
            <p><strong>Klient:</strong> ${orderData.customerName}</p>
            <p><strong>Telefon:</strong> ${orderData.phone}</p>
            <p><strong>Liczba jajek:</strong> ${orderData.eggQuantity} szt.</p>
            <p><strong>Data dostawy:</strong> ${orderData.deliveryDate}</p>
            <p><strong>Adres:</strong> ${orderData.address}</p>
            ${orderData.notes ? `<p><strong>Uwagi:</strong> ${orderData.notes}</p>` : ''}
          </div>
        </div>
      </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: `"Rolnik Leszek" <${process.env.SMTP_USER}>`,
      to: process.env.NEXT_PUBLIC_ADMIN_EMAIL!,
      subject: `[NOWE ZAMÓWIENIE] #${orderData.orderNumber}`,
      html,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending admin email:', error)
    return { success: false, error }
  }
}
