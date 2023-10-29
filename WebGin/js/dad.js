// ************************ Drag and drop ***************** //
let dropArea = document.getElementById("drop-area")

let testefiles;

// Prevent default drag behaviors
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)   
  document.body.addEventListener(eventName, preventDefaults, false)
})

// Highlight drop area when item is dragged over it
;['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
})

;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
})

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false)

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('active')
}

function handleDrop(e) {
  var dt = e.dataTransfer
  var files = dt.files

  handleFiles(files)
}

let uploadProgress = []
let progressBar = document.getElementById('progress-bar')

/*function initializeProgress(numFiles) {
  progressBar.value = 0
  uploadProgress = []

  for(let i = numFiles; i > 0; i--) {
    uploadProgress.push(0)
  }
}*/

function updateProgress(fileNumber, percent) {
  uploadProgress[fileNumber] = percent
  let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length
  progressBar.value = total
}

function handleFiles(files) {
  files = [...files]
  //console.log(files)
  testefiles = files
  //initializeProgress(files.length)
  //files.forEach(uploadFile)
  files.forEach(previewFile)
  //todo функция, которая парсит загруженнные фото
  workWithImages(files)
}
//добавление фото в галлерею
function previewFile(file) {
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = function() {
    let img = document.createElement('img')
    img.src = reader.result
    document.getElementById('gallery').appendChild(img)
  }
}
//переводим 1 файл в base64
function workWithImages(files){
    for (let i = 0; i < files.length; i++) {
        var file = files[i];
        if (file) {
                var reader = new FileReader();

                reader.onload = function (readerEvent) {
                var base64String = readerEvent.target.result;
                var dataSlice = base64String.split(',');
                var dataObj = {
                    type : dataSlice[0],
                    b64 : dataSlice[1]
                }
                var json = JSON.stringify(dataObj);
                //console.log(json);
                request(json)
            }
            reader.readAsDataURL(file);
        }
      }
}
/*async function workWithDoubleImages(){
  //получаем картнку
  //получаем другую картинку
  //переводим в base64
  //переводим в json
  //отправляем на сервер
 
  
  //проверка на пустые данные
  if(document.getElementById("pngField").files[0]=== undefined || document.getElementById("tifField").files[0] === undefined)
  {
    alert("Вы не выбрали файлы!!!")
    return
  }
  let pngFile = document.getElementById("pngField").files[0]
  let tifFile = document.getElementById("tifField").files[0]
  //запись base64  в переменные
  let res1 = await toBase64(pngFile);
  let res2 = await toBase64(tifFile);
  let sl1 = res1.split(',')
  let sl2 = res2.split(',')
  var dataObj = {
    type : sl1[0],
    b64 : sl1[1],
    typet : sl2[0],
    b64t:sl2[1]
  }
  var json = JSON.stringify(dataObj);
  requestDouble(json);
}*/



//перевод file в base64
const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});


function request(json){
    var dataFromPyServer;
    var url = '/send';
    // Формируем запрос
    response = fetch(url, {
        // Метод, если не указывать, будет использоваться GET
        method: 'POST',
        // Заголовок запроса
        headers: {
        'Content-Type': 'application/json'
        },
        // Данные
        body: json
    })
    .then((resp) => resp.json())
    .then((data)=> final(data["type"]+","+data["b64"])
    );

    //base64 = dataFromPyServer["type"] +","+dataFromPyServer["b64"]

    //console.log(dataFromPyServer)
}




function requestDouble(json){
  var url = '/sendDouble';
    // Формируем запрос
    response = fetch(url, {
        // Метод, если не указывать, будет использоваться GET
        method: 'POST',
        // Заголовок запроса
        headers: {
        'Content-Type': 'application/json'
        },
        // Данные
        body: json
    })
    .then((resp) => resp.json())
    .then((data)=> final(data["type"]+","+data["b64"])//получаем base64
    );
}


function uploadFile(file, i) {
  var url = 'http://0.0.0.0:8080/send'
  var xhr = new XMLHttpRequest()
  var formData = new FormData()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

  // Update progress (can be used to show progress indicator)
  xhr.upload.addEventListener("progress", function(e) {
    updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
  })

  xhr.addEventListener('readystatechange', function(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      updateProgress(i, 100) // <- Add this
    }
    else if (xhr.readyState == 4 && xhr.status != 200) {
      // Error. Inform the user
    }
  })

  formData.append('upload_preset', 'ujpu6gyk')
  formData.append('file', file)
  xhr.send(formData)
}

function final(base64){

  const img = document.createElement("img");
  img.src = base64;
  document.getElementById("slider").appendChild(img);
  sf();
 }


