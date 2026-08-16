import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";

const payloadSchema = z.object({
  // PayToday echoes the order id we sent as `reference`.
  reference: z.string().uuid(),
  status: z.enum(["paid", "successful", "success", "failed", "cancelled"]),
  transaction_id: z.string().max(120).optional(),
});

function verify(rawBody: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(signature.trim().replace(/^sha256=/, ""));
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const Route = createFileRoute("/api/public/webhooks/paytoday")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["PAYTODAY_WEBHOOK_SECRET"];
        if (!secret) return new Response("Webhook not configured", { status: 503 });

        const raw = await request.text();
        const signature =
          request.headers.get("x-paytoday-signature") ?? request.headers.get("x-signature");
        if (!verify(raw, signature, secret)) {
          return new Response("Invalid signature", { status: 401 });
        }

        const parsed = payloadSchema.safeParse(JSON.parse(raw));
        if (!parsed.success) return new Response("Invalid payload", { status: 400 });

        const { settleOrder } = await import("@/lib/payments.server");
        const paid = ["paid", "successful", "success"].includes(parsed.data.status);
        const settled = await settleOrder({
          orderId: parsed.data.reference,
          status: paid ? "paid" : (parsed.data.status as "failed" | "cancelled"),
          providerRef: parsed.data.transaction_id ?? null,
        });
        if (!settled) return new Response("Unknown order", { status: 404 });
        return Response.json({ ok: true, status: settled.status });
      },
    },
  },
});
