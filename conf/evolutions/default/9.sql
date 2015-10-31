# --- !Ups

ALTER TABLE contact_infos
  DROP COLUMN internal_name,
  ADD COLUMN category varchar(50) DEFAULT 'service';

ALTER TABLE contact_infos
  ALTER COLUMN category SET NOT NULL;

ALTER TABLE contact_emails
    DROP COLUMN contact_person;

# --- !Downs
