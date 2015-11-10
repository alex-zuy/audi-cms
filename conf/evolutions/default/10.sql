# --- !Ups

ALTER TABLE test_drive_arrangements
  ALTER COLUMN prefered_contact_address_id DROP NOT NULL;

# --- !Downs
