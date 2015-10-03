
/* ------------------------------------------------ /
CUSTOMIZER INTEGRATION - HEADER
/ ------------------------------------------------ */

( function($) {

	'use strict';

	/* global wp, MIXT, tinycolor */

	wp.customize('mixt_opt[head-bg-color]', function(value) {
		value.bind( function(to) {
			$('.head-media .media-container').css('background-color', to);
			if ( tinycolor(to).isLight() ) {
				$('.head-media').removeClass('bg-dark').addClass('bg-light');
			} else {
				$('.head-media').removeClass('bg-light').addClass('bg-dark');
			}
		});
	});

	function updateHeaderText() {
		var css = '',
			hm = '.head-media',
			color = wp.customize('mixt_opt[head-text-color]').get(),
			color_inv = wp.customize('mixt_opt[head-inv-text-color]').get();
		if ( color != '' ) {
			var hm_light = hm+'.bg-light';
			css += hm_light+' .container, '+hm_light+' .media-inner > a, '+hm_light+' .header-scroll, '+hm_light+' #breadcrumbs > li + li:before { color: '+color+' !important; }';
		}
		if ( color_inv != '' ) {
			var hm_dark = hm+'.bg-dark';
			css += hm_dark+' .container, '+hm_dark+' .media-inner > a, '+hm_dark+' .header-scroll, '+hm_dark+' #breadcrumbs > li + li:before { color: '+color_inv+' !important; }';
		}
		MIXT.stylesheet('mixt-header', css);
	}
	wp.customize('mixt_opt[head-text-color]', function(value) {
		value.bind( function() {
			updateHeaderText();
		});
	});
	wp.customize('mixt_opt[head-inv-text-color]', function(value) {
		value.bind( function() {
			updateHeaderText();
		});
	});

	wp.customize('mixt_opt[loc-bar-bg-color]', function(value) {
		value.bind( function(to) {
			$('#location-bar').css('background-color', to);
		});
	});
	wp.customize('mixt_opt[loc-bar-bg-pat]', function( value ) {
		value.bind( function(to) {
			if ( to == '0' ) {
				$('#location-bar').css('background-image', 'none');
			} else {
				$('#location-bar').css('background-image', 'url("' + to + '")');
			}
		});
	});
	wp.customize('mixt_opt[loc-bar-text-color]', function(value) {
		value.bind( function(to) {
			var css = '#location-bar, #location-bar a:hover, #location-bar li:before { color: '+to+'; }';
			MIXT.stylesheet('mixt-loc-bar', css);
		});
	});
	wp.customize('mixt_opt[loc-bar-border-color]', function(value) {
		value.bind( function(to) {
			$('#location-bar').css('border-color', to);
		});
	});
	wp.customize('mixt_opt[breadcrumbs-prefix]', function(value) {
		value.bind( function(to) {
			var bc_prefix = $('#breadcrumbs .bc-prefix');
			if ( bc_prefix.length === 0 ) bc_prefix = $('<li class="bc-prefix"></li>').prependTo($('#breadcrumbs'));
			bc_prefix.html(to);
		});
	});

})(jQuery);