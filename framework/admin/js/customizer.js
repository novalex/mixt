
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
	wp.customize('mixt_opt[footer-code]', function( value ) {
		var date = new Date(),
			year = date.getFullYear();
		value.bind( function(to) {
			to = to.replace(/\{\{year\}\}/g, year);
			$('#colophon .site-info').html(to);
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
			if ( shrink != '0' ) {
				shrink_width  = width - shrink;
				css += '.fixed-nav .navbar-mixt #nav-logo img { max-width: '+shrink_width+'px; }';
			}

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
	site: false,
	nav: false,
	secNav: false,
	footer: false,
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

				main_navbar += '.navbar';

				css += '@media ( max-width: '+mixt_customize.breakpoints.mars+'px ) {';
					css += main_navbar+' .navbar-inner { background-color: '+menu_bg+'; '+menu_bg_rgba+' }';
					css += main_navbar+' .navbar-inner .text-cont, '+main_navbar+' .navbar-inner .text-cont a:hover, '+main_navbar+' .navbar-inner .text-cont a.no-color, '+main_navbar+' .nav > li > a { color: '+menu_color+'; }';
					css += main_navbar+' .nav > li > a:hover, '+main_navbar+' .nav > li > a:hover:focus, '+main_navbar+' .nav > li:hover > a:hover, ';
					css += main_navbar+' .nav > li.hover > a:hover, '+main_navbar+' .nav > li.active > a:hover { color: '+menu_hover_color+'; background-color: '+menu_bg_hover+'; }';
					css += main_navbar+' .nav > li:hover > a, '+main_navbar+' .nav > li.hover > a { color: '+menu_color+'; }';
					css += main_navbar+' .nav li.nav-search:hover > a, '+main_navbar+' .nav li.nav-search.hover > a { color: '+menu_color+' !important; background-color: transparent !important; }';
					css += main_navbar+' .nav > li.active > a, '+main_navbar+' .navbar-inner .text-cont a { color: '+menu_accent+'; }';
					if ( has_inv_accent ) {
						css += main_navbar+' .nav > .active > a:before { background-color: '+menu_accent+'; }';
					}
					css += main_navbar+' .navbar-inner, '+main_navbar+' .nav > li, '+main_navbar+' .nav > li > a { border-color: '+menu_border+'; '+menu_border_rgba+' }';
				css += '}';

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
				css += th+' .post-related .related-title { color: '+bg_dark_color+'; }';
				css += th+' .link-list li a { color: '+color_fade+'; }';
				css += th+' .link-list li a:hover, '+th+' .link-list li a:active, '+th+' .link-list li.active > a { color: '+accent+'; }';

				// Border Colors
				
				css += th+', '+th+' #content-wrap, '+th+' .sidebar ul, '+th+' .post-feat.feat-format, '+th+' .wp-caption, '+th+' hr { border-color: '+border+'; }';
				css += th+' .comment-list li.bypostauthor { border-left-color: '+accent+'; }';


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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvb3Rlci5qcyIsImdsb2JhbC5qcyIsImhlYWRlci5qcyIsImxvZ28uanMiLCJuYXZiYXJzLmpzIiwidGhlbWVzLmpzIiwidGhlbWVzLm5hdi5qcyIsInRoZW1lcy5zaXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImN1c3RvbWl6ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXG5DVVNUT01JWkVSIElOVEVHUkFUSU9OIC0gRk9PVEVSXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4oIGZ1bmN0aW9uKCQpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0LyogZ2xvYmFsIHdwICovXG5cblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtmb290ZXItd2lkZ2V0cy1iZy1jb2xvcl0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHQkKCcjY29sb3Bob24gLndpZGdldC1yb3cnKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCB0byk7XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2Zvb3Rlci13aWRnZXRzLWJnLXBhdF0nLCBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdGlmICggdG8gPT0gJzAnICkge1xuXHRcdFx0XHQkKCcjY29sb3Bob24gLndpZGdldC1yb3cnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAnbm9uZScpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCgnI2NvbG9waG9uIC53aWRnZXQtcm93JykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybChcIicgKyB0byArICdcIiknKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbZm9vdGVyLXdpZGdldHMtdGV4dC1jb2xvcl0nLCBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdCQoJyNjb2xvcGhvbiAud2lkZ2V0LXJvdycpLmNzcygnY29sb3InLCB0byk7XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2Zvb3Rlci13aWRnZXRzLWJvcmRlci1jb2xvcl0nLCBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdCQoJyNjb2xvcGhvbiAud2lkZ2V0LXJvdycpLmNzcygnYm9yZGVyLWNvbG9yJywgdG8pO1xuXHRcdH0pO1xuXHR9KTtcblxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2Zvb3Rlci1jb3B5LWJnLWNvbG9yXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdCQoJyNjb2xvcGhvbiAuY29weXJpZ2h0LXJvdycpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsIHRvKTtcblx0XHR9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbZm9vdGVyLWNvcHktYmctcGF0XScsIGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0aWYgKCB0byA9PSAnMCcgKSB7XG5cdFx0XHRcdCQoJyNjb2xvcGhvbiAuY29weXJpZ2h0LXJvdycpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICdub25lJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCcjY29sb3Bob24gLmNvcHlyaWdodC1yb3cnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKFwiJyArIHRvICsgJ1wiKScpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtmb290ZXItY29weS10ZXh0LWNvbG9yXScsIGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0JCgnI2NvbG9waG9uIC5jb3B5cmlnaHQtcm93JykuY3NzKCdjb2xvcicsIHRvKTtcblx0XHR9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbZm9vdGVyLWNvcHktYm9yZGVyLWNvbG9yXScsIGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0JCgnI2NvbG9waG9uIC5jb3B5cmlnaHQtcm93JykuY3NzKCdib3JkZXItY29sb3InLCB0byk7XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2Zvb3Rlci1jb2RlXScsIGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHR2YXIgZGF0ZSA9IG5ldyBEYXRlKCksXG5cdFx0XHR5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHR0byA9IHRvLnJlcGxhY2UoL1xce1xce3llYXJcXH1cXH0vZywgeWVhcik7XG5cdFx0XHQkKCcjY29sb3Bob24gLnNpdGUtaW5mbycpLmh0bWwodG8pO1xuXHRcdH0pO1xuXHR9KTtcblxufSkoalF1ZXJ5KTsiLCJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXG5DVVNUT01JWkVSIElOVEVHUkFUSU9OIC0gR0xPQkFMXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbndpbmRvdy5NSVhUID0ge1xuXHRzdHlsZXNoZWV0OiBmdW5jdGlvbihpZCwgY3NzKSB7XG5cdFx0Y3NzID0gY3NzIHx8IGZhbHNlO1xuXHRcdHZhciBzaGVldCA9IGpRdWVyeSgnc3R5bGVbZGF0YS1pZD1cIicraWQrJ1wiXScpO1xuXHRcdGlmICggc2hlZXQubGVuZ3RoID09PSAwICkgc2hlZXQgPSBqUXVlcnkoJzxzdHlsZSBkYXRhLWlkPVwiJytpZCsnXCI+JykuYXBwZW5kVG8oalF1ZXJ5KCdoZWFkJykpO1xuXHRcdGlmICggY3NzICkge1xuXHRcdFx0c2hlZXQuaHRtbChjc3MpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gc2hlZXQ7XG5cdFx0fVxuXHR9XG59O1xuXG4oIGZ1bmN0aW9uKCQpIHtcblxuXHQvKiBnbG9iYWwgXywgd3AgKi9cblxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3NpdGUtYmctY29sb3JdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0JCgnYm9keScpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsIHRvKTtcblx0XHR9KTtcblx0fSk7XG5cblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtzaXRlLWJnLXBhdF0nLCBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdGlmICggdG8gPT0gJzAnICkge1xuXHRcdFx0XHQkKCdib2R5JykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ25vbmUnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJ2JvZHknKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKFwiJyArIHRvICsgJ1wiKScpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblxuXHQvLyBQYWdlIExvYWRlclxuXHRcblx0dmFyIHBhZ2VMb2FkZXIgPSB7XG5cdFx0bG9hZGVyOiAnJyxcblx0XHRsb2FkSW5uZXI6ICcnLFxuXHRcdGVuYWJsZWQ6IGZhbHNlLFxuXHRcdHR5cGU6IDEsXG5cdFx0c2hhcGU6ICdyaW5nJyxcblx0XHRjb2xvcjogJyMwMDAnLFxuXHRcdGltZzogJycsXG5cdFx0YW5pbTogJ2JvdW5jZScsXG5cdFx0c2V0dXA6IGZhbHNlLFxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAhIHRoaXMuc2V0dXAgKSB0aGlzLnNldE9wdGlvbnMoKTtcblx0XHRcdCQoJ2JvZHknKS5hZGRDbGFzcygnbG9hZGluZycpO1xuXHRcdFx0aWYgKCAkKCcjbG9hZC1vdmVybGF5JykubGVuZ3RoID09PSAwICkgJCgnYm9keScpLmFwcGVuZCgnPGRpdiBpZD1cImxvYWQtb3ZlcmxheVwiPjxkaXYgY2xhc3M9XCJsb2FkLWlubmVyXCI+PC9kaXY+PC9kaXY+Jyk7XG5cdFx0XHR0aGlzLmxvYWRlciA9ICQoJyNsb2FkLW92ZXJsYXknKTtcblx0XHRcdHRoaXMubG9hZGVyLmZpbmQoJy5sb2FkZXInKS5zaG93KCk7XG5cdFx0XHR0aGlzLmxvYWRJbm5lciA9IHRoaXMubG9hZGVyLmNoaWxkcmVuKCcubG9hZC1pbm5lcicpO1xuXHRcdFx0dGhpcy5sb2FkU2hhcGUoKTtcblx0XHRcdGlmICggJCgnI2xvYWRlci1jbG9zZScpLmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdFx0dGhpcy5sb2FkZXIuYXBwZW5kKCc8YnV0dG9uIGlkPVwibG9hZGVyLWNsb3NlXCIgY2xhc3M9XCJidG4gYnRuLXJlZCBidG4tbGdcIiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiAyMHB4OyByaWdodDogMjBweDtcIj4mdGltZXM7PC9idXR0b24+Jyk7XG5cdFx0XHR9XG5cdFx0XHQkKCcjbG9hZGVyLWNsb3NlJykuY2xpY2soIGZ1bmN0aW9uKCkgeyAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTsgfSk7XG5cdFx0fSxcblx0XHRzZXRPcHRpb25zOiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuZW5hYmxlZCA9IHdwLmN1c3RvbWl6ZS5fdmFsdWVbJ21peHRfb3B0W3BhZ2UtbG9hZGVyXSddLmdldCgpID09ICcxJztcblx0XHRcdHRoaXMudHlwZSA9IHdwLmN1c3RvbWl6ZS5fdmFsdWVbJ21peHRfb3B0W3BhZ2UtbG9hZGVyLXR5cGVdJ10uZ2V0KCk7XG5cdFx0XHR0aGlzLnNoYXBlID0gd3AuY3VzdG9taXplLl92YWx1ZVsnbWl4dF9vcHRbcGFnZS1sb2FkZXItc2hhcGVdJ10uZ2V0KCk7XG5cdFx0XHR0aGlzLmNvbG9yID0gd3AuY3VzdG9taXplLl92YWx1ZVsnbWl4dF9vcHRbcGFnZS1sb2FkZXItY29sb3JdJ10uZ2V0KCk7XG5cdFx0XHR0aGlzLmltZyA9IHdwLmN1c3RvbWl6ZS5fdmFsdWVbJ21peHRfb3B0W3BhZ2UtbG9hZGVyLWltZ10nXS5nZXQoKTtcblx0XHRcdHRoaXMuYW5pbSA9IHdwLmN1c3RvbWl6ZS5fdmFsdWVbJ21peHRfb3B0W3BhZ2UtbG9hZGVyLWFuaW1dJ10uZ2V0KCk7XG5cdFx0XHR0aGlzLnNldHVwID0gdHJ1ZTtcblx0XHR9LFxuXHRcdGxvYWRTaGFwZTogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgY2xhc3NlcyA9ICdsb2FkZXInLFxuXHRcdFx0XHRsb2FkZXIgID0gJyc7XG5cdFx0XHRpZiAoIHRoaXMuYW5pbSAhPSAnbm9uZScgKSBjbGFzc2VzICs9ICcgYW5pbWF0ZWQgaW5maW5pdGUgJyArIHRoaXMuYW5pbTtcblx0XHRcdGlmICggdGhpcy50eXBlID09IDEgKSB7XG5cdFx0XHRcdGxvYWRlciA9ICc8ZGl2IGNsYXNzPVwiJyArIGNsYXNzZXMgKyAnICcgKyB0aGlzLnNoYXBlICsgJ1wiPjwvZGl2Pic7XG5cdFx0XHR9IGVsc2UgaWYgKCAhIF8uaXNFbXB0eSh0aGlzLmltZy51cmwpICkge1xuXHRcdFx0XHRsb2FkZXIgPSAnPGltZyBzcmM9XCInICsgdGhpcy5pbWcudXJsICsgJ1wiIGFsdD1cIkxvYWRpbmcuLi5cIiBjbGFzcz1cIicgKyBjbGFzc2VzICsgJ1wiPic7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsb2FkZXIgPSAnPGRpdiBjbGFzcz1cInJpbmcgJyArIGNsYXNzZXMgKyAnXCI+PC9kaXY+Jztcblx0XHRcdH1cblx0XHRcdHRoaXMubG9hZElubmVyLmh0bWwobG9hZGVyKTtcblx0XHR9LFxuXHRcdGhhbmRsZTogZnVuY3Rpb24odmFsdWUsIHR5cGUpIHtcblx0XHRcdGlmICggdHlwZSAhPSAnc3dpdGNoJyB8fCB2YWx1ZSA9PSAnMScgKSB0aGlzLmluaXQoKTtcblx0XHRcdGlmICggdHlwZSA9PSAnc3dpdGNoJyApIHtcblx0XHRcdFx0aWYgKCB2YWx1ZSA9PSAnMCcgKSB7XG5cdFx0XHRcdFx0dGhpcy5lbmFibGVkID0gZmFsc2U7XG5cdFx0XHRcdFx0JCgnYm9keScpLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5lbmFibGVkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICggdGhpcy5lbmFibGVkICkge1xuXHRcdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0XHRjYXNlICd0eXBlJzpcblx0XHRcdFx0XHRcdHRoaXMudHlwZSA9IHZhbHVlO1xuXHRcdFx0XHRcdFx0dGhpcy5sb2FkU2hhcGUoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ3NoYXBlJzpcblx0XHRcdFx0XHRcdHRoaXMuc2hhcGUgPSB2YWx1ZTtcblx0XHRcdFx0XHRcdHRoaXMubG9hZFNoYXBlKCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlICdjb2xvcic6XG5cdFx0XHRcdFx0XHR0aGlzLmNvbG9yID0gdmFsdWU7XG5cdFx0XHRcdFx0XHR0aGlzLmxvYWRJbm5lci5jaGlsZHJlbignLnJpbmcsIC5zcXVhcmUyJykuY3NzKCdib3JkZXItY29sb3InLCB2YWx1ZSk7XG5cdFx0XHRcdFx0XHR0aGlzLmxvYWRJbm5lci5jaGlsZHJlbignLmNpcmNsZSwgLnNxdWFyZScpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsIHZhbHVlKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ2ltZyc6XG5cdFx0XHRcdFx0XHR0aGlzLmltZyA9IHZhbHVlO1xuXHRcdFx0XHRcdFx0dGhpcy5sb2FkU2hhcGUoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ2FuaW0nOlxuXHRcdFx0XHRcdFx0dGhpcy5hbmltID0gdmFsdWU7XG5cdFx0XHRcdFx0XHR0aGlzLmxvYWRTaGFwZSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAnYmcnOlxuXHRcdFx0XHRcdFx0dGhpcy5sb2FkZXIuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgdmFsdWUpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHR9O1xuXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbcGFnZS1sb2FkZXJdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykgeyBwYWdlTG9hZGVyLmhhbmRsZSh0bywgJ3N3aXRjaCcpOyB9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbcGFnZS1sb2FkZXItdHlwZV0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7IHBhZ2VMb2FkZXIuaGFuZGxlKHRvLCAndHlwZScpOyB9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbcGFnZS1sb2FkZXItc2hhcGVdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykgeyBwYWdlTG9hZGVyLmhhbmRsZSh0bywgJ3NoYXBlJyk7IH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtwYWdlLWxvYWRlci1jb2xvcl0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7IHBhZ2VMb2FkZXIuaGFuZGxlKHRvLCAnY29sb3InKTsgfSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3BhZ2UtbG9hZGVyLWltZ10nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7IHBhZ2VMb2FkZXIuaGFuZGxlKHRvLCAnaW1nJyk7IH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtwYWdlLWxvYWRlci1iZ10nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7IHBhZ2VMb2FkZXIuaGFuZGxlKHRvLCAnYmcnKTsgfSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3BhZ2UtbG9hZGVyLWFuaW1dJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykgeyBwYWdlTG9hZGVyLmhhbmRsZSh0bywgJ2FuaW0nKTsgfSk7XG5cdH0pO1xuXG59KShqUXVlcnkpOyIsIlxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cbkNVU1RPTUlaRVIgSU5URUdSQVRJT04gLSBIRUFERVJcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiggZnVuY3Rpb24oJCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvKiBnbG9iYWwgd3AsIE1JWFQsIHRpbnljb2xvciAqL1xuXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbaGVhZC1iZy1jb2xvcl0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHQkKCcuaGVhZC1tZWRpYSAubWVkaWEtY29udGFpbmVyJykuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgdG8pO1xuXHRcdFx0aWYgKCB0aW55Y29sb3IodG8pLmlzTGlnaHQoKSApIHtcblx0XHRcdFx0JCgnLmhlYWQtbWVkaWEnKS5yZW1vdmVDbGFzcygnYmctZGFyaycpLmFkZENsYXNzKCdiZy1saWdodCcpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCgnLmhlYWQtbWVkaWEnKS5yZW1vdmVDbGFzcygnYmctbGlnaHQnKS5hZGRDbGFzcygnYmctZGFyaycpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblxuXHRmdW5jdGlvbiB1cGRhdGVIZWFkZXJUZXh0KCkge1xuXHRcdHZhciBjc3MgPSAnJyxcblx0XHRcdGhtID0gJy5oZWFkLW1lZGlhJyxcblx0XHRcdGNvbG9yID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtoZWFkLXRleHQtY29sb3JdJykuZ2V0KCksXG5cdFx0XHRjb2xvcl9pbnYgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W2hlYWQtaW52LXRleHQtY29sb3JdJykuZ2V0KCk7XG5cdFx0aWYgKCBjb2xvciAhPSAnJyApIHtcblx0XHRcdHZhciBobV9saWdodCA9IGhtKycuYmctbGlnaHQnO1xuXHRcdFx0Y3NzICs9IGhtX2xpZ2h0KycgLmNvbnRhaW5lciwgJytobV9saWdodCsnIC5tZWRpYS1pbm5lciA+IGEsICcraG1fbGlnaHQrJyAuaGVhZGVyLXNjcm9sbCwgJytobV9saWdodCsnICNicmVhZGNydW1icyA+IGxpICsgbGk6YmVmb3JlIHsgY29sb3I6ICcrY29sb3IrJyAhaW1wb3J0YW50OyB9Jztcblx0XHR9XG5cdFx0aWYgKCBjb2xvcl9pbnYgIT0gJycgKSB7XG5cdFx0XHR2YXIgaG1fZGFyayA9IGhtKycuYmctZGFyayc7XG5cdFx0XHRjc3MgKz0gaG1fZGFyaysnIC5jb250YWluZXIsICcraG1fZGFyaysnIC5tZWRpYS1pbm5lciA+IGEsICcraG1fZGFyaysnIC5oZWFkZXItc2Nyb2xsLCAnK2htX2RhcmsrJyAjYnJlYWRjcnVtYnMgPiBsaSArIGxpOmJlZm9yZSB7IGNvbG9yOiAnK2NvbG9yX2ludisnICFpbXBvcnRhbnQ7IH0nO1xuXHRcdH1cblx0XHRNSVhULnN0eWxlc2hlZXQoJ21peHQtaGVhZGVyJywgY3NzKTtcblx0fVxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2hlYWQtdGV4dC1jb2xvcl0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0dXBkYXRlSGVhZGVyVGV4dCgpO1xuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtoZWFkLWludi10ZXh0LWNvbG9yXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7XG5cdFx0XHR1cGRhdGVIZWFkZXJUZXh0KCk7XG5cdFx0fSk7XG5cdH0pO1xuXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9jLWJhci1iZy1jb2xvcl0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHQkKCcjbG9jYXRpb24tYmFyJykuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgdG8pO1xuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2MtYmFyLWJnLXBhdF0nLCBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdGlmICggdG8gPT0gJzAnICkge1xuXHRcdFx0XHQkKCcjbG9jYXRpb24tYmFyJykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ25vbmUnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNsb2NhdGlvbi1iYXInKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKFwiJyArIHRvICsgJ1wiKScpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2MtYmFyLXRleHQtY29sb3JdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0dmFyIGNzcyA9ICcjbG9jYXRpb24tYmFyLCAjbG9jYXRpb24tYmFyIGE6aG92ZXIsICNsb2NhdGlvbi1iYXIgbGk6YmVmb3JlIHsgY29sb3I6ICcrdG8rJzsgfSc7XG5cdFx0XHRNSVhULnN0eWxlc2hlZXQoJ21peHQtbG9jLWJhcicsIGNzcyk7XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvYy1iYXItYm9yZGVyLWNvbG9yXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdCQoJyNsb2NhdGlvbi1iYXInKS5jc3MoJ2JvcmRlci1jb2xvcicsIHRvKTtcblx0XHR9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbYnJlYWRjcnVtYnMtcHJlZml4XScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdHZhciBiY19wcmVmaXggPSAkKCcjYnJlYWRjcnVtYnMgLmJjLXByZWZpeCcpO1xuXHRcdFx0aWYgKCBiY19wcmVmaXgubGVuZ3RoID09PSAwICkgYmNfcHJlZml4ID0gJCgnPGxpIGNsYXNzPVwiYmMtcHJlZml4XCI+PC9saT4nKS5wcmVwZW5kVG8oJCgnI2JyZWFkY3J1bWJzJykpO1xuXHRcdFx0YmNfcHJlZml4Lmh0bWwodG8pO1xuXHRcdH0pO1xuXHR9KTtcblxufSkoalF1ZXJ5KTsiLCJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXG5DVVNUT01JWkVSIElOVEVHUkFUSU9OIC0gTE9HT1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuKCBmdW5jdGlvbigkKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qIGdsb2JhbCBfLCB3cCwgTUlYVCwgbWl4dF9jdXN0b21pemUgKi9cblxuXHRmdW5jdGlvbiB1cGRhdGVMb2dvKCkge1xuXHRcdHZhciBodG1sID0gJycsXG5cdFx0XHRjc3MgPSAnJyxcblx0XHRcdHR5cGUgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tdHlwZV0nKS5nZXQoKSxcblx0XHRcdGltZyA9IHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby1pbWddJykuZ2V0KCksXG5cdFx0XHR0ZXh0ID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXRleHRdJykuZ2V0KCkgfHwgd3AuY3VzdG9taXplKCdibG9nbmFtZScpLmdldCgpLFxuXHRcdFx0c2hyaW5rID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXNocmlua10nKS5nZXQoKSxcblx0XHRcdHNob3dfdGFnID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXNob3ctdGFnbGluZV0nKS5nZXQoKTtcblxuXHRcdC8vIEltYWdlIExvZ29cblx0XHRpZiAoIHR5cGUgPT0gJ2ltZycgJiYgISBfLmlzRW1wdHkoaW1nLnVybCkgKSB7XG5cdFx0XHR2YXIgd2lkdGggPSBpbWcud2lkdGgsXG5cdFx0XHRcdGltZ19pbnYgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28taW1nLWludl0nKS5nZXQoKSxcblx0XHRcdFx0aGlyZXMgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28taW1nLWhyXScpLmdldCgpID09ICcxJyxcblx0XHRcdFx0c2hyaW5rX3dpZHRoO1xuXG5cdFx0XHRpZiAoICEgXy5pc0VtcHR5KGltZ19pbnYudXJsKSApIHtcblx0XHRcdFx0aHRtbCArPSAnPGltZyBjbGFzcz1cImxvZ28taW1nIGxvZ28tbGlnaHRcIiBzcmM9XCInK2ltZy51cmwrJ1wiIGFsdD1cIicrdGV4dCsnXCI+Jztcblx0XHRcdFx0aHRtbCArPSAnPGltZyBjbGFzcz1cImxvZ28taW1nIGxvZ28tZGFya1wiIHNyYz1cIicraW1nX2ludi51cmwrJ1wiIGFsdD1cIicrdGV4dCsnXCI+Jztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGh0bWwgKz0gJzxpbWcgY2xhc3M9XCJsb2dvLWltZ1wiIHNyYz1cIicraW1nLnVybCsnXCIgYWx0PVwiJyt0ZXh0KydcIj4nO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGhpcmVzICkge1xuXHRcdFx0XHR3aWR0aCA9IHdpZHRoIC8gMjtcblx0XHRcdH1cblxuXHRcdFx0Y3NzICs9ICcubmF2YmFyLW1peHQgI25hdi1sb2dvIGltZyB7IG1heC13aWR0aDogJyt3aWR0aCsncHg7IH0nO1xuXG5cdFx0XHQvLyBMb2dvIFNocmlua1xuXHRcdFx0aWYgKCBzaHJpbmsgIT0gJzAnICkge1xuXHRcdFx0XHRzaHJpbmtfd2lkdGggID0gd2lkdGggLSBzaHJpbms7XG5cdFx0XHRcdGNzcyArPSAnLmZpeGVkLW5hdiAubmF2YmFyLW1peHQgI25hdi1sb2dvIGltZyB7IG1heC13aWR0aDogJytzaHJpbmtfd2lkdGgrJ3B4OyB9Jztcblx0XHRcdH1cblxuXHRcdC8vIFRleHQgTG9nb1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgY29sb3IgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tdGV4dC1jb2xvcl0nKS5nZXQoKSxcblx0XHRcdFx0Y29sb3JfaW52ID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXRleHQtaW52XScpLmdldCgpLFxuXHRcdFx0XHR0ZXh0X3R5cG8gPSBtaXh0X2N1c3RvbWl6ZS5sb2dvWyd0ZXh0LXR5cG8nXSxcblx0XHRcdFx0c2hyaW5rX3NpemU7XG5cblx0XHRcdGlmICggY29sb3JfaW52ICE9ICcnICkge1xuXHRcdFx0XHRodG1sICs9ICc8c3Ryb25nIGNsYXNzPVwibG9nby1saWdodFwiPicrdGV4dCsnPC9zdHJvbmc+Jztcblx0XHRcdFx0aHRtbCArPSAnPHN0cm9uZyBjbGFzcz1cImxvZ28tZGFya1wiPicrdGV4dCsnPC9zdHJvbmc+Jztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGh0bWwgKz0gJzxzdHJvbmc+Jyt0ZXh0Kyc8L3N0cm9uZz4nO1xuXHRcdFx0fVxuXG5cdFx0XHRjc3MgKz0gJyNuYXYtbG9nbyBzdHJvbmcgeyc7XG5cdFx0XHRcdGNzcyArPSAnY29sb3I6ICcrY29sb3IrJzsnO1xuXHRcdFx0XHRjc3MgKz0gJ2ZvbnQtc2l6ZTogJyt0ZXh0X3R5cG9bJ2ZvbnQtc2l6ZSddKyc7Jztcblx0XHRcdFx0Y3NzICs9ICdmb250LWZhbWlseTogJyt0ZXh0X3R5cG9bJ2ZvbnQtZmFtaWx5J10rJzsnO1xuXHRcdFx0XHRjc3MgKz0gJ2ZvbnQtd2VpZ2h0OiAnK3RleHRfdHlwb1snZm9udC13ZWlnaHQnXSsnOyc7XG5cdFx0XHRcdGNzcyArPSAndGV4dC10cmFuc2Zvcm06ICcrdGV4dF90eXBvWyd0ZXh0LXRyYW5zZm9ybSddKyc7Jztcblx0XHRcdGNzcyArPSAnfSc7XG5cdFx0XHRjc3MgKz0gJyNuYXYtbG9nbyAubG9nby1kYXJrIHsgY29sb3I6ICcrY29sb3JfaW52Kyc7IH0nO1xuXG5cdFx0XHQvLyBMb2dvIFNocmlua1xuXHRcdFx0aWYgKCBzaHJpbmsgIT0gJzAnICkge1xuXHRcdFx0XHRzaHJpbmtfc2l6ZSA9ICggcGFyc2VJbnQodGV4dF90eXBvWydmb250LXNpemUnXSwgMTApIC0gc2hyaW5rICkgKyAncHgnO1xuXG5cdFx0XHRcdGNzcyArPSAnLmZpeGVkLW5hdiAjbmF2LWxvZ28gc3Ryb25nIHsgZm9udC1zaXplOiAnK3Nocmlua19zaXplKyc7IH0nO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFRhZ2xpbmVcblx0XHRpZiAoIHNob3dfdGFnID09ICcxJyApIHtcblx0XHRcdHZhciB0YWdsaW5lID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXRhZ2xpbmVdJykuZ2V0KCkgfHwgd3AuY3VzdG9taXplKCdibG9nZGVzY3JpcHRpb24nKS5nZXQoKSxcblx0XHRcdFx0dGFnX2NvbG9yID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXRhZ2xpbmUtY29sb3JdJykuZ2V0KCksXG5cdFx0XHRcdHRhZ19jb2xvcl9pbnYgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tdGFnbGluZS1pbnZdJykuZ2V0KCksXG5cdFx0XHRcdHRhZ190eXBvID0gbWl4dF9jdXN0b21pemUubG9nb1sndGFnbGluZS10eXBvJ107XG5cblx0XHRcdGlmICggdGFnbGluZSAhPSAnJyApIHtcblx0XHRcdFx0aHRtbCArPSAnPHNtYWxsPicgKyB0YWdsaW5lICsgJzwvc21hbGw+Jztcblx0XHRcdH1cblxuXHRcdFx0Y3NzICs9ICcjbmF2LWxvZ28gc21hbGwgeyc7XG5cdFx0XHRcdGNzcyArPSAnY29sb3I6ICcrdGFnX2NvbG9yKyc7Jztcblx0XHRcdFx0Y3NzICs9ICdmb250LXNpemU6ICcrdGFnX3R5cG9bJ2ZvbnQtc2l6ZSddKyc7Jztcblx0XHRcdFx0Y3NzICs9ICdmb250LWZhbWlseTogJyt0YWdfdHlwb1snZm9udC1mYW1pbHknXSsnOyc7XG5cdFx0XHRcdGNzcyArPSAnZm9udC13ZWlnaHQ6ICcrdGFnX3R5cG9bJ2ZvbnQtd2VpZ2h0J10rJzsnO1xuXHRcdFx0XHRjc3MgKz0gJ3RleHQtdHJhbnNmb3JtOiAnK3RhZ190eXBvWyd0ZXh0LXRyYW5zZm9ybSddKyc7Jztcblx0XHRcdGNzcyArPSAnfSc7XG5cdFx0XHRjc3MgKz0gJy5iZy1kYXJrICNuYXYtbG9nbyBzbWFsbCB7IGNvbG9yOiAnK3RhZ19jb2xvcl9pbnYrJzsgfSc7XG5cdFx0fVxuXG5cdFx0JCgnI25hdi1sb2dvJykuaHRtbChodG1sKTtcblxuXHRcdE1JWFQuc3R5bGVzaGVldCgnbWl4dC1sb2dvJywgY3NzKTtcblx0fVxuXG5cdHdwLmN1c3RvbWl6ZSgnYmxvZ25hbWUnLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkgeyB1cGRhdGVMb2dvKCk7IH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdibG9nZGVzY3JpcHRpb24nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkgeyB1cGRhdGVMb2dvKCk7IH0pO1xuXHR9KTtcblxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tdHlwZV0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkgeyB1cGRhdGVMb2dvKCk7IH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLWltZ10nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkgeyB1cGRhdGVMb2dvKCk7IH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLWltZy1pbnZdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbigpIHsgdXBkYXRlTG9nbygpOyB9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby1pbWctaHJdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbigpIHsgdXBkYXRlTG9nbygpOyB9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby10ZXh0XScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7IHVwZGF0ZUxvZ28oKTsgfSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tdGV4dC1jb2xvcl0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkgeyB1cGRhdGVMb2dvKCk7IH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXRleHQtaW52XScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7IHVwZGF0ZUxvZ28oKTsgfSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tc2hyaW5rXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7IHVwZGF0ZUxvZ28oKTsgfSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tc2hvdy10YWdsaW5lXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7XG5cdFx0XHR1cGRhdGVMb2dvKCk7XG5cdFx0XHQkKHdpbmRvdykudHJpZ2dlcigncmVzaXplJyk7XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tdGFnbGluZV0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkgeyB1cGRhdGVMb2dvKCk7IH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXRhZ2xpbmUtY29sb3JdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbigpIHsgdXBkYXRlTG9nbygpOyB9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby10YWdsaW5lLWludl0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkgeyB1cGRhdGVMb2dvKCk7IH0pO1xuXHR9KTtcblxufSkoalF1ZXJ5KTsiLCJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXG5DVVNUT01JWkVSIElOVEVHUkFUSU9OIC0gTkFWQkFSU1xuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuKCBmdW5jdGlvbigkKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qIGdsb2JhbCB3cCwgTUlYVCwgbWl4dF9vcHQsIG1peHRfY3VzdG9taXplICovXG5cblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtdmVydGljYWwtcG9zaXRpb25dJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0aWYgKCB0byA9PSAnbGVmdCcgKSB7XG5cdFx0XHRcdCQoJyNtYWluLXdyYXAnKS5yZW1vdmVDbGFzcygnbmF2LXJpZ2h0JykuYWRkQ2xhc3MoJ25hdi1sZWZ0Jyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCcjbWFpbi13cmFwJykucmVtb3ZlQ2xhc3MoJ25hdi1sZWZ0JykuYWRkQ2xhc3MoJ25hdi1yaWdodCcpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLWFsaWduXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdGlmICggdG8gPT0gJzEnICkge1xuXHRcdFx0XHQkKCcjbWFpbi1uYXYtd3JhcCcpLnJlbW92ZUNsYXNzKCdsb2dvLWNlbnRlciBsb2dvLXJpZ2h0JykuYWRkQ2xhc3MoJ2xvZ28tbGVmdCcpLmF0dHIoJ2RhdGEtbG9nby1hbGlnbicsICdsZWZ0Jyk7XG5cdFx0XHR9IGVsc2UgaWYgKCB0byA9PSAnMicgKSB7XG5cdFx0XHRcdCQoJyNtYWluLW5hdi13cmFwJykucmVtb3ZlQ2xhc3MoJ2xvZ28tbGVmdCBsb2dvLXJpZ2h0JykuYWRkQ2xhc3MoJ2xvZ28tY2VudGVyJykuYXR0cignZGF0YS1sb2dvLWFsaWduJywgJ2NlbnRlcicpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCgnI21haW4tbmF2LXdyYXAnKS5yZW1vdmVDbGFzcygnbG9nby1jZW50ZXIgbG9nby1sZWZ0JykuYWRkQ2xhc3MoJ2xvZ28tcmlnaHQnKS5hdHRyKCdkYXRhLWxvZ28tYWxpZ24nLCAncmlnaHQnKTtcblx0XHRcdH1cblx0XHRcdG5hdmJhclBhZGRpbmcoKTtcblx0XHR9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbmF2LXRleHR1cmVdJywgZnVuY3Rpb24oIHZhbHVlICkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHRpZiAoIHRvID09ICcwJyApIHtcblx0XHRcdFx0JCgnI21haW4tbmF2JykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ25vbmUnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNtYWluLW5hdicpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoXCInICsgdG8gKyAnXCIpJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3NlYy1uYXYtdGV4dHVyZV0nLCBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdGlmICggdG8gPT0gJzAnICkge1xuXHRcdFx0XHQkKCcjc2Vjb25kLW5hdicpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICdub25lJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCcjc2Vjb25kLW5hdicpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoXCInICsgdG8gKyAnXCIpJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIG5hdmJhclBhZGRpbmcoKSB7XG5cdFx0dmFyIGNzcyxcblx0XHRcdHNoZWV0ID0gTUlYVC5zdHlsZXNoZWV0KCdtaXh0LW5hdi1wYWRkaW5nJyk7XG5cblx0XHRzaGVldC5odG1sKCcnKTtcblxuXHRcdHZhciBuYXZfaGVpZ2h0ID0gcGFyc2VJbnQoJCgnI21haW4tbmF2JykuaGVpZ2h0KCksIDEwKSxcblx0XHRcdHBhZGRpbmcgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi1wYWRkaW5nXScpLmdldCgpLFxuXHRcdFx0Zml4ZWRfcGFkZGluZyA9IHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbmF2LWZpeGVkLXBhZGRpbmddJykuZ2V0KCksXG5cdFx0XHRuYXZfd3JhcF9oZWlnaHQgPSBuYXZfaGVpZ2h0ICsgcGFkZGluZyAqIDIsXG5cdFx0XHRmaXhlZF93cmFwX2hlaWdodCA9IG5hdl9oZWlnaHQgKyBmaXhlZF9wYWRkaW5nICogMixcblx0XHRcdGZpeGVkX2l0ZW1faGVpZ2h0ID0gZml4ZWRfd3JhcF9oZWlnaHQsXG5cdFx0XHRtZWRpYV9icCA9IG1peHRfY3VzdG9taXplLmJyZWFrcG9pbnRzLm1hcnMgKyAxLFxuXHRcdFx0bG9nb19jZW50ZXIgPSAkKCcjbWFpbi1uYXYtd3JhcCcpLmF0dHIoJ2RhdGEtbG9nby1hbGlnbicpID09ICdjZW50ZXInO1xuXG5cdFx0Y3NzID0gJ0BtZWRpYSAoIG1pbi13aWR0aDogJyttZWRpYV9icCsncHggKSB7Jztcblx0XHRcdGNzcyArPSAnLm5hdmJhci1taXh0IHsgcGFkZGluZy10b3A6ICcrcGFkZGluZysncHg7IHBhZGRpbmctYm90dG9tOiAnK3BhZGRpbmcrJ3B4OyB9Jztcblx0XHRcdGNzcyArPSAnLmZpeGVkLW5hdiAubmF2YmFyLW1peHQgeyBwYWRkaW5nLXRvcDogJytmaXhlZF9wYWRkaW5nKydweDsgcGFkZGluZy1ib3R0b206ICcrZml4ZWRfcGFkZGluZysncHg7IH0nO1xuXHRcdFx0aWYgKCBsb2dvX2NlbnRlciApIHtcblx0XHRcdFx0dmFyIGhhbGZfcGFkZGluZyA9IGZpeGVkX3BhZGRpbmcgLyAyO1xuXHRcdFx0XHRmaXhlZF9pdGVtX2hlaWdodCA9IGZpeGVkX2l0ZW1faGVpZ2h0IC0gbmF2X2hlaWdodCAvIDIgLSBoYWxmX3BhZGRpbmc7XG5cdFx0XHRcdGNzcyArPSAnI21haW4tbmF2LXdyYXAubG9nby1jZW50ZXIgeyBtaW4taGVpZ2h0OiAnK25hdl93cmFwX2hlaWdodCsncHg7IH0nO1xuXHRcdFx0XHRjc3MgKz0gJy5maXhlZC1uYXYgI21haW4tbmF2LXdyYXAubG9nby1jZW50ZXIgeyBtaW4taGVpZ2h0OiAnK2ZpeGVkX3dyYXBfaGVpZ2h0KydweDsgfSc7XG5cdFx0XHRcdGNzcyArPSAnLmZpeGVkLW5hdiAubmF2YmFyLW1peHQgLm5hdmJhci1oZWFkZXIgeyBtYXJnaW4tdG9wOiAtJytoYWxmX3BhZGRpbmcrJ3B4OyB9Jztcblx0XHRcdFx0Y3NzICs9ICcuZml4ZWQtbmF2IC5uYXZiYXItbWl4dCAubmF2ID4gbGkgeyBtYXJnaW4tdG9wOiAnK2hhbGZfcGFkZGluZysncHg7IG1hcmdpbi1ib3R0b206IC0nK2ZpeGVkX3BhZGRpbmcrJ3B4OyB9Jztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNzcyArPSAnI21haW4tbmF2LXdyYXAgeyBtaW4taGVpZ2h0OiAnK25hdl93cmFwX2hlaWdodCsncHg7IH0nO1xuXHRcdFx0XHRjc3MgKz0gJy5maXhlZC1uYXYgI21haW4tbmF2LXdyYXAgeyBtaW4taGVpZ2h0OiAnK2ZpeGVkX3dyYXBfaGVpZ2h0KydweDsgfSc7XG5cdFx0XHRcdGNzcyArPSAnLmZpeGVkLW5hdiAubmF2YmFyLW1peHQgLm5hdiA+IGxpIHsgbWFyZ2luLXRvcDogLScrZml4ZWRfcGFkZGluZysncHg7IG1hcmdpbi1ib3R0b206IC0nK2ZpeGVkX3BhZGRpbmcrJ3B4OyB9Jztcblx0XHRcdH1cblx0XHRcdGNzcyArPSAnLmZpeGVkLW5hdiAubmF2YmFyLW1peHQgLm5hdiA+IGxpLCAuZml4ZWQtbmF2IC5uYXZiYXItbWl4dCAubmF2ID4gbGkgPiBhIHsgaGVpZ2h0OiAnK2ZpeGVkX2l0ZW1faGVpZ2h0KydweDsgbGluZS1oZWlnaHQ6ICcrZml4ZWRfaXRlbV9oZWlnaHQrJ3B4OyB9Jztcblx0XHRjc3MgKz0gJ30nO1xuXG5cdFx0c2hlZXQuaHRtbChjc3MpO1xuXHR9XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbmF2LXBhZGRpbmddJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbigpIHsgbmF2YmFyUGFkZGluZygpOyB9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbmF2LWZpeGVkLXBhZGRpbmddJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbigpIHsgbmF2YmFyUGFkZGluZygpOyB9KTtcblx0fSk7XG5cblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtb3BhY2l0eV0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHRtaXh0X29wdC5uYXYub3BhY2l0eSA9IHRvO1xuXHRcdFx0JCgnI21haW4tbmF2JykudHJpZ2dlcigncmVmcmVzaCcpO1xuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtdG9wLW9wYWNpdHldJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0bWl4dF9vcHQubmF2Wyd0b3Atb3BhY2l0eSddID0gdG87XG5cdFx0XHQkKCcjbWFpbi1uYXYnKS50cmlnZ2VyKCdyZWZyZXNoJyk7XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi10cmFuc3BhcmVudF0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHRpZiAoIHRvID09ICcxJyAmJiB3cC5jdXN0b21pemUoJ21peHRfb3B0W2hlYWQtbWVkaWFdJykuZ2V0KCkgPT0gJzEnICkge1xuXHRcdFx0XHQkKCcjbWFpbi13cmFwJykuYWRkQ2xhc3MoJ25hdi10cmFuc3BhcmVudCcpO1xuXHRcdFx0XHRtaXh0X29wdC5uYXYudHJhbnNwYXJlbnQgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCgnI21haW4td3JhcCcpLnJlbW92ZUNsYXNzKCduYXYtdHJhbnNwYXJlbnQnKTtcblx0XHRcdFx0bWl4dF9vcHQubmF2LnRyYW5zcGFyZW50ID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHQkKCcjbWFpbi1uYXYnKS50cmlnZ2VyKCdyZWZyZXNoJyk7XG5cdFx0fSk7XG5cdH0pO1xuXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbmF2LWhvdmVyLWJnXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdGlmICggdG8gPT0gJzAnICkge1xuXHRcdFx0XHQkKCcjbWFpbi1uYXYnKS5hZGRDbGFzcygnbm8taG92ZXItYmcnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNtYWluLW5hdicpLnJlbW92ZUNsYXNzKCduby1ob3Zlci1iZycpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtzZWMtbmF2LWhvdmVyLWJnXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdGlmICggdG8gPT0gJzAnICkge1xuXHRcdFx0XHQkKCcjc2Vjb25kLW5hdicpLmFkZENsYXNzKCduby1ob3Zlci1iZycpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCgnI3NlY29uZC1uYXYnKS5yZW1vdmVDbGFzcygnbm8taG92ZXItYmcnKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cblx0ZnVuY3Rpb24gbmF2YmFyQWN0aXZlQmFyKG5hdmJhciwgZW5hYmxlZCwgcG9zaXRpb24pIHtcblx0XHRuYXZiYXIucmVtb3ZlQ2xhc3MoJ2FjdGl2ZS10b3AgYWN0aXZlLWJvdHRvbSBhY3RpdmUtbGVmdCBhY3RpdmUtcmlnaHQnKTtcblx0XHRpZiAoIGVuYWJsZWQgKSB7XG5cdFx0XHRuYXZiYXIucmVtb3ZlQ2xhc3MoJ25vLWFjdGl2ZScpLmFkZENsYXNzKCdhY3RpdmUtJytwb3NpdGlvbik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG5hdmJhci5hZGRDbGFzcygnbm8tYWN0aXZlJyk7XG5cdFx0fVxuXHR9XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbmF2LWFjdGl2ZS1iYXJdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0dmFyIGVuYWJsZWQgPSB0byA9PSAnMScsXG5cdFx0XHRcdHBvc2l0aW9uID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtYWN0aXZlLWJhci1wb3NdJykuZ2V0KCk7XG5cdFx0XHRuYXZiYXJBY3RpdmVCYXIoJCgnI21haW4tbmF2IC5uYXYnKSwgZW5hYmxlZCwgcG9zaXRpb24pO1xuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtYWN0aXZlLWJhci1wb3NdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0dmFyIGVuYWJsZWQgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi1hY3RpdmUtYmFyXScpLmdldCgpID09ICcxJztcblx0XHRcdG5hdmJhckFjdGl2ZUJhcigkKCcjbWFpbi1uYXYgLm5hdicpLCBlbmFibGVkLCB0byk7XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3NlYy1uYXYtYWN0aXZlLWJhcl0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHR2YXIgZW5hYmxlZCA9IHRvID09ICcxJyxcblx0XHRcdFx0cG9zaXRpb24gPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W3NlYy1uYXYtYWN0aXZlLWJhci1wb3NdJykuZ2V0KCk7XG5cdFx0XHRuYXZiYXJBY3RpdmVCYXIoJCgnI3NlY29uZC1uYXYgLm5hdicpLCBlbmFibGVkLCBwb3NpdGlvbik7XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3NlYy1uYXYtYWN0aXZlLWJhci1wb3NdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0dmFyIGVuYWJsZWQgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W3NlYy1uYXYtYWN0aXZlLWJhcl0nKS5nZXQoKSA9PSAnMSc7XG5cdFx0XHRuYXZiYXJBY3RpdmVCYXIoJCgnI3NlY29uZC1uYXYgLm5hdicpLCBlbmFibGVkLCB0byk7XG5cdFx0fSk7XG5cdH0pO1xuXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbmF2LWJvcmRlcmVkXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdGlmICggdG8gPT0gJzEnICkge1xuXHRcdFx0XHQkKCcjbWFpbi1uYXYnKS5hZGRDbGFzcygnYm9yZGVyZWQnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNtYWluLW5hdicpLnJlbW92ZUNsYXNzKCdib3JkZXJlZCcpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtzZWMtbmF2LWJvcmRlcmVkXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdGlmICggdG8gPT0gJzEnICkge1xuXHRcdFx0XHQkKCcjc2Vjb25kLW5hdicpLmFkZENsYXNzKCdib3JkZXJlZCcpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCgnI3NlY29uZC1uYXYnKS5yZW1vdmVDbGFzcygnYm9yZGVyZWQnKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtzZWMtbmF2LWxlZnQtY29kZV0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHQkKCcjc2Vjb25kLW5hdiAubGVmdCAuY29kZS1pbm5lcicpLmh0bWwodG8pO1xuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtzZWMtbmF2LWxlZnQtaGlkZV0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHR2YXIgbmF2ID0gJCgnI3NlY29uZC1uYXYnKTtcblx0XHRcdGlmICggdG8gPT0gJzEnICkge1xuXHRcdFx0XHRuYXYuZmluZCgnLmxlZnQnKS5hZGRDbGFzcygnaGlkZGVuLXhzJyk7XG5cdFx0XHRcdGlmICggd3AuY3VzdG9taXplKCdtaXh0X29wdFtzZWMtbmF2LXJpZ2h0LWhpZGVdJykuZ2V0KCkgPT0gJzEnICkgbmF2LmFkZENsYXNzKCdoaWRkZW4teHMnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5hdi5yZW1vdmVDbGFzcygnaGlkZGVuLXhzJyk7XG5cdFx0XHRcdG5hdi5maW5kKCcubGVmdCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4teHMnKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2VjLW5hdi1yaWdodC1jb2RlXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdCQoJyNzZWNvbmQtbmF2IC5yaWdodCAuY29kZS1pbm5lcicpLmh0bWwodG8pO1xuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtzZWMtbmF2LXJpZ2h0LWhpZGVdJywgZnVuY3Rpb24odmFsdWUpIHtcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xuXHRcdFx0dmFyIG5hdiA9ICQoJyNzZWNvbmQtbmF2Jyk7XG5cdFx0XHRpZiAoIHRvID09ICcxJyApIHtcblx0XHRcdFx0bmF2LmZpbmQoJy5yaWdodCcpLmFkZENsYXNzKCdoaWRkZW4teHMnKTtcblx0XHRcdFx0aWYgKCB3cC5jdXN0b21pemUoJ21peHRfb3B0W3NlYy1uYXYtbGVmdC1oaWRlXScpLmdldCgpID09ICcxJyApIG5hdi5hZGRDbGFzcygnaGlkZGVuLXhzJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRuYXYucmVtb3ZlQ2xhc3MoJ2hpZGRlbi14cycpO1xuXHRcdFx0XHRuYXYuZmluZCgnLnJpZ2h0JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbi14cycpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblxufSkoalF1ZXJ5KTsiLCJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXG5DVVNUT01JWkVSIElOVEVHUkFUSU9OIC0gVEhFTUVTXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qIGdsb2JhbCB3cCwgTUlYVCAqL1xuXG5NSVhULnRoZW1lcyA9IHtcblx0cmVnZXg6IC90aGVtZS0oW15cXHNdKikvLFxuXHRzaXRlOiBmYWxzZSxcblx0bmF2OiBmYWxzZSxcblx0c2VjTmF2OiBmYWxzZSxcblx0Zm9vdGVyOiBmYWxzZSxcblx0c2V0dXA6IGZhbHNlLFxuXHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRpZiAoICEgdGhpcy5zZXR1cCApIHtcblx0XHRcdHRoaXMuc2l0ZSA9IGpRdWVyeSgnI21haW4td3JhcC1pbm5lcicpWzBdLmNsYXNzTmFtZS5tYXRjaCh0aGlzLnJlZ2V4KVsxXTtcblx0XHRcdHRoaXMubmF2ID0galF1ZXJ5KCcjbWFpbi1uYXYnKVswXS5jbGFzc05hbWUubWF0Y2godGhpcy5yZWdleClbMV07XG5cdFx0XHRpZiAoIGpRdWVyeSgnI3NlY29uZC1uYXYnKS5sZW5ndGggKSB0aGlzLnNlY05hdiA9IGpRdWVyeSgnI3NlY29uZC1uYXYnKVswXS5jbGFzc05hbWUubWF0Y2godGhpcy5yZWdleClbMV07XG5cdFx0XHR0aGlzLmZvb3RlciA9IGpRdWVyeSgnI2NvbG9waG9uJylbMF0uY2xhc3NOYW1lLm1hdGNoKHRoaXMucmVnZXgpWzFdO1xuXHRcdFx0XG5cdFx0XHR0aGlzLnNldHVwID0gdHJ1ZTtcblx0XHR9XG5cdH0sXG5cdHNldFRoZW1lOiBmdW5jdGlvbihlbGVtLCB0aGVtZSkge1xuXHRcdGlmICggZWxlbS5sZW5ndGggPT09IDAgKSByZXR1cm47XG5cdFx0aWYgKCB0aGVtZSA9PSAnYXV0bycgKSB7XG5cdFx0XHR0aGVtZSA9IHRoaXMuc2l0ZTtcblx0XHRcdGVsZW0uYXR0cignZGF0YS10aGVtZScsICdhdXRvJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGVsZW0ucmVtb3ZlQXR0cignZGF0YS10aGVtZScpO1xuXHRcdH1cblx0XHRlbGVtWzBdLmNsYXNzTmFtZSA9IGVsZW1bMF0uY2xhc3NOYW1lLnJlcGxhY2UodGhpcy5yZWdleCwgJ3RoZW1lLScgKyB0aGVtZSk7XG5cdFx0ZWxlbS50cmlnZ2VyKCdyZWZyZXNoJykudHJpZ2dlcigndGhlbWUtY2hhbmdlJywgdGhlbWUpO1xuXHR9XG59O1xuXG4oIGZ1bmN0aW9uKCQpIHtcblx0XG5cdHZhciB0aGVtZXMgPSBNSVhULnRoZW1lcztcblxuXHR0aGVtZXMuaW5pdCgpO1xuXHRcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtzaXRlLXRoZW1lXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdHRoZW1lcy5zaXRlID0gdG87XG5cdFx0XHR2YXIgZWxlbXMgPSAkKCdib2R5LCAjbWFpbi13cmFwLWlubmVyLCBbZGF0YS10aGVtZT1cImF1dG9cIl0nKTtcblx0XHRcdGVsZW1zLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKHRoaXMpWzBdLmNsYXNzTmFtZSA9ICQodGhpcylbMF0uY2xhc3NOYW1lLnJlcGxhY2UodGhlbWVzLnJlZ2V4LCAndGhlbWUtJyArIHRvKTtcblx0XHRcdFx0JCh0aGlzKS50cmlnZ2VyKCdyZWZyZXNoJykudHJpZ2dlcigndGhlbWUtY2hhbmdlJywgdG8pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0pO1xuXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbmF2LXRoZW1lXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdHRoZW1lcy5uYXYgPSB0bztcblx0XHRcdHRoZW1lcy5zZXRUaGVtZSgkKCcjbWFpbi1uYXYnKSwgdG8pO1xuXHRcdH0pO1xuXHR9KTtcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtzZWMtbmF2LXRoZW1lXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdHRoZW1lcy5zZWNOYXYgPSB0bztcblx0XHRcdHRoZW1lcy5zZXRUaGVtZSgkKCcjc2Vjb25kLW5hdicpLCB0byk7XG5cdFx0fSk7XG5cdH0pO1xuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2Zvb3Rlci10aGVtZV0nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHR0aGVtZXMuZm9vdGVyID0gdG87XG5cdFx0XHR0aGVtZXMuc2V0VGhlbWUoJCgnI2NvbG9waG9uJyksIHRvKTtcblx0XHR9KTtcblx0fSk7XG5cbn0pKGpRdWVyeSk7IiwiXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xuQ1VTVE9NSVpFUiBJTlRFR1JBVElPTiAtIE5BViBUSEVNRVNcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiggZnVuY3Rpb24oJCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvKiBnbG9iYWwgXywgd3AsIE1JWFQsIG1peHRfY3VzdG9taXplLCB0aW55Y29sb3IgKi9cblxuXHRpZiAoIF8uaXNFbXB0eSh3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi10aGVtZXNdJykpICkgcmV0dXJuO1xuXHRcblx0dmFyIGRlZmF1bHRzID0ge1xuXHRcdCdhY2NlbnQnOiAgICAgJyNkZDNlM2UnLFxuXHRcdCdiZyc6ICAgICAgICAgJyNmZmYnLFxuXHRcdCdjb2xvcic6ICAgICAgJyMzMzMnLFxuXHRcdCdjb2xvci1pbnYnOiAgJyNmZmYnLFxuXHRcdCdib3JkZXInOiAgICAgJyNkZGQnLFxuXHRcdCdib3JkZXItaW52JzogJyMzMzMnLFxuXHR9O1xuXG5cdHZhciB0aGVtZXMgPSBNSVhULnRoZW1lcztcblx0XG5cdGZ1bmN0aW9uIHVwZGF0ZU5hdlRoZW1lcyhkYXRhKSB7XG5cdFx0JC5lYWNoKGRhdGEsIGZ1bmN0aW9uKGlkLCB0aGVtZSkge1xuXHRcdFx0dmFyIGNzcztcblxuXHRcdFx0Ly8gR2VuZXJhdGUgdGhlbWUgaWYgYW4gZWxlbWVudCB1c2VzIGl0XG5cdFx0XHRpZiAoIHRoZW1lcy5uYXYgPT0gaWQgfHwgdGhlbWVzLnNlY05hdiA9PSBpZCB8fCAoICggdGhlbWVzLm5hdiA9PSAnYXV0bycgfHwgdGhlbWVzLnNlY05hdiA9PSAnYXV0bycgKSAmJiB0aGVtZXMuc2l0ZSA9PSBpZCApICkge1xuXG5cdFx0XHRcdHZhciBuYXZiYXIgPSAnLm5hdmJhci50aGVtZS0nK2lkLFxuXHRcdFx0XHRcdG1haW5fbmF2YmFyID0gJy5uYXZiYXItbWl4dC50aGVtZS0nK2lkLFxuXHRcdFx0XHRcdG1haW5fbmF2X29wYWNpdHkgPSBtaXh0X2N1c3RvbWl6ZS5uYXYub3BhY2l0eSB8fCAwLjk1LFxuXHRcdFx0XHRcdG5hdmJhcl9kYXJrLFxuXHRcdFx0XHRcdG5hdmJhcl9saWdodCxcblxuXHRcdFx0XHRcdGFjY2VudCA9IHRoZW1lLmFjY2VudCB8fCBkZWZhdWx0cy5hY2NlbnQsXG5cdFx0XHRcdFx0YWNjZW50X2ludiA9IHRoZW1lWydhY2NlbnQtaW52J10gfHwgYWNjZW50LFxuXG5cdFx0XHRcdFx0YmcgPSB0aGVtZS5iZyB8fCBkZWZhdWx0cy5iZyxcblx0XHRcdFx0XHRiZ19kYXJrID0gdGhlbWVbJ2JnLWRhcmsnXSA9PSAnMScsXG5cblx0XHRcdFx0XHRib3JkZXIgPSB0aGVtZS5ib3JkZXIgfHwgZGVmYXVsdHMuYm9yZGVyLFxuXHRcdFx0XHRcdGJvcmRlcl9pbnYgPSB0aGVtZVsnYm9yZGVyLWludiddIHx8IGRlZmF1bHRzWydib3JkZXItaW52J10sXG5cblx0XHRcdFx0XHRjb2xvciA9IHRoZW1lLmNvbG9yIHx8IGRlZmF1bHRzLmNvbG9yLFxuXHRcdFx0XHRcdGNvbG9yX2ludiA9IHRoZW1lWydjb2xvci1pbnYnXSB8fCBkZWZhdWx0c1snY29sb3ItaW52J10sXG5cblx0XHRcdFx0XHRjb2xvcl9mb3JfYWNjZW50ID0gdGlueWNvbG9yLm1vc3RSZWFkYWJsZShhY2NlbnQsIFsnI2ZmZicsICcjMDAwJ10pLnRvSGV4U3RyaW5nKCksXG5cblx0XHRcdFx0XHRtZW51X2JnID0gdGhlbWVbJ21lbnUtYmcnXSB8fCBiZyxcblx0XHRcdFx0XHRtZW51X2JnX2RhcmsgPSB0aW55Y29sb3IobWVudV9iZykuaXNEYXJrKCksXG5cdFx0XHRcdFx0bWVudV9ib3JkZXIgPSB0aGVtZVsnbWVudS1ib3JkZXInXSB8fCBib3JkZXIsXG5cdFx0XHRcdFx0bWVudV9iZ19ob3ZlciA9IHRoZW1lWydtZW51LWJnLWhvdmVyJ10gfHwgdGlueWNvbG9yKG1lbnVfYmcpLmRhcmtlbigyKS50b1N0cmluZygpLFxuXHRcdFx0XHRcdG1lbnVfaG92ZXJfY29sb3IgPSB0aGVtZVsnbWVudS1ob3Zlci1jb2xvciddIHx8IGFjY2VudCxcblx0XHRcdFx0XHRtZW51X2FjY2VudCxcblx0XHRcdFx0XHRtZW51X2NvbG9yLFxuXHRcdFx0XHRcdG1lbnVfY29sb3JfZmFkZSxcblxuXHRcdFx0XHRcdGJnX2xpZ2h0X2FjY2VudCwgYmdfbGlnaHRfY29sb3IsIGJnX2xpZ2h0X2JvcmRlcixcblx0XHRcdFx0XHRiZ19kYXJrX2FjY2VudCwgYmdfZGFya19jb2xvciwgYmdfZGFya19ib3JkZXIsXG5cblx0XHRcdFx0XHR0aGVtZV9yZ2JhID0gdGhlbWUucmdiYSA9PSAnMScsXG5cdFx0XHRcdFx0Ym9yZGVyX3JnYmEgPSAnJyxcblx0XHRcdFx0XHRtZW51X2JnX3JnYmEgPSAnJyxcblx0XHRcdFx0XHRtZW51X2JvcmRlcl9yZ2JhID0gJyc7XG5cblx0XHRcdFx0Ly8gU2V0IEFjY2VudCBBbmQgVGV4dCBDb2xvcnMgQWNjb3JkaW5nIFRvIFRoZSBCYWNrZ3JvdW5kIENvbG9yXG5cblx0XHRcdFx0aWYgKCBiZ19kYXJrICkge1xuXHRcdFx0XHRcdG5hdmJhcl9kYXJrICA9IG5hdmJhcjtcblx0XHRcdFx0XHRuYXZiYXJfbGlnaHQgPSBuYXZiYXIrJy5iZy1saWdodCc7XG5cblx0XHRcdFx0XHRiZ19saWdodF9jb2xvciAgPSBjb2xvcl9pbnY7XG5cdFx0XHRcdFx0YmdfbGlnaHRfYWNjZW50ID0gYWNjZW50X2ludjtcblxuXHRcdFx0XHRcdGJnX2RhcmtfY29sb3IgID0gY29sb3I7XG5cdFx0XHRcdFx0YmdfZGFya19hY2NlbnQgPSBhY2NlbnQ7XG5cblx0XHRcdFx0XHRiZ19kYXJrX2JvcmRlciAgPSBib3JkZXI7XG5cdFx0XHRcdFx0YmdfbGlnaHRfYm9yZGVyID0gYm9yZGVyX2ludjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRuYXZiYXJfZGFyayAgPSBuYXZiYXIrJy5iZy1kYXJrJztcblx0XHRcdFx0XHRuYXZiYXJfbGlnaHQgPSBuYXZiYXI7XG5cblx0XHRcdFx0XHRiZ19saWdodF9jb2xvciAgPSBjb2xvcjtcblx0XHRcdFx0XHRiZ19saWdodF9hY2NlbnQgPSBhY2NlbnQ7XG5cblx0XHRcdFx0XHRiZ19kYXJrX2NvbG9yICA9IGNvbG9yX2ludjtcblx0XHRcdFx0XHRiZ19kYXJrX2FjY2VudCA9IGFjY2VudF9pbnY7XG5cblx0XHRcdFx0XHRiZ19kYXJrX2JvcmRlciAgPSBib3JkZXJfaW52O1xuXHRcdFx0XHRcdGJnX2xpZ2h0X2JvcmRlciA9IGJvcmRlcjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhciBoYXNfaW52X2FjY2VudCA9ICggYmdfbGlnaHRfYWNjZW50ICE9IGJnX2RhcmtfYWNjZW50ICk7XG5cblx0XHRcdFx0Ly8gU2V0IE1lbnUgQWNjZW50IEFuZCBUZXh0IENvbG9ycyBBY2NvcmRpbmcgVG8gVGhlIEJhY2tncm91bmQgQ29sb3Jcblx0XHRcdFx0XG5cdFx0XHRcdGlmICggbWVudV9iZ19kYXJrICkge1xuXHRcdFx0XHRcdG1lbnVfY29sb3IgICAgICA9IHRoZW1lWydtZW51LWNvbG9yJ10gfHwgYmdfZGFya19jb2xvcjtcblx0XHRcdFx0XHRtZW51X2NvbG9yX2ZhZGUgPSB0aGVtZVsnbWVudS1jb2xvci1mYWRlJ10gfHwgbWVudV9jb2xvcjtcblx0XHRcdFx0XHRtZW51X2FjY2VudCAgICAgPSBiZ19kYXJrX2FjY2VudDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtZW51X2NvbG9yICAgICAgPSB0aGVtZVsnbWVudS1jb2xvciddIHx8IGJnX2xpZ2h0X2NvbG9yO1xuXHRcdFx0XHRcdG1lbnVfY29sb3JfZmFkZSA9IHRoZW1lWydtZW51LWNvbG9yLWZhZGUnXSB8fCBtZW51X2NvbG9yO1xuXHRcdFx0XHRcdG1lbnVfYWNjZW50ICAgICA9IGJnX2xpZ2h0X2FjY2VudDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIE1ha2UgUkdCQSBDb2xvcnMgSWYgRW5hYmxlZFxuXHRcdFx0XHRcblx0XHRcdFx0aWYgKCB0aGVtZV9yZ2JhICkge1xuXHRcdFx0XHRcdGJvcmRlcl9yZ2JhID0gJ2JvcmRlci1jb2xvcjogJyt0aW55Y29sb3IoYm9yZGVyKS5zZXRBbHBoYSgwLjgpLnRvUGVyY2VudGFnZVJnYlN0cmluZygpKyc7Jztcblx0XHRcdFx0XHRtZW51X2JnX3JnYmEgPSAnYmFja2dyb3VuZC1jb2xvcjogJyt0aW55Y29sb3IobWVudV9iZykuc2V0QWxwaGEoMC45NSkudG9QZXJjZW50YWdlUmdiU3RyaW5nKCkrJzsnO1xuXHRcdFx0XHRcdG1lbnVfYm9yZGVyX3JnYmEgPSAnYm9yZGVyLWNvbG9yOiAnK3Rpbnljb2xvcihtZW51X2JvcmRlcikuc2V0QWxwaGEoMC44KS50b1BlcmNlbnRhZ2VSZ2JTdHJpbmcoKSsnOyc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBTVEFSVCBDU1MgUlVMRVNcblxuXHRcdFx0XHRjc3MgPSBuYXZiYXIrJyB7IGJvcmRlci1jb2xvcjogJytib3JkZXIrJzsgYmFja2dyb3VuZC1jb2xvcjogJytiZysnOyB9Jztcblx0XHRcdFx0XG5cdFx0XHRcdGlmICggbWFpbl9uYXZfb3BhY2l0eSA8IDEgKSB7XG5cdFx0XHRcdFx0Y3NzICs9IG1haW5fbmF2YmFyKyc6bm90KC5wb3NpdGlvbi10b3ApOm5vdCgudmVydGljYWwpIHsgYmFja2dyb3VuZC1jb2xvcjogJyt0aW55Y29sb3IoYmcpLnNldEFscGhhKG1haW5fbmF2X29wYWNpdHkpLnRvUGVyY2VudGFnZVJnYlN0cmluZygpKyc7IH0nO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y3NzICs9IG5hdmJhcisnLmluaXQgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnKycgIWltcG9ydGFudDsgfSc7XG5cblx0XHRcdFx0aWYgKCBiZ19kYXJrICkge1xuXHRcdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAubmF2YmFyLWRhdGE6YmVmb3JlIHsgY29udGVudDogXCJkYXJrXCI7IH0nO1xuXHRcdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAjbmF2LWxvZ28gLmxvZ28tZGFyayB7IHBvc2l0aW9uOiBzdGF0aWM7IG9wYWNpdHk6IDE7IHZpc2liaWxpdHk6IHZpc2libGU7IH0nO1xuXHRcdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAjbmF2LWxvZ28gLmxvZ28tbGlnaHQgeyBwb3NpdGlvbjogYWJzb2x1dGU7IG9wYWNpdHk6IDA7IHZpc2liaWxpdHk6IGhpZGRlbjsgfSc7XG5cdFx0XHRcdFx0Y3NzICs9IG5hdmJhcl9saWdodCsnICNuYXYtbG9nbyAubG9nby1kYXJrIHsgcG9zaXRpb246IGFic29sdXRlOyBvcGFjaXR5OiAwOyB2aXNpYmlsaXR5OiBoaWRkZW47IH0nO1xuXHRcdFx0XHRcdGNzcyArPSBuYXZiYXJfbGlnaHQrJyAjbmF2LWxvZ28gLmxvZ28tbGlnaHQgeyBwb3NpdGlvbjogc3RhdGljOyBvcGFjaXR5OiAxOyB2aXNpYmlsaXR5OiB2aXNpYmxlOyB9Jztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLm5hdmJhci1kYXRhOmJlZm9yZSB7IGNvbnRlbnQ6IFwibGlnaHRcIjsgfSc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBTdWJtZW51c1xuXG5cdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAuc3ViLW1lbnUgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK21lbnVfYmcrJzsgJyttZW51X2JnX3JnYmErJyB9Jztcblx0XHRcdFx0Y3NzICs9IG5hdmJhcisnIC5zdWItbWVudSBsaSA+IGE6aG92ZXIsICcrbmF2YmFyKycgLnN1Yi1tZW51IGxpID4gYTpob3Zlcjpmb2N1cywgJztcblx0XHRcdFx0Y3NzICs9IG5hdmJhcisnIC5zdWItbWVudSBsaTpob3ZlciA+IGE6aG92ZXIsICcrbmF2YmFyKycgLnN1Yi1tZW51IGxpLmhvdmVyID4gYTpob3ZlciB7IGNvbG9yOiAnK21lbnVfaG92ZXJfY29sb3IrJzsgYmFja2dyb3VuZC1jb2xvcjogJyttZW51X2JnX2hvdmVyKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLnN1Yi1tZW51IGxpID4gYSwgJytuYXZiYXIrJyAuc3ViLW1lbnUgaW5wdXQgeyBjb2xvcjogJyttZW51X2NvbG9yKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLnN1Yi1tZW51IGlucHV0Ojotd2Via2l0LWlucHV0LXBsYWNlaG9sZGVyIHsgY29sb3I6ICcrbWVudV9jb2xvcl9mYWRlKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLnN1Yi1tZW51IGlucHV0OjotbW96LXBsYWNlaG9sZGVyIHsgY29sb3I6ICcrbWVudV9jb2xvcl9mYWRlKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLnN1Yi1tZW51IGlucHV0Oi1tcy1pbnB1dC1wbGFjZWhvbGRlciB7IGNvbG9yOiAnK21lbnVfY29sb3JfZmFkZSsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IG5hdmJhcisnIC5zdWItbWVudSwgJytuYXZiYXIrJyAuc3ViLW1lbnUgPiBsaSwgJytuYXZiYXIrJyAuc3ViLW1lbnUgPiBsaSA+IGEgeyBib3JkZXItY29sb3I6ICcrbWVudV9ib3JkZXIrJzsgJyttZW51X2JvcmRlcl9yZ2JhKycgfSc7XG5cdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAuc3ViLW1lbnUgbGkgPiBhOmhvdmVyLCAnK25hdmJhcisnIC5zdWItbWVudSAuYWN0aXZlID4gYSwgJytuYXZiYXIrJyAuc3ViLW1lbnUgLmFjdGl2ZSA+IGE6aG92ZXIgeyBjb2xvcjogJyttZW51X2FjY2VudCsnOyB9JztcblxuXHRcdFx0XHQvLyBPdGhlciBFbGVtZW50c1xuXHRcdFx0XHRcblx0XHRcdFx0Y3NzICs9IG5hdmJhcisnIC5uYXYtc2VhcmNoIC5zZWFyY2gtZm9ybSBidXR0b24geyBib3JkZXItY29sb3I6ICcrbWVudV9ib3JkZXIrJzsgJyttZW51X2JvcmRlcl9yZ2JhKycgYmFja2dyb3VuZC1jb2xvcjogJyt0aW55Y29sb3IobWVudV9iZykuZGFya2VuKDMpLnRvU3RyaW5nKCkrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAubmF2LXNlYXJjaCAuc2VhcmNoLWZvcm0gYnV0dG9uLCAkbmF2YmFyIC5uYXYtc2VhcmNoIC5zZWFyY2gtZm9ybSBpbnB1dCB7IGNvbG9yOiAnK21lbnVfY29sb3IrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAuYWNjZW50LWJnIHsgY29sb3I6ICcrY29sb3JfZm9yX2FjY2VudCsnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2FjY2VudCsnOyB9JztcblxuXHRcdFx0XHQvLyBMaWdodCBCYWNrZ3JvdW5kXG5cdFx0XHRcdFxuXHRcdFx0XHRjc3MgKz0gbmF2YmFyX2xpZ2h0KycgLm5hdiA+IGxpID4gYSwgJytuYXZiYXJfbGlnaHQrJyAudGV4dC1jb250LCAnK25hdmJhcl9saWdodCsnIC50ZXh0LWNvbnQgYTpob3ZlciwgJytuYXZiYXJfbGlnaHQrJyAudGV4dC1jb250IGEubm8tY29sb3IgeyBjb2xvcjogJytiZ19saWdodF9jb2xvcisnOyB9Jztcblx0XHRcdFx0aWYgKCBoYXNfaW52X2FjY2VudCApIHtcblx0XHRcdFx0XHRjc3MgKz0gbmF2YmFyX2xpZ2h0KycgLm5hdiA+IGxpOmhvdmVyID4gYSwgJytuYXZiYXJfbGlnaHQrJyAubmF2ID4gbGkuaG92ZXIgPiBhLCAnK25hdmJhcl9saWdodCsnIC5uYXYgPiBsaSA+IGE6aG92ZXIsICcrbmF2YmFyX2xpZ2h0KycgLm5hdiA+IC5hY3RpdmUgPiBhLCAnK25hdmJhcl9saWdodCsnIC50ZXh0LWNvbnQgYSB7IGNvbG9yOiAnK2JnX2xpZ2h0X2FjY2VudCsnOyB9Jztcblx0XHRcdFx0XHRjc3MgKz0gbmF2YmFyX2xpZ2h0KycgLm5hdiA+IC5hY3RpdmUgPiBhOmJlZm9yZSB7IGJhY2tncm91bmQtY29sb3I6ICcrYmdfbGlnaHRfYWNjZW50Kyc7IH0nO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNzcyArPSBuYXZiYXJfbGlnaHQrJyAubmF2YmFyLXRvZ2dsZSAuaWNvbi1iYXIgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2xpZ2h0X2NvbG9yKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gbmF2YmFyX2xpZ2h0KycgLm5hdiA+IGxpLCAnK25hdmJhcl9saWdodCsnIC5uYXYgPiBsaSA+IGEsICcrbmF2YmFyX2xpZ2h0KycgLm5hdmJhci10b2dnbGUgeyBib3JkZXItY29sb3I6ICcrYmdfbGlnaHRfYm9yZGVyKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gbmF2YmFyX2xpZ2h0KycgLmRpdmlkZXIgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2xpZ2h0X2JvcmRlcisnOyB9JztcblxuXHRcdFx0XHQvLyBEYXJrIEJhY2tncm91bmRcblx0XHRcdFx0XG5cdFx0XHRcdGNzcyArPSBuYXZiYXJfZGFyaysnIC5uYXYgPiBsaSA+IGEsICcrbmF2YmFyX2RhcmsrJyAudGV4dC1jb250LCAnK25hdmJhcl9kYXJrKycgLnRleHQtY29udCBhOmhvdmVyLCAnK25hdmJhcl9kYXJrKycgLnRleHQtY29udCBhLm5vLWNvbG9yIHsgY29sb3I6ICcrYmdfZGFya19jb2xvcisnOyB9Jztcblx0XHRcdFx0aWYgKCBoYXNfaW52X2FjY2VudCApIHtcblx0XHRcdFx0XHRjc3MgKz0gbmF2YmFyX2RhcmsrJyAubmF2ID4gbGk6aG92ZXIgPiBhLCAnK25hdmJhcl9kYXJrKycgLm5hdiA+IGxpLmhvdmVyID4gYSwgJytuYXZiYXJfZGFyaysnIC5uYXYgPiBsaSA+IGE6aG92ZXIsICcrbmF2YmFyX2RhcmsrJyAubmF2ID4gLmFjdGl2ZSA+IGEsICcrbmF2YmFyX2RhcmsrJyAudGV4dC1jb250IGEgeyBjb2xvcjogJytiZ19kYXJrX2FjY2VudCsnOyB9Jztcblx0XHRcdFx0XHRjc3MgKz0gbmF2YmFyX2RhcmsrJyAubmF2ID4gLmFjdGl2ZSA+IGE6YmVmb3JlIHsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19kYXJrX2FjY2VudCsnOyB9Jztcblx0XHRcdFx0fVxuXHRcdFx0XHRjc3MgKz0gbmF2YmFyX2RhcmsrJyAubmF2YmFyLXRvZ2dsZSAuaWNvbi1iYXIgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2RhcmtfY29sb3IrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSBuYXZiYXJfZGFyaysnIC5uYXYgPiBsaSwgJytuYXZiYXJfZGFyaysnIC5uYXYgPiBsaSA+IGEsICcrbmF2YmFyX2RhcmsrJyAubmF2YmFyLXRvZ2dsZSB7IGJvcmRlci1jb2xvcjogJytiZ19kYXJrX2JvcmRlcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IG5hdmJhcl9kYXJrKycgLmRpdmlkZXIgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2RhcmtfYm9yZGVyKyc7IH0nO1xuXG5cdFx0XHRcdGlmICggISBoYXNfaW52X2FjY2VudCApIHtcblx0XHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLm5hdiA+IGxpOmhvdmVyID4gYSwgJytuYXZiYXIrJyAubmF2ID4gbGkuaG92ZXIgPiBhLCAnK25hdmJhcisnIC5uYXYgPiBsaSA+IGE6aG92ZXIsICcrbmF2YmFyKycgLm5hdiA+IGxpLmFjdGl2ZSA+IGEsICcrbmF2YmFyKycgLnRleHQtY29udCBhIHsgY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xuXHRcdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAubmF2ID4gLmFjdGl2ZSA+IGE6YmVmb3JlIHsgYmFja2dyb3VuZC1jb2xvcjogJythY2NlbnQrJzsgfSc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBNYWluIE5hdmJhciBNb2JpbGUgU3R5bGluZ1xuXG5cdFx0XHRcdG1haW5fbmF2YmFyICs9ICcubmF2YmFyJztcblxuXHRcdFx0XHRjc3MgKz0gJ0BtZWRpYSAoIG1heC13aWR0aDogJyttaXh0X2N1c3RvbWl6ZS5icmVha3BvaW50cy5tYXJzKydweCApIHsnO1xuXHRcdFx0XHRcdGNzcyArPSBtYWluX25hdmJhcisnIC5uYXZiYXItaW5uZXIgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK21lbnVfYmcrJzsgJyttZW51X2JnX3JnYmErJyB9Jztcblx0XHRcdFx0XHRjc3MgKz0gbWFpbl9uYXZiYXIrJyAubmF2YmFyLWlubmVyIC50ZXh0LWNvbnQsICcrbWFpbl9uYXZiYXIrJyAubmF2YmFyLWlubmVyIC50ZXh0LWNvbnQgYTpob3ZlciwgJyttYWluX25hdmJhcisnIC5uYXZiYXItaW5uZXIgLnRleHQtY29udCBhLm5vLWNvbG9yLCAnK21haW5fbmF2YmFyKycgLm5hdiA+IGxpID4gYSB7IGNvbG9yOiAnK21lbnVfY29sb3IrJzsgfSc7XG5cdFx0XHRcdFx0Y3NzICs9IG1haW5fbmF2YmFyKycgLm5hdiA+IGxpID4gYTpob3ZlciwgJyttYWluX25hdmJhcisnIC5uYXYgPiBsaSA+IGE6aG92ZXI6Zm9jdXMsICcrbWFpbl9uYXZiYXIrJyAubmF2ID4gbGk6aG92ZXIgPiBhOmhvdmVyLCAnO1xuXHRcdFx0XHRcdGNzcyArPSBtYWluX25hdmJhcisnIC5uYXYgPiBsaS5ob3ZlciA+IGE6aG92ZXIsICcrbWFpbl9uYXZiYXIrJyAubmF2ID4gbGkuYWN0aXZlID4gYTpob3ZlciB7IGNvbG9yOiAnK21lbnVfaG92ZXJfY29sb3IrJzsgYmFja2dyb3VuZC1jb2xvcjogJyttZW51X2JnX2hvdmVyKyc7IH0nO1xuXHRcdFx0XHRcdGNzcyArPSBtYWluX25hdmJhcisnIC5uYXYgPiBsaTpob3ZlciA+IGEsICcrbWFpbl9uYXZiYXIrJyAubmF2ID4gbGkuaG92ZXIgPiBhIHsgY29sb3I6ICcrbWVudV9jb2xvcisnOyB9Jztcblx0XHRcdFx0XHRjc3MgKz0gbWFpbl9uYXZiYXIrJyAubmF2IGxpLm5hdi1zZWFyY2g6aG92ZXIgPiBhLCAnK21haW5fbmF2YmFyKycgLm5hdiBsaS5uYXYtc2VhcmNoLmhvdmVyID4gYSB7IGNvbG9yOiAnK21lbnVfY29sb3IrJyAhaW1wb3J0YW50OyBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudCAhaW1wb3J0YW50OyB9Jztcblx0XHRcdFx0XHRjc3MgKz0gbWFpbl9uYXZiYXIrJyAubmF2ID4gbGkuYWN0aXZlID4gYSwgJyttYWluX25hdmJhcisnIC5uYXZiYXItaW5uZXIgLnRleHQtY29udCBhIHsgY29sb3I6ICcrbWVudV9hY2NlbnQrJzsgfSc7XG5cdFx0XHRcdFx0aWYgKCBoYXNfaW52X2FjY2VudCApIHtcblx0XHRcdFx0XHRcdGNzcyArPSBtYWluX25hdmJhcisnIC5uYXYgPiAuYWN0aXZlID4gYTpiZWZvcmUgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK21lbnVfYWNjZW50Kyc7IH0nO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjc3MgKz0gbWFpbl9uYXZiYXIrJyAubmF2YmFyLWlubmVyLCAnK21haW5fbmF2YmFyKycgLm5hdiA+IGxpLCAnK21haW5fbmF2YmFyKycgLm5hdiA+IGxpID4gYSB7IGJvcmRlci1jb2xvcjogJyttZW51X2JvcmRlcisnOyAnK21lbnVfYm9yZGVyX3JnYmErJyB9Jztcblx0XHRcdFx0Y3NzICs9ICd9JztcblxuXHRcdFx0XHRNSVhULnN0eWxlc2hlZXQoJ25hdi10aGVtZS0nK2lkLCBjc3MpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0JCgnLm5hdmJhcicpLnRyaWdnZXIoJ3JlZnJlc2gnKTtcblx0fVxuXHRcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtdGhlbWVzXScsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcblx0XHRcdHVwZGF0ZU5hdlRoZW1lcyh0byk7XG5cdFx0fSk7XG5cdH0pO1xuXG5cdC8vIEdlbmVyYXRlIGN1c3RvbSB0aGVtZXMgaWYgdGhlbWUgaXMgY2hhbmdlZCBmcm9tIG9uZSBvZiB0aGUgZGVmYXVsdHNcblx0ZnVuY3Rpb24gbWF5YmVVcGRhdGVOYXZUaGVtZXMoaWQpIHtcblx0XHRpZiAoIGlkID09ICdhdXRvJyApIGlkID0gdGhlbWVzLnNpdGU7XG5cdFx0aWYgKCAhIF8uaGFzKG1peHRfY3VzdG9taXplLnRoZW1lcywgaWQpICkge1xuXHRcdFx0dmFyIG5hdlRoZW1lcyA9IHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbmF2LXRoZW1lc10nKS5nZXQoKTtcblx0XHRcdHVwZGF0ZU5hdlRoZW1lcyhuYXZUaGVtZXMpO1xuXHRcdH1cblx0fVxuXHQkKCcjbWFpbi1uYXYnKS5vbigndGhlbWUtY2hhbmdlJywgZnVuY3Rpb24oZXZlbnQsIHRoZW1lKSB7XG5cdFx0bWF5YmVVcGRhdGVOYXZUaGVtZXModGhlbWUpO1xuXHR9KTtcblx0JCgnI3NlY29uZC1uYXYnKS5vbigndGhlbWUtY2hhbmdlJywgZnVuY3Rpb24oZXZlbnQsIHRoZW1lKSB7XG5cdFx0bWF5YmVVcGRhdGVOYXZUaGVtZXModGhlbWUpO1xuXHR9KTtcblxufSkoalF1ZXJ5KTsiLCJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXG5DVVNUT01JWkVSIElOVEVHUkFUSU9OIC0gU0lURSBUSEVNRVNcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiggZnVuY3Rpb24oJCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvKiBnbG9iYWwgXywgd3AsIE1JWFQsIG1peHRfY3VzdG9taXplLCB0aW55Y29sb3IgKi9cblxuXHRpZiAoIF8uaXNFbXB0eSh3cC5jdXN0b21pemUoJ21peHRfb3B0W3NpdGUtdGhlbWVzXScpKSApIHJldHVybjtcblx0XG5cdHZhciBkZWZhdWx0cyA9IHtcblx0XHQnYWNjZW50JzogICAgICcjZGQzZTNlJyxcblx0XHQnYmcnOiAgICAgICAgICcjZmZmJyxcblx0XHQnY29sb3InOiAgICAgICcjMzMzJyxcblx0XHQnY29sb3ItaW52JzogICcjZmZmJyxcblx0XHQnYm9yZGVyJzogICAgICcjZGRkJyxcblx0fTtcblxuXHR2YXIgdGhlbWVzID0gTUlYVC50aGVtZXM7XG5cblx0ZnVuY3Rpb24gcGFyc2Vfc2VsZWN0b3IocGF0dGVybiwgc2VsKSB7XG5cdFx0dmFyIHNlbGVjdG9yID0gJyc7XG5cdFx0aWYgKCBfLmlzQXJyYXkoc2VsKSApIHtcblx0XHRcdCQuZWFjaChzZWwsIGZ1bmN0aW9uKGksIHNpbmdsZV9zZWwpIHtcblx0XHRcdFx0c2VsZWN0b3IgKz0gcGF0dGVybi5yZXBsYWNlKC9cXHtcXHtzZWxcXH1cXH0vZywgc2luZ2xlX3NlbCkgKyAnLCc7XG5cdFx0XHR9KTtcblx0XHRcdHNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZSgvLCskLywgJycpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzZWxlY3RvciA9IHBhdHRlcm4ucmVwbGFjZSgvXFx7XFx7c2VsXFx9XFx9L2csIHNlbCk7XG5cdFx0fVxuXHRcdHJldHVybiBzZWxlY3Rvcjtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldF90ZXh0c2hfZm9yX2JnKGJnLCBjb2xvcnMpIHtcblx0XHRjb2xvcnMgPSBjb2xvcnMgfHwgWydyZ2JhKDAsMCwwLDAuMSknLCAncmdiYSgyNTUsMjU1LDI1NSwwLjEpJ107XG5cdFx0aWYgKCB0aW55Y29sb3IoYmcpLmlzTGlnaHQoKSApIHtcblx0XHRcdHJldHVybiBjb2xvcnNbMF07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBjb2xvcnNbMV07XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gYnV0dG9uX2NvbG9yKHNlbCwgY29sb3IsIHByZSkge1xuXHRcdHByZSA9IHByZSB8fCAnLm1peHQnO1xuXG5cdFx0dmFyIGNzcyA9ICcnLFxuXHRcdFx0Y29sb3JfZm9yX2JnID0gdGlueWNvbG9yLm1vc3RSZWFkYWJsZShjb2xvciwgWycjZmZmJywgJyMwMDAnXSkudG9IZXhTdHJpbmcoKSxcblx0XHRcdGJvcmRlcl9jb2xvciA9IHRpbnljb2xvcihjb2xvcikuZGFya2VuKDUpLnRvU3RyaW5nKCksXG5cdFx0XHR0ZXh0X3NoYWRvdyAgPSBzZXRfdGV4dHNoX2Zvcl9iZyhjb2xvciksXG5cdFx0XHRjb2xvcl9kYXJrZXIgPSB0aW55Y29sb3IoY29sb3IpLmRhcmtlbigxMCkudG9TdHJpbmcoKSxcblx0XHRcdGJ0bl9zb2xpZF9ob3Zlcl9iZyxcblx0XHRcdGJ0bl9vdXRsaW5lX2hvdmVyX2JnO1xuXG5cdFx0aWYgKCB0aW55Y29sb3IoY29sb3IpLmlzTGlnaHQoKSApIHtcblx0XHRcdGJ0bl9zb2xpZF9ob3Zlcl9iZyA9IHRpbnljb2xvcihjb2xvcikuZGFya2VuKDUpLnRvU3RyaW5nKCk7XG5cdFx0XHRidG5fb3V0bGluZV9ob3Zlcl9iZyA9ICdyZ2JhKDAsMCwwLDAuMDMpJztcblx0XHR9IGVsc2Uge1xuXHRcdFx0YnRuX3NvbGlkX2hvdmVyX2JnID0gdGlueWNvbG9yKGNvbG9yKS5saWdodGVuKDUpLnRvU3RyaW5nKCk7XG5cdFx0XHRidG5fb3V0bGluZV9ob3Zlcl9iZyA9ICdyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpJztcblx0XHR9XG5cblx0XHQvLyBTb2xpZCBCYWNrZ3JvdW5kXG5cdFx0XG5cdFx0Y3NzICs9IHBhcnNlX3NlbGVjdG9yKHByZSsnIC5idG4te3tzZWx9fScsIHNlbCkgKyAnIHsgYm9yZGVyLWNvbG9yOiAnK2JvcmRlcl9jb2xvcisnOyB0ZXh0LXNoYWRvdzogMCAxcHggMXB4ICcrdGV4dF9zaGFkb3crJzsgYmFja2dyb3VuZC1jb2xvcjogJytjb2xvcisnOyB9Jztcblx0XHRjc3MgKz0gcGFyc2Vfc2VsZWN0b3IocHJlKycgLmJ0bi17e3NlbH19OmhvdmVyLCAnK3ByZSsnIC5idG4te3tzZWx9fTpmb2N1cycsIHNlbCkgKyAnIHsgYmFja2dyb3VuZC1jb2xvcjogJytidG5fc29saWRfaG92ZXJfYmcrJzsgfSc7XG5cdFx0Y3NzICs9IHBhcnNlX3NlbGVjdG9yKHByZSsnIC5idG4taG92ZXIte3tzZWx9fTpob3ZlciwgJytwcmUrJyAuYnRuLWhvdmVyLXt7c2VsfX06Zm9jdXMnLCBzZWwpICsgJyB7IGJvcmRlci1jb2xvcjogJytib3JkZXJfY29sb3IrJzsgdGV4dC1zaGFkb3c6IDAgMXB4IDFweCAnK3RleHRfc2hhZG93Kyc7IGJhY2tncm91bmQtY29sb3I6ICcrY29sb3IrJyAhaW1wb3J0YW50OyB9Jztcblx0XHRjc3MgKz0gcGFyc2Vfc2VsZWN0b3IocHJlKycgLmJ0bi17e3NlbH19OmFjdGl2ZSwgJytwcmUrJyAuYnRuLXt7c2VsfX0uYWN0aXZlLCAnK3ByZSsnIC5idG4taG92ZXIte3tzZWx9fTpob3ZlcjphY3RpdmUsICcrcHJlKycgLmJ0bi1ob3Zlci17e3NlbH19OmhvdmVyLmFjdGl2ZScsIHNlbCkgKyAnIHsgYm9yZGVyLWNvbG9yOiAnK2NvbG9yX2RhcmtlcisnOyBib3gtc2hhZG93OiBpbnNldCAwIDFweCAxMnB4ICcrY29sb3JfZGFya2VyKyc7IH0nO1xuXHRcdGNzcyArPSBwYXJzZV9zZWxlY3RvcihwcmUrJyAuYnRuLXt7c2VsfX0sICcrcHJlKycgYS5idG4te3tzZWx9fSwgJytwcmUrJyAuYnRuLXt7c2VsfX06aG92ZXIsICcrcHJlKycgLmJ0bi17e3NlbH19OmZvY3VzLCAnK3ByZSsnIC5idG4taG92ZXIte3tzZWx9fTpob3ZlciwgJytwcmUrJyBhLmJ0bi1ob3Zlci17e3NlbH19OmhvdmVyLCAnK3ByZSsnIC5idG4taG92ZXIte3tzZWx9fTpmb2N1cycsIHNlbCkgKyAnIHsgY29sb3I6ICcrY29sb3JfZm9yX2JnKyc7IH0nO1xuXG5cdFx0Ly8gT3V0bGluZVxuXHRcdFxuXHRcdGNzcyArPSBwYXJzZV9zZWxlY3RvcihwcmUrJyAuYnRuLW91dGxpbmUte3tzZWx9fTpob3ZlcicsIHNlbCkgKyAnIHsgYmFja2dyb3VuZC1jb2xvcjogJytidG5fb3V0bGluZV9ob3Zlcl9iZysnOyB9Jztcblx0XHRjc3MgKz0gcGFyc2Vfc2VsZWN0b3IocHJlKycgLmJ0bi1vdXRsaW5lLXt7c2VsfX0sICcrcHJlKycgLmJ0bi1ob3Zlci1vdXRsaW5lLXt7c2VsfX06aG92ZXInLCBzZWwpICsgJyB7IGJvcmRlcjogMXB4IHNvbGlkICcrYm9yZGVyX2NvbG9yKyc7IHRleHQtc2hhZG93OiBub25lICFpbXBvcnRhbnQ7IGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50OyB9Jztcblx0XHRjc3MgKz0gcGFyc2Vfc2VsZWN0b3IocHJlKycgLmJ0bi1vdXRsaW5lLXt7c2VsfX06YWN0aXZlLCAnK3ByZSsnIC5idG4tb3V0bGluZS17e3NlbH19LmFjdGl2ZSwgJytwcmUrJyAuYnRuLWhvdmVyLW91dGxpbmUte3tzZWx9fTpob3ZlcjphY3RpdmUsICcrcHJlKycgLmJ0bi1ob3Zlci1vdXRsaW5lLXt7c2VsfX06aG92ZXIuYWN0aXZlJywgc2VsKSArICcgeyBib3gtc2hhZG93OiBpbnNldCAwIDFweCAxNnB4IHJnYmEoMCwwLDAsMC4wNSk7IH0nO1xuXHRcdGNzcyArPSBwYXJzZV9zZWxlY3RvcihwcmUrJyAuYnRuLWhvdmVyLW91dGxpbmUte3tzZWx9fTpob3ZlcicsIHNlbCkgKyAnIHsgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDsgfSc7XG5cdFx0Y3NzICs9IHBhcnNlX3NlbGVjdG9yKHByZSsnIC5idG4tb3V0bGluZS17e3NlbH19LCAnK3ByZSsnIGEuYnRuLW91dGxpbmUte3tzZWx9fSwgJytwcmUrJyAuYnRuLW91dGxpbmUte3tzZWx9fTpob3ZlciwgJytwcmUrJyAuYnRuLW91dGxpbmUte3tzZWx9fTpmb2N1cywgJytwcmUrJyAuYnRuLWhvdmVyLW91dGxpbmUte3tzZWx9fTpob3ZlciwgJytwcmUrJyBhLmJ0bi1ob3Zlci1vdXRsaW5lLXt7c2VsfX06aG92ZXIsICcrcHJlKycgLmJ0bi1ob3Zlci1vdXRsaW5lLXt7c2VsfX06Zm9jdXMnLCBzZWwpICsgJyB7IGNvbG9yOiAnK2NvbG9yKyc7IH0nO1xuXG5cdFx0Ly8gQW5pbWF0aW9uc1xuXG5cdFx0Y3NzICs9IHBhcnNlX3NlbGVjdG9yKHByZSsnIC5idG4tZmlsbC1pbi17e3NlbH19Jywgc2VsKSArICcgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2NvbG9yKycgIWltcG9ydGFudDsgfSc7XG5cdFx0Y3NzICs9IHBhcnNlX3NlbGVjdG9yKHByZSsnIC5idG4tZmlsbC1pbi17e3NlbH19OmhvdmVyLCAnK3ByZSsnIC5idG4tZmlsbC1pbi17e3NlbH19OmZvY3VzLCAnK3ByZSsnIC5idG4tZmlsbC1pbi17e3NlbH19OmFjdGl2ZScsIHNlbCkgKyAnIHsgY29sb3I6ICcrY29sb3JfZm9yX2JnKyc7IGJvcmRlci1jb2xvcjogJytjb2xvcisnOyB0ZXh0LXNoYWRvdzogMCAxcHggMXB4ICcrdGV4dF9zaGFkb3crJzsgfSc7XG5cdFx0Y3NzICs9IHBhcnNlX3NlbGVjdG9yKHByZSsnIC5idG4te3tzZWx9fS5idG4tZmlsbC1pbjpiZWZvcmUnLCBzZWwpICsgJyB7IGJhY2tncm91bmQtY29sb3I6ICcrY29sb3IrJzsgfSc7XG5cdFx0Y3NzICs9IHBhcnNlX3NlbGVjdG9yKHByZSsnIC5idG4tZmlsbC17e3NlbH19OmhvdmVyLCAnK3ByZSsnIC5idG4tZmlsbC17e3NlbH19OmZvY3VzLCAnK3ByZSsnIC5idG4tZmlsbC17e3NlbH19OmFjdGl2ZScsIHNlbCkgKyAnIHsgY29sb3I6ICcrY29sb3JfZm9yX2JnKyc7IGJvcmRlci1jb2xvcjogJytjb2xvcisnOyB0ZXh0LXNoYWRvdzogMCAxcHggMXB4ICcrdGV4dF9zaGFkb3crJzsgfSc7XG5cdFx0Y3NzICs9IHBhcnNlX3NlbGVjdG9yKHByZSsnIC5idG4tZmlsbC17e3NlbH19OmJlZm9yZScsIHNlbCkgKyAnIHsgYmFja2dyb3VuZC1jb2xvcjogJytjb2xvcisnOyB9JztcblxuXHRcdC8vIFdvb0NvbW1lcmNlIEFjY2VudCBCdXR0b25cblx0XHRcblx0XHRpZiAoIF8uaXNBcnJheShzZWwpICYmIF8uY29udGFpbnMoc2VsLCAnYWNjZW50JykgKSB7XG5cdFx0XHRjc3MgKz0gcHJlKycgLndvb2NvbW1lcmNlIC5idXR0b24uYWx0LCAnK3ByZSsnIC53b29jb21tZXJjZSBpbnB1dFt0eXBlPXN1Ym1pdF0uYnV0dG9uLCAnK3ByZSsnIC53b29jb21tZXJjZSAjcmVzcG9uZCBpbnB1dCNzdWJtaXQgeyBjb2xvcjogJytjb2xvcl9mb3JfYmcrJyAhaW1wb3J0YW50OyBib3JkZXItY29sb3I6ICcrYm9yZGVyX2NvbG9yKycgIWltcG9ydGFudDsgdGV4dC1zaGFkb3c6IDAgMXB4IDFweCAnK3RleHRfc2hhZG93KycgIWltcG9ydGFudDsgYmFja2dyb3VuZC1jb2xvcjogJytjb2xvcisnICFpbXBvcnRhbnQ7IH0nO1xuXHRcdFx0Y3NzICs9IHByZSsnIC53b29jb21tZXJjZSAuYnV0dG9uLmFsdDpob3ZlciwgJytwcmUrJyAud29vY29tbWVyY2UgaW5wdXRbdHlwZT1zdWJtaXRdLmJ1dHRvbjpob3ZlciwgJytwcmUrJyAud29vY29tbWVyY2UgI3Jlc3BvbmQgaW5wdXQjc3VibWl0OmhvdmVyLCAnICtcblx0XHRcdFx0ICAgcHJlKycgLndvb2NvbW1lcmNlIC5idXR0b24uYWx0OmZvY3VzLCAnK3ByZSsnIC53b29jb21tZXJjZSBpbnB1dFt0eXBlPXN1Ym1pdF0uYnV0dG9uOmZvY3VzLCAnK3ByZSsnIC53b29jb21tZXJjZSAjcmVzcG9uZCBpbnB1dCNzdWJtaXQ6Zm9jdXMgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2J0bl9zb2xpZF9ob3Zlcl9iZysnICFpbXBvcnRhbnQ7IH0nO1xuXHRcdFx0Y3NzICs9IHByZSsnIC53b29jb21tZXJjZSAuYnV0dG9uLmFsdDphY3RpdmUsICcrcHJlKycgLndvb2NvbW1lcmNlIGlucHV0W3R5cGU9c3VibWl0XS5idXR0b246YWN0aXZlLCAnK3ByZSsnIC53b29jb21tZXJjZSAjcmVzcG9uZCBpbnB1dCNzdWJtaXQ6YWN0aXZlLCAnICtcblx0XHRcdFx0ICAgcHJlKycgLndvb2NvbW1lcmNlIC5idXR0b24uYWx0LmFjdGl2ZSwgJytwcmUrJyAud29vY29tbWVyY2UgaW5wdXRbdHlwZT1zdWJtaXRdLmJ1dHRvbjpmb2N1cywgJytwcmUrJyAud29vY29tbWVyY2UgI3Jlc3BvbmQgaW5wdXQjc3VibWl0LmFjdGl2ZSB7IGJvcmRlci1jb2xvcjogJytjb2xvcl9kYXJrZXIrJyAhaW1wb3J0YW50OyBib3gtc2hhZG93OiBpbnNldCAwIDFweCAxMnB4ICcrY29sb3JfZGFya2VyKycgIWltcG9ydGFudDsgfSc7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNzcztcblx0fVxuXHRcblx0ZnVuY3Rpb24gdXBkYXRlU2l0ZVRoZW1lcyhkYXRhKSB7XG5cdFx0JC5lYWNoKGRhdGEsIGZ1bmN0aW9uKGlkLCB0aGVtZSkge1xuXHRcdFx0dmFyIGNzcztcblxuXHRcdFx0Ly8gR2VuZXJhdGUgdGhlbWUgaWYgaXQncyBpbiB1c2Vcblx0XHRcdGlmICggdGhlbWVzLnNpdGUgPT0gaWQgKSB7XG5cblx0XHRcdFx0dmFyIHRoID0gJy50aGVtZS0nK2lkLFxuXHRcdFx0XHRcdGJvZHlfdGggPSAnLmJvZHktdGhlbWUtJytpZCxcblxuXHRcdFx0XHRcdGFjY2VudCA9IHRoZW1lLmFjY2VudCB8fCBkZWZhdWx0cy5hY2NlbnQsXG5cdFx0XHRcdFx0YWNjZW50X2RhcmtlciA9IHRpbnljb2xvcihhY2NlbnQpLmRhcmtlbigxMCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XHRjb2xvcl9mb3JfYWNjZW50ID0gdGlueWNvbG9yLm1vc3RSZWFkYWJsZShhY2NlbnQsIFsnI2ZmZicsICcjMDAwJ10pLnRvSGV4U3RyaW5nKCksXG5cdFx0XHRcdFx0dGV4dHNoX2Zvcl9hY2NlbnQgPSBzZXRfdGV4dHNoX2Zvcl9iZyhhY2NlbnQpLFxuXG5cdFx0XHRcdFx0YmcgPSB0aGVtZS5iZyB8fCBkZWZhdWx0cy5iZyxcblx0XHRcdFx0XHRiZ19kYXJrZXIgPSB0aW55Y29sb3IoYmcpLmRhcmtlbigzKS50b1N0cmluZygpLFxuXHRcdFx0XHRcdGJnX2xpZ2h0ZXIgPSB0aW55Y29sb3IoYmcpLmxpZ2h0ZW4oMykudG9TdHJpbmcoKSxcblx0XHRcdFx0XHRiZ19kYXJrID0gdGhlbWVbJ2JnLWRhcmsnXSA9PSAnMScsXG5cblx0XHRcdFx0XHRib3JkZXIgPSB0aGVtZS5ib3JkZXIgfHwgZGVmYXVsdHMuYm9yZGVyLFxuXG5cdFx0XHRcdFx0Y29sb3IgPSB0aGVtZS5jb2xvciB8fCBkZWZhdWx0cy5jb2xvcixcblx0XHRcdFx0XHRjb2xvcl9mYWRlID0gdGhlbWVbJ2NvbG9yLWZhZGUnXSB8fCB0aW55Y29sb3IoY29sb3IpLmxpZ2h0ZW4oMjApLnRvU3RyaW5nKCksXG5cdFx0XHRcdFx0Y29sb3JfaW52ID0gdGhlbWVbJ2NvbG9yLWludiddIHx8IGRlZmF1bHRzWydjb2xvci1pbnYnXSxcblx0XHRcdFx0XHRjb2xvcl9pbnZfZmFkZSA9IHRoZW1lWydjb2xvci1pbnYtZmFkZSddIHx8IHRpbnljb2xvcihjb2xvcl9pbnYpLmRhcmtlbig0MCkudG9TdHJpbmcoKSxcblxuXHRcdFx0XHRcdGJnX2FsdCA9IHRoZW1lWydiZy1hbHQnXSB8fCBiZ19kYXJrZXIsXG5cdFx0XHRcdFx0Y29sb3JfYWx0ID0gdGhlbWVbJ2NvbG9yLWFsdCddIHx8IHRpbnljb2xvci5tb3N0UmVhZGFibGUoYmdfYWx0LCBbY29sb3IsIGNvbG9yX2ludl0pLnRvSGV4U3RyaW5nKCksXG5cdFx0XHRcdFx0Ym9yZGVyX2FsdCA9IHRoZW1lWydib3JkZXItYWx0J10gfHwgYm9yZGVyLFxuXG5cdFx0XHRcdFx0YmdfaW52ID0gdGhlbWVbJ2JnLWludiddIHx8IHRpbnljb2xvcihiZykuc3BpbigxODApLnRvU3RyaW5nKCksXG5cdFx0XHRcdFx0Ym9yZGVyX2ludiA9IHRoZW1lWydib3JkZXItaW52J10gfHwgdGlueWNvbG9yKGJnKS5kYXJrZW4oMTApLnRvU3RyaW5nKCksXG5cblx0XHRcdFx0XHRiZ19saWdodF9jb2xvciwgYmdfbGlnaHRfY29sb3JfZmFkZSxcblx0XHRcdFx0XHRiZ19kYXJrX2NvbG9yLCBiZ19kYXJrX2NvbG9yX2ZhZGU7XG5cblx0XHRcdFx0Ly8gU2V0IFRleHQgQ29sb3JzIEFjY29yZGluZyBUbyBUaGUgQmFja2dyb3VuZCBDb2xvclxuXG5cdFx0XHRcdGlmICggYmdfZGFyayApIHtcblx0XHRcdFx0XHRiZ19saWdodF9jb2xvciA9IGNvbG9yX2ludjtcblx0XHRcdFx0XHRiZ19saWdodF9jb2xvcl9mYWRlID0gY29sb3JfaW52X2ZhZGU7XG5cblx0XHRcdFx0XHRiZ19kYXJrX2NvbG9yID0gY29sb3I7XG5cdFx0XHRcdFx0YmdfZGFya19jb2xvcl9mYWRlID0gY29sb3JfZmFkZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRiZ19saWdodF9jb2xvciA9IGNvbG9yO1xuXHRcdFx0XHRcdGJnX2xpZ2h0X2NvbG9yX2ZhZGUgPSBjb2xvcl9mYWRlO1xuXG5cdFx0XHRcdFx0YmdfZGFya19jb2xvciA9IGNvbG9yX2ludjtcblx0XHRcdFx0XHRiZ19kYXJrX2NvbG9yX2ZhZGUgPSBjb2xvcl9pbnZfZmFkZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFNUQVJUIENTUyBSVUxFU1xuXG5cdFx0XHRcdC8vIE1haW4gQmFja2dyb3VuZCBDb2xvclxuXHRcdFx0XHRcblx0XHRcdFx0Y3NzID0gdGgrJyB7IGJhY2tncm91bmQtY29sb3I6ICcrYmcrJzsgfSc7XG5cblx0XHRcdFx0Ly8gSGVscGVyIENsYXNzZXNcblx0XHRcdFx0XG5cdFx0XHRcdGNzcyArPSB0aCsnIC50aGVtZS1iZyB7IGJhY2tncm91bmQtY29sb3I6ICcrYmcrJzsgfSc7XG5cblx0XHRcdFx0Y3NzICs9IHRoKycgLnRoZW1lLWNvbG9yIHsgY29sb3I6ICcrY29sb3IrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC50aGVtZS1jb2xvci1mYWRlIHsgY29sb3I6ICcrY29sb3JfZmFkZSsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLnRoZW1lLWNvbG9yLWludiB7IGNvbG9yOiAnK2NvbG9yX2ludisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLnRoZW1lLWNvbG9yLWludi1mYWRlIHsgY29sb3I6ICcrY29sb3JfaW52X2ZhZGUrJzsgfSc7XG5cblx0XHRcdFx0Y3NzICs9IHRoKycgLnRoZW1lLWJnLWxpZ2h0LWNvbG9yIHsgY29sb3I6ICcrYmdfbGlnaHRfY29sb3IrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC50aGVtZS1iZy1saWdodC1jb2xvci1mYWRlIHsgY29sb3I6ICcrYmdfbGlnaHRfY29sb3JfZmFkZSsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLnRoZW1lLWJnLWRhcmstY29sb3IgeyBjb2xvcjogJytiZ19kYXJrX2NvbG9yKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAudGhlbWUtYmctZGFyay1jb2xvci1mYWRlIHsgY29sb3I6ICcrYmdfZGFya19jb2xvcl9mYWRlKyc7IH0nO1xuXG5cdFx0XHRcdGNzcyArPSB0aCsnIC5hY2NlbnQtY29sb3IgeyBjb2xvcjogJythY2NlbnQrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC5hY2NlbnQtYmcsICcrdGgrJyAudGhlbWUtc2VjdGlvbi1hY2NlbnQgeyBjb2xvcjogJytjb2xvcl9mb3JfYWNjZW50Kyc7IGJhY2tncm91bmQtY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xuXG5cdFx0XHRcdGNzcyArPSB0aCsnIC50aGVtZS1iZCB7IGJvcmRlci1jb2xvcjogJytib3JkZXIrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC50aGVtZS1hY2NlbnQtYmQgeyBib3JkZXItY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xuXG5cdFx0XHRcdC8vIFRoZW1lIFNlY3Rpb24gQ29sb3JzXG5cdFx0XHRcdFxuXHRcdFx0XHRjc3MgKz0gdGgrJyAudGhlbWUtc2VjdGlvbi1tYWluIHsgY29sb3I6ICcrY29sb3IrJzsgYmFja2dyb3VuZC1jb2xvcjogJytiZysnOyBib3JkZXItY29sb3I6ICcrYm9yZGVyKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAudGhlbWUtc2VjdGlvbi1hbHQgeyBjb2xvcjogJytjb2xvcl9hbHQrJzsgYm9yZGVyLWNvbG9yOiAnK2JvcmRlcl9hbHQrJzsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19hbHQrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC50aGVtZS1zZWN0aW9uLWFjY2VudCB7IGJvcmRlci1jb2xvcjogJythY2NlbnRfZGFya2VyKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAudGhlbWUtc2VjdGlvbi1pbnYgeyBjb2xvcjogJytjb2xvcl9pbnYrJzsgYm9yZGVyLWNvbG9yOiAnK2JvcmRlcl9pbnYrJzsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19pbnYrJzsgfSc7XG5cblx0XHRcdFx0Ly8gVGV4dCBDb2xvcnNcblx0XHRcdFx0XG5cdFx0XHRcdGNzcyArPSB0aCsnICNjb250ZW50LXdyYXAgeyBjb2xvcjogJytjb2xvcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgYSwgJyt0aCsnIC5wb3N0LW1ldGEgYTpob3ZlciwgJyt0aCsnICNicmVhZGNydW1icyBhOmhvdmVyLCAnK3RoKycgLnBhZ2VyIGE6aG92ZXIsICcrdGgrJyAucGFnZXIgbGkgPiBzcGFuLCAnK3RoKycgLmhvdmVyLWFjY2VudC1jb2xvcjpob3ZlciB7IGNvbG9yOiAnK2FjY2VudCsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLnBvc3QtbWV0YSBhLCAnK3RoKycgLnBvc3QtbWV0YSA+IHNwYW4geyBjb2xvcjogJytjb2xvcl9mYWRlKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAuaGVhZC1tZWRpYS5iZy1saWdodCAuY29udGFpbmVyLCAnK3RoKycgLmhlYWQtbWVkaWEuYmctbGlnaHQgLm1lZGlhLWlubmVyID4gYSwgJyt0aCsnIC5oZWFkLW1lZGlhLmJnLWxpZ2h0IC5oZWFkZXItc2Nyb2xsLCAnK3RoKycgLmhlYWQtbWVkaWEuYmctbGlnaHQgI2JyZWFkY3J1bWJzID4gbGkgKyBsaTpiZWZvcmUgeyBjb2xvcjogJytiZ19saWdodF9jb2xvcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLmhlYWQtbWVkaWEuYmctZGFyayAuY29udGFpbmVyLCAnK3RoKycgLmhlYWQtbWVkaWEuYmctZGFyayAubWVkaWEtaW5uZXIgPiBhLCAnK3RoKycgLmhlYWQtbWVkaWEuYmctZGFyayAuaGVhZGVyLXNjcm9sbCwgJyt0aCsnIC5oZWFkLW1lZGlhLmJnLWRhcmsgI2JyZWFkY3J1bWJzID4gbGkgKyBsaTpiZWZvcmUgeyBjb2xvcjogJytiZ19kYXJrX2NvbG9yKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAucG9zdC1yZWxhdGVkIC5yZWxhdGVkLXRpdGxlIHsgY29sb3I6ICcrYmdfZGFya19jb2xvcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLmxpbmstbGlzdCBsaSBhIHsgY29sb3I6ICcrY29sb3JfZmFkZSsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLmxpbmstbGlzdCBsaSBhOmhvdmVyLCAnK3RoKycgLmxpbmstbGlzdCBsaSBhOmFjdGl2ZSwgJyt0aCsnIC5saW5rLWxpc3QgbGkuYWN0aXZlID4gYSB7IGNvbG9yOiAnK2FjY2VudCsnOyB9JztcblxuXHRcdFx0XHQvLyBCb3JkZXIgQ29sb3JzXG5cdFx0XHRcdFxuXHRcdFx0XHRjc3MgKz0gdGgrJywgJyt0aCsnICNjb250ZW50LXdyYXAsICcrdGgrJyAuc2lkZWJhciB1bCwgJyt0aCsnIC5wb3N0LWZlYXQuZmVhdC1mb3JtYXQsICcrdGgrJyAud3AtY2FwdGlvbiwgJyt0aCsnIGhyIHsgYm9yZGVyLWNvbG9yOiAnK2JvcmRlcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLmNvbW1lbnQtbGlzdCBsaS5ieXBvc3RhdXRob3IgeyBib3JkZXItbGVmdC1jb2xvcjogJythY2NlbnQrJzsgfSc7XG5cblxuXHRcdFx0XHQvLyBCYWNrZ3JvdW5kIENvbG9yc1xuXHRcdFx0XHRcblx0XHRcdFx0Y3NzICs9IHRoKycgLmFjY2VudC1iZzpob3ZlciwgJyt0aCsnIC5ob3Zlci1hY2NlbnQtYmc6aG92ZXIsICcrdGgrJyAudGFnLWxpc3QgYTpob3ZlciwgJyt0aCsnIC50YWdjbG91ZCBhOmhvdmVyIHsgY29sb3I6ICcrY29sb3JfZm9yX2FjY2VudCsnICFpbXBvcnRhbnQ7IGJhY2tncm91bmQtY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAuYXJ0aWNsZSAucG9zdC1pbmZvIC5wb3N0LWRhdGUgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2RhcmtlcisnOyB9JztcblxuXHRcdFx0XHQvLyBPdGhlciBDb2xvcnNcblx0XHRcdFx0XG5cdFx0XHRcdGNzcyArPSB0aCsnIDo6c2VsZWN0aW9uIHsgb3BhY2l0eTogMC44OyBiYWNrZ3JvdW5kOiAnK2FjY2VudCsnOyBjb2xvcjogJytjb2xvcl9mb3JfYWNjZW50Kyc7IH0nO1xuXG5cdFx0XHRcdGNzcyArPSB0aCsnIGJsb2NrcXVvdGUgeyBib3JkZXItY29sb3I6ICcrYm9yZGVyKyc7IGJvcmRlci1sZWZ0LWNvbG9yOiAnK2FjY2VudCsnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2RhcmtlcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgYmxvY2txdW90ZSBjaXRlIHsgY29sb3I6ICcrY29sb3JfZmFkZSsnOyB9JztcblxuXHRcdFx0XHRjc3MgKz0gdGgrJyAuc2lkZWJhciAuY2hpbGQtcGFnZS1uYXYgbGkgYTpob3ZlciwgJyt0aCsnIC53aWRnZXQtYXJlYSAubmF2IGxpIGE6aG92ZXIgeyBjb2xvcjogJythY2NlbnQrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC5zaWRlYmFyIC5jaGlsZC1wYWdlLW5hdiAuY3VycmVudF9wYWdlX2l0ZW0sICcrdGgrJyAuc2lkZWJhciAuY2hpbGQtcGFnZS1uYXYgLmN1cnJlbnRfcGFnZV9pdGVtOmJlZm9yZSB7IGJhY2tncm91bmQtY29sb3I6ICcrYmdfZGFya2VyKyc7IH0nO1xuXG5cdFx0XHRcdC8vIEJvb3RzdHJhcCBFbGVtZW50c1xuXG5cdFx0XHRcdGNzcyArPSB0aCsnIC5hbGVydC1kZWZhdWx0IHsgY29sb3I6ICcrY29sb3IrJzsgYm9yZGVyLWNvbG9yOiAnK2JvcmRlcisnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2RhcmtlcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLmFsZXJ0LWRlZmF1bHQgYSB7IGNvbG9yOiAnK2FjY2VudCsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLnBhbmVsIHsgYm9yZGVyLWNvbG9yOiAnK2JvcmRlcisnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2xpZ2h0ZXIrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC53ZWxsIHsgYm9yZGVyLWNvbG9yOiAnK2JvcmRlcisnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2RhcmtlcisnOyB9JztcblxuXHRcdFx0XHQvLyBCYWNrZ3JvdW5kIFZhcmlhbnRzXG5cdFx0XHRcdFxuXHRcdFx0XHRjc3MgKz0gdGgrJyAuYmctbGlnaHQgeyBjb2xvcjogJytiZ19saWdodF9jb2xvcisnOyB9ICcrdGgrJyAuYmctbGlnaHQgLnRleHQtZmFkZSB7IGNvbG9yOiAnK2JnX2xpZ2h0X2NvbG9yX2ZhZGUrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC5iZy1kYXJrIHsgY29sb3I6ICcrYmdfZGFya19jb2xvcisnOyB9ICcrdGgrJyAuYmctZGFyayAudGV4dC1mYWRlIHsgY29sb3I6ICcrYmdfZGFya19jb2xvcl9mYWRlKyc7IH0nO1xuXG5cdFx0XHRcdC8vIElucHV0c1xuXHRcdFx0XHRcblx0XHRcdFx0Y3NzICs9IHRoKycgaW5wdXQ6bm90KFt0eXBlPXN1Ym1pdF0pOm5vdChbdHlwZT1idXR0b25dKTpub3QoLmJ0biksICcrdGgrJyBzZWxlY3QsICcrdGgrJyB0ZXh0YXJlYSwgJyt0aCsnIC5mb3JtLWNvbnRyb2wsICcgK1xuXHRcdFx0XHRcdCAgIHRoKycgLnBvc3QtcGFzc3dvcmQtZm9ybSBpbnB1dFt0eXBlPVwicGFzc3dvcmRcIl0sICcrdGgrJyAud29vY29tbWVyY2UgLmlucHV0LXRleHQgeyBjb2xvcjogJytjb2xvcisnOyBib3JkZXItY29sb3I6ICcrYm9yZGVyKyc7IGJhY2tncm91bmQtY29sb3I6ICcrYmdfZGFya2VyKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyBpbnB1dDpub3QoW3R5cGU9c3VibWl0XSk6bm90KFt0eXBlPWJ1dHRvbl0pOm5vdCguYnRuKTpmb2N1cywgJyt0aCsnIHNlbGVjdDpmb2N1cywgJyt0aCsnIHRleHRhcmVhOmZvY3VzLCAnK3RoKycgLmZvcm0tY29udHJvbDpmb2N1cywgJyArXG5cdFx0XHRcdFx0ICAgdGgrJyAucG9zdC1wYXNzd29yZC1mb3JtIGlucHV0W3R5cGU9XCJwYXNzd29yZFwiXTpmb2N1cywgJyt0aCsnIC53b29jb21tZXJjZSAuaW5wdXQtdGV4dDpmb2N1cyB7IGJvcmRlci1jb2xvcjogJyt0aW55Y29sb3IoYm9yZGVyKS5saWdodGVuKDIpLnRvU3RyaW5nKCkrJzsgYmFja2dyb3VuZC1jb2xvcjogJyt0aW55Y29sb3IoYmcpLmxpZ2h0ZW4oMikudG9TdHJpbmcoKSsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgaW5wdXQ6Oi13ZWJraXQtaW5wdXQtcGxhY2Vob2xkZXIsICcrdGgrJyAuZm9ybS1jb250cm9sOjotd2Via2l0LWlucHV0LXBsYWNlaG9sZGVyIHsgY29sb3I6ICcrY29sb3JfZmFkZSsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgaW5wdXQ6Oi1tb3otcGxhY2Vob2xkZXIsICcrdGgrJyAuZm9ybS1jb250cm9sOjotbW96LXBsYWNlaG9sZGVyIHsgY29sb3I6ICcrY29sb3JfZmFkZSsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgaW5wdXQ6LW1zLWlucHV0LXBsYWNlaG9sZGVyLCAnK3RoKycgLmZvcm0tY29udHJvbDotbXMtaW5wdXQtcGxhY2Vob2xkZXIgeyBjb2xvcjogJytjb2xvcl9mYWRlKyc7IH0nO1xuXHRcdFx0XHRpZiAoIGJnX2RhcmsgKSB7XG5cdFx0XHRcdFx0Y3NzICs9IHRoKycgc2VsZWN0LCAubWl4dCAnK3RoKycgLnNlbGVjdDItY29udGFpbmVyIC5zZWxlY3QyLWFycm93IGI6YWZ0ZXIgeyBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCInK21peHRfY3VzdG9taXplWydtaXh0LXVyaSddKycvYXNzZXRzL2ltZy9pY29ucy9zZWxlY3QtYXJyb3ctbGlnaHQucG5nXCIpOyB9Jztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEJ1dHRvbnNcblx0XHRcdFx0XG5cdFx0XHRcdGNzcyArPSBidXR0b25fY29sb3IoWydwcmltYXJ5JywgJ2FjY2VudCddLCBhY2NlbnQsIHRoKTtcblx0XHRcdFx0Y3NzICs9IGJ1dHRvbl9jb2xvcignbWluaW1hbCcsIGJnX2RhcmtlciwgdGgpO1xuXG5cdFx0XHRcdC8vIEVsZW1lbnQgQ29sb3JzXG5cdFx0XHRcdFxuXHRcdFx0XHRjc3MgKz0gdGgrJyAubWl4dC1zdGF0LnR5cGUtYm94LCAnK3RoKycgLm1peHQtaGVhZGxpbmUgc3Bhbi5jb2xvci1hdXRvOmFmdGVyLCAnK3RoKycgLm1peHQtdGltZWxpbmUgLnRpbWVsaW5lLWJsb2NrOmJlZm9yZSB7IGJvcmRlci1jb2xvcjogJytib3JkZXIrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC5taXh0LXJvdy1zZXBhcmF0b3Iubm8tZmlsbCBzdmcgeyBmaWxsOiAnK2JnKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAubWl4dC1tYXAgeyBjb2xvcjogJytiZ19saWdodF9jb2xvcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLm1peHQtZmxpcGNhcmQgPiAuaW5uZXIgPiAuYWNjZW50IHsgY29sb3I6ICcrY29sb3JfZm9yX2FjY2VudCsnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2FjY2VudCsnOyBib3JkZXItY29sb3I6ICcrYWNjZW50X2RhcmtlcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLm1peHQtcHJpY2luZy5hY2NlbnQgLm1peHQtcHJpY2luZy1pbm5lciAuaGVhZGVyIHsgY29sb3I6ICcrY29sb3JfZm9yX2FjY2VudCsnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2FjY2VudCsnOyBib3gtc2hhZG93OiAwIDAgMCAxcHggJythY2NlbnRfZGFya2VyKyc7IHRleHQtc2hhZG93OiAwIDFweCAxcHggJyt0ZXh0c2hfZm9yX2FjY2VudCsnOyB9Jztcblx0XHRcdFx0Ly8gQWNjZW50IENvbG9yIFZhcmlhbnRzXG5cdFx0XHRcdGNzcyArPSB0aCsnIC5taXh0LWljb24gaS5hY2NlbnQsICcrdGgrJyAubWl4dC1zdGF0LmNvbG9yLW91dGxpbmUuYWNjZW50IHsgY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xuXHRcdFx0XHQvLyBBY2NlbnQgQm9yZGVyIFZhcmlhbnRzXG5cdFx0XHRcdGNzcyArPSB0aCsnIC5taXh0LWljb24uaWNvbi1vdXRsaW5lLmFjY2VudCwgJyArXG5cdFx0XHRcdFx0ICAgdGgrJyAubWl4dC1zdGF0LmNvbG9yLW91dGxpbmUuYWNjZW50LCAnICtcblx0XHRcdFx0XHQgICB0aCsnIC5taXh0LWljb25ib3ggLmlubmVyLmJvcmRlcmVkLmFjY2VudCwgJyArXG5cdFx0XHRcdFx0ICAgdGgrJyAubWl4dC1pbWFnZSAuaW1hZ2Utd3JhcC5hY2NlbnQgeyBib3JkZXItY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xuXHRcdFx0XHQvLyBBY2NlbnQgQmcgVmFyaWFudHNcblx0XHRcdFx0Y3NzICs9IHRoKycgLm1peHQtc3RhdC5jb2xvci1iZy5hY2NlbnQsICcgK1xuXHRcdFx0XHRcdCAgIHRoKycgLm1peHQtaWNvbi5pY29uLXNvbGlkLmFjY2VudCwgJyArXG5cdFx0XHRcdFx0ICAgdGgrJyAubWl4dC1pY29uYm94IC5pbm5lci5zb2xpZC5hY2NlbnQsICcgK1xuXHRcdFx0XHRcdCAgIHRoKycgLm1peHQtcmV2aWV3LmJveGVkLmFjY2VudCwgJyArXG5cdFx0XHRcdFx0ICAgdGgrJyAubWl4dC1yZXZpZXcuYnViYmxlIC5yZXZpZXctY29udGVudC5hY2NlbnQsICcgK1xuXHRcdFx0XHRcdCAgIHRoKycgLm1peHQtcmV2aWV3LmJ1YmJsZSAucmV2aWV3LWNvbnRlbnQuYWNjZW50OmJlZm9yZSwgJyArXG5cdFx0XHRcdFx0ICAgdGgrJyAubWl4dC10aW1lbGluZSAudGltZWxpbmUtYmxvY2sgLmNvbnRlbnQuYm94ZWQuYWNjZW50LCAnICtcblx0XHRcdFx0XHQgICB0aCsnIC5taXh0LXRpbWVsaW5lIC50aW1lbGluZS1ibG9jayAuY29udGVudC5idWJibGUuYWNjZW50LCAnICtcblx0XHRcdFx0XHQgICB0aCsnIC5taXh0LXRpbWVsaW5lIC50aW1lbGluZS1ibG9jayAuY29udGVudC5idWJibGUuYWNjZW50OmJlZm9yZSwgJyArXG5cdFx0XHRcdFx0ICAgdGgrJyAuaG92ZXItY29udGVudCAub24taG92ZXIuYWNjZW50IHsgY29sb3I6ICcrY29sb3JfZm9yX2FjY2VudCsnOyBib3JkZXItY29sb3I6ICcrYWNjZW50X2RhcmtlcisnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2FjY2VudCsnOyB0ZXh0LXNoYWRvdzogMCAxcHggMXB4ICcrdGV4dHNoX2Zvcl9hY2NlbnQrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC5taXh0LWljb24uaWNvbi1zb2xpZC5hY2NlbnQuYW5pbS1pbnZlcnQ6aG92ZXIsICcrdGgrJyAuaWNvbi1jb250OmhvdmVyIC5taXh0LWljb24uaWNvbi1zb2xpZC5hY2NlbnQuYW5pbS1pbnZlcnQgeyBjb2xvcjogJythY2NlbnQrJzsgYm9yZGVyLWNvbG9yOiAnK2FjY2VudF9kYXJrZXIrJzsgYmFja2dyb3VuZC1jb2xvcjogJytjb2xvcl9mb3JfYWNjZW50Kyc7IHRleHQtc2hhZG93OiAwIDFweCAxcHggJytzZXRfdGV4dHNoX2Zvcl9iZyhjb2xvcl9mb3JfYWNjZW50KSsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLmhvdmVyLWNvbnRlbnQgLm9uLWhvdmVyLmFjY2VudCB7IGJhY2tncm91bmQtY29sb3I6ICcrdGlueWNvbG9yKGFjY2VudCkuc2V0QWxwaGEoMC43NSkudG9QZXJjZW50YWdlUmdiU3RyaW5nKCkrJzsgfSc7XG5cblx0XHRcdFx0Ly8gUGx1Z2luIENvbG9yc1xuXG5cdFx0XHRcdC8vIExpZ2h0U2xpZGVyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC5sU1NsaWRlT3V0ZXIgLmxTUGFnZXIubFNwZyA+IGxpOmhvdmVyIGEsICcrdGgrJyAubFNTbGlkZU91dGVyIC5sU1BhZ2VyLmxTcGcgPiBsaS5hY3RpdmUgYSB7IGJhY2tncm91bmQtY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xuXG5cdFx0XHRcdC8vIExpZ2h0R2FsbGVyeVxuXHRcdFx0XHRjc3MgKz0gYm9keV90aCsnIC5sZy1vdXRlciAubGctdGh1bWItaXRlbS5hY3RpdmUsICcrYm9keV90aCsnIC5sZy1vdXRlciAubGctdGh1bWItaXRlbTpob3ZlciB7IGJvcmRlci1jb2xvcjogJythY2NlbnQrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSBib2R5X3RoKycgLmxnLXByb2dyZXNzLWJhciAubGctcHJvZ3Jlc3MgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2FjY2VudCsnOyB9JztcblxuXHRcdFx0XHQvLyBTZWxlY3QyXG5cdFx0XHRcdGNzcyArPSBib2R5X3RoKycgLnNlbGVjdDItY29udGFpbmVyIGEuc2VsZWN0Mi1jaG9pY2UsICcrYm9keV90aCsnIC5zZWxlY3QyLWRyb3AsICcrYm9keV90aCsnIC5zZWxlY3QyLWRyb3Auc2VsZWN0Mi1kcm9wLWFjdGl2ZSB7IGNvbG9yOiAnK2NvbG9yKyc7IGJvcmRlci1jb2xvcjogJytib3JkZXIrJzsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19kYXJrZXIrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSBib2R5X3RoKycgLnNlbGVjdDItcmVzdWx0cyB7IGJhY2tncm91bmQtY29sb3I6ICcrYmdfZGFya2VyKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gYm9keV90aCsnIC5zZWxlY3QyLXJlc3VsdHMgLnNlbGVjdDItaGlnaGxpZ2h0ZWQgeyBjb2xvcjogJytjb2xvcisnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2xpZ2h0ZXIrJzsgfSc7XG5cblx0XHRcdFx0Ly8gVmlzdWFsIENvbXBvc2VyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC53cGJfY29udGVudF9lbGVtZW50IC53cGJfdG91cl90YWJzX3dyYXBwZXIgLndwYl90YWJzX25hdiBhOmhvdmVyLCAnK3RoKycgLndwYl9jb250ZW50X2VsZW1lbnQgLndwYl9hY2NvcmRpb25faGVhZGVyIGE6aG92ZXIgeyBjb2xvcjogJythY2NlbnQrJzsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC52Y19zZXBhcmF0b3IudGhlbWUtYmQgLnZjX3NlcF9ob2xkZXIgLnZjX3NlcF9saW5lIHsgYm9yZGVyLWNvbG9yOiAnK2JvcmRlcisnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLm1peHQtZ3JpZC1pdGVtIC5naXRlbS10aXRsZS1jb250IHsgY29sb3I6ICcrY29sb3IrJzsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19saWdodGVyKyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAudmNfdHRhLnZjX3R0YS1zdHlsZS1jbGFzc2ljOm5vdCgudmNfdHRhLW8tbm8tZmlsbCkgLnZjX3R0YS1wYW5lbC1ib2R5LCAnK3RoKycgLnZjX3R0YS52Y190dGEtc3R5bGUtbW9kZXJuOm5vdCgudmNfdHRhLW8tbm8tZmlsbCkgLnZjX3R0YS1wYW5lbC1ib2R5IHsgY29sb3I6ICcrYmdfbGlnaHRfY29sb3IrJzsgfSc7XG5cblx0XHRcdFx0Ly8gV29vQ29tbWVyY2Vcblx0XHRcdFx0Y3NzICs9IHRoKycgLndvb2NvbW1lcmNlIC5wcmljZSAuYW1vdW50LCAnK3RoKycgLndvb2NvbW1lcmNlIC50b3RhbCAuYW1vdW50LCAnK3RoKycgLndvb2NvbW1lcmNlIC53b28tY2FydCAuYW1vdW50LCAnK3RoKycgLndvb2NvbW1lcmNlIC5uYXYgbGkgLmFtb3VudCB7IGNvbG9yOiAnK2FjY2VudCsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLndvb2NvbW1lcmNlIC5uYXYgbGkgZGVsIC5hbW91bnQsICcrdGgrJyAud29vY29tbWVyY2UgI3Jldmlld3MgI2NvbW1lbnRzIG9sLmNvbW1lbnRsaXN0IGxpIC5tZXRhIHsgY29sb3I6ICcrY29sb3JfZmFkZSsnOyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLndvb2NvbW1lcmNlIC53aWRnZXRfcHJpY2VfZmlsdGVyIC51aS1zbGlkZXIgLnVpLXNsaWRlci1yYW5nZSB7IGJhY2tncm91bmQtY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAud29vY29tbWVyY2UgLmJhZGdlLWNvbnQgLmJhZGdlLnNhbGUtYmFkZ2UgeyBjb2xvcjogJytjb2xvcl9mb3JfYWNjZW50Kyc7IGJhY2tncm91bmQtY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAud29vY29tbWVyY2UgLndvb2NvbW1lcmNlLXRhYnMgdWwudGFicyBsaSBhIHsgY29sb3I6ICcrY29sb3JfZmFkZSsnICFpbXBvcnRhbnQ7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAud29vY29tbWVyY2UgLndvb2NvbW1lcmNlLXRhYnMgdWwudGFicyBsaS5hY3RpdmUgeyBib3JkZXItYm90dG9tLWNvbG9yOiAnK2JnKycgIWltcG9ydGFudDsgfSc7XG5cdFx0XHRcdGNzcyArPSB0aCsnIC53b29jb21tZXJjZSAud29vY29tbWVyY2UtdGFicyB1bC50YWJzIGxpLmFjdGl2ZSBhIHsgY29sb3I6ICcrY29sb3IrJyAhaW1wb3J0YW50OyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLndvb2NvbW1lcmNlIC53b29jb21tZXJjZS10YWJzIHVsLnRhYnMgbGkuYWN0aXZlLCAnK3RoKycgLndvb2NvbW1lcmNlIC53b29jb21tZXJjZS10YWJzIC53Yy10YWIgeyBjb2xvcjogJytjb2xvcisnICFpbXBvcnRhbnQ7IGJhY2tncm91bmQtY29sb3I6ICcrYmcrJyAhaW1wb3J0YW50OyB9Jztcblx0XHRcdFx0Y3NzICs9IHRoKycgLndvb2NvbW1lcmNlIHRhYmxlLnNob3BfdGFibGUsICcrdGgrJyAud29vY29tbWVyY2UgdGFibGUuc2hvcF90YWJsZSB0aCwgJyt0aCsnIC53b29jb21tZXJjZSB0YWJsZS5zaG9wX3RhYmxlIHRkLCAnICtcblx0XHRcdFx0XHQgICB0aCsnIC53b29jb21tZXJjZSAuY2FydC1jb2xsYXRlcmFscyAuY2FydF90b3RhbHMgdHIgdGQsICcrdGgrJyAud29vY29tbWVyY2UgLmNhcnQtY29sbGF0ZXJhbHMgLmNhcnRfdG90YWxzIHRyIHRoIHsgYm9yZGVyLWNvbG9yOiAnK2JvcmRlcisnICFpbXBvcnRhbnQ7IH0nO1xuXHRcdFx0XHRjc3MgKz0gdGgrJyAud29vY29tbWVyY2UtY2hlY2tvdXQgI3BheW1lbnQsICcgK1xuXHRcdFx0XHRcdCAgIHRoKycgLndvb2NvbW1lcmNlIGZvcm0gLmZvcm0tcm93Lndvb2NvbW1lcmNlLXZhbGlkYXRlZCAuc2VsZWN0Mi1jaG9pY2UsICcrdGgrJyAud29vY29tbWVyY2UgZm9ybSAuZm9ybS1yb3cud29vY29tbWVyY2UtdmFsaWRhdGVkIGlucHV0LmlucHV0LXRleHQsICcrdGgrJyAud29vY29tbWVyY2UgZm9ybSAuZm9ybS1yb3cud29vY29tbWVyY2UtdmFsaWRhdGVkIHNlbGVjdCwgJyArXG5cdFx0XHRcdFx0ICAgdGgrJyAud29vY29tbWVyY2UgZm9ybSAuZm9ybS1yb3cud29vY29tbWVyY2UtaW52YWxpZCAuc2VsZWN0Mi1jaG9pY2UsICcrdGgrJyAud29vY29tbWVyY2UgZm9ybSAuZm9ybS1yb3cud29vY29tbWVyY2UtaW52YWxpZCBpbnB1dC5pbnB1dC10ZXh0LCAnK3RoKycgLndvb2NvbW1lcmNlIGZvcm0gLmZvcm0tcm93Lndvb2NvbW1lcmNlLWludmFsaWQgc2VsZWN0IHsgYm9yZGVyLWNvbG9yOiAnK2JvcmRlcisnOyB9JztcblxuXHRcdFx0XHRNSVhULnN0eWxlc2hlZXQoJ3NpdGUtdGhlbWUtJytpZCwgY3NzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtzaXRlLXRoZW1lc10nLCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XG5cdFx0XHR1cGRhdGVTaXRlVGhlbWVzKHRvKTtcblx0XHR9KTtcblx0fSk7XG5cblx0Ly8gR2VuZXJhdGUgY3VzdG9tIHRoZW1lcyBpZiB0aGVtZSBpcyBjaGFuZ2VkIGZyb20gb25lIG9mIHRoZSBkZWZhdWx0c1xuXHRmdW5jdGlvbiBtYXliZVVwZGF0ZVNpdGVUaGVtZXMoaWQpIHtcblx0XHRpZiAoIGlkID09ICdhdXRvJyApIGlkID0gdGhlbWVzLnNpdGU7XG5cdFx0aWYgKCAhIF8uaGFzKG1peHRfY3VzdG9taXplLnRoZW1lcywgaWQpICkge1xuXHRcdFx0dmFyIHNpdGVUaGVtZXMgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W3NpdGUtdGhlbWVzXScpLmdldCgpO1xuXHRcdFx0dXBkYXRlU2l0ZVRoZW1lcyhzaXRlVGhlbWVzKTtcblx0XHR9XG5cdH1cblx0JCgnI21haW4td3JhcC1pbm5lcicpLm9uKCd0aGVtZS1jaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgdGhlbWUpIHtcblx0XHRtYXliZVVwZGF0ZVNpdGVUaGVtZXModGhlbWUpO1xuXHR9KTtcblx0JCgnI2NvbG9waG9uJykub24oJ3RoZW1lLWNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50LCB0aGVtZSkge1xuXHRcdG1heWJlVXBkYXRlU2l0ZVRoZW1lcyh0aGVtZSk7XG5cdH0pO1xuXG59KShqUXVlcnkpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==