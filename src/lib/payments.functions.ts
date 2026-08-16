import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const startSchema = z.object({
  applicationRef: z.string().min(3).max(64),
  schoolName: z.string().max(160).optional(),
  returnUrl: z.string().url().max(500).optional(),
});

const orderSchema = z.object({ orderId: z.string().uuid() });

export const startPriorityCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => startSchema.parse(data))
  .handler(async ({ data }) => {
    const svc = await import("./payments.server");
    const order = await svc.createOrder({
      applicationRef: data.applicationRef,
      schoolName: data.schoolName ?? "",
    });
    const checkoutUrl = svc.isLiveMode()
      ? await svc.requestCheckoutUrl(order.id, data.returnUrl ?? "https://eduspace.na/")
      : null;
    return {
      orderId: order.id,
      checkoutUrl,
      mode: svc.isLiveMode() ? ("live" as const) : ("test" as const),
      amountCents: svc.PRIORITY_AMOUNT_CENTS,
      currency: svc.PRIORITY_CURRENCY,
    };
  });

export const getPriorityOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const svc = await import("./payments.server");
    const order = await svc.readOrder(data.orderId);
    if (!order) return { status: "unknown" as const, hasPriorityAlerts: false };
    return { status: order.status, hasPriorityAlerts: order.has_priority_alerts };
  });

/**
 * Test-mode only: stands in for the provider webhook so the whole flow can be
 * exercised before PayToday credentials exist. Disabled the moment a real
 * PAYTODAY_API_KEY is configured.
 */
export const completeSandboxPayment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const svc = await import("./payments.server");
    if (svc.isLiveMode()) throw new Error("Sandbox payments are disabled in live mode.");
    const settled = await svc.settleOrder({
      orderId: data.orderId,
      status: "paid",
      providerRef: `sandbox_${data.orderId.slice(0, 8)}`,
    });
    if (!settled) throw new Error("Order not found.");
    return { status: settled.status, hasPriorityAlerts: settled.has_priority_alerts };
  });
