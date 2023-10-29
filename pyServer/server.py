# import main Flask class and request object
import base64
import io
import json
from PIL import Image
from flask import Flask, request
from PIL import Image
import requests
from ultralytics import YOLO
from tracking import predict_video,predict_image


# import os

# print(os.listdir())
model = YOLO("test/yolov8n.pt")

# создание фласк приложения
app = Flask(__name__)



# функция для бизнес логики
def treatmentImage(jsonData):
    
    


    print("работаем с изображением")
    #проверка на формат
    if jsonData["type"].find("jpeg") >-1:
        
        #создаем png
        fh = open("in/in.jpg", "wb")
        fh.write(base64.b64decode(jsonData["b64"]))
        fh.close()

        rez = predict_image(model, "in/in.jpg","out.jpg")

        encoded_string = ''
        with open("out.jpg", "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read())

        encoded_string = str(encoded_string)[2:-1]
        jsonData["b64"] = encoded_string

        return jsonData
    




    #проверка на формат
    if jsonData["type"].find("png") > -1:


        

        #создаем png
        fh = open("in/in.png", "wb")
        fh.write(base64.b64decode(jsonData["b64"]))
        fh.close()

        rez = predict_image(model, "in/in.png","out.jpg")

        #записываем результаты
        encoded_string = ''
        with open("out.jpg", "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read())

        print("записываем в base64 файл")
        encoded_string 
        print("обрезаем base64")
        jsonData["b64"] = str(encoded_string)[2:-1]
        print("возврат")
        
        file = open("testPNG.txt", "w")
        file.write(jsonData["type"]+ ","+str(jsonData["b64"]))
        file.close()

        return jsonData
    #проверка на формат и отправка на сервер json
  
#эндпоинт и методы
@app.route('/sendFromPy', methods=['GET', 'POST'])
def treatment():

    if request.method == 'POST':
        
        
        return treatmentImage(request.json)
    return "тут должен быть json c обработанной картинкой"


def treatmenImagetVideo(json):

    print("записываем видео")
    #json->video
    fh = open("video.mp4", "wb")
    fh.write(base64.b64decode(json["b64"]))
    fh.close()

        
    print("запускаем модель")
    answer = predict_video(model,"video.mp4","out_video.mp4")

    print(answer.keys())

    #.mp4 -> base64
    with open("out_video.mp4", "rb") as videoFile:
        text = base64.b64encode(videoFile.read())
        answer["type"] = json["type"]
        answer["b64"] = str(text)[2:-1]

    

    
    return answer









# функция для бизнес логики
#def treatmenImagetDouble(jsonData):
    
#    file = open("testIn.txt", "w")
#    file.write(str(jsonData))
#    file.close()
    
#    image = Image.open(io.BytesIO(base64.b64decode(jsonData['b64t'])))
    
    
#   if image.mode != 'RGB':
#        image = image.convert('RGB')


#    image.save("tiffToJPG.jpg")

#    with open("tiffToJPG.jpg", "rb") as image_file:
#        encoded_string = base64.b64encode(image_file.read())

    

#    jsonData['b64'] = str(encoded_string)[2:-1]
#    jsonData['type'] = "data:image/jpeg;base64"
#    file = open("testOut.txt", "w")
    # file.write(str(jsonData))
    # file.close()

#    return jsonData
    
#эндпоинт и методы
#@app.route('/sendFromPyDouble', methods=['GET', 'POST'])
#def treatmentDouble():

#    if request.method == 'POST':
        
        
#        return treatmenImagetDouble(request.json)
#    return "тут должен быть json c обработанной картинкой"


@app.route('/sendFromPyVideo', methods=['GET', 'POST'])
def treatmentVideo():

    if request.method == 'POST':
        return treatmenImagetVideo(request.json)
    return "тут должен быть json c обработаннsv видео"


if __name__ == '__main__':
    
    app.run(debug=True, port=5000, host='0.0.0.0')

