BEGIN;

CREATE TABLE IF NOT EXISTS travel_companions (
    id BIGSERIAL PRIMARY KEY,
    voyage_id BIGINT NOT NULL REFERENCES voyages(id) ON DELETE CASCADE,
    traveler1 VARCHAR(255) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    traveler2 VARCHAR(255) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    conversation_event_id BIGINT NOT NULL UNIQUE REFERENCES events(id) ON DELETE CASCADE,
    created_by VARCHAR(255) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_travel_companions_distinct_users CHECK (traveler1 <> traveler2),
    CONSTRAINT uq_travel_companions_pair UNIQUE (voyage_id, traveler1, traveler2)
);

CREATE INDEX IF NOT EXISTS idx_travel_companions_traveler1
    ON travel_companions (traveler1);

CREATE INDEX IF NOT EXISTS idx_travel_companions_traveler2
    ON travel_companions (traveler2);

COMMIT;
