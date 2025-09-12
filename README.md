# Ecommerce-admin

# Project Overview

This is an e-commerce admin dashboard designed for efficient product management. 
It allows administrators to easily create, update, and delete products, manage stock levels, 
and oversee overall inventory in a user-friendly interface.


## Features

- **User Authentication:** Secure login with JWT token-based authentication.  
- **Product Management:** Create, update, and delete products easily.
- **Upload Product Image:** With MinIO(similar s3)
- **Stock Control:** Monitor and update product stock levels.  
- **Inventory Overview:** Get a clear view of the overall inventory.  
- **Filtering & Search:** Quickly find products with search and filter options.  
- **User-Friendly Interface:** Intuitive design for smooth administration experience.



The following steps for the compilation of the project

**Minio Up**
  sudo docker run -p 9100:9000 -p 9101:9090   -e "MINIO_ROOT_USER=miniouser"   -e "MINIO_ROOT_PASSWORD=miniopassword"   quay.io/minio/minio server /data --console-address ":9090"

**Go build**
  go run ./main.go

**FE**
  npm start
