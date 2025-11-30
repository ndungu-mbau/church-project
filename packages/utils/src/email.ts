export interface SendEmailArgs {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface EmailResponse {
  success: boolean;
  error?: string;
}

/**
 * Send Email utility
 * Currently a mock implementation that logs to console.
 * TODO: Integrate with a real email provider (e.g., Resend, SendGrid)
 */
export async function sendEmail(args: SendEmailArgs): Promise<EmailResponse> {
  const { to, subject, text } = args;

  console.log(`[EMAIL] Sending email to ${to}`);
  console.log(`[EMAIL] Subject: ${subject}`);
  console.log(`[EMAIL] Body: ${text}`);

  // Simulate success
  return {
    success: true,
  };
}
