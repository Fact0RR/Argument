package main

import (
	"log"
	"net/http"
	"io"

	"github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()
  r.GET("/ping", func(c *gin.Context) {

	resp, err := http.Get("http://model:5000")
	if err != nil {
		log.Fatalln(err)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}

    c.String(http.StatusOK, string(body))
  })
  r.Run() 
}