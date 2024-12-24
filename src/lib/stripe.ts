import Stripe from "stripe";
import { CartItem } from "@/components/store/cart/cart-provider";

interface CreateCheckoutParams {
  user?: {
    customerId?: string;
    email?: string;
  };
  mode: "payment" | "subscription";
  successUrl: string;
  cancelUrl: string;
  items: CartItem[];
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

export const createCheckout = async ({
  user,
  mode,
  successUrl,
  cancelUrl,
  items,
}: CreateCheckoutParams): Promise<{ url: string }> => {
  try {
    const extraParams: {
      customer?: string;
      customer_creation?: "always";
      customer_email?: string;
      payment_intent_data?: { setup_future_usage: "on_session" };
    } = {};

    if (user?.customerId) {
      extraParams.customer = user.customerId;
    } else {
      if (mode === "payment") {
        extraParams.customer_creation = "always";
        extraParams.payment_intent_data = { setup_future_usage: "on_session" };
      }
      if (user?.email) {
        extraParams.customer_email = user.email;
      }
    }

    // Prepare metadata with essential item information
    const itemsForMetadata = items.map(item => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
    }));

    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: item.images || [],
            description: item.description || undefined,
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        items: JSON.stringify(itemsForMetadata),
      },
      ...extraParams,
    });

    return { url: session.url! };
  } catch (e) {
    console.error(e);
    throw new Error("Failed to create checkout session");
  }
};

export const findCheckoutSession = async (sessionId: string) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-12-18.acacia", // TODO: update this when Stripe updates their API
      typescript: true,
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    return session;
  } catch (e) {
    console.error(e);
    return null;
  }
};