var mcache = require('memory-cache');

exports.cache = function(duration){
  return function(req,res,next){
    console.log("--------------------");
    console.log(`${ req.method } ${ req.url }`);
    if(req.rawHeaders.indexOf("no-cache")==-1 && req.method == "GET"){
      var key = "express" + req.originalUrl || req.url;
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

exports.clear = function(){
  mcache.clear();
}
