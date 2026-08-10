CREATE TABLE public.join_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_link TEXT NOT NULL UNIQUE,
  event_id TEXT NOT NULL,
  fbp TEXT,
  fbc TEXT,
  external_id TEXT,
  client_user_agent TEXT,
  client_ip TEXT,
  event_source_url TEXT,
  telegram_user_id BIGINT,
  joined_at TIMESTAMP WITH TIME ZONE,
  capi_status TEXT,
  capi_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.join_clicks TO service_role;
ALTER TABLE public.join_clicks ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_join_clicks_created_at ON public.join_clicks (created_at DESC);

CREATE TABLE public.tg_settings (
  id TEXT NOT NULL PRIMARY KEY,
  channel_id BIGINT,
  channel_title TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.tg_settings TO service_role;
ALTER TABLE public.tg_settings ENABLE ROW LEVEL SECURITY;