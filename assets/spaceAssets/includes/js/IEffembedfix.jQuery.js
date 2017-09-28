(function($) {
    $.fn.ieffembedfix = function() {
		
		// CONFIGURE THE PATH TO YOUR 1BY1 PNG HERE, RELATIVE TO THE LOCATION OF THIS JS FILE.
		
		var pngimgurl = "hIEfix.png";
		
    return this.each(function() {
        //check for IE7/8
        if (jQuery.support.objectAll == false) {
            $(this).css({
						
						filter: 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + pngimgurl + ",sizingMethod=crop',
						zoom: '1'
						});
        }
        });
    }
})(jQuery);