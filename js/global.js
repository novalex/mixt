
/* ------------------------------------------------ /
GLOBAL JS FUNCTIONS
/ ------------------------------------------------ */

( function($) {

	'use strict';

	var viewport = $(window),
		bodyEl   = $('body');

	/* global mixt_opt */


	// RUN ON LOAD

	viewport.load( function() {

		// Hide loading animation
		bodyEl.removeClass('loading');
		$('#load-overlay .loader').fadeOut(300);

		// Remove focus outlines if mouse is used, enable if Tab is pressed
		bodyEl.on('mousedown', function() {
			bodyEl.addClass('no-outline');
		});
		bodyEl.on('keyup', function(event) {
			var code = event.keyCode || event.which;
			if ( code == '9' ) {
				bodyEl.removeClass('no-outline');
			}
		});

		// Set Content Min Height
		var content = $('#content-wrap');
		if ( content.length ) {
			var contentH = viewport.height() - content.offset().top - $('#colophon').height();
			content.add($('.sidebar', content)).css('min-height', contentH);
		}


		// Initialize smooth scrolling
		if ( mixt_opt.page['smooth-scroll'] && typeof Mixt_SmoothScroll !== 'undefined' ) {
			/* global Mixt_SmoothScroll */
			Mixt_SmoothScroll.init();
		}


		// Skrollr Parallax
		if ( typeof skrollr !== 'undefined' && ! window.mobileCheck() ) {
			viewport.resize();
			
			/* global skrollr */
			var Skrollr = skrollr.init({
				forceHeight: false,
				skrollrBody: 'main-wrap',
				smoothScrolling: false,
				mobileCheck: function () {
					return false;
				}
			});

			viewport.on('refresh-skrollr', function(event, elements) { Skrollr.refresh(elements); });
		}


		// Image Carousels
		if ( typeof $.fn.lightSlider === 'function' ) {
			var carousels = $('.carousel-slider').not('.lightSlider');
			carousels.each( function() {
				var slider = $(this),
					loop     = ( slider.data('loop') === true ) ? true : false,
					autoplay = ( slider.data('auto') === true ) ? true : false,
					vertical = ( slider.data('direction') == 'vertical' ) ? true : false,
					eqslides = ( slider.data('eq-slides') === true ) ? true : false;

				slider.imagesLoaded( function() {
					slider.lightSlider({
						item: ( slider.data('items') > 1 ) ? slider.data('items') : 1,
						mode: ( slider.data('mode') == 'slide' ) ? 'slide' : 'fade',
						auto: autoplay,
						loop: loop,
						pause: ( slider.data('interval') > 0 ) ? slider.data('interval') : 5000,
						pager: ( slider.data('pagination') === true ) ? true : false,
						controls: ( slider.data('navigation') === true ) ? true : false,
						vertical: vertical,
						keyPress: true,
						slideMargin: 15,
						adaptiveHeight: ( eqslides === true ) ? false : true,
						responsive : [{
							breakpoint: 768,
							settings: { item: ( slider.data('items-tablet') > 1 ) ? slider.data('items-tablet') : 1 }
						}, {
							breakpoint: 480,
							settings: { item: ( slider.data('items-mobile') > 1 ) ? slider.data('items-mobile') : 1 }
						}],
						onSliderLoad: function(el) {
							var slides = slider.children('.lslide');
							if ( slider.data('lightbox') === true && typeof $.fn.lightGallery === 'function' ) {
								el.lightGallery({ selector: slides });
							}
							if ( ! vertical ) {
								slider.css('height', '');
								if ( eqslides && typeof $.fn.matchHeight === 'function' ) {
									slides.matchHeight();
								}
							}
						}
					});
				});
			});
		}


		// Lightbox Galleries
		if ( typeof $.fn.lightGallery === 'function' ) {
			$('.lightbox-gallery').lightGallery({
				download: false
			});

			$('.product-gallery').lightGallery({
				download: false,
				selector: '.product-gallery-thumb'
			});
		}


		// BigText
		if ( typeof $.fn.bigText === 'function' ) {
			$('.big-text').bigText();
		}


		// Placeholder Polyfill
		if ( typeof $.fn.placeholder === 'function' ) {
			$('input, textarea').placeholder();
		}

	}); // END RUN ON LOAD

}(jQuery));
