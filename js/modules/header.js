
/* ------------------------------------------------ /
HEADER FUNCTIONS
/ ------------------------------------------------ */

+function ($) {

	'use strict';

	/* global mixt_opt */

	var viewport  = $(window),
		topNavBar = $('#top-nav'),
		mediaWrap = $('.head-media');

	// Head Media Functions
	function headerFn() {
		var container    = mediaWrap.children('.container'),
			mediaCont    = mediaWrap.children('.media-container'),
			topNavHeight = topNavBar.outerHeight(),
			wrapHeight   = mediaWrap.height(),
			hmHeight     = 0;

		if ( mixt_opt.header.fullscreen ) {
			mediaWrap.css('height', wrapHeight);
			
			hmHeight = viewport.height() - mediaWrap.offset().top;

			if ( mixt_opt.nav.position == 'below' && ! mixt_opt.nav.transparent ) { hmHeight -= topNavHeight; }

			mediaWrap.css('height', hmHeight);
			mediaCont.css('height', hmHeight);
		}

		if ( mixt_opt.nav.transparent && mediaCont.length == 1 ) {
			var containerPad = topNavHeight;

			if ( mixt_opt.nav.position == 'below' ) {
				container.css('padding-bottom', containerPad);
			} else {
				container.css('padding-top', containerPad);
			}
		}
	}

	// Header Fade Effect
	function headerFade() {
		var content = $('.container', mediaWrap),
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
	if ( mixt_opt.header['content-fade'] ) { headerFade(); }


	// Header Scroll To Content
	function headerScroll() {
		var page   = $('html, body'),
			offset = $('#content-wrap').offset().top;
		if ( mixt_opt.nav.mode == 'fixed' ) { offset -= topNavBar.children('.container').height(); }
		$('.header-scroll').on('click', function() {
			page.animate({ scrollTop: offset }, 800);
		});
	}

	if ( mixt_opt.header.enabled ) {
		headerFn();

		if ( mixt_opt.header.scroll ) { headerScroll(); }
		
		$(window).resize( $.debounce( 500, headerFn ));
	}

}(jQuery);