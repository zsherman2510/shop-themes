import { NextResponse } from "next/server";
import { createCheckout } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, successUrl, cancelUrl } = body;

    if (!items?.length) {
      return NextResponse.json(
        { error: "No items in cart" },
        { status: 400 }
      );
    }

    const session = await createCheckout({
      mode: "payment",
      items,
      successUrl,
      cancelUrl,
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error in checkout:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
