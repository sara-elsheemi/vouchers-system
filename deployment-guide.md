# 4Sale Voucher System Deployment Guide

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Minimum 2GB RAM
- Ports 80, 5000, and 5432 available

### 1. Build and Deploy
```bash
# Clone/download the project files
# Navigate to project directory

# Build all services
make build

# Start the application
make run

# Check status
make status
```

### 2. Access the Application
- **Frontend (WebView)**: http://localhost
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

### 3. Test the System
```bash
# Check backend health
curl http://localhost:5000/health

# Get test vouchers for user 98765
curl http://localhost:5000/vouchers/98765
```

## Production Deployment

### Environment Variables
Create a `.env` file:
```env
DB_HOST=staging-jan-4-2023-cluster.cluster-cylpew54lkmg.eu-west-1.rds.amazonaws.com
DB_PORT=3306
DB_NAME=sc_voucher
DB_USER=sc_voucher_dbuser
DB_PASSWORD=your_secure_password_here
```

### Deploy to Production
```bash
# Set environment variables
export DB_PASSWORD=your_secure_password_here

# Deploy with production configuration
make deploy-prod
```

## API Endpoints

### Health Check
```
GET /health
```

### WebView API
```
GET /vouchers/{user_id}
```

### Webhook Endpoints
```
POST /webhook/voucher-created
POST /webhook/voucher-purchased  
POST /webhook/voucher-redeemed
```

## Database Schema

### Tables
- `vouchers`: Core voucher information
- `voucher_purchases`: User purchase records with QR codes

### Sample Data
The system includes 4 test vouchers for user ID `98765`:
- 30% Off Electronics ($25.00) - Active
- Free Shipping on Orders $50+ ($10.00) - Active  
- $20 Off Fashion Items ($20.00) - Redeemed
- Buy 2 Get 1 Free Books ($15.00) - Active

## Architecture

### Backend (Go)
- **Port**: 5000
- **Architecture**: Hexagonal (Ports & Adapters)
- **Database**: MySQL (AWS RDS) with connection pooling
- **Features**: CORS enabled, structured logging, health checks

### Frontend (React)
- **Port**: 80 (Nginx)
- **Architecture**: Onion Architecture
- **Features**: TypeScript, Tailwind CSS, shimmer loading effects
- **Mobile**: WebView optimized with responsive design

### Database (MySQL)
- **Port**: 3306
- **Version**: External AWS RDS
- **Features**: UUID support, indexed queries, sample data

## Management Commands

```bash
# View logs
make logs

# Stop services
make stop

# Clean everything
make clean

# Backup database
make db-backup

# Health check
make health
```

## Container Images

The deployment creates three optimized Docker images:

1. **Backend**: Multi-stage Go build (Alpine-based, ~15MB)
2. **Frontend**: React build with Nginx (Alpine-based, ~25MB) 
3. **Database**: External MySQL (AWS RDS)

## Security Features

- CORS properly configured
- Security headers in Nginx
- Database with secure defaults
- Container isolation
- Health check endpoints

## Troubleshooting

### Common Issues

**Frontend shows "Failed to fetch"**
- Check backend service: `docker-compose logs backend`
- Verify database connection: `make health`

**Database connection issues**
- Test database connection: `make test-db`
- Verify DATABASE_URL environment variable

**Port conflicts**
- Modify ports in docker-compose.yml if needed
- Default ports: 80 (frontend), 5000 (backend), 5432 (database)

### Debug Commands
```bash
# Enter backend container
docker-compose exec backend sh

# Enter database
mysql -h staging-jan-4-2023-cluster.cluster-cylpew54lkmg.eu-west-1.rds.amazonaws.com -P 3306 -u sc_voucher_dbuser -p sc_voucher

# View detailed logs
docker-compose logs -f --tail=50 backend
```

## Scaling

For production scaling:
- Use external MySQL (AWS RDS, Google Cloud SQL)
- Deploy frontend to CDN
- Use load balancer for backend API
- Configure horizontal pod autoscaling in Kubernetes

## Monitoring

Health check endpoints available:
- Backend health: `GET /health`
- Database queries logged with timing
- Nginx access logs for frontend requests