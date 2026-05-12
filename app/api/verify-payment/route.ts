import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type CartItemPayload = {
  menu_item_id: string;
  snapshot_name: string;
  unit_price: number;
  quantity: number;
  selected_extras?: { name: string; price: number; quantity: number }[];
};

type VerifyPaymentBody = {
  reference: string;
  cartItems: CartItemPayload[];
  fulfillment: "delivery" | "pickup";
  address: string | null;
  note: string | null;
  fullName: string;
  phone: string;
};

export async function POST(request: Request) {
  try {
    const body: VerifyPaymentBody = await request.json();
    const { reference, cartItems, fulfillment, address, note } =
      body;

    if (!reference || !cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Missing required payment data." },
        { status: 400 },
      );
    }

    // 1. Get the authenticated user
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    // 2. Verify the transaction with Paystack
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      console.error("Missing PAYSTACK_SECRET_KEY env variable");
      return NextResponse.json(
        { error: "Payment configuration error." },
        { status: 500 },
      );
    }

    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      },
    );

    const paystackData = await paystackRes.json();

    if (
      !paystackRes.ok ||
      !paystackData.status ||
      paystackData.data?.status !== "success"
    ) {
      console.error("Paystack verification failed:", paystackData);
      return NextResponse.json(
        { error: "Payment verification failed. Please contact support." },
        { status: 400 },
      );
    }

    // 3. Calculate totals from the cart (server-side, never trust client totals)
    const subtotal = cartItems.reduce(
      (sum, item) => {
        const extrasTotal = item.selected_extras?.reduce((s, e) => s + (Number(e.price) * e.quantity), 0) ?? 0;
        return sum + (item.unit_price + extrasTotal) * item.quantity;
      },
      0,
    );
    const deliveryFee = fulfillment === "delivery" ? 12 : 0;
    const total = subtotal + deliveryFee;

    // Verify the paid amount matches expected total (in pesewas)
    const paidAmountPesewas = paystackData.data.amount;
    const expectedPesewas = Math.round(total * 100);

    if (paidAmountPesewas !== expectedPesewas) {
      console.error(
        `Amount mismatch: paid ${paidAmountPesewas} pesewas, expected ${expectedPesewas} pesewas`,
      );
      return NextResponse.json(
        { error: "Payment amount mismatch. Please contact support." },
        { status: 400 },
      );
    }

    // 4. Create the order using admin client (bypasses RLS)
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user.id,
        status: "received",
        fulfillment_type: fulfillment,
        delivery_address: address,
        note,
        subtotal,
        delivery_fee: deliveryFee,
        total,
      })
      .select("id, order_number")
      .single();

    if (orderError || !order) {
      console.error("Failed to create order:", orderError);
      return NextResponse.json(
        { error: "Failed to create order. Your payment was received — please contact support." },
        { status: 500 },
      );
    }

    // 5. Create order items
    const orderItemsPayload = cartItems.map((item) => {
      const extrasTotal = item.selected_extras?.reduce((s, e) => s + (Number(e.price) * e.quantity), 0) ?? 0;
      const finalUnitPrice = item.unit_price + extrasTotal;
      return {
        order_id: order.id,
        menu_item_id: item.menu_item_id,
        snapshot_name: item.snapshot_name,
        unit_price: finalUnitPrice,
        quantity: item.quantity,
        line_total: finalUnitPrice * item.quantity,
        selected_extras: item.selected_extras ?? null,
      };
    });

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItemsPayload);

    if (itemsError) {
      console.error("Failed to create order items:", itemsError);
      // Order was created, so we still return the orderId
    }

    // 6. Create the payment record
    const { error: paymentError } = await supabaseAdmin
      .from("payments")
      .insert({
        order_id: order.id,
        paystack_reference: reference,
        amount: total,
        currency: "GHS",
        status: "success",
        paid_at: new Date().toISOString(),
      });

    if (paymentError) {
      console.error("Failed to create payment record:", paymentError);
      // Order was created, so we still return the orderId
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.order_number,
    });
  } catch (err) {
    console.error("Verify payment error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
