package models

type Product struct {
	ID          int64  `gorm:"primaryKey" json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Price       int64  `json:"price"`
	Stock       int    `json:"stock"`
	Category    string `json:"category"`
	ImageUrl    string `json:"image_url"`
}
