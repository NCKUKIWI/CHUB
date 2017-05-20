var mcache = require('memory-cache');

module.exports = function(duration){
  return function(req,res,next){
    var key = '__express__' + req.originalUrl || req.url;
    var cachedBody = mcache.get(key);
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = function(body){
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body);
      }
      next();
    }
  }
}
