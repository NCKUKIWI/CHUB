var mcache = require("memory-cache");

exports.cache = function(duration){
  return function(req,res,next){
    if(req.originalUrl=="/users/msg" || (req.rawHeaders.indexOf("no-cache")==-1 && req.method == "GET")){
      var key;
      if(req.originalUrl=="/users/msg"){
        key = "msg"+req.user._id;
      }else{
        key = req.originalUrl || req.url;
      }
      var cachedBody = mcache.get(key);
      if (cachedBody) {
        console.log("found");
        res.send(cachedBody);
        return;
      } else {
        console.log("cache");
        res.sendResponse = res.send;
        res.send = function(body){
          mcache.put(key, body, duration * 1000);
          res.sendResponse(body);
        }
        next();
      }
    }else{
      next();
    }
  }
}

exports.del = function(name){
  var keys = mcache.keys();
  for(var i in keys){
    if(keys[i].indexOf(name)!=-1){
      mcache.del(keys[i]);
    }
  }
}

exports.clear = function(){
  mcache.clear();
}
