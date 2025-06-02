package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

// main is a wrapper to run the backend application from the root directory
// This ensures compatibility with Replit's "Run" button
func main() {
	fmt.Println("4SaleBackendSkeleton Launcher")
	fmt.Println("==============================")
	
	// Change to backend directory
	backendDir := "backend"
	if err := os.Chdir(backendDir); err != nil {
		fmt.Printf("Error: Could not change to backend directory: %v\n", err)
		os.Exit(1)
	}
	
	// Get current working directory for logging
	pwd, _ := os.Getwd()
	fmt.Printf("Running from: %s\n", pwd)
	
	// Ensure go.mod is properly initialized
	if _, err := os.Stat("go.mod"); os.IsNotExist(err) {
		fmt.Println("Initializing Go module...")
		cmd := exec.Command("go", "mod", "init", "4SaleBackendSkeleton")
		if output, err := cmd.CombinedOutput(); err != nil {
			fmt.Printf("Error initializing module: %v\nOutput: %s\n", err, output)
		}
	}
	
	// Tidy dependencies
	fmt.Println("Tidying Go modules...")
	tidyCmd := exec.Command("go", "mod", "tidy")
	if output, err := tidyCmd.CombinedOutput(); err != nil {
		fmt.Printf("Warning: Could not tidy modules: %v\nOutput: %s\n", err, output)
	}
	
	// Run the main application
	fmt.Println("Starting 4SaleBackendSkeleton...")
	fmt.Println("==============================")
	
	// Find the main.go file in cmd directory
	mainFile := filepath.Join("cmd", "main.go")
	
	// Execute the Go application
	cmd := exec.Command("go", "run", mainFile)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin
	
	if err := cmd.Run(); err != nil {
		fmt.Printf("Error running application: %v\n", err)
		os.Exit(1)
	}
}
