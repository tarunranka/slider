;(function( $ ) {
	var plugin = {};

    var defaults = {
		
	}
	$.fn.slider=function(options){
		 if (this.length == 0) return this;
		 
        // support mutltiple elements
        if (this.length > 1) {
            this.each(function() {
                $(this).slider(options)
            });
            return this;
        }
		
		// create a namespace to be used throughout the plugin
        var slider = {};
        
		// set a reference to our slider element
        var el = this;
        plugin.el = this;
		
		// first get the original window dimens (thanks alot IE)
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
		
		var init = function(){
			slider.settings = $.extend({}, defaults, options);
			var ul = el.find('ul.sliderwpr');
			var li = el.find('ul.sliderwpr li');
			slider.liWidth = li.outerWidth(true);
			slider.itemsLength = $(".slider ul.sliderwpr li").length;
			slider.totalWidth = slider.liWidth * (slider.itemsLength+2);
			ul.width(slider.totalWidth);
			var next = $('.control_next');
			var prev = $('.control_prev');
			var page = $('.pagination li');
			slider.clickFlag=0;
			slider.current = 1;			
			var cloneSlide_1 = li.eq(slider.current).clone().addClass('clone');
			var cloneSlide_last = li.eq((slider.itemsLength-1)).clone().addClass('clone');
			ul.append(cloneSlide_1);
			ul.prepend(cloneSlide_last);
			ul.css({'left':-(slider.liWidth)});
			var currentli = li.eq(slider.current-1);
			currentli.addClass('active');
			page.eq(slider.current-1).addClass('active');
			$('.control_next').click(function(e){
				e.preventDefault();
			
				if(slider.clickFlag == 0){
					if (slider.current  < (slider.itemsLength)) {
						slider.current  += 1; 
					} else {
						slider.current  = 1; 
					}
					slider.clickFlag = 1;
				
					slideTo(slider.current,'next');				
					li.removeClass('active').eq(slider.current-1).addClass('active');
					setTimeout(function(){
						page.removeClass('active').eq(slider.current-1).addClass('active');
					},100);
				}
				return false;
			});
			$('.control_prev').click(function(e){
				e.preventDefault();
				if(slider.clickFlag == 0){
					if (slider.current  == 1) {
						slider.current  = (slider.itemsLength); 
					} else {
						slider.current  -= 1; 
					}
					slider.clickFlag = 1;
					slideTo(slider.current,'prev');
					li.removeClass('active').eq(slider.current-1).addClass('active');
					setTimeout(function(){
						page.removeClass('active').eq(slider.current-1).addClass('active');
					},100);
				}
			});
			page.click(function(e){
				var clickItem = page.index(this)+1;
				if(clickItem < slider.current){
					slideTo(clickItem,'prev');
					slider.current = clickItem;
					li.removeClass('active').eq(slider.current-1).addClass('active');
				setTimeout(function(){
					page.removeClass('active').eq(slider.current-1).addClass('active');
				},100);
				} else{
					slideTo(clickItem,'next');
					slider.current = clickItem;
					li.removeClass('active').eq(slider.current-1).addClass('active');
				setTimeout(function(){
					page.removeClass('active').eq(slider.current-1).addClass('active');
				},100);
				}
			})
		};
		var slideTo = function(value,dir){
			var ul = el.find('ul.sliderwpr');
			var left = -(slider.liWidth * value);
			if(value == 1 && dir == "next"){
				ul.animate({left: 0},0, function() {
					ul.animate({left: -(slider.liWidth)}, 500, function() {
						slider.clickFlag = 0;
					});
				});				
				slider.current = 1;
			} else if(value == slider.itemsLength && dir == "prev"){				
				ul.animate({left: 0},500, function() {
					ul.animate({left: -(slider.liWidth*slider.itemsLength)}, 0, function() {});
					slider.clickFlag = 0;
				});
				slider.current = slider.itemsLength;
			} else{
				ul.animate({left: left}, 500, function() {
					slider.clickFlag = 0;
				});
			}			
		};		
		init();
		return this;
    
	}
})(jQuery);