var request = require("request");
var config = require("./config");
var username = config.checkfront.username;
var password = config.checkfront.password;
var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');

// 共有九種item
// ex: 代碼/對應種類
// 29/1F, 4 hours
// 30/3F, 4 hours
// 83/2F, 4 hours
// 93/3F, 12 hours
// 94/1F, 12 hours
// 95/1F, 8 hours(早午、午晚)
// 96/3F, 8 hours（早午、午晚）
// 97/2F, 12 hours
// 98/2F, 8 hours（早午、午晚）


// 取得SLIP
// 一定要有start_date跟end_date才會有可能有slip
// 假設那個item在query的區間內available，就會有slip，反之，則會無法出借（沒有slip碼)

// 下面這個範例為，租借3F, 4 hours (代碼: 30), 從７／１～７／２
request({
  url: "https://chub.checkfront.com/api/3.0/item/30?start_date=20170702&end_date=20170710",
  method: 'GET',
  headers: {
    'Authorization': auth
  }
},function(e,r,b){
  console.log(JSON.parse(b))
  console.log("slip: " + JSON.parse(b).item.rate.slip);
  GetSession(JSON.parse(b).item.rate.slip);

});

// 取得Session
// 這邊好像還可以繼續家item
function GetSession(slip){
  request({
    url: "https://chub.checkfront.com/api/3.0/booking/session",
    method: 'POST',
    form: { slip: "30.20170702X1@08:00X240X240-number.1"},
    headers: {
      'Authorization': auth
    }
  },function(e,r,b){
    console.log(JSON.stringify(JSON.parse(b),null,4));
    console.log("session: " + JSON.parse(b).booking.session.id);
    Create(JSON.parse(b).booking.session.id);
  });
}

// 新增訂單
// form裡面有三個必填，晚點要調查要填哪些資料
function Create(session){
  request({
    url: "https://chub.checkfront.com/api/3.0/booking/create",
    method: 'POST',
    form: {
      form:{
        customer_name: 'test',
        receipt: 'test',
        undertaker: 'test'
      },
      session_id: session
    },
    headers: {
      'Authorization': auth
    }
  },function(e,r,b){
    console.log(JSON.stringify(JSON.parse(b),null,4));
  });
}
// 建立booking
