# Voucher System Deployment Makefile

.PHONY: build run stop clean logs test

# Build all Docker images
build:
	docker-compose build --no-cache

# Run the entire application stack
run:
	docker-compose up -d

# Stop all services
stop:
	docker-compose down

# Clean up everything including volumes
clean:
	docker-compose down -v
	docker system prune -f

# View logs
logs:
	docker-compose logs -f

# View specific service logs
logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-db:
	docker-compose logs -f postgres

# Check service status
status:
	docker-compose ps

# Restart specific services
restart-backend:
	docker-compose restart backend

restart-frontend:
	docker-compose restart frontend

# Production deployment
deploy-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Development with live reload
dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Database operations
db-backup:
	docker-compose exec postgres pg_dump -U postgres voucher_system > backup.sql

db-restore:
	docker-compose exec -T postgres psql -U postgres voucher_system < backup.sql

# Health checks
health:
	@echo "Checking backend health..."
	@curl -f http://localhost:5000/health || echo "Backend unhealthy"
	@echo "Checking frontend..."
	@curl -f http://localhost/ || echo "Frontend unhealthy"