# --- !Ups

ALTER TABLE public.model_ranges
  ALTER name TYPE JSON USING to_json(''::TEXT),
  ALTER description TYPE JSON USING to_json(''::TEXT);

ALTER table public.models
  ALTER name TYPE JSON USING to_json(''::TEXT);

ALTER TABLE public.model_editions
  ALTER name TYPE JSON USING to_json(''::TEXT);

# --- !Downs
