# Voucher System Database Migrations

This directory contains MySQL migration files to set up the voucher system database schema.

## Migration Files

1. **001_create_vouchers_table.sql** - Creates the main vouchers table
2. **002_create_voucher_purchases_table.sql** - Creates the voucher purchases table with foreign keys
3. **003_insert_sample_data.sql** - Inserts sample data for testing (optional)

## Prerequisites

- MySQL client installed on your system
- Access to the MySQL database
- Database credentials (host, port, username, password, database name)

## Running Migrations

### Option 1: Using the Migration Runner Script (Recommended)

1. Make the script executable:
   ```bash
   chmod +x migrations/run_migrations.sh
   ```

2. Set your database password:
   ```bash
   export DB_PASSWORD='your_database_password_here'
   ```

3. Run the migrations:
   ```bash
   ./migrations/run_migrations.sh
   ```

### Option 2: Manual Migration

If you prefer to run migrations manually, execute each file in order:

```bash
# Set your database credentials
DB_HOST="staging-jan-4-2023-cluster.cluster-cylpew54lkmg.eu-west-1.rds.amazonaws.com"
DB_PORT="3306"
DB_NAME="sc_voucher"
DB_USER="sc_voucher_dbuser"
DB_PASSWORD="your_password_here"

# Run each migration in order
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < migrations/001_create_vouchers_table.sql
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < migrations/002_create_voucher_purchases_table.sql
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < migrations/003_insert_sample_data.sql
```

### Option 3: Using Docker (if MySQL client not available locally)

```bash
# Run migrations from within the backend container
docker-compose exec backend sh -c "
export DB_PASSWORD='your_password_here'
./migrations/run_migrations.sh
"
```

## Database Schema

After running migrations, your database will have:

### Tables
- `vouchers` - Main vouchers table
- `voucher_purchases` - User purchases of vouchers
- `schema_migrations` - Tracks which migrations have been run

### Indexes
- Performance indexes on user_id, buyer_id, status, and timestamp fields
- Foreign key relationships between vouchers and purchases

## Environment Variables

The migration script uses these environment variables with defaults:

- `DB_HOST` - Database host (default: staging-jan-4-2023-cluster.cluster-cylpew54lkmg.eu-west-1.rds.amazonaws.com)
- `DB_PORT` - Database port (default: 3306)
- `DB_NAME` - Database name (default: sc_voucher)
- `DB_USER` - Database user (default: sc_voucher_dbuser)
- `DB_PASSWORD` - Database password (required, no default)

## Verification

After running migrations, you can verify the setup:

```bash
# Check tables were created
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SHOW TABLES;"

# Check sample data was inserted
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SELECT COUNT(*) as voucher_count FROM vouchers;"
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SELECT COUNT(*) as purchase_count FROM voucher_purchases;"
```

## Troubleshooting

### Connection Issues
- Verify your database credentials
- Check network connectivity to the database host
- Ensure your IP is whitelisted in the database security group

### Permission Issues
- Ensure your database user has CREATE, INSERT, and SELECT permissions
- Check if the database name exists and is accessible

### Migration Already Run
The migration runner tracks completed migrations and will skip already executed ones. To force re-run a migration, remove its entry from the `schema_migrations` table.

## Sample Data

The sample data includes:
- 4 sample vouchers for user_id 98765
- 4 corresponding purchases (3 active, 1 redeemed)
- Ready-to-test QR codes and realistic descriptions

You can modify or skip the sample data migration if not needed for your environment. 