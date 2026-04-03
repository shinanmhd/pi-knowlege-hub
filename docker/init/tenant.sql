-- Tenant DB initialization
-- Enables pgvector for semantic search (RAG) within each tenant's private database
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;
