var Comment = require("./model/Comment");
Comment.findOneAndUpdate({ _id:"asd" },{Context:"test"},function(err,comment){
  if(comment){
    console.log("yes");
  }else{
    console.log("no");
  }
});
