function findLatestTime(a, b){
  return new Date(b) - new Date(a) < 0;
}

function MsgSorting(rawMsg, msgAll, isOther, kindOfId){

  for(var i in rawMsg){
    // 為了方便render時分辨對方跟我方的訊息
    if(isOther){
      rawMsg[i].isOther = 1;
    }
    else {
      rawMsg[i].isOther = 0;
    }

    var id = rawMsg[i][kindOfId]._id;
    var userInfo = rawMsg[i][kindOfId];

    if(!msgAll.hasOwnProperty(id)){
      msgAll[id] = {};
      msgAll[id].context = [];
      msgAll[id].latestTime = "2017-05-10T17:19:40.520Z";
      msgAll[id].user = userInfo;
      msgAll[id].isRead = 0;
    }
    msgAll[id].context.push(rawMsg[i]);
    // 暫時別計算未讀
    // if(rawMsg[i].IsRead == false) msgAll[rawMsg[i].FromUID._id].isRead++;
    if(findLatestTime(rawMsg[i].CreateAt, msgAll[id].latestTime)){
      msgAll[id].latestTime = rawMsg[i].CreateAt;
    }
  }

  // 進入第二階段的排序
  if(isOther == 0){
    var msgArr = [];
    for(var i in msgAll){
      msgAll[i].context.sort(function(a, b){
        return new Date(a.CreateAt) - new Date(b.CreateAt);
      })
      msgArr.push(msgAll[i]);
    }
    msgArr.sort(function(a,b){
      return new Date(b.latestTime ) - new Date(a.latestTime);
    });
    return msgArr;
  }
}

module.exports = MsgSorting;