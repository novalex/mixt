
/* ------------------------------------------------ /
HEADER FUNCTIONS
/ ------------------------------------------------ */

( function($) {

	'use strict';

	/* global mixt_opt */

	var viewport  = $(window),
		mainNavBar = $('#main-nav'),
		mediaWrap = $('.head-media');

	// Head Media Functions
	function headerFn() {
		var container    = mediaWrap.children('.container'),
			mediaCont    = mediaWrap.children('.media-container'),
			topNavHeight = mainNavBar.outerHeight(),
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

	// Header Scroll To Content
	function headerScroll() {
		var page   = $('html, body'),
			offset = $('#content-wrap').offset().top;
		if ( mixt_opt.nav.mode == 'fixed' ) { offset -= mainNavBar.children('.container').height(); }
		$('.header-scroll').on('click', function() {
			page.animate({ scrollTop: offset }, 800);
		});
	}

	if ( mixt_opt.header.enabled ) {
		headerFn();

		if ( mixt_opt.header.scroll ) { headerScroll(); }
		
		$(window).resize( $.debounce( 500, headerFn ));
	}

})(jQuery);