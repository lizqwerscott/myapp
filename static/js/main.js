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
  var attributesI = document.getElementById("attributes");
  attributeI.addEventListener("change", function() {
    var value = attributeI.value;
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
        var oa = createElement("option");
        oa.value = "Another";
        comeFrom.appendChild(oa);
        var ol = createElement("option");
        oa.value = "LingMeiYushuo";
        comeFrom.appendChild(ol);
        var olu = createElement("option");
        oa.value = "luoli";
        comeFrom.appendChild(olu);
        var om = createElement("option");
        oa.value = "MMD";
        comeFrom.appendChild(om);
        var oms = createElement("option");
        oa.value = "MS";
        comeFrom.appendChild(oms);
        var on = createElement("option");
        oa.value = "Normal";
        comeFrom.appendChild(on);
        var osh = createElement("option");
        oa.value = "shanchi";
        comeFrom.appendChild(osh);
        var oyy = createElement("option");
        oa.value = "YY";
        comeFrom.appendChild(oyy);
        break;
      case "Game":
        removeChilds();
        var ol = createElement("option");
        oa.value = "LingMeiYushuo";
        comeFrom.appendChild(ol);
        var on = createElement("option");
        oa.value = "Normal";
        comeFrom.appendChild(on);
        break;
      case "Music":
        removeChilds();
        var ol = createElement("option");
        oa.value = "LingMeiYushuo";
        break;
      default:
        removeChilds();
        var oa = createElement("option");
        oa.value = "Another";
        comeFrom.appendChild(oa);
        var ol = createElement("option");
        oa.value = "LingMeiYushuo";
        comeFrom.appendChild(ol);
        var olu = createElement("option");
        oa.value = "luoli";
        comeFrom.appendChild(olu);
        var om = createElement("option");
        oa.value = "MMD";
        comeFrom.appendChild(om);
        var oms = createElement("option");
        oa.value = "MS";
        comeFrom.appendChild(oms);
        var on = createElement("option");
        oa.value = "Normal";
        comeFrom.appendChild(on);
        var osh = createElement("option");
        oa.value = "shanchi";
        comeFrom.appendChild(osh);
        var oyy = createElement("option");
        oa.value = "YY";
        comeFrom.appendChild(oyy);
        break;
    }
  });
}
