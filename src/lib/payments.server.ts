import type { Database } from "@/integrations/supabase/types";

export const PRIORITY_AMOUNT_CENTS = 3000;
export const PRIORITY_CURRENCY = "NAD";

export type OrderStatus = "pending" | "paid" | "failed" | "cancelled";

type Order = Database["public"]["Tables"]["priority_alert_orders"]["Row"];

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

/** Live mode is on only once a PayToday API key has been configured. */
export function isLiveMode() {
  return Boolean(process.env["PAYTODAY_API_KEY"]);
}

export async function createOrder(input: { applicationRef: string; schoolName?: string }) {
  const db = await admin();
  const { data, error } = await db
    .from("priority_alert_orders")
    .insert({
      application_ref: input.applicationRef,
      school_name: input.schoolName ?? null,
      amount_cents: PRIORITY_AMOUNT_CENTS,
      currency: PRIORITY_CURRENCY,
      provider: isLiveMode() ? "paytoday" : "sandbox",
    })
    .select("id, status")
    .single();
  if (error) throw new Error(error.message);
  return data as Pick<Order, "id" | "status">;
}

/**
 * Ask PayToday for a hosted checkout URL. Returns null while no merchant
 * credentials are configured (test mode uses the in-app sandbox instead).
 */
export async function requestCheckoutUrl(orderId: string, returnUrl: string) {
  const apiKey = process.env["PAYTODAY_API_KEY"];
  const merchantId = process.env["PAYTODAY_MERCHANT_ID"];
  if (!apiKey || !merchantId) return null;

  const res = await fetch("https://api.paytoday.com.na/v1/checkouts", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      merchant_id: merchantId,
      amount: PRIORITY_AMOUNT_CENTS / 100,
      currency: PRIORITY_CURRENCY,
      reference: orderId,
      description: "EduSpace Fast-Track WhatsApp alerts",
      return_url: returnUrl,
    }),
  });
  if (!res.ok) {
    console.error("PayToday checkout failed", res.status, await res.text());
    throw new Error("Could not start the card checkout. Please try again.");
  }
  const body = (await res.json()) as { checkout_url?: string; url?: string; id?: string };
  const url = body.checkout_url ?? body.url;
  if (!url) throw new Error("Card checkout is unavailable right now.");
  if (body.id) {
    const db = await admin();
    await db.from("priority_alert_orders").update({ provider_ref: body.id }).eq("id", orderId);
  }
  return url;
}

/** Single source of truth for settling an order — used by the webhook and the sandbox. */
export async function settleOrder(input: {
  orderId: string;
  status: OrderStatus;
  providerRef?: string | null;
}) {
  const db = await admin();
  const paid = input.status === "paid";
  const { data, error } = await db
    .from("priority_alert_orders")
    .update({
      status: input.status,
      has_priority_alerts: paid,
      paid_at: paid ? new Date().toISOString() : null,
      ...(input.providerRef ? { provider_ref: input.providerRef } : {}),
    })
    .eq("id", input.orderId)
    .select("id, application_ref, status, has_priority_alerts")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function readOrder(orderId: string) {
  const db = await admin();
  const { data, error } = await db
    .from("priority_alert_orders")
    .select("id, status, has_priority_alerts, application_ref")
    .eq("id", orderId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}
