import { hasOpenAI } from "@/lib/openai";
import { lineConfigured } from "@/lib/line";
import { adsenseClientId } from "@/lib/adsense";
import { readCronSecret } from "@/lib/cron-auth";
import { googleConfigured } from "@/lib/google-oauth";
import { facebookConfigured } from "@/lib/facebook-oauth";
import { turnstileConfigured } from "@/lib/captcha";
import { isGaConfigured } from "@/lib/ga";
import { promptPayConfigured, slipOkConfigured } from "@/lib/promptpay";
import { cloudinaryConfigured } from "@/lib/storage";
import { emailProviderConfigured, thaiBulkSmsConfigured } from "@/lib/notifications";

export interface IntegrationStatus {
  openai: boolean;
  resend: boolean;
  thaibulksms: boolean;
  twilio: boolean;
  cloudinary: boolean;
  line: boolean;
  google: boolean;
  facebook: boolean;
  promptpay: boolean;
  slipok: boolean;
  ga4: boolean;
  turnstile: boolean;
  adsense: boolean;
  cronSecret: boolean;
}

export function getIntegrationStatus(): IntegrationStatus {
  return {
    openai: hasOpenAI(),
    resend: emailProviderConfigured(),
    thaibulksms: thaiBulkSmsConfigured(),
    twilio: Boolean(process.env.TWILIO_ACCOUNT_SID),
    cloudinary: cloudinaryConfigured(),
    line: lineConfigured(),
    google: googleConfigured(),
    facebook: facebookConfigured(),
    promptpay: promptPayConfigured(),
    slipok: slipOkConfigured(),
    ga4: isGaConfigured(),
    turnstile: turnstileConfigured(),
    adsense: Boolean(adsenseClientId()),
    cronSecret: Boolean(readCronSecret()),
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
