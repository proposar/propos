import { track } from "@vercel/analytics";

export function trackProposalGenerated() {
  track("proposal_generated");
}

export function trackProposalSent() {
  track("proposal_sent");
}

export function trackProposalAccepted() {
  track("proposal_accepted");
}

export function trackUserUpgraded(plan?: string) {
  track("user_upgraded", plan ? { plan } : {});
}

export function trackOnboardingCompleted() {
  track("onboarding_completed");
}

export function trackFirstProposalCreated() {
  track("first_proposal_created");
}
