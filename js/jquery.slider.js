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
			
			var isMouseDown=false,
				started =false,
				drag={},
				delta={};
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
			li.on('mousedown', function(e) {
                isMouseDown = true;
				drag.x = e.pageX;
				drag.y = e.pageY;
				
            });
			li.on('mousemove', function(e) {			
                if (isMouseDown) {					
					console.log('stopped'+e.pageX +' '+drag.x);
					delta.x = e.pageX;
					delta.y = e.pageY;
					var angle = calculateDirection(drag,delta);
					console.log(angle);
					//console.log('stopped'+delta.x+'y...  '+delta.y);
					if(angle =="LEFT"){
						console.log(delta.x);
						if (slider.current  < (slider.itemsLength)) {
						slider.current  += 1; 
					} else {
						slider.current  = 1; 
					}
					slideTo(slider.current,'next');
					li.removeClass('active').eq(slider.current-1).addClass('active');
					setTimeout(function(){
						page.removeClass('active').eq(slider.current-1).addClass('active');
					},100);
					isMouseDown = false;					
					} else if(angle =="RIGHT"){
						console.log(delta.x);
						if (slider.current  == 1) {
						slider.current  = (slider.itemsLength); 
					} else {
						slider.current  -= 1; 
					}
					slideTo(slider.current,'prev');
					li.removeClass('active').eq(slider.current-1).addClass('active');
					setTimeout(function(){
						page.removeClass('active').eq(slider.current-1).addClass('active');
					},100);
					isMouseDown = false;
					} else {
						isMouseDown = false;
					}
				}
			});
			li.on('mouseup mouseleave', function() {
				
                if (isMouseDown) {
                    // dragging stopped
					
					isMouseDown = false;
                }             
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
		var calculateAngle= function(startPoint, endPoint){
			var x = startPoint.x - endPoint.x;
            var y = endPoint.y - startPoint.y;
            var r = Math.atan2(y, x); //radians
            var angle = Math.round(r * 180 / Math.PI); //degrees

            //ensure value is positive
            if (angle < 0) {
                angle = 360 - Math.abs(angle);
            }
			
            return angle;
		};
		var calculateDirection=function(startPoint, endPoint) {
            var angle = calculateAngle(startPoint, endPoint);
            if ((angle <= 45) && (angle >= 0)) {
                return "LEFT";
            } else if ((angle <= 360) && (angle >= 315)) {
                return "LEFT";
            } else if ((angle >= 135) && (angle <= 225)) {
                return "RIGHT";
            } else if ((angle > 45) && (angle < 135)) {
                return "DOWN";
            } else {
                return "UP";
            }
        }
		init();
		return this;
    
	}
})(jQuery);