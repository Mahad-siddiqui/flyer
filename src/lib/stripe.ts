import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

export const stripe = new Stripe("sk_test_51RmHKOPD8W9LZ4BLEW5MoecTTmr1JtbIWDo9YH6mOCLVdjtjVyNXBTR7clUqX30NUc69E8AiSMOWnyj8NxVrqnjU00e2bUpQ7a", {
  apiVersion: "2025-06-30.basil",
  typescript: true,
});

export const getStripe = () => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error("Missing Stripe publishable key");
  }
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
};

export const plans = [
  {
    name: "Free",
    description: "Perfect for trying out our service",
    price: 0,
    interval: "month",
    features: [
      "5 flyers per month",
      "Basic templates",
      "Standard QR codes",
      "Email support",
    ],
    flyerLimit: 5,
    templateAccess: { basic: true, premium: false },
    stripePriceId: "price_free",
  },
  {
    name: "Pro",
    description: "Great for small businesses",
    price: 9.99,
    interval: "month",
    features: [
      "50 flyers per month",
      "All templates",
      "Custom QR codes",
      "Priority support",
      "Analytics dashboard",
      "Custom branding",
    ],
    flyerLimit: 50,
    templateAccess: { basic: true, premium: true },
    stripePriceId: "price_1RmHOEPD8W9LZ4BLzad5l7XQ",
  },
  {
    name: "Enterprise",
    description: "For growing businesses",
    price: 29.99,
    interval: "month",
    features: [
      "Unlimited flyers",
      "All templates",
      "Custom domains",
      "API access",
      "Advanced analytics",
      "Custom branding",
      "Priority support",
      "Bulk upload",
    ],
    flyerLimit: -1, // unlimited
    templateAccess: { basic: true, premium: true, enterprise: true },
    stripePriceId: "price_1RmHOGPD8W9LZ4BLdalzBUCy",
  },
];

export async function createCheckoutSession(priceId: string, userId: string) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      customer_email: undefined,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          userId,
        },
      },
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
    });

    return session;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

export async function createCustomerPortalSession(customerId: string) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    });

    return session;
  } catch (error) {
    console.error("Error creating customer portal session:", error);
    throw error;
  }
}


export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}