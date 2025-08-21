package main

import (
	"ecommerce-admin/db"
	"ecommerce-admin/handlers"
	"ecommerce-admin/middleware"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// veritabanı bağlantısı
	db.Init()

	r.POST("/register", handlers.Register)
	r.POST("/login", handlers.Login)

	// Auth gerekli gruplar

	protected := r.Group("/", middleware.AuthRequired())
	{
		protected.GET("/products", handlers.GetProducts)
		protected.POST("/products", handlers.CreateProduct)
		protected.PUT("/products/:id", handlers.UpdateProduct)
		protected.DELETE("/products/:id", handlers.DeleteProduct)
	}

	r.Run(":8080")
}
