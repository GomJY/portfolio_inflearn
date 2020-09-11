document.querySelector("#form-join").addEventListener("submit", e => {
  e.preventDefault();
  console.log(e);
  let url = e.target.action;
  let formData = new FormData(e.target);
  for(let data of formData) {
    if(data[1].length == 0) {
      let emptyField = "";
      switch(data[0]) {
        case "email":
          emptyField = "이메일";
        break;
        case "nickname":
          emptyField = "닉네임";
        break;
        case "password":
          emptyField = "비밀번호"
        break;
        default :
          emptyField = "입력창";
        break;
      }
      alert(emptyField+ "을 입력하지 않으셨습니다.");
      return;
    }
  } 
  if($("#password").val() !== $("#password_re").val()) {
    alert("입력된 비밀번호가 비밀번호와 확인된 비밀번호와 다릅니다.");
    return;
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
        window.location = location.origin;
      }
    },
    error: function (jqXHR, textStatus, errorThrown)
    {
      console.log(jqXHR, textStatus, errorThrown);
      alert("시스템에 문제가 생겼습니다.");
    }
  });
});

function getFormData($form){
  var unindexed_array = $form.serializeArray();
  var indexed_array = {};

  $.map(unindexed_array, function(n, i){
      indexed_array[n['name']] = n['value'];
  });

  return indexed_array;
}