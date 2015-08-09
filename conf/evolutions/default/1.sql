# Initial DATABASE shema generated USING PGmodeler

# --- !Ups

CREATE TABLE public.managers (
  id            SERIAL      NOT NULL,
  full_name     VARCHAR(50) NOT NULL,
  email         VARCHAR(50) NOT NULL,
  password_hash VARCHAR(60) NOT NULL,
  is_admin      BOOLEAN     NOT NULL DEFAULT FALSE,
  CONSTRAINT managers_pk_id PRIMARY KEY (id),
  CONSTRAINT managers_email_unique UNIQUE (email)

);

COMMENT ON TABLE public.managers IS 'Managers are users that maintain web-site content';

COMMENT ON COLUMN public.managers.full_name IS 'Managesrs full name. Mainly for UI purposes.';

COMMENT ON COLUMN public.managers.email IS 'Email used for login and password resets.';

COMMENT ON COLUMN public.managers.is_admin IS 'Specifies whether manager is admin or not';


CREATE TABLE public.news (
  id           SERIAL       NOT NULL,
  photo_set_id INTEGER,
  title        VARCHAR(250) NOT NULL,
  text         TEXT         NOT NULL,
  created_at   TIMESTAMP    NOT NULL DEFAULT now(),
  CONSTRAINT news_pk_id PRIMARY KEY (id)

);


CREATE TABLE public.offers (
  id           SERIAL       NOT NULL,
  photo_set_id INTEGER,
  title        VARCHAR(250) NOT NULL,
  text         TEXT         NOT NULL,
  created_at   TIMESTAMP    NOT NULL DEFAULT now(),
  CONSTRAINT offers_pk_id PRIMARY KEY (id)

);

COMMENT ON TABLE public.offers IS 'Special offers for customers.';


CREATE TABLE public.models (
  id                 SERIAL      NOT NULL,
  model_range_id     INTEGER     NOT NULL,
  photo_set_id       INTEGER     NOT NULL,
  name               VARCHAR(30) NOT NULL,
  passenger_capacity SMALLINT    NOT NULL,
  width              REAL        NOT NULL,
  height             REAL        NOT NULL,
  length             REAL        NOT NULL,
  ground_clearance   REAL        NOT NULL,
  luggage_space      SMALLINT    NOT NULL,
  CONSTRAINT models_pk_id PRIMARY KEY (id)

);

COMMENT ON COLUMN public.models.model_range_id IS 'Reference to model range';

COMMENT ON COLUMN public.models.photo_set_id IS 'Set of photos for model';

COMMENT ON COLUMN public.models.name IS 'Model name';

COMMENT ON COLUMN public.models.passenger_capacity IS 'Maximum number of passengers';

COMMENT ON COLUMN public.models.width IS 'Full width of car in meters';

COMMENT ON COLUMN public.models.height IS 'Full height of car in meters';

COMMENT ON COLUMN public.models.length IS 'Full length of car in meters';

COMMENT ON COLUMN public.models.ground_clearance IS 'Ground clearence in meters';

COMMENT ON COLUMN public.models.luggage_space IS 'Luggage division volume in liters';


CREATE TYPE public.engine_types AS
ENUM ('diesel', 'benzine');

COMMENT ON TYPE public.engine_types IS 'Engine types. Either diesel or benzine.';


CREATE TYPE public.gearbox_types AS
ENUM ('automatic', 'manual');

COMMENT ON TYPE public.gearbox_types IS 'Gearbox types (automatic and manual)';


CREATE TYPE public.transmission_types AS
ENUM ('front', 'rear', 'all', 'adjustable');

COMMENT ON TYPE public.transmission_types IS 'Transmission type indicate which wheels drive the car';


CREATE TABLE public.model_editions (
  id                    SERIAL                    NOT NULL,
  model_id              INTEGER                   NOT NULL,
  name                  VARCHAR(30)               NOT NULL,
  engine_type           public.engine_types       NOT NULL,
  engine_volume         REAL                      NOT NULL,
  engine_cylinder_count SMALLINT                  NOT NULL,
  engine_power          SMALLINT                  NOT NULL,
  fuel_tank             SMALLINT                  NOT NULL,
  fuel_consumption      REAL                      NOT NULL,
  acceleration          REAL                      NOT NULL,
  max_speed             SMALLINT                  NOT NULL,
  gearbox_type          public.gearbox_types      NOT NULL,
  gearbox_levels        SMALLINT                  NOT NULL,
  transmission_type     public.transmission_types NOT NULL,
  CONSTRAINT model_editions_pk_id PRIMARY KEY (id)

);

COMMENT ON COLUMN public.model_editions.model_id IS 'Specifies model which this edition belongs to';

COMMENT ON COLUMN public.model_editions.engine_volume IS 'Engine working volume in liters';

