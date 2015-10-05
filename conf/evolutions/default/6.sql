# --- !Ups

ALTER TABLE photos
  RENAME image_medium TO image;

ALTER TABLE photos
  DROP COLUMN image_small,
  DROP COLUMN image_big,
  DROP COLUMN internal_name,
  ALTER COLUMN image DROP NOT NULL;

ALTER TABLE photo_sets
  ADD COLUMN dummy VARCHAR(10);

CREATE SEQUENCE photo_sets_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

ALTER TABLE photo_sets
  ALTER COLUMN id SET DEFAULT nextval('photo_sets_id_seq');

# --- !Downs
