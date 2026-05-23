import { addDays } from "./dates";
import type { PremiumState, TrialStatus } from "./models";

export const PREMIUM_PRICE_USD = 3;
export const TRIAL_DAYS = 7;
export const STRIPE_PAYMENT_LINK = "STRIPE_PAYMENT_LINK";

export function isPaymentLinkConfigured(): boolean {
  return STRIPE_PAYMENT_LINK.startsWith("https://");
}

export function getTrialStatus(
  premium: PremiumState,
  now: Date = new Date(),
): TrialStatus {
  const firstLaunch = new Date(premium.firstLaunchAt);
  const trialEndsAt = addDays(firstLaunch, TRIAL_DAYS);
  const remainingMs = trialEndsAt.getTime() - now.getTime();
  const remainingDays = Math.max(0, Math.ceil(remainingMs / 86_400_000));
  const isPremiumActive = Boolean(premium.purchasedAt);
  const isTrialActive = remainingMs > 0;

  return {
    firstLaunchAt: firstLaunch.toISOString(),
    trialEndsAt: trialEndsAt.toISOString(),
    remainingDays,
    isTrialActive,
    isPremiumActive,
    hasPremiumAccess: isPremiumActive || isTrialActive,
  };
}
