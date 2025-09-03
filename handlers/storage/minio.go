package storage

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"mime/multipart"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type MinIOClient struct {
	Client *minio.Client
	Bucket string
}

func NewMinIO(endpoint, accessKey, secretKey, bucket string, useSSL bool) *MinIOClient {
	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		log.Fatalf("MinIO connection failed: %v", err)
	}

	// bucket yoksa oluştur
	ctx := context.Background()
	exists, err := minioClient.BucketExists(ctx, bucket)
	if err != nil {
		log.Fatalf("Bucket check error: %v", err)
	}
	if !exists {
		if err := minioClient.MakeBucket(ctx, bucket, minio.MakeBucketOptions{}); err != nil {
			log.Fatalf("Bucket create error: %v", err)
		}
	}

	return &MinIOClient{Client: minioClient, Bucket: bucket}
}

func (m *MinIOClient) UploadFile(file multipart.File, fileHeader *multipart.FileHeader) (string, error) {
	defer file.Close()

	buf := new(bytes.Buffer)
	_, err := buf.ReadFrom(file)
	if err != nil {
		return "", err
	}

	objectName := fileHeader.Filename
	fileSize := fileHeader.Size

	_, err = m.Client.PutObject(context.Background(), m.Bucket, objectName, bytes.NewReader(buf.Bytes()), fileSize, minio.PutObjectOptions{ContentType: fileHeader.Header.Get("Content-Type")})
	if err != nil {
		return "", err
	}

	url := fmt.Sprintf("http://localhost:9100/%s/%s", m.Bucket, objectName)
	return url, nil
}
