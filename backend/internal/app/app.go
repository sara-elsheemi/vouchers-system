package app

import (
        "context"
        "fmt"
        "net/http"
        "os"
        "os/signal"
        "syscall"
        "time"

        "4SaleBackendSkeleton/internal/adapters/handlers"
        "4SaleBackendSkeleton/internal/adapters/repository"
        "4SaleBackendSkeleton/internal/application/services"
        "4SaleBackendSkeleton/internal/infrastructure/config"
        "4SaleBackendSkeleton/internal/infrastructure/database"
        "4SaleBackendSkeleton/internal/infrastructure/logger"
        "4SaleBackendSkeleton/internal/infrastructure/qr"
        "github.com/rs/zerolog"
)

// App represents the main application
type App struct {
        config *config.Config
        db     *database.PostgresDB
        server *http.Server
        logger zerolog.Logger
}

// NewApp creates a new application instance
func NewApp() (*App, error) {
        // Load configuration
        cfg, err := config.Load()
        if err != nil {
                return nil, fmt.Errorf("failed to load config: %w", err)
        }

        // Initialize logger
        log := logger.NewLogger()

        // Initialize database
        db, err := database.NewPostgresDB(cfg)
        if err != nil {
                return nil, fmt.Errorf("failed to initialize database: %w", err)
        }

        return &App{
                config: cfg,
                db:     db,
                logger: log,
        }, nil
}

// Run starts the application
func (a *App) Run() error {
        // Initialize dependencies
        qrGenerator := qr.NewQRGenerator()

        // Initialize repositories
        voucherRepo := repository.NewVoucherRepository(a.db)
        voucherPurchaseRepo := repository.NewVoucherPurchaseRepositorySQL(a.db)

        // Initialize services
        voucherService := services.NewVoucherService(voucherRepo, voucherPurchaseRepo, qrGenerator)

        // Initialize handlers
        voucherHandler := handlers.NewVoucherHandler(voucherService, a.logger)

        // Initialize router
        router := handlers.NewRouter(voucherHandler, a.logger)
        routes := router.SetupRoutes()

        // Create HTTP server
        a.server = &http.Server{
                Addr:         fmt.Sprintf("%s:%s", a.config.Server.Host, a.config.Server.Port),
                Handler:      routes,
                ReadTimeout:  15 * time.Second,
                WriteTimeout: 15 * time.Second,
                IdleTimeout:  60 * time.Second,
        }

        // Start server in a goroutine
        go func() {
                a.logger.Info().
                        Str("host", a.config.Server.Host).
                        Str("port", a.config.Server.Port).
                        Msg("Starting HTTP server")

                if err := a.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
                        a.logger.Fatal().Err(err).Msg("Failed to start server")
                }
        }()

        a.logger.Info().Msg("Voucher system started successfully")

        // Wait for interrupt signal to gracefully shutdown
        quit := make(chan os.Signal, 1)
        signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
        <-quit

        a.logger.Info().Msg("Shutting down server...")

        // Graceful shutdown
        return a.Shutdown()
}

// Shutdown gracefully shuts down the application
func (a *App) Shutdown() error {
        ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
        defer cancel()

        // Shutdown HTTP server
        if err := a.server.Shutdown(ctx); err != nil {
                a.logger.Error().Err(err).Msg("Server forced to shutdown")
                return err
        }

        // Close database connection
        if a.db != nil {
                a.db.Close()
        }

        a.logger.Info().Msg("Server exited")
        return nil
}