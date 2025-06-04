package config

import (
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

// Config holds all configuration values
type Config struct {
	Database DatabaseConfig
	Server   ServerConfig
}

// DatabaseConfig holds database configuration
type DatabaseConfig struct {
	URL      string
	Host     string
	Port     string
	User     string
	Password string
	Database string
}

// ServerConfig holds server configuration
type ServerConfig struct {
	Port string
	Host string
}

// Load loads configuration from environment variables
func Load() (*Config, error) {
	// Load .env file if it exists (optional)
	_ = godotenv.Load()

	config := &Config{
		Database: DatabaseConfig{
			URL:      getEnv("DATABASE_URL", ""),
			Host:     getEnv("PGHOST", "localhost"),
			Port:     getEnv("PGPORT", "5432"),
			User:     getEnv("PGUSER", "postgres"),
			Password: getEnv("PGPASSWORD", ""),
			Database: getEnv("PGDATABASE", "postgres"),
		},
		Server: ServerConfig{
			Port: getEnv("PORT", "5000"),
			Host: getEnv("HOST", "0.0.0.0"),
		},
	}

	return config, nil
}

// getEnv gets an environment variable with a default value
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// getEnvAsInt gets an environment variable as integer with a default value
func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}