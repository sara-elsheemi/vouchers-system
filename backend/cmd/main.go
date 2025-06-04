package main

import (
        "log"

        "4SaleBackendSkeleton/internal/app"
)

func main() {
        // Create and run the voucher system application
        application, err := app.NewApp()
        if err != nil {
                log.Fatalf("Failed to create application: %v", err)
        }

        if err := application.Run(); err != nil {
                log.Fatalf("Failed to run application: %v", err)
        }
}
