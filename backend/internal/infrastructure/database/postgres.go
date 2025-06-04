package database

import (
	"context"
	"fmt"

	"4SaleBackendSkeleton/internal/infrastructure/config"
	"github.com/jackc/pgx/v5/pgxpool"
)

// PostgresDB wraps the database connection
type PostgresDB struct {
	Pool *pgxpool.Pool
}

// NewPostgresDB creates a new PostgreSQL database connection
func NewPostgresDB(cfg *config.Config) (*PostgresDB, error) {
	var connString string
	
	if cfg.Database.URL != "" {
		connString = cfg.Database.URL
	} else {
		connString = fmt.Sprintf(
			"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
			cfg.Database.Host,
			cfg.Database.Port,
			cfg.Database.User,
			cfg.Database.Password,
			cfg.Database.Database,
		)
	}

	pool, err := pgxpool.New(context.Background(), connString)
	if err != nil {
		return nil, fmt.Errorf("failed to create connection pool: %w", err)
	}

	// Test the connection
	if err := pool.Ping(context.Background()); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return &PostgresDB{Pool: pool}, nil
}

// Close closes the database connection
func (db *PostgresDB) Close() {
	if db.Pool != nil {
		db.Pool.Close()
	}
}