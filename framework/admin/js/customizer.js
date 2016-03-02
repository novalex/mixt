
/* ------------------------------------------------ /
CUSTOMIZER INTEGRATION - FOOTER
/ ------------------------------------------------ */

( function($) {

	'use strict';

	/* global wp */

	wp.customize('mixt_opt[footer-widgets-bg-color]', function(value) {
		value.bind( function(to) {
			$('#colophon .widget-row').css('background-color', to);
		});
	});
	wp.customize('mixt_opt[footer-widgets-bg-pat]', function( value ) {
		value.bind( function(to) {
			if ( to == '0' ) {
				$('#colophon .widget-row').css('background-image', 'none');
			} else {
				$('#colophon .widget-row').css('background-image', 'url("' + to + '")');
			}
		});
	});
	wp.customize('mixt_opt[footer-widgets-text-color]', function( value ) {
		value.bind( function(to) {
			$('#colophon .widget-row').css('color', to);
		});
	});
	wp.customize('mixt_opt[footer-widgets-border-color]', function( value ) {
		value.bind( function(to) {
			$('#colophon .widget-row').css('border-color', to);
		});
	});

	wp.customize('mixt_opt[footer-copy-bg-color]', function(value) {
		value.bind( function(to) {
			$('#colophon .copyright-row').css('background-color', to);
		});
	});
	wp.customize('mixt_opt[footer-copy-bg-pat]', function( value ) {
		value.bind( function(to) {
			if ( to == '0' ) {
				$('#colophon .copyright-row').css('background-image', 'none');
			} else {
				$('#colophon .copyright-row').css('background-image', 'url("' + to + '")');
			}
		});
	});
	wp.customize('mixt_opt[footer-copy-text-color]', function( value ) {
		value.bind( function(to) {
			$('#colophon .copyright-row').css('color', to);
		});
	});
	wp.customize('mixt_opt[footer-copy-border-color]', function( value ) {
		value.bind( function(to) {
			$('#colophon .copyright-row').css('border-color', to);
		});
	});
	wp.customize('mixt_opt[footer-left-code]', function( value ) {
		var date = new Date(),
			year = date.getFullYear();
		value.bind( function(to) {
			to = to.replace(/\{\{year\}\}/g, year);
			$('#colophon .left-content .content-code').html(to);
		});
	});
	wp.customize('mixt_opt[footer-right-code]', function( value ) {
		var date = new Date(),
			year = date.getFullYear();
		value.bind( function(to) {
			to = to.replace(/\{\{year\}\}/g, year);
			$('#colophon .right-content .content-code').html(to);
		});
	});

})(jQuery);

/* ------------------------------------------------ /
CUSTOMIZER INTEGRATION - GLOBAL
/ ------------------------------------------------ */

'use strict';

window.MIXT = {
	stylesheet: function(id, css) {
		css = css || false;
		var sheet = jQuery('style[data-id="'+id+'"]');
		if ( sheet.length === 0 ) sheet = jQuery('<style data-id="'+id+'">').appendTo(jQuery('head'));
		if ( css ) {
			sheet.html(css);
		} else {
			return sheet;
		}
	}
};

( function($) {

	/* global _, wp */

	wp.customize('mixt_opt[site-layout]', function(value) {
		value.bind( function(to) {
			if ( $('#main-wrap').hasClass('nav-vertical') ) {
				wp.customize.preview.send('refresh');
				return;
			}
			if ( to == 'wide' ) {
				$('body').removeClass('boxed');
			} else {
				$('body').addClass('boxed');
			}
			$(window).trigger('resize');
		});
	});

	wp.customize('mixt_opt[site-bg-color]', function(value) {
		value.bind( function(to) {
			$('body').css('background-color', to);
		});
	});

	wp.customize('mixt_opt[site-bg-pat]', function( value ) {
		value.bind( function(to) {
			if ( to == '0' ) {
				$('body').css('background-image', 'none');
			} else {
				$('body').css('background-image', 'url("' + to + '")');
			}
		});
	});
	
	// Page Loader
		
		var pageLoader = {
			loader: '',
			loadInner: '',
			enabled: false,
			setup: false,
			init: function() {
				this.setup = true;
				this.enabled = wp.customize('mixt_opt[page-loader]').get();
				if ( this.enabled ) $('body').addClass('loading');
				if ( $('#load-overlay').length === 0 ) $('body').append('<div id="load-overlay"><div class="load-inner"></div></div>');
				this.loader = $('#load-overlay');
				this.loadInner = this.loader.children('.load-inner');
				this.loadShape();
				this.handle(wp.customize('mixt_opt[page-loader-bg]').get(), 'bg');
				this.loader.append('<button id="loader-close" class="btn btn-red btn-lg" style="position: absolute; top: 20px; right: 20px;">&times;</button>');
				this.loader.on('click', '#loader-close', function() { $('body').removeClass('loading'); });
			},
			loadShape: function() {
				var classes = 'loader',
					loader  = '',
					type    = wp.customize('mixt_opt[page-loader-type]').get(),
					shape   = wp.customize('mixt_opt[page-loader-shape]').get(),
					img     = wp.customize('mixt_opt[page-loader-img]').get(),
					anim    = wp.customize('mixt_opt[page-loader-anim]').get();
				if ( anim != 'none' ) classes += ' animated infinite ' + anim;
				if ( type == 1 ) {
					loader = '<div class="' + classes + ' ' + shape + '"></div>';
				} else if ( ! _.isEmpty(img.url) ) {
					loader = '<img src="' + img.url + '" alt="Loading..." class="' + classes + '">';
				} else {
					loader = '<div class="ring ' + classes + '"></div>';
				}
				this.loadInner.html(loader);
				this.handle(wp.customize('mixt_opt[page-loader-color]').get(), 'color');
			},
			handle: function(value, type) {
				if ( ( type != 'switch' || value == '1' ) && ! this.setup ) { this.init(); }
				if ( type == 'switch' ) {
					if ( value == '0' ) {
						this.enabled = false;
						$('body').removeClass('loading');
					} else {
						this.enabled = true;
						$('body').addClass('loading');
						this.loader.find('.loader').show();
					}
				} else if ( this.enabled ) {
					if ( type == 'color' ) {
						this.loadInner.children('.ring, .square2').css('border-color', value);
						this.loadInner.children('.circle, .square').css('background-color', value);
					} else if ( type == 'bg' ) {
						this.loader.css('background-color', value);
					} else {
						this.loadShape();
					}
				}
			},
		};

		wp.customize('mixt_opt[page-loader]', function(value) {
			value.bind( function(to) { pageLoader.handle(to, 'switch'); });
		});
		wp.customize('mixt_opt[page-loader-type]', function(value) {
			value.bind( function() { pageLoader.handle(null, 'type'); });
		});
		wp.customize('mixt_opt[page-loader-shape]', function(value) {
			value.bind( function() { pageLoader.handle(null, 'shape'); });
		});
		wp.customize('mixt_opt[page-loader-color]', function(value) {
			value.bind( function(to) { pageLoader.handle(to, 'color'); });
		});
		wp.customize('mixt_opt[page-loader-img]', function(value) {
			value.bind( function() { pageLoader.handle(null, 'img'); });
		});
		wp.customize('mixt_opt[page-loader-bg]', function(value) {
			value.bind( function(to) { pageLoader.handle(to, 'bg'); });
		});
		wp.customize('mixt_opt[page-loader-anim]', function(value) {
			value.bind( function() { pageLoader.handle(null, 'anim'); });
		});

})(jQuery);

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

/* ------------------------------------------------ /
CUSTOMIZER INTEGRATION - LOGO
/ ------------------------------------------------ */

( function($) {

	'use strict';

	/* global _, wp, MIXT, mixt_customize */

	function updateLogo() {
		var html = '',
			css = '',
			type = wp.customize('mixt_opt[logo-type]').get(),
			img = wp.customize('mixt_opt[logo-img]').get(),
			text = wp.customize('mixt_opt[logo-text]').get() || wp.customize('blogname').get(),
			shrink = wp.customize('mixt_opt[logo-shrink]').get(),
			show_tag = wp.customize('mixt_opt[logo-show-tagline]').get();

		// Image Logo
		if ( type == 'img' && ! _.isEmpty(img.url) ) {
			var width = img.width,
				img_inv = wp.customize('mixt_opt[logo-img-inv]').get(),
				hires = wp.customize('mixt_opt[logo-img-hr]').get() == '1',
				shrink_width;

			if ( ! _.isEmpty(img_inv.url) ) {
				html += '<img class="logo-img logo-light" src="'+img.url+'" alt="'+text+'">';
				html += '<img class="logo-img logo-dark" src="'+img_inv.url+'" alt="'+text+'">';
			} else {
				html += '<img class="logo-img" src="'+img.url+'" alt="'+text+'">';
			}

			if ( hires ) {
				width = width / 2;
			}

			css += '.navbar-mixt #nav-logo img { max-width: '+width+'px; }';

			// Logo Shrink
			shrink_width = ( shrink != '0' ) ? width - shrink : width;
			css += '.fixed-nav .navbar-mixt #nav-logo img { max-width: '+shrink_width+'px; }';

		// Text Logo
		} else {
			var color = wp.customize('mixt_opt[logo-text-color]').get(),
				color_inv = wp.customize('mixt_opt[logo-text-inv]').get(),
				text_typo = mixt_customize.logo['text-typo'],
				shrink_size;

			html += '<strong>'+text+'</strong>';

			css += '#nav-logo strong {';
				css += 'color: '+color+';';
				css += 'font-size: '+text_typo['font-size']+';';
				css += 'font-family: '+text_typo['font-family']+';';
				css += 'font-weight: '+text_typo['font-weight']+';';
				css += 'text-transform: '+text_typo['text-transform']+';';
			css += '}';
			css += '.bg-dark #nav-logo strong { color: '+color_inv+'; }';

			// Logo Shrink
			if ( shrink != '0' ) {
				shrink_size = ( parseInt(text_typo['font-size'], 10) - shrink ) + 'px';

				css += '.fixed-nav #nav-logo strong { font-size: '+shrink_size+'; }';
			}
		}

		// Tagline
		if ( show_tag == '1' ) {
			var tagline = wp.customize('mixt_opt[logo-tagline]').get() || wp.customize('blogdescription').get(),
				tag_color = wp.customize('mixt_opt[logo-tagline-color]').get(),
				tag_color_inv = wp.customize('mixt_opt[logo-tagline-inv]').get(),
				tag_typo = mixt_customize.logo['tagline-typo'];

			if ( tagline != '' ) {
				html += '<small>' + tagline + '</small>';
			}

			css += '#nav-logo small {';
				css += 'color: '+tag_color+';';
				css += 'font-size: '+tag_typo['font-size']+';';
				css += 'font-family: '+tag_typo['font-family']+';';
				css += 'font-weight: '+tag_typo['font-weight']+';';
				css += 'text-transform: '+tag_typo['text-transform']+';';
			css += '}';
			css += '.bg-dark #nav-logo small { color: '+tag_color_inv+'; }';
		}

		$('#nav-logo').html(html);

		MIXT.stylesheet('mixt-logo', css);
	}

	wp.customize('blogname', function(value) {
		value.bind( function() { updateLogo(); });
	});
	wp.customize('blogdescription', function(value) {
		value.bind( function() { updateLogo(); });
	});

	wp.customize('mixt_opt[logo-type]', function(value) {
		value.bind( function() { updateLogo(); });
	});
	wp.customize('mixt_opt[logo-img]', function(value) {
		value.bind( function() { updateLogo(); });
	});
	wp.customize('mixt_opt[logo-img-inv]', function(value) {
		value.bind( function() { updateLogo(); });
	});
	wp.customize('mixt_opt[logo-img-hr]', function(value) {
		value.bind( function() { updateLogo(); });
	});
	wp.customize('mixt_opt[logo-text]', function(value) {
		value.bind( function() { updateLogo(); });
	});
	wp.customize('mixt_opt[logo-text-color]', function(value) {
		value.bind( function() { updateLogo(); });
	});
	wp.customize('mixt_opt[logo-text-inv]', function(value) {
		value.bind( function() { updateLogo(); });
	});
	wp.customize('mixt_opt[logo-shrink]', function(value) {
		value.bind( function() { updateLogo(); });
	});
	wp.customize('mixt_opt[logo-show-tagline]', function(value) {
		value.bind( function() {
			updateLogo();
			$(window).trigger('resize');
		});
	});
	wp.customize('mixt_opt[logo-tagline]', function(value) {
		value.bind( function() { updateLogo(); });
	});
	wp.customize('mixt_opt[logo-tagline-color]', function(value) {
		value.bind( function() { updateLogo(); });
	});
	wp.customize('mixt_opt[logo-tagline-inv]', function(value) {
		value.bind( function() { updateLogo(); });
	});

})(jQuery);

/* ------------------------------------------------ /
CUSTOMIZER INTEGRATION - NAVBARS
/ ------------------------------------------------ */

( function($) {

	'use strict';

	/* global wp, MIXT, mixt_opt */

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
				$('#main-nav-wrap, .head-media').removeClass('logo-center logo-right').addClass('logo-left').attr('data-logo-align', 'left');
			} else if ( to == '2' ) {
				$('#main-nav-wrap, .head-media').removeClass('logo-left logo-right').addClass('logo-center').attr('data-logo-align', 'center');
			} else {
				$('#main-nav-wrap, .head-media').removeClass('logo-center logo-left').addClass('logo-right').attr('data-logo-align', 'right');
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
		var css = '',
			sheet = MIXT.stylesheet('mixt-nav-padding');

		sheet.html('');

		var nav_item_height = parseInt($('#main-nav .navbar-header').height(), 10),
			padding = wp.customize('mixt_opt[nav-padding]').get(),
			nav_height = nav_item_height + padding * 2 + 1,
			nav_center_height = nav_height + nav_item_height,
			fixed_padding = wp.customize('mixt_opt[nav-fixed-padding]').get(),
			half_padding = fixed_padding / 2,
			fixed_nav_height = nav_item_height + fixed_padding * 2,
			fixed_center_nav_height = fixed_nav_height + nav_item_height,
			fixed_center_item_height = fixed_nav_height - fixed_padding;

		css += '.navbar-mixt { padding-top: '+padding+'px; padding-bottom: '+padding+'px; }\n';

		css += '.nav-full #main-nav-wrap, .nav-full .head-media { min-height: '+nav_height+'px; }\n';
		css += '.nav-full #main-nav-wrap.logo-center, .nav-full .head-media.logo-center { min-height: '+nav_center_height+'px; }\n';

		css += '#main-wrap.nav-full.nav-transparent .head-media .container { padding-top: '+nav_height+'px; }\n';
		css += '#main-wrap.nav-full.nav-transparent .head-media.logo-center .container { padding-top: '+nav_center_height+'px; }\n';
		css += '#main-wrap.nav-full.nav-transparent.nav-below .head-media .container { padding-bottom: '+nav_height+'px; }\n';
		css += '#main-wrap.nav-full.nav-transparent.nav-below .head-media.logo-center .container { padding-bottom: '+nav_center_height+'px; }\n';
		css += '#main-wrap.nav-full.nav-transparent.nav-below .navbar-mixt.position-top { margin-top: -'+nav_height+'px; }\n';
		css += '#main-wrap.nav-full.nav-transparent.nav-below .logo-center .navbar-mixt.position-top { margin-top: -'+nav_center_height+'px; }\n';

		// FIXED NAV

		css += '.fixed-nav .nav-full #main-nav-wrap { min-height: '+fixed_nav_height+'px; }\n';
		css += '.fixed-nav .nav-full .navbar-mixt { padding-top: '+fixed_padding+'px; padding-bottom: '+fixed_padding+'px; }\n';

		css += '.fixed-nav .nav-full .navbar-mixt .nav > li { margin-top: -'+fixed_padding+'px; margin-bottom: -'+fixed_padding+'px; }\n';
		css += '.fixed-nav .nav-full .navbar-mixt .nav > li, .fixed-nav .nav-full .navbar-mixt .nav > li > a { height: '+fixed_nav_height+'px; line-height: '+(fixed_nav_height - 3)+'px; }\n';
		
		css += '.fixed-nav .nav-full #main-nav-wrap.logo-center { min-height: '+fixed_center_nav_height+'px; }\n';
		css += '.fixed-nav .nav-full .logo-center .navbar-mixt .navbar-header { margin-top: -'+half_padding+'px; }\n';
		css += '.fixed-nav .nav-full .logo-center .navbar-mixt .nav > li { margin-top: '+half_padding+'px; margin-bottom: -'+fixed_padding+'px; }\n';
		css += '.fixed-nav .nav-full .logo-center .navbar-mixt .nav > li, .fixed-nav .nav-full .logo-center .navbar-mixt .nav > li > a { height: '+fixed_center_item_height+'px; line-height: '+(fixed_center_item_height - 3)+'px; }\n';

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
			$('#second-nav .left-content .code-inner').html(to);
		});
	});
	wp.customize('mixt_opt[sec-nav-left-hide]', function(value) {
		value.bind( function(to) {
			var nav = $('#second-nav');
			if ( to == '1' ) {
				nav.find('.left-content').addClass('hidden-xs');
				if ( wp.customize('mixt_opt[sec-nav-right-hide]').get() == '1' ) nav.addClass('hidden-xs');
			} else {
				nav.removeClass('hidden-xs');
				nav.find('.left-content').removeClass('hidden-xs');
			}
		});
	});
	wp.customize('mixt_opt[sec-nav-right-code]', function(value) {
		value.bind( function(to) {
			$('#second-nav .right-content .code-inner').html(to);
		});
	});
	wp.customize('mixt_opt[sec-nav-right-hide]', function(value) {
		value.bind( function(to) {
			var nav = $('#second-nav');
			if ( to == '1' ) {
				nav.find('.right-content').addClass('hidden-xs');
				if ( wp.customize('mixt_opt[sec-nav-left-hide]').get() == '1' ) nav.addClass('hidden-xs');
			} else {
				nav.removeClass('hidden-xs');
				nav.find('.right-content').removeClass('hidden-xs');
			}
		});
	});

})(jQuery);

/* ------------------------------------------------ /
CUSTOMIZER INTEGRATION - THEMES
/ ------------------------------------------------ */

'use strict';

/* global wp, MIXT */

MIXT.themes = {
	regex: /theme-([^\s]*)/,
	site: null,
	nav: null,
	secNav: null,
	footer: null,
	setup: false,
	init: function() {
		if ( ! this.setup ) {
			this.site = jQuery('#main-wrap-inner')[0].className.match(this.regex)[1];
			this.nav = jQuery('#main-nav')[0].className.match(this.regex)[1];
			if ( jQuery('#second-nav').length ) this.secNav = jQuery('#second-nav')[0].className.match(this.regex)[1];
			this.footer = jQuery('#colophon')[0].className.match(this.regex)[1];
			
			this.setup = true;
		}
	},
	setTheme: function(elem, theme) {
		if ( elem.length === 0 ) return;
		if ( theme == 'auto' ) {
			theme = this.site;
			elem.attr('data-theme', 'auto');
		} else {
			elem.removeAttr('data-theme');
		}
		elem[0].className = elem[0].className.replace(this.regex, 'theme-' + theme);
		elem.trigger('refresh').trigger('theme-change', theme);
	}
};

( function($) {
	
	var themes = MIXT.themes;

	themes.init();

	$(document).ready( function() {
		if ( wp.customize('mixt_opt[nav-theme]').get() == 'auto' ) {
			themes.nav = themes.site;
			$('#main-nav').attr('data-theme', 'auto');
		}
		if ( $('#second-nav').length && wp.customize('mixt_opt[sec-nav-theme]').get() == 'auto' ) {
			themes.secNav = themes.site;
			$('#second-nav').attr('data-theme', 'auto');
		}
		if ( wp.customize('mixt_opt[footer-theme]').get() == 'auto' ) {
			themes.footer = themes.site;
			$('#colophon').attr('data-theme', 'auto');
		}
	});
	
	wp.customize('mixt_opt[site-theme]', function(value) {
		value.bind( function(to) {
			themes.site = to;
			var elems = $('body, #main-wrap-inner, [data-theme="auto"]');
			elems.each( function() {
				$(this)[0].className = $(this)[0].className.replace(themes.regex, 'theme-' + to);
				$(this).trigger('refresh').trigger('theme-change', to);
			});
		});
	});

	wp.customize('mixt_opt[nav-theme]', function(value) {
		value.bind( function(to) {
			themes.nav = to;
			themes.setTheme($('#main-nav'), to);
		});
	});
	wp.customize('mixt_opt[sec-nav-theme]', function(value) {
		value.bind( function(to) {
			themes.secNav = to;
			themes.setTheme($('#second-nav'), to);
		});
	});
	wp.customize('mixt_opt[footer-theme]', function(value) {
		value.bind( function(to) {
			themes.footer = to;
			themes.setTheme($('#colophon'), to);
		});
	});

})(jQuery);

/* ------------------------------------------------ /
CUSTOMIZER INTEGRATION - NAV THEMES
/ ------------------------------------------------ */

