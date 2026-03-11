-- Store inbound vendor contact form submissions for admin inbox

CREATE TABLE IF NOT EXISTS public.vendor_contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name TEXT NOT NULL,
  vendor_category TEXT,
  vendor_city TEXT,
  vendor_url TEXT,
  locale TEXT NOT NULL DEFAULT 'en',
  sender_name TEXT NOT NULL,
  sender_phone TEXT NOT NULL,
  sender_account_email TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  is_flagged BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendor_contact_messages_created_at
  ON public.vendor_contact_messages (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_vendor_contact_messages_is_read
  ON public.vendor_contact_messages (is_read);

CREATE INDEX IF NOT EXISTS idx_vendor_contact_messages_is_flagged
  ON public.vendor_contact_messages (is_flagged);

CREATE INDEX IF NOT EXISTS idx_vendor_contact_messages_is_archived
  ON public.vendor_contact_messages (is_archived);

ALTER TABLE public.vendor_contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service role manage vendor_contact_messages" ON public.vendor_contact_messages;
CREATE POLICY "service role manage vendor_contact_messages"
  ON public.vendor_contact_messages
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP TRIGGER IF EXISTS update_vendor_contact_messages_updated_at ON public.vendor_contact_messages;
CREATE TRIGGER update_vendor_contact_messages_updated_at
  BEFORE UPDATE ON public.vendor_contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
