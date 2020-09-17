// lecture-bodySelect
let layer_registration = document.querySelector("#layer-registration");
var test;
resetPageClickEvent()

$(".button_registration.greenButton").on("click", e => {
  modal_on(layer_registration);
});

setLayer(0);
function setLayer(index) {
  let headers = document.querySelectorAll('#bodyInfo .header_nav div');
  headers.forEach(header => {
    header.className =header.className.replace("on", "");
  });
  headers[index].className = headers[index].className + " on"; 
  showLectureLayer(index);
}

function showLectureLayer(index) {
  let layers = document.querySelectorAll('.layer');
  for(let layer of layers) {
    layer.className = layer.className.replace("on", "");
  }
  layers[index].className = layers[index].className + " on";
}

$(".button_like").on("click", (e) => {
  let lectures_id = $(e.target).attr("lectures_id");
  let url = location.origin + "/lecture/like";

  $.ajax({
    url : url,
    type: "POST",
    data : JSON.stringify({lectures_id: lectures_id}),
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
      alert(jqXHR.responseJSON.message);
      // alert("시스템에 문제가 생겼습니다.");
    }
  });
  
});
document.querySelector(".button-lecture_question").addEventListener("click", e => {
  e.preventDefault();     
  e.stopPropagation();

  document.querySelector("#layer-question").style.display = "block";
});

function resetPageClickEvent() {
  $(".bottom .navSelector .button").each((index, item) => {
    if(!$(item).hasClass("on"))
      $(item).on("click", e => pageClickEvent(e)); 
  });
}

function pageClickEvent(e, selectPage = 0) {
  let last_id, lectures_id, selectPageNumber, nowPageNumber;
  
  if(selectPage != 0) {
    selectPageNumber = selectPage;
  } else {
    selectPageNumber = parseInt($(e.target).text());
  }
  
  nowPageNumber = parseInt($(".navSelector span.on").text());
  const isPageUp = selectPageNumber > nowPageNumber;

  let href = $(`.cardList a:${isPageUp ? "last-child()" : "first-child()"}`).attr("href");
  last_id =href.slice(href.lastIndexOf("/") + 1);

  lectures_id = location.href.slice(location.href.lastIndexOf("/") + 1);

  pagePost(lectures_id, last_id, selectPageNumber, nowPageNumber);
}

function pagePost(lectures_id, last_id, selectPageNumber, nowPageNumber) {
  let data = {lectures_id, last_id, selectPageNumber, nowPageNumber};
  let jsonData = JSON.stringify(data);
  let url = location.origin + "/lecture/question";
  $.ajax({
    url : url,
    type: "POST",
    data : jsonData,
    dataType: "json",
    contentType: 'application/json',
    success: function(data, textStatus, jqXHR)
    {
      console.log(data);
      if(data.code == 200) {
        pageReset(data);
      }
    },
    error: function (jqXHR, textStatus, errorThrown)
    {
      console.log(jqXHR, textStatus, errorThrown);
      alert(jqXHR.responseJSON.message);
      // alert("시스템에 문제가 생겼습니다.");
    }
  });
}

function pageReset(resData) {
  const { question_sql, page, nowPageNumber, selectPageNumber } = resData;
  $(".QnA .cardList").html(temp_question_cardList(question_sql));
  $(".QnA .bottom").html(temp_bottom(selectPageNumber, page));
  resetPageClickEvent();
};

function temp_bottom(selectPageNumber, page) {
  let html = "";
  let pageRange = 0;
  let sumPage = selectPageNumber;
  $(".QnA .bottom .button").off();
  console.log("sumPage", sumPage);
  while(sumPage > 0) {
    sumPage -= 5;
    pageRange += 5;
  }

  html += `
  <span class="prevButton">
     ${selectPageNumber - 5 > 0 ? `<button class="button greenButton" onclick="pageClickEvent(null, ${pageRange - 5});"> 이전페이지 </button>` : ""} 
  </span>
  <span class="navSelector">
  `;
  console.log(pageRange);
  for(let i = pageRange - 5; i < pageRange && i < page; i++) {
    html+=`<span class="button ${selectPageNumber == i + 1 ? "on" : ""}">${i + 1}</span>`;
  }
  html +=`
  </span>
  <span class="nextButton">
    ${page > pageRange ?`<button class="button greenButton" onclick="pageClickEvent(null, ${pageRange + 1});"> 다음페이지 </button>` : ""}
  </span>
  `;

  return html;
}

function temp_question_cardList(question_sql) {
  let html = "";
  question_sql.forEach((item) => html += temp_question_card(item));
  return html;
}

function temp_question_card(question_sql_data) {
  const {id, name, descript, nickname, createdTime} = question_sql_data;
  return `
    <a href="/question/${id}">
      <div class="card">
        <div class="authorIcon">
          <img src="/images/profile/default_profile.png" alt="사용자 이미지">
        </div>
        <div class="content">
          <div class="top">
            <span class="tit">${name}</span>
            <span class="author"><strong>${nickname}</strong></span>
            <span class="time">
              ${createdTime.split("T")[0] + " " +createdTime.split("T")[1].slice(0, 5)}
            </span>
          </div>
          <pre class="descript">${descript}</pre>
        </div>
      </div>
    </a>
    `;
}

function resistation(lecture_id) {
  let data = {lecture_id: lecture_id};
  let jsonData = JSON.stringify(data);
  let url = location.origin + "/resistation";
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
      alert(jqXHR.responseJSON.message);
      // alert("시스템에 문제가 생겼습니다.");
    }
  });
}
$(".layer-question").each((index, layer) => {
  layer.addEventListener("submit", e => {
    e.preventDefault();
    console.log(e);
    let url = e.target.action;
    let formData = new FormData(e.target);
    for(let data of formData) {
      if(data[1].length == 0) {
        let emptyField = "";
        switch(data[0]) {
          case "tit":
            emptyField = "질문 제목";
          break;
          case "descript":
            emptyField = "질문 내용";
          break;
          case "lecture_id":
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
          $("#question_tit").val("");
          $("#question_descript").val("");
          modal_off($(".layer-question"));
          // window.location = location.origin;
        }
      },
      error: function (jqXHR, textStatus, errorThrown)
      {
        console.log(jqXHR, textStatus, errorThrown);
        alert(jqXHR.responseJSON.message);
      }
    });
  });
});

