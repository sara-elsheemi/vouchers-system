package main

import (
        "fmt"
        "log"
        "net/http"
        "os"
)

// main is the entry point of the 4SaleBackendSkeleton application
func main() {
        // Print welcome message
        fmt.Println("Hello, World!")
        fmt.Println("4SaleBackendSkeleton is starting...")

        // Get port from environment variable, default to 5000 for Replit compatibility
        port := os.Getenv("PORT")
        if port == "" {
                port = "5000"
        }

        // Create a simple HTTP handler for health check
        http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
                w.Header().Set("Content-Type", "application/json")
                w.WriteHeader(http.StatusOK)
                fmt.Fprintf(w, `{"message": "4SaleBackendSkeleton is running", "status": "ok"}`)
        })

        http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
                w.Header().Set("Content-Type", "application/json")
                w.WriteHeader(http.StatusOK)
                fmt.Fprintf(w, `{"status": "healthy"}`)
        })

        // Start the HTTP server
        fmt.Printf("Server starting on port %s...\n", port)
        fmt.Printf("Health check available at: http://0.0.0.0:%s/health\n", port)
        
        if err := http.ListenAndServe("0.0.0.0:"+port, nil); err != nil {
                log.Fatalf("Server failed to start: %v", err)
        }
}
