CREATE TABLE public.priority_alert_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_ref TEXT NOT NULL,
  school_name TEXT,
  amount_cents INTEGER NOT NULL DEFAULT 3000,
  currency TEXT NOT NULL DEFAULT 'NAD',
  provider TEXT NOT NULL DEFAULT 'paytoday',
  provider_ref TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  has_priority_alerts BOOLEAN NOT NULL DEFAULT false,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT priority_alert_orders_status_check CHECK (status IN ('pending','paid','failed','cancelled'))
);

CREATE INDEX priority_alert_orders_application_ref_idx ON public.priority_alert_orders (application_ref);
CREATE UNIQUE INDEX priority_alert_orders_provider_ref_idx ON public.priority_alert_orders (provider, provider_ref) WHERE provider_ref IS NOT NULL;

GRANT ALL ON public.priority_alert_orders TO service_role;

ALTER TABLE public.priority_alert_orders ENABLE ROW LEVEL SECURITY;