( function($) {

	'use strict';

	/* global _, wp, MIXT, mixt_customize, tinycolor */

	if ( ! mixt_customize['themes-enabled'] ) return;
	
	var defaults = {
		'accent':     '#dd3e3e',
		'bg':         '#fff',
		'color':      '#333',
		'color-inv':  '#fff',
		'border':     '#ddd',
		'border-inv': '#333',
	};

	var themes = MIXT.themes;
	
	function updateNavThemes(data) {
		$.each(data, function(id, theme) {
			var css;

			// Generate theme if an element uses it
			if ( themes.nav == id || themes.secNav == id || ( ( themes.nav == 'auto' || themes.secNav == 'auto' ) && themes.site == id ) ) {

				var navbar = '.navbar.theme-'+id,
					main_navbar = '.navbar-mixt.theme-'+id,
					main_nav_opacity = mixt_customize.nav.opacity || 0.95,
					navbar_dark,
					navbar_light,

					accent = theme.accent || defaults.accent,
					accent_inv = theme['accent-inv'] || accent,

					bg = theme.bg || defaults.bg,
					bg_dark = theme['bg-dark'] == '1',

					border = theme.border || defaults.border,
					border_inv = theme['border-inv'] || defaults['border-inv'],

					color = theme.color || defaults.color,
					color_inv = theme['color-inv'] || defaults['color-inv'],

					color_for_accent = tinycolor.mostReadable(accent, ['#fff', '#000']).toHexString(),

					menu_bg = theme['menu-bg'] || bg,
					menu_bg_dark = tinycolor(menu_bg).isDark(),
					menu_border = theme['menu-border'] || border,
					menu_bg_hover = theme['menu-bg-hover'] || tinycolor(menu_bg).darken(2).toString(),
					menu_hover_color = theme['menu-hover-color'] || accent,
					menu_accent,
					menu_color,
					menu_color_fade,

					bg_light_accent, bg_light_color, bg_light_border,
					bg_dark_accent, bg_dark_color, bg_dark_border,

					theme_rgba = theme.rgba == '1',
					border_rgba = '',
					menu_bg_rgba = '',
					menu_border_rgba = '';

				// Set Accent And Text Colors According To The Background Color

				if ( bg_dark ) {
					navbar_dark  = navbar;
					navbar_light = navbar+'.bg-light';

					bg_light_color  = color_inv;
					bg_light_accent = accent_inv;

					bg_dark_color  = color;
					bg_dark_accent = accent;

					bg_dark_border  = border;
					bg_light_border = border_inv;
				} else {
					navbar_dark  = navbar+'.bg-dark';
					navbar_light = navbar;

					bg_light_color  = color;
					bg_light_accent = accent;

					bg_dark_color  = color_inv;
					bg_dark_accent = accent_inv;

					bg_dark_border  = border_inv;
					bg_light_border = border;
				}

				var has_inv_accent = ( bg_light_accent != bg_dark_accent );

				// Set Menu Accent And Text Colors According To The Background Color
				
				if ( menu_bg_dark ) {
					menu_color      = theme['menu-color'] || bg_dark_color;
					menu_color_fade = theme['menu-color-fade'] || menu_color;
					menu_accent     = bg_dark_accent;
				} else {
					menu_color      = theme['menu-color'] || bg_light_color;
					menu_color_fade = theme['menu-color-fade'] || menu_color;
					menu_accent     = bg_light_accent;
				}

				// Make RGBA Colors If Enabled
				
				if ( theme_rgba ) {
					border_rgba = 'border-color: '+tinycolor(border).setAlpha(0.8).toPercentageRgbString()+';';
					menu_bg_rgba = 'background-color: '+tinycolor(menu_bg).setAlpha(0.95).toPercentageRgbString()+';';
					menu_border_rgba = 'border-color: '+tinycolor(menu_border).setAlpha(0.8).toPercentageRgbString()+';';
				}

				// START CSS RULES

				css = navbar+' { border-color: '+border+'; background-color: '+bg+'; }';
				
				if ( main_nav_opacity < 1 ) {
					css += main_navbar+':not(.position-top):not(.vertical) { background-color: '+tinycolor(bg).setAlpha(main_nav_opacity).toPercentageRgbString()+'; }';
				}

				css += navbar+' .navbar-data { background-color: '+bg+' !important; }';

				if ( bg_dark ) {
					css += navbar+' .navbar-data:before { content: "dark"; }';
					css += navbar+' #nav-logo .logo-dark { position: static; opacity: 1; visibility: visible; }';
					css += navbar+' #nav-logo .logo-light { position: absolute; opacity: 0; visibility: hidden; }';
					css += navbar_light+' #nav-logo .logo-dark { position: absolute; opacity: 0; visibility: hidden; }';
					css += navbar_light+' #nav-logo .logo-light { position: static; opacity: 1; visibility: visible; }';
				} else {
					css += navbar+' .navbar-data:before { content: "light"; }';
				}

				// Submenus

				css += navbar+' .sub-menu { background-color: '+menu_bg+'; '+menu_bg_rgba+' }';
				css += navbar+' .sub-menu li > a:hover, '+navbar+' .sub-menu li > a:hover:focus, ';
				css += navbar+' .sub-menu li:hover > a:hover, '+navbar+' .sub-menu li.hover > a:hover { color: '+menu_hover_color+'; background-color: '+menu_bg_hover+'; }';
				css += navbar+' .sub-menu li > a, '+navbar+' .sub-menu input { color: '+menu_color+'; }';
				css += navbar+' .sub-menu input::-webkit-input-placeholder { color: '+menu_color_fade+'; }';
				css += navbar+' .sub-menu input::-moz-placeholder { color: '+menu_color_fade+'; }';
				css += navbar+' .sub-menu input:-ms-input-placeholder { color: '+menu_color_fade+'; }';
				css += navbar+' .sub-menu, '+navbar+' .sub-menu > li, '+navbar+' .sub-menu > li > a { border-color: '+menu_border+'; '+menu_border_rgba+' }';
				css += navbar+' .sub-menu li > a:hover, '+navbar+' .sub-menu .active > a, '+navbar+' .sub-menu .active > a:hover { color: '+menu_accent+'; }';

				// Other Elements
				
				css += navbar+' .nav-search .search-form button { border-color: '+menu_border+'; '+menu_border_rgba+' background-color: '+tinycolor(menu_bg).darken(3).toString()+'; }';
				css += navbar+' .nav-search .search-form button, $navbar .nav-search .search-form input { color: '+menu_color+'; }';
				css += navbar+' .accent-bg { color: '+color_for_accent+'; background-color: '+accent+'; }';

				// Light Background
				
				css += navbar_light+' .nav > li > a, '+navbar_light+' .text-cont, '+navbar_light+' .text-cont a:hover, '+navbar_light+' .text-cont a.no-color { color: '+bg_light_color+'; }';
				if ( has_inv_accent ) {
					css += navbar_light+' .nav > li:hover > a, '+navbar_light+' .nav > li.hover > a, '+navbar_light+' .nav > li > a:hover, '+navbar_light+' .nav > .active > a, '+navbar_light+' .text-cont a { color: '+bg_light_accent+'; }';
					css += navbar_light+' .nav > .active > a:before { background-color: '+bg_light_accent+'; }';
				}
				css += navbar_light+' .navbar-toggle .icon-bar { background-color: '+bg_light_color+'; }';
				css += navbar_light+' .nav > li, '+navbar_light+' .nav > li > a, '+navbar_light+' .navbar-toggle { border-color: '+bg_light_border+'; }';
				css += navbar_light+' .divider { background-color: '+bg_light_border+'; }';

				// Dark Background
				
				css += navbar_dark+' .nav > li > a, '+navbar_dark+' .text-cont, '+navbar_dark+' .text-cont a:hover, '+navbar_dark+' .text-cont a.no-color { color: '+bg_dark_color+'; }';
				if ( has_inv_accent ) {
					css += navbar_dark+' .nav > li:hover > a, '+navbar_dark+' .nav > li.hover > a, '+navbar_dark+' .nav > li > a:hover, '+navbar_dark+' .nav > .active > a, '+navbar_dark+' .text-cont a { color: '+bg_dark_accent+'; }';
					css += navbar_dark+' .nav > .active > a:before { background-color: '+bg_dark_accent+'; }';
				}
				css += navbar_dark+' .navbar-toggle .icon-bar { background-color: '+bg_dark_color+'; }';
				css += navbar_dark+' .nav > li, '+navbar_dark+' .nav > li > a, '+navbar_dark+' .navbar-toggle { border-color: '+bg_dark_border+'; }';
				css += navbar_dark+' .divider { background-color: '+bg_dark_border+'; }';

				if ( ! has_inv_accent ) {
					css += navbar+' .nav > li:hover > a, '+navbar+' .nav > li.hover > a, '+navbar+' .nav > li > a:hover, '+navbar+' .nav > li.active > a, '+navbar+' .text-cont a { color: '+accent+'; }';
					css += navbar+' .nav > .active > a:before { background-color: '+accent+'; }';
				}

				// Main Navbar Mobile Styling

				var mini_navbar = '.nav-mini '+main_navbar+'.navbar';

				css += mini_navbar+' .navbar-inner { background-color: '+menu_bg+'; '+menu_bg_rgba+' }';
				css += mini_navbar+' .navbar-inner .text-cont, '+mini_navbar+' .navbar-inner .text-cont a:hover, '+mini_navbar+' .navbar-inner .text-cont a.no-color, '+mini_navbar+' .nav > li > a { color: '+menu_color+'; }';
				css += mini_navbar+' .nav > li > a:hover, '+mini_navbar+' .nav > li > a:hover:focus, '+mini_navbar+' .nav > li:hover > a:hover, ';
				css += mini_navbar+' .nav > li.hover > a:hover, '+mini_navbar+' .nav > li.active > a:hover { color: '+menu_hover_color+'; background-color: '+menu_bg_hover+'; }';
				css += mini_navbar+' .nav > li:hover > a, '+mini_navbar+' .nav > li.hover > a { color: '+menu_color+'; }';
				css += mini_navbar+' .nav li.nav-search:hover > a, '+mini_navbar+' .nav li.nav-search.hover > a { color: '+menu_color+' !important; background-color: transparent !important; }';
				css += mini_navbar+' .nav > li.active > a, '+mini_navbar+' .navbar-inner .text-cont a { color: '+menu_accent+'; }';
				if ( has_inv_accent ) {
					css += mini_navbar+' .nav > .active > a:before { background-color: '+menu_accent+'; }';
				}
				css += mini_navbar+' .navbar-inner, '+mini_navbar+' .nav > li, '+mini_navbar+' .nav > li > a { border-color: '+menu_border+'; '+menu_border_rgba+' }';

				MIXT.stylesheet('nav-theme-'+id, css);
			}
		});

		$('.navbar').trigger('refresh');
	}
	
	wp.customize('mixt_opt[nav-themes]', function(value) {
		value.bind( function(to) {
			updateNavThemes(to);
		});
	});

	// Generate custom theme if selected theme is not one of the defaults
	function maybeUpdateNavThemes(id) {
		if ( id == 'auto' ) id = themes.site;
		if ( ! _.has(mixt_customize['default-nav-themes'], id) ) {
			var navThemes = wp.customize('mixt_opt[nav-themes]').get();
			updateNavThemes(navThemes);
		}
	}
	$('#main-nav').on('theme-change', function(event, theme) {
		maybeUpdateNavThemes(theme);
	});
	$('#second-nav').on('theme-change', function(event, theme) {
		maybeUpdateNavThemes(theme);
	});

})(jQuery);

/* ------------------------------------------------ /
CUSTOMIZER INTEGRATION - SITE THEMES
/ ------------------------------------------------ */

