package logger

import (
	"os"

	"github.com/rs/zerolog"
)

// NewLogger creates a new structured logger
func NewLogger() zerolog.Logger {
	// Configure zerolog
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix

	// Create logger with console writer for better readability
	logger := zerolog.New(os.Stdout).
		With().
		Timestamp().
		Caller().
		Logger()

	// Set log level based on environment
	if os.Getenv("LOG_LEVEL") == "debug" {
		zerolog.SetGlobalLevel(zerolog.DebugLevel)
	} else {
		zerolog.SetGlobalLevel(zerolog.InfoLevel)
	}

	return logger
}