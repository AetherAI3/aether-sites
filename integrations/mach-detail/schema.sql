-- PROPOSED PostgreSQL reference, not an applied migration.
-- Application roles, encryption keys, retention, RLS and migrations must be
-- integrated with the actual Aether Cloud data service before deployment.
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE TABLE mach_requests (
  id uuid PRIMARY KEY,
  shop_id uuid NOT NULL,
  idempotency_key uuid NOT NULL,
  payload_hash text NOT NULL,
  contact_ciphertext bytea NOT NULL,
  service text NOT NULL CHECK (service IN ('standard','correction','ceramic','advice')),
  preferred_date date NOT NULL,
  arrival_preference text NOT NULL CHECK (arrival_preference IN ('flexible','morning','afternoon')),
  status text NOT NULL DEFAULT 'requested' CHECK (status IN ('requested','confirmed','declined','cancelled')),
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(shop_id,idempotency_key),
  UNIQUE(shop_id,id)
);
CREATE TABLE mach_bays (
  shop_id uuid NOT NULL,
  id uuid NOT NULL,
  name text NOT NULL,
  PRIMARY KEY(shop_id,id)
);
CREATE TABLE mach_appointments (
  id uuid PRIMARY KEY,
  shop_id uuid NOT NULL,
  request_id uuid NOT NULL,
  bay_id uuid NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('held','confirmed','cancelled','expired')),
  hold_expires_at timestamptz,
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  CHECK (ends_at > starts_at),
  CHECK (status <> 'held' OR hold_expires_at IS NOT NULL),
  FOREIGN KEY(shop_id,request_id) REFERENCES mach_requests(shop_id,id),
  FOREIGN KEY(shop_id,bay_id) REFERENCES mach_bays(shop_id,id),
  UNIQUE(shop_id,id),
  EXCLUDE USING gist (shop_id WITH =, bay_id WITH =, tstzrange(starts_at,ends_at,'[)') WITH &&)
    WHERE (status IN ('held','confirmed'))
);
CREATE UNIQUE INDEX mach_one_active_appointment_per_request
  ON mach_appointments(shop_id,request_id) WHERE status IN ('held','confirmed');
CREATE TABLE mach_outbox (
  id uuid PRIMARY KEY,
  shop_id uuid NOT NULL,
  request_id uuid NOT NULL,
  appointment_id uuid,
  event_key text NOT NULL,
  appointment_version integer,
  event_type text NOT NULL CHECK (event_type IN ('request_received','appointment_confirmed','reminder','cancelled','rescheduled')),
  state text NOT NULL DEFAULT 'pending' CHECK (state IN ('pending','claimed','provider_accepted','delivered','failed','cancelled')),
  not_before timestamptz NOT NULL DEFAULT now(),
  lease_until timestamptz,
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  provider_message_id text,
  last_error_category text,
  FOREIGN KEY(shop_id,request_id) REFERENCES mach_requests(shop_id,id),
  FOREIGN KEY(shop_id,appointment_id) REFERENCES mach_appointments(shop_id,id),
  UNIQUE(shop_id,event_key)
);
-- Production: deny browser/anonymous DB access. Only API/worker roles granted.
-- RLS and cross-shop isolation are required activation work, not supplied here.
