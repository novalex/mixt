
/* ------------------------------------------------ /
GLOBAL JS FUNCTIONS
/ ------------------------------------------------ */

( function($) {

	'use strict';

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
			content.css('min-height', viewport.height() - content.offset().top - $('#colophon').height());
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


		// BigText
		if ( typeof $.fn.bigText === 'function' ) {
			$('.big-text').bigText();
		}


		// Animate Elements On Load
		$('.anim-on-load').each( function() {
			var $this = $(this),
				delay = $this.data('anim-delay') ? $this.data('anim-delay') : 0;
			setTimeout( function() {
				$this.removeClass('anim-pre');
			}, delay);
		});


		// Placeholder Polyfill
		if ( typeof $.fn.placeholder === 'function' ) {
			$('input, textarea').placeholder();
		}

	}); // END RUN ON LOAD


	// STYLE SWITCHER

	// var styleSwitcher = {
	// 	el: $('#style-switcher'),
	// 	cookies: null,
	// 	cookiesExpire: null,

	// 	init: function() {
	// 		this.updateOptions();

	// 		this.el.children('.handle').on('click', function() { styleSwitcher.el.toggleClass('show'); });
	// 		this.el.children('.reset').on('click', function() { styleSwitcher.resetOptions(); });
	// 		$('#styler-layout input').on('change', function() { styleSwitcher.setLayout(); });
	// 		$('#styler-bg-pat input').on('change', function() { styleSwitcher.setBgPat(); });
	// 		$('#styler-theme input').on('change', function() { styleSwitcher.setTheme(); });
	// 		$('#styler-theme-elem').on('change', function() { styleSwitcher.setElemTheme(); });

	// 		var today = new Date();
	// 		this.cookiesExpire = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
	// 	},

	// 	updateOptions: function() {
	// 		var layout = this.getCookie('styler-layout'),
	// 			bgPat  = this.getCookie('styler-bg-pat'),
	// 			siteTheme = this.getCookie('styler-theme-main-wrap-inner'),
	// 			navTheme = this.getCookie('styler-theme-main-nav'),
	// 			secNavTheme = this.getCookie('styler-theme-second-nav'),
	// 			footerTheme = this.getCookie('styler-theme-colophon');
	// 		if ( layout ) {
	// 			this.setLayout(layout);
	// 			this.setChecked($('#styler-layout'), layout);
	// 		}
	// 		if ( bgPat ) {
	// 			this.setBgPat(bgPat);
	// 			this.setChecked($('#styler-bg-pat'), bgPat);
	// 		}
	// 		if ( siteTheme ) {
	// 			this.setTheme(siteTheme, 'main-wrap-inner');
	// 			this.setElemTheme();
	// 		}
	// 		if ( navTheme ) {
	// 			this.setTheme(navTheme, 'main-nav');
	// 			this.setElemTheme();
	// 		}
	// 		if ( secNavTheme ) {
	// 			this.setTheme(secNavTheme, 'second-nav');
	// 			this.setElemTheme();
	// 		}
	// 		if ( footerTheme ) {
	// 			this.setTheme(footerTheme, 'colophon');
	// 			this.setElemTheme();
	// 		}
	// 	},

	// 	resetOptions: function() {
	// 		styleSwitcher.setCookie('styler-layout', '');
	// 		styleSwitcher.setCookie('styler-bg-pat', '');
	// 		styleSwitcher.setCookie('styler-theme-main-wrap-inner', '');
	// 		styleSwitcher.setCookie('styler-theme-main-nav', '');
	// 		styleSwitcher.setCookie('styler-theme-second-nav', '');
	// 		styleSwitcher.setCookie('styler-theme-colophon', '');
	// 		location.reload();
	// 	},

	// 	setChecked: function($el, val) {
	// 		$('input[value="'+val+'"]', $el).attr('checked', 'checked')
	// 			.parent().addClass('active')
	// 			.siblings('.active').removeClass('active')
	// 			.children('input').removeAttr('checked');
	// 	},

	// 	getCookie: function(name, c, C, i) {
	// 		if ( styleSwitcher.cookies ) { return styleSwitcher.cookies[name]; }
	// 		c = document.cookie.split('; ');
	// 		styleSwitcher.cookies = {};

	// 		for ( i = c.length - 1; i >= 0; i-- ) {
	// 			C = c[i].split('=');
	// 			styleSwitcher.cookies[C[0]] = C[1];
	// 		}
	// 		return styleSwitcher.cookies[name];
	// 	},

	// 	setCookie: function(name, val) {
	// 		document.cookie = name + '=' + val + '; ' + styleSwitcher.cookiesExpire + '; path=/';
	// 	},

	// 	setLayout: function(layout) {
	// 		layout = layout || $('input[name="styler-layout"]:checked', styleSwitcher.el).val();

	// 		if ( layout == 'wide' ) {
	// 			bodyEl.removeClass('boxed');
	// 		} else {
	// 			bodyEl.addClass('boxed');
	// 		}
	// 		viewport.trigger('resize');
	// 		styleSwitcher.setCookie('styler-layout', layout);
	// 	},

	// 	setBgPat: function(bgPat) {
	// 		bgPat = bgPat || $('input[name="styler-bg-pat"]:checked', styleSwitcher.el).val();

	// 		if ( bgPat == '0' ) {
	// 			bodyEl.css('background-image', '');
	// 		} else {
	// 			bodyEl.css('background-image', 'url('+bgPat+')');
	// 		}
	// 		styleSwitcher.setCookie('styler-bg-pat', bgPat);
	// 	},

	// 	setTheme: function(newTheme, elem) {
	// 		elem = elem || $('#styler-theme-elem').val();
	// 		newTheme = newTheme || $('input[name="styler-theme"]:checked', styleSwitcher.el).val();

	// 		if ( elem == 'all' ) {
	// 			$.each(['main-wrap-inner', 'main-nav', 'second-nav', 'colophon'], function(index, elem) {
	// 				styleSwitcher.setTheme(newTheme, elem);
	// 			});
	// 		} else {
	// 			var $elem = $('#'+elem),
	// 				themeNow = $elem[0].className.match(/theme-([^\s]*)/)[1];	

	// 			if ( elem == 'main-wrap-inner' ) {
	// 				bodyEl.removeClass('body-theme-'+themeNow).addClass('body-theme-'+newTheme);
	// 			}
	// 			$elem.removeClass('theme-'+themeNow).addClass('theme-'+newTheme);
	// 			if ( elem == 'main-nav' || elem == 'second-nav' ) {
	// 				$elem.trigger('refresh');
	// 			}
	// 			styleSwitcher.setCookie('styler-theme-' + elem, newTheme);
	// 		}
	// 	},

	// 	setElemTheme: function() {
	// 		var elem  = $('#styler-theme-elem').val(),
	// 			$elem = ( elem == 'all' ) ? $('#main-wrap-inner') : $('#'+elem),
	// 			theme = $elem[0].className.match(/theme-([^\s]*)/)[1];

	// 		styleSwitcher.setChecked($('#styler-theme'), theme);
	// 	}
	// };
	// styleSwitcher.init();

}(jQuery));
