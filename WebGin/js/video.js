const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });


async function workWithVideo(){
    if(document.getElementById("videoFile").files[0]=== undefined){
      alert("Вы не выбрали видео")
      return
    }
    let videoFile = document.getElementById("videoFile").files[0]
    let res_video = await toBase64(videoFile)
    let slv = res_video.split(",")
  
    var dataObj = {
      type : slv[0],
      b64 : slv[1]
    }
  
    var json = JSON.stringify(dataObj);
    requestVideo(json)
  }

  function requestVideo(json){
    var url = '/sendVideo';
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
      .then((data)=> finalVideo(data)
      );
  }
  
  function finalVideo(data)
  {
    //console.log(Object.keys(data));
    //console.log(Object.keys(data["video"]));
    //console.log(Object.keys(data["frames"]));
    
    console.log(data["frames"].length);
    
     let arr = data["frames"]
     let fixed = document.getElementById("fixed")
     var row = document.createElement("tr")
     var td1 = document.createElement("td")
     td1.appendChild(document.createTextNode("0 - "+(data["frames"].length-1)))
     var td2 = document.createElement("td")
     td2.appendChild (document.createTextNode(data["video"]["0"]))
     var td3 = document.createElement("td")
     td3.appendChild (document.createTextNode(data["video"]["1"]))
     var td4 = document.createElement("td")
     td4.appendChild (document.createTextNode(data["video"]["2"]))
     var td5 = document.createElement("td")
     td5.appendChild (document.createTextNode(data["video"]["3"]))

     row.appendChild(td1);
     row.appendChild(td2);
     row.appendChild(td3);
     row.appendChild(td4);
     row.appendChild(td5);
     
     fixed.appendChild(row);


     


    arr.forEach(function(item, i, arr) {
      //console.log( i + ": " + item  );
      
      let table = document.getElementById("tableBody")
      //var tbody = document.getElementById(id).getElementsByTagName("tbody")[0];
      var row = document.createElement("tr")
      var td1 = document.createElement("td")
      td1.appendChild(document.createTextNode(i))
      var td2 = document.createElement("td")
      td2.appendChild (document.createTextNode(item["0"]))
      var td3 = document.createElement("td")
      td3.appendChild (document.createTextNode(item["1"]))
      var td4 = document.createElement("td")
      td4.appendChild (document.createTextNode(item["2"]))
      var td5 = document.createElement("td")
      td5.appendChild (document.createTextNode(item["3"]))

      row.appendChild(td1);
      row.appendChild(td2);
      row.appendChild(td3);
      row.appendChild(td4);
      row.appendChild(td5);
      
      table.appendChild(row);

    });
    let link = document.getElementById("linkOnVideo")
    let a = document.createElement('a');
    a.innerHTML = "ДЛЯ ПРОСМОТРА ВИДЕО НАЖМИ НА МЕНЯ";
    a.href = "/video/out.mp4"
    a.target = "_blank"
    link.appendChild(a)

    return
  }

  