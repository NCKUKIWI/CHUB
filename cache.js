var mcache = require("memory-cache");

exports.cache = function(duration){
  return function(req,res,next){
    console.log("--------------------");
    console.log(`${ req.method } ${ req.originalUrl }`);
    if(req.originalUrl=="/users/msg" || (req.rawHeaders.indexOf("no-cache")==-1 && req.method == "GET")){
      var key;
      if(req.originalUrl=="/users/msg"){
        key = "msg"+req.user._id;
      }else{
        key = req.originalUrl || req.url;
      }
      var cachedBody = mcache.get(key);
      if (cachedBody) {
        //console.log("cache found");
        res.send(cachedBody);
        return;
      } else {
        //console.log("cache create");
        res.sendResponse = res.send;
        res.send = function(body){
          mcache.put(key, body, duration * 1000);
          res.sendResponse(body);
        }
        next();
      }
    }else{
      //console.log("nocache");
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
