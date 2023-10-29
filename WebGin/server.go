// main.go

package main

import (
	"Ubludor/WebGin/entity"
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

var router *gin.Engine

// точка входа в программу
func main() {

	router = gin.Default()
	//подгрузка статических файлов
	router.LoadHTMLGlob("templates/*.html")
	//router.LoadHTMLGlob("templates/indexVideo.html")
	router.Static("/js", "./js")
	router.Static("/css", "./css")
	router.StaticFile("/favicon.ico", "./resources/favicon.ico")
	router.StaticFile("/out_video.mp4", "./videobuf/out_video.mp4")
	

	//энд поинт с html
	router.GET("/", func(c *gin.Context) {

		// Call the HTML method of the Context to render a template
		c.HTML(
			// Set the HTTP status to 200 (OK)
			http.StatusOK,
			// Use the index.html template
			"index.html",
			// Pass the data that the page uses (in this case, 'title')
			gin.H{
				"title": "Home Page",
			},
		)

	})

	router.GET("/upload",func(c *gin.Context){
		

	})

	router.GET("/video", func(c *gin.Context) {

		// Call the HTML method of the Context to render a template
		c.HTML(
			// Set the HTTP status to 200 (OK)
			http.StatusOK,
			// Use the index.html template
			"indexVideo.html",
			// Pass the data that the page uses (in this case, 'title')
			gin.H{
				"title": "Home Page",
			},
		)

	})
	//энд поин для отправки файла на обработку
	router.POST("/send", func(c *gin.Context) {
		//запись в структуру go для промежуточной обработки данных
		var data entity.FormBase64
		c.ShouldBindJSON(&data)
		bytesRepresentation, err := json.Marshal(data)
		if err != nil {
			log.Fatalln(err)
		}
		//пост запрос на сервер с нейронкой
		resp, err := http.Post("http://0.0.0.0:5000/sendFromPy", "application/json", bytes.NewBuffer(bytesRepresentation)) 
    	if err != nil { 
        	log.Println(err) 
    	}
		defer resp.Body.Close()
		var res map[string]interface{}
		//json
    	json.NewDecoder(resp.Body).Decode(&res)
		c.JSON(200,res)
    	//log.Println(res["b64"])

	})

	router.GET("/video/:filename", func(c *gin.Context) {
		filename := c.Param("filename")
		file, err := os.Open("videos/" + filename)
		if err != nil {
			c.String(http.StatusNotFound, "Video not found.")
			
			return
		}
		defer file.Close()

		c.Header("Content-Type", "video/mp4")
		buffer := make([]byte, 64*1024) // 64KB buffer size
		io.CopyBuffer(c.Writer, file,buffer)
	})

	router.POST("/sendVideo", func(c *gin.Context) {
		//запись в структуру go для промежуточной обработки данных
		var data entity.FormBase64
		c.ShouldBindJSON(&data)
		bytesRepresentation, err := json.Marshal(data)
		if err != nil {
			log.Fatalln(err)
		}
		//пост запрос на сервер с нейронкой
		log.Println("Запрос на py серрвер")
		resp, err := http.Post("http://0.0.0.0:5000/sendFromPyVideo", "application/json", bytes.NewBuffer(bytesRepresentation)) 
    	if err != nil { 
        	log.Println(err) 
    	}
		log.Println("Ответ с py сервера")
		defer resp.Body.Close()
		var res map[string]interface{}
		
		//json
    	json.NewDecoder(resp.Body).Decode(&res)
		log.Println(res["type"])
		log.Println("Ответ на js")
		entity.Base64ToFile(res["b64"].(string))
		c.JSON(200,res)
    	//log.Println(res["b64"])

	})
	//пост запрос на сервер с нейронкой
	/*router.POST("/sendDouble", func(c *gin.Context) {
		var data entity.FormBase64Double
		c.ShouldBindJSON(&data)
		

		bytesRepresentation, err := json.Marshal(data)
		if err != nil {
			log.Fatalln(err)
		}
		//пост запрос на сервер с нейронкой для двух фото
		resp, err := http.Post("http://localhost:5000/sendFromPyDouble", "application/json", bytes.NewBuffer(bytesRepresentation)) 
    	if err != nil { 
        	log.Println(err) 
    	}
		
		defer resp.Body.Close()
		var res map[string]interface{}
		//полученные данные обораиваем в json
    	json.NewDecoder(resp.Body).Decode(&res)
		c.JSON(200,res)
    	
	})*/

	
	router.Run(":8080")

	
}
