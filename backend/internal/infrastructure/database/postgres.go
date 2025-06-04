package database

import (
        "database/sql"
        "fmt"

        "4SaleBackendSkeleton/internal/infrastructure/config"
        _ "github.com/lib/pq"
)

// PostgresDB wraps the database connection
type PostgresDB struct {
        DB *sql.DB
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

        db, err := sql.Open("postgres", connString)
        if err != nil {
                return nil, fmt.Errorf("failed to open database: %w", err)
        }

        // Test the connection
        if err := db.Ping(); err != nil {
                return nil, fmt.Errorf("failed to ping database: %w", err)
        }

        return &PostgresDB{DB: db}, nil
}

// Close closes the database connection
func (db *PostgresDB) Close() {
        if db.DB != nil {
                db.DB.Close()
        }
}