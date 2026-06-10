import { lineConfigured } from "@/lib/line";
import { promptPayConfigured } from "@/lib/promptpay";
import { cloudinaryConfigured } from "@/lib/storage";
import { emailProviderConfigured, thaiBulkSmsConfigured } from "@/lib/notifications";

export interface IntegrationStatus {
  openai: boolean;
  resend: boolean;
  thaibulksms: boolean;
  twilio: boolean;
  cloudinary: boolean;
  line: boolean;
  promptpay: boolean;
  slipok: boolean;
  ga4: boolean;
}

export function getIntegrationStatus(): IntegrationStatus {
  return {
    openai: Boolean(process.env.OPENAI_API_KEY),
    resend: emailProviderConfigured(),
    thaibulksms: thaiBulkSmsConfigured(),
    twilio: Boolean(process.env.TWILIO_ACCOUNT_SID),
    cloudinary: cloudinaryConfigured(),
    line: lineConfigured(),
    promptpay: promptPayConfigured(),
    slipok: Boolean(process.env.SLIPOK_API_KEY),
    ga4: Boolean(process.env.NEXT_PUBLIC_GA_ID),
  };
}

export function allCoreIntegrationsReady(status: IntegrationStatus): boolean {
  return (
    status.resend &&
    status.cloudinary &&
    status.line &&
    status.promptpay &&
    status.thaibulksms
  );
}
