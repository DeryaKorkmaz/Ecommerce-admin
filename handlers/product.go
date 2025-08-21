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

    if err := query.Find(&products).Error; err != nil {
        c.JSON(500, gin.H{"error": err.Error()})
        return
    }
	//db.DB.Find(&products)
	c.JSON(http.StatusOK, products)
}

func CreateProduct(c *gin.Context) {
	//var product models.Product
	var req models.CreateProductRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	product := models.Product{
		Name:        req.Name,
		Description: req.Description,
		Price:       int(req.Price),
		Stock:       req.Stock,
	}
	//db.DB.Create(&req)
	if err := db.DB.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
		return
	}
	c.JSON(http.StatusCreated, req)
}

func UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product

	if err := db.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

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
