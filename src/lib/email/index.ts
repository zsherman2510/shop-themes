const SibApiV3Sdk = require("@getbrevo/brevo");

// Initialize Brevo API instance
const apiKey = process.env.BREVO_API_KEY;
if (!apiKey) {
  console.error("BREVO_API_KEY is not configured");
  throw new Error("Email service is not configured");
}

// Create API instance
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(SibApiV3Sdk.AccountApiApiKeys.apiKey, apiKey);

// Default sender configuration
const DEFAULT_SENDER = {
  email: "zsherman2510@hotmail.com",
  name: "Shop Themes"
};

interface SendEmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
  templateId?: number;
  params?: Record<string, any>;
}

/**
 * Sends an email using Brevo's API
 */
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  replyTo,
  templateId,
  params
}: SendEmailParams): Promise<any> => {
  const sendSmtpEmail = {
    sender: DEFAULT_SENDER,
    to: [{ email: to }],
    subject: subject,
    textContent: text,
    htmlContent: html,
    replyTo: replyTo ? { email: replyTo } : undefined,
    templateId: templateId,
    params: params
  };

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully to:", to);
    return data;
  } catch (error: any) {
    console.error("Error sending email:", {
      to,
      subject,
      error: error.response?.text || error.message
    });
    throw error;
  }
};

interface OrderConfirmationEmailParams {
  customerEmail: string;
  customerName?: string;
  orderNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}

export async function sendOrderConfirmationEmail({
  customerEmail,
  customerName,
  orderNumber,
  items,
  total
}: OrderConfirmationEmailParams) {
  const formattedItems = items.map(item => ({
    ...item,
    price: item.price.toFixed(2),
    subtotal: (item.price * item.quantity).toFixed(2)
  }));

  await sendEmail({
    to: customerEmail,
    subject: `Order Confirmation #${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #16a34a;">Order Confirmation</h1>
        <p>Hi ${customerName || 'Valued Customer'},</p>
        <p>Thank you for your order! We're processing it now and will send you updates along the way.</p>
        
        <div style="background-color: #f0fdf4; padding: 16px; border-radius: 4px; margin: 16px 0;">
          <p style="margin: 0;"><strong>Order Details:</strong></p>
          <p>Order Number: ${orderNumber}</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr style="border-bottom: 1px solid #ddd;">
              <th style="text-align: left; padding: 8px;">Item</th>
              <th style="text-align: right; padding: 8px;">Quantity</th>
              <th style="text-align: right; padding: 8px;">Price</th>
              <th style="text-align: right; padding: 8px;">Subtotal</th>
            </tr>
            ${formattedItems.map(item => `
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 8px;">${item.name}</td>
                <td style="text-align: right; padding: 8px;">${item.quantity}</td>
                <td style="text-align: right; padding: 8px;">$${item.price}</td>
                <td style="text-align: right; padding: 8px;">$${item.subtotal}</td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="3" style="text-align: right; padding: 8px;"><strong>Total:</strong></td>
              <td style="text-align: right; padding: 8px;"><strong>$${total.toFixed(2)}</strong></td>
            </tr>
          </table>
        </div>

        <p>If you have any questions about your order, please don't hesitate to contact us.</p>
        <p>Best regards,<br>Shop Themes Team</p>
      </div>
    `,
  });
}

interface DigitalProductDeliveryEmailParams {
  customerEmail: string;
  customerName?: string;
  orderNumber: string;
  products: Array<{
    name: string;
    downloadUrl: string;
  }>;
}

export async function sendDigitalProductDeliveryEmail({
  customerEmail,
  customerName,
  orderNumber,
  products
}: DigitalProductDeliveryEmailParams) {
  await sendEmail({
    to: customerEmail,
    subject: `Your Digital Products Are Ready - Order #${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #16a34a;">Your Digital Products Are Ready!</h1>
        <p>Hi ${customerName || 'Valued Customer'},</p>
        <p>Thank you for your purchase! Your digital products are ready to download.</p>
        
        <div style="background-color: #f0fdf4; padding: 16px; border-radius: 4px; margin: 16px 0;">
          <p style="margin: 0;"><strong>Order #${orderNumber}</strong></p>
          <div style="margin-top: 16px;">
            ${products.map(product => `
              <div style="margin-bottom: 16px;">
                <p style="margin: 0;"><strong>${product.name}</strong></p>
                <a href="${product.downloadUrl}" 
                   style="display: inline-block; background-color: #16a34a; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; margin-top: 8px;">
                  Download
                </a>
              </div>
            `).join('')}
          </div>
        </div>

        <p>Your download links will expire in 24 hours for security reasons. Please download your products before then.</p>
        <p>If you have any issues with the downloads, please contact our support team.</p>
        <p>Best regards,<br>Shop Themes Team</p>
      </div>
    `,
  });
}

export async function testEmail(toEmail: string) {
  try {
    console.log("Sending test email to:", toEmail);
    await sendEmail({
      to: toEmail,
      subject: "Test Email from Shop Themes",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #16a34a;">Test Email</h1>
          <p>This is a test email from Shop Themes to verify the email configuration.</p>
          <p>If you received this email, the email service is working correctly!</p>
          <p>Best regards,<br>Shop Themes Team</p>
        </div>
      `
    });
    console.log("Test email sent successfully");
    return true;
  } catch (error) {
    console.error("Test email failed:", error);
    throw error;
  }
} 