
/* ------------------------------------------------ /
GLOBAL JS FUNCTIONS
/ ------------------------------------------------ */

(function ($) {

	'use strict';

	/* global mixt_opt */

	var viewport = $(window),
		bodyEl   = $('body');


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
			content.css('min-height', viewport.height() - content.offset().top - $('#colophon').outerHeight(true));
		}
		
		// One-Page Navigation
		if ( bodyEl.hasClass('one-page') ) {
			$('.one-page-row').each( function() {
				var row = $(this);

				if ( row.is(':first-child') ) {
					var pageContent = $('.page-content.one-page');
					row.css('padding-top', pageContent.css('margin-top'));
					pageContent.css('margin-top', 0);
				} else {
					var prevRow = row.prev();
					if ( ! prevRow.hasClass('row') ) prevRow = prevRow.prev('.row');

					row.css('padding-top', prevRow.css('margin-bottom'));
					prevRow.css('margin-bottom', 0);
				}
			});

			var onePageOffset = ( mixt_opt.nav.mode == 'fixed' ) ? $('#main-nav').outerHeight() : 1;

			bodyEl.scrollspy({
				target: '#main-nav',
				offset: onePageOffset
			});
		}


		// Skrollr Parallax
		if ( typeof skrollr !== 'undefined' ) { /* global skrollr */
			skrollr.init({
				forceHeight: false,
				smoothScrolling: false,
				mobileCheck: function () {
					return false;
				}
			});
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

	}); // END RUN ON LOAD


	// Functions To Run On Window Resize
	function resizeFn() {
		if ( typeof $.fn.matchHeight === 'function' ) {
			var mhElements = $('.cols-match-height .wpb_column');
			mhElements.matchHeight();
		}
	}
	viewport.resize( $.debounce( 500, resizeFn )).resize();

}(jQuery));
