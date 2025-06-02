# 4SaleBackendSkeleton

A production-ready Go backend project skeleton built with hexagonal/clean architecture principles.

## 🏗️ Project Structure

```
backend/
├── cmd/                 # Application entrypoints
│   └── main.go         # Main application entry point
├── internal/           # Private application code
├── pkg/                # Public packages (reusable libraries)
├── configs/            # Configuration files and templates
├── api/                # API definitions (OpenAPI/Swagger specs)
├── scripts/            # Build and utility scripts
├── docs/               # Documentation
├── test/               # External test data and utilities
├── go.mod              # Go module definition
├── go.sum              # Go module checksums
└── README.md           # This file
```

## 🚀 How to Run

### Option 1: Using Replit's Run Button
Simply click the "Run" button in Replit. This will automatically:
- Initialize the Go module
- Tidy dependencies
- Start the server on port 5000

### Option 2: Manual Execution
```bash
cd backend
go mod tidy
go run cmd/main.go
```

## 📡 Available Endpoints

- `GET /` - Root endpoint with status message
- `GET /health` - Health check endpoint

## 🏗️ How to Extend

1. **Add Business Logic**: Place domain logic in the `internal/` directory
2. **Add Public Packages**: Create reusable packages in `pkg/`
3. **Add Configuration**: Place config files in `configs/`
4. **Add API Definitions**: Place OpenAPI/Swagger specs in `api/`
5. **Add Documentation**: Place additional docs in `docs/`
6. **Add Scripts**: Place build/test scripts in `scripts/`

## 📝 Architecture Notes

This skeleton follows hexagonal (ports and adapters) architecture principles:
- Clear separation of concerns
- Dependency inversion
- Testable and maintainable code structure
- Ready for clean architecture implementation

## 🔧 Next Steps

The skeleton is ready for development. Add your business logic, configure dependencies, and implement your application features following Go best practices.

