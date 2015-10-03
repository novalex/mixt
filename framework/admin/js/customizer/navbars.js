
/* ------------------------------------------------ /
CUSTOMIZER INTEGRATION - NAVBARS
/ ------------------------------------------------ */

( function($) {

	'use strict';

	/* global wp, MIXT, mixt_opt, mixt_customize */

	wp.customize('mixt_opt[nav-vertical-position]', function(value) {
		value.bind( function(to) {
			if ( to == 'left' ) {
				$('#main-wrap').removeClass('nav-right').addClass('nav-left');
			} else {
				$('#main-wrap').removeClass('nav-left').addClass('nav-right');
			}
		});
	});
	wp.customize('mixt_opt[logo-align]', function(value) {
		value.bind( function(to) {
			if ( to == '1' ) {
				$('#main-nav-wrap').removeClass('logo-center logo-right').addClass('logo-left').attr('data-logo-align', 'left');
			} else if ( to == '2' ) {
				$('#main-nav-wrap').removeClass('logo-left logo-right').addClass('logo-center').attr('data-logo-align', 'center');
			} else {
				$('#main-nav-wrap').removeClass('logo-center logo-left').addClass('logo-right').attr('data-logo-align', 'right');
			}
			navbarPadding();
		});
	});
	wp.customize('mixt_opt[nav-texture]', function( value ) {
		value.bind( function(to) {
			if ( to == '0' ) {
				$('#main-nav').css('background-image', 'none');
			} else {
				$('#main-nav').css('background-image', 'url("' + to + '")');
			}
		});
	});
	wp.customize('mixt_opt[sec-nav-texture]', function( value ) {
		value.bind( function(to) {
			if ( to == '0' ) {
				$('#second-nav').css('background-image', 'none');
			} else {
				$('#second-nav').css('background-image', 'url("' + to + '")');
			}
		});
	});

	function navbarPadding() {
		var css,
			sheet = MIXT.stylesheet('mixt-nav-padding');

		sheet.html('');

		var nav_height = parseInt($('#main-nav').height(), 10),
			padding = wp.customize('mixt_opt[nav-padding]').get(),
			fixed_padding = wp.customize('mixt_opt[nav-fixed-padding]').get(),
			nav_wrap_height = nav_height + padding * 2,
			fixed_wrap_height = nav_height + fixed_padding * 2,
			fixed_item_height = fixed_wrap_height,
			media_bp = mixt_customize.breakpoints.mars + 1,
			logo_center = $('#main-nav-wrap').attr('data-logo-align') == 'center';

		css = '@media ( min-width: '+media_bp+'px ) {';
			css += '.navbar-mixt { padding-top: '+padding+'px; padding-bottom: '+padding+'px; }';
			css += '.fixed-nav .navbar-mixt { padding-top: '+fixed_padding+'px; padding-bottom: '+fixed_padding+'px; }';
			if ( logo_center ) {
				var half_padding = fixed_padding / 2;
				fixed_item_height = fixed_item_height - nav_height / 2 - half_padding;
				css += '#main-nav-wrap.logo-center { min-height: '+nav_wrap_height+'px; }';
				css += '.fixed-nav #main-nav-wrap.logo-center { min-height: '+fixed_wrap_height+'px; }';
				css += '.fixed-nav .navbar-mixt .navbar-header { margin-top: -'+half_padding+'px; }';
				css += '.fixed-nav .navbar-mixt .nav > li { margin-top: '+half_padding+'px; margin-bottom: -'+fixed_padding+'px; }';
			} else {
				css += '#main-nav-wrap { min-height: '+nav_wrap_height+'px; }';
				css += '.fixed-nav #main-nav-wrap { min-height: '+fixed_wrap_height+'px; }';
				css += '.fixed-nav .navbar-mixt .nav > li { margin-top: -'+fixed_padding+'px; margin-bottom: -'+fixed_padding+'px; }';
			}
			css += '.fixed-nav .navbar-mixt .nav > li, .fixed-nav .navbar-mixt .nav > li > a { height: '+fixed_item_height+'px; line-height: '+fixed_item_height+'px; }';
		css += '}';

		sheet.html(css);
	}
	wp.customize('mixt_opt[nav-padding]', function(value) {
		value.bind( function() { navbarPadding(); });
	});
	wp.customize('mixt_opt[nav-fixed-padding]', function(value) {
		value.bind( function() { navbarPadding(); });
	});

	wp.customize('mixt_opt[nav-opacity]', function(value) {
		value.bind( function(to) {
			mixt_opt.nav.opacity = to;
			$('#main-nav').trigger('refresh');
		});
	});
	wp.customize('mixt_opt[nav-top-opacity]', function(value) {
		value.bind( function(to) {
			mixt_opt.nav['top-opacity'] = to;
			$('#main-nav').trigger('refresh');
		});
	});
	wp.customize('mixt_opt[nav-transparent]', function(value) {
		value.bind( function(to) {
			if ( to == '1' && wp.customize('mixt_opt[head-media]').get() == '1' ) {
				$('#main-wrap').addClass('nav-transparent');
				mixt_opt.nav.transparent = true;
			} else {
				$('#main-wrap').removeClass('nav-transparent');
				mixt_opt.nav.transparent = false;
			}
			$('#main-nav').trigger('refresh');
		});
	});

	wp.customize('mixt_opt[nav-hover-bg]', function(value) {
		value.bind( function(to) {
			if ( to == '0' ) {
				$('#main-nav').addClass('no-hover-bg');
			} else {
				$('#main-nav').removeClass('no-hover-bg');
			}
		});
	});
	wp.customize('mixt_opt[sec-nav-hover-bg]', function(value) {
		value.bind( function(to) {
			if ( to == '0' ) {
				$('#second-nav').addClass('no-hover-bg');
			} else {
				$('#second-nav').removeClass('no-hover-bg');
			}
		});
	});

	function navbarActiveBar(navbar, enabled, position) {
		navbar.removeClass('active-top active-bottom active-left active-right');
		if ( enabled ) {
			navbar.removeClass('no-active').addClass('active-'+position);
		} else {
			navbar.addClass('no-active');
		}
	}
	wp.customize('mixt_opt[nav-active-bar]', function(value) {
		value.bind( function(to) {
			var enabled = to == '1',
				position = wp.customize('mixt_opt[nav-active-bar-pos]').get();
			navbarActiveBar($('#main-nav .nav'), enabled, position);
		});
	});
	wp.customize('mixt_opt[nav-active-bar-pos]', function(value) {
		value.bind( function(to) {
			var enabled = wp.customize('mixt_opt[nav-active-bar]').get() == '1';
			navbarActiveBar($('#main-nav .nav'), enabled, to);
		});
	});
	wp.customize('mixt_opt[sec-nav-active-bar]', function(value) {
		value.bind( function(to) {
			var enabled = to == '1',
				position = wp.customize('mixt_opt[sec-nav-active-bar-pos]').get();
			navbarActiveBar($('#second-nav .nav'), enabled, position);
		});
	});
	wp.customize('mixt_opt[sec-nav-active-bar-pos]', function(value) {
		value.bind( function(to) {
			var enabled = wp.customize('mixt_opt[sec-nav-active-bar]').get() == '1';
			navbarActiveBar($('#second-nav .nav'), enabled, to);
		});
	});

	wp.customize('mixt_opt[nav-bordered]', function(value) {
		value.bind( function(to) {
			if ( to == '1' ) {
				$('#main-nav').addClass('bordered');
			} else {
				$('#main-nav').removeClass('bordered');
			}
		});
	});
	wp.customize('mixt_opt[sec-nav-bordered]', function(value) {
		value.bind( function(to) {
			if ( to == '1' ) {
				$('#second-nav').addClass('bordered');
			} else {
				$('#second-nav').removeClass('bordered');
			}
		});
	});

	wp.customize('mixt_opt[sec-nav-left-code]', function(value) {
		value.bind( function(to) {
			$('#second-nav .left .code-inner').html(to);
		});
	});
	wp.customize('mixt_opt[sec-nav-left-hide]', function(value) {
		value.bind( function(to) {
			var nav = $('#second-nav');
			if ( to == '1' ) {
				nav.find('.left').addClass('hidden-xs');
				if ( wp.customize('mixt_opt[sec-nav-right-hide]').get() == '1' ) nav.addClass('hidden-xs');
			} else {
				nav.removeClass('hidden-xs');
				nav.find('.left').removeClass('hidden-xs');
			}
		});
	});
	wp.customize('mixt_opt[sec-nav-right-code]', function(value) {
		value.bind( function(to) {
			$('#second-nav .right .code-inner').html(to);
		});
	});
	wp.customize('mixt_opt[sec-nav-right-hide]', function(value) {
		value.bind( function(to) {
			var nav = $('#second-nav');
			if ( to == '1' ) {
				nav.find('.right').addClass('hidden-xs');
				if ( wp.customize('mixt_opt[sec-nav-left-hide]').get() == '1' ) nav.addClass('hidden-xs');
			} else {
				nav.removeClass('hidden-xs');
				nav.find('.right').removeClass('hidden-xs');
			}
		});
	});

})(jQuery);