( function($) {

	'use strict';

	/* global _, wp, MIXT, mixt_customize, tinycolor */

	if ( ! mixt_customize['themes-enabled'] ) return;
	
	var defaults = {
		'accent':     '#dd3e3e',
		'bg':         '#fff',
		'color':      '#333',
		'color-inv':  '#fff',
		'border':     '#ddd',
	};

	var themes = MIXT.themes;

	function parse_selector(pattern, sel) {
		var selector = '';
		if ( _.isArray(sel) ) {
			$.each(sel, function(i, single_sel) {
				selector += pattern.replace(/\{\{sel\}\}/g, single_sel) + ',';
			});
			selector = selector.replace(/,+$/, '');
		} else {
			selector = pattern.replace(/\{\{sel\}\}/g, sel);
		}
		return selector;
	}

	function set_textsh_for_bg(bg, colors) {
		colors = colors || ['rgba(255,255,255,0.1)', 'rgba(0,0,0,0.1)'];
		if ( tinycolor(bg).isLight() ) {
			return colors[0];
		} else {
			return colors[1];
		}
	}

	function button_color(sel, color, pre) {
		pre = pre || '.mixt';

		var css = '',
			color_for_bg = tinycolor.mostReadable(color, ['#fff', '#333']).toHexString(),
			border_color = tinycolor(color).darken(7).toString(),
			text_shadow  = set_textsh_for_bg(color),
			color_darker = tinycolor(color).darken(10).toString(),
			btn_solid_hover_bg,
			btn_outline_hover_bg;

		if ( tinycolor(color).isLight() ) {
			btn_solid_hover_bg = tinycolor(color).darken(5).toString();
			btn_outline_hover_bg = 'rgba(0,0,0,0.03)';
		} else {
			btn_solid_hover_bg = tinycolor(color).lighten(5).toString();
			btn_outline_hover_bg = 'rgba(255,255,255,0.03)';
		}

		// Solid Background
		
		css += parse_selector(pre+' .btn-{{sel}}', sel) + ' { border-color: '+border_color+'; text-shadow: 0 1px 1px '+text_shadow+'; background-color: '+color+'; }';
		css += parse_selector(pre+' .btn-{{sel}}:hover, '+pre+' .btn-{{sel}}:focus', sel) + ' { background-color: '+btn_solid_hover_bg+'; }';
		css += parse_selector(pre+' .btn-hover-{{sel}}:hover, '+pre+' .btn-hover-{{sel}}:focus', sel) + ' { border-color: '+border_color+'; text-shadow: 0 1px 1px '+text_shadow+'; background-color: '+color+' !important; }';
		css += parse_selector(pre+' .btn-{{sel}}:active, '+pre+' .btn-{{sel}}.active, '+pre+' .btn-hover-{{sel}}:hover:active, '+pre+' .btn-hover-{{sel}}:hover.active', sel) + ' { border-color: '+color_darker+'; box-shadow: inset 0 1px 12px '+color_darker+'; }';
		css += parse_selector(pre+' .btn-{{sel}}, '+pre+' a.btn-{{sel}}, '+pre+' .btn-{{sel}}:hover, '+pre+' .btn-{{sel}}:focus, '+pre+' .btn-hover-{{sel}}:hover, '+pre+' a.btn-hover-{{sel}}:hover, '+pre+' .btn-hover-{{sel}}:focus', sel) + ' { color: '+color_for_bg+'; }';

		// Outline
		
		css += parse_selector(pre+' .btn-outline-{{sel}}:hover', sel) + ' { background-color: '+btn_outline_hover_bg+'; }';
		css += parse_selector(pre+' .btn-outline-{{sel}}, '+pre+' .btn-hover-outline-{{sel}}:hover', sel) + ' { border: 1px solid '+color+'; text-shadow: none !important; background-color: transparent; }';
		css += parse_selector(pre+' .btn-outline-{{sel}}:active, '+pre+' .btn-outline-{{sel}}.active, '+pre+' .btn-hover-outline-{{sel}}:hover:active, '+pre+' .btn-hover-outline-{{sel}}:hover.active', sel) + ' { box-shadow: inset 0 1px 16px rgba(0,0,0,0.05); }';
		css += parse_selector(pre+' .btn-hover-outline-{{sel}}:hover', sel) + ' { background-color: transparent !important; }';
		css += parse_selector(pre+' .btn-outline-{{sel}}, '+pre+' a.btn-outline-{{sel}}, '+pre+' .btn-outline-{{sel}}:hover, '+pre+' .btn-outline-{{sel}}:focus, '+pre+' .btn-hover-outline-{{sel}}:hover, '+pre+' a.btn-hover-outline-{{sel}}:hover, '+pre+' .btn-hover-outline-{{sel}}:focus', sel) + ' { color: '+color+'; }';

		// Animations

		css += parse_selector(pre+' .btn-fill-in-{{sel}}', sel) + ' { background-color: '+color+' !important; }';
		css += parse_selector(pre+' .btn-fill-in-{{sel}}:hover, '+pre+' .btn-fill-in-{{sel}}:focus, '+pre+' .btn-fill-in-{{sel}}:active', sel) + ' { color: '+color_for_bg+'; border-color: '+color+'; text-shadow: 0 1px 1px '+text_shadow+'; }';
		css += parse_selector(pre+' .btn-{{sel}}.btn-fill-in:before', sel) + ' { background-color: '+color+'; }';
		css += parse_selector(pre+' .btn-fill-{{sel}}:hover, '+pre+' .btn-fill-{{sel}}:focus, '+pre+' .btn-fill-{{sel}}:active', sel) + ' { color: '+color_for_bg+'; border-color: '+color+'; text-shadow: 0 1px 1px '+text_shadow+'; }';
		css += parse_selector(pre+' .btn-fill-{{sel}}:before', sel) + ' { background-color: '+color+'; }';

		// WooCommerce Accent Button
		
		if ( _.isArray(sel) && _.contains(sel, 'accent') ) {
			css += pre+' .woocommerce .button.alt, '+pre+' .woocommerce input[type=submit].button, '+pre+' .woocommerce #respond input#submit { color: '+color_for_bg+' !important; border-color: '+border_color+' !important; text-shadow: 0 1px 1px '+text_shadow+' !important; background-color: '+color+' !important; }';
			css += pre+' .woocommerce .button.alt:hover, '+pre+' .woocommerce input[type=submit].button:hover, '+pre+' .woocommerce #respond input#submit:hover, ' +
				   pre+' .woocommerce .button.alt:focus, '+pre+' .woocommerce input[type=submit].button:focus, '+pre+' .woocommerce #respond input#submit:focus { background-color: '+btn_solid_hover_bg+' !important; }';
			css += pre+' .woocommerce .button.alt:active, '+pre+' .woocommerce input[type=submit].button:active, '+pre+' .woocommerce #respond input#submit:active, ' +
				   pre+' .woocommerce .button.alt.active, '+pre+' .woocommerce input[type=submit].button:focus, '+pre+' .woocommerce #respond input#submit.active { border-color: '+color_darker+' !important; box-shadow: inset 0 1px 12px '+color_darker+' !important; }';
		}

		return css;
	}
	
	function updateSiteThemes(data) {
		$.each(data, function(id, theme) {
			var css;

			// Generate theme if it's in use
			if ( themes.site == id ) {

				var th = '.theme-'+id,
					body_th = '.body-theme-'+id,

					accent = theme.accent || defaults.accent,
					accent_darker = tinycolor(accent).darken(10).toString(),
					color_for_accent = tinycolor.mostReadable(accent, ['#fff', '#000']).toHexString(),
					textsh_for_accent = set_textsh_for_bg(accent),

					bg = theme.bg || defaults.bg,
					bg_darker = tinycolor(bg).darken(3).toString(),
					bg_lighter = tinycolor(bg).lighten(3).toString(),
					bg_dark = theme['bg-dark'] == '1',

					border = theme.border || defaults.border,

					color = theme.color || defaults.color,
					color_fade = theme['color-fade'] || tinycolor(color).lighten(20).toString(),
					color_inv = theme['color-inv'] || defaults['color-inv'],
					color_inv_fade = theme['color-inv-fade'] || tinycolor(color_inv).darken(40).toString(),

					bg_alt = theme['bg-alt'] || bg_darker,
					color_alt = theme['color-alt'] || tinycolor.mostReadable(bg_alt, [color, color_inv]).toHexString(),
					border_alt = theme['border-alt'] || border,

					input_border = tinycolor(bg).darken(10).toString(),

					bg_inv = theme['bg-inv'] || tinycolor(bg).spin(180).toString(),
					border_inv = theme['border-inv'] || tinycolor(bg).darken(10).toString(),

					bg_light_color, bg_light_color_fade,
					bg_dark_color, bg_dark_color_fade;

				// Set Text Colors According To The Background Color

				if ( bg_dark ) {
					bg_light_color = color_inv;
					bg_light_color_fade = color_inv_fade;

					bg_dark_color = color;
					bg_dark_color_fade = color_fade;
				} else {
					bg_light_color = color;
					bg_light_color_fade = color_fade;

					bg_dark_color = color_inv;
					bg_dark_color_fade = color_inv_fade;
				}

				// START CSS RULES

				// Main Background Color
				
				css = th+', '+th+' .theme-bg { background-color: '+bg+'; }';

				// Helper Classes

				css += th+' .theme-color { color: '+color+'; }';
				css += th+' .theme-color-fade { color: '+color_fade+'; }';
				css += th+' .theme-color-inv { color: '+color_inv+'; }';
				css += th+' .theme-color-inv-fade { color: '+color_inv_fade+'; }';

				css += th+' .theme-bg-light-color { color: '+bg_light_color+'; }';
				css += th+' .theme-bg-light-color-fade { color: '+bg_light_color_fade+'; }';
				css += th+' .theme-bg-dark-color { color: '+bg_dark_color+'; }';
				css += th+' .theme-bg-dark-color-fade { color: '+bg_dark_color_fade+'; }';

				css += th+' .accent-color { color: '+accent+'; }';
				css += th+' .accent-bg, '+th+' .theme-section-accent { color: '+color_for_accent+'; background-color: '+accent+'; }';

				css += th+' .theme-bd { border-color: '+border+'; }';
				css += th+' .theme-accent-bd { border-color: '+accent+'; }';

				// Theme Section Colors
				
				css += th+' .theme-section-main { color: '+color+'; background-color: '+bg+'; border-color: '+border+'; }';
				css += th+' .theme-section-alt { color: '+color_alt+'; border-color: '+border_alt+'; background-color: '+bg_alt+'; }';
				css += th+' .theme-section-accent { border-color: '+accent_darker+'; }';
				css += th+' .theme-section-inv { color: '+color_inv+'; border-color: '+border_inv+'; background-color: '+bg_inv+'; }';

				// Text Colors
				
				css += th+' #content-wrap { color: '+color+'; }';
				css += th+' a, '+th+' .post-meta a:hover, '+th+' #breadcrumbs a:hover, '+th+' .pager a:hover, '+th+' .pager li > span, '+th+' .hover-accent-color:hover { color: '+accent+'; }';
				css += th+' a.no-color { color: inherit; }';
				css += th+' .post-meta a, '+th+' .post-meta > span { color: '+color_fade+'; }';
				css += th+' .head-media.bg-light .container, '+th+' .head-media.bg-light .media-inner > a, '+th+' .head-media.bg-light .header-scroll, '+th+' .head-media.bg-light #breadcrumbs > li + li:before { color: '+bg_light_color+'; }';
				css += th+' .head-media.bg-dark .container, '+th+' .head-media.bg-dark .media-inner > a, '+th+' .head-media.bg-dark .header-scroll, '+th+' .head-media.bg-dark #breadcrumbs > li + li:before { color: '+bg_dark_color+'; }';
				css += th+' .post-related.related-media .related-content { color: '+bg_dark_color+'; }';
				css += th+' .link-list li a { color: '+color_fade+'; }';
				css += th+' .link-list li a:hover, '+th+' .link-list li a:active, '+th+' .link-list li.active > a { color: '+accent+'; }';

				// Border Colors
				
				css += th+', '+th+' #content-wrap, '+th+' .sidebar ul, '+th+' .post-feat.feat-format, '+th+' .wp-caption, '+th+' hr { border-color: '+border+'; }';
				css += th+' .article.sticky .page-title, '+th+' .article.sticky-post .page-title { border-color: '+accent+'; }';
				css += th+' .comment-list .bypostauthor > .comment-cont { border-left-color: '+accent+'; }';


				// Background Colors
				
				css += th+' .accent-bg:hover, '+th+' .hover-accent-bg:hover, '+th+' .tag-list a:hover, '+th+' .tagcloud a:hover { color: '+color_for_accent+' !important; background-color: '+accent+'; }';
				css += th+' .article .post-info .post-date { background-color: '+bg_darker+'; }';

				// Other Colors
				
				css += th+' ::selection { opacity: 0.8; background: '+accent+'; color: '+color_for_accent+'; }';

				css += th+' blockquote { border-color: '+border+'; border-left-color: '+accent+'; background-color: '+bg_darker+'; }';
				css += th+' blockquote cite { color: '+color_fade+'; }';

				css += th+' .sidebar .child-page-nav li a:hover, '+th+' .widget-area .nav li a:hover { color: '+accent+'; }';
				css += th+' .sidebar .child-page-nav .current_page_item, '+th+' .sidebar .child-page-nav .current_page_item:before { background-color: '+bg_darker+'; }';

				// Bootstrap Elements

				css += th+' .alert-default { color: '+color+'; border-color: '+border+'; background-color: '+bg_darker+'; }';
				css += th+' .alert-default a { color: '+accent+'; }';
				css += th+' .panel { border-color: '+border+'; background-color: '+bg_lighter+'; }';
				css += th+' .well { border-color: '+border+'; background-color: '+bg_darker+'; }';

				// Background Variants
				
				css += th+' .bg-light { color: '+bg_light_color+'; } '+th+' .bg-light .text-fade { color: '+bg_light_color_fade+'; }';
				css += th+' .bg-dark { color: '+bg_dark_color+'; } '+th+' .bg-dark .text-fade { color: '+bg_dark_color_fade+'; }';

				// Inputs
				
				css += th+' input:not([type=submit]):not([type=button]):not(.btn), '+th+' select, '+th+' textarea, '+th+' .form-control, ' +
					   th+' .post-password-form input[type="password"], '+th+' .woocommerce .input-text { color: '+color+'; border-color: '+input_border+'; background-color: '+bg_darker+'; }';
				css += th+' input:not([type=submit]):not([type=button]):not(.btn):focus, '+th+' select:focus, '+th+' textarea:focus, '+th+' .form-control:focus, ' +
					   th+' .post-password-form input[type="password"]:focus, '+th+' .woocommerce .input-text:focus { border-color: '+input_border+'; background-color: '+tinycolor(bg).lighten(2).toString()+'; }';
				css += th+' input::-webkit-input-placeholder, '+th+' .form-control::-webkit-input-placeholder { color: '+color_fade+'; }';
				css += th+' input::-moz-placeholder, '+th+' .form-control::-moz-placeholder { color: '+color_fade+'; }';
				css += th+' input:-ms-input-placeholder, '+th+' .form-control:-ms-input-placeholder { color: '+color_fade+'; }';
				if ( bg_dark ) {
					css += th+' select, .mixt '+th+' .select2-container .select2-arrow b:after { background-image: url("'+mixt_customize['mixt-uri']+'/assets/img/icons/select-arrow-light.png"); }';
				}

				// Buttons
				
				css += button_color(['primary', 'accent'], accent, th);
				css += button_color('minimal', bg_darker, th);

				// Element Colors
				
				css += th+' .mixt-stat.type-box, '+th+' .mixt-headline span.color-auto:after, '+th+' .mixt-timeline .timeline-block:before { border-color: '+border+'; }';
				css += th+' .mixt-row-separator.no-fill svg { fill: '+bg+'; }';
				css += th+' .mixt-map { color: '+bg_light_color+'; }';
				css += th+' .mixt-flipcard > .inner > .accent { color: '+color_for_accent+'; background-color: '+accent+'; border-color: '+accent_darker+'; }';
				css += th+' .mixt-pricing.accent .mixt-pricing-inner .header { color: '+color_for_accent+'; background-color: '+accent+'; box-shadow: 0 0 0 1px '+accent_darker+'; text-shadow: 0 1px 1px '+textsh_for_accent+'; }';
				// Accent Color Variants
				css += th+' .mixt-icon i.accent, '+th+' .mixt-stat.color-outline.accent { color: '+accent+'; }';
				// Accent Border Variants
				css += th+' .mixt-icon.icon-outline.accent, ' +
					   th+' .mixt-stat.color-outline.accent, ' +
					   th+' .mixt-iconbox .inner.bordered.accent, ' +
					   th+' .mixt-image .image-wrap.accent { border-color: '+accent+'; }';
				// Accent Bg Variants
				css += th+' .mixt-stat.color-bg.accent, ' +
					   th+' .mixt-icon.icon-solid.accent, ' +
					   th+' .mixt-iconbox .inner.solid.accent, ' +
					   th+' .mixt-review.boxed.accent, ' +
					   th+' .mixt-review.bubble .review-content.accent, ' +
					   th+' .mixt-review.bubble .review-content.accent:before, ' +
					   th+' .mixt-timeline .timeline-block .content.boxed.accent, ' +
					   th+' .mixt-timeline .timeline-block .content.bubble.accent, ' +
					   th+' .mixt-timeline .timeline-block .content.bubble.accent:before, ' +
					   th+' .hover-content .on-hover.accent { color: '+color_for_accent+'; border-color: '+accent_darker+'; background-color: '+accent+'; text-shadow: 0 1px 1px '+textsh_for_accent+'; }';
				css += th+' .mixt-icon.icon-solid.accent.anim-invert:hover, '+th+' .icon-cont:hover .mixt-icon.icon-solid.accent.anim-invert { color: '+accent+'; border-color: '+accent_darker+'; background-color: '+color_for_accent+'; text-shadow: 0 1px 1px '+set_textsh_for_bg(color_for_accent)+'; }';
				css += th+' .hover-content .on-hover.accent { background-color: '+tinycolor(accent).setAlpha(0.75).toPercentageRgbString()+'; }';

				// Plugin Colors

				// LightSlider
				css += th+' .lSSlideOuter .lSPager.lSpg > li a { background-color: '+color_fade+'; }';
				css += th+' .lSSlideOuter .lSPager.lSpg > li:hover a, '+th+' .lSSlideOuter .lSPager.lSpg > li.active a { background-color: '+accent+'; }';

				// LightGallery
				css += body_th+' .lg-outer .lg-thumb-item.active, '+body_th+' .lg-outer .lg-thumb-item:hover { border-color: '+accent+'; }';
				css += body_th+' .lg-progress-bar .lg-progress { background-color: '+accent+'; }';

				// Select2
				css += body_th+' .select2-container a.select2-choice, '+body_th+' .select2-drop, '+body_th+' .select2-drop.select2-drop-active { color: '+color+'; border-color: '+input_border+'; background-color: '+bg_darker+'; }';
				css += body_th+' .select2-results { background-color: '+bg_darker+'; }';
				css += body_th+' .select2-results .select2-highlighted { color: '+color+'; background-color: '+bg_lighter+'; }';

				// Visual Composer
				css += th+' .wpb_content_element .wpb_tour_tabs_wrapper .wpb_tabs_nav a:hover, '+th+' .wpb_content_element .wpb_accordion_header a:hover { color: '+accent+'; }';
				css += th+' .vc_separator.theme-bd .vc_sep_holder .vc_sep_line { border-color: '+border+'; }';
				css += th+' .mixt-grid-item .gitem-title-cont { color: '+color+'; background-color: '+bg_lighter+'; }';
				css += th+' .vc_tta.vc_tta-style-classic:not(.vc_tta-o-no-fill) .vc_tta-panel-body, '+th+' .vc_tta.vc_tta-style-modern:not(.vc_tta-o-no-fill) .vc_tta-panel-body { color: '+bg_light_color+'; }';

				// WooCommerce
				css += th+' .woocommerce .price .amount, '+th+' .woocommerce .total .amount, '+th+' .woocommerce .woo-cart .amount, '+th+' .woocommerce .nav li .amount { color: '+accent+'; }';
				css += th+' .woocommerce .nav li del .amount, '+th+' .woocommerce #reviews #comments ol.commentlist li .meta { color: '+color_fade+'; }';
				css += th+' .woocommerce .widget_price_filter .ui-slider .ui-slider-range { background-color: '+accent+'; }';
				css += th+' .woocommerce .badge-cont .badge.sale-badge { color: '+color_for_accent+'; background-color: '+accent+'; }';
				css += th+' .woocommerce .woocommerce-tabs ul.tabs li a { color: '+color_fade+' !important; }';
				css += th+' .woocommerce .woocommerce-tabs ul.tabs li.active { border-bottom-color: '+bg+' !important; }';
				css += th+' .woocommerce .woocommerce-tabs ul.tabs li.active a { color: '+color+' !important; }';
				css += th+' .woocommerce .woocommerce-tabs ul.tabs li.active, '+th+' .woocommerce .woocommerce-tabs .wc-tab { color: '+color+' !important; background-color: '+bg+' !important; }';
				css += th+' .woocommerce table.shop_table, '+th+' .woocommerce table.shop_table th, '+th+' .woocommerce table.shop_table td, ' +
					   th+' .woocommerce .cart-collaterals .cart_totals tr td, '+th+' .woocommerce .cart-collaterals .cart_totals tr th { border-color: '+border+' !important; }';
				css += th+' .woocommerce-checkout #payment, ' +
					   th+' .woocommerce form .form-row.woocommerce-validated .select2-choice, '+th+' .woocommerce form .form-row.woocommerce-validated input.input-text, '+th+' .woocommerce form .form-row.woocommerce-validated select, ' +
					   th+' .woocommerce form .form-row.woocommerce-invalid .select2-choice, '+th+' .woocommerce form .form-row.woocommerce-invalid input.input-text, '+th+' .woocommerce form .form-row.woocommerce-invalid select { border-color: '+input_border+'; }';

				MIXT.stylesheet('site-theme-'+id, css);
			}
		});
	}
	
	wp.customize('mixt_opt[site-themes]', function(value) {
		value.bind( function(to) {
			updateSiteThemes(to);
		});
	});

	// Generate custom theme if selected theme is not one of the defaults
	function maybeUpdateSiteThemes(id) {
		if ( id == 'auto' ) id = themes.site;
		if ( ! _.has(mixt_customize['default-site-themes'], id) ) {
			var siteThemes = wp.customize('mixt_opt[site-themes]').get();
			updateSiteThemes(siteThemes);
		}
	}
	$('#main-wrap-inner, #colophon').on('theme-change', function(event, theme) {
		maybeUpdateSiteThemes(theme);
	});

})(jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvb3Rlci5qcyIsImdsb2JhbC5qcyIsImhlYWRlci5qcyIsImxvZ28uanMiLCJuYXZiYXJzLmpzIiwidGhlbWVzLmpzIiwidGhlbWVzLm5hdi5qcyIsInRoZW1lcy5zaXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbk9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjdXN0b21pemVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xuQ1VTVE9NSVpFUiBJTlRFR1JBVElPTiAtIEZPT1RFUlxuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuKCBmdW5jdGlvbigkKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qIGdsb2JhbCB3cCAqL1xuXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbZm9vdGVyLXdpZGdldHMtYmctY29sb3JdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0JCgnI2NvbG9waG9uIC53aWRnZXQtcm93JykuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgdG8pO1xuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtmb290ZXItd2lkZ2V0cy1iZy1wYXRdJywgZnVuY3Rpb24oIHZhbHVlICkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHRpZiAoIHRvID09ICcwJyApIHtcblx0XHRcdFx0JCgnI2NvbG9waG9uIC53aWRnZXQtcm93JykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ25vbmUnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNjb2xvcGhvbiAud2lkZ2V0LXJvdycpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoXCInICsgdG8gKyAnXCIpJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2Zvb3Rlci13aWRnZXRzLXRleHQtY29sb3JdJywgZnVuY3Rpb24oIHZhbHVlICkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHQkKCcjY29sb3Bob24gLndpZGdldC1yb3cnKS5jc3MoJ2NvbG9yJywgdG8pO1xuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtmb290ZXItd2lkZ2V0cy1ib3JkZXItY29sb3JdJywgZnVuY3Rpb24oIHZhbHVlICkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHQkKCcjY29sb3Bob24gLndpZGdldC1yb3cnKS5jc3MoJ2JvcmRlci1jb2xvcicsIHRvKTtcblx0XHR9KTtcblx0fSk7XG5cblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtmb290ZXItY29weS1iZy1jb2xvcl0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHQkKCcjY29sb3Bob24gLmNvcHlyaWdodC1yb3cnKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCB0byk7XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2Zvb3Rlci1jb3B5LWJnLXBhdF0nLCBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdGlmICggdG8gPT0gJzAnICkge1xuXHRcdFx0XHQkKCcjY29sb3Bob24gLmNvcHlyaWdodC1yb3cnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAnbm9uZScpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCgnI2NvbG9waG9uIC5jb3B5cmlnaHQtcm93JykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybChcIicgKyB0byArICdcIiknKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbZm9vdGVyLWNvcHktdGV4dC1jb2xvcl0nLCBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdCQoJyNjb2xvcGhvbiAuY29weXJpZ2h0LXJvdycpLmNzcygnY29sb3InLCB0byk7XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2Zvb3Rlci1jb3B5LWJvcmRlci1jb2xvcl0nLCBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdCQoJyNjb2xvcGhvbiAuY29weXJpZ2h0LXJvdycpLmNzcygnYm9yZGVyLWNvbG9yJywgdG8pO1xuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtmb290ZXItbGVmdC1jb2RlXScsIGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHR2YXIgZGF0ZSA9IG5ldyBEYXRlKCksXG5cdFx0XHR5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHR0byA9IHRvLnJlcGxhY2UoL1xce1xce3llYXJcXH1cXH0vZywgeWVhcik7XG5cdFx0XHQkKCcjY29sb3Bob24gLmxlZnQtY29udGVudCAuY29udGVudC1jb2RlJykuaHRtbCh0byk7XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2Zvb3Rlci1yaWdodC1jb2RlXScsIGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHR2YXIgZGF0ZSA9IG5ldyBEYXRlKCksXG5cdFx0XHR5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHR0byA9IHRvLnJlcGxhY2UoL1xce1xce3llYXJcXH1cXH0vZywgeWVhcik7XG5cdFx0XHQkKCcjY29sb3Bob24gLnJpZ2h0LWNvbnRlbnQgLmNvbnRlbnQtY29kZScpLmh0bWwodG8pO1xuXHRcdH0pO1xuXHR9KTtcblxufSkoalF1ZXJ5KTsiLCJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXG5DVVNUT01JWkVSIElOVEVHUkFUSU9OIC0gR0xPQkFMXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbndpbmRvdy5NSVhUID0ge1xuXHRzdHlsZXNoZWV0OiBmdW5jdGlvbihpZCwgY3NzKSB7XG5cdFx0Y3NzID0gY3NzIHx8IGZhbHNlO1xuXHRcdHZhciBzaGVldCA9IGpRdWVyeSgnc3R5bGVbZGF0YS1pZD1cIicraWQrJ1wiXScpO1xuXHRcdGlmICggc2hlZXQubGVuZ3RoID09PSAwICkgc2hlZXQgPSBqUXVlcnkoJzxzdHlsZSBkYXRhLWlkPVwiJytpZCsnXCI+JykuYXBwZW5kVG8oalF1ZXJ5KCdoZWFkJykpO1xuXHRcdGlmICggY3NzICkge1xuXHRcdFx0c2hlZXQuaHRtbChjc3MpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gc2hlZXQ7XG5cdFx0fVxuXHR9XG59O1xuXG4oIGZ1bmN0aW9uKCQpIHtcblxuXHQvKiBnbG9iYWwgXywgd3AgKi9cblxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3NpdGUtbGF5b3V0XScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdGlmICggJCgnI21haW4td3JhcCcpLmhhc0NsYXNzKCduYXYtdmVydGljYWwnKSApIHtcblx0XHRcdFx0d3AuY3VzdG9taXplLnByZXZpZXcuc2VuZCgncmVmcmVzaCcpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRpZiAoIHRvID09ICd3aWRlJyApIHtcblx0XHRcdFx0JCgnYm9keScpLnJlbW92ZUNsYXNzKCdib3hlZCcpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCgnYm9keScpLmFkZENsYXNzKCdib3hlZCcpO1xuXHRcdFx0fVxuXHRcdFx0JCh3aW5kb3cpLnRyaWdnZXIoJ3Jlc2l6ZScpO1xuXHRcdH0pO1xuXHR9KTtcblxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3NpdGUtYmctY29sb3JdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0JCgnYm9keScpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsIHRvKTtcblx0XHR9KTtcblx0fSk7XG5cblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtzaXRlLWJnLXBhdF0nLCBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdGlmICggdG8gPT0gJzAnICkge1xuXHRcdFx0XHQkKCdib2R5JykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ25vbmUnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJ2JvZHknKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKFwiJyArIHRvICsgJ1wiKScpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblx0XG5cdC8vIFBhZ2UgTG9hZGVyXG5cdFx0XG5cdFx0dmFyIHBhZ2VMb2FkZXIgPSB7XG5cdFx0XHRsb2FkZXI6ICcnLFxuXHRcdFx0bG9hZElubmVyOiAnJyxcblx0XHRcdGVuYWJsZWQ6IGZhbHNlLFxuXHRcdFx0c2V0dXA6IGZhbHNlLFxuXHRcdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoaXMuc2V0dXAgPSB0cnVlO1xuXHRcdFx0XHR0aGlzLmVuYWJsZWQgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W3BhZ2UtbG9hZGVyXScpLmdldCgpO1xuXHRcdFx0XHRpZiAoIHRoaXMuZW5hYmxlZCApICQoJ2JvZHknKS5hZGRDbGFzcygnbG9hZGluZycpO1xuXHRcdFx0XHRpZiAoICQoJyNsb2FkLW92ZXJsYXknKS5sZW5ndGggPT09IDAgKSAkKCdib2R5JykuYXBwZW5kKCc8ZGl2IGlkPVwibG9hZC1vdmVybGF5XCI+PGRpdiBjbGFzcz1cImxvYWQtaW5uZXJcIj48L2Rpdj48L2Rpdj4nKTtcblx0XHRcdFx0dGhpcy5sb2FkZXIgPSAkKCcjbG9hZC1vdmVybGF5Jyk7XG5cdFx0XHRcdHRoaXMubG9hZElubmVyID0gdGhpcy5sb2FkZXIuY2hpbGRyZW4oJy5sb2FkLWlubmVyJyk7XG5cdFx0XHRcdHRoaXMubG9hZFNoYXBlKCk7XG5cdFx0XHRcdHRoaXMuaGFuZGxlKHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbcGFnZS1sb2FkZXItYmddJykuZ2V0KCksICdiZycpO1xuXHRcdFx0XHR0aGlzLmxvYWRlci5hcHBlbmQoJzxidXR0b24gaWQ9XCJsb2FkZXItY2xvc2VcIiBjbGFzcz1cImJ0biBidG4tcmVkIGJ0bi1sZ1wiIHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlOyB0b3A6IDIwcHg7IHJpZ2h0OiAyMHB4O1wiPiZ0aW1lczs8L2J1dHRvbj4nKTtcblx0XHRcdFx0dGhpcy5sb2FkZXIub24oJ2NsaWNrJywgJyNsb2FkZXItY2xvc2UnLCBmdW5jdGlvbigpIHsgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7IH0pO1xuXHRcdFx0fSxcblx0XHRcdGxvYWRTaGFwZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBjbGFzc2VzID0gJ2xvYWRlcicsXG5cdFx0XHRcdFx0bG9hZGVyICA9ICcnLFxuXHRcdFx0XHRcdHR5cGUgICAgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W3BhZ2UtbG9hZGVyLXR5cGVdJykuZ2V0KCksXG5cdFx0XHRcdFx0c2hhcGUgICA9IHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbcGFnZS1sb2FkZXItc2hhcGVdJykuZ2V0KCksXG5cdFx0XHRcdFx0aW1nICAgICA9IHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbcGFnZS1sb2FkZXItaW1nXScpLmdldCgpLFxuXHRcdFx0XHRcdGFuaW0gICAgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W3BhZ2UtbG9hZGVyLWFuaW1dJykuZ2V0KCk7XG5cdFx0XHRcdGlmICggYW5pbSAhPSAnbm9uZScgKSBjbGFzc2VzICs9ICcgYW5pbWF0ZWQgaW5maW5pdGUgJyArIGFuaW07XG5cdFx0XHRcdGlmICggdHlwZSA9PSAxICkge1xuXHRcdFx0XHRcdGxvYWRlciA9ICc8ZGl2IGNsYXNzPVwiJyArIGNsYXNzZXMgKyAnICcgKyBzaGFwZSArICdcIj48L2Rpdj4nO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCAhIF8uaXNFbXB0eShpbWcudXJsKSApIHtcblx0XHRcdFx0XHRsb2FkZXIgPSAnPGltZyBzcmM9XCInICsgaW1nLnVybCArICdcIiBhbHQ9XCJMb2FkaW5nLi4uXCIgY2xhc3M9XCInICsgY2xhc3NlcyArICdcIj4nO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGxvYWRlciA9ICc8ZGl2IGNsYXNzPVwicmluZyAnICsgY2xhc3NlcyArICdcIj48L2Rpdj4nO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMubG9hZElubmVyLmh0bWwobG9hZGVyKTtcblx0XHRcdFx0dGhpcy5oYW5kbGUod3AuY3VzdG9taXplKCdtaXh0X29wdFtwYWdlLWxvYWRlci1jb2xvcl0nKS5nZXQoKSwgJ2NvbG9yJyk7XG5cdFx0XHR9LFxuXHRcdFx0aGFuZGxlOiBmdW5jdGlvbih2YWx1ZSwgdHlwZSkge1xuXHRcdFx0XHRpZiAoICggdHlwZSAhPSAnc3dpdGNoJyB8fCB2YWx1ZSA9PSAnMScgKSAmJiAhIHRoaXMuc2V0dXAgKSB7IHRoaXMuaW5pdCgpOyB9XG5cdFx0XHRcdGlmICggdHlwZSA9PSAnc3dpdGNoJyApIHtcblx0XHRcdFx0XHRpZiAoIHZhbHVlID09ICcwJyApIHtcblx0XHRcdFx0XHRcdHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0JCgnYm9keScpLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMuZW5hYmxlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHQkKCdib2R5JykuYWRkQ2xhc3MoJ2xvYWRpbmcnKTtcblx0XHRcdFx0XHRcdHRoaXMubG9hZGVyLmZpbmQoJy5sb2FkZXInKS5zaG93KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKCB0aGlzLmVuYWJsZWQgKSB7XG5cdFx0XHRcdFx0aWYgKCB0eXBlID09ICdjb2xvcicgKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmxvYWRJbm5lci5jaGlsZHJlbignLnJpbmcsIC5zcXVhcmUyJykuY3NzKCdib3JkZXItY29sb3InLCB2YWx1ZSk7XG5cdFx0XHRcdFx0XHR0aGlzLmxvYWRJbm5lci5jaGlsZHJlbignLmNpcmNsZSwgLnNxdWFyZScpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsIHZhbHVlKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCB0eXBlID09ICdiZycgKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmxvYWRlci5jc3MoJ2JhY2tncm91bmQtY29sb3InLCB2YWx1ZSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMubG9hZFNoYXBlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdH07XG5cblx0XHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3BhZ2UtbG9hZGVyXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykgeyBwYWdlTG9hZGVyLmhhbmRsZSh0bywgJ3N3aXRjaCcpOyB9KTtcblx0XHR9KTtcblx0XHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3BhZ2UtbG9hZGVyLXR5cGVdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkgeyBwYWdlTG9hZGVyLmhhbmRsZShudWxsLCAndHlwZScpOyB9KTtcblx0XHR9KTtcblx0XHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3BhZ2UtbG9hZGVyLXNoYXBlXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbigpIHsgcGFnZUxvYWRlci5oYW5kbGUobnVsbCwgJ3NoYXBlJyk7IH0pO1xuXHRcdH0pO1xuXHRcdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbcGFnZS1sb2FkZXItY29sb3JdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7IHBhZ2VMb2FkZXIuaGFuZGxlKHRvLCAnY29sb3InKTsgfSk7XG5cdFx0fSk7XG5cdFx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtwYWdlLWxvYWRlci1pbWddJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkgeyBwYWdlTG9hZGVyLmhhbmRsZShudWxsLCAnaW1nJyk7IH0pO1xuXHRcdH0pO1xuXHRcdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbcGFnZS1sb2FkZXItYmddJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7IHBhZ2VMb2FkZXIuaGFuZGxlKHRvLCAnYmcnKTsgfSk7XG5cdFx0fSk7XG5cdFx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtwYWdlLWxvYWRlci1hbmltXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbigpIHsgcGFnZUxvYWRlci5oYW5kbGUobnVsbCwgJ2FuaW0nKTsgfSk7XG5cdFx0fSk7XG5cbn0pKGpRdWVyeSk7IiwiXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xuQ1VTVE9NSVpFUiBJTlRFR1JBVElPTiAtIEhFQURFUlxuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuKCBmdW5jdGlvbigkKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qIGdsb2JhbCB3cCwgTUlYVCwgdGlueWNvbG9yICovXG5cblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtoZWFkLWJnLWNvbG9yXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdCQoJy5oZWFkLW1lZGlhIC5tZWRpYS1jb250YWluZXInKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCB0byk7XG5cdFx0XHRpZiAoIHRpbnljb2xvcih0bykuaXNMaWdodCgpICkge1xuXHRcdFx0XHQkKCcuaGVhZC1tZWRpYScpLnJlbW92ZUNsYXNzKCdiZy1kYXJrJykuYWRkQ2xhc3MoJ2JnLWxpZ2h0Jyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCcuaGVhZC1tZWRpYScpLnJlbW92ZUNsYXNzKCdiZy1saWdodCcpLmFkZENsYXNzKCdiZy1kYXJrJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIHVwZGF0ZUhlYWRlclRleHQoKSB7XG5cdFx0dmFyIGNzcyA9ICcnLFxuXHRcdFx0aG0gPSAnLmhlYWQtbWVkaWEnLFxuXHRcdFx0Y29sb3IgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W2hlYWQtdGV4dC1jb2xvcl0nKS5nZXQoKSxcblx0XHRcdGNvbG9yX2ludiA9IHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbaGVhZC1pbnYtdGV4dC1jb2xvcl0nKS5nZXQoKTtcblx0XHRpZiAoIGNvbG9yICE9ICcnICkge1xuXHRcdFx0dmFyIGhtX2xpZ2h0ID0gaG0rJy5iZy1saWdodCc7XG5cdFx0XHRjc3MgKz0gaG1fbGlnaHQrJyAuY29udGFpbmVyLCAnK2htX2xpZ2h0KycgLm1lZGlhLWlubmVyID4gYSwgJytobV9saWdodCsnIC5oZWFkZXItc2Nyb2xsLCAnK2htX2xpZ2h0KycgI2JyZWFkY3J1bWJzID4gbGkgKyBsaTpiZWZvcmUgeyBjb2xvcjogJytjb2xvcisnICFpbXBvcnRhbnQ7IH0nO1xuXHRcdH1cblx0XHRpZiAoIGNvbG9yX2ludiAhPSAnJyApIHtcblx0XHRcdHZhciBobV9kYXJrID0gaG0rJy5iZy1kYXJrJztcblx0XHRcdGNzcyArPSBobV9kYXJrKycgLmNvbnRhaW5lciwgJytobV9kYXJrKycgLm1lZGlhLWlubmVyID4gYSwgJytobV9kYXJrKycgLmhlYWRlci1zY3JvbGwsICcraG1fZGFyaysnICNicmVhZGNydW1icyA+IGxpICsgbGk6YmVmb3JlIHsgY29sb3I6ICcrY29sb3JfaW52KycgIWltcG9ydGFudDsgfSc7XG5cdFx0fVxuXHRcdE1JWFQuc3R5bGVzaGVldCgnbWl4dC1oZWFkZXInLCBjc3MpO1xuXHR9XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbaGVhZC10ZXh0LWNvbG9yXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7XG5cdFx0XHR1cGRhdGVIZWFkZXJUZXh0KCk7XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2hlYWQtaW52LXRleHQtY29sb3JdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbigpIHtcblx0XHRcdHVwZGF0ZUhlYWRlclRleHQoKTtcblx0XHR9KTtcblx0fSk7XG5cblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2MtYmFyLWJnLWNvbG9yXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdCQoJyNsb2NhdGlvbi1iYXInKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCB0byk7XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvYy1iYXItYmctcGF0XScsIGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0aWYgKCB0byA9PSAnMCcgKSB7XG5cdFx0XHRcdCQoJyNsb2NhdGlvbi1iYXInKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAnbm9uZScpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCgnI2xvY2F0aW9uLWJhcicpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoXCInICsgdG8gKyAnXCIpJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvYy1iYXItdGV4dC1jb2xvcl0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHR2YXIgY3NzID0gJyNsb2NhdGlvbi1iYXIsICNsb2NhdGlvbi1iYXIgYTpob3ZlciwgI2xvY2F0aW9uLWJhciBsaTpiZWZvcmUgeyBjb2xvcjogJyt0bysnOyB9Jztcblx0XHRcdE1JWFQuc3R5bGVzaGVldCgnbWl4dC1sb2MtYmFyJywgY3NzKTtcblx0XHR9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9jLWJhci1ib3JkZXItY29sb3JdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0JCgnI2xvY2F0aW9uLWJhcicpLmNzcygnYm9yZGVyLWNvbG9yJywgdG8pO1xuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFticmVhZGNydW1icy1wcmVmaXhdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0dmFyIGJjX3ByZWZpeCA9ICQoJyNicmVhZGNydW1icyAuYmMtcHJlZml4Jyk7XG5cdFx0XHRpZiAoIGJjX3ByZWZpeC5sZW5ndGggPT09IDAgKSBiY19wcmVmaXggPSAkKCc8bGkgY2xhc3M9XCJiYy1wcmVmaXhcIj48L2xpPicpLnByZXBlbmRUbygkKCcjYnJlYWRjcnVtYnMnKSk7XG5cdFx0XHRiY19wcmVmaXguaHRtbCh0byk7XG5cdFx0fSk7XG5cdH0pO1xuXG59KShqUXVlcnkpOyIsIlxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cbkNVU1RPTUlaRVIgSU5URUdSQVRJT04gLSBMT0dPXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4oIGZ1bmN0aW9uKCQpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0LyogZ2xvYmFsIF8sIHdwLCBNSVhULCBtaXh0X2N1c3RvbWl6ZSAqL1xuXG5cdGZ1bmN0aW9uIHVwZGF0ZUxvZ28oKSB7XG5cdFx0dmFyIGh0bWwgPSAnJyxcblx0XHRcdGNzcyA9ICcnLFxuXHRcdFx0dHlwZSA9IHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby10eXBlXScpLmdldCgpLFxuXHRcdFx0aW1nID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLWltZ10nKS5nZXQoKSxcblx0XHRcdHRleHQgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tdGV4dF0nKS5nZXQoKSB8fCB3cC5jdXN0b21pemUoJ2Jsb2duYW1lJykuZ2V0KCksXG5cdFx0XHRzaHJpbmsgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tc2hyaW5rXScpLmdldCgpLFxuXHRcdFx0c2hvd190YWcgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tc2hvdy10YWdsaW5lXScpLmdldCgpO1xuXG5cdFx0Ly8gSW1hZ2UgTG9nb1xuXHRcdGlmICggdHlwZSA9PSAnaW1nJyAmJiAhIF8uaXNFbXB0eShpbWcudXJsKSApIHtcblx0XHRcdHZhciB3aWR0aCA9IGltZy53aWR0aCxcblx0XHRcdFx0aW1nX2ludiA9IHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby1pbWctaW52XScpLmdldCgpLFxuXHRcdFx0XHRoaXJlcyA9IHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby1pbWctaHJdJykuZ2V0KCkgPT0gJzEnLFxuXHRcdFx0XHRzaHJpbmtfd2lkdGg7XG5cblx0XHRcdGlmICggISBfLmlzRW1wdHkoaW1nX2ludi51cmwpICkge1xuXHRcdFx0XHRodG1sICs9ICc8aW1nIGNsYXNzPVwibG9nby1pbWcgbG9nby1saWdodFwiIHNyYz1cIicraW1nLnVybCsnXCIgYWx0PVwiJyt0ZXh0KydcIj4nO1xuXHRcdFx0XHRodG1sICs9ICc8aW1nIGNsYXNzPVwibG9nby1pbWcgbG9nby1kYXJrXCIgc3JjPVwiJytpbWdfaW52LnVybCsnXCIgYWx0PVwiJyt0ZXh0KydcIj4nO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aHRtbCArPSAnPGltZyBjbGFzcz1cImxvZ28taW1nXCIgc3JjPVwiJytpbWcudXJsKydcIiBhbHQ9XCInK3RleHQrJ1wiPic7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggaGlyZXMgKSB7XG5cdFx0XHRcdHdpZHRoID0gd2lkdGggLyAyO1xuXHRcdFx0fVxuXG5cdFx0XHRjc3MgKz0gJy5uYXZiYXItbWl4dCAjbmF2LWxvZ28gaW1nIHsgbWF4LXdpZHRoOiAnK3dpZHRoKydweDsgfSc7XG5cblx0XHRcdC8vIExvZ28gU2hyaW5rXG5cdFx0XHRzaHJpbmtfd2lkdGggPSAoIHNocmluayAhPSAnMCcgKSA/IHdpZHRoIC0gc2hyaW5rIDogd2lkdGg7XG5cdFx0XHRjc3MgKz0gJy5maXhlZC1uYXYgLm5hdmJhci1taXh0ICNuYXYtbG9nbyBpbWcgeyBtYXgtd2lkdGg6ICcrc2hyaW5rX3dpZHRoKydweDsgfSc7XG5cblx0XHQvLyBUZXh0IExvZ29cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIGNvbG9yID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXRleHQtY29sb3JdJykuZ2V0KCksXG5cdFx0XHRcdGNvbG9yX2ludiA9IHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby10ZXh0LWludl0nKS5nZXQoKSxcblx0XHRcdFx0dGV4dF90eXBvID0gbWl4dF9jdXN0b21pemUubG9nb1sndGV4dC10eXBvJ10sXG5cdFx0XHRcdHNocmlua19zaXplO1xuXG5cdFx0XHRodG1sICs9ICc8c3Ryb25nPicrdGV4dCsnPC9zdHJvbmc+JztcblxuXHRcdFx0Y3NzICs9ICcjbmF2LWxvZ28gc3Ryb25nIHsnO1xuXHRcdFx0XHRjc3MgKz0gJ2NvbG9yOiAnK2NvbG9yKyc7Jztcblx0XHRcdFx0Y3NzICs9ICdmb250LXNpemU6ICcrdGV4dF90eXBvWydmb250LXNpemUnXSsnOyc7XG5cdFx0XHRcdGNzcyArPSAnZm9udC1mYW1pbHk6ICcrdGV4dF90eXBvWydmb250LWZhbWlseSddKyc7Jztcblx0XHRcdFx0Y3NzICs9ICdmb250LXdlaWdodDogJyt0ZXh0X3R5cG9bJ2ZvbnQtd2VpZ2h0J10rJzsnO1xuXHRcdFx0XHRjc3MgKz0gJ3RleHQtdHJhbnNmb3JtOiAnK3RleHRfdHlwb1sndGV4dC10cmFuc2Zvcm0nXSsnOyc7XG5cdFx0XHRjc3MgKz0gJ30nO1xuXHRcdFx0Y3NzICs9ICcuYmctZGFyayAjbmF2LWxvZ28gc3Ryb25nIHsgY29sb3I6ICcrY29sb3JfaW52Kyc7IH0nO1xuXG5cdFx0XHQvLyBMb2dvIFNocmlua1xuXHRcdFx0aWYgKCBzaHJpbmsgIT0gJzAnICkge1xuXHRcdFx0XHRzaHJpbmtfc2l6ZSA9ICggcGFyc2VJbnQodGV4dF90eXBvWydmb250LXNpemUnXSwgMTApIC0gc2hyaW5rICkgKyAncHgnO1xuXG5cdFx0XHRcdGNzcyArPSAnLmZpeGVkLW5hdiAjbmF2LWxvZ28gc3Ryb25nIHsgZm9udC1zaXplOiAnK3Nocmlua19zaXplKyc7IH0nO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFRhZ2xpbmVcblx0XHRpZiAoIHNob3dfdGFnID09ICcxJyApIHtcblx0XHRcdHZhciB0YWdsaW5lID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXRhZ2xpbmVdJykuZ2V0KCkgfHwgd3AuY3VzdG9taXplKCdibG9nZGVzY3JpcHRpb24nKS5nZXQoKSxcblx0XHRcdFx0dGFnX2NvbG9yID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXRhZ2xpbmUtY29sb3JdJykuZ2V0KCksXG5cdFx0XHRcdHRhZ19jb2xvcl9pbnYgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tdGFnbGluZS1pbnZdJykuZ2V0KCksXG5cdFx0XHRcdHRhZ190eXBvID0gbWl4dF9jdXN0b21pemUubG9nb1sndGFnbGluZS10eXBvJ107XG5cblx0XHRcdGlmICggdGFnbGluZSAhPSAnJyApIHtcblx0XHRcdFx0aHRtbCArPSAnPHNtYWxsPicgKyB0YWdsaW5lICsgJzwvc21hbGw+Jztcblx0XHRcdH1cblxuXHRcdFx0Y3NzICs9ICcjbmF2LWxvZ28gc21hbGwgeyc7XG5cdFx0XHRcdGNzcyArPSAnY29sb3I6ICcrdGFnX2NvbG9yKyc7Jztcblx0XHRcdFx0Y3NzICs9ICdmb250LXNpemU6ICcrdGFnX3R5cG9bJ2ZvbnQtc2l6ZSddKyc7Jztcblx0XHRcdFx0Y3NzICs9ICdmb250LWZhbWlseTogJyt0YWdfdHlwb1snZm9udC1mYW1pbHknXSsnOyc7XG5cdFx0XHRcdGNzcyArPSAnZm9udC13ZWlnaHQ6ICcrdGFnX3R5cG9bJ2ZvbnQtd2VpZ2h0J10rJzsnO1xuXHRcdFx0XHRjc3MgKz0gJ3RleHQtdHJhbnNmb3JtOiAnK3RhZ190eXBvWyd0ZXh0LXRyYW5zZm9ybSddKyc7Jztcblx0XHRcdGNzcyArPSAnfSc7XG5cdFx0XHRjc3MgKz0gJy5iZy1kYXJrICNuYXYtbG9nbyBzbWFsbCB7IGNvbG9yOiAnK3RhZ19jb2xvcl9pbnYrJzsgfSc7XG5cdFx0fVxuXG5cdFx0JCgnI25hdi1sb2dvJykuaHRtbChodG1sKTtcblxuXHRcdE1JWFQuc3R5bGVzaGVldCgnbWl4dC1sb2dvJywgY3NzKTtcblx0fVxuXG5cdHdwLmN1c3RvbWl6ZSgnYmxvZ25hbWUnLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkgeyB1cGRhdGVMb2dvKCk7IH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdibG9nZGVzY3JpcHRpb24nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkgeyB1cGRhdGVMb2dvKCk7IH0pO1xuXHR9KTtcblxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tdHlwZV0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkgeyB1cGRhdGVMb2dvKCk7IH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLWltZ10nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkgeyB1cGRhdGVMb2dvKCk7IH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLWltZy1pbnZdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbigpIHsgdXBkYXRlTG9nbygpOyB9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby1pbWctaHJdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbigpIHsgdXBkYXRlTG9nbygpOyB9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby10ZXh0XScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7IHVwZGF0ZUxvZ28oKTsgfSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tdGV4dC1jb2xvcl0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkgeyB1cGRhdGVMb2dvKCk7IH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXRleHQtaW52XScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7IHVwZGF0ZUxvZ28oKTsgfSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tc2hyaW5rXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7IHVwZGF0ZUxvZ28oKTsgfSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tc2hvdy10YWdsaW5lXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7XG5cdFx0XHR1cGRhdGVMb2dvKCk7XG5cdFx0XHQkKHdpbmRvdykudHJpZ2dlcigncmVzaXplJyk7XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tdGFnbGluZV0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkgeyB1cGRhdGVMb2dvKCk7IH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXRhZ2xpbmUtY29sb3JdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbigpIHsgdXBkYXRlTG9nbygpOyB9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby10YWdsaW5lLWludl0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkgeyB1cGRhdGVMb2dvKCk7IH0pO1xuXHR9KTtcblxufSkoalF1ZXJ5KTsiLCJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXG5DVVNUT01JWkVSIElOVEVHUkFUSU9OIC0gTkFWQkFSU1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuKCBmdW5jdGlvbigkKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qIGdsb2JhbCB3cCwgTUlYVCwgbWl4dF9vcHQgKi9cblxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi12ZXJ0aWNhbC1wb3NpdGlvbl0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHRpZiAoIHRvID09ICdsZWZ0JyApIHtcblx0XHRcdFx0JCgnI21haW4td3JhcCcpLnJlbW92ZUNsYXNzKCduYXYtcmlnaHQnKS5hZGRDbGFzcygnbmF2LWxlZnQnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNtYWluLXdyYXAnKS5yZW1vdmVDbGFzcygnbmF2LWxlZnQnKS5hZGRDbGFzcygnbmF2LXJpZ2h0Jyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tYWxpZ25dJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0aWYgKCB0byA9PSAnMScgKSB7XG5cdFx0XHRcdCQoJyNtYWluLW5hdi13cmFwLCAuaGVhZC1tZWRpYScpLnJlbW92ZUNsYXNzKCdsb2dvLWNlbnRlciBsb2dvLXJpZ2h0JykuYWRkQ2xhc3MoJ2xvZ28tbGVmdCcpLmF0dHIoJ2RhdGEtbG9nby1hbGlnbicsICdsZWZ0Jyk7XG5cdFx0XHR9IGVsc2UgaWYgKCB0byA9PSAnMicgKSB7XG5cdFx0XHRcdCQoJyNtYWluLW5hdi13cmFwLCAuaGVhZC1tZWRpYScpLnJlbW92ZUNsYXNzKCdsb2dvLWxlZnQgbG9nby1yaWdodCcpLmFkZENsYXNzKCdsb2dvLWNlbnRlcicpLmF0dHIoJ2RhdGEtbG9nby1hbGlnbicsICdjZW50ZXInKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNtYWluLW5hdi13cmFwLCAuaGVhZC1tZWRpYScpLnJlbW92ZUNsYXNzKCdsb2dvLWNlbnRlciBsb2dvLWxlZnQnKS5hZGRDbGFzcygnbG9nby1yaWdodCcpLmF0dHIoJ2RhdGEtbG9nby1hbGlnbicsICdyaWdodCcpO1xuXHRcdFx0fVxuXHRcdFx0bmF2YmFyUGFkZGluZygpO1xuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtdGV4dHVyZV0nLCBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdGlmICggdG8gPT0gJzAnICkge1xuXHRcdFx0XHQkKCcjbWFpbi1uYXYnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAnbm9uZScpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCgnI21haW4tbmF2JykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybChcIicgKyB0byArICdcIiknKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2VjLW5hdi10ZXh0dXJlXScsIGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0aWYgKCB0byA9PSAnMCcgKSB7XG5cdFx0XHRcdCQoJyNzZWNvbmQtbmF2JykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ25vbmUnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNzZWNvbmQtbmF2JykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybChcIicgKyB0byArICdcIiknKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cblx0ZnVuY3Rpb24gbmF2YmFyUGFkZGluZygpIHtcblx0XHR2YXIgY3NzID0gJycsXG5cdFx0XHRzaGVldCA9IE1JWFQuc3R5bGVzaGVldCgnbWl4dC1uYXYtcGFkZGluZycpO1xuXG5cdFx0c2hlZXQuaHRtbCgnJyk7XG5cblx0XHR2YXIgbmF2X2l0ZW1faGVpZ2h0ID0gcGFyc2VJbnQoJCgnI21haW4tbmF2IC5uYXZiYXItaGVhZGVyJykuaGVpZ2h0KCksIDEwKSxcblx0XHRcdHBhZGRpbmcgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi1wYWRkaW5nXScpLmdldCgpLFxuXHRcdFx0bmF2X2hlaWdodCA9IG5hdl9pdGVtX2hlaWdodCArIHBhZGRpbmcgKiAyICsgMSxcblx0XHRcdG5hdl9jZW50ZXJfaGVpZ2h0ID0gbmF2X2hlaWdodCArIG5hdl9pdGVtX2hlaWdodCxcblx0XHRcdGZpeGVkX3BhZGRpbmcgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi1maXhlZC1wYWRkaW5nXScpLmdldCgpLFxuXHRcdFx0aGFsZl9wYWRkaW5nID0gZml4ZWRfcGFkZGluZyAvIDIsXG5cdFx0XHRmaXhlZF9uYXZfaGVpZ2h0ID0gbmF2X2l0ZW1faGVpZ2h0ICsgZml4ZWRfcGFkZGluZyAqIDIsXG5cdFx0XHRmaXhlZF9jZW50ZXJfbmF2X2hlaWdodCA9IGZpeGVkX25hdl9oZWlnaHQgKyBuYXZfaXRlbV9oZWlnaHQsXG5cdFx0XHRmaXhlZF9jZW50ZXJfaXRlbV9oZWlnaHQgPSBmaXhlZF9uYXZfaGVpZ2h0IC0gZml4ZWRfcGFkZGluZztcblxuXHRcdGNzcyArPSAnLm5hdmJhci1taXh0IHsgcGFkZGluZy10b3A6ICcrcGFkZGluZysncHg7IHBhZGRpbmctYm90dG9tOiAnK3BhZGRpbmcrJ3B4OyB9XFxuJztcblxuXHRcdGNzcyArPSAnLm5hdi1mdWxsICNtYWluLW5hdi13cmFwLCAubmF2LWZ1bGwgLmhlYWQtbWVkaWEgeyBtaW4taGVpZ2h0OiAnK25hdl9oZWlnaHQrJ3B4OyB9XFxuJztcblx0XHRjc3MgKz0gJy5uYXYtZnVsbCAjbWFpbi1uYXYtd3JhcC5sb2dvLWNlbnRlciwgLm5hdi1mdWxsIC5oZWFkLW1lZGlhLmxvZ28tY2VudGVyIHsgbWluLWhlaWdodDogJytuYXZfY2VudGVyX2hlaWdodCsncHg7IH1cXG4nO1xuXG5cdFx0Y3NzICs9ICcjbWFpbi13cmFwLm5hdi1mdWxsLm5hdi10cmFuc3BhcmVudCAuaGVhZC1tZWRpYSAuY29udGFpbmVyIHsgcGFkZGluZy10b3A6ICcrbmF2X2hlaWdodCsncHg7IH1cXG4nO1xuXHRcdGNzcyArPSAnI21haW4td3JhcC5uYXYtZnVsbC5uYXYtdHJhbnNwYXJlbnQgLmhlYWQtbWVkaWEubG9nby1jZW50ZXIgLmNvbnRhaW5lciB7IHBhZGRpbmctdG9wOiAnK25hdl9jZW50ZXJfaGVpZ2h0KydweDsgfVxcbic7XG5cdFx0Y3NzICs9ICcjbWFpbi13cmFwLm5hdi1mdWxsLm5hdi10cmFuc3BhcmVudC5uYXYtYmVsb3cgLmhlYWQtbWVkaWEgLmNvbnRhaW5lciB7IHBhZGRpbmctYm90dG9tOiAnK25hdl9oZWlnaHQrJ3B4OyB9XFxuJztcblx0XHRjc3MgKz0gJyNtYWluLXdyYXAubmF2LWZ1bGwubmF2LXRyYW5zcGFyZW50Lm5hdi1iZWxvdyAuaGVhZC1tZWRpYS5sb2dvLWNlbnRlciAuY29udGFpbmVyIHsgcGFkZGluZy1ib3R0b206ICcrbmF2X2NlbnRlcl9oZWlnaHQrJ3B4OyB9XFxuJztcblx0XHRjc3MgKz0gJyNtYWluLXdyYXAubmF2LWZ1bGwubmF2LXRyYW5zcGFyZW50Lm5hdi1iZWxvdyAubmF2YmFyLW1peHQucG9zaXRpb24tdG9wIHsgbWFyZ2luLXRvcDogLScrbmF2X2hlaWdodCsncHg7IH1cXG4nO1xuXHRcdGNzcyArPSAnI21haW4td3JhcC5uYXYtZnVsbC5uYXYtdHJhbnNwYXJlbnQubmF2LWJlbG93IC5sb2dvLWNlbnRlciAubmF2YmFyLW1peHQucG9zaXRpb24tdG9wIHsgbWFyZ2luLXRvcDogLScrbmF2X2NlbnRlcl9oZWlnaHQrJ3B4OyB9XFxuJztcblxuXHRcdC8vIEZJWEVEIE5BVlxuXG5cdFx0Y3NzICs9ICcuZml4ZWQtbmF2IC5uYXYtZnVsbCAjbWFpbi1uYXYtd3JhcCB7IG1pbi1oZWlnaHQ6ICcrZml4ZWRfbmF2X2hlaWdodCsncHg7IH1cXG4nO1xuXHRcdGNzcyArPSAnLmZpeGVkLW5hdiAubmF2LWZ1bGwgLm5hdmJhci1taXh0IHsgcGFkZGluZy10b3A6ICcrZml4ZWRfcGFkZGluZysncHg7IHBhZGRpbmctYm90dG9tOiAnK2ZpeGVkX3BhZGRpbmcrJ3B4OyB9XFxuJztcblxuXHRcdGNzcyArPSAnLmZpeGVkLW5hdiAubmF2LWZ1bGwgLm5hdmJhci1taXh0IC5uYXYgPiBsaSB7IG1hcmdpbi10b3A6IC0nK2ZpeGVkX3BhZGRpbmcrJ3B4OyBtYXJnaW4tYm90dG9tOiAtJytmaXhlZF9wYWRkaW5nKydweDsgfVxcbic7XG5cdFx0Y3NzICs9ICcuZml4ZWQtbmF2IC5uYXYtZnVsbCAubmF2YmFyLW1peHQgLm5hdiA+IGxpLCAuZml4ZWQtbmF2IC5uYXYtZnVsbCAubmF2YmFyLW1peHQgLm5hdiA+IGxpID4gYSB7IGhlaWdodDogJytmaXhlZF9uYXZfaGVpZ2h0KydweDsgbGluZS1oZWlnaHQ6ICcrKGZpeGVkX25hdl9oZWlnaHQgLSAzKSsncHg7IH1cXG4nO1xuXHRcdFxuXHRcdGNzcyArPSAnLmZpeGVkLW5hdiAubmF2LWZ1bGwgI21haW4tbmF2LXdyYXAubG9nby1jZW50ZXIgeyBtaW4taGVpZ2h0OiAnK2ZpeGVkX2NlbnRlcl9uYXZfaGVpZ2h0KydweDsgfVxcbic7XG5cdFx0Y3NzICs9ICcuZml4ZWQtbmF2IC5uYXYtZnVsbCAubG9nby1jZW50ZXIgLm5hdmJhci1taXh0IC5uYXZiYXItaGVhZGVyIHsgbWFyZ2luLXRvcDogLScraGFsZl9wYWRkaW5nKydweDsgfVxcbic7XG5cdFx0Y3NzICs9ICcuZml4ZWQtbmF2IC5uYXYtZnVsbCAubG9nby1jZW50ZXIgLm5hdmJhci1taXh0IC5uYXYgPiBsaSB7IG1hcmdpbi10b3A6ICcraGFsZl9wYWRkaW5nKydweDsgbWFyZ2luLWJvdHRvbTogLScrZml4ZWRfcGFkZGluZysncHg7IH1cXG4nO1xuXHRcdGNzcyArPSAnLmZpeGVkLW5hdiAubmF2LWZ1bGwgLmxvZ28tY2VudGVyIC5uYXZiYXItbWl4dCAubmF2ID4gbGksIC5maXhlZC1uYXYgLm5hdi1mdWxsIC5sb2dvLWNlbnRlciAubmF2YmFyLW1peHQgLm5hdiA+IGxpID4gYSB7IGhlaWdodDogJytmaXhlZF9jZW50ZXJfaXRlbV9oZWlnaHQrJ3B4OyBsaW5lLWhlaWdodDogJysoZml4ZWRfY2VudGVyX2l0ZW1faGVpZ2h0IC0gMykrJ3B4OyB9XFxuJztcblxuXHRcdHNoZWV0Lmh0bWwoY3NzKTtcblx0fVxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi1wYWRkaW5nXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7IG5hdmJhclBhZGRpbmcoKTsgfSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi1maXhlZC1wYWRkaW5nXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7IG5hdmJhclBhZGRpbmcoKTsgfSk7XG5cdH0pO1xuXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbmF2LW9wYWNpdHldJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0bWl4dF9vcHQubmF2Lm9wYWNpdHkgPSB0bztcblx0XHRcdCQoJyNtYWluLW5hdicpLnRyaWdnZXIoJ3JlZnJlc2gnKTtcblx0XHR9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbmF2LXRvcC1vcGFjaXR5XScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdG1peHRfb3B0Lm5hdlsndG9wLW9wYWNpdHknXSA9IHRvO1xuXHRcdFx0JCgnI21haW4tbmF2JykudHJpZ2dlcigncmVmcmVzaCcpO1xuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtdHJhbnNwYXJlbnRdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0aWYgKCB0byA9PSAnMScgJiYgd3AuY3VzdG9taXplKCdtaXh0X29wdFtoZWFkLW1lZGlhXScpLmdldCgpID09ICcxJyApIHtcblx0XHRcdFx0JCgnI21haW4td3JhcCcpLmFkZENsYXNzKCduYXYtdHJhbnNwYXJlbnQnKTtcblx0XHRcdFx0bWl4dF9vcHQubmF2LnRyYW5zcGFyZW50ID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNtYWluLXdyYXAnKS5yZW1vdmVDbGFzcygnbmF2LXRyYW5zcGFyZW50Jyk7XG5cdFx0XHRcdG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0JCgnI21haW4tbmF2JykudHJpZ2dlcigncmVmcmVzaCcpO1xuXHRcdH0pO1xuXHR9KTtcblxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi1ob3Zlci1iZ10nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHRpZiAoIHRvID09ICcwJyApIHtcblx0XHRcdFx0JCgnI21haW4tbmF2JykuYWRkQ2xhc3MoJ25vLWhvdmVyLWJnJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCcjbWFpbi1uYXYnKS5yZW1vdmVDbGFzcygnbm8taG92ZXItYmcnKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2VjLW5hdi1ob3Zlci1iZ10nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHRpZiAoIHRvID09ICcwJyApIHtcblx0XHRcdFx0JCgnI3NlY29uZC1uYXYnKS5hZGRDbGFzcygnbm8taG92ZXItYmcnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNzZWNvbmQtbmF2JykucmVtb3ZlQ2xhc3MoJ25vLWhvdmVyLWJnJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIG5hdmJhckFjdGl2ZUJhcihuYXZiYXIsIGVuYWJsZWQsIHBvc2l0aW9uKSB7XG5cdFx0bmF2YmFyLnJlbW92ZUNsYXNzKCdhY3RpdmUtdG9wIGFjdGl2ZS1ib3R0b20gYWN0aXZlLWxlZnQgYWN0aXZlLXJpZ2h0Jyk7XG5cdFx0aWYgKCBlbmFibGVkICkge1xuXHRcdFx0bmF2YmFyLnJlbW92ZUNsYXNzKCduby1hY3RpdmUnKS5hZGRDbGFzcygnYWN0aXZlLScrcG9zaXRpb24pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRuYXZiYXIuYWRkQ2xhc3MoJ25vLWFjdGl2ZScpO1xuXHRcdH1cblx0fVxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi1hY3RpdmUtYmFyXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdHZhciBlbmFibGVkID0gdG8gPT0gJzEnLFxuXHRcdFx0XHRwb3NpdGlvbiA9IHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbmF2LWFjdGl2ZS1iYXItcG9zXScpLmdldCgpO1xuXHRcdFx0bmF2YmFyQWN0aXZlQmFyKCQoJyNtYWluLW5hdiAubmF2JyksIGVuYWJsZWQsIHBvc2l0aW9uKTtcblx0XHR9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbmF2LWFjdGl2ZS1iYXItcG9zXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdHZhciBlbmFibGVkID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtYWN0aXZlLWJhcl0nKS5nZXQoKSA9PSAnMSc7XG5cdFx0XHRuYXZiYXJBY3RpdmVCYXIoJCgnI21haW4tbmF2IC5uYXYnKSwgZW5hYmxlZCwgdG8pO1xuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtzZWMtbmF2LWFjdGl2ZS1iYXJdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0dmFyIGVuYWJsZWQgPSB0byA9PSAnMScsXG5cdFx0XHRcdHBvc2l0aW9uID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtzZWMtbmF2LWFjdGl2ZS1iYXItcG9zXScpLmdldCgpO1xuXHRcdFx0bmF2YmFyQWN0aXZlQmFyKCQoJyNzZWNvbmQtbmF2IC5uYXYnKSwgZW5hYmxlZCwgcG9zaXRpb24pO1xuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtzZWMtbmF2LWFjdGl2ZS1iYXItcG9zXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdHZhciBlbmFibGVkID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtzZWMtbmF2LWFjdGl2ZS1iYXJdJykuZ2V0KCkgPT0gJzEnO1xuXHRcdFx0bmF2YmFyQWN0aXZlQmFyKCQoJyNzZWNvbmQtbmF2IC5uYXYnKSwgZW5hYmxlZCwgdG8pO1xuXHRcdH0pO1xuXHR9KTtcblxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi1ib3JkZXJlZF0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHRpZiAoIHRvID09ICcxJyApIHtcblx0XHRcdFx0JCgnI21haW4tbmF2JykuYWRkQ2xhc3MoJ2JvcmRlcmVkJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCcjbWFpbi1uYXYnKS5yZW1vdmVDbGFzcygnYm9yZGVyZWQnKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2VjLW5hdi1ib3JkZXJlZF0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHRpZiAoIHRvID09ICcxJyApIHtcblx0XHRcdFx0JCgnI3NlY29uZC1uYXYnKS5hZGRDbGFzcygnYm9yZGVyZWQnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNzZWNvbmQtbmF2JykucmVtb3ZlQ2xhc3MoJ2JvcmRlcmVkJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2VjLW5hdi1sZWZ0LWNvZGVdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0JCgnI3NlY29uZC1uYXYgLmxlZnQtY29udGVudCAuY29kZS1pbm5lcicpLmh0bWwodG8pO1xuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtzZWMtbmF2LWxlZnQtaGlkZV0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHR2YXIgbmF2ID0gJCgnI3NlY29uZC1uYXYnKTtcblx0XHRcdGlmICggdG8gPT0gJzEnICkge1xuXHRcdFx0XHRuYXYuZmluZCgnLmxlZnQtY29udGVudCcpLmFkZENsYXNzKCdoaWRkZW4teHMnKTtcblx0XHRcdFx0aWYgKCB3cC5jdXN0b21pemUoJ21peHRfb3B0W3NlYy1uYXYtcmlnaHQtaGlkZV0nKS5nZXQoKSA9PSAnMScgKSBuYXYuYWRkQ2xhc3MoJ2hpZGRlbi14cycpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bmF2LnJlbW92ZUNsYXNzKCdoaWRkZW4teHMnKTtcblx0XHRcdFx0bmF2LmZpbmQoJy5sZWZ0LWNvbnRlbnQnKS5yZW1vdmVDbGFzcygnaGlkZGVuLXhzJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3NlYy1uYXYtcmlnaHQtY29kZV0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHQkKCcjc2Vjb25kLW5hdiAucmlnaHQtY29udGVudCAuY29kZS1pbm5lcicpLmh0bWwodG8pO1xuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtzZWMtbmF2LXJpZ2h0LWhpZGVdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0dmFyIG5hdiA9ICQoJyNzZWNvbmQtbmF2Jyk7XG5cdFx0XHRpZiAoIHRvID09ICcxJyApIHtcblx0XHRcdFx0bmF2LmZpbmQoJy5yaWdodC1jb250ZW50JykuYWRkQ2xhc3MoJ2hpZGRlbi14cycpO1xuXHRcdFx0XHRpZiAoIHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2VjLW5hdi1sZWZ0LWhpZGVdJykuZ2V0KCkgPT0gJzEnICkgbmF2LmFkZENsYXNzKCdoaWRkZW4teHMnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5hdi5yZW1vdmVDbGFzcygnaGlkZGVuLXhzJyk7XG5cdFx0XHRcdG5hdi5maW5kKCcucmlnaHQtY29udGVudCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4teHMnKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cbn0pKGpRdWVyeSk7IiwiXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xuQ1VTVE9NSVpFUiBJTlRFR1JBVElPTiAtIFRIRU1FU1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKiBnbG9iYWwgd3AsIE1JWFQgKi9cblxuTUlYVC50aGVtZXMgPSB7XG5cdHJlZ2V4OiAvdGhlbWUtKFteXFxzXSopLyxcblx0c2l0ZTogbnVsbCxcblx0bmF2OiBudWxsLFxuXHRzZWNOYXY6IG51bGwsXG5cdGZvb3RlcjogbnVsbCxcblx0c2V0dXA6IGZhbHNlLFxuXHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRpZiAoICEgdGhpcy5zZXR1cCApIHtcblx0XHRcdHRoaXMuc2l0ZSA9IGpRdWVyeSgnI21haW4td3JhcC1pbm5lcicpWzBdLmNsYXNzTmFtZS5tYXRjaCh0aGlzLnJlZ2V4KVsxXTtcblx0XHRcdHRoaXMubmF2ID0galF1ZXJ5KCcjbWFpbi1uYXYnKVswXS5jbGFzc05hbWUubWF0Y2godGhpcy5yZWdleClbMV07XG5cdFx0XHRpZiAoIGpRdWVyeSgnI3NlY29uZC1uYXYnKS5sZW5ndGggKSB0aGlzLnNlY05hdiA9IGpRdWVyeSgnI3NlY29uZC1uYXYnKVswXS5jbGFzc05hbWUubWF0Y2godGhpcy5yZWdleClbMV07XG5cdFx0XHR0aGlzLmZvb3RlciA9IGpRdWVyeSgnI2NvbG9waG9uJylbMF0uY2xhc3NOYW1lLm1hdGNoKHRoaXMucmVnZXgpWzFdO1xuXHRcdFx0XG5cdFx0XHR0aGlzLnNldHVwID0gdHJ1ZTtcblx0XHR9XG5cdH0sXG5cdHNldFRoZW1lOiBmdW5jdGlvbihlbGVtLCB0aGVtZSkge1xuXHRcdGlmICggZWxlbS5sZW5ndGggPT09IDAgKSByZXR1cm47XG5cdFx0aWYgKCB0aGVtZSA9PSAnYXV0bycgKSB7XG5cdFx0XHR0aGVtZSA9IHRoaXMuc2l0ZTtcblx0XHRcdGVsZW0uYXR0cignZGF0YS10aGVtZScsICdhdXRvJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGVsZW0ucmVtb3ZlQXR0cignZGF0YS10aGVtZScpO1xuXHRcdH1cblx0XHRlbGVtWzBdLmNsYXNzTmFtZSA9IGVsZW1bMF0uY2xhc3NOYW1lLnJlcGxhY2UodGhpcy5yZWdleCwgJ3RoZW1lLScgKyB0aGVtZSk7XG5cdFx0ZWxlbS50cmlnZ2VyKCdyZWZyZXNoJykudHJpZ2dlcigndGhlbWUtY2hhbmdlJywgdGhlbWUpO1xuXHR9XG59O1xuXG4oIGZ1bmN0aW9uKCQpIHtcblx0XG5cdHZhciB0aGVtZXMgPSBNSVhULnRoZW1lcztcblxuXHR0aGVtZXMuaW5pdCgpO1xuXG5cdCQoZG9jdW1lbnQpLnJlYWR5KCBmdW5jdGlvbigpIHtcblx0XHRpZiAoIHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbmF2LXRoZW1lXScpLmdldCgpID09ICdhdXRvJyApIHtcblx0XHRcdHRoZW1lcy5uYXYgPSB0aGVtZXMuc2l0ZTtcblx0XHRcdCQoJyNtYWluLW5hdicpLmF0dHIoJ2RhdGEtdGhlbWUnLCAnYXV0bycpO1xuXHRcdH1cblx0XHRpZiAoICQoJyNzZWNvbmQtbmF2JykubGVuZ3RoICYmIHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2VjLW5hdi10aGVtZV0nKS5nZXQoKSA9PSAnYXV0bycgKSB7XG5cdFx0XHR0aGVtZXMuc2VjTmF2ID0gdGhlbWVzLnNpdGU7XG5cdFx0XHQkKCcjc2Vjb25kLW5hdicpLmF0dHIoJ2RhdGEtdGhlbWUnLCAnYXV0bycpO1xuXHRcdH1cblx0XHRpZiAoIHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbZm9vdGVyLXRoZW1lXScpLmdldCgpID09ICdhdXRvJyApIHtcblx0XHRcdHRoZW1lcy5mb290ZXIgPSB0aGVtZXMuc2l0ZTtcblx0XHRcdCQoJyNjb2xvcGhvbicpLmF0dHIoJ2RhdGEtdGhlbWUnLCAnYXV0bycpO1xuXHRcdH1cblx0fSk7XG5cdFxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3NpdGUtdGhlbWVdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0dGhlbWVzLnNpdGUgPSB0bztcblx0XHRcdHZhciBlbGVtcyA9ICQoJ2JvZHksICNtYWluLXdyYXAtaW5uZXIsIFtkYXRhLXRoZW1lPVwiYXV0b1wiXScpO1xuXHRcdFx0ZWxlbXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQodGhpcylbMF0uY2xhc3NOYW1lID0gJCh0aGlzKVswXS5jbGFzc05hbWUucmVwbGFjZSh0aGVtZXMucmVnZXgsICd0aGVtZS0nICsgdG8pO1xuXHRcdFx0XHQkKHRoaXMpLnRyaWdnZXIoJ3JlZnJlc2gnKS50cmlnZ2VyKCd0aGVtZS1jaGFuZ2UnLCB0byk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSk7XG5cblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtdGhlbWVdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0dGhlbWVzLm5hdiA9IHRvO1xuXHRcdFx0dGhlbWVzLnNldFRoZW1lKCQoJyNtYWluLW5hdicpLCB0byk7XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3NlYy1uYXYtdGhlbWVdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0dGhlbWVzLnNlY05hdiA9IHRvO1xuXHRcdFx0dGhlbWVzLnNldFRoZW1lKCQoJyNzZWNvbmQtbmF2JyksIHRvKTtcblx0XHR9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbZm9vdGVyLXRoZW1lXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdHRoZW1lcy5mb290ZXIgPSB0bztcblx0XHRcdHRoZW1lcy5zZXRUaGVtZSgkKCcjY29sb3Bob24nKSwgdG8pO1xuXHRcdH0pO1xuXHR9KTtcblxufSkoalF1ZXJ5KTsiLCJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXG5DVVNUT01JWkVSIElOVEVHUkFUSU9OIC0gTkFWIFRIRU1FU1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuKCBmdW5jdGlvbigkKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qIGdsb2JhbCBfLCB3cCwgTUlYVCwgbWl4dF9jdXN0b21pemUsIHRpbnljb2xvciAqL1xuXG5cdGlmICggISBtaXh0X2N1c3RvbWl6ZVsndGhlbWVzLWVuYWJsZWQnXSApIHJldHVybjtcblx0XG5cdHZhciBkZWZhdWx0cyA9IHtcblx0XHQnYWNjZW50JzogICAgICcjZGQzZTNlJyxcblx0XHQnYmcnOiAgICAgICAgICcjZmZmJyxcblx0XHQnY29sb3InOiAgICAgICcjMzMzJyxcblx0XHQnY29sb3ItaW52JzogICcjZmZmJyxcblx0XHQnYm9yZGVyJzogICAgICcjZGRkJyxcblx0XHQnYm9yZGVyLWludic6ICcjMzMzJyxcblx0fTtcblxuXHR2YXIgdGhlbWVzID0gTUlYVC50aGVtZXM7XG5cdFxuXHRmdW5jdGlvbiB1cGRhdGVOYXZUaGVtZXMoZGF0YSkge1xuXHRcdCQuZWFjaChkYXRhLCBmdW5jdGlvbihpZCwgdGhlbWUpIHtcblx0XHRcdHZhciBjc3M7XG5cblx0XHRcdC8vIEdlbmVyYXRlIHRoZW1lIGlmIGFuIGVsZW1lbnQgdXNlcyBpdFxuXHRcdFx0aWYgKCB0aGVtZXMubmF2ID09IGlkIHx8IHRoZW1lcy5zZWNOYXYgPT0gaWQgfHwgKCAoIHRoZW1lcy5uYXYgPT0gJ2F1dG8nIHx8IHRoZW1lcy5zZWNOYXYgPT0gJ2F1dG8nICkgJiYgdGhlbWVzLnNpdGUgPT0gaWQgKSApIHtcblxuXHRcdFx0XHR2YXIgbmF2YmFyID0gJy5uYXZiYXIudGhlbWUtJytpZCxcblx0XHRcdFx0XHRtYWluX25hdmJhciA9ICcubmF2YmFyLW1peHQudGhlbWUtJytpZCxcblx0XHRcdFx0XHRtYWluX25hdl9vcGFjaXR5ID0gbWl4dF9jdXN0b21pemUubmF2Lm9wYWNpdHkgfHwgMC45NSxcblx0XHRcdFx0XHRuYXZiYXJfZGFyayxcblx0XHRcdFx0XHRuYXZiYXJfbGlnaHQsXG5cblx0XHRcdFx0XHRhY2NlbnQgPSB0aGVtZS5hY2NlbnQgfHwgZGVmYXVsdHMuYWNjZW50LFxuXHRcdFx0XHRcdGFjY2VudF9pbnYgPSB0aGVtZVsnYWNjZW50LWludiddIHx8IGFjY2VudCxcblxuXHRcdFx0XHRcdGJnID0gdGhlbWUuYmcgfHwgZGVmYXVsdHMuYmcsXG5cdFx0XHRcdFx0YmdfZGFyayA9IHRoZW1lWydiZy1kYXJrJ10gPT0gJzEnLFxuXG5cdFx0XHRcdFx0Ym9yZGVyID0gdGhlbWUuYm9yZGVyIHx8IGRlZmF1bHRzLmJvcmRlcixcblx0XHRcdFx0XHRib3JkZXJfaW52ID0gdGhlbWVbJ2JvcmRlci1pbnYnXSB8fCBkZWZhdWx0c1snYm9yZGVyLWludiddLFxuXG5cdFx0XHRcdFx0Y29sb3IgPSB0aGVtZS5jb2xvciB8fCBkZWZhdWx0cy5jb2xvcixcblx0XHRcdFx0XHRjb2xvcl9pbnYgPSB0aGVtZVsnY29sb3ItaW52J10gfHwgZGVmYXVsdHNbJ2NvbG9yLWludiddLFxuXG5cdFx0XHRcdFx0Y29sb3JfZm9yX2FjY2VudCA9IHRpbnljb2xvci5tb3N0UmVhZGFibGUoYWNjZW50LCBbJyNmZmYnLCAnIzAwMCddKS50b0hleFN0cmluZygpLFxuXG5cdFx0XHRcdFx0bWVudV9iZyA9IHRoZW1lWydtZW51LWJnJ10gfHwgYmcsXG5cdFx0XHRcdFx0bWVudV9iZ19kYXJrID0gdGlueWNvbG9yKG1lbnVfYmcpLmlzRGFyaygpLFxuXHRcdFx0XHRcdG1lbnVfYm9yZGVyID0gdGhlbWVbJ21lbnUtYm9yZGVyJ10gfHwgYm9yZGVyLFxuXHRcdFx0XHRcdG1lbnVfYmdfaG92ZXIgPSB0aGVtZVsnbWVudS1iZy1ob3ZlciddIHx8IHRpbnljb2xvcihtZW51X2JnKS5kYXJrZW4oMikudG9TdHJpbmcoKSxcblx0XHRcdFx0XHRtZW51X2hvdmVyX2NvbG9yID0gdGhlbWVbJ21lbnUtaG92ZXItY29sb3InXSB8fCBhY2NlbnQsXG5cdFx0XHRcdFx0bWVudV9hY2NlbnQsXG5cdFx0XHRcdFx0bWVudV9jb2xvcixcblx0XHRcdFx0XHRtZW51X2NvbG9yX2ZhZGUsXG5cblx0XHRcdFx0XHRiZ19saWdodF9hY2NlbnQsIGJnX2xpZ2h0X2NvbG9yLCBiZ19saWdodF9ib3JkZXIsXG5cdFx0XHRcdFx0YmdfZGFya19hY2NlbnQsIGJnX2RhcmtfY29sb3IsIGJnX2RhcmtfYm9yZGVyLFxuXG5cdFx0XHRcdFx0dGhlbWVfcmdiYSA9IHRoZW1lLnJnYmEgPT0gJzEnLFxuXHRcdFx0XHRcdGJvcmRlcl9yZ2JhID0gJycsXG5cdFx0XHRcdFx0bWVudV9iZ19yZ2JhID0gJycsXG5cdFx0XHRcdFx0bWVudV9ib3JkZXJfcmdiYSA9ICcnO1xuXG5cdFx0XHRcdC8vIFNldCBBY2NlbnQgQW5kIFRleHQgQ29sb3JzIEFjY29yZGluZyBUbyBUaGUgQmFja2dyb3VuZCBDb2xvclxuXG5cdFx0XHRcdGlmICggYmdfZGFyayApIHtcblx0XHRcdFx0XHRuYXZiYXJfZGFyayAgPSBuYXZiYXI7XG5cdFx0XHRcdFx0bmF2YmFyX2xpZ2h0ID0gbmF2YmFyKycuYmctbGlnaHQnO1xuXG5cdFx0XHRcdFx0YmdfbGlnaHRfY29sb3IgID0gY29sb3JfaW52O1xuXHRcdFx0XHRcdGJnX2xpZ2h0X2FjY2VudCA9IGFjY2VudF9pbnY7XG5cblx0XHRcdFx0XHRiZ19kYXJrX2NvbG9yICA9IGNvbG9yO1xuXHRcdFx0XHRcdGJnX2RhcmtfYWNjZW50ID0gYWNjZW50O1xuXG5cdFx0XHRcdFx0YmdfZGFya19ib3JkZXIgID0gYm9yZGVyO1xuXHRcdFx0XHRcdGJnX2xpZ2h0X2JvcmRlciA9IGJvcmRlcl9pbnY7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bmF2YmFyX2RhcmsgID0gbmF2YmFyKycuYmctZGFyayc7XG5cdFx0XHRcdFx0bmF2YmFyX2xpZ2h0ID0gbmF2YmFyO1xuXG5cdFx0XHRcdFx0YmdfbGlnaHRfY29sb3IgID0gY29sb3I7XG5cdFx0XHRcdFx0YmdfbGlnaHRfYWNjZW50ID0gYWNjZW50O1xuXG5cdFx0XHRcdFx0YmdfZGFya19jb2xvciAgPSBjb2xvcl9pbnY7XG5cdFx0XHRcdFx0YmdfZGFya19hY2NlbnQgPSBhY2NlbnRfaW52O1xuXG5cdFx0XHRcdFx0YmdfZGFya19ib3JkZXIgID0gYm9yZGVyX2ludjtcblx0XHRcdFx0XHRiZ19saWdodF9ib3JkZXIgPSBib3JkZXI7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgaGFzX2ludl9hY2NlbnQgPSAoIGJnX2xpZ2h0X2FjY2VudCAhPSBiZ19kYXJrX2FjY2VudCApO1xuXG5cdFx0XHRcdC8vIFNldCBNZW51IEFjY2VudCBBbmQgVGV4dCBDb2xvcnMgQWNjb3JkaW5nIFRvIFRoZSBCYWNrZ3JvdW5kIENvbG9yXG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAoIG1lbnVfYmdfZGFyayApIHtcblx0XHRcdFx0XHRtZW51X2NvbG9yICAgICAgPSB0aGVtZVsnbWVudS1jb2xvciddIHx8IGJnX2RhcmtfY29sb3I7XG5cdFx0XHRcdFx0bWVudV9jb2xvcl9mYWRlID0gdGhlbWVbJ21lbnUtY29sb3ItZmFkZSddIHx8IG1lbnVfY29sb3I7XG5cdFx0XHRcdFx0bWVudV9hY2NlbnQgICAgID0gYmdfZGFya19hY2NlbnQ7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWVudV9jb2xvciAgICAgID0gdGhlbWVbJ21lbnUtY29sb3InXSB8fCBiZ19saWdodF9jb2xvcjtcblx0XHRcdFx0XHRtZW51X2NvbG9yX2ZhZGUgPSB0aGVtZVsnbWVudS1jb2xvci1mYWRlJ10gfHwgbWVudV9jb2xvcjtcblx0XHRcdFx0XHRtZW51X2FjY2VudCAgICAgPSBiZ19saWdodF9hY2NlbnQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBNYWtlIFJHQkEgQ29sb3JzIElmIEVuYWJsZWRcblx0XHRcdFx0XG5cdFx0XHRcdGlmICggdGhlbWVfcmdiYSApIHtcblx0XHRcdFx0XHRib3JkZXJfcmdiYSA9ICdib3JkZXItY29sb3I6ICcrdGlueWNvbG9yKGJvcmRlcikuc2V0QWxwaGEoMC44KS50b1BlcmNlbnRhZ2VSZ2JTdHJpbmcoKSsnOyc7XG5cdFx0XHRcdFx0bWVudV9iZ19yZ2JhID0gJ2JhY2tncm91bmQtY29sb3I6ICcrdGlueWNvbG9yKG1lbnVfYmcpLnNldEFscGhhKDAuOTUpLnRvUGVyY2VudGFnZVJnYlN0cmluZygpKyc7Jztcblx0XHRcdFx0XHRtZW51X2JvcmRlcl9yZ2JhID0gJ2JvcmRlci1jb2xvcjogJyt0aW55Y29sb3IobWVudV9ib3JkZXIpLnNldEFscGhhKDAuOCkudG9QZXJjZW50YWdlUmdiU3RyaW5nKCkrJzsnO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gU1RBUlQgQ1NTIFJVTEVTXG5cblx0XHRcdFx0Y3NzID0gbmF2YmFyKycgeyBib3JkZXItY29sb3I6ICcrYm9yZGVyKyc7IGJhY2tncm91bmQtY29sb3I6ICcrYmcrJzsgfSc7XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAoIG1haW5fbmF2X29wYWNpdHkgPCAxICkge1xuXHRcdFx0XHRcdGNzcyArPSBtYWluX25hdmJhcisnOm5vdCgucG9zaXRpb24tdG9wKTpub3QoLnZlcnRpY2FsKSB7IGJhY2tncm91bmQtY29sb3I6ICcrdGlueWNvbG9yKGJnKS5zZXRBbHBoYShtYWluX25hdl9vcGFjaXR5KS50b1BlcmNlbnRhZ2VSZ2JTdHJpbmcoKSsnOyB9Jztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAubmF2YmFyLWRhdGEgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnKycgIWltcG9ydGFudDsgfSc7XG5cblx0XHRcdFx0aWYgKCBiZ19kYXJrICkge1xuXHRcdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAubmF2YmFyLWRhdGE6YmVmb3JlIHsgY29udGVudDogXCJkYXJrXCI7IH0nO1xuXHRcdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAjbmF2LWxvZ28gLmxvZ28tZGFyayB7IHBvc2l0aW9uOiBzdGF0aWM7IG9wYWNpdHk6IDE7IHZpc2liaWxpdHk6IHZpc2libGU7IH0nO1xuXHRcdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAjbmF2LWxvZ28gLmxvZ28tbGlnaHQgeyBwb3NpdGlvbjogYWJzb2x1dGU7IG9wYWNpdHk6IDA7IHZpc2liaWxpdHk6IGhpZGRlbjsgfSc7XG5cdFx0XHRcdFx0Y3NzICs9IG5hdmJhcl9saWdodCsnICNuYXYtbG9nbyAubG9nby1kYXJrIHsgcG9zaXRpb246IGFic29sdXRlOyBvcGFjaXR5OiAwOyB2aXNpYmlsaXR5OiBoaWRkZW47IH0nO1xuXHRcdFx0XHRcdGNzcyArPSBuYXZiYXJfbGlnaHQrJyAjbmF2LWxvZ28gLmxvZ28tbGlnaHQgeyBwb3NpdGlvbjogc3RhdGljOyBvcGFjaXR5OiAxOyB2aXNpYmlsaXR5OiB2aXNpYmxlOyB9Jztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLm5hdmJhci1kYXRhOmJlZm9yZSB7IGNvbnRlbnQ6IFwibGlnaHRcIjsgfSc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBTdWJtZW51c1xuXG5cdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAuc3ViLW1lbnUgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK21lbnVfYmcrJzsgJyttZW51X2JnX3JnYmErJyB9Jztcblx0XHRcdFx0Y3NzICs9IG5hdmJhcisnIC5zdWItbWVudSBsaSA+IGE6aG92ZXIsICcrbmF2YmFyKycgLnN1Yi1tZW51IGxpID4gYTpob3Zlcjpmb2N1cywgJztcblx0XHRcdFx0Y3NzICs9IG5hdmJhcisnIC5zdWItbWVudSBsaTpob3ZlciA+IGE6aG92ZXIsICcrbmF2YmFyKycgLnN1Yi1tZW51IGxpLmhvdmVyID4gYTpob3ZlciB7IGNvbG9yOiAnK21lbnVfaG92ZXJfY29sb3IrJzsgYmFja2dyb3VuZC1jb2xvcjogJyttZW51X2JnX2hvdmVyKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLnN1Yi1tZW51IGxpID4gYSwgJytuYXZiYXIrJyAuc3ViLW1lbnUgaW5wdXQgeyBjb2xvcjogJyttZW51X2NvbG9yKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLnN1Yi1tZW51IGlucHV0Ojotd2Via2l0LWlucHV0LXBsYWNlaG9sZGVyIHsgY29sb3I6ICcrbWVudV9jb2xvcl9mYWRlKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLnN1Yi1tZW51IGlucHV0OjotbW96LXBsYWNlaG9sZGVyIHsgY29sb3I6ICcrbWVudV9jb2xvcl9mYWRlKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLnN1Yi1tZW51IGlucHV0Oi1tcy1pbnB1dC1wbGFjZWhvbGRlciB7IGNvbG9yOiAnK21lbnVfY29sb3JfZmFkZSsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IG5hdmJhcisnIC5zdWItbWVudSwgJytuYXZiYXIrJyAuc3ViLW1lbnUgPiBsaSwgJytuYXZiYXIrJyAuc3ViLW1lbnUgPiBsaSA+IGEgeyBib3JkZXItY29sb3I6ICcrbWVudV9ib3JkZXIrJzsgJyttZW51X2JvcmRlcl9yZ2JhKycgfSc7XG5cdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAuc3ViLW1lbnUgbGkgPiBhOmhvdmVyLCAnK25hdmJhcisnIC5zdWItbWVudSAuYWN0aXZlID4gYSwgJytuYXZiYXIrJyAuc3ViLW1lbnUgLmFjdGl2ZSA+IGE6aG92ZXIgeyBjb2xvcjogJyttZW51X2FjY2VudCsnOyB9JztcblxuXHRcdFx0XHQvLyBPdGhlciBFbGVtZW50c1xuXHRcdFx0XHRcblx0XHRcdFx0Y3NzICs9IG5hdmJhcisnIC5uYXYtc2VhcmNoIC5zZWFyY2gtZm9ybSBidXR0b24geyBib3JkZXItY29sb3I6ICcrbWVudV9ib3JkZXIrJzsgJyttZW51X2JvcmRlcl9yZ2JhKycgYmFja2dyb3VuZC1jb2xvcjogJyt0aW55Y29sb3IobWVudV9iZykuZGFya2VuKDMpLnRvU3RyaW5nKCkrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAubmF2LXNlYXJjaCAuc2VhcmNoLWZvcm0gYnV0dG9uLCAkbmF2YmFyIC5uYXYtc2VhcmNoIC5zZWFyY2gtZm9ybSBpbnB1dCB7IGNvbG9yOiAnK21lbnVfY29sb3IrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAuYWNjZW50LWJnIHsgY29sb3I6ICcrY29sb3JfZm9yX2FjY2VudCsnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2FjY2VudCsnOyB9JztcblxuXHRcdFx0XHQvLyBMaWdodCBCYWNrZ3JvdW5kXG5cdFx0XHRcdFxuXHRcdFx0XHRjc3MgKz0gbmF2YmFyX2xpZ2h0KycgLm5hdiA+IGxpID4gYSwgJytuYXZiYXJfbGlnaHQrJyAudGV4dC1jb250LCAnK25hdmJhcl9saWdodCsnIC50ZXh0LWNvbnQgYTpob3ZlciwgJytuYXZiYXJfbGlnaHQrJyAudGV4dC1jb250IGEubm8tY29sb3IgeyBjb2xvcjogJytiZ19saWdodF9jb2xvcisnOyB9Jztcblx0XHRcdFx0aWYgKCBoYXNfaW52X2FjY2VudCApIHtcblx0XHRcdFx0XHRjc3MgKz0gbmF2YmFyX2xpZ2h0KycgLm5hdiA+IGxpOmhvdmVyID4gYSwgJytuYXZiYXJfbGlnaHQrJyAubmF2ID4gbGkuaG92ZXIgPiBhLCAnK25hdmJhcl9saWdodCsnIC5uYXYgPiBsaSA+IGE6aG92ZXIsICcrbmF2YmFyX2xpZ2h0KycgLm5hdiA+IC5hY3RpdmUgPiBhLCAnK25hdmJhcl9saWdodCsnIC50ZXh0LWNvbnQgYSB7IGNvbG9yOiAnK2JnX2xpZ2h0X2FjY2VudCsnOyB9Jztcblx0XHRcdFx0XHRjc3MgKz0gbmF2YmFyX2xpZ2h0KycgLm5hdiA+IC5hY3RpdmUgPiBhOmJlZm9yZSB7IGJhY2tncm91bmQtY29sb3I6ICcrYmdfbGlnaHRfYWNjZW50Kyc7IH0nO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNzcyArPSBuYXZiYXJfbGlnaHQrJyAubmF2YmFyLXRvZ2dsZSAuaWNvbi1iYXIgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2xpZ2h0X2NvbG9yKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gbmF2YmFyX2xpZ2h0KycgLm5hdiA+IGxpLCAnK25hdmJhcl9saWdodCsnIC5uYXYgPiBsaSA+IGEsICcrbmF2YmFyX2xpZ2h0KycgLm5hdmJhci10b2dnbGUgeyBib3JkZXItY29sb3I6ICcrYmdfbGlnaHRfYm9yZGVyKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gbmF2YmFyX2xpZ2h0KycgLmRpdmlkZXIgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2xpZ2h0X2JvcmRlcisnOyB9JztcblxuXHRcdFx0XHQvLyBEYXJrIEJhY2tncm91bmRcblx0XHRcdFx0XG5cdFx0XHRcdGNzcyArPSBuYXZiYXJfZGFyaysnIC5uYXYgPiBsaSA+IGEsICcrbmF2YmFyX2RhcmsrJyAudGV4dC1jb250LCAnK25hdmJhcl9kYXJrKycgLnRleHQtY29udCBhOmhvdmVyLCAnK25hdmJhcl9kYXJrKycgLnRleHQtY29udCBhLm5vLWNvbG9yIHsgY29sb3I6ICcrYmdfZGFya19jb2xvcisnOyB9Jztcblx0XHRcdFx0aWYgKCBoYXNfaW52X2FjY2VudCApIHtcblx0XHRcdFx0XHRjc3MgKz0gbmF2YmFyX2RhcmsrJyAubmF2ID4gbGk6aG92ZXIgPiBhLCAnK25hdmJhcl9kYXJrKycgLm5hdiA+IGxpLmhvdmVyID4gYSwgJytuYXZiYXJfZGFyaysnIC5uYXYgPiBsaSA+IGE6aG92ZXIsICcrbmF2YmFyX2RhcmsrJyAubmF2ID4gLmFjdGl2ZSA+IGEsICcrbmF2YmFyX2RhcmsrJyAudGV4dC1jb250IGEgeyBjb2xvcjogJytiZ19kYXJrX2FjY2VudCsnOyB9Jztcblx0XHRcdFx0XHRjc3MgKz0gbmF2YmFyX2RhcmsrJyAubmF2ID4gLmFjdGl2ZSA+IGE6YmVmb3JlIHsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19kYXJrX2FjY2VudCsnOyB9Jztcblx0XHRcdFx0fVxuXHRcdFx0XHRjc3MgKz0gbmF2YmFyX2RhcmsrJyAubmF2YmFyLXRvZ2dsZSAuaWNvbi1iYXIgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2RhcmtfY29sb3IrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSBuYXZiYXJfZGFyaysnIC5uYXYgPiBsaSwgJytuYXZiYXJfZGFyaysnIC5uYXYgPiBsaSA+IGEsICcrbmF2YmFyX2RhcmsrJyAubmF2YmFyLXRvZ2dsZSB7IGJvcmRlci1jb2xvcjogJytiZ19kYXJrX2JvcmRlcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IG5hdmJhcl9kYXJrKycgLmRpdmlkZXIgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2RhcmtfYm9yZGVyKyc7IH0nO1xuXG5cdFx0XHRcdGlmICggISBoYXNfaW52X2FjY2VudCApIHtcblx0XHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLm5hdiA+IGxpOmhvdmVyID4gYSwgJytuYXZiYXIrJyAubmF2ID4gbGkuaG92ZXIgPiBhLCAnK25hdmJhcisnIC5uYXYgPiBsaSA+IGE6aG92ZXIsICcrbmF2YmFyKycgLm5hdiA+IGxpLmFjdGl2ZSA+IGEsICcrbmF2YmFyKycgLnRleHQtY29udCBhIHsgY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xuXHRcdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAubmF2ID4gLmFjdGl2ZSA+IGE6YmVmb3JlIHsgYmFja2dyb3VuZC1jb2xvcjogJythY2NlbnQrJzsgfSc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBNYWluIE5hdmJhciBNb2JpbGUgU3R5bGluZ1xuXG5cdFx0XHRcdHZhciBtaW5pX25hdmJhciA9ICcubmF2LW1pbmkgJyttYWluX25hdmJhcisnLm5hdmJhcic7XG5cblx0XHRcdFx0Y3NzICs9IG1pbmlfbmF2YmFyKycgLm5hdmJhci1pbm5lciB7IGJhY2tncm91bmQtY29sb3I6ICcrbWVudV9iZysnOyAnK21lbnVfYmdfcmdiYSsnIH0nO1xuXHRcdFx0XHRjc3MgKz0gbWluaV9uYXZiYXIrJyAubmF2YmFyLWlubmVyIC50ZXh0LWNvbnQsICcrbWluaV9uYXZiYXIrJyAubmF2YmFyLWlubmVyIC50ZXh0LWNvbnQgYTpob3ZlciwgJyttaW5pX25hdmJhcisnIC5uYXZiYXItaW5uZXIgLnRleHQtY29udCBhLm5vLWNvbG9yLCAnK21pbmlfbmF2YmFyKycgLm5hdiA+IGxpID4gYSB7IGNvbG9yOiAnK21lbnVfY29sb3IrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSBtaW5pX25hdmJhcisnIC5uYXYgPiBsaSA+IGE6aG92ZXIsICcrbWluaV9uYXZiYXIrJyAubmF2ID4gbGkgPiBhOmhvdmVyOmZvY3VzLCAnK21pbmlfbmF2YmFyKycgLm5hdiA+IGxpOmhvdmVyID4gYTpob3ZlciwgJztcblx0XHRcdFx0Y3NzICs9IG1pbmlfbmF2YmFyKycgLm5hdiA+IGxpLmhvdmVyID4gYTpob3ZlciwgJyttaW5pX25hdmJhcisnIC5uYXYgPiBsaS5hY3RpdmUgPiBhOmhvdmVyIHsgY29sb3I6ICcrbWVudV9ob3Zlcl9jb2xvcisnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK21lbnVfYmdfaG92ZXIrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSBtaW5pX25hdmJhcisnIC5uYXYgPiBsaTpob3ZlciA+IGEsICcrbWluaV9uYXZiYXIrJyAubmF2ID4gbGkuaG92ZXIgPiBhIHsgY29sb3I6ICcrbWVudV9jb2xvcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IG1pbmlfbmF2YmFyKycgLm5hdiBsaS5uYXYtc2VhcmNoOmhvdmVyID4gYSwgJyttaW5pX25hdmJhcisnIC5uYXYgbGkubmF2LXNlYXJjaC5ob3ZlciA+IGEgeyBjb2xvcjogJyttZW51X2NvbG9yKycgIWltcG9ydGFudDsgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDsgfSc7XG5cdFx0XHRcdGNzcyArPSBtaW5pX25hdmJhcisnIC5uYXYgPiBsaS5hY3RpdmUgPiBhLCAnK21pbmlfbmF2YmFyKycgLm5hdmJhci1pbm5lciAudGV4dC1jb250IGEgeyBjb2xvcjogJyttZW51X2FjY2VudCsnOyB9Jztcblx0XHRcdFx0aWYgKCBoYXNfaW52X2FjY2VudCApIHtcblx0XHRcdFx0XHRjc3MgKz0gbWluaV9uYXZiYXIrJyAubmF2ID4gLmFjdGl2ZSA+IGE6YmVmb3JlIHsgYmFja2dyb3VuZC1jb2xvcjogJyttZW51X2FjY2VudCsnOyB9Jztcblx0XHRcdFx0fVxuXHRcdFx0XHRjc3MgKz0gbWluaV9uYXZiYXIrJyAubmF2YmFyLWlubmVyLCAnK21pbmlfbmF2YmFyKycgLm5hdiA+IGxpLCAnK21pbmlfbmF2YmFyKycgLm5hdiA+IGxpID4gYSB7IGJvcmRlci1jb2xvcjogJyttZW51X2JvcmRlcisnOyAnK21lbnVfYm9yZGVyX3JnYmErJyB9JztcblxuXHRcdFx0XHRNSVhULnN0eWxlc2hlZXQoJ25hdi10aGVtZS0nK2lkLCBjc3MpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0JCgnLm5hdmJhcicpLnRyaWdnZXIoJ3JlZnJlc2gnKTtcblx0fVxuXHRcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtdGhlbWVzXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdHVwZGF0ZU5hdlRoZW1lcyh0byk7XG5cdFx0fSk7XG5cdH0pO1xuXG5cdC8vIEdlbmVyYXRlIGN1c3RvbSB0aGVtZSBpZiBzZWxlY3RlZCB0aGVtZSBpcyBub3Qgb25lIG9mIHRoZSBkZWZhdWx0c1xuXHRmdW5jdGlvbiBtYXliZVVwZGF0ZU5hdlRoZW1lcyhpZCkge1xuXHRcdGlmICggaWQgPT0gJ2F1dG8nICkgaWQgPSB0aGVtZXMuc2l0ZTtcblx0XHRpZiAoICEgXy5oYXMobWl4dF9jdXN0b21pemVbJ2RlZmF1bHQtbmF2LXRoZW1lcyddLCBpZCkgKSB7XG5cdFx0XHR2YXIgbmF2VGhlbWVzID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtdGhlbWVzXScpLmdldCgpO1xuXHRcdFx0dXBkYXRlTmF2VGhlbWVzKG5hdlRoZW1lcyk7XG5cdFx0fVxuXHR9XG5cdCQoJyNtYWluLW5hdicpLm9uKCd0aGVtZS1jaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgdGhlbWUpIHtcblx0XHRtYXliZVVwZGF0ZU5hdlRoZW1lcyh0aGVtZSk7XG5cdH0pO1xuXHQkKCcjc2Vjb25kLW5hdicpLm9uKCd0aGVtZS1jaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgdGhlbWUpIHtcblx0XHRtYXliZVVwZGF0ZU5hdlRoZW1lcyh0aGVtZSk7XG5cdH0pO1xuXG59KShqUXVlcnkpOyIsIlxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cbkNVU1RPTUlaRVIgSU5URUdSQVRJT04gLSBTSVRFIFRIRU1FU1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuKCBmdW5jdGlvbigkKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qIGdsb2JhbCBfLCB3cCwgTUlYVCwgbWl4dF9jdXN0b21pemUsIHRpbnljb2xvciAqL1xuXG5cdGlmICggISBtaXh0X2N1c3RvbWl6ZVsndGhlbWVzLWVuYWJsZWQnXSApIHJldHVybjtcblx0XG5cdHZhciBkZWZhdWx0cyA9IHtcblx0XHQnYWNjZW50JzogICAgICcjZGQzZTNlJyxcblx0XHQnYmcnOiAgICAgICAgICcjZmZmJyxcblx0XHQnY29sb3InOiAgICAgICcjMzMzJyxcblx0XHQnY29sb3ItaW52JzogICcjZmZmJyxcblx0XHQnYm9yZGVyJzogICAgICcjZGRkJyxcblx0fTtcblxuXHR2YXIgdGhlbWVzID0gTUlYVC50aGVtZXM7XG5cblx0ZnVuY3Rpb24gcGFyc2Vfc2VsZWN0b3IocGF0dGVybiwgc2VsKSB7XG5cdFx0dmFyIHNlbGVjdG9yID0gJyc7XG5cdFx0aWYgKCBfLmlzQXJyYXkoc2VsKSApIHtcblx0XHRcdCQuZWFjaChzZWwsIGZ1bmN0aW9uKGksIHNpbmdsZV9zZWwpIHtcblx0XHRcdFx0c2VsZWN0b3IgKz0gcGF0dGVybi5yZXBsYWNlKC9cXHtcXHtzZWxcXH1cXH0vZywgc2luZ2xlX3NlbCkgKyAnLCc7XG5cdFx0XHR9KTtcblx0XHRcdHNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZSgvLCskLywgJycpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzZWxlY3RvciA9IHBhdHRlcm4ucmVwbGFjZSgvXFx7XFx7c2VsXFx9XFx9L2csIHNlbCk7XG5cdFx0fVxuXHRcdHJldHVybiBzZWxlY3Rvcjtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldF90ZXh0c2hfZm9yX2JnKGJnLCBjb2xvcnMpIHtcblx0XHRjb2xvcnMgPSBjb2xvcnMgfHwgWydyZ2JhKDI1NSwyNTUsMjU1LDAuMSknLCAncmdiYSgwLDAsMCwwLjEpJ107XG5cdFx0aWYgKCB0aW55Y29sb3IoYmcpLmlzTGlnaHQoKSApIHtcblx0XHRcdHJldHVybiBjb2xvcnNbMF07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBjb2xvcnNbMV07XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gYnV0dG9uX2NvbG9yKHNlbCwgY29sb3IsIHByZSkge1xuXHRcdHByZSA9IHByZSB8fCAnLm1peHQnO1xuXG5cdFx0dmFyIGNzcyA9ICcnLFxuXHRcdFx0Y29sb3JfZm9yX2JnID0gdGlueWNvbG9yLm1vc3RSZWFkYWJsZShjb2xvciwgWycjZmZmJywgJyMzMzMnXSkudG9IZXhTdHJpbmcoKSxcblx0XHRcdGJvcmRlcl9jb2xvciA9IHRpbnljb2xvcihjb2xvcikuZGFya2VuKDcpLnRvU3RyaW5nKCksXG5cdFx0XHR0ZXh0X3NoYWRvdyAgPSBzZXRfdGV4dHNoX2Zvcl9iZyhjb2xvciksXG5cdFx0XHRjb2xvcl9kYXJrZXIgPSB0aW55Y29sb3IoY29sb3IpLmRhcmtlbigxMCkudG9TdHJpbmcoKSxcblx0XHRcdGJ0bl9zb2xpZF9ob3Zlcl9iZyxcblx0XHRcdGJ0bl9vdXRsaW5lX2hvdmVyX2JnO1xuXG5cdFx0aWYgKCB0aW55Y29sb3IoY29sb3IpLmlzTGlnaHQoKSApIHtcblx0XHRcdGJ0bl9zb2xpZF9ob3Zlcl9iZyA9IHRpbnljb2xvcihjb2xvcikuZGFya2VuKDUpLnRvU3RyaW5nKCk7XG5cdFx0XHRidG5fb3V0bGluZV9ob3Zlcl9iZyA9ICdyZ2JhKDAsMCwwLDAuMDMpJztcblx0XHR9IGVsc2Uge1xuXHRcdFx0YnRuX3NvbGlkX2hvdmVyX2JnID0gdGlueWNvbG9yKGNvbG9yKS5saWdodGVuKDUpLnRvU3RyaW5nKCk7XG5cdFx0XHRidG5fb3V0bGluZV9ob3Zlcl9iZyA9ICdyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpJztcblx0XHR9XG5cblx0XHQvLyBTb2xpZCBCYWNrZ3JvdW5kXG5cdFx0XG5cdFx0Y3NzICs9IHBhcnNlX3NlbGVjdG9yKHByZSsnIC5idG4te3tzZWx9fScsIHNlbCkgKyAnIHsgYm9yZGVyLWNvbG9yOiAnK2JvcmRlcl9jb2xvcisnOyB0ZXh0LXNoYWRvdzogMCAxcHggMXB4ICcrdGV4dF9zaGFkb3crJzsgYmFja2dyb3VuZC1jb2xvcjogJytjb2xvcisnOyB9Jztcblx0XHRjc3MgKz0gcGFyc2Vfc2VsZWN0b3IocHJlKycgLmJ0bi17e3NlbH19OmhvdmVyLCAnK3ByZSsnIC5idG4te3tzZWx9fTpmb2N1cycsIHNlbCkgKyAnIHsgYmFja2dyb3VuZC1jb2xvcjogJytidG5fc29saWRfaG92ZXJfYmcrJzsgfSc7XG5cdFx0Y3NzICs9IHBhcnNlX3NlbGVjdG9yKHByZSsnIC5idG4taG92ZXIte3tzZWx9fTpob3ZlciwgJytwcmUrJyAuYnRuLWhvdmVyLXt7c2VsfX06Zm9jdXMnLCBzZWwpICsgJyB7IGJvcmRlci1jb2xvcjogJytib3JkZXJfY29sb3IrJzsgdGV4dC1zaGFkb3c6IDAgMXB4IDFweCAnK3RleHRfc2hhZG93Kyc7IGJhY2tncm91bmQtY29sb3I6ICcrY29sb3IrJyAhaW1wb3J0YW50OyB9Jztcblx0XHRjc3MgKz0gcGFyc2Vfc2VsZWN0b3IocHJlKycgLmJ0bi17e3NlbH19OmFjdGl2ZSwgJytwcmUrJyAuYnRuLXt7c2VsfX0uYWN0aXZlLCAnK3ByZSsnIC5idG4taG92ZXIte3tzZWx9fTpob3ZlcjphY3RpdmUsICcrcHJlKycgLmJ0bi1ob3Zlci17e3NlbH19OmhvdmVyLmFjdGl2ZScsIHNlbCkgKyAnIHsgYm9yZGVyLWNvbG9yOiAnK2NvbG9yX2RhcmtlcisnOyBib3gtc2hhZG93OiBpbnNldCAwIDFweCAxMnB4ICcrY29sb3JfZGFya2VyKyc7IH0nO1xuXHRcdGNzcyArPSBwYXJzZV9zZWxlY3RvcihwcmUrJyAuYnRuLXt7c2VsfX0sICcrcHJlKycgYS5idG4te3tzZWx9fSwgJytwcmUrJyAuYnRuLXt7c2VsfX06aG92ZXIsICcrcHJlKycgLmJ0bi17e3NlbH19OmZvY3VzLCAnK3ByZSsnIC5idG4taG92ZXIte3tzZWx9fTpob3ZlciwgJytwcmUrJyBhLmJ0bi1ob3Zlci17e3NlbH19OmhvdmVyLCAnK3ByZSsnIC5idG4taG92ZXIte3tzZWx9fTpmb2N1cycsIHNlbCkgKyAnIHsgY29sb3I6ICcrY29sb3JfZm9yX2JnKyc7IH0nO1xuXG5cdFx0Ly8gT3V0bGluZVxuXHRcdFxuXHRcdGNzcyArPSBwYXJzZV9zZWxlY3RvcihwcmUrJyAuYnRuLW91dGxpbmUte3tzZWx9fTpob3ZlcicsIHNlbCkgKyAnIHsgYmFja2dyb3VuZC1jb2xvcjogJytidG5fb3V0bGluZV9ob3Zlcl9iZysnOyB9Jztcblx0XHRjc3MgKz0gcGFyc2Vfc2VsZWN0b3IocHJlKycgLmJ0bi1vdXRsaW5lLXt7c2VsfX0sICcrcHJlKycgLmJ0bi1ob3Zlci1vdXRsaW5lLXt7c2VsfX06aG92ZXInLCBzZWwpICsgJyB7IGJvcmRlcjogMXB4IHNvbGlkICcrY29sb3IrJzsgdGV4dC1zaGFkb3c6IG5vbmUgIWltcG9ydGFudDsgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7IH0nO1xuXHRcdGNzcyArPSBwYXJzZV9zZWxlY3RvcihwcmUrJyAuYnRuLW91dGxpbmUte3tzZWx9fTphY3RpdmUsICcrcHJlKycgLmJ0bi1vdXRsaW5lLXt7c2VsfX0uYWN0aXZlLCAnK3ByZSsnIC5idG4taG92ZXItb3V0bGluZS17e3NlbH19OmhvdmVyOmFjdGl2ZSwgJytwcmUrJyAuYnRuLWhvdmVyLW91dGxpbmUte3tzZWx9fTpob3Zlci5hY3RpdmUnLCBzZWwpICsgJyB7IGJveC1zaGFkb3c6IGluc2V0IDAgMXB4IDE2cHggcmdiYSgwLDAsMCwwLjA1KTsgfSc7XG5cdFx0Y3NzICs9IHBhcnNlX3NlbGVjdG9yKHByZSsnIC5idG4taG92ZXItb3V0bGluZS17e3NlbH19OmhvdmVyJywgc2VsKSArICcgeyBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudCAhaW1wb3J0YW50OyB9Jztcblx0XHRjc3MgKz0gcGFyc2Vfc2VsZWN0b3IocHJlKycgLmJ0bi1vdXRsaW5lLXt7c2VsfX0sICcrcHJlKycgYS5idG4tb3V0bGluZS17e3NlbH19LCAnK3ByZSsnIC5idG4tb3V0bGluZS17e3NlbH19OmhvdmVyLCAnK3ByZSsnIC5idG4tb3V0bGluZS17e3NlbH19OmZvY3VzLCAnK3ByZSsnIC5idG4taG92ZXItb3V0bGluZS17e3NlbH19OmhvdmVyLCAnK3ByZSsnIGEuYnRuLWhvdmVyLW91dGxpbmUte3tzZWx9fTpob3ZlciwgJytwcmUrJyAuYnRuLWhvdmVyLW91dGxpbmUte3tzZWx9fTpmb2N1cycsIHNlbCkgKyAnIHsgY29sb3I6ICcrY29sb3IrJzsgfSc7XG5cblx0XHQvLyBBbmltYXRpb25zXG5cblx0XHRjc3MgKz0gcGFyc2Vfc2VsZWN0b3IocHJlKycgLmJ0bi1maWxsLWluLXt7c2VsfX0nLCBzZWwpICsgJyB7IGJhY2tncm91bmQtY29sb3I6ICcrY29sb3IrJyAhaW1wb3J0YW50OyB9Jztcblx0XHRjc3MgKz0gcGFyc2Vfc2VsZWN0b3IocHJlKycgLmJ0bi1maWxsLWluLXt7c2VsfX06aG92ZXIsICcrcHJlKycgLmJ0bi1maWxsLWluLXt7c2VsfX06Zm9jdXMsICcrcHJlKycgLmJ0bi1maWxsLWluLXt7c2VsfX06YWN0aXZlJywgc2VsKSArICcgeyBjb2xvcjogJytjb2xvcl9mb3JfYmcrJzsgYm9yZGVyLWNvbG9yOiAnK2NvbG9yKyc7IHRleHQtc2hhZG93OiAwIDFweCAxcHggJyt0ZXh0X3NoYWRvdysnOyB9Jztcblx0XHRjc3MgKz0gcGFyc2Vfc2VsZWN0b3IocHJlKycgLmJ0bi17e3NlbH19LmJ0bi1maWxsLWluOmJlZm9yZScsIHNlbCkgKyAnIHsgYmFja2dyb3VuZC1jb2xvcjogJytjb2xvcisnOyB9Jztcblx0XHRjc3MgKz0gcGFyc2Vfc2VsZWN0b3IocHJlKycgLmJ0bi1maWxsLXt7c2VsfX06aG92ZXIsICcrcHJlKycgLmJ0bi1maWxsLXt7c2VsfX06Zm9jdXMsICcrcHJlKycgLmJ0bi1maWxsLXt7c2VsfX06YWN0aXZlJywgc2VsKSArICcgeyBjb2xvcjogJytjb2xvcl9mb3JfYmcrJzsgYm9yZGVyLWNvbG9yOiAnK2NvbG9yKyc7IHRleHQtc2hhZG93OiAwIDFweCAxcHggJyt0ZXh0X3NoYWRvdysnOyB9Jztcblx0XHRjc3MgKz0gcGFyc2Vfc2VsZWN0b3IocHJlKycgLmJ0bi1maWxsLXt7c2VsfX06YmVmb3JlJywgc2VsKSArICcgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2NvbG9yKyc7IH0nO1xuXG5cdFx0Ly8gV29vQ29tbWVyY2UgQWNjZW50IEJ1dHRvblxuXHRcdFxuXHRcdGlmICggXy5pc0FycmF5KHNlbCkgJiYgXy5jb250YWlucyhzZWwsICdhY2NlbnQnKSApIHtcblx0XHRcdGNzcyArPSBwcmUrJyAud29vY29tbWVyY2UgLmJ1dHRvbi5hbHQsICcrcHJlKycgLndvb2NvbW1lcmNlIGlucHV0W3R5cGU9c3VibWl0XS5idXR0b24sICcrcHJlKycgLndvb2NvbW1lcmNlICNyZXNwb25kIGlucHV0I3N1Ym1pdCB7IGNvbG9yOiAnK2NvbG9yX2Zvcl9iZysnICFpbXBvcnRhbnQ7IGJvcmRlci1jb2xvcjogJytib3JkZXJfY29sb3IrJyAhaW1wb3J0YW50OyB0ZXh0LXNoYWRvdzogMCAxcHggMXB4ICcrdGV4dF9zaGFkb3crJyAhaW1wb3J0YW50OyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2NvbG9yKycgIWltcG9ydGFudDsgfSc7XG5cdFx0XHRjc3MgKz0gcHJlKycgLndvb2NvbW1lcmNlIC5idXR0b24uYWx0OmhvdmVyLCAnK3ByZSsnIC53b29jb21tZXJjZSBpbnB1dFt0eXBlPXN1Ym1pdF0uYnV0dG9uOmhvdmVyLCAnK3ByZSsnIC53b29jb21tZXJjZSAjcmVzcG9uZCBpbnB1dCNzdWJtaXQ6aG92ZXIsICcgK1xuXHRcdFx0XHQgICBwcmUrJyAud29vY29tbWVyY2UgLmJ1dHRvbi5hbHQ6Zm9jdXMsICcrcHJlKycgLndvb2NvbW1lcmNlIGlucHV0W3R5cGU9c3VibWl0XS5idXR0b246Zm9jdXMsICcrcHJlKycgLndvb2NvbW1lcmNlICNyZXNwb25kIGlucHV0I3N1Ym1pdDpmb2N1cyB7IGJhY2tncm91bmQtY29sb3I6ICcrYnRuX3NvbGlkX2hvdmVyX2JnKycgIWltcG9ydGFudDsgfSc7XG5cdFx0XHRjc3MgKz0gcHJlKycgLndvb2NvbW1lcmNlIC5idXR0b24uYWx0OmFjdGl2ZSwgJytwcmUrJyAud29vY29tbWVyY2UgaW5wdXRbdHlwZT1zdWJtaXRdLmJ1dHRvbjphY3RpdmUsICcrcHJlKycgLndvb2NvbW1lcmNlICNyZXNwb25kIGlucHV0I3N1Ym1pdDphY3RpdmUsICcgK1xuXHRcdFx0XHQgICBwcmUrJyAud29vY29tbWVyY2UgLmJ1dHRvbi5hbHQuYWN0aXZlLCAnK3ByZSsnIC53b29jb21tZXJjZSBpbnB1dFt0eXBlPXN1Ym1pdF0uYnV0dG9uOmZvY3VzLCAnK3ByZSsnIC53b29jb21tZXJjZSAjcmVzcG9uZCBpbnB1dCNzdWJtaXQuYWN0aXZlIHsgYm9yZGVyLWNvbG9yOiAnK2NvbG9yX2RhcmtlcisnICFpbXBvcnRhbnQ7IGJveC1zaGFkb3c6IGluc2V0IDAgMXB4IDEycHggJytjb2xvcl9kYXJrZXIrJyAhaW1wb3J0YW50OyB9Jztcblx0XHR9XG5cblx0XHRyZXR1cm4gY3NzO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiB1cGRhdGVTaXRlVGhlbWVzKGRhdGEpIHtcblx0XHQkLmVhY2goZGF0YSwgZnVuY3Rpb24oaWQsIHRoZW1lKSB7XG5cdFx0XHR2YXIgY3NzO1xuXG5cdFx0XHQvLyBHZW5lcmF0ZSB0aGVtZSBpZiBpdCdzIGluIHVzZVxuXHRcdFx0aWYgKCB0aGVtZXMuc2l0ZSA9PSBpZCApIHtcblxuXHRcdFx0XHR2YXIgdGggPSAnLnRoZW1lLScraWQsXG5cdFx0XHRcdFx0Ym9keV90aCA9ICcuYm9keS10aGVtZS0nK2lkLFxuXG5cdFx0XHRcdFx0YWNjZW50ID0gdGhlbWUuYWNjZW50IHx8IGRlZmF1bHRzLmFjY2VudCxcblx0XHRcdFx0XHRhY2NlbnRfZGFya2VyID0gdGlueWNvbG9yKGFjY2VudCkuZGFya2VuKDEwKS50b1N0cmluZygpLFxuXHRcdFx0XHRcdGNvbG9yX2Zvcl9hY2NlbnQgPSB0aW55Y29sb3IubW9zdFJlYWRhYmxlKGFjY2VudCwgWycjZmZmJywgJyMwMDAnXSkudG9IZXhTdHJpbmcoKSxcblx0XHRcdFx0XHR0ZXh0c2hfZm9yX2FjY2VudCA9IHNldF90ZXh0c2hfZm9yX2JnKGFjY2VudCksXG5cblx0XHRcdFx0XHRiZyA9IHRoZW1lLmJnIHx8IGRlZmF1bHRzLmJnLFxuXHRcdFx0XHRcdGJnX2RhcmtlciA9IHRpbnljb2xvcihiZykuZGFya2VuKDMpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFx0YmdfbGlnaHRlciA9IHRpbnljb2xvcihiZykubGlnaHRlbigzKS50b1N0cmluZygpLFxuXHRcdFx0XHRcdGJnX2RhcmsgPSB0aGVtZVsnYmctZGFyayddID09ICcxJyxcblxuXHRcdFx0XHRcdGJvcmRlciA9IHRoZW1lLmJvcmRlciB8fCBkZWZhdWx0cy5ib3JkZXIsXG5cblx0XHRcdFx0XHRjb2xvciA9IHRoZW1lLmNvbG9yIHx8IGRlZmF1bHRzLmNvbG9yLFxuXHRcdFx0XHRcdGNvbG9yX2ZhZGUgPSB0aGVtZVsnY29sb3ItZmFkZSddIHx8IHRpbnljb2xvcihjb2xvcikubGlnaHRlbigyMCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XHRjb2xvcl9pbnYgPSB0aGVtZVsnY29sb3ItaW52J10gfHwgZGVmYXVsdHNbJ2NvbG9yLWludiddLFxuXHRcdFx0XHRcdGNvbG9yX2ludl9mYWRlID0gdGhlbWVbJ2NvbG9yLWludi1mYWRlJ10gfHwgdGlueWNvbG9yKGNvbG9yX2ludikuZGFya2VuKDQwKS50b1N0cmluZygpLFxuXG5cdFx0XHRcdFx0YmdfYWx0ID0gdGhlbWVbJ2JnLWFsdCddIHx8IGJnX2Rhcmtlcixcblx0XHRcdFx0XHRjb2xvcl9hbHQgPSB0aGVtZVsnY29sb3ItYWx0J10gfHwgdGlueWNvbG9yLm1vc3RSZWFkYWJsZShiZ19hbHQsIFtjb2xvciwgY29sb3JfaW52XSkudG9IZXhTdHJpbmcoKSxcblx0XHRcdFx0XHRib3JkZXJfYWx0ID0gdGhlbWVbJ2JvcmRlci1hbHQnXSB8fCBib3JkZXIsXG5cblx0XHRcdFx0XHRpbnB1dF9ib3JkZXIgPSB0aW55Y29sb3IoYmcpLmRhcmtlbigxMCkudG9TdHJpbmcoKSxcblxuXHRcdFx0XHRcdGJnX2ludiA9IHRoZW1lWydiZy1pbnYnXSB8fCB0aW55Y29sb3IoYmcpLnNwaW4oMTgwKS50b1N0cmluZygpLFxuXHRcdFx0XHRcdGJvcmRlcl9pbnYgPSB0aGVtZVsnYm9yZGVyLWludiddIHx8IHRpbnljb2xvcihiZykuZGFya2VuKDEwKS50b1N0cmluZygpLFxuXG5cdFx0XHRcdFx0YmdfbGlnaHRfY29sb3IsIGJnX2xpZ2h0X2NvbG9yX2ZhZGUsXG5cdFx0XHRcdFx0YmdfZGFya19jb2xvciwgYmdfZGFya19jb2xvcl9mYWRlO1xuXG5cdFx0XHRcdC8vIFNldCBUZXh0IENvbG9ycyBBY2NvcmRpbmcgVG8gVGhlIEJhY2tncm91bmQgQ29sb3JcblxuXHRcdFx0XHRpZiAoIGJnX2RhcmsgKSB7XG5cdFx0XHRcdFx0YmdfbGlnaHRfY29sb3IgPSBjb2xvcl9pbnY7XG5cdFx0XHRcdFx0YmdfbGlnaHRfY29sb3JfZmFkZSA9IGNvbG9yX2ludl9mYWRlO1xuXG5cdFx0XHRcdFx0YmdfZGFya19jb2xvciA9IGNvbG9yO1xuXHRcdFx0XHRcdGJnX2RhcmtfY29sb3JfZmFkZSA9IGNvbG9yX2ZhZGU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YmdfbGlnaHRfY29sb3IgPSBjb2xvcjtcblx0XHRcdFx0XHRiZ19saWdodF9jb2xvcl9mYWRlID0gY29sb3JfZmFkZTtcblxuXHRcdFx0XHRcdGJnX2RhcmtfY29sb3IgPSBjb2xvcl9pbnY7XG5cdFx0XHRcdFx0YmdfZGFya19jb2xvcl9mYWRlID0gY29sb3JfaW52X2ZhZGU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBTVEFSVCBDU1MgUlVMRVNcblxuXHRcdFx0XHQvLyBNYWluIEJhY2tncm91bmQgQ29sb3Jcblx0XHRcdFx0XG5cdFx0XHRcdGNzcyA9IHRoKycsICcrdGgrJyAudGhlbWUtYmcgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnKyc7IH0nO1xuXG5cdFx0XHRcdC8vIEhlbHBlciBDbGFzc2VzXG5cblx0XHRcdFx0Y3NzICs9IHRoKycgLnRoZW1lLWNvbG9yIHsgY29sb3I6ICcrY29sb3IrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC50aGVtZS1jb2xvci1mYWRlIHsgY29sb3I6ICcrY29sb3JfZmFkZSsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLnRoZW1lLWNvbG9yLWludiB7IGNvbG9yOiAnK2NvbG9yX2ludisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLnRoZW1lLWNvbG9yLWludi1mYWRlIHsgY29sb3I6ICcrY29sb3JfaW52X2ZhZGUrJzsgfSc7XG5cblx0XHRcdFx0Y3NzICs9IHRoKycgLnRoZW1lLWJnLWxpZ2h0LWNvbG9yIHsgY29sb3I6ICcrYmdfbGlnaHRfY29sb3IrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC50aGVtZS1iZy1saWdodC1jb2xvci1mYWRlIHsgY29sb3I6ICcrYmdfbGlnaHRfY29sb3JfZmFkZSsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLnRoZW1lLWJnLWRhcmstY29sb3IgeyBjb2xvcjogJytiZ19kYXJrX2NvbG9yKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAudGhlbWUtYmctZGFyay1jb2xvci1mYWRlIHsgY29sb3I6ICcrYmdfZGFya19jb2xvcl9mYWRlKyc7IH0nO1xuXG5cdFx0XHRcdGNzcyArPSB0aCsnIC5hY2NlbnQtY29sb3IgeyBjb2xvcjogJythY2NlbnQrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC5hY2NlbnQtYmcsICcrdGgrJyAudGhlbWUtc2VjdGlvbi1hY2NlbnQgeyBjb2xvcjogJytjb2xvcl9mb3JfYWNjZW50Kyc7IGJhY2tncm91bmQtY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xuXG5cdFx0XHRcdGNzcyArPSB0aCsnIC50aGVtZS1iZCB7IGJvcmRlci1jb2xvcjogJytib3JkZXIrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC50aGVtZS1hY2NlbnQtYmQgeyBib3JkZXItY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xuXG5cdFx0XHRcdC8vIFRoZW1lIFNlY3Rpb24gQ29sb3JzXG5cdFx0XHRcdFxuXHRcdFx0XHRjc3MgKz0gdGgrJyAudGhlbWUtc2VjdGlvbi1tYWluIHsgY29sb3I6ICcrY29sb3IrJzsgYmFja2dyb3VuZC1jb2xvcjogJytiZysnOyBib3JkZXItY29sb3I6ICcrYm9yZGVyKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAudGhlbWUtc2VjdGlvbi1hbHQgeyBjb2xvcjogJytjb2xvcl9hbHQrJzsgYm9yZGVyLWNvbG9yOiAnK2JvcmRlcl9hbHQrJzsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19hbHQrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC50aGVtZS1zZWN0aW9uLWFjY2VudCB7IGJvcmRlci1jb2xvcjogJythY2NlbnRfZGFya2VyKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAudGhlbWUtc2VjdGlvbi1pbnYgeyBjb2xvcjogJytjb2xvcl9pbnYrJzsgYm9yZGVyLWNvbG9yOiAnK2JvcmRlcl9pbnYrJzsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19pbnYrJzsgfSc7XG5cblx0XHRcdFx0Ly8gVGV4dCBDb2xvcnNcblx0XHRcdFx0XG5cdFx0XHRcdGNzcyArPSB0aCsnICNjb250ZW50LXdyYXAgeyBjb2xvcjogJytjb2xvcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgYSwgJyt0aCsnIC5wb3N0LW1ldGEgYTpob3ZlciwgJyt0aCsnICNicmVhZGNydW1icyBhOmhvdmVyLCAnK3RoKycgLnBhZ2VyIGE6aG92ZXIsICcrdGgrJyAucGFnZXIgbGkgPiBzcGFuLCAnK3RoKycgLmhvdmVyLWFjY2VudC1jb2xvcjpob3ZlciB7IGNvbG9yOiAnK2FjY2VudCsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgYS5uby1jb2xvciB7IGNvbG9yOiBpbmhlcml0OyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLnBvc3QtbWV0YSBhLCAnK3RoKycgLnBvc3QtbWV0YSA+IHNwYW4geyBjb2xvcjogJytjb2xvcl9mYWRlKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAuaGVhZC1tZWRpYS5iZy1saWdodCAuY29udGFpbmVyLCAnK3RoKycgLmhlYWQtbWVkaWEuYmctbGlnaHQgLm1lZGlhLWlubmVyID4gYSwgJyt0aCsnIC5oZWFkLW1lZGlhLmJnLWxpZ2h0IC5oZWFkZXItc2Nyb2xsLCAnK3RoKycgLmhlYWQtbWVkaWEuYmctbGlnaHQgI2JyZWFkY3J1bWJzID4gbGkgKyBsaTpiZWZvcmUgeyBjb2xvcjogJytiZ19saWdodF9jb2xvcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLmhlYWQtbWVkaWEuYmctZGFyayAuY29udGFpbmVyLCAnK3RoKycgLmhlYWQtbWVkaWEuYmctZGFyayAubWVkaWEtaW5uZXIgPiBhLCAnK3RoKycgLmhlYWQtbWVkaWEuYmctZGFyayAuaGVhZGVyLXNjcm9sbCwgJyt0aCsnIC5oZWFkLW1lZGlhLmJnLWRhcmsgI2JyZWFkY3J1bWJzID4gbGkgKyBsaTpiZWZvcmUgeyBjb2xvcjogJytiZ19kYXJrX2NvbG9yKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAucG9zdC1yZWxhdGVkLnJlbGF0ZWQtbWVkaWEgLnJlbGF0ZWQtY29udGVudCB7IGNvbG9yOiAnK2JnX2RhcmtfY29sb3IrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC5saW5rLWxpc3QgbGkgYSB7IGNvbG9yOiAnK2NvbG9yX2ZhZGUrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC5saW5rLWxpc3QgbGkgYTpob3ZlciwgJyt0aCsnIC5saW5rLWxpc3QgbGkgYTphY3RpdmUsICcrdGgrJyAubGluay1saXN0IGxpLmFjdGl2ZSA+IGEgeyBjb2xvcjogJythY2NlbnQrJzsgfSc7XG5cblx0XHRcdFx0Ly8gQm9yZGVyIENvbG9yc1xuXHRcdFx0XHRcblx0XHRcdFx0Y3NzICs9IHRoKycsICcrdGgrJyAjY29udGVudC13cmFwLCAnK3RoKycgLnNpZGViYXIgdWwsICcrdGgrJyAucG9zdC1mZWF0LmZlYXQtZm9ybWF0LCAnK3RoKycgLndwLWNhcHRpb24sICcrdGgrJyBociB7IGJvcmRlci1jb2xvcjogJytib3JkZXIrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC5hcnRpY2xlLnN0aWNreSAucGFnZS10aXRsZSwgJyt0aCsnIC5hcnRpY2xlLnN0aWNreS1wb3N0IC5wYWdlLXRpdGxlIHsgYm9yZGVyLWNvbG9yOiAnK2FjY2VudCsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLmNvbW1lbnQtbGlzdCAuYnlwb3N0YXV0aG9yID4gLmNvbW1lbnQtY29udCB7IGJvcmRlci1sZWZ0LWNvbG9yOiAnK2FjY2VudCsnOyB9JztcblxuXG5cdFx0XHRcdC8vIEJhY2tncm91bmQgQ29sb3JzXG5cdFx0XHRcdFxuXHRcdFx0XHRjc3MgKz0gdGgrJyAuYWNjZW50LWJnOmhvdmVyLCAnK3RoKycgLmhvdmVyLWFjY2VudC1iZzpob3ZlciwgJyt0aCsnIC50YWctbGlzdCBhOmhvdmVyLCAnK3RoKycgLnRhZ2Nsb3VkIGE6aG92ZXIgeyBjb2xvcjogJytjb2xvcl9mb3JfYWNjZW50KycgIWltcG9ydGFudDsgYmFja2dyb3VuZC1jb2xvcjogJythY2NlbnQrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC5hcnRpY2xlIC5wb3N0LWluZm8gLnBvc3QtZGF0ZSB7IGJhY2tncm91bmQtY29sb3I6ICcrYmdfZGFya2VyKyc7IH0nO1xuXG5cdFx0XHRcdC8vIE90aGVyIENvbG9yc1xuXHRcdFx0XHRcblx0XHRcdFx0Y3NzICs9IHRoKycgOjpzZWxlY3Rpb24geyBvcGFjaXR5OiAwLjg7IGJhY2tncm91bmQ6ICcrYWNjZW50Kyc7IGNvbG9yOiAnK2NvbG9yX2Zvcl9hY2NlbnQrJzsgfSc7XG5cblx0XHRcdFx0Y3NzICs9IHRoKycgYmxvY2txdW90ZSB7IGJvcmRlci1jb2xvcjogJytib3JkZXIrJzsgYm9yZGVyLWxlZnQtY29sb3I6ICcrYWNjZW50Kyc7IGJhY2tncm91bmQtY29sb3I6ICcrYmdfZGFya2VyKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyBibG9ja3F1b3RlIGNpdGUgeyBjb2xvcjogJytjb2xvcl9mYWRlKyc7IH0nO1xuXG5cdFx0XHRcdGNzcyArPSB0aCsnIC5zaWRlYmFyIC5jaGlsZC1wYWdlLW5hdiBsaSBhOmhvdmVyLCAnK3RoKycgLndpZGdldC1hcmVhIC5uYXYgbGkgYTpob3ZlciB7IGNvbG9yOiAnK2FjY2VudCsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLnNpZGViYXIgLmNoaWxkLXBhZ2UtbmF2IC5jdXJyZW50X3BhZ2VfaXRlbSwgJyt0aCsnIC5zaWRlYmFyIC5jaGlsZC1wYWdlLW5hdiAuY3VycmVudF9wYWdlX2l0ZW06YmVmb3JlIHsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19kYXJrZXIrJzsgfSc7XG5cblx0XHRcdFx0Ly8gQm9vdHN0cmFwIEVsZW1lbnRzXG5cblx0XHRcdFx0Y3NzICs9IHRoKycgLmFsZXJ0LWRlZmF1bHQgeyBjb2xvcjogJytjb2xvcisnOyBib3JkZXItY29sb3I6ICcrYm9yZGVyKyc7IGJhY2tncm91bmQtY29sb3I6ICcrYmdfZGFya2VyKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAuYWxlcnQtZGVmYXVsdCBhIHsgY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAucGFuZWwgeyBib3JkZXItY29sb3I6ICcrYm9yZGVyKyc7IGJhY2tncm91bmQtY29sb3I6ICcrYmdfbGlnaHRlcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLndlbGwgeyBib3JkZXItY29sb3I6ICcrYm9yZGVyKyc7IGJhY2tncm91bmQtY29sb3I6ICcrYmdfZGFya2VyKyc7IH0nO1xuXG5cdFx0XHRcdC8vIEJhY2tncm91bmQgVmFyaWFudHNcblx0XHRcdFx0XG5cdFx0XHRcdGNzcyArPSB0aCsnIC5iZy1saWdodCB7IGNvbG9yOiAnK2JnX2xpZ2h0X2NvbG9yKyc7IH0gJyt0aCsnIC5iZy1saWdodCAudGV4dC1mYWRlIHsgY29sb3I6ICcrYmdfbGlnaHRfY29sb3JfZmFkZSsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLmJnLWRhcmsgeyBjb2xvcjogJytiZ19kYXJrX2NvbG9yKyc7IH0gJyt0aCsnIC5iZy1kYXJrIC50ZXh0LWZhZGUgeyBjb2xvcjogJytiZ19kYXJrX2NvbG9yX2ZhZGUrJzsgfSc7XG5cblx0XHRcdFx0Ly8gSW5wdXRzXG5cdFx0XHRcdFxuXHRcdFx0XHRjc3MgKz0gdGgrJyBpbnB1dDpub3QoW3R5cGU9c3VibWl0XSk6bm90KFt0eXBlPWJ1dHRvbl0pOm5vdCguYnRuKSwgJyt0aCsnIHNlbGVjdCwgJyt0aCsnIHRleHRhcmVhLCAnK3RoKycgLmZvcm0tY29udHJvbCwgJyArXG5cdFx0XHRcdFx0ICAgdGgrJyAucG9zdC1wYXNzd29yZC1mb3JtIGlucHV0W3R5cGU9XCJwYXNzd29yZFwiXSwgJyt0aCsnIC53b29jb21tZXJjZSAuaW5wdXQtdGV4dCB7IGNvbG9yOiAnK2NvbG9yKyc7IGJvcmRlci1jb2xvcjogJytpbnB1dF9ib3JkZXIrJzsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19kYXJrZXIrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIGlucHV0Om5vdChbdHlwZT1zdWJtaXRdKTpub3QoW3R5cGU9YnV0dG9uXSk6bm90KC5idG4pOmZvY3VzLCAnK3RoKycgc2VsZWN0OmZvY3VzLCAnK3RoKycgdGV4dGFyZWE6Zm9jdXMsICcrdGgrJyAuZm9ybS1jb250cm9sOmZvY3VzLCAnICtcblx0XHRcdFx0XHQgICB0aCsnIC5wb3N0LXBhc3N3b3JkLWZvcm0gaW5wdXRbdHlwZT1cInBhc3N3b3JkXCJdOmZvY3VzLCAnK3RoKycgLndvb2NvbW1lcmNlIC5pbnB1dC10ZXh0OmZvY3VzIHsgYm9yZGVyLWNvbG9yOiAnK2lucHV0X2JvcmRlcisnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK3Rpbnljb2xvcihiZykubGlnaHRlbigyKS50b1N0cmluZygpKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyBpbnB1dDo6LXdlYmtpdC1pbnB1dC1wbGFjZWhvbGRlciwgJyt0aCsnIC5mb3JtLWNvbnRyb2w6Oi13ZWJraXQtaW5wdXQtcGxhY2Vob2xkZXIgeyBjb2xvcjogJytjb2xvcl9mYWRlKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyBpbnB1dDo6LW1vei1wbGFjZWhvbGRlciwgJyt0aCsnIC5mb3JtLWNvbnRyb2w6Oi1tb3otcGxhY2Vob2xkZXIgeyBjb2xvcjogJytjb2xvcl9mYWRlKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyBpbnB1dDotbXMtaW5wdXQtcGxhY2Vob2xkZXIsICcrdGgrJyAuZm9ybS1jb250cm9sOi1tcy1pbnB1dC1wbGFjZWhvbGRlciB7IGNvbG9yOiAnK2NvbG9yX2ZhZGUrJzsgfSc7XG5cdFx0XHRcdGlmICggYmdfZGFyayApIHtcblx0XHRcdFx0XHRjc3MgKz0gdGgrJyBzZWxlY3QsIC5taXh0ICcrdGgrJyAuc2VsZWN0Mi1jb250YWluZXIgLnNlbGVjdDItYXJyb3cgYjphZnRlciB7IGJhY2tncm91bmQtaW1hZ2U6IHVybChcIicrbWl4dF9jdXN0b21pemVbJ21peHQtdXJpJ10rJy9hc3NldHMvaW1nL2ljb25zL3NlbGVjdC1hcnJvdy1saWdodC5wbmdcIik7IH0nO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQnV0dG9uc1xuXHRcdFx0XHRcblx0XHRcdFx0Y3NzICs9IGJ1dHRvbl9jb2xvcihbJ3ByaW1hcnknLCAnYWNjZW50J10sIGFjY2VudCwgdGgpO1xuXHRcdFx0XHRjc3MgKz0gYnV0dG9uX2NvbG9yKCdtaW5pbWFsJywgYmdfZGFya2VyLCB0aCk7XG5cblx0XHRcdFx0Ly8gRWxlbWVudCBDb2xvcnNcblx0XHRcdFx0XG5cdFx0XHRcdGNzcyArPSB0aCsnIC5taXh0LXN0YXQudHlwZS1ib3gsICcrdGgrJyAubWl4dC1oZWFkbGluZSBzcGFuLmNvbG9yLWF1dG86YWZ0ZXIsICcrdGgrJyAubWl4dC10aW1lbGluZSAudGltZWxpbmUtYmxvY2s6YmVmb3JlIHsgYm9yZGVyLWNvbG9yOiAnK2JvcmRlcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLm1peHQtcm93LXNlcGFyYXRvci5uby1maWxsIHN2ZyB7IGZpbGw6ICcrYmcrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC5taXh0LW1hcCB7IGNvbG9yOiAnK2JnX2xpZ2h0X2NvbG9yKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAubWl4dC1mbGlwY2FyZCA+IC5pbm5lciA+IC5hY2NlbnQgeyBjb2xvcjogJytjb2xvcl9mb3JfYWNjZW50Kyc7IGJhY2tncm91bmQtY29sb3I6ICcrYWNjZW50Kyc7IGJvcmRlci1jb2xvcjogJythY2NlbnRfZGFya2VyKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAubWl4dC1wcmljaW5nLmFjY2VudCAubWl4dC1wcmljaW5nLWlubmVyIC5oZWFkZXIgeyBjb2xvcjogJytjb2xvcl9mb3JfYWNjZW50Kyc7IGJhY2tncm91bmQtY29sb3I6ICcrYWNjZW50Kyc7IGJveC1zaGFkb3c6IDAgMCAwIDFweCAnK2FjY2VudF9kYXJrZXIrJzsgdGV4dC1zaGFkb3c6IDAgMXB4IDFweCAnK3RleHRzaF9mb3JfYWNjZW50Kyc7IH0nO1xuXHRcdFx0XHQvLyBBY2NlbnQgQ29sb3IgVmFyaWFudHNcblx0XHRcdFx0Y3NzICs9IHRoKycgLm1peHQtaWNvbiBpLmFjY2VudCwgJyt0aCsnIC5taXh0LXN0YXQuY29sb3Itb3V0bGluZS5hY2NlbnQgeyBjb2xvcjogJythY2NlbnQrJzsgfSc7XG5cdFx0XHRcdC8vIEFjY2VudCBCb3JkZXIgVmFyaWFudHNcblx0XHRcdFx0Y3NzICs9IHRoKycgLm1peHQtaWNvbi5pY29uLW91dGxpbmUuYWNjZW50LCAnICtcblx0XHRcdFx0XHQgICB0aCsnIC5taXh0LXN0YXQuY29sb3Itb3V0bGluZS5hY2NlbnQsICcgK1xuXHRcdFx0XHRcdCAgIHRoKycgLm1peHQtaWNvbmJveCAuaW5uZXIuYm9yZGVyZWQuYWNjZW50LCAnICtcblx0XHRcdFx0XHQgICB0aCsnIC5taXh0LWltYWdlIC5pbWFnZS13cmFwLmFjY2VudCB7IGJvcmRlci1jb2xvcjogJythY2NlbnQrJzsgfSc7XG5cdFx0XHRcdC8vIEFjY2VudCBCZyBWYXJpYW50c1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAubWl4dC1zdGF0LmNvbG9yLWJnLmFjY2VudCwgJyArXG5cdFx0XHRcdFx0ICAgdGgrJyAubWl4dC1pY29uLmljb24tc29saWQuYWNjZW50LCAnICtcblx0XHRcdFx0XHQgICB0aCsnIC5taXh0LWljb25ib3ggLmlubmVyLnNvbGlkLmFjY2VudCwgJyArXG5cdFx0XHRcdFx0ICAgdGgrJyAubWl4dC1yZXZpZXcuYm94ZWQuYWNjZW50LCAnICtcblx0XHRcdFx0XHQgICB0aCsnIC5taXh0LXJldmlldy5idWJibGUgLnJldmlldy1jb250ZW50LmFjY2VudCwgJyArXG5cdFx0XHRcdFx0ICAgdGgrJyAubWl4dC1yZXZpZXcuYnViYmxlIC5yZXZpZXctY29udGVudC5hY2NlbnQ6YmVmb3JlLCAnICtcblx0XHRcdFx0XHQgICB0aCsnIC5taXh0LXRpbWVsaW5lIC50aW1lbGluZS1ibG9jayAuY29udGVudC5ib3hlZC5hY2NlbnQsICcgK1xuXHRcdFx0XHRcdCAgIHRoKycgLm1peHQtdGltZWxpbmUgLnRpbWVsaW5lLWJsb2NrIC5jb250ZW50LmJ1YmJsZS5hY2NlbnQsICcgK1xuXHRcdFx0XHRcdCAgIHRoKycgLm1peHQtdGltZWxpbmUgLnRpbWVsaW5lLWJsb2NrIC5jb250ZW50LmJ1YmJsZS5hY2NlbnQ6YmVmb3JlLCAnICtcblx0XHRcdFx0XHQgICB0aCsnIC5ob3Zlci1jb250ZW50IC5vbi1ob3Zlci5hY2NlbnQgeyBjb2xvcjogJytjb2xvcl9mb3JfYWNjZW50Kyc7IGJvcmRlci1jb2xvcjogJythY2NlbnRfZGFya2VyKyc7IGJhY2tncm91bmQtY29sb3I6ICcrYWNjZW50Kyc7IHRleHQtc2hhZG93OiAwIDFweCAxcHggJyt0ZXh0c2hfZm9yX2FjY2VudCsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLm1peHQtaWNvbi5pY29uLXNvbGlkLmFjY2VudC5hbmltLWludmVydDpob3ZlciwgJyt0aCsnIC5pY29uLWNvbnQ6aG92ZXIgLm1peHQtaWNvbi5pY29uLXNvbGlkLmFjY2VudC5hbmltLWludmVydCB7IGNvbG9yOiAnK2FjY2VudCsnOyBib3JkZXItY29sb3I6ICcrYWNjZW50X2RhcmtlcisnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2NvbG9yX2Zvcl9hY2NlbnQrJzsgdGV4dC1zaGFkb3c6IDAgMXB4IDFweCAnK3NldF90ZXh0c2hfZm9yX2JnKGNvbG9yX2Zvcl9hY2NlbnQpKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAuaG92ZXItY29udGVudCAub24taG92ZXIuYWNjZW50IHsgYmFja2dyb3VuZC1jb2xvcjogJyt0aW55Y29sb3IoYWNjZW50KS5zZXRBbHBoYSgwLjc1KS50b1BlcmNlbnRhZ2VSZ2JTdHJpbmcoKSsnOyB9JztcblxuXHRcdFx0XHQvLyBQbHVnaW4gQ29sb3JzXG5cblx0XHRcdFx0Ly8gTGlnaHRTbGlkZXJcblx0XHRcdFx0Y3NzICs9IHRoKycgLmxTU2xpZGVPdXRlciAubFNQYWdlci5sU3BnID4gbGkgYSB7IGJhY2tncm91bmQtY29sb3I6ICcrY29sb3JfZmFkZSsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLmxTU2xpZGVPdXRlciAubFNQYWdlci5sU3BnID4gbGk6aG92ZXIgYSwgJyt0aCsnIC5sU1NsaWRlT3V0ZXIgLmxTUGFnZXIubFNwZyA+IGxpLmFjdGl2ZSBhIHsgYmFja2dyb3VuZC1jb2xvcjogJythY2NlbnQrJzsgfSc7XG5cblx0XHRcdFx0Ly8gTGlnaHRHYWxsZXJ5XG5cdFx0XHRcdGNzcyArPSBib2R5X3RoKycgLmxnLW91dGVyIC5sZy10aHVtYi1pdGVtLmFjdGl2ZSwgJytib2R5X3RoKycgLmxnLW91dGVyIC5sZy10aHVtYi1pdGVtOmhvdmVyIHsgYm9yZGVyLWNvbG9yOiAnK2FjY2VudCsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IGJvZHlfdGgrJyAubGctcHJvZ3Jlc3MtYmFyIC5sZy1wcm9ncmVzcyB7IGJhY2tncm91bmQtY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xuXG5cdFx0XHRcdC8vIFNlbGVjdDJcblx0XHRcdFx0Y3NzICs9IGJvZHlfdGgrJyAuc2VsZWN0Mi1jb250YWluZXIgYS5zZWxlY3QyLWNob2ljZSwgJytib2R5X3RoKycgLnNlbGVjdDItZHJvcCwgJytib2R5X3RoKycgLnNlbGVjdDItZHJvcC5zZWxlY3QyLWRyb3AtYWN0aXZlIHsgY29sb3I6ICcrY29sb3IrJzsgYm9yZGVyLWNvbG9yOiAnK2lucHV0X2JvcmRlcisnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2RhcmtlcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IGJvZHlfdGgrJyAuc2VsZWN0Mi1yZXN1bHRzIHsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19kYXJrZXIrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSBib2R5X3RoKycgLnNlbGVjdDItcmVzdWx0cyAuc2VsZWN0Mi1oaWdobGlnaHRlZCB7IGNvbG9yOiAnK2NvbG9yKyc7IGJhY2tncm91bmQtY29sb3I6ICcrYmdfbGlnaHRlcisnOyB9JztcblxuXHRcdFx0XHQvLyBWaXN1YWwgQ29tcG9zZXJcblx0XHRcdFx0Y3NzICs9IHRoKycgLndwYl9jb250ZW50X2VsZW1lbnQgLndwYl90b3VyX3RhYnNfd3JhcHBlciAud3BiX3RhYnNfbmF2IGE6aG92ZXIsICcrdGgrJyAud3BiX2NvbnRlbnRfZWxlbWVudCAud3BiX2FjY29yZGlvbl9oZWFkZXIgYTpob3ZlciB7IGNvbG9yOiAnK2FjY2VudCsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLnZjX3NlcGFyYXRvci50aGVtZS1iZCAudmNfc2VwX2hvbGRlciAudmNfc2VwX2xpbmUgeyBib3JkZXItY29sb3I6ICcrYm9yZGVyKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAubWl4dC1ncmlkLWl0ZW0gLmdpdGVtLXRpdGxlLWNvbnQgeyBjb2xvcjogJytjb2xvcisnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2xpZ2h0ZXIrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC52Y190dGEudmNfdHRhLXN0eWxlLWNsYXNzaWM6bm90KC52Y190dGEtby1uby1maWxsKSAudmNfdHRhLXBhbmVsLWJvZHksICcrdGgrJyAudmNfdHRhLnZjX3R0YS1zdHlsZS1tb2Rlcm46bm90KC52Y190dGEtby1uby1maWxsKSAudmNfdHRhLXBhbmVsLWJvZHkgeyBjb2xvcjogJytiZ19saWdodF9jb2xvcisnOyB9JztcblxuXHRcdFx0XHQvLyBXb29Db21tZXJjZVxuXHRcdFx0XHRjc3MgKz0gdGgrJyAud29vY29tbWVyY2UgLnByaWNlIC5hbW91bnQsICcrdGgrJyAud29vY29tbWVyY2UgLnRvdGFsIC5hbW91bnQsICcrdGgrJyAud29vY29tbWVyY2UgLndvby1jYXJ0IC5hbW91bnQsICcrdGgrJyAud29vY29tbWVyY2UgLm5hdiBsaSAuYW1vdW50IHsgY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAud29vY29tbWVyY2UgLm5hdiBsaSBkZWwgLmFtb3VudCwgJyt0aCsnIC53b29jb21tZXJjZSAjcmV2aWV3cyAjY29tbWVudHMgb2wuY29tbWVudGxpc3QgbGkgLm1ldGEgeyBjb2xvcjogJytjb2xvcl9mYWRlKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAud29vY29tbWVyY2UgLndpZGdldF9wcmljZV9maWx0ZXIgLnVpLXNsaWRlciAudWktc2xpZGVyLXJhbmdlIHsgYmFja2dyb3VuZC1jb2xvcjogJythY2NlbnQrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC53b29jb21tZXJjZSAuYmFkZ2UtY29udCAuYmFkZ2Uuc2FsZS1iYWRnZSB7IGNvbG9yOiAnK2NvbG9yX2Zvcl9hY2NlbnQrJzsgYmFja2dyb3VuZC1jb2xvcjogJythY2NlbnQrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC53b29jb21tZXJjZSAud29vY29tbWVyY2UtdGFicyB1bC50YWJzIGxpIGEgeyBjb2xvcjogJytjb2xvcl9mYWRlKycgIWltcG9ydGFudDsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC53b29jb21tZXJjZSAud29vY29tbWVyY2UtdGFicyB1bC50YWJzIGxpLmFjdGl2ZSB7IGJvcmRlci1ib3R0b20tY29sb3I6ICcrYmcrJyAhaW1wb3J0YW50OyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLndvb2NvbW1lcmNlIC53b29jb21tZXJjZS10YWJzIHVsLnRhYnMgbGkuYWN0aXZlIGEgeyBjb2xvcjogJytjb2xvcisnICFpbXBvcnRhbnQ7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAud29vY29tbWVyY2UgLndvb2NvbW1lcmNlLXRhYnMgdWwudGFicyBsaS5hY3RpdmUsICcrdGgrJyAud29vY29tbWVyY2UgLndvb2NvbW1lcmNlLXRhYnMgLndjLXRhYiB7IGNvbG9yOiAnK2NvbG9yKycgIWltcG9ydGFudDsgYmFja2dyb3VuZC1jb2xvcjogJytiZysnICFpbXBvcnRhbnQ7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAud29vY29tbWVyY2UgdGFibGUuc2hvcF90YWJsZSwgJyt0aCsnIC53b29jb21tZXJjZSB0YWJsZS5zaG9wX3RhYmxlIHRoLCAnK3RoKycgLndvb2NvbW1lcmNlIHRhYmxlLnNob3BfdGFibGUgdGQsICcgK1xuXHRcdFx0XHRcdCAgIHRoKycgLndvb2NvbW1lcmNlIC5jYXJ0LWNvbGxhdGVyYWxzIC5jYXJ0X3RvdGFscyB0ciB0ZCwgJyt0aCsnIC53b29jb21tZXJjZSAuY2FydC1jb2xsYXRlcmFscyAuY2FydF90b3RhbHMgdHIgdGggeyBib3JkZXItY29sb3I6ICcrYm9yZGVyKycgIWltcG9ydGFudDsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC53b29jb21tZXJjZS1jaGVja291dCAjcGF5bWVudCwgJyArXG5cdFx0XHRcdFx0ICAgdGgrJyAud29vY29tbWVyY2UgZm9ybSAuZm9ybS1yb3cud29vY29tbWVyY2UtdmFsaWRhdGVkIC5zZWxlY3QyLWNob2ljZSwgJyt0aCsnIC53b29jb21tZXJjZSBmb3JtIC5mb3JtLXJvdy53b29jb21tZXJjZS12YWxpZGF0ZWQgaW5wdXQuaW5wdXQtdGV4dCwgJyt0aCsnIC53b29jb21tZXJjZSBmb3JtIC5mb3JtLXJvdy53b29jb21tZXJjZS12YWxpZGF0ZWQgc2VsZWN0LCAnICtcblx0XHRcdFx0XHQgICB0aCsnIC53b29jb21tZXJjZSBmb3JtIC5mb3JtLXJvdy53b29jb21tZXJjZS1pbnZhbGlkIC5zZWxlY3QyLWNob2ljZSwgJyt0aCsnIC53b29jb21tZXJjZSBmb3JtIC5mb3JtLXJvdy53b29jb21tZXJjZS1pbnZhbGlkIGlucHV0LmlucHV0LXRleHQsICcrdGgrJyAud29vY29tbWVyY2UgZm9ybSAuZm9ybS1yb3cud29vY29tbWVyY2UtaW52YWxpZCBzZWxlY3QgeyBib3JkZXItY29sb3I6ICcraW5wdXRfYm9yZGVyKyc7IH0nO1xuXG5cdFx0XHRcdE1JWFQuc3R5bGVzaGVldCgnc2l0ZS10aGVtZS0nK2lkLCBjc3MpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdFxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3NpdGUtdGhlbWVzXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdHVwZGF0ZVNpdGVUaGVtZXModG8pO1xuXHRcdH0pO1xuXHR9KTtcblxuXHQvLyBHZW5lcmF0ZSBjdXN0b20gdGhlbWUgaWYgc2VsZWN0ZWQgdGhlbWUgaXMgbm90IG9uZSBvZiB0aGUgZGVmYXVsdHNcblx0ZnVuY3Rpb24gbWF5YmVVcGRhdGVTaXRlVGhlbWVzKGlkKSB7XG5cdFx0aWYgKCBpZCA9PSAnYXV0bycgKSBpZCA9IHRoZW1lcy5zaXRlO1xuXHRcdGlmICggISBfLmhhcyhtaXh0X2N1c3RvbWl6ZVsnZGVmYXVsdC1zaXRlLXRoZW1lcyddLCBpZCkgKSB7XG5cdFx0XHR2YXIgc2l0ZVRoZW1lcyA9IHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2l0ZS10aGVtZXNdJykuZ2V0KCk7XG5cdFx0XHR1cGRhdGVTaXRlVGhlbWVzKHNpdGVUaGVtZXMpO1xuXHRcdH1cblx0fVxuXHQkKCcjbWFpbi13cmFwLWlubmVyLCAjY29sb3Bob24nKS5vbigndGhlbWUtY2hhbmdlJywgZnVuY3Rpb24oZXZlbnQsIHRoZW1lKSB7XG5cdFx0bWF5YmVVcGRhdGVTaXRlVGhlbWVzKHRoZW1lKTtcblx0fSk7XG5cbn0pKGpRdWVyeSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
