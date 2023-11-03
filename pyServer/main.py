# import main Flask class and request object
import base64

from flask import Flask, request


app = Flask(__name__)


# функция для бизнес логики
def treatmentImage(jsonData):
    return jsonData




@app.route('/py', methods=['GET', 'POST'])
def treatment():
    if request.method == 'POST':
        return treatmentImage(request.json)
    return "{ \" запрос от сервера методом get\": \"flask py\" }"



@app.route('/')
def index():
    return 'ты кто такой, я тебя не звал'

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
