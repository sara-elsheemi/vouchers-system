# Voucher System Configuration Map

## Project Overview
**Project Name**: Combined Voucher System  
**Architecture**: Single Docker Container (Frontend + Backend)  
**Technology Stack**: React (Frontend) + Go (Backend)  
**Database**: External MySQL (AWS RDS)

## Container Configuration

### Port Mapping
- **Host Port**: `3001`
- **Container Port**: `3001`
- **Protocol**: TCP
- **Access URL**: `http://localhost:3001`

### Docker Image Details
- **Image Name**: `vouchersystem-voucher-system`
- **Dockerfile**: `Dockerfile.combined`
- **Build Context**: Root directory (`.`)
- **Base Images**: 
  - Frontend Builder: `node:18-alpine`
  - Backend Builder: `golang:1.21-alpine`
  - Runtime: `alpine:latest`

## Environment Variables

### Database Configuration
```
DB_HOST=staging-jan-4-2023-cluster.cluster-cylpew54lkmg.eu-west-1.rds.amazonaws.com
DB_PORT=3306
DB_NAME=sc_voucher
DB_USER=sc_voucher_dbuser
DB_PASSWORD=fOGYrE$TEND!uNcen^dIVeN
```

### Application Configuration
```
PORT=3001
HOST=0.0.0.0
```

## API Endpoints

### Backend API Routes
- **Health Check**: `GET /health`
- **Webhooks**:
  - `POST /webhook/voucher-created`
  - `POST /webhook/voucher-purchased`
  - `POST /webhook/voucher-redeemed`
- **User Vouchers**: `GET /vouchers/{user_id}`

### Frontend Routes
- **Main Application**: `/` (requires `user_id` parameter)
- **Static Assets**: `/assets/*`, `/vite.svg`, etc.

## Frontend Configuration

### Supported URL Parameters
- `user_id` (required) - Numeric user identifier
- `lang` (optional) - Language code (`en`, `ar`)
- `theme` (optional) - Theme (`light`, `dark`)
- `token` (optional) - Authentication token
- `return_url` (optional) - Return URL for navigation

### Supported Languages
- **English**: `en` (default)
- **Arabic**: `ar` (with RTL support)

### Example URLs
```
http://localhost:3001/?user_id=98765
http://localhost:3001/?user_id=98765&lang=en
http://localhost:3001/?user_id=98765&lang=ar
http://localhost:3001/?user_id=98765&lang=en&theme=light
```

## Database Schema

### Tables
1. **vouchers** - Main voucher definitions
2. **voucher_purchases** - User purchase records
3. **migrations** - Database migration tracking

### Sample Data
- **Test User ID**: `98765`
- **Sample Vouchers**: 4 vouchers with various statuses

## File Structure

### Container File Layout
```
/root/
├── main                    # Go binary (backend)
├── static/                 # React build files (frontend)
│   ├── index.html
│   ├── assets/
│   └── ...
└── migrations/             # Database migration files
    ├── 001_create_vouchers_table.sql
    ├── 002_create_voucher_purchases_table.sql
    ├── 003_insert_sample_data.sql
    └── run_migrations.sh
```

## Build Configuration

### Multi-stage Build
1. **Frontend Builder**: Builds React app with Vite
2. **Backend Builder**: Compiles Go application
3. **Runtime**: Combines both in Alpine Linux

### Build Commands
```bash
# Build single container
make build-single

# Run single container
make run-single

# Check status
make status-single

# View logs
make logs-single

# Health check
make health-single
```

## Security Configuration

### Database Security
- **Connection**: SSL/TLS encrypted
- **Credentials**: Environment variables
- **Access**: Restricted to specific user

### Application Security
- **CORS**: Enabled for all origins
- **Headers**: Content-Type, Authorization
- **Static Files**: Served securely

## Monitoring & Health

### Health Check Endpoint
```json
GET /health
{
  "success": true,
  "message": "Voucher system is healthy",
  "data": {
    "service": "voucher-api",
    "status": "running"
  }
}
```

### Logging
- **Access Logs**: All HTTP requests
- **Error Logs**: Application errors
- **Database Logs**: Connection status

## Deployment Commands

### Docker Compose
```bash
# Start system
docker-compose -f docker-compose.single.yml up -d

# Stop system
docker-compose -f docker-compose.single.yml down

# Rebuild and restart
docker-compose -f docker-compose.single.yml up -d --build
```

### Makefile Commands
```bash
make build-single    # Build image
make run-single      # Start container
make stop-single     # Stop container
make clean-single    # Clean up
make logs-single     # View logs
make health-single   # Health check
make migrate-single  # Run database migrations
```

## Integration Points

### Android WebView Integration
- **User ID**: Passed via URL parameter
- **Language**: Detected from URL parameter
- **Return Navigation**: postMessage to parent
- **Supported Headers**: X-App-Version, X-User-Agent, X-Device-ID

### External Dependencies
- **MySQL Database**: AWS RDS instance
- **Image Assets**: Unsplash (external URLs)
- **Fonts**: Custom fonts (SakrPro family)

## Development vs Production

### Current Configuration
- **Environment**: Development/Testing
- **Database**: External AWS RDS (staging)
- **CORS**: Permissive (all origins)
- **Demo Mode**: Enabled

### Production Considerations
- **Database**: Production RDS instance
- **CORS**: Restricted origins
- **SSL/TLS**: HTTPS termination
- **Monitoring**: Enhanced logging and metrics

## Configuration Files

### Key Files
- `docker-compose.single.yml` - Container orchestration
- `Dockerfile.combined` - Image build instructions
- `web/src/config/app.config.ts` - Frontend configuration
- `backend/cmd/main_combined.go` - Backend application
- `migrations/` - Database schema and data

## Current Status
- **Container**: Running on port 3001
- **Database**: Connected to AWS RDS
- **Frontend**: React app served from Go backend
- **API**: Functional with sample data
- **Migration**: Ready to run (4 sample vouchers for user 98765) 