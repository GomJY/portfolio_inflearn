
$("#form-comment").on("submit", e => {
  e.preventDefault();
  console.log(e);
  let url = e.target.action;
  let formData = new FormData(e.target);

  for(let data of formData) {
    if(data[1].length == 0) {
      let emptyField = "";
      switch(data[0]) {
        case "descript":
          emptyField = "질문 제목";
        break;
        case "lectures_id":
        case "questions_id":
          alert("시스템에 문제가 발생하였습니다.");
          window.location = location.href;
        break;
      }
      alert(emptyField+ "을 입력하지 않으셨습니다.");
      return;
    }
  }

  let jsonData = formDataToJson(formData);
  $.ajax({
    url : url,
    type: "POST",
    data : jsonData,
    dataType: "json",
    contentType: 'application/json',
    success: function(data, textStatus, jqXHR)
    {
      alert(data.message);
      if(data.code == 200) {
        window.location = location.href;
      }
    },
    error: function (jqXHR, textStatus, errorThrown)
    {
      console.log(jqXHR, textStatus, errorThrown);
      alert("시스템에 문제가 생겼습니다.");
    }
  });
});
