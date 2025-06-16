#!/bin/bash

# Database Migration Runner for Voucher System
# This script runs all migration files against the MySQL database

# Database connection details
DB_HOST="${DB_HOST:-staging-jan-4-2023-cluster.cluster-cylpew54lkmg.eu-west-1.rds.amazonaws.com}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-sc_voucher}"
DB_USER="${DB_USER:-sc_voucher_dbuser}"
DB_PASSWORD="${DB_PASSWORD}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Voucher System Database Migration Runner${NC}"
echo "================================================"

# Check if password is provided
if [ -z "$DB_PASSWORD" ]; then
    echo -e "${RED}Error: DB_PASSWORD environment variable is not set${NC}"
    echo "Please set your database password:"
    echo "export DB_PASSWORD='your_password_here'"
    exit 1
fi

# Check if mysql client is available
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}Error: mysql client is not installed${NC}"
    echo "Please install MySQL client to run migrations"
    exit 1
fi

# Test database connection
echo -e "${YELLOW}Testing database connection...${NC}"
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SELECT 1;" > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Cannot connect to database${NC}"
    echo "Please check your database credentials and network connectivity"
    exit 1
fi

echo -e "${GREEN}✓ Database connection successful${NC}"

# Create migrations table if it doesn't exist
echo -e "${YELLOW}Creating migrations tracking table...${NC}"
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" << EOF
CREATE TABLE IF NOT EXISTS schema_migrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    migration_name VARCHAR(255) NOT NULL UNIQUE,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
EOF

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Run migrations in order
for migration_file in "$SCRIPT_DIR"/*.sql; do
    if [ -f "$migration_file" ]; then
        migration_name=$(basename "$migration_file")
        
        # Check if migration has already been run
        already_run=$(mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -sN -e "SELECT COUNT(*) FROM schema_migrations WHERE migration_name = '$migration_name';")
        
        if [ "$already_run" -gt 0 ]; then
            echo -e "${YELLOW}⏭  Skipping $migration_name (already executed)${NC}"
            continue
        fi
        
        echo -e "${YELLOW}🔄 Running migration: $migration_name${NC}"
        
        # Run the migration
        mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$migration_file"
        
        if [ $? -eq 0 ]; then
            # Record successful migration
            mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "INSERT INTO schema_migrations (migration_name) VALUES ('$migration_name');"
            echo -e "${GREEN}✓ Migration $migration_name completed successfully${NC}"
        else
            echo -e "${RED}✗ Migration $migration_name failed${NC}"
            exit 1
        fi
    fi
done

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}All migrations completed successfully!${NC}"
echo -e "${GREEN}Your voucher system database is ready to use.${NC}" 