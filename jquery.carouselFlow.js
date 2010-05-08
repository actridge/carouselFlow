/**
 * CarouselFlow - jQuery plugin to navigate images in a hybrid carousel/coverflow style widget.
 * @requires jQuery v1.4.2 or above
 *
 * http://github.com/actridge/carouselFlow
 *
 * Copyright (c) 2010 Vance Lucas (vancelucas.com)
 * Released under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */
(function($) {
	$.fn.carouselFlow = function(o) {
		// Default settings
		var o = $.extend({
			btnPrevSelector: null,
			btnNextSelector: null,
			
			visible: 5,
			speed: 500,
			easing: 'linear'
		}, o || {});
		
		// Return so call is chainable
		return this.each(function() {
			var cfDiv = $(this);
			var cfUl = $('ul', cfDiv);
			var cfLi = $('li', cfUl);
			
			// ==============================================
			// Make some calculations
			var cfLiWidth = cfLi.outerWidth();
			var cfLiHeight = cfLi.outerHeight();
			var eLiWidth = $(':first', cfLi).width();
			var eLiHeight = cfLi.height();
			// Get center element
			var cfLiCenter = Math.floor(cfLi.length / 2);
			var cfUlCenter = Math.ceil(cfUl.width() / 2);
			
			// Move the last item before first item, just in case user click prev button
			$('li:first', cfUl).before($('li:last', cfUl));
			
			// CSS positioning and setup
			cfDiv.css({'position': 'relative'});
			cfUl.css({'position': 'relative', 'overflow': 'hidden', 'list-style-type': 'none',
				'width': '100%',
				'height': cfLiHeight + 'px'});
			cfLi.css({'overflow': 'hidden', 'position': 'absolute', 'display': 'block'});
			
			// Main object with functions
			var cf = {
				// Visible elements on either side of center element
				visibleLis: function(center) {
					var center = center || cfLiCenter;
					return $('li', cfUl).slice(Math.floor(o.visible-center)).slice(0, center+1);
				},
				
				cloneLi: function(dir) {
					if(dir == 'next') {
						// Clone the first item and put it as last item
						$('li:last', cfUl).after($('li:first', cfUl));
					} else if(dir == 'prev') {
						// Clone the last item and put it as first item
						$('li:first', cfUl).before($('li:last', cfUl));
					}
				},
				
				// Slide carousel to index position as center
				slideTo: function(index, animate) {
					var index = index || cfLiCenter;
					var animate = animate || true;
					var dir = false;
					
					// Determine direction
					if(index < cfLiCenter) {
						dir = 'prev';
					} else if(index > cfLiCenter) {
						dir = 'next';
					} else {
						//var dir = false;
					}
					
					if(dir !== false) {
						// Clone list item
						cf.cloneLi(dir);
					}
					
					// Animation sequence
					// ============================================
					$('li', cfUl).each(function(i, value) {
						//var eLiWidth, eLiHeight;
						
						// Size ratio == 100% for center or -{o.stepping}% for each 'step' away from center
						var eLiStep = cfLiCenter - i;
						var eLiStepAbs = Math.abs(eLiStep);
						var eLiSizeRatio = (i == cfLiCenter) ? 100 : (100 - (eLiStep * o.stepping));
						var eLiSizeRatioAbs = (i == cfLiCenter) ? 100 : (100 - (eLiStepAbs * o.stepping));
						var eLi = $(this);
						
						// CSS property setup
						var eLiCss = {
							'width': parseInt(eLiWidth*(eLiSizeRatioAbs/100), 10)+'px',
							'height': parseInt(eLiHeight*(eLiSizeRatioAbs/100), 10)+'px',
							'top': parseInt((eLiHeight - eLiHeight*(eLiSizeRatioAbs/100))/2, 10)+'px'
						};
						
						// Calculate left position (needs to be after final width is calculated)
						eLiCss.left = parseInt(cfUlCenter + cfUlCenter*((100 - eLiSizeRatio)/100) - (eLiCss.width.replace('px', '')/2), 10)+'px';
						
						// Set CSS properties on carousel items
						// Only IMG supported for now
						// @todo Add support for any content
						eLi.css({'zIndex': Math.floor(eLiSizeRatioAbs / 10)})
						if(animate) {
							eLi.find('img').andSelf().animate(eLiCss, o.speed, o.easing);
						} else {
							eLi.find('img').andSelf().css(eLiCss);
						}
					});
					/*
					console.log('Center: ' + cfUlCenter);
					console.log('Min. Width: ' + Array.min(elsWidths));
					*/
					// ============================================
				}
			};
			
			// START the process
			cf.slideTo(cfLiCenter, false);
			
			// PREVIOUS
			$(o.btnPrevSelector).click(function() {
				cf.slideTo(cfLiCenter-1);
				return false;
			});
			
			// NEXT
			$(o.btnNextSelector).click(function() {
				cf.slideTo(cfLiCenter+1);
				return false;
			});
		});
	};
})(jQuery);