COMMENT ON COLUMN public.model_editions.engine_cylinder_count IS 'Engine cylinder count';

COMMENT ON COLUMN public.model_editions.engine_power IS 'Engin power in horse-power';

COMMENT ON COLUMN public.model_editions.fuel_tank IS 'Fuel tank volume in liters';

COMMENT ON COLUMN public.model_editions.fuel_consumption IS 'Fuel consumpltion in liters per 100 kilometers';

COMMENT ON COLUMN public.model_editions.acceleration IS 'Car acceleration indicating time in seconds necessary to reach 100 km/h';

COMMENT ON COLUMN public.model_editions.max_speed IS 'Maximum speed im km/h';

COMMENT ON COLUMN public.model_editions.gearbox_levels IS 'Number of gearbox levels';


CREATE TABLE public.model_ranges (
  id          SERIAL      NOT NULL,
  name        VARCHAR(30) NOT NULL,
  description TEXT,
  CONSTRAINT model_ranges_pk_id PRIMARY KEY (id)

);

COMMENT ON TABLE public.model_ranges IS 'Model ranges';

COMMENT ON COLUMN public.model_ranges.name IS 'Range name';


CREATE TABLE public.contact_infos (
  id            SERIAL      NOT NULL,
  name          VARCHAR(50) NOT NULL,
  internal_name VARCHAR(50),
  CONSTRAINT contact_infos_pk_id PRIMARY KEY (id),
  CONSTRAINT contact_infos_unique_internal_name UNIQUE (internal_name)

);

COMMENT ON COLUMN public.contact_infos.internal_name IS 'name that may be used to reference some row in table';


CREATE TABLE public.contact_emails (
  id              SERIAL      NOT NULL,
  contact_info_id INTEGER     NOT NULL,
  contact_person  VARCHAR(50) NOT NULL,
  email           VARCHAR(50) NOT NULL,
  name            VARCHAR(50) NOT NULL,
  CONSTRAINT contact_emails_pk_id PRIMARY KEY (id)

);

COMMENT ON TABLE public.contact_emails IS 'Contact email for contact info';

COMMENT ON COLUMN public.contact_emails.contact_person IS 'Contact person full name';


CREATE TABLE public.contact_addresses (
  id              SERIAL      NOT NULL,
  contact_info_id INTEGER     NOT NULL,
  name            VARCHAR(50) NOT NULL,
  address         VARCHAR(50) NOT NULL,
  geo_coordinates JSON,
  CONSTRAINT contact_addresses_pk_id PRIMARY KEY (id)

);

COMMENT ON TABLE public.contact_addresses IS 'Contact info address';

COMMENT ON COLUMN public.contact_addresses.geo_coordinates IS 'Georgaphic coordinates';


CREATE TABLE public.contact_numbers (
  id              SERIAL      NOT NULL,
  contact_info_id INTEGER     NOT NULL,
  name            VARCHAR(50) NOT NULL,
  number          VARCHAR(20) NOT NULL,
  CONSTRAINT contact_numbers_pk_id PRIMARY KEY (id)

);


CREATE TABLE public.test_drive_arrangements (
  id                          SERIAL      NOT NULL,
  prefered_contact_address_id INTEGER     NOT NULL,
  model_edition_id            INTEGER     NOT NULL,
  client_full_name            VARCHAR(50) NOT NULL,
  client_email                VARCHAR(50) NOT NULL,
  client_number               VARCHAR(20) NOT NULL,
  CONSTRAINT test_drive_arrangements_pk_id PRIMARY KEY (id)

);

COMMENT ON COLUMN public.test_drive_arrangements.prefered_contact_address_id IS 'Prefered auto center address';


CREATE TABLE public.generic_texts (
  id            SERIAL      NOT NULL,
  photo_set_id  INTEGER,
  lang          VARCHAR(10) NOT NULL,
  text          TEXT        NOT NULL,
  internal_name VARCHAR(50) NOT NULL,
  CONSTRAINT generic_texts_pk_id PRIMARY KEY (id),
  CONSTRAINT generic_texts_unique_internal_name UNIQUE (internal_name)

);

COMMENT ON COLUMN public.generic_texts.lang IS 'Text language';


CREATE TABLE public.photos (
  id            SERIAL      NOT NULL,
  photo_set_id  INTEGER     NOT NULL,
  name          VARCHAR(50) NOT NULL,
  internal_name VARCHAR(50),
  mime_type     VARCHAR(20) NOT NULL DEFAULT 'image/*',
  image_small   BYTEA       NOT NULL,
  image_medium  BYTEA       NOT NULL,
  image_big     BYTEA       NOT NULL,
  CONSTRAINT photos_pk_id PRIMARY KEY (id)

);

