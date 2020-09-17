var IMP = window.IMP; // 생략가능
IMP.init('imp71911393'); // 'iamport' 대신 부여받은 "가맹점 식별코드"를 사용
function requestPay(name, price, id) {
  if(price > 1000) {
    alert("결제 테스트 중입니다. 1000원 보다 높은 가격은 무조건 1000원으로만 결제됩니다. ")
    price = 1000;
  }
  IMP.request_pay({
    pg : 'inicis', // version 1.1.0부터 지원.
    pay_method : 'card',
    merchant_uid : 'merchant_' + new Date().getTime(),
    name : name,
    amount : price,
    m_redirect_url : 'https://www.yourdomain.com/payments/complete'
  }, function(rsp) {
    if ( rsp.success ) {
        var msg = '결제가 완료되었습니다.';
        msg += '고유ID : ' + rsp.imp_uid;
        msg += '상점 거래ID : ' + rsp.merchant_uid;
        msg += '결제 금액 : ' + rsp.paid_amount;
        msg += '카드 승인번호 : ' + rsp.apply_num;
        resistation(id);
    } else {
        var msg = '결제에 실패하였습니다.';
    }
    alert(msg);
  });
}
