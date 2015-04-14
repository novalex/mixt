
/* ------------------------------------------------ /
HEADER FUNCTIONS
/ ------------------------------------------------ */

+function ($) {

	'use strict';

	/* global mixt_opt */

	var viewport  = $(window),
		topNavBar = $('#top-nav'),
		mediaWrap = $('.head-media');

	// HEAD MEDIA FUNCTIONS

	function headerFn() {
		var container    = mediaWrap.children('.container'),
			mediaCont    = mediaWrap.children('.media-container'),
			topNavHeight = topNavBar.outerHeight(),
			wrapHeight   = mediaWrap.height(),
			hmHeight     = 0;

		if ( mixt_opt['head-fullscreen'] == 'true' ) {
			mediaWrap.css('height', wrapHeight);
			
			hmHeight = viewport.height() - mediaWrap.offset().top;

			if ( mixt_opt['nav-position'] == 'below' && mixt_opt['nav-transparent'] == 'false' ) { hmHeight -= topNavHeight; }

			mediaWrap.css('height', hmHeight);
			mediaCont.css('height', hmHeight);
		}

		if ( mixt_opt['nav-transparent'] == 'true' && mediaCont.length == 1 ) {
			var containerPad = topNavHeight;

			if ( mixt_opt['nav-position'] == 'below' ) {
				container.css('padding-bottom', containerPad);
			} else {
				container.css('padding-top', containerPad);
			}
		}
	}

	// Header Fade & Parallax

	function headScroll() {
		var header  = $('.head-media'),
			content = $('.container', header),
			contH   = content.innerHeight(),
			scrollE = $.throttle( 100, scrollHandler );

		function scrollHandler() {
			var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			if ( scrollTop > contH ) {
				content.css({
					'opacity': 0,
					'-webkit-transform': 'translate(0px,0px)',
				    '-ms-transform': 'translate(0px,0px)',
				    'transform': 'translate(0px,0px)'
				});
			} else {
				var translate = 'translate(0px, ' + ( scrollTop / 3 ) + 'px)';
				content.css({
					'opacity': 1 - scrollTop / (contH / 1.2),
					'-webkit-transform': translate,
				    '-ms-transform': translate,
				    'transform': translate
				});
			}
		}

		$(window).on('scroll', scrollE);
	}

	if ( mixt_opt['head-content-fade'] == 'true' ) { headScroll(); }

	if ( mixt_opt['head-media'] == 'true' ) {
		headerFn();
		
		$(window).resize( $.debounce( 500, headerFn ));
	}

}(jQuery);