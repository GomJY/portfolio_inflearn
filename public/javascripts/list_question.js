resetPageClickEvent();

function resetPageClickEvent() {
  $(".bottom .navSelector .button").each((index, item) => {
    if(!$(item).hasClass("on"))
      $(item).on("click", e => pageClickEvent(e)); 
  });
}

function pageClickEvent(e, selectPage = 0) {
  let last_id, selectPageNumber, nowPageNumber;
  
  if(selectPage != 0) {
    selectPageNumber = selectPage;
  } else {
    selectPageNumber = parseInt($(e.target).text());
  }
  
  nowPageNumber = parseInt($(".navSelector span.on").text());
  const isPageUp = selectPageNumber > nowPageNumber;
  console.log(isPageUp, selectPageNumber, nowPageNumber);
  let href = $(`#question .cardList > a:${isPageUp ? "last-child()" : "first-child()"}`).attr("href");
  console.log(href);
  last_id =href.slice(href.lastIndexOf("/") + 1);
  console.log(last_id, selectPageNumber, nowPageNumber);
  pagePost(last_id, selectPageNumber, nowPageNumber);
}

function pagePost(last_id, selectPageNumber, nowPageNumber) {
  let data = {last_id, selectPageNumber, nowPageNumber};
  let jsonData = JSON.stringify(data);
  let url = location.origin + "/list/question/page";
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
  const { questions_sql, page, nowPageNumber, selectPageNumber } = resData;
  $("#question .cardList").html(temp_question_cardList(questions_sql));
  $("#question .bottom").html(temp_bottom(selectPageNumber, page));
  resetPageClickEvent();
};

function temp_bottom(selectPageNumber, page) {
  let html = "";
  let pageRange = 0;
  let sumPage = selectPageNumber;
  $(".bottom .button").off();
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
  
  for(let i = pageRange - 5; i < pageRange && i < page-1; i++) {
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
function temp_question_cardList(questions_sql) {
  let html = "";
  console.log("temp_question_cardList", questions_sql);
  questions_sql.forEach(item => html += temp_question_card(item));
  return html;
}

function temp_question_card(data) {
  console.log(data);
  let {id, name, nickname, descript} = data; 
  let html = `
  <a href="/question/${id}">
    <div class="card">
      <div class="authorIcon"><img src="/images/profile/default_profile.png" alt="사용자 이미지"></div>
      <div class="content">
        <div class="top"><span class="tit">${name}</span><span class="author"><strong>${nickname}</strong></span><span class="time">2020-09-15 17:07</span></div>
        <pre class="descript">${descript}</pre>
      </div>
    </div>
  </a>
  `;
  return html;
}