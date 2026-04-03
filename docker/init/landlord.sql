-- Landlord DB initialization
-- Enables the pgvector extension for future vector operations on master docs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;
