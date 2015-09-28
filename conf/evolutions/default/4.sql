# --- !Ups

ALTER TABLE public.news
  ALTER COLUMN title TYPE JSON using to_json(''::text);

ALTER TABLE public.news
  ALTER COLUMN text TYPE JSON using to_json(''::text);

ALTER TABLE public.offers
  ALTER COLUMN title TYPE JSON using to_json(''::text);

ALTER TABLE public.offers
  ALTER COLUMN text TYPE JSON using to_json(''::text);

ALTER TABLE public.photos
  ALTER COLUMN name TYPE JSON using to_json(''::text);

# --- !Downs
