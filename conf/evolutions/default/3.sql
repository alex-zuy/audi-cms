# --- !Ups

ALTER TABLE public.contact_numbers
  ALTER COLUMN name TYPE JSON using to_json(''::text);

ALTER TABLE public.contact_emails
  ALTER COLUMN name TYPE JSON using to_json(''::text);

ALTER TABLE public.contact_addresses
  ALTER COLUMN name TYPE JSON using to_json(''::text);

# --- !Downs
