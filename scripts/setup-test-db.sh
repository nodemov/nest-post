#!/bin/bash

# === CONFIGURATION ===
SOURCE_HOST="127.0.0.1"
SOURCE_PORT="5432"
SOURCE_USER="postgres"
SOURCE_DB="nest_posts"

TEST_HOST="127.0.0.1"
TEST_PORT="5432"
TEST_USER="postgres"
TEST_DB="nest_posts_e2e_test"

# DBngin PostgreSQL paths
PG_DUMP_PATH="/Users/Shared/DBngin/postgresql/16.4/bin/pg_dump"
PSQL_PATH="/Users/Shared/DBngin/postgresql/16.4/bin/psql"

# Backup configuration
BACKUP_DIR="$(dirname "$0")/../backup"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/nest_posts_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

echo "🔹 Setting up test database '${TEST_DB}'..."

# === STEP 1: DUMP SOURCE DATABASE ===
echo "🔹 Backing up database '${SOURCE_DB}'..."
PGPASSWORD="" "${PG_DUMP_PATH}" \
  --host="${SOURCE_HOST}" \
  --port="${SOURCE_PORT}" \
  --username="${SOURCE_USER}" \
  --file="${BACKUP_FILE}" \
  --format=plain \
  --no-owner \
  --no-acl \
  --encoding="UTF8" \
  "${SOURCE_DB}" 2>/dev/null

if [ $? -ne 0 ]; then
  echo "❌ Backup failed. Exiting."
  exit 1
fi

echo "✅ Backup complete"

# === STEP 2: DROP & CREATE TEST DATABASE ===
echo "🔹 Recreating test database '${TEST_DB}'..."

# Terminate all connections to the test database first
PGPASSWORD="" "${PSQL_PATH}" \
  --host="${TEST_HOST}" \
  --port="${TEST_PORT}" \
  --username="${TEST_USER}" \
  --dbname="postgres" \
  --quiet \
  --command="SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '${TEST_DB}' AND pid <> pg_backend_pid();" 2>/dev/null

# Drop the database
PGPASSWORD="" "${PSQL_PATH}" \
  --host="${TEST_HOST}" \
  --port="${TEST_PORT}" \
  --username="${TEST_USER}" \
  --dbname="postgres" \
  --quiet \
  --command="DROP DATABASE IF EXISTS ${TEST_DB};" 2>/dev/null

# Create the database
PGPASSWORD="" "${PSQL_PATH}" \
  --host="${TEST_HOST}" \
  --port="${TEST_PORT}" \
  --username="${TEST_USER}" \
  --dbname="postgres" \
  --quiet \
  --command="CREATE DATABASE ${TEST_DB} WITH ENCODING 'UTF8';" 2>/dev/null

if [ $? -ne 0 ]; then
  echo "❌ Failed to create test database."
  exit 1
fi

echo "✅ Test database recreated"

# === STEP 3: RESTORE DUMP TO TEST DATABASE ===
echo "🔹 Restoring data into test database '${TEST_DB}'..."
PGPASSWORD="" "${PSQL_PATH}" \
  --host="${TEST_HOST}" \
  --port="${TEST_PORT}" \
  --username="${TEST_USER}" \
  --dbname="${TEST_DB}" \
  --quiet \
  --file="${BACKUP_FILE}" 2>/dev/null

if [ $? -ne 0 ]; then
  echo "❌ Restore failed."
  exit 1
fi

echo "✅ Test database setup completed successfully"
echo "📁 Backup saved to: ${BACKUP_FILE}"
echo ""
