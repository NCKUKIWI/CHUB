$(document).ready(function(){ 
    var client = new ClientJS();
    var isIE = client.isIE(); // Check For IE
    var isFirefox = client.isFirefox(); // Check For Firefox
    var isOpera = client.isOpera(); // Check For Opera
    var isWindows = client.isWindows(); // Check For Mac
    
    if ( isIE || isOpera ) {
        noSupport();
    }
    
    if ( isFirefox && isWindows ) {
        noSupport();
    }
});


function noSupport () {
    location.href="/no_support";
    // location.href="no_support.html";
}
