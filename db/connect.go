package db

import (
	"ecommerce-admin/models"
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Init() {
	dsn := "host=localhost user=admin password=admin123 dbname=ecommerce port=5432 sslmode=disable"

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Database connection error:", err)
	}

	// migrate
	err = DB.AutoMigrate(&models.Product{}, &models.User{})
	if err != nil {
		log.Fatal("Migration failed:", err)
	}

	fmt.Println("Database connected")
}
