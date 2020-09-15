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

  let href = $(`#lecture .gridContainer > .lectureCard:${isPageUp ? "last-child()" : "first-child()"} a`).attr("href");
  last_id =href.slice(href.lastIndexOf("/") + 1);
  console.log(last_id, selectPageNumber, nowPageNumber);
  pagePost(last_id, selectPageNumber, nowPageNumber);
}

function pagePost(last_id, selectPageNumber, nowPageNumber) {
  let data = {last_id, selectPageNumber, nowPageNumber};
  let jsonData = JSON.stringify(data);
  let url = location.origin + "/list/lecture/page";
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
  const { lectures_sql, page, nowPageNumber, selectPageNumber } = resData;
  $("#lecture .gridContainer").html(temp_lecture_cardList(lectures_sql));
  $("#lecture .bottom").html(temp_bottom(selectPageNumber, page));
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
function temp_lecture_cardList(lectures_sql) {
  let html = "";
  lectures_sql.forEach(item => html += temp_lecture_card(item));
  return html;
}

function temp_lecture_card(data) {
  let {id, name, nickName, price} = data; 
  let html = `
  <div class="lectureCard">
    <a href="/lecture/${id}">
      <div class="image">
        <img src="/images/lecture/${name}.png" alt="${name}"/>
      </div>
      <div class="tit">${name}</div>
      <div class="author">${nickName}</div>
      <div class="score" value="5"></div>
      <div class="price">${price === 0 ? "무료" : "₩"+price }</div>
    </a>
  </div>
  `;
  return html;
}