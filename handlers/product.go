package handlers

import (
	"ecommerce-admin/db"
	"ecommerce-admin/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetProducts(c *gin.Context) {
	search := c.Query("search")
	category := c.Query("category")
	stock := c.Query("stock")

	userID, exists := c.MustGet("user_id").(int64)
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User does not exists"})
		return
	}

	var products []models.Product
	query := db.DB.Model(&products)

	if search != "" {
		query = query.Where("name ILIKE ?", "%"+search+"%")
	}

	if category != "" {
		query = query.Where("category = ?", category)
	}

	if stock == "in" {
		query = query.Where("stock > 0")
	} else if stock == "out" {
		query = query.Where("stock = 0")
	}

	if err := query.Where("user_id = ?", userID).Find(&products).Error; err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, products)
}

func CreateProduct(c *gin.Context) {
	//var product models.Product
	var req models.CreateProductRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, exists := c.MustGet("user_id").(int64)
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User does not exists"})
		return
	}

	product := models.Product{
		Name:        req.Name,
		Description: req.Description,
		Price:       int64(req.Price),
		Stock:       req.Stock,
		Category:    req.Category,
		ImageUrl:    req.ImageUrl,
		UserID:      userID,
	}
	//db.DB.Create(&req)
	if err := db.DB.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
		return
	}
	c.JSON(http.StatusCreated, product.ID)
}

func UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product

	if err := db.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}
	var input models.Product
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	product.Name = input.Name
	product.Description = input.Description
	product.Stock = input.Stock
	product.Category = input.Category
	product.Price = input.Price
	if input.ImageUrl != "" {
		product.ImageUrl = input.ImageUrl
	}

	if err := db.DB.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "cannot update product"})
		return
	}

	// if err := c.ShouldBindJSON(&product); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 	return
	// }

	db.DB.Save(&product)
	c.JSON(http.StatusOK, product)
}

func DeleteProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product
	if err := db.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}
	db.DB.Delete(&product)
	c.Status(http.StatusNoContent)
}
