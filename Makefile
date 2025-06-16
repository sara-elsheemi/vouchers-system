# Voucher System Deployment Makefile

.PHONY: build run stop clean logs test

# Build all Docker images
build:
	docker-compose build --no-cache

# Build single combined image
build-single:
	docker-compose -f docker-compose.single.yml build --no-cache

# Run the entire application stack
run:
	docker-compose up -d

# Run single combined container
run-single:
	docker-compose -f docker-compose.single.yml up -d

# Stop all services
stop:
	docker-compose down

# Stop single container
stop-single:
	docker-compose -f docker-compose.single.yml down

# Clean up everything including volumes
clean:
	docker-compose down -v
	docker system prune -f

# Clean single container setup
clean-single:
	docker-compose -f docker-compose.single.yml down -v
	docker system prune -f

# View logs
logs:
	docker-compose logs -f

# View single container logs
logs-single:
	docker-compose -f docker-compose.single.yml logs -f

# View specific service logs
logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

# Check service status
status:
	docker-compose ps

# Check single container status
status-single:
	docker-compose -f docker-compose.single.yml ps

# Restart specific services
restart-backend:
	docker-compose restart backend

restart-frontend:
	docker-compose restart frontend

# Restart single container
restart-single:
	docker-compose -f docker-compose.single.yml restart voucher-system

# Production deployment
deploy-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Development with live reload
dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Health checks
health:
	@echo "Checking backend health..."
	@curl -f http://localhost:3001/health || echo "Backend unhealthy"
	@echo "Checking frontend..."
	@curl -f http://localhost/ || echo "Frontend unhealthy"

# Health check for single container
health-single:
	@echo "Checking combined system health..."
	@curl -f http://localhost:3001/health || echo "System unhealthy"
	@echo "Checking frontend..."
	@curl -f http://localhost:3001/ || echo "Frontend unhealthy"

# Database connection test (external MySQL)
test-db:
	@echo "Testing database connection..."
	@docker-compose exec backend /bin/sh -c 'echo "SELECT 1" | mysql -h$$DB_HOST -P$$DB_PORT -u$$DB_USER -p$$DB_PASSWORD $$DB_NAME' || echo "Database connection failed"

# Test database connection for single container
test-db-single:
	@echo "Testing database connection..."
	@docker-compose -f docker-compose.single.yml exec voucher-system /bin/sh -c 'echo "SELECT 1" | mysql -h$$DB_HOST -P$$DB_PORT -u$$DB_USER -p$$DB_PASSWORD $$DB_NAME' || echo "Database connection failed"

# Run database migrations (single container)
migrate-single:
	@echo "Running database migrations..."
	@docker-compose -f docker-compose.single.yml exec voucher-system /bin/sh -c 'export DB_PASSWORD="fOGYrE$$TEND!uNcen^dIVeN" && ./migrations/run_migrations.sh'