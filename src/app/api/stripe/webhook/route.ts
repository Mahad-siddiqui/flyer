import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(
          event.data.object as Stripe.Invoice
        );
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );
  const userId = session.metadata?.userId;

  if (!userId) {
    console.error("No user ID in checkout session metadata");
    return;
  }

  // Find the plan based on the price ID
  const plan = await prisma.plan.findFirst({
    where: {
      stripePriceId: subscription.items.data[0].price.id,
    },
  });

  if (!plan) {
    console.error(
      "Plan not found for price ID:",
      subscription.items.data[0].price.id
    );
    return;
  }

  // Update user with subscription info
  await prisma.user.update({
    where: { id: userId },
    data: {
      stripeCustomerId: subscription.customer as string,
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      planId: plan.id,
      currentPeriodEnd: subscription.ended_at ? new Date(subscription.ended_at * 1000) : null,
    },
  });
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription as string
  );

  await prisma.user.update({
    where: { stripeCustomerId: invoice.customer as string },
    data: {
      subscriptionStatus: subscription.status,
      currentPeriodEnd: subscription.ended_at ? new Date(subscription.ended_at * 1000) : null,
    },
  });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  await prisma.user.update({
    where: { stripeCustomerId: invoice.customer as string },
    data: {
      subscriptionStatus: "past_due",
    },
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // Find the plan based on the price ID
  const plan = await prisma.plan.findFirst({
    where: {
      stripePriceId: subscription.items.data[0].price.id,
    },
  });

  if (!plan) {
    console.error(
      "Plan not found for price ID:",
      subscription.items.data[0].price.id
    );
    return;
  }

  await prisma.user.update({
    where: { stripeCustomerId: subscription.customer as string },
    data: {
      subscriptionStatus: subscription.status,
      planId: plan.id,
      currentPeriodEnd: subscription.ended_at ? new Date(subscription.ended_at * 1000) : null,
    },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Find the free plan
  const freePlan = await prisma.plan.findFirst({
    where: { name: "Free" },
  });

  if (!freePlan) {
    console.error("Free plan not found");
    return;
  }

  await prisma.user.update({
    where: { stripeCustomerId: subscription.customer as string },
    data: {
      subscriptionStatus: "canceled",
      planId: freePlan.id,
      subscriptionId: null,
      currentPeriodEnd: null,
    },
  });
}
