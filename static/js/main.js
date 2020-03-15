    function myPost(url, params) {
      var temp = document.createElement("form");
      temp.action = url;
      temp.method = "post";
      temp.style.display = "none";
      for (var x in params) {
        var opt = document.createElement("textarea");
        opt.test = x;
        temp.appendChild(opt);
      }
      document.body.appendChild(temp);
      temp.submit();
      return temp;
    }
    function sendR() {
      var blob = document.getElementById('ffile').files[0];
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readState == 4) {
          if (xhr.responeText) {
            alert("Finish");
            alert(xhr.responeText);
          }
        }
      }
      var start = 0;
      var end = blob.size;
      var chunk = blob.slice(start, end);

      var fd = new FormData();
      fd.append("ffile", chunk);
      fd.append("name", blob.name);
      xhr.open("POST", "/sendR", true);
      xhr.send(fd);
    }
    function sendRequest() {
      const BYTES_PER_CHUNK = 1024 * 1024;
      var slices = 1; 
      var totalSlices;

      var blob = document.getElementById('ffile').files[0];
      console.log(blob.size);
      
      var start = 0;
      var end;
      var index = 0;

      totalSlices = Math.ceil(blob.size / BYTES_PER_CHUNK);
      console.log(totalSlices);
      console.log(slices);
      console.log("-------");

      while (start < blob.size) {
        end = start + BYTES_PER_CHUNK;
        if (end > blob.size) {
          end = blob.size;
        }

        uploadFile(blob, index, start, end, slices, totalSlices);
        start = end;
        index++;
        slices++;
      }
    }
    function uploadFile(blob, index, start, end, slices, totalSlices) {
      var xhr;
      var fd;
      var chunk;   

      xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if (xhr.responeText) {
            alert(xhr.responeText);
            console.log("Finish");
          }

          console.log(slices);
          if (slices == totalSlices) {
            console.log("mergeFile");
            mergeFile(blob);
            alert("File Upload Finish");
          }
        }
      };

      chunk = blob.slice(start, end);

      fd = new FormData();
      fd.append("ffile", chunk);
      fd.append("name", blob.name);
      fd.append("index", index);

      xhr.open("POST", "/uploadQFile", true);

      xhr.setRequestHeader("X_Requested_With", location.href.split("/")[3].replace(/[^a-z]+/g, '$'));
      xhr.send(fd);
    }
    function mergeFile(blob) {
      var xhr;
      var fd;

      xhr = new XMLHttpRequest();

      fd = new FormData();
      fd.append("name", blob.name);

      xhr.open("POST", "/mergeFile", true);

      xhr.setRequestHeader("X_Requested_With", location.href.split("/")[3].replace(/[^a-z]+/g, '$'));
      xhr.send(fd);
    }

