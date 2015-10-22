
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
		type: 1,
		shape: 'ring',
		color: '#000',
		img: '',
		anim: 'bounce',
		setup: false,
		init: function() {
			if ( ! this.setup ) this.setOptions();
			$('body').addClass('loading');
			if ( $('#load-overlay').length === 0 ) $('body').append('<div id="load-overlay"><div class="load-inner"></div></div>');
			this.loader = $('#load-overlay');
			this.loader.find('.loader').show();
			this.loadInner = this.loader.children('.load-inner');
			this.loadShape();
			if ( $('#loader-close').length === 0 ) {
				this.loader.append('<button id="loader-close" class="btn btn-red btn-lg" style="position: absolute; top: 20px; right: 20px;">&times;</button>');
			}
			$('#loader-close').click( function() { $('body').removeClass('loading'); });
		},
		setOptions: function() {
			this.enabled = wp.customize._value['mixt_opt[page-loader]'].get() == '1';
			this.type = wp.customize._value['mixt_opt[page-loader-type]'].get();
			this.shape = wp.customize._value['mixt_opt[page-loader-shape]'].get();
			this.color = wp.customize._value['mixt_opt[page-loader-color]'].get();
			this.img = wp.customize._value['mixt_opt[page-loader-img]'].get();
			this.anim = wp.customize._value['mixt_opt[page-loader-anim]'].get();
			this.setup = true;
		},
		loadShape: function() {
			var classes = 'loader',
				loader  = '';
			if ( this.anim != 'none' ) classes += ' animated infinite ' + this.anim;
			if ( this.type == 1 ) {
				loader = '<div class="' + classes + ' ' + this.shape + '"></div>';
			} else if ( ! _.isEmpty(this.img.url) ) {
				loader = '<img src="' + this.img.url + '" alt="Loading..." class="' + classes + '">';
			} else {
				loader = '<div class="ring ' + classes + '"></div>';
			}
			this.loadInner.html(loader);
		},
		handle: function(value, type) {
			if ( type != 'switch' || value == '1' ) this.init();
			if ( type == 'switch' ) {
				if ( value == '0' ) {
					this.enabled = false;
					$('body').removeClass('loading');
				} else {
					this.enabled = true;
				}
			} else if ( this.enabled ) {
				switch (type) {
					case 'type':
						this.type = value;
						this.loadShape();
						break;
					case 'shape':
						this.shape = value;
						this.loadShape();
						break;
					case 'color':
						this.color = value;
						this.loadInner.children('.ring, .square2').css('border-color', value);
						this.loadInner.children('.circle, .square').css('background-color', value);
						break;
					case 'img':
						this.img = value;
						this.loadShape();
						break;
					case 'anim':
						this.anim = value;
						this.loadShape();
						break;
					case 'bg':
						this.loader.css('background-color', value);
						break;
				}
			}
		},
	};

	wp.customize('mixt_opt[page-loader]', function(value) {
		value.bind( function(to) { pageLoader.handle(to, 'switch'); });
	});
	wp.customize('mixt_opt[page-loader-type]', function(value) {
		value.bind( function(to) { pageLoader.handle(to, 'type'); });
	});
	wp.customize('mixt_opt[page-loader-shape]', function(value) {
		value.bind( function(to) { pageLoader.handle(to, 'shape'); });
	});
	wp.customize('mixt_opt[page-loader-color]', function(value) {
		value.bind( function(to) { pageLoader.handle(to, 'color'); });
	});
	wp.customize('mixt_opt[page-loader-img]', function(value) {
		value.bind( function(to) { pageLoader.handle(to, 'img'); });
	});
	wp.customize('mixt_opt[page-loader-bg]', function(value) {
		value.bind( function(to) { pageLoader.handle(to, 'bg'); });
	});
	wp.customize('mixt_opt[page-loader-anim]', function(value) {
		value.bind( function(to) { pageLoader.handle(to, 'anim'); });
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

			if ( color_inv != '' ) {
				html += '<strong class="logo-light">'+text+'</strong>';
				html += '<strong class="logo-dark">'+text+'</strong>';
			} else {
				html += '<strong>'+text+'</strong>';
			}

			css += '#nav-logo strong {';
				css += 'color: '+color+';';
				css += 'font-size: '+text_typo['font-size']+';';
				css += 'font-family: '+text_typo['font-family']+';';
				css += 'font-weight: '+text_typo['font-weight']+';';
				css += 'text-transform: '+text_typo['text-transform']+';';
			css += '}';
			css += '#nav-logo .logo-dark { color: '+color_inv+'; }';

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

	if ( _.isEmpty(wp.customize('mixt_opt[nav-themes]')) ) return;
	
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

				css += navbar+'.init { background-color: '+bg+' !important; }';

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

	// Generate custom themes if theme is changed from one of the defaults
	function maybeUpdateNavThemes(id) {
		if ( id == 'auto' ) id = themes.site;
		if ( ! _.has(mixt_customize.themes, id) ) {
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

	if ( _.isEmpty(wp.customize('mixt_opt[site-themes]')) ) return;
	
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
		colors = colors || ['rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)'];
		if ( tinycolor(bg).isLight() ) {
			return colors[0];
		} else {
			return colors[1];
		}
	}

	function button_color(sel, color, pre) {
		pre = pre || '.mixt';

		var css = '',
			color_for_bg = tinycolor.mostReadable(color, ['#fff', '#000']).toHexString(),
			border_color = tinycolor(color).darken(5).toString(),
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
		css += parse_selector(pre+' .btn-outline-{{sel}}, '+pre+' .btn-hover-outline-{{sel}}:hover', sel) + ' { border: 1px solid '+border_color+'; text-shadow: none !important; background-color: transparent; }';
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
				
				css = th+' { background-color: '+bg+'; }';

				// Helper Classes
				
				css += th+' .theme-bg { background-color: '+bg+'; }';

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
				css += th+' .post-meta a, '+th+' .post-meta > span { color: '+color_fade+'; }';
				css += th+' .head-media.bg-light .container, '+th+' .head-media.bg-light .media-inner > a, '+th+' .head-media.bg-light .header-scroll, '+th+' .head-media.bg-light #breadcrumbs > li + li:before { color: '+bg_light_color+'; }';
				css += th+' .head-media.bg-dark .container, '+th+' .head-media.bg-dark .media-inner > a, '+th+' .head-media.bg-dark .header-scroll, '+th+' .head-media.bg-dark #breadcrumbs > li + li:before { color: '+bg_dark_color+'; }';
				css += th+' .post-related.related-media .related-content { color: '+bg_dark_color+'; }';
				css += th+' .link-list li a { color: '+color_fade+'; }';
				css += th+' .link-list li a:hover, '+th+' .link-list li a:active, '+th+' .link-list li.active > a { color: '+accent+'; }';

				// Border Colors
				
				css += th+', '+th+' #content-wrap, '+th+' .sidebar ul, '+th+' .post-feat.feat-format, '+th+' .wp-caption, '+th+' hr { border-color: '+border+'; }';
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
					   th+' .post-password-form input[type="password"], '+th+' .woocommerce .input-text { color: '+color+'; border-color: '+border+'; background-color: '+bg_darker+'; }';
				css += th+' input:not([type=submit]):not([type=button]):not(.btn):focus, '+th+' select:focus, '+th+' textarea:focus, '+th+' .form-control:focus, ' +
					   th+' .post-password-form input[type="password"]:focus, '+th+' .woocommerce .input-text:focus { border-color: '+tinycolor(border).lighten(2).toString()+'; background-color: '+tinycolor(bg).lighten(2).toString()+'; }';
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
				css += body_th+' .select2-container a.select2-choice, '+body_th+' .select2-drop, '+body_th+' .select2-drop.select2-drop-active { color: '+color+'; border-color: '+border+'; background-color: '+bg_darker+'; }';
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
					   th+' .woocommerce form .form-row.woocommerce-invalid .select2-choice, '+th+' .woocommerce form .form-row.woocommerce-invalid input.input-text, '+th+' .woocommerce form .form-row.woocommerce-invalid select { border-color: '+border+'; }';

				MIXT.stylesheet('site-theme-'+id, css);
			}
		});
	}
	
	wp.customize('mixt_opt[site-themes]', function(value) {
		value.bind( function(to) {
			updateSiteThemes(to);
		});
	});

	// Generate custom themes if theme is changed from one of the defaults
	function maybeUpdateSiteThemes(id) {
		if ( id == 'auto' ) id = themes.site;
		if ( ! _.has(mixt_customize.themes, id) ) {
			var siteThemes = wp.customize('mixt_opt[site-themes]').get();
			updateSiteThemes(siteThemes);
		}
	}
	$('#main-wrap-inner').on('theme-change', function(event, theme) {
		maybeUpdateSiteThemes(theme);
	});
	$('#colophon').on('theme-change', function(event, theme) {
		maybeUpdateSiteThemes(theme);
	});

})(jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvb3Rlci5qcyIsImdsb2JhbC5qcyIsImhlYWRlci5qcyIsImxvZ28uanMiLCJuYXZiYXJzLmpzIiwidGhlbWVzLmpzIiwidGhlbWVzLm5hdi5qcyIsInRoZW1lcy5zaXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNySkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25PQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjdXN0b21pemVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xuQ1VTVE9NSVpFUiBJTlRFR1JBVElPTiAtIEZPT1RFUlxuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuKCBmdW5jdGlvbigkKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qIGdsb2JhbCB3cCAqL1xuXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbZm9vdGVyLXdpZGdldHMtYmctY29sb3JdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0JCgnI2NvbG9waG9uIC53aWRnZXQtcm93JykuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgdG8pO1xuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtmb290ZXItd2lkZ2V0cy1iZy1wYXRdJywgZnVuY3Rpb24oIHZhbHVlICkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHRpZiAoIHRvID09ICcwJyApIHtcblx0XHRcdFx0JCgnI2NvbG9waG9uIC53aWRnZXQtcm93JykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ25vbmUnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNjb2xvcGhvbiAud2lkZ2V0LXJvdycpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoXCInICsgdG8gKyAnXCIpJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2Zvb3Rlci13aWRnZXRzLXRleHQtY29sb3JdJywgZnVuY3Rpb24oIHZhbHVlICkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHQkKCcjY29sb3Bob24gLndpZGdldC1yb3cnKS5jc3MoJ2NvbG9yJywgdG8pO1xuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtmb290ZXItd2lkZ2V0cy1ib3JkZXItY29sb3JdJywgZnVuY3Rpb24oIHZhbHVlICkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHQkKCcjY29sb3Bob24gLndpZGdldC1yb3cnKS5jc3MoJ2JvcmRlci1jb2xvcicsIHRvKTtcblx0XHR9KTtcblx0fSk7XG5cblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtmb290ZXItY29weS1iZy1jb2xvcl0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHQkKCcjY29sb3Bob24gLmNvcHlyaWdodC1yb3cnKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCB0byk7XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2Zvb3Rlci1jb3B5LWJnLXBhdF0nLCBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdGlmICggdG8gPT0gJzAnICkge1xuXHRcdFx0XHQkKCcjY29sb3Bob24gLmNvcHlyaWdodC1yb3cnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAnbm9uZScpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCgnI2NvbG9waG9uIC5jb3B5cmlnaHQtcm93JykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybChcIicgKyB0byArICdcIiknKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbZm9vdGVyLWNvcHktdGV4dC1jb2xvcl0nLCBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdCQoJyNjb2xvcGhvbiAuY29weXJpZ2h0LXJvdycpLmNzcygnY29sb3InLCB0byk7XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2Zvb3Rlci1jb3B5LWJvcmRlci1jb2xvcl0nLCBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdCQoJyNjb2xvcGhvbiAuY29weXJpZ2h0LXJvdycpLmNzcygnYm9yZGVyLWNvbG9yJywgdG8pO1xuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtmb290ZXItbGVmdC1jb2RlXScsIGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHR2YXIgZGF0ZSA9IG5ldyBEYXRlKCksXG5cdFx0XHR5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHR0byA9IHRvLnJlcGxhY2UoL1xce1xce3llYXJcXH1cXH0vZywgeWVhcik7XG5cdFx0XHQkKCcjY29sb3Bob24gLmxlZnQtY29udGVudCAuY29udGVudC1jb2RlJykuaHRtbCh0byk7XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2Zvb3Rlci1yaWdodC1jb2RlXScsIGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHR2YXIgZGF0ZSA9IG5ldyBEYXRlKCksXG5cdFx0XHR5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHR0byA9IHRvLnJlcGxhY2UoL1xce1xce3llYXJcXH1cXH0vZywgeWVhcik7XG5cdFx0XHQkKCcjY29sb3Bob24gLnJpZ2h0LWNvbnRlbnQgLmNvbnRlbnQtY29kZScpLmh0bWwodG8pO1xuXHRcdH0pO1xuXHR9KTtcblxufSkoalF1ZXJ5KTsiLCJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXG5DVVNUT01JWkVSIElOVEVHUkFUSU9OIC0gR0xPQkFMXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbndpbmRvdy5NSVhUID0ge1xuXHRzdHlsZXNoZWV0OiBmdW5jdGlvbihpZCwgY3NzKSB7XG5cdFx0Y3NzID0gY3NzIHx8IGZhbHNlO1xuXHRcdHZhciBzaGVldCA9IGpRdWVyeSgnc3R5bGVbZGF0YS1pZD1cIicraWQrJ1wiXScpO1xuXHRcdGlmICggc2hlZXQubGVuZ3RoID09PSAwICkgc2hlZXQgPSBqUXVlcnkoJzxzdHlsZSBkYXRhLWlkPVwiJytpZCsnXCI+JykuYXBwZW5kVG8oalF1ZXJ5KCdoZWFkJykpO1xuXHRcdGlmICggY3NzICkge1xuXHRcdFx0c2hlZXQuaHRtbChjc3MpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gc2hlZXQ7XG5cdFx0fVxuXHR9XG59O1xuXG4oIGZ1bmN0aW9uKCQpIHtcblxuXHQvKiBnbG9iYWwgXywgd3AgKi9cblxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3NpdGUtYmctY29sb3JdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0JCgnYm9keScpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsIHRvKTtcblx0XHR9KTtcblx0fSk7XG5cblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtzaXRlLWJnLXBhdF0nLCBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdGlmICggdG8gPT0gJzAnICkge1xuXHRcdFx0XHQkKCdib2R5JykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ25vbmUnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJ2JvZHknKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKFwiJyArIHRvICsgJ1wiKScpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblxuXHQvLyBQYWdlIExvYWRlclxuXHRcblx0dmFyIHBhZ2VMb2FkZXIgPSB7XG5cdFx0bG9hZGVyOiAnJyxcblx0XHRsb2FkSW5uZXI6ICcnLFxuXHRcdGVuYWJsZWQ6IGZhbHNlLFxuXHRcdHR5cGU6IDEsXG5cdFx0c2hhcGU6ICdyaW5nJyxcblx0XHRjb2xvcjogJyMwMDAnLFxuXHRcdGltZzogJycsXG5cdFx0YW5pbTogJ2JvdW5jZScsXG5cdFx0c2V0dXA6IGZhbHNlLFxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAhIHRoaXMuc2V0dXAgKSB0aGlzLnNldE9wdGlvbnMoKTtcblx0XHRcdCQoJ2JvZHknKS5hZGRDbGFzcygnbG9hZGluZycpO1xuXHRcdFx0aWYgKCAkKCcjbG9hZC1vdmVybGF5JykubGVuZ3RoID09PSAwICkgJCgnYm9keScpLmFwcGVuZCgnPGRpdiBpZD1cImxvYWQtb3ZlcmxheVwiPjxkaXYgY2xhc3M9XCJsb2FkLWlubmVyXCI+PC9kaXY+PC9kaXY+Jyk7XG5cdFx0XHR0aGlzLmxvYWRlciA9ICQoJyNsb2FkLW92ZXJsYXknKTtcblx0XHRcdHRoaXMubG9hZGVyLmZpbmQoJy5sb2FkZXInKS5zaG93KCk7XG5cdFx0XHR0aGlzLmxvYWRJbm5lciA9IHRoaXMubG9hZGVyLmNoaWxkcmVuKCcubG9hZC1pbm5lcicpO1xuXHRcdFx0dGhpcy5sb2FkU2hhcGUoKTtcblx0XHRcdGlmICggJCgnI2xvYWRlci1jbG9zZScpLmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdFx0dGhpcy5sb2FkZXIuYXBwZW5kKCc8YnV0dG9uIGlkPVwibG9hZGVyLWNsb3NlXCIgY2xhc3M9XCJidG4gYnRuLXJlZCBidG4tbGdcIiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiAyMHB4OyByaWdodDogMjBweDtcIj4mdGltZXM7PC9idXR0b24+Jyk7XG5cdFx0XHR9XG5cdFx0XHQkKCcjbG9hZGVyLWNsb3NlJykuY2xpY2soIGZ1bmN0aW9uKCkgeyAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTsgfSk7XG5cdFx0fSxcblx0XHRzZXRPcHRpb25zOiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuZW5hYmxlZCA9IHdwLmN1c3RvbWl6ZS5fdmFsdWVbJ21peHRfb3B0W3BhZ2UtbG9hZGVyXSddLmdldCgpID09ICcxJztcblx0XHRcdHRoaXMudHlwZSA9IHdwLmN1c3RvbWl6ZS5fdmFsdWVbJ21peHRfb3B0W3BhZ2UtbG9hZGVyLXR5cGVdJ10uZ2V0KCk7XG5cdFx0XHR0aGlzLnNoYXBlID0gd3AuY3VzdG9taXplLl92YWx1ZVsnbWl4dF9vcHRbcGFnZS1sb2FkZXItc2hhcGVdJ10uZ2V0KCk7XG5cdFx0XHR0aGlzLmNvbG9yID0gd3AuY3VzdG9taXplLl92YWx1ZVsnbWl4dF9vcHRbcGFnZS1sb2FkZXItY29sb3JdJ10uZ2V0KCk7XG5cdFx0XHR0aGlzLmltZyA9IHdwLmN1c3RvbWl6ZS5fdmFsdWVbJ21peHRfb3B0W3BhZ2UtbG9hZGVyLWltZ10nXS5nZXQoKTtcblx0XHRcdHRoaXMuYW5pbSA9IHdwLmN1c3RvbWl6ZS5fdmFsdWVbJ21peHRfb3B0W3BhZ2UtbG9hZGVyLWFuaW1dJ10uZ2V0KCk7XG5cdFx0XHR0aGlzLnNldHVwID0gdHJ1ZTtcblx0XHR9LFxuXHRcdGxvYWRTaGFwZTogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgY2xhc3NlcyA9ICdsb2FkZXInLFxuXHRcdFx0XHRsb2FkZXIgID0gJyc7XG5cdFx0XHRpZiAoIHRoaXMuYW5pbSAhPSAnbm9uZScgKSBjbGFzc2VzICs9ICcgYW5pbWF0ZWQgaW5maW5pdGUgJyArIHRoaXMuYW5pbTtcblx0XHRcdGlmICggdGhpcy50eXBlID09IDEgKSB7XG5cdFx0XHRcdGxvYWRlciA9ICc8ZGl2IGNsYXNzPVwiJyArIGNsYXNzZXMgKyAnICcgKyB0aGlzLnNoYXBlICsgJ1wiPjwvZGl2Pic7XG5cdFx0XHR9IGVsc2UgaWYgKCAhIF8uaXNFbXB0eSh0aGlzLmltZy51cmwpICkge1xuXHRcdFx0XHRsb2FkZXIgPSAnPGltZyBzcmM9XCInICsgdGhpcy5pbWcudXJsICsgJ1wiIGFsdD1cIkxvYWRpbmcuLi5cIiBjbGFzcz1cIicgKyBjbGFzc2VzICsgJ1wiPic7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsb2FkZXIgPSAnPGRpdiBjbGFzcz1cInJpbmcgJyArIGNsYXNzZXMgKyAnXCI+PC9kaXY+Jztcblx0XHRcdH1cblx0XHRcdHRoaXMubG9hZElubmVyLmh0bWwobG9hZGVyKTtcblx0XHR9LFxuXHRcdGhhbmRsZTogZnVuY3Rpb24odmFsdWUsIHR5cGUpIHtcblx0XHRcdGlmICggdHlwZSAhPSAnc3dpdGNoJyB8fCB2YWx1ZSA9PSAnMScgKSB0aGlzLmluaXQoKTtcblx0XHRcdGlmICggdHlwZSA9PSAnc3dpdGNoJyApIHtcblx0XHRcdFx0aWYgKCB2YWx1ZSA9PSAnMCcgKSB7XG5cdFx0XHRcdFx0dGhpcy5lbmFibGVkID0gZmFsc2U7XG5cdFx0XHRcdFx0JCgnYm9keScpLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5lbmFibGVkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICggdGhpcy5lbmFibGVkICkge1xuXHRcdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0XHRjYXNlICd0eXBlJzpcblx0XHRcdFx0XHRcdHRoaXMudHlwZSA9IHZhbHVlO1xuXHRcdFx0XHRcdFx0dGhpcy5sb2FkU2hhcGUoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ3NoYXBlJzpcblx0XHRcdFx0XHRcdHRoaXMuc2hhcGUgPSB2YWx1ZTtcblx0XHRcdFx0XHRcdHRoaXMubG9hZFNoYXBlKCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlICdjb2xvcic6XG5cdFx0XHRcdFx0XHR0aGlzLmNvbG9yID0gdmFsdWU7XG5cdFx0XHRcdFx0XHR0aGlzLmxvYWRJbm5lci5jaGlsZHJlbignLnJpbmcsIC5zcXVhcmUyJykuY3NzKCdib3JkZXItY29sb3InLCB2YWx1ZSk7XG5cdFx0XHRcdFx0XHR0aGlzLmxvYWRJbm5lci5jaGlsZHJlbignLmNpcmNsZSwgLnNxdWFyZScpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsIHZhbHVlKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ2ltZyc6XG5cdFx0XHRcdFx0XHR0aGlzLmltZyA9IHZhbHVlO1xuXHRcdFx0XHRcdFx0dGhpcy5sb2FkU2hhcGUoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ2FuaW0nOlxuXHRcdFx0XHRcdFx0dGhpcy5hbmltID0gdmFsdWU7XG5cdFx0XHRcdFx0XHR0aGlzLmxvYWRTaGFwZSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAnYmcnOlxuXHRcdFx0XHRcdFx0dGhpcy5sb2FkZXIuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgdmFsdWUpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHR9O1xuXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbcGFnZS1sb2FkZXJdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykgeyBwYWdlTG9hZGVyLmhhbmRsZSh0bywgJ3N3aXRjaCcpOyB9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbcGFnZS1sb2FkZXItdHlwZV0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7IHBhZ2VMb2FkZXIuaGFuZGxlKHRvLCAndHlwZScpOyB9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbcGFnZS1sb2FkZXItc2hhcGVdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykgeyBwYWdlTG9hZGVyLmhhbmRsZSh0bywgJ3NoYXBlJyk7IH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtwYWdlLWxvYWRlci1jb2xvcl0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7IHBhZ2VMb2FkZXIuaGFuZGxlKHRvLCAnY29sb3InKTsgfSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3BhZ2UtbG9hZGVyLWltZ10nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7IHBhZ2VMb2FkZXIuaGFuZGxlKHRvLCAnaW1nJyk7IH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtwYWdlLWxvYWRlci1iZ10nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7IHBhZ2VMb2FkZXIuaGFuZGxlKHRvLCAnYmcnKTsgfSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3BhZ2UtbG9hZGVyLWFuaW1dJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykgeyBwYWdlTG9hZGVyLmhhbmRsZSh0bywgJ2FuaW0nKTsgfSk7XG5cdH0pO1xuXG59KShqUXVlcnkpOyIsIlxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cbkNVU1RPTUlaRVIgSU5URUdSQVRJT04gLSBIRUFERVJcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiggZnVuY3Rpb24oJCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvKiBnbG9iYWwgd3AsIE1JWFQsIHRpbnljb2xvciAqL1xuXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbaGVhZC1iZy1jb2xvcl0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHQkKCcuaGVhZC1tZWRpYSAubWVkaWEtY29udGFpbmVyJykuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgdG8pO1xuXHRcdFx0aWYgKCB0aW55Y29sb3IodG8pLmlzTGlnaHQoKSApIHtcblx0XHRcdFx0JCgnLmhlYWQtbWVkaWEnKS5yZW1vdmVDbGFzcygnYmctZGFyaycpLmFkZENsYXNzKCdiZy1saWdodCcpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCgnLmhlYWQtbWVkaWEnKS5yZW1vdmVDbGFzcygnYmctbGlnaHQnKS5hZGRDbGFzcygnYmctZGFyaycpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblxuXHRmdW5jdGlvbiB1cGRhdGVIZWFkZXJUZXh0KCkge1xuXHRcdHZhciBjc3MgPSAnJyxcblx0XHRcdGhtID0gJy5oZWFkLW1lZGlhJyxcblx0XHRcdGNvbG9yID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtoZWFkLXRleHQtY29sb3JdJykuZ2V0KCksXG5cdFx0XHRjb2xvcl9pbnYgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W2hlYWQtaW52LXRleHQtY29sb3JdJykuZ2V0KCk7XG5cdFx0aWYgKCBjb2xvciAhPSAnJyApIHtcblx0XHRcdHZhciBobV9saWdodCA9IGhtKycuYmctbGlnaHQnO1xuXHRcdFx0Y3NzICs9IGhtX2xpZ2h0KycgLmNvbnRhaW5lciwgJytobV9saWdodCsnIC5tZWRpYS1pbm5lciA+IGEsICcraG1fbGlnaHQrJyAuaGVhZGVyLXNjcm9sbCwgJytobV9saWdodCsnICNicmVhZGNydW1icyA+IGxpICsgbGk6YmVmb3JlIHsgY29sb3I6ICcrY29sb3IrJyAhaW1wb3J0YW50OyB9Jztcblx0XHR9XG5cdFx0aWYgKCBjb2xvcl9pbnYgIT0gJycgKSB7XG5cdFx0XHR2YXIgaG1fZGFyayA9IGhtKycuYmctZGFyayc7XG5cdFx0XHRjc3MgKz0gaG1fZGFyaysnIC5jb250YWluZXIsICcraG1fZGFyaysnIC5tZWRpYS1pbm5lciA+IGEsICcraG1fZGFyaysnIC5oZWFkZXItc2Nyb2xsLCAnK2htX2RhcmsrJyAjYnJlYWRjcnVtYnMgPiBsaSArIGxpOmJlZm9yZSB7IGNvbG9yOiAnK2NvbG9yX2ludisnICFpbXBvcnRhbnQ7IH0nO1xuXHRcdH1cblx0XHRNSVhULnN0eWxlc2hlZXQoJ21peHQtaGVhZGVyJywgY3NzKTtcblx0fVxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2hlYWQtdGV4dC1jb2xvcl0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0dXBkYXRlSGVhZGVyVGV4dCgpO1xuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtoZWFkLWludi10ZXh0LWNvbG9yXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7XG5cdFx0XHR1cGRhdGVIZWFkZXJUZXh0KCk7XG5cdFx0fSk7XG5cdH0pO1xuXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9jLWJhci1iZy1jb2xvcl0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHQkKCcjbG9jYXRpb24tYmFyJykuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgdG8pO1xuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2MtYmFyLWJnLXBhdF0nLCBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdGlmICggdG8gPT0gJzAnICkge1xuXHRcdFx0XHQkKCcjbG9jYXRpb24tYmFyJykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ25vbmUnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNsb2NhdGlvbi1iYXInKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKFwiJyArIHRvICsgJ1wiKScpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2MtYmFyLXRleHQtY29sb3JdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0dmFyIGNzcyA9ICcjbG9jYXRpb24tYmFyLCAjbG9jYXRpb24tYmFyIGE6aG92ZXIsICNsb2NhdGlvbi1iYXIgbGk6YmVmb3JlIHsgY29sb3I6ICcrdG8rJzsgfSc7XG5cdFx0XHRNSVhULnN0eWxlc2hlZXQoJ21peHQtbG9jLWJhcicsIGNzcyk7XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvYy1iYXItYm9yZGVyLWNvbG9yXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdCQoJyNsb2NhdGlvbi1iYXInKS5jc3MoJ2JvcmRlci1jb2xvcicsIHRvKTtcblx0XHR9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbYnJlYWRjcnVtYnMtcHJlZml4XScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdHZhciBiY19wcmVmaXggPSAkKCcjYnJlYWRjcnVtYnMgLmJjLXByZWZpeCcpO1xuXHRcdFx0aWYgKCBiY19wcmVmaXgubGVuZ3RoID09PSAwICkgYmNfcHJlZml4ID0gJCgnPGxpIGNsYXNzPVwiYmMtcHJlZml4XCI+PC9saT4nKS5wcmVwZW5kVG8oJCgnI2JyZWFkY3J1bWJzJykpO1xuXHRcdFx0YmNfcHJlZml4Lmh0bWwodG8pO1xuXHRcdH0pO1xuXHR9KTtcblxufSkoalF1ZXJ5KTsiLCJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXG5DVVNUT01JWkVSIElOVEVHUkFUSU9OIC0gTE9HT1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuKCBmdW5jdGlvbigkKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qIGdsb2JhbCBfLCB3cCwgTUlYVCwgbWl4dF9jdXN0b21pemUgKi9cblxuXHRmdW5jdGlvbiB1cGRhdGVMb2dvKCkge1xuXHRcdHZhciBodG1sID0gJycsXG5cdFx0XHRjc3MgPSAnJyxcblx0XHRcdHR5cGUgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tdHlwZV0nKS5nZXQoKSxcblx0XHRcdGltZyA9IHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby1pbWddJykuZ2V0KCksXG5cdFx0XHR0ZXh0ID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXRleHRdJykuZ2V0KCkgfHwgd3AuY3VzdG9taXplKCdibG9nbmFtZScpLmdldCgpLFxuXHRcdFx0c2hyaW5rID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXNocmlua10nKS5nZXQoKSxcblx0XHRcdHNob3dfdGFnID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXNob3ctdGFnbGluZV0nKS5nZXQoKTtcblxuXHRcdC8vIEltYWdlIExvZ29cblx0XHRpZiAoIHR5cGUgPT0gJ2ltZycgJiYgISBfLmlzRW1wdHkoaW1nLnVybCkgKSB7XG5cdFx0XHR2YXIgd2lkdGggPSBpbWcud2lkdGgsXG5cdFx0XHRcdGltZ19pbnYgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28taW1nLWludl0nKS5nZXQoKSxcblx0XHRcdFx0aGlyZXMgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28taW1nLWhyXScpLmdldCgpID09ICcxJyxcblx0XHRcdFx0c2hyaW5rX3dpZHRoO1xuXG5cdFx0XHRpZiAoICEgXy5pc0VtcHR5KGltZ19pbnYudXJsKSApIHtcblx0XHRcdFx0aHRtbCArPSAnPGltZyBjbGFzcz1cImxvZ28taW1nIGxvZ28tbGlnaHRcIiBzcmM9XCInK2ltZy51cmwrJ1wiIGFsdD1cIicrdGV4dCsnXCI+Jztcblx0XHRcdFx0aHRtbCArPSAnPGltZyBjbGFzcz1cImxvZ28taW1nIGxvZ28tZGFya1wiIHNyYz1cIicraW1nX2ludi51cmwrJ1wiIGFsdD1cIicrdGV4dCsnXCI+Jztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGh0bWwgKz0gJzxpbWcgY2xhc3M9XCJsb2dvLWltZ1wiIHNyYz1cIicraW1nLnVybCsnXCIgYWx0PVwiJyt0ZXh0KydcIj4nO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGhpcmVzICkge1xuXHRcdFx0XHR3aWR0aCA9IHdpZHRoIC8gMjtcblx0XHRcdH1cblxuXHRcdFx0Y3NzICs9ICcubmF2YmFyLW1peHQgI25hdi1sb2dvIGltZyB7IG1heC13aWR0aDogJyt3aWR0aCsncHg7IH0nO1xuXG5cdFx0XHQvLyBMb2dvIFNocmlua1xuXHRcdFx0c2hyaW5rX3dpZHRoID0gKCBzaHJpbmsgIT0gJzAnICkgPyB3aWR0aCAtIHNocmluayA6IHdpZHRoO1xuXHRcdFx0Y3NzICs9ICcuZml4ZWQtbmF2IC5uYXZiYXItbWl4dCAjbmF2LWxvZ28gaW1nIHsgbWF4LXdpZHRoOiAnK3Nocmlua193aWR0aCsncHg7IH0nO1xuXG5cdFx0Ly8gVGV4dCBMb2dvXG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBjb2xvciA9IHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby10ZXh0LWNvbG9yXScpLmdldCgpLFxuXHRcdFx0XHRjb2xvcl9pbnYgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tdGV4dC1pbnZdJykuZ2V0KCksXG5cdFx0XHRcdHRleHRfdHlwbyA9IG1peHRfY3VzdG9taXplLmxvZ29bJ3RleHQtdHlwbyddLFxuXHRcdFx0XHRzaHJpbmtfc2l6ZTtcblxuXHRcdFx0aWYgKCBjb2xvcl9pbnYgIT0gJycgKSB7XG5cdFx0XHRcdGh0bWwgKz0gJzxzdHJvbmcgY2xhc3M9XCJsb2dvLWxpZ2h0XCI+Jyt0ZXh0Kyc8L3N0cm9uZz4nO1xuXHRcdFx0XHRodG1sICs9ICc8c3Ryb25nIGNsYXNzPVwibG9nby1kYXJrXCI+Jyt0ZXh0Kyc8L3N0cm9uZz4nO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aHRtbCArPSAnPHN0cm9uZz4nK3RleHQrJzwvc3Ryb25nPic7XG5cdFx0XHR9XG5cblx0XHRcdGNzcyArPSAnI25hdi1sb2dvIHN0cm9uZyB7Jztcblx0XHRcdFx0Y3NzICs9ICdjb2xvcjogJytjb2xvcisnOyc7XG5cdFx0XHRcdGNzcyArPSAnZm9udC1zaXplOiAnK3RleHRfdHlwb1snZm9udC1zaXplJ10rJzsnO1xuXHRcdFx0XHRjc3MgKz0gJ2ZvbnQtZmFtaWx5OiAnK3RleHRfdHlwb1snZm9udC1mYW1pbHknXSsnOyc7XG5cdFx0XHRcdGNzcyArPSAnZm9udC13ZWlnaHQ6ICcrdGV4dF90eXBvWydmb250LXdlaWdodCddKyc7Jztcblx0XHRcdFx0Y3NzICs9ICd0ZXh0LXRyYW5zZm9ybTogJyt0ZXh0X3R5cG9bJ3RleHQtdHJhbnNmb3JtJ10rJzsnO1xuXHRcdFx0Y3NzICs9ICd9Jztcblx0XHRcdGNzcyArPSAnI25hdi1sb2dvIC5sb2dvLWRhcmsgeyBjb2xvcjogJytjb2xvcl9pbnYrJzsgfSc7XG5cblx0XHRcdC8vIExvZ28gU2hyaW5rXG5cdFx0XHRpZiAoIHNocmluayAhPSAnMCcgKSB7XG5cdFx0XHRcdHNocmlua19zaXplID0gKCBwYXJzZUludCh0ZXh0X3R5cG9bJ2ZvbnQtc2l6ZSddLCAxMCkgLSBzaHJpbmsgKSArICdweCc7XG5cblx0XHRcdFx0Y3NzICs9ICcuZml4ZWQtbmF2ICNuYXYtbG9nbyBzdHJvbmcgeyBmb250LXNpemU6ICcrc2hyaW5rX3NpemUrJzsgfSc7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gVGFnbGluZVxuXHRcdGlmICggc2hvd190YWcgPT0gJzEnICkge1xuXHRcdFx0dmFyIHRhZ2xpbmUgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tdGFnbGluZV0nKS5nZXQoKSB8fCB3cC5jdXN0b21pemUoJ2Jsb2dkZXNjcmlwdGlvbicpLmdldCgpLFxuXHRcdFx0XHR0YWdfY29sb3IgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tdGFnbGluZS1jb2xvcl0nKS5nZXQoKSxcblx0XHRcdFx0dGFnX2NvbG9yX2ludiA9IHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby10YWdsaW5lLWludl0nKS5nZXQoKSxcblx0XHRcdFx0dGFnX3R5cG8gPSBtaXh0X2N1c3RvbWl6ZS5sb2dvWyd0YWdsaW5lLXR5cG8nXTtcblxuXHRcdFx0aWYgKCB0YWdsaW5lICE9ICcnICkge1xuXHRcdFx0XHRodG1sICs9ICc8c21hbGw+JyArIHRhZ2xpbmUgKyAnPC9zbWFsbD4nO1xuXHRcdFx0fVxuXG5cdFx0XHRjc3MgKz0gJyNuYXYtbG9nbyBzbWFsbCB7Jztcblx0XHRcdFx0Y3NzICs9ICdjb2xvcjogJyt0YWdfY29sb3IrJzsnO1xuXHRcdFx0XHRjc3MgKz0gJ2ZvbnQtc2l6ZTogJyt0YWdfdHlwb1snZm9udC1zaXplJ10rJzsnO1xuXHRcdFx0XHRjc3MgKz0gJ2ZvbnQtZmFtaWx5OiAnK3RhZ190eXBvWydmb250LWZhbWlseSddKyc7Jztcblx0XHRcdFx0Y3NzICs9ICdmb250LXdlaWdodDogJyt0YWdfdHlwb1snZm9udC13ZWlnaHQnXSsnOyc7XG5cdFx0XHRcdGNzcyArPSAndGV4dC10cmFuc2Zvcm06ICcrdGFnX3R5cG9bJ3RleHQtdHJhbnNmb3JtJ10rJzsnO1xuXHRcdFx0Y3NzICs9ICd9Jztcblx0XHRcdGNzcyArPSAnLmJnLWRhcmsgI25hdi1sb2dvIHNtYWxsIHsgY29sb3I6ICcrdGFnX2NvbG9yX2ludisnOyB9Jztcblx0XHR9XG5cblx0XHQkKCcjbmF2LWxvZ28nKS5odG1sKGh0bWwpO1xuXG5cdFx0TUlYVC5zdHlsZXNoZWV0KCdtaXh0LWxvZ28nLCBjc3MpO1xuXHR9XG5cblx0d3AuY3VzdG9taXplKCdibG9nbmFtZScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7IHVwZGF0ZUxvZ28oKTsgfSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ2Jsb2dkZXNjcmlwdGlvbicsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7IHVwZGF0ZUxvZ28oKTsgfSk7XG5cdH0pO1xuXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby10eXBlXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7IHVwZGF0ZUxvZ28oKTsgfSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28taW1nXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7IHVwZGF0ZUxvZ28oKTsgfSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28taW1nLWludl0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkgeyB1cGRhdGVMb2dvKCk7IH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLWltZy1ocl0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkgeyB1cGRhdGVMb2dvKCk7IH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXRleHRdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbigpIHsgdXBkYXRlTG9nbygpOyB9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby10ZXh0LWNvbG9yXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7IHVwZGF0ZUxvZ28oKTsgfSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tdGV4dC1pbnZdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbigpIHsgdXBkYXRlTG9nbygpOyB9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby1zaHJpbmtdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbigpIHsgdXBkYXRlTG9nbygpOyB9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby1zaG93LXRhZ2xpbmVdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbigpIHtcblx0XHRcdHVwZGF0ZUxvZ28oKTtcblx0XHRcdCQod2luZG93KS50cmlnZ2VyKCdyZXNpemUnKTtcblx0XHR9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby10YWdsaW5lXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7IHVwZGF0ZUxvZ28oKTsgfSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tdGFnbGluZS1jb2xvcl0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkgeyB1cGRhdGVMb2dvKCk7IH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXRhZ2xpbmUtaW52XScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7IHVwZGF0ZUxvZ28oKTsgfSk7XG5cdH0pO1xuXG59KShqUXVlcnkpOyIsIlxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cbkNVU1RPTUlaRVIgSU5URUdSQVRJT04gLSBOQVZCQVJTXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4oIGZ1bmN0aW9uKCQpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0LyogZ2xvYmFsIHdwLCBNSVhULCBtaXh0X29wdCwgbWl4dF9jdXN0b21pemUgKi9cblxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi12ZXJ0aWNhbC1wb3NpdGlvbl0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHRpZiAoIHRvID09ICdsZWZ0JyApIHtcblx0XHRcdFx0JCgnI21haW4td3JhcCcpLnJlbW92ZUNsYXNzKCduYXYtcmlnaHQnKS5hZGRDbGFzcygnbmF2LWxlZnQnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNtYWluLXdyYXAnKS5yZW1vdmVDbGFzcygnbmF2LWxlZnQnKS5hZGRDbGFzcygnbmF2LXJpZ2h0Jyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tYWxpZ25dJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0aWYgKCB0byA9PSAnMScgKSB7XG5cdFx0XHRcdCQoJyNtYWluLW5hdi13cmFwJykucmVtb3ZlQ2xhc3MoJ2xvZ28tY2VudGVyIGxvZ28tcmlnaHQnKS5hZGRDbGFzcygnbG9nby1sZWZ0JykuYXR0cignZGF0YS1sb2dvLWFsaWduJywgJ2xlZnQnKTtcblx0XHRcdH0gZWxzZSBpZiAoIHRvID09ICcyJyApIHtcblx0XHRcdFx0JCgnI21haW4tbmF2LXdyYXAnKS5yZW1vdmVDbGFzcygnbG9nby1sZWZ0IGxvZ28tcmlnaHQnKS5hZGRDbGFzcygnbG9nby1jZW50ZXInKS5hdHRyKCdkYXRhLWxvZ28tYWxpZ24nLCAnY2VudGVyJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCcjbWFpbi1uYXYtd3JhcCcpLnJlbW92ZUNsYXNzKCdsb2dvLWNlbnRlciBsb2dvLWxlZnQnKS5hZGRDbGFzcygnbG9nby1yaWdodCcpLmF0dHIoJ2RhdGEtbG9nby1hbGlnbicsICdyaWdodCcpO1xuXHRcdFx0fVxuXHRcdFx0bmF2YmFyUGFkZGluZygpO1xuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtdGV4dHVyZV0nLCBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdGlmICggdG8gPT0gJzAnICkge1xuXHRcdFx0XHQkKCcjbWFpbi1uYXYnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAnbm9uZScpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCgnI21haW4tbmF2JykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybChcIicgKyB0byArICdcIiknKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2VjLW5hdi10ZXh0dXJlXScsIGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0aWYgKCB0byA9PSAnMCcgKSB7XG5cdFx0XHRcdCQoJyNzZWNvbmQtbmF2JykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ25vbmUnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNzZWNvbmQtbmF2JykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybChcIicgKyB0byArICdcIiknKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cblx0ZnVuY3Rpb24gbmF2YmFyUGFkZGluZygpIHtcblx0XHR2YXIgY3NzLFxuXHRcdFx0c2hlZXQgPSBNSVhULnN0eWxlc2hlZXQoJ21peHQtbmF2LXBhZGRpbmcnKTtcblxuXHRcdHNoZWV0Lmh0bWwoJycpO1xuXG5cdFx0dmFyIG5hdl9oZWlnaHQgPSBwYXJzZUludCgkKCcjbWFpbi1uYXYnKS5oZWlnaHQoKSwgMTApLFxuXHRcdFx0cGFkZGluZyA9IHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbmF2LXBhZGRpbmddJykuZ2V0KCksXG5cdFx0XHRmaXhlZF9wYWRkaW5nID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtZml4ZWQtcGFkZGluZ10nKS5nZXQoKSxcblx0XHRcdG5hdl93cmFwX2hlaWdodCA9IG5hdl9oZWlnaHQgKyBwYWRkaW5nICogMixcblx0XHRcdGZpeGVkX3dyYXBfaGVpZ2h0ID0gbmF2X2hlaWdodCArIGZpeGVkX3BhZGRpbmcgKiAyLFxuXHRcdFx0Zml4ZWRfaXRlbV9oZWlnaHQgPSBmaXhlZF93cmFwX2hlaWdodCxcblx0XHRcdG1lZGlhX2JwID0gbWl4dF9jdXN0b21pemUuYnJlYWtwb2ludHMubWFycyArIDEsXG5cdFx0XHRsb2dvX2NlbnRlciA9ICQoJyNtYWluLW5hdi13cmFwJykuYXR0cignZGF0YS1sb2dvLWFsaWduJykgPT0gJ2NlbnRlcic7XG5cblx0XHRjc3MgPSAnQG1lZGlhICggbWluLXdpZHRoOiAnK21lZGlhX2JwKydweCApIHsnO1xuXHRcdFx0Y3NzICs9ICcubmF2YmFyLW1peHQgeyBwYWRkaW5nLXRvcDogJytwYWRkaW5nKydweDsgcGFkZGluZy1ib3R0b206ICcrcGFkZGluZysncHg7IH0nO1xuXHRcdFx0Y3NzICs9ICcuZml4ZWQtbmF2IC5uYXZiYXItbWl4dCB7IHBhZGRpbmctdG9wOiAnK2ZpeGVkX3BhZGRpbmcrJ3B4OyBwYWRkaW5nLWJvdHRvbTogJytmaXhlZF9wYWRkaW5nKydweDsgfSc7XG5cdFx0XHRpZiAoIGxvZ29fY2VudGVyICkge1xuXHRcdFx0XHR2YXIgaGFsZl9wYWRkaW5nID0gZml4ZWRfcGFkZGluZyAvIDI7XG5cdFx0XHRcdGZpeGVkX2l0ZW1faGVpZ2h0ID0gZml4ZWRfaXRlbV9oZWlnaHQgLSBuYXZfaGVpZ2h0IC8gMiAtIGhhbGZfcGFkZGluZztcblx0XHRcdFx0Y3NzICs9ICcjbWFpbi1uYXYtd3JhcC5sb2dvLWNlbnRlciB7IG1pbi1oZWlnaHQ6ICcrbmF2X3dyYXBfaGVpZ2h0KydweDsgfSc7XG5cdFx0XHRcdGNzcyArPSAnLmZpeGVkLW5hdiAjbWFpbi1uYXYtd3JhcC5sb2dvLWNlbnRlciB7IG1pbi1oZWlnaHQ6ICcrZml4ZWRfd3JhcF9oZWlnaHQrJ3B4OyB9Jztcblx0XHRcdFx0Y3NzICs9ICcuZml4ZWQtbmF2IC5uYXZiYXItbWl4dCAubmF2YmFyLWhlYWRlciB7IG1hcmdpbi10b3A6IC0nK2hhbGZfcGFkZGluZysncHg7IH0nO1xuXHRcdFx0XHRjc3MgKz0gJy5maXhlZC1uYXYgLm5hdmJhci1taXh0IC5uYXYgPiBsaSB7IG1hcmdpbi10b3A6ICcraGFsZl9wYWRkaW5nKydweDsgbWFyZ2luLWJvdHRvbTogLScrZml4ZWRfcGFkZGluZysncHg7IH0nO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y3NzICs9ICcjbWFpbi1uYXYtd3JhcCB7IG1pbi1oZWlnaHQ6ICcrbmF2X3dyYXBfaGVpZ2h0KydweDsgfSc7XG5cdFx0XHRcdGNzcyArPSAnLmZpeGVkLW5hdiAjbWFpbi1uYXYtd3JhcCB7IG1pbi1oZWlnaHQ6ICcrZml4ZWRfd3JhcF9oZWlnaHQrJ3B4OyB9Jztcblx0XHRcdFx0Y3NzICs9ICcuZml4ZWQtbmF2IC5uYXZiYXItbWl4dCAubmF2ID4gbGkgeyBtYXJnaW4tdG9wOiAtJytmaXhlZF9wYWRkaW5nKydweDsgbWFyZ2luLWJvdHRvbTogLScrZml4ZWRfcGFkZGluZysncHg7IH0nO1xuXHRcdFx0fVxuXHRcdFx0Y3NzICs9ICcuZml4ZWQtbmF2IC5uYXZiYXItbWl4dCAubmF2ID4gbGksIC5maXhlZC1uYXYgLm5hdmJhci1taXh0IC5uYXYgPiBsaSA+IGEgeyBoZWlnaHQ6ICcrZml4ZWRfaXRlbV9oZWlnaHQrJ3B4OyBsaW5lLWhlaWdodDogJytmaXhlZF9pdGVtX2hlaWdodCsncHg7IH0nO1xuXHRcdGNzcyArPSAnfSc7XG5cblx0XHRzaGVldC5odG1sKGNzcyk7XG5cdH1cblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtcGFkZGluZ10nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkgeyBuYXZiYXJQYWRkaW5nKCk7IH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtZml4ZWQtcGFkZGluZ10nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkgeyBuYXZiYXJQYWRkaW5nKCk7IH0pO1xuXHR9KTtcblxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi1vcGFjaXR5XScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdG1peHRfb3B0Lm5hdi5vcGFjaXR5ID0gdG87XG5cdFx0XHQkKCcjbWFpbi1uYXYnKS50cmlnZ2VyKCdyZWZyZXNoJyk7XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi10b3Atb3BhY2l0eV0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHRtaXh0X29wdC5uYXZbJ3RvcC1vcGFjaXR5J10gPSB0bztcblx0XHRcdCQoJyNtYWluLW5hdicpLnRyaWdnZXIoJ3JlZnJlc2gnKTtcblx0XHR9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbmF2LXRyYW5zcGFyZW50XScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdGlmICggdG8gPT0gJzEnICYmIHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbaGVhZC1tZWRpYV0nKS5nZXQoKSA9PSAnMScgKSB7XG5cdFx0XHRcdCQoJyNtYWluLXdyYXAnKS5hZGRDbGFzcygnbmF2LXRyYW5zcGFyZW50Jyk7XG5cdFx0XHRcdG1peHRfb3B0Lm5hdi50cmFuc3BhcmVudCA9IHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCcjbWFpbi13cmFwJykucmVtb3ZlQ2xhc3MoJ25hdi10cmFuc3BhcmVudCcpO1xuXHRcdFx0XHRtaXh0X29wdC5uYXYudHJhbnNwYXJlbnQgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdCQoJyNtYWluLW5hdicpLnRyaWdnZXIoJ3JlZnJlc2gnKTtcblx0XHR9KTtcblx0fSk7XG5cblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtaG92ZXItYmddJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0aWYgKCB0byA9PSAnMCcgKSB7XG5cdFx0XHRcdCQoJyNtYWluLW5hdicpLmFkZENsYXNzKCduby1ob3Zlci1iZycpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCgnI21haW4tbmF2JykucmVtb3ZlQ2xhc3MoJ25vLWhvdmVyLWJnJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3NlYy1uYXYtaG92ZXItYmddJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0aWYgKCB0byA9PSAnMCcgKSB7XG5cdFx0XHRcdCQoJyNzZWNvbmQtbmF2JykuYWRkQ2xhc3MoJ25vLWhvdmVyLWJnJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCcjc2Vjb25kLW5hdicpLnJlbW92ZUNsYXNzKCduby1ob3Zlci1iZycpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblxuXHRmdW5jdGlvbiBuYXZiYXJBY3RpdmVCYXIobmF2YmFyLCBlbmFibGVkLCBwb3NpdGlvbikge1xuXHRcdG5hdmJhci5yZW1vdmVDbGFzcygnYWN0aXZlLXRvcCBhY3RpdmUtYm90dG9tIGFjdGl2ZS1sZWZ0IGFjdGl2ZS1yaWdodCcpO1xuXHRcdGlmICggZW5hYmxlZCApIHtcblx0XHRcdG5hdmJhci5yZW1vdmVDbGFzcygnbm8tYWN0aXZlJykuYWRkQ2xhc3MoJ2FjdGl2ZS0nK3Bvc2l0aW9uKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bmF2YmFyLmFkZENsYXNzKCduby1hY3RpdmUnKTtcblx0XHR9XG5cdH1cblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtYWN0aXZlLWJhcl0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHR2YXIgZW5hYmxlZCA9IHRvID09ICcxJyxcblx0XHRcdFx0cG9zaXRpb24gPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi1hY3RpdmUtYmFyLXBvc10nKS5nZXQoKTtcblx0XHRcdG5hdmJhckFjdGl2ZUJhcigkKCcjbWFpbi1uYXYgLm5hdicpLCBlbmFibGVkLCBwb3NpdGlvbik7XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi1hY3RpdmUtYmFyLXBvc10nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHR2YXIgZW5hYmxlZCA9IHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbmF2LWFjdGl2ZS1iYXJdJykuZ2V0KCkgPT0gJzEnO1xuXHRcdFx0bmF2YmFyQWN0aXZlQmFyKCQoJyNtYWluLW5hdiAubmF2JyksIGVuYWJsZWQsIHRvKTtcblx0XHR9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2VjLW5hdi1hY3RpdmUtYmFyXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdHZhciBlbmFibGVkID0gdG8gPT0gJzEnLFxuXHRcdFx0XHRwb3NpdGlvbiA9IHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2VjLW5hdi1hY3RpdmUtYmFyLXBvc10nKS5nZXQoKTtcblx0XHRcdG5hdmJhckFjdGl2ZUJhcigkKCcjc2Vjb25kLW5hdiAubmF2JyksIGVuYWJsZWQsIHBvc2l0aW9uKTtcblx0XHR9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2VjLW5hdi1hY3RpdmUtYmFyLXBvc10nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHR2YXIgZW5hYmxlZCA9IHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2VjLW5hdi1hY3RpdmUtYmFyXScpLmdldCgpID09ICcxJztcblx0XHRcdG5hdmJhckFjdGl2ZUJhcigkKCcjc2Vjb25kLW5hdiAubmF2JyksIGVuYWJsZWQsIHRvKTtcblx0XHR9KTtcblx0fSk7XG5cblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtYm9yZGVyZWRdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0aWYgKCB0byA9PSAnMScgKSB7XG5cdFx0XHRcdCQoJyNtYWluLW5hdicpLmFkZENsYXNzKCdib3JkZXJlZCcpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCgnI21haW4tbmF2JykucmVtb3ZlQ2xhc3MoJ2JvcmRlcmVkJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3NlYy1uYXYtYm9yZGVyZWRdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0aWYgKCB0byA9PSAnMScgKSB7XG5cdFx0XHRcdCQoJyNzZWNvbmQtbmF2JykuYWRkQ2xhc3MoJ2JvcmRlcmVkJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCcjc2Vjb25kLW5hdicpLnJlbW92ZUNsYXNzKCdib3JkZXJlZCcpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3NlYy1uYXYtbGVmdC1jb2RlXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdCQoJyNzZWNvbmQtbmF2IC5sZWZ0IC5jb2RlLWlubmVyJykuaHRtbCh0byk7XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3NlYy1uYXYtbGVmdC1oaWRlXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdHZhciBuYXYgPSAkKCcjc2Vjb25kLW5hdicpO1xuXHRcdFx0aWYgKCB0byA9PSAnMScgKSB7XG5cdFx0XHRcdG5hdi5maW5kKCcubGVmdCcpLmFkZENsYXNzKCdoaWRkZW4teHMnKTtcblx0XHRcdFx0aWYgKCB3cC5jdXN0b21pemUoJ21peHRfb3B0W3NlYy1uYXYtcmlnaHQtaGlkZV0nKS5nZXQoKSA9PSAnMScgKSBuYXYuYWRkQ2xhc3MoJ2hpZGRlbi14cycpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bmF2LnJlbW92ZUNsYXNzKCdoaWRkZW4teHMnKTtcblx0XHRcdFx0bmF2LmZpbmQoJy5sZWZ0JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbi14cycpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtzZWMtbmF2LXJpZ2h0LWNvZGVdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0JCgnI3NlY29uZC1uYXYgLnJpZ2h0IC5jb2RlLWlubmVyJykuaHRtbCh0byk7XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3NlYy1uYXYtcmlnaHQtaGlkZV0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHR2YXIgbmF2ID0gJCgnI3NlY29uZC1uYXYnKTtcblx0XHRcdGlmICggdG8gPT0gJzEnICkge1xuXHRcdFx0XHRuYXYuZmluZCgnLnJpZ2h0JykuYWRkQ2xhc3MoJ2hpZGRlbi14cycpO1xuXHRcdFx0XHRpZiAoIHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2VjLW5hdi1sZWZ0LWhpZGVdJykuZ2V0KCkgPT0gJzEnICkgbmF2LmFkZENsYXNzKCdoaWRkZW4teHMnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5hdi5yZW1vdmVDbGFzcygnaGlkZGVuLXhzJyk7XG5cdFx0XHRcdG5hdi5maW5kKCcucmlnaHQnKS5yZW1vdmVDbGFzcygnaGlkZGVuLXhzJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXG59KShqUXVlcnkpOyIsIlxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cbkNVU1RPTUlaRVIgSU5URUdSQVRJT04gLSBUSEVNRVNcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyogZ2xvYmFsIHdwLCBNSVhUICovXG5cbk1JWFQudGhlbWVzID0ge1xuXHRyZWdleDogL3RoZW1lLShbXlxcc10qKS8sXG5cdHNpdGU6IG51bGwsXG5cdG5hdjogbnVsbCxcblx0c2VjTmF2OiBudWxsLFxuXHRmb290ZXI6IG51bGwsXG5cdHNldHVwOiBmYWxzZSxcblx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCAhIHRoaXMuc2V0dXAgKSB7XG5cdFx0XHR0aGlzLnNpdGUgPSBqUXVlcnkoJyNtYWluLXdyYXAtaW5uZXInKVswXS5jbGFzc05hbWUubWF0Y2godGhpcy5yZWdleClbMV07XG5cdFx0XHR0aGlzLm5hdiA9IGpRdWVyeSgnI21haW4tbmF2JylbMF0uY2xhc3NOYW1lLm1hdGNoKHRoaXMucmVnZXgpWzFdO1xuXHRcdFx0aWYgKCBqUXVlcnkoJyNzZWNvbmQtbmF2JykubGVuZ3RoICkgdGhpcy5zZWNOYXYgPSBqUXVlcnkoJyNzZWNvbmQtbmF2JylbMF0uY2xhc3NOYW1lLm1hdGNoKHRoaXMucmVnZXgpWzFdO1xuXHRcdFx0dGhpcy5mb290ZXIgPSBqUXVlcnkoJyNjb2xvcGhvbicpWzBdLmNsYXNzTmFtZS5tYXRjaCh0aGlzLnJlZ2V4KVsxXTtcblx0XHRcdFxuXHRcdFx0dGhpcy5zZXR1cCA9IHRydWU7XG5cdFx0fVxuXHR9LFxuXHRzZXRUaGVtZTogZnVuY3Rpb24oZWxlbSwgdGhlbWUpIHtcblx0XHRpZiAoIGVsZW0ubGVuZ3RoID09PSAwICkgcmV0dXJuO1xuXHRcdGlmICggdGhlbWUgPT0gJ2F1dG8nICkge1xuXHRcdFx0dGhlbWUgPSB0aGlzLnNpdGU7XG5cdFx0XHRlbGVtLmF0dHIoJ2RhdGEtdGhlbWUnLCAnYXV0bycpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRlbGVtLnJlbW92ZUF0dHIoJ2RhdGEtdGhlbWUnKTtcblx0XHR9XG5cdFx0ZWxlbVswXS5jbGFzc05hbWUgPSBlbGVtWzBdLmNsYXNzTmFtZS5yZXBsYWNlKHRoaXMucmVnZXgsICd0aGVtZS0nICsgdGhlbWUpO1xuXHRcdGVsZW0udHJpZ2dlcigncmVmcmVzaCcpLnRyaWdnZXIoJ3RoZW1lLWNoYW5nZScsIHRoZW1lKTtcblx0fVxufTtcblxuKCBmdW5jdGlvbigkKSB7XG5cdFxuXHR2YXIgdGhlbWVzID0gTUlYVC50aGVtZXM7XG5cblx0dGhlbWVzLmluaXQoKTtcblx0XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2l0ZS10aGVtZV0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHR0aGVtZXMuc2l0ZSA9IHRvO1xuXHRcdFx0dmFyIGVsZW1zID0gJCgnYm9keSwgI21haW4td3JhcC1pbm5lciwgW2RhdGEtdGhlbWU9XCJhdXRvXCJdJyk7XG5cdFx0XHRlbGVtcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCh0aGlzKVswXS5jbGFzc05hbWUgPSAkKHRoaXMpWzBdLmNsYXNzTmFtZS5yZXBsYWNlKHRoZW1lcy5yZWdleCwgJ3RoZW1lLScgKyB0byk7XG5cdFx0XHRcdCQodGhpcykudHJpZ2dlcigncmVmcmVzaCcpLnRyaWdnZXIoJ3RoZW1lLWNoYW5nZScsIHRvKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9KTtcblxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi10aGVtZV0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHR0aGVtZXMubmF2ID0gdG87XG5cdFx0XHR0aGVtZXMuc2V0VGhlbWUoJCgnI21haW4tbmF2JyksIHRvKTtcblx0XHR9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2VjLW5hdi10aGVtZV0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHR0aGVtZXMuc2VjTmF2ID0gdG87XG5cdFx0XHR0aGVtZXMuc2V0VGhlbWUoJCgnI3NlY29uZC1uYXYnKSwgdG8pO1xuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtmb290ZXItdGhlbWVdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0dGhlbWVzLmZvb3RlciA9IHRvO1xuXHRcdFx0dGhlbWVzLnNldFRoZW1lKCQoJyNjb2xvcGhvbicpLCB0byk7XG5cdFx0fSk7XG5cdH0pO1xuXG59KShqUXVlcnkpOyIsIlxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cbkNVU1RPTUlaRVIgSU5URUdSQVRJT04gLSBOQVYgVEhFTUVTXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4oIGZ1bmN0aW9uKCQpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0LyogZ2xvYmFsIF8sIHdwLCBNSVhULCBtaXh0X2N1c3RvbWl6ZSwgdGlueWNvbG9yICovXG5cblx0aWYgKCBfLmlzRW1wdHkod3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtdGhlbWVzXScpKSApIHJldHVybjtcblx0XG5cdHZhciBkZWZhdWx0cyA9IHtcblx0XHQnYWNjZW50JzogICAgICcjZGQzZTNlJyxcblx0XHQnYmcnOiAgICAgICAgICcjZmZmJyxcblx0XHQnY29sb3InOiAgICAgICcjMzMzJyxcblx0XHQnY29sb3ItaW52JzogICcjZmZmJyxcblx0XHQnYm9yZGVyJzogICAgICcjZGRkJyxcblx0XHQnYm9yZGVyLWludic6ICcjMzMzJyxcblx0fTtcblxuXHR2YXIgdGhlbWVzID0gTUlYVC50aGVtZXM7XG5cdFxuXHRmdW5jdGlvbiB1cGRhdGVOYXZUaGVtZXMoZGF0YSkge1xuXHRcdCQuZWFjaChkYXRhLCBmdW5jdGlvbihpZCwgdGhlbWUpIHtcblx0XHRcdHZhciBjc3M7XG5cblx0XHRcdC8vIEdlbmVyYXRlIHRoZW1lIGlmIGFuIGVsZW1lbnQgdXNlcyBpdFxuXHRcdFx0aWYgKCB0aGVtZXMubmF2ID09IGlkIHx8IHRoZW1lcy5zZWNOYXYgPT0gaWQgfHwgKCAoIHRoZW1lcy5uYXYgPT0gJ2F1dG8nIHx8IHRoZW1lcy5zZWNOYXYgPT0gJ2F1dG8nICkgJiYgdGhlbWVzLnNpdGUgPT0gaWQgKSApIHtcblxuXHRcdFx0XHR2YXIgbmF2YmFyID0gJy5uYXZiYXIudGhlbWUtJytpZCxcblx0XHRcdFx0XHRtYWluX25hdmJhciA9ICcubmF2YmFyLW1peHQudGhlbWUtJytpZCxcblx0XHRcdFx0XHRtYWluX25hdl9vcGFjaXR5ID0gbWl4dF9jdXN0b21pemUubmF2Lm9wYWNpdHkgfHwgMC45NSxcblx0XHRcdFx0XHRuYXZiYXJfZGFyayxcblx0XHRcdFx0XHRuYXZiYXJfbGlnaHQsXG5cblx0XHRcdFx0XHRhY2NlbnQgPSB0aGVtZS5hY2NlbnQgfHwgZGVmYXVsdHMuYWNjZW50LFxuXHRcdFx0XHRcdGFjY2VudF9pbnYgPSB0aGVtZVsnYWNjZW50LWludiddIHx8IGFjY2VudCxcblxuXHRcdFx0XHRcdGJnID0gdGhlbWUuYmcgfHwgZGVmYXVsdHMuYmcsXG5cdFx0XHRcdFx0YmdfZGFyayA9IHRoZW1lWydiZy1kYXJrJ10gPT0gJzEnLFxuXG5cdFx0XHRcdFx0Ym9yZGVyID0gdGhlbWUuYm9yZGVyIHx8IGRlZmF1bHRzLmJvcmRlcixcblx0XHRcdFx0XHRib3JkZXJfaW52ID0gdGhlbWVbJ2JvcmRlci1pbnYnXSB8fCBkZWZhdWx0c1snYm9yZGVyLWludiddLFxuXG5cdFx0XHRcdFx0Y29sb3IgPSB0aGVtZS5jb2xvciB8fCBkZWZhdWx0cy5jb2xvcixcblx0XHRcdFx0XHRjb2xvcl9pbnYgPSB0aGVtZVsnY29sb3ItaW52J10gfHwgZGVmYXVsdHNbJ2NvbG9yLWludiddLFxuXG5cdFx0XHRcdFx0Y29sb3JfZm9yX2FjY2VudCA9IHRpbnljb2xvci5tb3N0UmVhZGFibGUoYWNjZW50LCBbJyNmZmYnLCAnIzAwMCddKS50b0hleFN0cmluZygpLFxuXG5cdFx0XHRcdFx0bWVudV9iZyA9IHRoZW1lWydtZW51LWJnJ10gfHwgYmcsXG5cdFx0XHRcdFx0bWVudV9iZ19kYXJrID0gdGlueWNvbG9yKG1lbnVfYmcpLmlzRGFyaygpLFxuXHRcdFx0XHRcdG1lbnVfYm9yZGVyID0gdGhlbWVbJ21lbnUtYm9yZGVyJ10gfHwgYm9yZGVyLFxuXHRcdFx0XHRcdG1lbnVfYmdfaG92ZXIgPSB0aGVtZVsnbWVudS1iZy1ob3ZlciddIHx8IHRpbnljb2xvcihtZW51X2JnKS5kYXJrZW4oMikudG9TdHJpbmcoKSxcblx0XHRcdFx0XHRtZW51X2hvdmVyX2NvbG9yID0gdGhlbWVbJ21lbnUtaG92ZXItY29sb3InXSB8fCBhY2NlbnQsXG5cdFx0XHRcdFx0bWVudV9hY2NlbnQsXG5cdFx0XHRcdFx0bWVudV9jb2xvcixcblx0XHRcdFx0XHRtZW51X2NvbG9yX2ZhZGUsXG5cblx0XHRcdFx0XHRiZ19saWdodF9hY2NlbnQsIGJnX2xpZ2h0X2NvbG9yLCBiZ19saWdodF9ib3JkZXIsXG5cdFx0XHRcdFx0YmdfZGFya19hY2NlbnQsIGJnX2RhcmtfY29sb3IsIGJnX2RhcmtfYm9yZGVyLFxuXG5cdFx0XHRcdFx0dGhlbWVfcmdiYSA9IHRoZW1lLnJnYmEgPT0gJzEnLFxuXHRcdFx0XHRcdGJvcmRlcl9yZ2JhID0gJycsXG5cdFx0XHRcdFx0bWVudV9iZ19yZ2JhID0gJycsXG5cdFx0XHRcdFx0bWVudV9ib3JkZXJfcmdiYSA9ICcnO1xuXG5cdFx0XHRcdC8vIFNldCBBY2NlbnQgQW5kIFRleHQgQ29sb3JzIEFjY29yZGluZyBUbyBUaGUgQmFja2dyb3VuZCBDb2xvclxuXG5cdFx0XHRcdGlmICggYmdfZGFyayApIHtcblx0XHRcdFx0XHRuYXZiYXJfZGFyayAgPSBuYXZiYXI7XG5cdFx0XHRcdFx0bmF2YmFyX2xpZ2h0ID0gbmF2YmFyKycuYmctbGlnaHQnO1xuXG5cdFx0XHRcdFx0YmdfbGlnaHRfY29sb3IgID0gY29sb3JfaW52O1xuXHRcdFx0XHRcdGJnX2xpZ2h0X2FjY2VudCA9IGFjY2VudF9pbnY7XG5cblx0XHRcdFx0XHRiZ19kYXJrX2NvbG9yICA9IGNvbG9yO1xuXHRcdFx0XHRcdGJnX2RhcmtfYWNjZW50ID0gYWNjZW50O1xuXG5cdFx0XHRcdFx0YmdfZGFya19ib3JkZXIgID0gYm9yZGVyO1xuXHRcdFx0XHRcdGJnX2xpZ2h0X2JvcmRlciA9IGJvcmRlcl9pbnY7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bmF2YmFyX2RhcmsgID0gbmF2YmFyKycuYmctZGFyayc7XG5cdFx0XHRcdFx0bmF2YmFyX2xpZ2h0ID0gbmF2YmFyO1xuXG5cdFx0XHRcdFx0YmdfbGlnaHRfY29sb3IgID0gY29sb3I7XG5cdFx0XHRcdFx0YmdfbGlnaHRfYWNjZW50ID0gYWNjZW50O1xuXG5cdFx0XHRcdFx0YmdfZGFya19jb2xvciAgPSBjb2xvcl9pbnY7XG5cdFx0XHRcdFx0YmdfZGFya19hY2NlbnQgPSBhY2NlbnRfaW52O1xuXG5cdFx0XHRcdFx0YmdfZGFya19ib3JkZXIgID0gYm9yZGVyX2ludjtcblx0XHRcdFx0XHRiZ19saWdodF9ib3JkZXIgPSBib3JkZXI7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgaGFzX2ludl9hY2NlbnQgPSAoIGJnX2xpZ2h0X2FjY2VudCAhPSBiZ19kYXJrX2FjY2VudCApO1xuXG5cdFx0XHRcdC8vIFNldCBNZW51IEFjY2VudCBBbmQgVGV4dCBDb2xvcnMgQWNjb3JkaW5nIFRvIFRoZSBCYWNrZ3JvdW5kIENvbG9yXG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAoIG1lbnVfYmdfZGFyayApIHtcblx0XHRcdFx0XHRtZW51X2NvbG9yICAgICAgPSB0aGVtZVsnbWVudS1jb2xvciddIHx8IGJnX2RhcmtfY29sb3I7XG5cdFx0XHRcdFx0bWVudV9jb2xvcl9mYWRlID0gdGhlbWVbJ21lbnUtY29sb3ItZmFkZSddIHx8IG1lbnVfY29sb3I7XG5cdFx0XHRcdFx0bWVudV9hY2NlbnQgICAgID0gYmdfZGFya19hY2NlbnQ7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWVudV9jb2xvciAgICAgID0gdGhlbWVbJ21lbnUtY29sb3InXSB8fCBiZ19saWdodF9jb2xvcjtcblx0XHRcdFx0XHRtZW51X2NvbG9yX2ZhZGUgPSB0aGVtZVsnbWVudS1jb2xvci1mYWRlJ10gfHwgbWVudV9jb2xvcjtcblx0XHRcdFx0XHRtZW51X2FjY2VudCAgICAgPSBiZ19saWdodF9hY2NlbnQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBNYWtlIFJHQkEgQ29sb3JzIElmIEVuYWJsZWRcblx0XHRcdFx0XG5cdFx0XHRcdGlmICggdGhlbWVfcmdiYSApIHtcblx0XHRcdFx0XHRib3JkZXJfcmdiYSA9ICdib3JkZXItY29sb3I6ICcrdGlueWNvbG9yKGJvcmRlcikuc2V0QWxwaGEoMC44KS50b1BlcmNlbnRhZ2VSZ2JTdHJpbmcoKSsnOyc7XG5cdFx0XHRcdFx0bWVudV9iZ19yZ2JhID0gJ2JhY2tncm91bmQtY29sb3I6ICcrdGlueWNvbG9yKG1lbnVfYmcpLnNldEFscGhhKDAuOTUpLnRvUGVyY2VudGFnZVJnYlN0cmluZygpKyc7Jztcblx0XHRcdFx0XHRtZW51X2JvcmRlcl9yZ2JhID0gJ2JvcmRlci1jb2xvcjogJyt0aW55Y29sb3IobWVudV9ib3JkZXIpLnNldEFscGhhKDAuOCkudG9QZXJjZW50YWdlUmdiU3RyaW5nKCkrJzsnO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gU1RBUlQgQ1NTIFJVTEVTXG5cblx0XHRcdFx0Y3NzID0gbmF2YmFyKycgeyBib3JkZXItY29sb3I6ICcrYm9yZGVyKyc7IGJhY2tncm91bmQtY29sb3I6ICcrYmcrJzsgfSc7XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAoIG1haW5fbmF2X29wYWNpdHkgPCAxICkge1xuXHRcdFx0XHRcdGNzcyArPSBtYWluX25hdmJhcisnOm5vdCgucG9zaXRpb24tdG9wKTpub3QoLnZlcnRpY2FsKSB7IGJhY2tncm91bmQtY29sb3I6ICcrdGlueWNvbG9yKGJnKS5zZXRBbHBoYShtYWluX25hdl9vcGFjaXR5KS50b1BlcmNlbnRhZ2VSZ2JTdHJpbmcoKSsnOyB9Jztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNzcyArPSBuYXZiYXIrJy5pbml0IHsgYmFja2dyb3VuZC1jb2xvcjogJytiZysnICFpbXBvcnRhbnQ7IH0nO1xuXG5cdFx0XHRcdGlmICggYmdfZGFyayApIHtcblx0XHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLm5hdmJhci1kYXRhOmJlZm9yZSB7IGNvbnRlbnQ6IFwiZGFya1wiOyB9Jztcblx0XHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgI25hdi1sb2dvIC5sb2dvLWRhcmsgeyBwb3NpdGlvbjogc3RhdGljOyBvcGFjaXR5OiAxOyB2aXNpYmlsaXR5OiB2aXNpYmxlOyB9Jztcblx0XHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgI25hdi1sb2dvIC5sb2dvLWxpZ2h0IHsgcG9zaXRpb246IGFic29sdXRlOyBvcGFjaXR5OiAwOyB2aXNpYmlsaXR5OiBoaWRkZW47IH0nO1xuXHRcdFx0XHRcdGNzcyArPSBuYXZiYXJfbGlnaHQrJyAjbmF2LWxvZ28gLmxvZ28tZGFyayB7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgb3BhY2l0eTogMDsgdmlzaWJpbGl0eTogaGlkZGVuOyB9Jztcblx0XHRcdFx0XHRjc3MgKz0gbmF2YmFyX2xpZ2h0KycgI25hdi1sb2dvIC5sb2dvLWxpZ2h0IHsgcG9zaXRpb246IHN0YXRpYzsgb3BhY2l0eTogMTsgdmlzaWJpbGl0eTogdmlzaWJsZTsgfSc7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y3NzICs9IG5hdmJhcisnIC5uYXZiYXItZGF0YTpiZWZvcmUgeyBjb250ZW50OiBcImxpZ2h0XCI7IH0nO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gU3VibWVudXNcblxuXHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLnN1Yi1tZW51IHsgYmFja2dyb3VuZC1jb2xvcjogJyttZW51X2JnKyc7ICcrbWVudV9iZ19yZ2JhKycgfSc7XG5cdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAuc3ViLW1lbnUgbGkgPiBhOmhvdmVyLCAnK25hdmJhcisnIC5zdWItbWVudSBsaSA+IGE6aG92ZXI6Zm9jdXMsICc7XG5cdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAuc3ViLW1lbnUgbGk6aG92ZXIgPiBhOmhvdmVyLCAnK25hdmJhcisnIC5zdWItbWVudSBsaS5ob3ZlciA+IGE6aG92ZXIgeyBjb2xvcjogJyttZW51X2hvdmVyX2NvbG9yKyc7IGJhY2tncm91bmQtY29sb3I6ICcrbWVudV9iZ19ob3ZlcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IG5hdmJhcisnIC5zdWItbWVudSBsaSA+IGEsICcrbmF2YmFyKycgLnN1Yi1tZW51IGlucHV0IHsgY29sb3I6ICcrbWVudV9jb2xvcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IG5hdmJhcisnIC5zdWItbWVudSBpbnB1dDo6LXdlYmtpdC1pbnB1dC1wbGFjZWhvbGRlciB7IGNvbG9yOiAnK21lbnVfY29sb3JfZmFkZSsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IG5hdmJhcisnIC5zdWItbWVudSBpbnB1dDo6LW1vei1wbGFjZWhvbGRlciB7IGNvbG9yOiAnK21lbnVfY29sb3JfZmFkZSsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IG5hdmJhcisnIC5zdWItbWVudSBpbnB1dDotbXMtaW5wdXQtcGxhY2Vob2xkZXIgeyBjb2xvcjogJyttZW51X2NvbG9yX2ZhZGUrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAuc3ViLW1lbnUsICcrbmF2YmFyKycgLnN1Yi1tZW51ID4gbGksICcrbmF2YmFyKycgLnN1Yi1tZW51ID4gbGkgPiBhIHsgYm9yZGVyLWNvbG9yOiAnK21lbnVfYm9yZGVyKyc7ICcrbWVudV9ib3JkZXJfcmdiYSsnIH0nO1xuXHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLnN1Yi1tZW51IGxpID4gYTpob3ZlciwgJytuYXZiYXIrJyAuc3ViLW1lbnUgLmFjdGl2ZSA+IGEsICcrbmF2YmFyKycgLnN1Yi1tZW51IC5hY3RpdmUgPiBhOmhvdmVyIHsgY29sb3I6ICcrbWVudV9hY2NlbnQrJzsgfSc7XG5cblx0XHRcdFx0Ly8gT3RoZXIgRWxlbWVudHNcblx0XHRcdFx0XG5cdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAubmF2LXNlYXJjaCAuc2VhcmNoLWZvcm0gYnV0dG9uIHsgYm9yZGVyLWNvbG9yOiAnK21lbnVfYm9yZGVyKyc7ICcrbWVudV9ib3JkZXJfcmdiYSsnIGJhY2tncm91bmQtY29sb3I6ICcrdGlueWNvbG9yKG1lbnVfYmcpLmRhcmtlbigzKS50b1N0cmluZygpKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLm5hdi1zZWFyY2ggLnNlYXJjaC1mb3JtIGJ1dHRvbiwgJG5hdmJhciAubmF2LXNlYXJjaCAuc2VhcmNoLWZvcm0gaW5wdXQgeyBjb2xvcjogJyttZW51X2NvbG9yKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLmFjY2VudC1iZyB7IGNvbG9yOiAnK2NvbG9yX2Zvcl9hY2NlbnQrJzsgYmFja2dyb3VuZC1jb2xvcjogJythY2NlbnQrJzsgfSc7XG5cblx0XHRcdFx0Ly8gTGlnaHQgQmFja2dyb3VuZFxuXHRcdFx0XHRcblx0XHRcdFx0Y3NzICs9IG5hdmJhcl9saWdodCsnIC5uYXYgPiBsaSA+IGEsICcrbmF2YmFyX2xpZ2h0KycgLnRleHQtY29udCwgJytuYXZiYXJfbGlnaHQrJyAudGV4dC1jb250IGE6aG92ZXIsICcrbmF2YmFyX2xpZ2h0KycgLnRleHQtY29udCBhLm5vLWNvbG9yIHsgY29sb3I6ICcrYmdfbGlnaHRfY29sb3IrJzsgfSc7XG5cdFx0XHRcdGlmICggaGFzX2ludl9hY2NlbnQgKSB7XG5cdFx0XHRcdFx0Y3NzICs9IG5hdmJhcl9saWdodCsnIC5uYXYgPiBsaTpob3ZlciA+IGEsICcrbmF2YmFyX2xpZ2h0KycgLm5hdiA+IGxpLmhvdmVyID4gYSwgJytuYXZiYXJfbGlnaHQrJyAubmF2ID4gbGkgPiBhOmhvdmVyLCAnK25hdmJhcl9saWdodCsnIC5uYXYgPiAuYWN0aXZlID4gYSwgJytuYXZiYXJfbGlnaHQrJyAudGV4dC1jb250IGEgeyBjb2xvcjogJytiZ19saWdodF9hY2NlbnQrJzsgfSc7XG5cdFx0XHRcdFx0Y3NzICs9IG5hdmJhcl9saWdodCsnIC5uYXYgPiAuYWN0aXZlID4gYTpiZWZvcmUgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2xpZ2h0X2FjY2VudCsnOyB9Jztcblx0XHRcdFx0fVxuXHRcdFx0XHRjc3MgKz0gbmF2YmFyX2xpZ2h0KycgLm5hdmJhci10b2dnbGUgLmljb24tYmFyIHsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19saWdodF9jb2xvcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IG5hdmJhcl9saWdodCsnIC5uYXYgPiBsaSwgJytuYXZiYXJfbGlnaHQrJyAubmF2ID4gbGkgPiBhLCAnK25hdmJhcl9saWdodCsnIC5uYXZiYXItdG9nZ2xlIHsgYm9yZGVyLWNvbG9yOiAnK2JnX2xpZ2h0X2JvcmRlcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IG5hdmJhcl9saWdodCsnIC5kaXZpZGVyIHsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19saWdodF9ib3JkZXIrJzsgfSc7XG5cblx0XHRcdFx0Ly8gRGFyayBCYWNrZ3JvdW5kXG5cdFx0XHRcdFxuXHRcdFx0XHRjc3MgKz0gbmF2YmFyX2RhcmsrJyAubmF2ID4gbGkgPiBhLCAnK25hdmJhcl9kYXJrKycgLnRleHQtY29udCwgJytuYXZiYXJfZGFyaysnIC50ZXh0LWNvbnQgYTpob3ZlciwgJytuYXZiYXJfZGFyaysnIC50ZXh0LWNvbnQgYS5uby1jb2xvciB7IGNvbG9yOiAnK2JnX2RhcmtfY29sb3IrJzsgfSc7XG5cdFx0XHRcdGlmICggaGFzX2ludl9hY2NlbnQgKSB7XG5cdFx0XHRcdFx0Y3NzICs9IG5hdmJhcl9kYXJrKycgLm5hdiA+IGxpOmhvdmVyID4gYSwgJytuYXZiYXJfZGFyaysnIC5uYXYgPiBsaS5ob3ZlciA+IGEsICcrbmF2YmFyX2RhcmsrJyAubmF2ID4gbGkgPiBhOmhvdmVyLCAnK25hdmJhcl9kYXJrKycgLm5hdiA+IC5hY3RpdmUgPiBhLCAnK25hdmJhcl9kYXJrKycgLnRleHQtY29udCBhIHsgY29sb3I6ICcrYmdfZGFya19hY2NlbnQrJzsgfSc7XG5cdFx0XHRcdFx0Y3NzICs9IG5hdmJhcl9kYXJrKycgLm5hdiA+IC5hY3RpdmUgPiBhOmJlZm9yZSB7IGJhY2tncm91bmQtY29sb3I6ICcrYmdfZGFya19hY2NlbnQrJzsgfSc7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y3NzICs9IG5hdmJhcl9kYXJrKycgLm5hdmJhci10b2dnbGUgLmljb24tYmFyIHsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19kYXJrX2NvbG9yKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gbmF2YmFyX2RhcmsrJyAubmF2ID4gbGksICcrbmF2YmFyX2RhcmsrJyAubmF2ID4gbGkgPiBhLCAnK25hdmJhcl9kYXJrKycgLm5hdmJhci10b2dnbGUgeyBib3JkZXItY29sb3I6ICcrYmdfZGFya19ib3JkZXIrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSBuYXZiYXJfZGFyaysnIC5kaXZpZGVyIHsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19kYXJrX2JvcmRlcisnOyB9JztcblxuXHRcdFx0XHRpZiAoICEgaGFzX2ludl9hY2NlbnQgKSB7XG5cdFx0XHRcdFx0Y3NzICs9IG5hdmJhcisnIC5uYXYgPiBsaTpob3ZlciA+IGEsICcrbmF2YmFyKycgLm5hdiA+IGxpLmhvdmVyID4gYSwgJytuYXZiYXIrJyAubmF2ID4gbGkgPiBhOmhvdmVyLCAnK25hdmJhcisnIC5uYXYgPiBsaS5hY3RpdmUgPiBhLCAnK25hdmJhcisnIC50ZXh0LWNvbnQgYSB7IGNvbG9yOiAnK2FjY2VudCsnOyB9Jztcblx0XHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLm5hdiA+IC5hY3RpdmUgPiBhOmJlZm9yZSB7IGJhY2tncm91bmQtY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gTWFpbiBOYXZiYXIgTW9iaWxlIFN0eWxpbmdcblxuXHRcdFx0XHR2YXIgbWluaV9uYXZiYXIgPSAnLm5hdi1taW5pICcrbWFpbl9uYXZiYXIrJy5uYXZiYXInO1xuXG5cdFx0XHRcdGNzcyArPSBtaW5pX25hdmJhcisnIC5uYXZiYXItaW5uZXIgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK21lbnVfYmcrJzsgJyttZW51X2JnX3JnYmErJyB9Jztcblx0XHRcdFx0Y3NzICs9IG1pbmlfbmF2YmFyKycgLm5hdmJhci1pbm5lciAudGV4dC1jb250LCAnK21pbmlfbmF2YmFyKycgLm5hdmJhci1pbm5lciAudGV4dC1jb250IGE6aG92ZXIsICcrbWluaV9uYXZiYXIrJyAubmF2YmFyLWlubmVyIC50ZXh0LWNvbnQgYS5uby1jb2xvciwgJyttaW5pX25hdmJhcisnIC5uYXYgPiBsaSA+IGEgeyBjb2xvcjogJyttZW51X2NvbG9yKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gbWluaV9uYXZiYXIrJyAubmF2ID4gbGkgPiBhOmhvdmVyLCAnK21pbmlfbmF2YmFyKycgLm5hdiA+IGxpID4gYTpob3Zlcjpmb2N1cywgJyttaW5pX25hdmJhcisnIC5uYXYgPiBsaTpob3ZlciA+IGE6aG92ZXIsICc7XG5cdFx0XHRcdGNzcyArPSBtaW5pX25hdmJhcisnIC5uYXYgPiBsaS5ob3ZlciA+IGE6aG92ZXIsICcrbWluaV9uYXZiYXIrJyAubmF2ID4gbGkuYWN0aXZlID4gYTpob3ZlciB7IGNvbG9yOiAnK21lbnVfaG92ZXJfY29sb3IrJzsgYmFja2dyb3VuZC1jb2xvcjogJyttZW51X2JnX2hvdmVyKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gbWluaV9uYXZiYXIrJyAubmF2ID4gbGk6aG92ZXIgPiBhLCAnK21pbmlfbmF2YmFyKycgLm5hdiA+IGxpLmhvdmVyID4gYSB7IGNvbG9yOiAnK21lbnVfY29sb3IrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSBtaW5pX25hdmJhcisnIC5uYXYgbGkubmF2LXNlYXJjaDpob3ZlciA+IGEsICcrbWluaV9uYXZiYXIrJyAubmF2IGxpLm5hdi1zZWFyY2guaG92ZXIgPiBhIHsgY29sb3I6ICcrbWVudV9jb2xvcisnICFpbXBvcnRhbnQ7IGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50ICFpbXBvcnRhbnQ7IH0nO1xuXHRcdFx0XHRjc3MgKz0gbWluaV9uYXZiYXIrJyAubmF2ID4gbGkuYWN0aXZlID4gYSwgJyttaW5pX25hdmJhcisnIC5uYXZiYXItaW5uZXIgLnRleHQtY29udCBhIHsgY29sb3I6ICcrbWVudV9hY2NlbnQrJzsgfSc7XG5cdFx0XHRcdGlmICggaGFzX2ludl9hY2NlbnQgKSB7XG5cdFx0XHRcdFx0Y3NzICs9IG1pbmlfbmF2YmFyKycgLm5hdiA+IC5hY3RpdmUgPiBhOmJlZm9yZSB7IGJhY2tncm91bmQtY29sb3I6ICcrbWVudV9hY2NlbnQrJzsgfSc7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y3NzICs9IG1pbmlfbmF2YmFyKycgLm5hdmJhci1pbm5lciwgJyttaW5pX25hdmJhcisnIC5uYXYgPiBsaSwgJyttaW5pX25hdmJhcisnIC5uYXYgPiBsaSA+IGEgeyBib3JkZXItY29sb3I6ICcrbWVudV9ib3JkZXIrJzsgJyttZW51X2JvcmRlcl9yZ2JhKycgfSc7XG5cblx0XHRcdFx0TUlYVC5zdHlsZXNoZWV0KCduYXYtdGhlbWUtJytpZCwgY3NzKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdCQoJy5uYXZiYXInKS50cmlnZ2VyKCdyZWZyZXNoJyk7XG5cdH1cblx0XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbmF2LXRoZW1lc10nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHR1cGRhdGVOYXZUaGVtZXModG8pO1xuXHRcdH0pO1xuXHR9KTtcblxuXHQvLyBHZW5lcmF0ZSBjdXN0b20gdGhlbWVzIGlmIHRoZW1lIGlzIGNoYW5nZWQgZnJvbSBvbmUgb2YgdGhlIGRlZmF1bHRzXG5cdGZ1bmN0aW9uIG1heWJlVXBkYXRlTmF2VGhlbWVzKGlkKSB7XG5cdFx0aWYgKCBpZCA9PSAnYXV0bycgKSBpZCA9IHRoZW1lcy5zaXRlO1xuXHRcdGlmICggISBfLmhhcyhtaXh0X2N1c3RvbWl6ZS50aGVtZXMsIGlkKSApIHtcblx0XHRcdHZhciBuYXZUaGVtZXMgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi10aGVtZXNdJykuZ2V0KCk7XG5cdFx0XHR1cGRhdGVOYXZUaGVtZXMobmF2VGhlbWVzKTtcblx0XHR9XG5cdH1cblx0JCgnI21haW4tbmF2Jykub24oJ3RoZW1lLWNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50LCB0aGVtZSkge1xuXHRcdG1heWJlVXBkYXRlTmF2VGhlbWVzKHRoZW1lKTtcblx0fSk7XG5cdCQoJyNzZWNvbmQtbmF2Jykub24oJ3RoZW1lLWNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50LCB0aGVtZSkge1xuXHRcdG1heWJlVXBkYXRlTmF2VGhlbWVzKHRoZW1lKTtcblx0fSk7XG5cbn0pKGpRdWVyeSk7IiwiXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xuQ1VTVE9NSVpFUiBJTlRFR1JBVElPTiAtIFNJVEUgVEhFTUVTXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4oIGZ1bmN0aW9uKCQpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0LyogZ2xvYmFsIF8sIHdwLCBNSVhULCBtaXh0X2N1c3RvbWl6ZSwgdGlueWNvbG9yICovXG5cblx0aWYgKCBfLmlzRW1wdHkod3AuY3VzdG9taXplKCdtaXh0X29wdFtzaXRlLXRoZW1lc10nKSkgKSByZXR1cm47XG5cdFxuXHR2YXIgZGVmYXVsdHMgPSB7XG5cdFx0J2FjY2VudCc6ICAgICAnI2RkM2UzZScsXG5cdFx0J2JnJzogICAgICAgICAnI2ZmZicsXG5cdFx0J2NvbG9yJzogICAgICAnIzMzMycsXG5cdFx0J2NvbG9yLWludic6ICAnI2ZmZicsXG5cdFx0J2JvcmRlcic6ICAgICAnI2RkZCcsXG5cdH07XG5cblx0dmFyIHRoZW1lcyA9IE1JWFQudGhlbWVzO1xuXG5cdGZ1bmN0aW9uIHBhcnNlX3NlbGVjdG9yKHBhdHRlcm4sIHNlbCkge1xuXHRcdHZhciBzZWxlY3RvciA9ICcnO1xuXHRcdGlmICggXy5pc0FycmF5KHNlbCkgKSB7XG5cdFx0XHQkLmVhY2goc2VsLCBmdW5jdGlvbihpLCBzaW5nbGVfc2VsKSB7XG5cdFx0XHRcdHNlbGVjdG9yICs9IHBhdHRlcm4ucmVwbGFjZSgvXFx7XFx7c2VsXFx9XFx9L2csIHNpbmdsZV9zZWwpICsgJywnO1xuXHRcdFx0fSk7XG5cdFx0XHRzZWxlY3RvciA9IHNlbGVjdG9yLnJlcGxhY2UoLywrJC8sICcnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2VsZWN0b3IgPSBwYXR0ZXJuLnJlcGxhY2UoL1xce1xce3NlbFxcfVxcfS9nLCBzZWwpO1xuXHRcdH1cblx0XHRyZXR1cm4gc2VsZWN0b3I7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRfdGV4dHNoX2Zvcl9iZyhiZywgY29sb3JzKSB7XG5cdFx0Y29sb3JzID0gY29sb3JzIHx8IFsncmdiYSgwLDAsMCwwLjEpJywgJ3JnYmEoMjU1LDI1NSwyNTUsMC4xKSddO1xuXHRcdGlmICggdGlueWNvbG9yKGJnKS5pc0xpZ2h0KCkgKSB7XG5cdFx0XHRyZXR1cm4gY29sb3JzWzBdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gY29sb3JzWzFdO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGJ1dHRvbl9jb2xvcihzZWwsIGNvbG9yLCBwcmUpIHtcblx0XHRwcmUgPSBwcmUgfHwgJy5taXh0JztcblxuXHRcdHZhciBjc3MgPSAnJyxcblx0XHRcdGNvbG9yX2Zvcl9iZyA9IHRpbnljb2xvci5tb3N0UmVhZGFibGUoY29sb3IsIFsnI2ZmZicsICcjMDAwJ10pLnRvSGV4U3RyaW5nKCksXG5cdFx0XHRib3JkZXJfY29sb3IgPSB0aW55Y29sb3IoY29sb3IpLmRhcmtlbig1KS50b1N0cmluZygpLFxuXHRcdFx0dGV4dF9zaGFkb3cgID0gc2V0X3RleHRzaF9mb3JfYmcoY29sb3IpLFxuXHRcdFx0Y29sb3JfZGFya2VyID0gdGlueWNvbG9yKGNvbG9yKS5kYXJrZW4oMTApLnRvU3RyaW5nKCksXG5cdFx0XHRidG5fc29saWRfaG92ZXJfYmcsXG5cdFx0XHRidG5fb3V0bGluZV9ob3Zlcl9iZztcblxuXHRcdGlmICggdGlueWNvbG9yKGNvbG9yKS5pc0xpZ2h0KCkgKSB7XG5cdFx0XHRidG5fc29saWRfaG92ZXJfYmcgPSB0aW55Y29sb3IoY29sb3IpLmRhcmtlbig1KS50b1N0cmluZygpO1xuXHRcdFx0YnRuX291dGxpbmVfaG92ZXJfYmcgPSAncmdiYSgwLDAsMCwwLjAzKSc7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGJ0bl9zb2xpZF9ob3Zlcl9iZyA9IHRpbnljb2xvcihjb2xvcikubGlnaHRlbig1KS50b1N0cmluZygpO1xuXHRcdFx0YnRuX291dGxpbmVfaG92ZXJfYmcgPSAncmdiYSgyNTUsMjU1LDI1NSwwLjAzKSc7XG5cdFx0fVxuXG5cdFx0Ly8gU29saWQgQmFja2dyb3VuZFxuXHRcdFxuXHRcdGNzcyArPSBwYXJzZV9zZWxlY3RvcihwcmUrJyAuYnRuLXt7c2VsfX0nLCBzZWwpICsgJyB7IGJvcmRlci1jb2xvcjogJytib3JkZXJfY29sb3IrJzsgdGV4dC1zaGFkb3c6IDAgMXB4IDFweCAnK3RleHRfc2hhZG93Kyc7IGJhY2tncm91bmQtY29sb3I6ICcrY29sb3IrJzsgfSc7XG5cdFx0Y3NzICs9IHBhcnNlX3NlbGVjdG9yKHByZSsnIC5idG4te3tzZWx9fTpob3ZlciwgJytwcmUrJyAuYnRuLXt7c2VsfX06Zm9jdXMnLCBzZWwpICsgJyB7IGJhY2tncm91bmQtY29sb3I6ICcrYnRuX3NvbGlkX2hvdmVyX2JnKyc7IH0nO1xuXHRcdGNzcyArPSBwYXJzZV9zZWxlY3RvcihwcmUrJyAuYnRuLWhvdmVyLXt7c2VsfX06aG92ZXIsICcrcHJlKycgLmJ0bi1ob3Zlci17e3NlbH19OmZvY3VzJywgc2VsKSArICcgeyBib3JkZXItY29sb3I6ICcrYm9yZGVyX2NvbG9yKyc7IHRleHQtc2hhZG93OiAwIDFweCAxcHggJyt0ZXh0X3NoYWRvdysnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2NvbG9yKycgIWltcG9ydGFudDsgfSc7XG5cdFx0Y3NzICs9IHBhcnNlX3NlbGVjdG9yKHByZSsnIC5idG4te3tzZWx9fTphY3RpdmUsICcrcHJlKycgLmJ0bi17e3NlbH19LmFjdGl2ZSwgJytwcmUrJyAuYnRuLWhvdmVyLXt7c2VsfX06aG92ZXI6YWN0aXZlLCAnK3ByZSsnIC5idG4taG92ZXIte3tzZWx9fTpob3Zlci5hY3RpdmUnLCBzZWwpICsgJyB7IGJvcmRlci1jb2xvcjogJytjb2xvcl9kYXJrZXIrJzsgYm94LXNoYWRvdzogaW5zZXQgMCAxcHggMTJweCAnK2NvbG9yX2RhcmtlcisnOyB9Jztcblx0XHRjc3MgKz0gcGFyc2Vfc2VsZWN0b3IocHJlKycgLmJ0bi17e3NlbH19LCAnK3ByZSsnIGEuYnRuLXt7c2VsfX0sICcrcHJlKycgLmJ0bi17e3NlbH19OmhvdmVyLCAnK3ByZSsnIC5idG4te3tzZWx9fTpmb2N1cywgJytwcmUrJyAuYnRuLWhvdmVyLXt7c2VsfX06aG92ZXIsICcrcHJlKycgYS5idG4taG92ZXIte3tzZWx9fTpob3ZlciwgJytwcmUrJyAuYnRuLWhvdmVyLXt7c2VsfX06Zm9jdXMnLCBzZWwpICsgJyB7IGNvbG9yOiAnK2NvbG9yX2Zvcl9iZysnOyB9JztcblxuXHRcdC8vIE91dGxpbmVcblx0XHRcblx0XHRjc3MgKz0gcGFyc2Vfc2VsZWN0b3IocHJlKycgLmJ0bi1vdXRsaW5lLXt7c2VsfX06aG92ZXInLCBzZWwpICsgJyB7IGJhY2tncm91bmQtY29sb3I6ICcrYnRuX291dGxpbmVfaG92ZXJfYmcrJzsgfSc7XG5cdFx0Y3NzICs9IHBhcnNlX3NlbGVjdG9yKHByZSsnIC5idG4tb3V0bGluZS17e3NlbH19LCAnK3ByZSsnIC5idG4taG92ZXItb3V0bGluZS17e3NlbH19OmhvdmVyJywgc2VsKSArICcgeyBib3JkZXI6IDFweCBzb2xpZCAnK2JvcmRlcl9jb2xvcisnOyB0ZXh0LXNoYWRvdzogbm9uZSAhaW1wb3J0YW50OyBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDsgfSc7XG5cdFx0Y3NzICs9IHBhcnNlX3NlbGVjdG9yKHByZSsnIC5idG4tb3V0bGluZS17e3NlbH19OmFjdGl2ZSwgJytwcmUrJyAuYnRuLW91dGxpbmUte3tzZWx9fS5hY3RpdmUsICcrcHJlKycgLmJ0bi1ob3Zlci1vdXRsaW5lLXt7c2VsfX06aG92ZXI6YWN0aXZlLCAnK3ByZSsnIC5idG4taG92ZXItb3V0bGluZS17e3NlbH19OmhvdmVyLmFjdGl2ZScsIHNlbCkgKyAnIHsgYm94LXNoYWRvdzogaW5zZXQgMCAxcHggMTZweCByZ2JhKDAsMCwwLDAuMDUpOyB9Jztcblx0XHRjc3MgKz0gcGFyc2Vfc2VsZWN0b3IocHJlKycgLmJ0bi1ob3Zlci1vdXRsaW5lLXt7c2VsfX06aG92ZXInLCBzZWwpICsgJyB7IGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50ICFpbXBvcnRhbnQ7IH0nO1xuXHRcdGNzcyArPSBwYXJzZV9zZWxlY3RvcihwcmUrJyAuYnRuLW91dGxpbmUte3tzZWx9fSwgJytwcmUrJyBhLmJ0bi1vdXRsaW5lLXt7c2VsfX0sICcrcHJlKycgLmJ0bi1vdXRsaW5lLXt7c2VsfX06aG92ZXIsICcrcHJlKycgLmJ0bi1vdXRsaW5lLXt7c2VsfX06Zm9jdXMsICcrcHJlKycgLmJ0bi1ob3Zlci1vdXRsaW5lLXt7c2VsfX06aG92ZXIsICcrcHJlKycgYS5idG4taG92ZXItb3V0bGluZS17e3NlbH19OmhvdmVyLCAnK3ByZSsnIC5idG4taG92ZXItb3V0bGluZS17e3NlbH19OmZvY3VzJywgc2VsKSArICcgeyBjb2xvcjogJytjb2xvcisnOyB9JztcblxuXHRcdC8vIEFuaW1hdGlvbnNcblxuXHRcdGNzcyArPSBwYXJzZV9zZWxlY3RvcihwcmUrJyAuYnRuLWZpbGwtaW4te3tzZWx9fScsIHNlbCkgKyAnIHsgYmFja2dyb3VuZC1jb2xvcjogJytjb2xvcisnICFpbXBvcnRhbnQ7IH0nO1xuXHRcdGNzcyArPSBwYXJzZV9zZWxlY3RvcihwcmUrJyAuYnRuLWZpbGwtaW4te3tzZWx9fTpob3ZlciwgJytwcmUrJyAuYnRuLWZpbGwtaW4te3tzZWx9fTpmb2N1cywgJytwcmUrJyAuYnRuLWZpbGwtaW4te3tzZWx9fTphY3RpdmUnLCBzZWwpICsgJyB7IGNvbG9yOiAnK2NvbG9yX2Zvcl9iZysnOyBib3JkZXItY29sb3I6ICcrY29sb3IrJzsgdGV4dC1zaGFkb3c6IDAgMXB4IDFweCAnK3RleHRfc2hhZG93Kyc7IH0nO1xuXHRcdGNzcyArPSBwYXJzZV9zZWxlY3RvcihwcmUrJyAuYnRuLXt7c2VsfX0uYnRuLWZpbGwtaW46YmVmb3JlJywgc2VsKSArICcgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2NvbG9yKyc7IH0nO1xuXHRcdGNzcyArPSBwYXJzZV9zZWxlY3RvcihwcmUrJyAuYnRuLWZpbGwte3tzZWx9fTpob3ZlciwgJytwcmUrJyAuYnRuLWZpbGwte3tzZWx9fTpmb2N1cywgJytwcmUrJyAuYnRuLWZpbGwte3tzZWx9fTphY3RpdmUnLCBzZWwpICsgJyB7IGNvbG9yOiAnK2NvbG9yX2Zvcl9iZysnOyBib3JkZXItY29sb3I6ICcrY29sb3IrJzsgdGV4dC1zaGFkb3c6IDAgMXB4IDFweCAnK3RleHRfc2hhZG93Kyc7IH0nO1xuXHRcdGNzcyArPSBwYXJzZV9zZWxlY3RvcihwcmUrJyAuYnRuLWZpbGwte3tzZWx9fTpiZWZvcmUnLCBzZWwpICsgJyB7IGJhY2tncm91bmQtY29sb3I6ICcrY29sb3IrJzsgfSc7XG5cblx0XHQvLyBXb29Db21tZXJjZSBBY2NlbnQgQnV0dG9uXG5cdFx0XG5cdFx0aWYgKCBfLmlzQXJyYXkoc2VsKSAmJiBfLmNvbnRhaW5zKHNlbCwgJ2FjY2VudCcpICkge1xuXHRcdFx0Y3NzICs9IHByZSsnIC53b29jb21tZXJjZSAuYnV0dG9uLmFsdCwgJytwcmUrJyAud29vY29tbWVyY2UgaW5wdXRbdHlwZT1zdWJtaXRdLmJ1dHRvbiwgJytwcmUrJyAud29vY29tbWVyY2UgI3Jlc3BvbmQgaW5wdXQjc3VibWl0IHsgY29sb3I6ICcrY29sb3JfZm9yX2JnKycgIWltcG9ydGFudDsgYm9yZGVyLWNvbG9yOiAnK2JvcmRlcl9jb2xvcisnICFpbXBvcnRhbnQ7IHRleHQtc2hhZG93OiAwIDFweCAxcHggJyt0ZXh0X3NoYWRvdysnICFpbXBvcnRhbnQ7IGJhY2tncm91bmQtY29sb3I6ICcrY29sb3IrJyAhaW1wb3J0YW50OyB9Jztcblx0XHRcdGNzcyArPSBwcmUrJyAud29vY29tbWVyY2UgLmJ1dHRvbi5hbHQ6aG92ZXIsICcrcHJlKycgLndvb2NvbW1lcmNlIGlucHV0W3R5cGU9c3VibWl0XS5idXR0b246aG92ZXIsICcrcHJlKycgLndvb2NvbW1lcmNlICNyZXNwb25kIGlucHV0I3N1Ym1pdDpob3ZlciwgJyArXG5cdFx0XHRcdCAgIHByZSsnIC53b29jb21tZXJjZSAuYnV0dG9uLmFsdDpmb2N1cywgJytwcmUrJyAud29vY29tbWVyY2UgaW5wdXRbdHlwZT1zdWJtaXRdLmJ1dHRvbjpmb2N1cywgJytwcmUrJyAud29vY29tbWVyY2UgI3Jlc3BvbmQgaW5wdXQjc3VibWl0OmZvY3VzIHsgYmFja2dyb3VuZC1jb2xvcjogJytidG5fc29saWRfaG92ZXJfYmcrJyAhaW1wb3J0YW50OyB9Jztcblx0XHRcdGNzcyArPSBwcmUrJyAud29vY29tbWVyY2UgLmJ1dHRvbi5hbHQ6YWN0aXZlLCAnK3ByZSsnIC53b29jb21tZXJjZSBpbnB1dFt0eXBlPXN1Ym1pdF0uYnV0dG9uOmFjdGl2ZSwgJytwcmUrJyAud29vY29tbWVyY2UgI3Jlc3BvbmQgaW5wdXQjc3VibWl0OmFjdGl2ZSwgJyArXG5cdFx0XHRcdCAgIHByZSsnIC53b29jb21tZXJjZSAuYnV0dG9uLmFsdC5hY3RpdmUsICcrcHJlKycgLndvb2NvbW1lcmNlIGlucHV0W3R5cGU9c3VibWl0XS5idXR0b246Zm9jdXMsICcrcHJlKycgLndvb2NvbW1lcmNlICNyZXNwb25kIGlucHV0I3N1Ym1pdC5hY3RpdmUgeyBib3JkZXItY29sb3I6ICcrY29sb3JfZGFya2VyKycgIWltcG9ydGFudDsgYm94LXNoYWRvdzogaW5zZXQgMCAxcHggMTJweCAnK2NvbG9yX2RhcmtlcisnICFpbXBvcnRhbnQ7IH0nO1xuXHRcdH1cblxuXHRcdHJldHVybiBjc3M7XG5cdH1cblx0XG5cdGZ1bmN0aW9uIHVwZGF0ZVNpdGVUaGVtZXMoZGF0YSkge1xuXHRcdCQuZWFjaChkYXRhLCBmdW5jdGlvbihpZCwgdGhlbWUpIHtcblx0XHRcdHZhciBjc3M7XG5cblx0XHRcdC8vIEdlbmVyYXRlIHRoZW1lIGlmIGl0J3MgaW4gdXNlXG5cdFx0XHRpZiAoIHRoZW1lcy5zaXRlID09IGlkICkge1xuXG5cdFx0XHRcdHZhciB0aCA9ICcudGhlbWUtJytpZCxcblx0XHRcdFx0XHRib2R5X3RoID0gJy5ib2R5LXRoZW1lLScraWQsXG5cblx0XHRcdFx0XHRhY2NlbnQgPSB0aGVtZS5hY2NlbnQgfHwgZGVmYXVsdHMuYWNjZW50LFxuXHRcdFx0XHRcdGFjY2VudF9kYXJrZXIgPSB0aW55Y29sb3IoYWNjZW50KS5kYXJrZW4oMTApLnRvU3RyaW5nKCksXG5cdFx0XHRcdFx0Y29sb3JfZm9yX2FjY2VudCA9IHRpbnljb2xvci5tb3N0UmVhZGFibGUoYWNjZW50LCBbJyNmZmYnLCAnIzAwMCddKS50b0hleFN0cmluZygpLFxuXHRcdFx0XHRcdHRleHRzaF9mb3JfYWNjZW50ID0gc2V0X3RleHRzaF9mb3JfYmcoYWNjZW50KSxcblxuXHRcdFx0XHRcdGJnID0gdGhlbWUuYmcgfHwgZGVmYXVsdHMuYmcsXG5cdFx0XHRcdFx0YmdfZGFya2VyID0gdGlueWNvbG9yKGJnKS5kYXJrZW4oMykudG9TdHJpbmcoKSxcblx0XHRcdFx0XHRiZ19saWdodGVyID0gdGlueWNvbG9yKGJnKS5saWdodGVuKDMpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFx0YmdfZGFyayA9IHRoZW1lWydiZy1kYXJrJ10gPT0gJzEnLFxuXG5cdFx0XHRcdFx0Ym9yZGVyID0gdGhlbWUuYm9yZGVyIHx8IGRlZmF1bHRzLmJvcmRlcixcblxuXHRcdFx0XHRcdGNvbG9yID0gdGhlbWUuY29sb3IgfHwgZGVmYXVsdHMuY29sb3IsXG5cdFx0XHRcdFx0Y29sb3JfZmFkZSA9IHRoZW1lWydjb2xvci1mYWRlJ10gfHwgdGlueWNvbG9yKGNvbG9yKS5saWdodGVuKDIwKS50b1N0cmluZygpLFxuXHRcdFx0XHRcdGNvbG9yX2ludiA9IHRoZW1lWydjb2xvci1pbnYnXSB8fCBkZWZhdWx0c1snY29sb3ItaW52J10sXG5cdFx0XHRcdFx0Y29sb3JfaW52X2ZhZGUgPSB0aGVtZVsnY29sb3ItaW52LWZhZGUnXSB8fCB0aW55Y29sb3IoY29sb3JfaW52KS5kYXJrZW4oNDApLnRvU3RyaW5nKCksXG5cblx0XHRcdFx0XHRiZ19hbHQgPSB0aGVtZVsnYmctYWx0J10gfHwgYmdfZGFya2VyLFxuXHRcdFx0XHRcdGNvbG9yX2FsdCA9IHRoZW1lWydjb2xvci1hbHQnXSB8fCB0aW55Y29sb3IubW9zdFJlYWRhYmxlKGJnX2FsdCwgW2NvbG9yLCBjb2xvcl9pbnZdKS50b0hleFN0cmluZygpLFxuXHRcdFx0XHRcdGJvcmRlcl9hbHQgPSB0aGVtZVsnYm9yZGVyLWFsdCddIHx8IGJvcmRlcixcblxuXHRcdFx0XHRcdGJnX2ludiA9IHRoZW1lWydiZy1pbnYnXSB8fCB0aW55Y29sb3IoYmcpLnNwaW4oMTgwKS50b1N0cmluZygpLFxuXHRcdFx0XHRcdGJvcmRlcl9pbnYgPSB0aGVtZVsnYm9yZGVyLWludiddIHx8IHRpbnljb2xvcihiZykuZGFya2VuKDEwKS50b1N0cmluZygpLFxuXG5cdFx0XHRcdFx0YmdfbGlnaHRfY29sb3IsIGJnX2xpZ2h0X2NvbG9yX2ZhZGUsXG5cdFx0XHRcdFx0YmdfZGFya19jb2xvciwgYmdfZGFya19jb2xvcl9mYWRlO1xuXG5cdFx0XHRcdC8vIFNldCBUZXh0IENvbG9ycyBBY2NvcmRpbmcgVG8gVGhlIEJhY2tncm91bmQgQ29sb3JcblxuXHRcdFx0XHRpZiAoIGJnX2RhcmsgKSB7XG5cdFx0XHRcdFx0YmdfbGlnaHRfY29sb3IgPSBjb2xvcl9pbnY7XG5cdFx0XHRcdFx0YmdfbGlnaHRfY29sb3JfZmFkZSA9IGNvbG9yX2ludl9mYWRlO1xuXG5cdFx0XHRcdFx0YmdfZGFya19jb2xvciA9IGNvbG9yO1xuXHRcdFx0XHRcdGJnX2RhcmtfY29sb3JfZmFkZSA9IGNvbG9yX2ZhZGU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YmdfbGlnaHRfY29sb3IgPSBjb2xvcjtcblx0XHRcdFx0XHRiZ19saWdodF9jb2xvcl9mYWRlID0gY29sb3JfZmFkZTtcblxuXHRcdFx0XHRcdGJnX2RhcmtfY29sb3IgPSBjb2xvcl9pbnY7XG5cdFx0XHRcdFx0YmdfZGFya19jb2xvcl9mYWRlID0gY29sb3JfaW52X2ZhZGU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBTVEFSVCBDU1MgUlVMRVNcblxuXHRcdFx0XHQvLyBNYWluIEJhY2tncm91bmQgQ29sb3Jcblx0XHRcdFx0XG5cdFx0XHRcdGNzcyA9IHRoKycgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnKyc7IH0nO1xuXG5cdFx0XHRcdC8vIEhlbHBlciBDbGFzc2VzXG5cdFx0XHRcdFxuXHRcdFx0XHRjc3MgKz0gdGgrJyAudGhlbWUtYmcgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnKyc7IH0nO1xuXG5cdFx0XHRcdGNzcyArPSB0aCsnIC50aGVtZS1jb2xvciB7IGNvbG9yOiAnK2NvbG9yKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAudGhlbWUtY29sb3ItZmFkZSB7IGNvbG9yOiAnK2NvbG9yX2ZhZGUrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC50aGVtZS1jb2xvci1pbnYgeyBjb2xvcjogJytjb2xvcl9pbnYrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC50aGVtZS1jb2xvci1pbnYtZmFkZSB7IGNvbG9yOiAnK2NvbG9yX2ludl9mYWRlKyc7IH0nO1xuXG5cdFx0XHRcdGNzcyArPSB0aCsnIC50aGVtZS1iZy1saWdodC1jb2xvciB7IGNvbG9yOiAnK2JnX2xpZ2h0X2NvbG9yKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAudGhlbWUtYmctbGlnaHQtY29sb3ItZmFkZSB7IGNvbG9yOiAnK2JnX2xpZ2h0X2NvbG9yX2ZhZGUrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC50aGVtZS1iZy1kYXJrLWNvbG9yIHsgY29sb3I6ICcrYmdfZGFya19jb2xvcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLnRoZW1lLWJnLWRhcmstY29sb3ItZmFkZSB7IGNvbG9yOiAnK2JnX2RhcmtfY29sb3JfZmFkZSsnOyB9JztcblxuXHRcdFx0XHRjc3MgKz0gdGgrJyAuYWNjZW50LWNvbG9yIHsgY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAuYWNjZW50LWJnLCAnK3RoKycgLnRoZW1lLXNlY3Rpb24tYWNjZW50IHsgY29sb3I6ICcrY29sb3JfZm9yX2FjY2VudCsnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2FjY2VudCsnOyB9JztcblxuXHRcdFx0XHRjc3MgKz0gdGgrJyAudGhlbWUtYmQgeyBib3JkZXItY29sb3I6ICcrYm9yZGVyKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAudGhlbWUtYWNjZW50LWJkIHsgYm9yZGVyLWNvbG9yOiAnK2FjY2VudCsnOyB9JztcblxuXHRcdFx0XHQvLyBUaGVtZSBTZWN0aW9uIENvbG9yc1xuXHRcdFx0XHRcblx0XHRcdFx0Y3NzICs9IHRoKycgLnRoZW1lLXNlY3Rpb24tbWFpbiB7IGNvbG9yOiAnK2NvbG9yKyc7IGJhY2tncm91bmQtY29sb3I6ICcrYmcrJzsgYm9yZGVyLWNvbG9yOiAnK2JvcmRlcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLnRoZW1lLXNlY3Rpb24tYWx0IHsgY29sb3I6ICcrY29sb3JfYWx0Kyc7IGJvcmRlci1jb2xvcjogJytib3JkZXJfYWx0Kyc7IGJhY2tncm91bmQtY29sb3I6ICcrYmdfYWx0Kyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAudGhlbWUtc2VjdGlvbi1hY2NlbnQgeyBib3JkZXItY29sb3I6ICcrYWNjZW50X2RhcmtlcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLnRoZW1lLXNlY3Rpb24taW52IHsgY29sb3I6ICcrY29sb3JfaW52Kyc7IGJvcmRlci1jb2xvcjogJytib3JkZXJfaW52Kyc7IGJhY2tncm91bmQtY29sb3I6ICcrYmdfaW52Kyc7IH0nO1xuXG5cdFx0XHRcdC8vIFRleHQgQ29sb3JzXG5cdFx0XHRcdFxuXHRcdFx0XHRjc3MgKz0gdGgrJyAjY29udGVudC13cmFwIHsgY29sb3I6ICcrY29sb3IrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIGEsICcrdGgrJyAucG9zdC1tZXRhIGE6aG92ZXIsICcrdGgrJyAjYnJlYWRjcnVtYnMgYTpob3ZlciwgJyt0aCsnIC5wYWdlciBhOmhvdmVyLCAnK3RoKycgLnBhZ2VyIGxpID4gc3BhbiwgJyt0aCsnIC5ob3Zlci1hY2NlbnQtY29sb3I6aG92ZXIgeyBjb2xvcjogJythY2NlbnQrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC5wb3N0LW1ldGEgYSwgJyt0aCsnIC5wb3N0LW1ldGEgPiBzcGFuIHsgY29sb3I6ICcrY29sb3JfZmFkZSsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLmhlYWQtbWVkaWEuYmctbGlnaHQgLmNvbnRhaW5lciwgJyt0aCsnIC5oZWFkLW1lZGlhLmJnLWxpZ2h0IC5tZWRpYS1pbm5lciA+IGEsICcrdGgrJyAuaGVhZC1tZWRpYS5iZy1saWdodCAuaGVhZGVyLXNjcm9sbCwgJyt0aCsnIC5oZWFkLW1lZGlhLmJnLWxpZ2h0ICNicmVhZGNydW1icyA+IGxpICsgbGk6YmVmb3JlIHsgY29sb3I6ICcrYmdfbGlnaHRfY29sb3IrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC5oZWFkLW1lZGlhLmJnLWRhcmsgLmNvbnRhaW5lciwgJyt0aCsnIC5oZWFkLW1lZGlhLmJnLWRhcmsgLm1lZGlhLWlubmVyID4gYSwgJyt0aCsnIC5oZWFkLW1lZGlhLmJnLWRhcmsgLmhlYWRlci1zY3JvbGwsICcrdGgrJyAuaGVhZC1tZWRpYS5iZy1kYXJrICNicmVhZGNydW1icyA+IGxpICsgbGk6YmVmb3JlIHsgY29sb3I6ICcrYmdfZGFya19jb2xvcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLnBvc3QtcmVsYXRlZC5yZWxhdGVkLW1lZGlhIC5yZWxhdGVkLWNvbnRlbnQgeyBjb2xvcjogJytiZ19kYXJrX2NvbG9yKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAubGluay1saXN0IGxpIGEgeyBjb2xvcjogJytjb2xvcl9mYWRlKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAubGluay1saXN0IGxpIGE6aG92ZXIsICcrdGgrJyAubGluay1saXN0IGxpIGE6YWN0aXZlLCAnK3RoKycgLmxpbmstbGlzdCBsaS5hY3RpdmUgPiBhIHsgY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xuXG5cdFx0XHRcdC8vIEJvcmRlciBDb2xvcnNcblx0XHRcdFx0XG5cdFx0XHRcdGNzcyArPSB0aCsnLCAnK3RoKycgI2NvbnRlbnQtd3JhcCwgJyt0aCsnIC5zaWRlYmFyIHVsLCAnK3RoKycgLnBvc3QtZmVhdC5mZWF0LWZvcm1hdCwgJyt0aCsnIC53cC1jYXB0aW9uLCAnK3RoKycgaHIgeyBib3JkZXItY29sb3I6ICcrYm9yZGVyKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAuY29tbWVudC1saXN0IC5ieXBvc3RhdXRob3IgPiAuY29tbWVudC1jb250IHsgYm9yZGVyLWxlZnQtY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xuXG5cblx0XHRcdFx0Ly8gQmFja2dyb3VuZCBDb2xvcnNcblx0XHRcdFx0XG5cdFx0XHRcdGNzcyArPSB0aCsnIC5hY2NlbnQtYmc6aG92ZXIsICcrdGgrJyAuaG92ZXItYWNjZW50LWJnOmhvdmVyLCAnK3RoKycgLnRhZy1saXN0IGE6aG92ZXIsICcrdGgrJyAudGFnY2xvdWQgYTpob3ZlciB7IGNvbG9yOiAnK2NvbG9yX2Zvcl9hY2NlbnQrJyAhaW1wb3J0YW50OyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2FjY2VudCsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLmFydGljbGUgLnBvc3QtaW5mbyAucG9zdC1kYXRlIHsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19kYXJrZXIrJzsgfSc7XG5cblx0XHRcdFx0Ly8gT3RoZXIgQ29sb3JzXG5cdFx0XHRcdFxuXHRcdFx0XHRjc3MgKz0gdGgrJyA6OnNlbGVjdGlvbiB7IG9wYWNpdHk6IDAuODsgYmFja2dyb3VuZDogJythY2NlbnQrJzsgY29sb3I6ICcrY29sb3JfZm9yX2FjY2VudCsnOyB9JztcblxuXHRcdFx0XHRjc3MgKz0gdGgrJyBibG9ja3F1b3RlIHsgYm9yZGVyLWNvbG9yOiAnK2JvcmRlcisnOyBib3JkZXItbGVmdC1jb2xvcjogJythY2NlbnQrJzsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19kYXJrZXIrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIGJsb2NrcXVvdGUgY2l0ZSB7IGNvbG9yOiAnK2NvbG9yX2ZhZGUrJzsgfSc7XG5cblx0XHRcdFx0Y3NzICs9IHRoKycgLnNpZGViYXIgLmNoaWxkLXBhZ2UtbmF2IGxpIGE6aG92ZXIsICcrdGgrJyAud2lkZ2V0LWFyZWEgLm5hdiBsaSBhOmhvdmVyIHsgY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAuc2lkZWJhciAuY2hpbGQtcGFnZS1uYXYgLmN1cnJlbnRfcGFnZV9pdGVtLCAnK3RoKycgLnNpZGViYXIgLmNoaWxkLXBhZ2UtbmF2IC5jdXJyZW50X3BhZ2VfaXRlbTpiZWZvcmUgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2RhcmtlcisnOyB9JztcblxuXHRcdFx0XHQvLyBCb290c3RyYXAgRWxlbWVudHNcblxuXHRcdFx0XHRjc3MgKz0gdGgrJyAuYWxlcnQtZGVmYXVsdCB7IGNvbG9yOiAnK2NvbG9yKyc7IGJvcmRlci1jb2xvcjogJytib3JkZXIrJzsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19kYXJrZXIrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC5hbGVydC1kZWZhdWx0IGEgeyBjb2xvcjogJythY2NlbnQrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC5wYW5lbCB7IGJvcmRlci1jb2xvcjogJytib3JkZXIrJzsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19saWdodGVyKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAud2VsbCB7IGJvcmRlci1jb2xvcjogJytib3JkZXIrJzsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19kYXJrZXIrJzsgfSc7XG5cblx0XHRcdFx0Ly8gQmFja2dyb3VuZCBWYXJpYW50c1xuXHRcdFx0XHRcblx0XHRcdFx0Y3NzICs9IHRoKycgLmJnLWxpZ2h0IHsgY29sb3I6ICcrYmdfbGlnaHRfY29sb3IrJzsgfSAnK3RoKycgLmJnLWxpZ2h0IC50ZXh0LWZhZGUgeyBjb2xvcjogJytiZ19saWdodF9jb2xvcl9mYWRlKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAuYmctZGFyayB7IGNvbG9yOiAnK2JnX2RhcmtfY29sb3IrJzsgfSAnK3RoKycgLmJnLWRhcmsgLnRleHQtZmFkZSB7IGNvbG9yOiAnK2JnX2RhcmtfY29sb3JfZmFkZSsnOyB9JztcblxuXHRcdFx0XHQvLyBJbnB1dHNcblx0XHRcdFx0XG5cdFx0XHRcdGNzcyArPSB0aCsnIGlucHV0Om5vdChbdHlwZT1zdWJtaXRdKTpub3QoW3R5cGU9YnV0dG9uXSk6bm90KC5idG4pLCAnK3RoKycgc2VsZWN0LCAnK3RoKycgdGV4dGFyZWEsICcrdGgrJyAuZm9ybS1jb250cm9sLCAnICtcblx0XHRcdFx0XHQgICB0aCsnIC5wb3N0LXBhc3N3b3JkLWZvcm0gaW5wdXRbdHlwZT1cInBhc3N3b3JkXCJdLCAnK3RoKycgLndvb2NvbW1lcmNlIC5pbnB1dC10ZXh0IHsgY29sb3I6ICcrY29sb3IrJzsgYm9yZGVyLWNvbG9yOiAnK2JvcmRlcisnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2RhcmtlcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgaW5wdXQ6bm90KFt0eXBlPXN1Ym1pdF0pOm5vdChbdHlwZT1idXR0b25dKTpub3QoLmJ0bik6Zm9jdXMsICcrdGgrJyBzZWxlY3Q6Zm9jdXMsICcrdGgrJyB0ZXh0YXJlYTpmb2N1cywgJyt0aCsnIC5mb3JtLWNvbnRyb2w6Zm9jdXMsICcgK1xuXHRcdFx0XHRcdCAgIHRoKycgLnBvc3QtcGFzc3dvcmQtZm9ybSBpbnB1dFt0eXBlPVwicGFzc3dvcmRcIl06Zm9jdXMsICcrdGgrJyAud29vY29tbWVyY2UgLmlucHV0LXRleHQ6Zm9jdXMgeyBib3JkZXItY29sb3I6ICcrdGlueWNvbG9yKGJvcmRlcikubGlnaHRlbigyKS50b1N0cmluZygpKyc7IGJhY2tncm91bmQtY29sb3I6ICcrdGlueWNvbG9yKGJnKS5saWdodGVuKDIpLnRvU3RyaW5nKCkrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIGlucHV0Ojotd2Via2l0LWlucHV0LXBsYWNlaG9sZGVyLCAnK3RoKycgLmZvcm0tY29udHJvbDo6LXdlYmtpdC1pbnB1dC1wbGFjZWhvbGRlciB7IGNvbG9yOiAnK2NvbG9yX2ZhZGUrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIGlucHV0OjotbW96LXBsYWNlaG9sZGVyLCAnK3RoKycgLmZvcm0tY29udHJvbDo6LW1vei1wbGFjZWhvbGRlciB7IGNvbG9yOiAnK2NvbG9yX2ZhZGUrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIGlucHV0Oi1tcy1pbnB1dC1wbGFjZWhvbGRlciwgJyt0aCsnIC5mb3JtLWNvbnRyb2w6LW1zLWlucHV0LXBsYWNlaG9sZGVyIHsgY29sb3I6ICcrY29sb3JfZmFkZSsnOyB9Jztcblx0XHRcdFx0aWYgKCBiZ19kYXJrICkge1xuXHRcdFx0XHRcdGNzcyArPSB0aCsnIHNlbGVjdCwgLm1peHQgJyt0aCsnIC5zZWxlY3QyLWNvbnRhaW5lciAuc2VsZWN0Mi1hcnJvdyBiOmFmdGVyIHsgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiJyttaXh0X2N1c3RvbWl6ZVsnbWl4dC11cmknXSsnL2Fzc2V0cy9pbWcvaWNvbnMvc2VsZWN0LWFycm93LWxpZ2h0LnBuZ1wiKTsgfSc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBCdXR0b25zXG5cdFx0XHRcdFxuXHRcdFx0XHRjc3MgKz0gYnV0dG9uX2NvbG9yKFsncHJpbWFyeScsICdhY2NlbnQnXSwgYWNjZW50LCB0aCk7XG5cdFx0XHRcdGNzcyArPSBidXR0b25fY29sb3IoJ21pbmltYWwnLCBiZ19kYXJrZXIsIHRoKTtcblxuXHRcdFx0XHQvLyBFbGVtZW50IENvbG9yc1xuXHRcdFx0XHRcblx0XHRcdFx0Y3NzICs9IHRoKycgLm1peHQtc3RhdC50eXBlLWJveCwgJyt0aCsnIC5taXh0LWhlYWRsaW5lIHNwYW4uY29sb3ItYXV0bzphZnRlciwgJyt0aCsnIC5taXh0LXRpbWVsaW5lIC50aW1lbGluZS1ibG9jazpiZWZvcmUgeyBib3JkZXItY29sb3I6ICcrYm9yZGVyKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAubWl4dC1yb3ctc2VwYXJhdG9yLm5vLWZpbGwgc3ZnIHsgZmlsbDogJytiZysnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLm1peHQtbWFwIHsgY29sb3I6ICcrYmdfbGlnaHRfY29sb3IrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC5taXh0LWZsaXBjYXJkID4gLmlubmVyID4gLmFjY2VudCB7IGNvbG9yOiAnK2NvbG9yX2Zvcl9hY2NlbnQrJzsgYmFja2dyb3VuZC1jb2xvcjogJythY2NlbnQrJzsgYm9yZGVyLWNvbG9yOiAnK2FjY2VudF9kYXJrZXIrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC5taXh0LXByaWNpbmcuYWNjZW50IC5taXh0LXByaWNpbmctaW5uZXIgLmhlYWRlciB7IGNvbG9yOiAnK2NvbG9yX2Zvcl9hY2NlbnQrJzsgYmFja2dyb3VuZC1jb2xvcjogJythY2NlbnQrJzsgYm94LXNoYWRvdzogMCAwIDAgMXB4ICcrYWNjZW50X2RhcmtlcisnOyB0ZXh0LXNoYWRvdzogMCAxcHggMXB4ICcrdGV4dHNoX2Zvcl9hY2NlbnQrJzsgfSc7XG5cdFx0XHRcdC8vIEFjY2VudCBDb2xvciBWYXJpYW50c1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAubWl4dC1pY29uIGkuYWNjZW50LCAnK3RoKycgLm1peHQtc3RhdC5jb2xvci1vdXRsaW5lLmFjY2VudCB7IGNvbG9yOiAnK2FjY2VudCsnOyB9Jztcblx0XHRcdFx0Ly8gQWNjZW50IEJvcmRlciBWYXJpYW50c1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAubWl4dC1pY29uLmljb24tb3V0bGluZS5hY2NlbnQsICcgK1xuXHRcdFx0XHRcdCAgIHRoKycgLm1peHQtc3RhdC5jb2xvci1vdXRsaW5lLmFjY2VudCwgJyArXG5cdFx0XHRcdFx0ICAgdGgrJyAubWl4dC1pY29uYm94IC5pbm5lci5ib3JkZXJlZC5hY2NlbnQsICcgK1xuXHRcdFx0XHRcdCAgIHRoKycgLm1peHQtaW1hZ2UgLmltYWdlLXdyYXAuYWNjZW50IHsgYm9yZGVyLWNvbG9yOiAnK2FjY2VudCsnOyB9Jztcblx0XHRcdFx0Ly8gQWNjZW50IEJnIFZhcmlhbnRzXG5cdFx0XHRcdGNzcyArPSB0aCsnIC5taXh0LXN0YXQuY29sb3ItYmcuYWNjZW50LCAnICtcblx0XHRcdFx0XHQgICB0aCsnIC5taXh0LWljb24uaWNvbi1zb2xpZC5hY2NlbnQsICcgK1xuXHRcdFx0XHRcdCAgIHRoKycgLm1peHQtaWNvbmJveCAuaW5uZXIuc29saWQuYWNjZW50LCAnICtcblx0XHRcdFx0XHQgICB0aCsnIC5taXh0LXJldmlldy5ib3hlZC5hY2NlbnQsICcgK1xuXHRcdFx0XHRcdCAgIHRoKycgLm1peHQtcmV2aWV3LmJ1YmJsZSAucmV2aWV3LWNvbnRlbnQuYWNjZW50LCAnICtcblx0XHRcdFx0XHQgICB0aCsnIC5taXh0LXJldmlldy5idWJibGUgLnJldmlldy1jb250ZW50LmFjY2VudDpiZWZvcmUsICcgK1xuXHRcdFx0XHRcdCAgIHRoKycgLm1peHQtdGltZWxpbmUgLnRpbWVsaW5lLWJsb2NrIC5jb250ZW50LmJveGVkLmFjY2VudCwgJyArXG5cdFx0XHRcdFx0ICAgdGgrJyAubWl4dC10aW1lbGluZSAudGltZWxpbmUtYmxvY2sgLmNvbnRlbnQuYnViYmxlLmFjY2VudCwgJyArXG5cdFx0XHRcdFx0ICAgdGgrJyAubWl4dC10aW1lbGluZSAudGltZWxpbmUtYmxvY2sgLmNvbnRlbnQuYnViYmxlLmFjY2VudDpiZWZvcmUsICcgK1xuXHRcdFx0XHRcdCAgIHRoKycgLmhvdmVyLWNvbnRlbnQgLm9uLWhvdmVyLmFjY2VudCB7IGNvbG9yOiAnK2NvbG9yX2Zvcl9hY2NlbnQrJzsgYm9yZGVyLWNvbG9yOiAnK2FjY2VudF9kYXJrZXIrJzsgYmFja2dyb3VuZC1jb2xvcjogJythY2NlbnQrJzsgdGV4dC1zaGFkb3c6IDAgMXB4IDFweCAnK3RleHRzaF9mb3JfYWNjZW50Kyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAubWl4dC1pY29uLmljb24tc29saWQuYWNjZW50LmFuaW0taW52ZXJ0OmhvdmVyLCAnK3RoKycgLmljb24tY29udDpob3ZlciAubWl4dC1pY29uLmljb24tc29saWQuYWNjZW50LmFuaW0taW52ZXJ0IHsgY29sb3I6ICcrYWNjZW50Kyc7IGJvcmRlci1jb2xvcjogJythY2NlbnRfZGFya2VyKyc7IGJhY2tncm91bmQtY29sb3I6ICcrY29sb3JfZm9yX2FjY2VudCsnOyB0ZXh0LXNoYWRvdzogMCAxcHggMXB4ICcrc2V0X3RleHRzaF9mb3JfYmcoY29sb3JfZm9yX2FjY2VudCkrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC5ob3Zlci1jb250ZW50IC5vbi1ob3Zlci5hY2NlbnQgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK3Rpbnljb2xvcihhY2NlbnQpLnNldEFscGhhKDAuNzUpLnRvUGVyY2VudGFnZVJnYlN0cmluZygpKyc7IH0nO1xuXG5cdFx0XHRcdC8vIFBsdWdpbiBDb2xvcnNcblxuXHRcdFx0XHQvLyBMaWdodFNsaWRlclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAubFNTbGlkZU91dGVyIC5sU1BhZ2VyLmxTcGcgPiBsaSBhIHsgYmFja2dyb3VuZC1jb2xvcjogJytjb2xvcl9mYWRlKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAubFNTbGlkZU91dGVyIC5sU1BhZ2VyLmxTcGcgPiBsaTpob3ZlciBhLCAnK3RoKycgLmxTU2xpZGVPdXRlciAubFNQYWdlci5sU3BnID4gbGkuYWN0aXZlIGEgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2FjY2VudCsnOyB9JztcblxuXHRcdFx0XHQvLyBMaWdodEdhbGxlcnlcblx0XHRcdFx0Y3NzICs9IGJvZHlfdGgrJyAubGctb3V0ZXIgLmxnLXRodW1iLWl0ZW0uYWN0aXZlLCAnK2JvZHlfdGgrJyAubGctb3V0ZXIgLmxnLXRodW1iLWl0ZW06aG92ZXIgeyBib3JkZXItY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gYm9keV90aCsnIC5sZy1wcm9ncmVzcy1iYXIgLmxnLXByb2dyZXNzIHsgYmFja2dyb3VuZC1jb2xvcjogJythY2NlbnQrJzsgfSc7XG5cblx0XHRcdFx0Ly8gU2VsZWN0MlxuXHRcdFx0XHRjc3MgKz0gYm9keV90aCsnIC5zZWxlY3QyLWNvbnRhaW5lciBhLnNlbGVjdDItY2hvaWNlLCAnK2JvZHlfdGgrJyAuc2VsZWN0Mi1kcm9wLCAnK2JvZHlfdGgrJyAuc2VsZWN0Mi1kcm9wLnNlbGVjdDItZHJvcC1hY3RpdmUgeyBjb2xvcjogJytjb2xvcisnOyBib3JkZXItY29sb3I6ICcrYm9yZGVyKyc7IGJhY2tncm91bmQtY29sb3I6ICcrYmdfZGFya2VyKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gYm9keV90aCsnIC5zZWxlY3QyLXJlc3VsdHMgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2RhcmtlcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IGJvZHlfdGgrJyAuc2VsZWN0Mi1yZXN1bHRzIC5zZWxlY3QyLWhpZ2hsaWdodGVkIHsgY29sb3I6ICcrY29sb3IrJzsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19saWdodGVyKyc7IH0nO1xuXG5cdFx0XHRcdC8vIFZpc3VhbCBDb21wb3NlclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAud3BiX2NvbnRlbnRfZWxlbWVudCAud3BiX3RvdXJfdGFic193cmFwcGVyIC53cGJfdGFic19uYXYgYTpob3ZlciwgJyt0aCsnIC53cGJfY29udGVudF9lbGVtZW50IC53cGJfYWNjb3JkaW9uX2hlYWRlciBhOmhvdmVyIHsgY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAudmNfc2VwYXJhdG9yLnRoZW1lLWJkIC52Y19zZXBfaG9sZGVyIC52Y19zZXBfbGluZSB7IGJvcmRlci1jb2xvcjogJytib3JkZXIrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC5taXh0LWdyaWQtaXRlbSAuZ2l0ZW0tdGl0bGUtY29udCB7IGNvbG9yOiAnK2NvbG9yKyc7IGJhY2tncm91bmQtY29sb3I6ICcrYmdfbGlnaHRlcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLnZjX3R0YS52Y190dGEtc3R5bGUtY2xhc3NpYzpub3QoLnZjX3R0YS1vLW5vLWZpbGwpIC52Y190dGEtcGFuZWwtYm9keSwgJyt0aCsnIC52Y190dGEudmNfdHRhLXN0eWxlLW1vZGVybjpub3QoLnZjX3R0YS1vLW5vLWZpbGwpIC52Y190dGEtcGFuZWwtYm9keSB7IGNvbG9yOiAnK2JnX2xpZ2h0X2NvbG9yKyc7IH0nO1xuXG5cdFx0XHRcdC8vIFdvb0NvbW1lcmNlXG5cdFx0XHRcdGNzcyArPSB0aCsnIC53b29jb21tZXJjZSAucHJpY2UgLmFtb3VudCwgJyt0aCsnIC53b29jb21tZXJjZSAudG90YWwgLmFtb3VudCwgJyt0aCsnIC53b29jb21tZXJjZSAud29vLWNhcnQgLmFtb3VudCwgJyt0aCsnIC53b29jb21tZXJjZSAubmF2IGxpIC5hbW91bnQgeyBjb2xvcjogJythY2NlbnQrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC53b29jb21tZXJjZSAubmF2IGxpIGRlbCAuYW1vdW50LCAnK3RoKycgLndvb2NvbW1lcmNlICNyZXZpZXdzICNjb21tZW50cyBvbC5jb21tZW50bGlzdCBsaSAubWV0YSB7IGNvbG9yOiAnK2NvbG9yX2ZhZGUrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC53b29jb21tZXJjZSAud2lkZ2V0X3ByaWNlX2ZpbHRlciAudWktc2xpZGVyIC51aS1zbGlkZXItcmFuZ2UgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2FjY2VudCsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLndvb2NvbW1lcmNlIC5iYWRnZS1jb250IC5iYWRnZS5zYWxlLWJhZGdlIHsgY29sb3I6ICcrY29sb3JfZm9yX2FjY2VudCsnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2FjY2VudCsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLndvb2NvbW1lcmNlIC53b29jb21tZXJjZS10YWJzIHVsLnRhYnMgbGkgYSB7IGNvbG9yOiAnK2NvbG9yX2ZhZGUrJyAhaW1wb3J0YW50OyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLndvb2NvbW1lcmNlIC53b29jb21tZXJjZS10YWJzIHVsLnRhYnMgbGkuYWN0aXZlIHsgYm9yZGVyLWJvdHRvbS1jb2xvcjogJytiZysnICFpbXBvcnRhbnQ7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAud29vY29tbWVyY2UgLndvb2NvbW1lcmNlLXRhYnMgdWwudGFicyBsaS5hY3RpdmUgYSB7IGNvbG9yOiAnK2NvbG9yKycgIWltcG9ydGFudDsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC53b29jb21tZXJjZSAud29vY29tbWVyY2UtdGFicyB1bC50YWJzIGxpLmFjdGl2ZSwgJyt0aCsnIC53b29jb21tZXJjZSAud29vY29tbWVyY2UtdGFicyAud2MtdGFiIHsgY29sb3I6ICcrY29sb3IrJyAhaW1wb3J0YW50OyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnKycgIWltcG9ydGFudDsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC53b29jb21tZXJjZSB0YWJsZS5zaG9wX3RhYmxlLCAnK3RoKycgLndvb2NvbW1lcmNlIHRhYmxlLnNob3BfdGFibGUgdGgsICcrdGgrJyAud29vY29tbWVyY2UgdGFibGUuc2hvcF90YWJsZSB0ZCwgJyArXG5cdFx0XHRcdFx0ICAgdGgrJyAud29vY29tbWVyY2UgLmNhcnQtY29sbGF0ZXJhbHMgLmNhcnRfdG90YWxzIHRyIHRkLCAnK3RoKycgLndvb2NvbW1lcmNlIC5jYXJ0LWNvbGxhdGVyYWxzIC5jYXJ0X3RvdGFscyB0ciB0aCB7IGJvcmRlci1jb2xvcjogJytib3JkZXIrJyAhaW1wb3J0YW50OyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLndvb2NvbW1lcmNlLWNoZWNrb3V0ICNwYXltZW50LCAnICtcblx0XHRcdFx0XHQgICB0aCsnIC53b29jb21tZXJjZSBmb3JtIC5mb3JtLXJvdy53b29jb21tZXJjZS12YWxpZGF0ZWQgLnNlbGVjdDItY2hvaWNlLCAnK3RoKycgLndvb2NvbW1lcmNlIGZvcm0gLmZvcm0tcm93Lndvb2NvbW1lcmNlLXZhbGlkYXRlZCBpbnB1dC5pbnB1dC10ZXh0LCAnK3RoKycgLndvb2NvbW1lcmNlIGZvcm0gLmZvcm0tcm93Lndvb2NvbW1lcmNlLXZhbGlkYXRlZCBzZWxlY3QsICcgK1xuXHRcdFx0XHRcdCAgIHRoKycgLndvb2NvbW1lcmNlIGZvcm0gLmZvcm0tcm93Lndvb2NvbW1lcmNlLWludmFsaWQgLnNlbGVjdDItY2hvaWNlLCAnK3RoKycgLndvb2NvbW1lcmNlIGZvcm0gLmZvcm0tcm93Lndvb2NvbW1lcmNlLWludmFsaWQgaW5wdXQuaW5wdXQtdGV4dCwgJyt0aCsnIC53b29jb21tZXJjZSBmb3JtIC5mb3JtLXJvdy53b29jb21tZXJjZS1pbnZhbGlkIHNlbGVjdCB7IGJvcmRlci1jb2xvcjogJytib3JkZXIrJzsgfSc7XG5cblx0XHRcdFx0TUlYVC5zdHlsZXNoZWV0KCdzaXRlLXRoZW1lLScraWQsIGNzcyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2l0ZS10aGVtZXNdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0dXBkYXRlU2l0ZVRoZW1lcyh0byk7XG5cdFx0fSk7XG5cdH0pO1xuXG5cdC8vIEdlbmVyYXRlIGN1c3RvbSB0aGVtZXMgaWYgdGhlbWUgaXMgY2hhbmdlZCBmcm9tIG9uZSBvZiB0aGUgZGVmYXVsdHNcblx0ZnVuY3Rpb24gbWF5YmVVcGRhdGVTaXRlVGhlbWVzKGlkKSB7XG5cdFx0aWYgKCBpZCA9PSAnYXV0bycgKSBpZCA9IHRoZW1lcy5zaXRlO1xuXHRcdGlmICggISBfLmhhcyhtaXh0X2N1c3RvbWl6ZS50aGVtZXMsIGlkKSApIHtcblx0XHRcdHZhciBzaXRlVGhlbWVzID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtzaXRlLXRoZW1lc10nKS5nZXQoKTtcblx0XHRcdHVwZGF0ZVNpdGVUaGVtZXMoc2l0ZVRoZW1lcyk7XG5cdFx0fVxuXHR9XG5cdCQoJyNtYWluLXdyYXAtaW5uZXInKS5vbigndGhlbWUtY2hhbmdlJywgZnVuY3Rpb24oZXZlbnQsIHRoZW1lKSB7XG5cdFx0bWF5YmVVcGRhdGVTaXRlVGhlbWVzKHRoZW1lKTtcblx0fSk7XG5cdCQoJyNjb2xvcGhvbicpLm9uKCd0aGVtZS1jaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgdGhlbWUpIHtcblx0XHRtYXliZVVwZGF0ZVNpdGVUaGVtZXModGhlbWUpO1xuXHR9KTtcblxufSkoalF1ZXJ5KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=