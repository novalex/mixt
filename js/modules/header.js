
/* ------------------------------------------------ /
HEADER FUNCTIONS
/ ------------------------------------------------ */

+function ($) {

	'use strict';

	var viewport   = $(window),
		mainWrap   = $('#main-wrap'),
		topNavBar  = $('#top-nav');

	// HEAD MEDIA FUNCTIONS

	function headerFn() {
		var mediaWrap    = $('.head-media'),
			container    = mediaWrap.children('.container'),
			mediaCont    = mediaWrap.children('.media-container'),
			topNavHeight = topNavBar.outerHeight(),
			wrapHeight   = mediaWrap.height();

		if ( mainWrap.hasClass('full-height') ) {
			var hmHeight = viewport.height() - mediaWrap.offset().top;

			if ( mainWrap.hasClass('nav-below-header') && ! mainWrap.hasClass('nav-transparent') ) {
				hmHeight -= topNavHeight;
			}
			mediaWrap.css('height', hmHeight);
			mediaCont.css('height', hmHeight);
		} else {
			mediaWrap.css('height', wrapHeight);
			mediaCont.css('height', wrapHeight);
		}

		if ( mainWrap.is('.has-head-media.nav-transparent') && mediaCont.length == 1 ) {
			var containerPad = topNavHeight;
			
			if ( mediaWrap.hasClass('text-dark') ) {
				topNavBar.addClass('text-dark').removeClass('text-light');
			} else {
				topNavBar.addClass('text-light').removeClass('text-dark');
			}

			if ( mainWrap.hasClass('nav-below-header') ) {
				container.css('padding-bottom', containerPad);
			} else {
				container.css('padding-top', containerPad);
			}
		}
	}

	$(window).resize( $.debounce( 500, headerFn ));

	$(document).ready( function() {
		headerFn();
	});

}(jQuery);