COMMENT ON COLUMN public.photos.image_small IS 'Small version of image';


CREATE TABLE public.photo_sets (
  id            INTEGER NOT NULL,
  internal_name VARCHAR(50),
  CONSTRAINT photo_sets_pk_id PRIMARY KEY (id),
  CONSTRAINT photo_sets_unique_internal_name UNIQUE (internal_name)

);


ALTER TABLE public.news ADD CONSTRAINT news_photo_sets_fk FOREIGN KEY (photo_set_id)
REFERENCES public.photo_sets (id) MATCH FULL
ON DELETE CASCADE ON UPDATE NO ACTION;


ALTER TABLE public.offers ADD CONSTRAINT offers_photo_sets_fk FOREIGN KEY (photo_set_id)
REFERENCES public.photo_sets (id) MATCH FULL
ON DELETE CASCADE ON UPDATE NO ACTION;


ALTER TABLE public.models ADD CONSTRAINT models_model_ranges_fk FOREIGN KEY (model_range_id)
REFERENCES public.model_ranges (id) MATCH FULL
ON DELETE CASCADE ON UPDATE NO ACTION;


ALTER TABLE public.models ADD CONSTRAINT models_photo_sets_fk FOREIGN KEY (photo_set_id)
REFERENCES public.photo_sets (id) MATCH FULL
ON DELETE CASCADE ON UPDATE NO ACTION;


ALTER TABLE public.model_editions ADD CONSTRAINT model_editions_models_fk FOREIGN KEY (model_id)
REFERENCES public.models (id) MATCH FULL
ON DELETE CASCADE ON UPDATE NO ACTION;


ALTER TABLE public.contact_emails ADD CONSTRAINT contact_emails_contact_infos_fk FOREIGN KEY (contact_info_id)
REFERENCES public.contact_infos (id) MATCH FULL
ON DELETE CASCADE ON UPDATE NO ACTION;


ALTER TABLE public.contact_addresses ADD CONSTRAINT contact_addresses_contact_infos_fk FOREIGN KEY (contact_info_id)
REFERENCES public.contact_infos (id) MATCH FULL
ON DELETE CASCADE ON UPDATE NO ACTION;


ALTER TABLE public.contact_numbers ADD CONSTRAINT contact_numbers_contact_infos_fk FOREIGN KEY (contact_info_id)
REFERENCES public.contact_infos (id) MATCH FULL
ON DELETE CASCADE ON UPDATE NO ACTION;


ALTER TABLE public.test_drive_arrangements ADD CONSTRAINT test_drive_arrangements_model_editions_fk FOREIGN KEY (model_edition_id)
REFERENCES public.model_editions (id) MATCH FULL
ON DELETE CASCADE ON UPDATE NO ACTION;


ALTER TABLE public.test_drive_arrangements ADD CONSTRAINT test_drive_arrangements_contact_addresses_fk FOREIGN KEY (prefered_contact_address_id)
REFERENCES public.contact_addresses (id) MATCH FULL
ON DELETE CASCADE ON UPDATE NO ACTION;


ALTER TABLE public.generic_texts ADD CONSTRAINT generic_texts_photo_sets_fk FOREIGN KEY (photo_set_id)
REFERENCES public.photo_sets (id) MATCH FULL
ON DELETE CASCADE ON UPDATE NO ACTION;


ALTER TABLE public.photos ADD CONSTRAINT photos_photo_sets_fk FOREIGN KEY (photo_set_id)
REFERENCES public.photo_sets (id) MATCH FULL
ON DELETE CASCADE ON UPDATE NO ACTION;


# --- !Downs

DROP TABLE IF EXISTS public.managers CASCADE;

DROP TABLE IF EXISTS public.news CASCADE;

DROP TABLE IF EXISTS public.offers CASCADE;

DROP TABLE IF EXISTS public.models CASCADE;

DROP TYPE IF EXISTS public.engine_types CASCADE;

DROP TYPE IF EXISTS public.gearbox_types CASCADE;

DROP TYPE IF EXISTS public.transmission_types CASCADE;

DROP TABLE IF EXISTS public.model_editions CASCADE;

DROP TABLE IF EXISTS public.model_ranges CASCADE;

DROP TABLE IF EXISTS public.contact_infos CASCADE;

DROP TABLE IF EXISTS public.contact_emails CASCADE;

DROP TABLE IF EXISTS public.contact_addresses CASCADE;

DROP TABLE IF EXISTS public.contact_numbers CASCADE;

DROP TABLE IF EXISTS public.test_drive_arrangements CASCADE;

DROP TABLE IF EXISTS public.generic_texts CASCADE;

DROP TABLE IF EXISTS public.photos CASCADE;

DROP TABLE IF EXISTS public.photo_sets CASCADE;