function changeComeFrom() {
  var atp = document.getElementById("ap");
  var attributesI = atp.childNodes[3];
  attributesI.addEventListener("change", function() {
    var value = attributesI.value;
    var comeFrom = document.getElementById("come-from");
    var removeChilds = function () {
        var childs = comeFrom.childNodes;
        for (var i = childs.length - 1; i >= 0; i--) {
          comeFrom.removeChild(childs[i]);
        }
    }
    switch(value){
      case "Video":
        removeChilds();
        var oa = document.createElement("option");
        oa.value = "Another";
        comeFrom.appendChild(oa);
        var ol = document.createElement("option");
        ol.value = "LingMeiYushuo";
        comeFrom.appendChild(ol);
        var olu = document.createElement("option");
        olu.value = "luoli";
        comeFrom.appendChild(olu);
        var om = document.createElement("option");
        om.value = "MMD";
        comeFrom.appendChild(om);
        var oms = document.createElement("option");
        oms.value = "MS";
        comeFrom.appendChild(oms);
        var on = document.createElement("option");
        on.value = "Normal";
        comeFrom.appendChild(on);
        var osh = document.createElement("option");
        osh.value = "shanchi";
        comeFrom.appendChild(osh);
        var oyy = document.createElement("option");
        oyy.value = "YY";
        comeFrom.appendChild(oyy);
        break;
      case "Game":
        removeChilds();
        var ol = document.createElement("option");
        ol.value = "LingMengYuShuo";
        comeFrom.appendChild(ol);
        var on = document.createElement("option");
        on.value = "Normal";
        comeFrom.appendChild(on);
        break;
      case "Music":
        removeChilds();
        var ol = document.createElement("option");
        ol.value = "LingMeiYushuo";
        comeFrom.appendChild(ol);
        break;
      default:
        removeChilds();
        var oa = document.createElement("option");
        oa.value = "Another";
        comeFrom.appendChild(oa);
        var ol = document.createElement("option");
        ol.value = "LingMeiYushuo";
        comeFrom.appendChild(ol);
        var olu = document.createElement("option");
        olu.value = "luoli";
        comeFrom.appendChild(olu);
        var om = document.createElement("option");
        om.value = "MMD";
        comeFrom.appendChild(om);
        var oms = document.createElement("option");
        oms.value = "MS";
        comeFrom.appendChild(oms);
        var on = document.createElement("option");
        on.value = "Normal";
        comeFrom.appendChild(on);
        var osh = document.createElement("option");
        osh.value = "shanchi";
        comeFrom.appendChild(osh);
        var oyy = document.createElement("option");
        oyy.value = "YY";
        comeFrom.appendChild(oyy);
        break;
    }
  });
}

function restInputById(name) {
  if (arguments.length == 1) {
    document.getElementById(name).value = "";
  } else if (arguments.length == 2) {
    document.getElementById(name).value = arguments[1];
  }
}

function clearAdd() {
  restInputById("id");
  restInputById("url");
  document.getElementsByName("attributes").item(0).value = "";
  document.getElementsByName("come-from").item(0).value = "";
  restInputById("description");
  restInputById("description");
  document.getElementById("dt1").checked = true;
  document.getElementById("dt2").checked = false;
  document.getElementById("dt3").checked = false;

  document.getElementById("e1").checked = true;
  document.getElementById("e2").checked = false;

  document.getElementById("z1").checked = true;
  document.getElementById("z2").checked = false;
  restInputById("password");
}

function clearTable() {
  document.getElementById("s-name").value = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("search-id").innerHTML = "";
  document.getElementById("search-url").innerHTML = "";
  document.getElementById("search-attributes").innerHTML = "";
  document.getElementById("search-come-from").innerHTML = "";
  document.getElementById("search-description").innerHTML = "";
  document.getElementById("search-download-type").innerHTML = "";
  document.getElementById("search-extractp").innerHTML = "";
  document.getElementById("search-zipp").innerHTML = "";
  document.getElementById("search-password").innerHTML = "";
}

function searchTable() {
  var value = document.getElementById("s-name").value; 
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.status == 200) {
      if (xhr.responseText == "nil") {
        clearTable();
        document.getElementById("result").innerHTML = "Don't find " + value;
      }
      else {
        clearTable();
        document.getElementById("result").innerHTML = "Find";
        var results = JSON.parse(xhr.responseText);
        document.getElementById("search-id").innerHTML = results.ID;
        document.getElementById("search-url").innerHTML = results.URL;
        document.getElementById("search-attributes").innerHTML = results.ATTRIBUTES;
        document.getElementById("search-come-from").innerHTML = results['COME-FROM'];
        document.getElementById("search-description").innerHTML = results.DESCRIPTION;
        document.getElementById("search-download-type").innerHTML = results['DOWNLOAD-TYPE'];
        document.getElementById("search-extractp").innerHTML = results.EXTRACTP;
        document.getElementById("search-zipp").innerHTML = results.ZIPP;
        document.getElementById("search-password").innerHTML = results.PASSWORD;
      }
    }
  }
  fd = new FormData();
  fd.append("s-name", value);
  
  xhr.open("POST", "/search-table", true);
  xhr.send(fd);
}

