package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"ecommerce-admin/handlers/storage"
)

type UploadHandler struct {
	Storage *storage.MinIOClient
}

func NewUploadHandler(storage *storage.MinIOClient) *UploadHandler {
	return &UploadHandler{Storage: storage}
}

func (h *UploadHandler) Upload(c *gin.Context) {
	file, fileHeader, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file is required"})
		return
	}

	url, err := h.Storage.UploadFile(file, fileHeader)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "upload failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"url": url})
}
