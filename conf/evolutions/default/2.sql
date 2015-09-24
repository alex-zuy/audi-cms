# --- !Ups

ALTER TABLE public.contact_infos
  ALTER COLUMN name TYPE JSON using to_json(''::text);

# --- !Downs
