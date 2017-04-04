exports.handleError = function handleError(err) {
	var errmsg = [];
	for(var i in err.errors) {
		errmsg.push(err.errors[i].message);
	}
	return errmsg;
}

exports.removeFromArray = function removeFromArray(arr,element) {
	var index = arr.indexOf(element);
  if(index!=-1){
    arr.splice(index,1);
  }
  return arr;
}
