
// lecture-bodySelect
setLayer(0);
function setLayer(index) {
  let headers = document.querySelectorAll('#bodyInfo .header_nav div');
  console.log(headers);
  headers.forEach(header => {
    console.log(header.className);
    header.className =header.className.replace("on", "");
    console.log(header.className);
  });
  headers[index].className = headers[index].className + " on"; 
  console.log(headers[index].className);
  showLectureLayer(index);
}

function showLectureLayer(index) {
  let layers = document.querySelectorAll('.layer');
  for(let layer of layers) {
    layer.className = layer.className.replace("on", "");
  }
  layers[index].className = layers[index].className + " on";
}