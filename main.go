package main

import (
	"ecommerce-admin/config"
	"ecommerce-admin/db"
	"ecommerce-admin/handlers"
	"ecommerce-admin/handlers/storage"
	"ecommerce-admin/middleware"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.LoadConfig()
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.Cors.AllowOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// MinIO client
	minioClient := storage.NewMinIO(cfg.MinIO.Endpoint, cfg.MinIO.AccessKeyID, cfg.MinIO.SecretAccessKey, cfg.MinIO.Bucket, cfg.MinIO.UseSSL)
	// Upload handler
	uploadHandler := handlers.NewUploadHandler(minioClient)

	// veritabanı bağlantısı
	db.Init(cfg)

	r.POST("/register", handlers.Register)
	r.POST("/login", handlers.Login)

	// Auth gerekli gruplar

	protected := r.Group("/", middleware.AuthRequired())
	{
		protected.GET("/products", handlers.GetProducts)
		protected.POST("/products", handlers.CreateProduct)
		protected.PUT("/products/:id", handlers.UpdateProduct)
		protected.DELETE("/products/:id", handlers.DeleteProduct)
		protected.POST("/uploadimage", uploadHandler.Upload)

	}

	r.Run(cfg.Server.Port)
}
