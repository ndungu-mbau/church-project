// import axios from "axios";
// import { PhoneNumberUtil, PhoneNumberFormat } from "google-libphonenumber";

// const phoneUtil = PhoneNumberUtil.getInstance();

// export interface SendSmsArgs {
//   phone: string;
//   message: string;
//   purpose?: string; // e.g., "otp", "welcome", "notification"
// }

// export interface SmsResponse {
//   success: boolean;
//   messageId?: string;
//   error?: string;
// }

// /**
//  * Send SMS via mobilesasa.com API
//  * Migrated from legacy JS implementation with TypeScript, audit logging, and environment variables
//  */
// export async function sendSms(args: SendSmsArgs): Promise<SmsResponse> {
//   const { phone, message, purpose } = args;

//   try {
//     // Format phone number to E164 (international format)
//     const number = phoneUtil.parseAndKeepRawInput(phone, "KE");
//     const formattedNumber = phoneUtil.format(number, PhoneNumberFormat.E164);

//     // Prepare API request
//     const apiData = new URLSearchParams();
//     apiData.append("senderID", "SHULEPLUS");
//     apiData.append("phone", formattedNumber);
//     apiData.append("message", message);

//     console.log(`[SMS] Sending ${purpose || "message"} to ${formattedNumber}`);

//     // Send SMS via mobilesasa.com
//     const response = await axios.post(
//       "https://api.mobilesasa.com/v1/send/message",
//       apiData,
//       {
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${process.env.MOBILESASA_API_KEY}`,
//         },
//       }
//     );
//     return {
//       success: true,
//       messageId: response.data.messageId,
//     };
//   } catch (error) {
//     console.error("[SMS] Failed to send:", error);

//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Failed to send SMS",
//     };
//   }
// }

export interface SendSmsArgs {
  phone: string
  text: string;
  html?: string;
}

export interface SmsResponse {
  success: boolean;
  error?: string;
}

/**
 * Send Email utility
 * Currently a mock implementation that logs to console.
 * TODO: Integrate with a real email provider (e.g., Resend, SendGrid)
 */
export async function sendSms(args: SendSmsArgs): Promise<SmsResponse> {
  const { phone, text } = args;

  console.log(`[SMS] Sending SMS to ${phone}`);
  console.log(`[SMS] Body: ${text}`);

  // Simulate success
  return {
    success: true,
  };
}
