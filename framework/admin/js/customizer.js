
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
				height = img.height,
				img_inv = wp.customize('mixt_opt[logo-img-inv]').get(),
				hires = wp.customize('mixt_opt[logo-img-hr]').get() == '1',
				width_val,
				height_val,
				shrink_width,
				shrink_height;

			if ( ! _.isEmpty(img_inv.url) ) {
				html += '<img class="logo-img logo-light" src="'+img.url+'" alt="'+text+'">';
				html += '<img class="logo-img logo-dark" src="'+img_inv.url+'" alt="'+text+'">';
			} else {
				html += '<img class="logo-img" src="'+img.url+'" alt="'+text+'">';
			}

			if ( hires ) {
				width  = width / 2;
				height = height / 2;
			}

			// Logo Wide or Tall
			if ( width > height ) {
				width_val = width + 'px';
				height_val = 'auto';
			} else {
				width_val = 'auto';
				height_val = height + 'px';
			}

			css += '#nav-logo img { width: '+width_val+'; height: '+height_val+'; }';

			// Logo Shrink
			if ( shrink != '0' ) {
				if ( width > height ) {
					shrink_width  = ( width - shrink ) + 'px';
					shrink_height = 'auto';
				} else {
					shrink_width  = 'auto';
					shrink_height = ( height - shrink ) + 'px';
				}
				css += '.fixed-nav #nav-logo img { width: '+shrink_width+'; height: '+shrink_height+'; }';
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

/* global _, wp, MIXT */

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
			var elems = $('#main-wrap-inner, [data-theme="auto"]');
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
				
				css += th+', '+th+' #content-wrap, '+th+' .sidebar ul, '+th+' .wp-caption, '+th+' hr { border-color: '+border+'; }';
				css += th+' .comment-list li.bypostauthor { border-left-color: '+accent+'; }';


				// Background Colors
				
				css += th+' .accent-bg:hover, '+th+' .hover-accent-bg:hover, '+th+' .tag-list a:hover, '+th+' .tagcloud a:hover { color: '+color_for_accent+' !important; background-color: '+accent+'; }';
				css += th+' .article .post-info .post-date { background-color: '+bg_darker+'; }';

				// Other Colors
				
				css += th+' ::selection { opacity: 0.8; background: '+accent+'; color: '+color_for_accent+'; }';

				css += th+' blockquote { border-color: '+border+'; border-left-color: '+accent+'; background-color: '+bg_darker+'; }';
				css += th+' blockquote cite { color: '+color_fade+'; }';

				css += th+' .sidebar .child-page-nav li a:hover, '+th+' .sidebar .nav li a:hover { color: '+accent+'; }';
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
				css += th+' .lg-outer .lg-thumb-item.active, '+th+' .lg-outer .lg-thumb-item:hover { border-color: '+accent+'; }';
				css += th+' .lg-progress-bar .lg-progress { background-color: '+accent+'; }';

				// Select2
				css += th+' .select2-container a.select2-choice, '+th+' .select2-drop, '+th+' .select2-drop.select2-drop-active { color: '+color+'; border-color: '+border+'; background-color: '+bg_darker+'; }';
				css += th+' .select2-results { background-color: '+bg_darker+'; }';
				css += th+' .select2-results .select2-highlighted { color: '+color+'; background-color: '+bg_lighter+'; }';

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvb3Rlci5qcyIsImdsb2JhbC5qcyIsImhlYWRlci5qcyIsImxvZ28uanMiLCJuYXZiYXJzLmpzIiwidGhlbWVzLmpzIiwidGhlbWVzLm5hdi5qcyIsInRoZW1lcy5zaXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImN1c3RvbWl6ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cclxuQ1VTVE9NSVpFUiBJTlRFR1JBVElPTiAtIEZPT1RFUlxyXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuKCBmdW5jdGlvbigkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0LyogZ2xvYmFsIHdwICovXHJcblxyXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbZm9vdGVyLXdpZGdldHMtYmctY29sb3JdJywgZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XHJcblx0XHRcdCQoJyNjb2xvcGhvbiAud2lkZ2V0LXJvdycpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsIHRvKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbZm9vdGVyLXdpZGdldHMtYmctcGF0XScsIGZ1bmN0aW9uKCB2YWx1ZSApIHtcclxuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XHJcblx0XHRcdGlmICggdG8gPT0gJzAnICkge1xyXG5cdFx0XHRcdCQoJyNjb2xvcGhvbiAud2lkZ2V0LXJvdycpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICdub25lJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JCgnI2NvbG9waG9uIC53aWRnZXQtcm93JykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybChcIicgKyB0byArICdcIiknKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSk7XHJcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtmb290ZXItd2lkZ2V0cy10ZXh0LWNvbG9yXScsIGZ1bmN0aW9uKCB2YWx1ZSApIHtcclxuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XHJcblx0XHRcdCQoJyNjb2xvcGhvbiAud2lkZ2V0LXJvdycpLmNzcygnY29sb3InLCB0byk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2Zvb3Rlci13aWRnZXRzLWJvcmRlci1jb2xvcl0nLCBmdW5jdGlvbiggdmFsdWUgKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xyXG5cdFx0XHQkKCcjY29sb3Bob24gLndpZGdldC1yb3cnKS5jc3MoJ2JvcmRlci1jb2xvcicsIHRvKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2Zvb3Rlci1jb3B5LWJnLWNvbG9yXScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xyXG5cdFx0XHQkKCcjY29sb3Bob24gLmNvcHlyaWdodC1yb3cnKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCB0byk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2Zvb3Rlci1jb3B5LWJnLXBhdF0nLCBmdW5jdGlvbiggdmFsdWUgKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xyXG5cdFx0XHRpZiAoIHRvID09ICcwJyApIHtcclxuXHRcdFx0XHQkKCcjY29sb3Bob24gLmNvcHlyaWdodC1yb3cnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAnbm9uZScpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQoJyNjb2xvcGhvbiAuY29weXJpZ2h0LXJvdycpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoXCInICsgdG8gKyAnXCIpJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbZm9vdGVyLWNvcHktdGV4dC1jb2xvcl0nLCBmdW5jdGlvbiggdmFsdWUgKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xyXG5cdFx0XHQkKCcjY29sb3Bob24gLmNvcHlyaWdodC1yb3cnKS5jc3MoJ2NvbG9yJywgdG8pO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtmb290ZXItY29weS1ib3JkZXItY29sb3JdJywgZnVuY3Rpb24oIHZhbHVlICkge1xyXG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcclxuXHRcdFx0JCgnI2NvbG9waG9uIC5jb3B5cmlnaHQtcm93JykuY3NzKCdib3JkZXItY29sb3InLCB0byk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2Zvb3Rlci1jb2RlXScsIGZ1bmN0aW9uKCB2YWx1ZSApIHtcclxuXHRcdHZhciBkYXRlID0gbmV3IERhdGUoKSxcclxuXHRcdFx0eWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcclxuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XHJcblx0XHRcdHRvID0gdG8ucmVwbGFjZSgvXFx7XFx7eWVhclxcfVxcfS9nLCB5ZWFyKTtcclxuXHRcdFx0JCgnI2NvbG9waG9uIC5zaXRlLWluZm8nKS5odG1sKHRvKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxufSkoalF1ZXJ5KTsiLCJcclxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cclxuQ1VTVE9NSVpFUiBJTlRFR1JBVElPTiAtIEdMT0JBTFxyXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxud2luZG93Lk1JWFQgPSB7XHJcblx0c3R5bGVzaGVldDogZnVuY3Rpb24oaWQsIGNzcykge1xyXG5cdFx0Y3NzID0gY3NzIHx8IGZhbHNlO1xyXG5cdFx0dmFyIHNoZWV0ID0galF1ZXJ5KCdzdHlsZVtkYXRhLWlkPVwiJytpZCsnXCJdJyk7XHJcblx0XHRpZiAoIHNoZWV0Lmxlbmd0aCA9PT0gMCApIHNoZWV0ID0galF1ZXJ5KCc8c3R5bGUgZGF0YS1pZD1cIicraWQrJ1wiPicpLmFwcGVuZFRvKGpRdWVyeSgnaGVhZCcpKTtcclxuXHRcdGlmICggY3NzICkge1xyXG5cdFx0XHRzaGVldC5odG1sKGNzcyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gc2hlZXQ7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuKCBmdW5jdGlvbigkKSB7XHJcblxyXG5cdC8qIGdsb2JhbCBfLCB3cCAqL1xyXG5cclxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3NpdGUtYmctY29sb3JdJywgZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XHJcblx0XHRcdCQoJ2JvZHknKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCB0byk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHJcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtzaXRlLWJnLXBhdF0nLCBmdW5jdGlvbiggdmFsdWUgKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xyXG5cdFx0XHRpZiAoIHRvID09ICcwJyApIHtcclxuXHRcdFx0XHQkKCdib2R5JykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ25vbmUnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkKCdib2R5JykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybChcIicgKyB0byArICdcIiknKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSk7XHJcblxyXG5cdC8vIFBhZ2UgTG9hZGVyXHJcblx0XHJcblx0dmFyIHBhZ2VMb2FkZXIgPSB7XHJcblx0XHRsb2FkZXI6ICcnLFxyXG5cdFx0bG9hZElubmVyOiAnJyxcclxuXHRcdGVuYWJsZWQ6IGZhbHNlLFxyXG5cdFx0dHlwZTogMSxcclxuXHRcdHNoYXBlOiAncmluZycsXHJcblx0XHRjb2xvcjogJyMwMDAnLFxyXG5cdFx0aW1nOiAnJyxcclxuXHRcdGFuaW06ICdib3VuY2UnLFxyXG5cdFx0c2V0dXA6IGZhbHNlLFxyXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmICggISB0aGlzLnNldHVwICkgdGhpcy5zZXRPcHRpb25zKCk7XHJcblx0XHRcdCQoJ2JvZHknKS5hZGRDbGFzcygnbG9hZGluZycpO1xyXG5cdFx0XHRpZiAoICQoJyNsb2FkLW92ZXJsYXknKS5sZW5ndGggPT09IDAgKSAkKCdib2R5JykuYXBwZW5kKCc8ZGl2IGlkPVwibG9hZC1vdmVybGF5XCI+PGRpdiBjbGFzcz1cImxvYWQtaW5uZXJcIj48L2Rpdj48L2Rpdj4nKTtcclxuXHRcdFx0dGhpcy5sb2FkZXIgPSAkKCcjbG9hZC1vdmVybGF5Jyk7XHJcblx0XHRcdHRoaXMubG9hZGVyLmZpbmQoJy5sb2FkZXInKS5zaG93KCk7XHJcblx0XHRcdHRoaXMubG9hZElubmVyID0gdGhpcy5sb2FkZXIuY2hpbGRyZW4oJy5sb2FkLWlubmVyJyk7XHJcblx0XHRcdHRoaXMubG9hZFNoYXBlKCk7XHJcblx0XHRcdGlmICggJCgnI2xvYWRlci1jbG9zZScpLmxlbmd0aCA9PT0gMCApIHtcclxuXHRcdFx0XHR0aGlzLmxvYWRlci5hcHBlbmQoJzxidXR0b24gaWQ9XCJsb2FkZXItY2xvc2VcIiBjbGFzcz1cImJ0biBidG4tcmVkIGJ0bi1sZ1wiIHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlOyB0b3A6IDIwcHg7IHJpZ2h0OiAyMHB4O1wiPiZ0aW1lczs8L2J1dHRvbj4nKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKCcjbG9hZGVyLWNsb3NlJykuY2xpY2soIGZ1bmN0aW9uKCkgeyAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTsgfSk7XHJcblx0XHR9LFxyXG5cdFx0c2V0T3B0aW9uczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMuZW5hYmxlZCA9IHdwLmN1c3RvbWl6ZS5fdmFsdWVbJ21peHRfb3B0W3BhZ2UtbG9hZGVyXSddLmdldCgpID09ICcxJztcclxuXHRcdFx0dGhpcy50eXBlID0gd3AuY3VzdG9taXplLl92YWx1ZVsnbWl4dF9vcHRbcGFnZS1sb2FkZXItdHlwZV0nXS5nZXQoKTtcclxuXHRcdFx0dGhpcy5zaGFwZSA9IHdwLmN1c3RvbWl6ZS5fdmFsdWVbJ21peHRfb3B0W3BhZ2UtbG9hZGVyLXNoYXBlXSddLmdldCgpO1xyXG5cdFx0XHR0aGlzLmNvbG9yID0gd3AuY3VzdG9taXplLl92YWx1ZVsnbWl4dF9vcHRbcGFnZS1sb2FkZXItY29sb3JdJ10uZ2V0KCk7XHJcblx0XHRcdHRoaXMuaW1nID0gd3AuY3VzdG9taXplLl92YWx1ZVsnbWl4dF9vcHRbcGFnZS1sb2FkZXItaW1nXSddLmdldCgpO1xyXG5cdFx0XHR0aGlzLmFuaW0gPSB3cC5jdXN0b21pemUuX3ZhbHVlWydtaXh0X29wdFtwYWdlLWxvYWRlci1hbmltXSddLmdldCgpO1xyXG5cdFx0XHR0aGlzLnNldHVwID0gdHJ1ZTtcclxuXHRcdH0sXHJcblx0XHRsb2FkU2hhcGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgY2xhc3NlcyA9ICdsb2FkZXInLFxyXG5cdFx0XHRcdGxvYWRlciAgPSAnJztcclxuXHRcdFx0aWYgKCB0aGlzLmFuaW0gIT0gJ25vbmUnICkgY2xhc3NlcyArPSAnIGFuaW1hdGVkIGluZmluaXRlICcgKyB0aGlzLmFuaW07XHJcblx0XHRcdGlmICggdGhpcy50eXBlID09IDEgKSB7XHJcblx0XHRcdFx0bG9hZGVyID0gJzxkaXYgY2xhc3M9XCInICsgY2xhc3NlcyArICcgJyArIHRoaXMuc2hhcGUgKyAnXCI+PC9kaXY+JztcclxuXHRcdFx0fSBlbHNlIGlmICggISBfLmlzRW1wdHkodGhpcy5pbWcudXJsKSApIHtcclxuXHRcdFx0XHRsb2FkZXIgPSAnPGltZyBzcmM9XCInICsgdGhpcy5pbWcudXJsICsgJ1wiIGFsdD1cIkxvYWRpbmcuLi5cIiBjbGFzcz1cIicgKyBjbGFzc2VzICsgJ1wiPic7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bG9hZGVyID0gJzxkaXYgY2xhc3M9XCJyaW5nICcgKyBjbGFzc2VzICsgJ1wiPjwvZGl2Pic7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5sb2FkSW5uZXIuaHRtbChsb2FkZXIpO1xyXG5cdFx0fSxcclxuXHRcdGhhbmRsZTogZnVuY3Rpb24odmFsdWUsIHR5cGUpIHtcclxuXHRcdFx0aWYgKCB0eXBlICE9ICdzd2l0Y2gnIHx8IHZhbHVlID09ICcxJyApIHRoaXMuaW5pdCgpO1xyXG5cdFx0XHRpZiAoIHR5cGUgPT0gJ3N3aXRjaCcgKSB7XHJcblx0XHRcdFx0aWYgKCB2YWx1ZSA9PSAnMCcgKSB7XHJcblx0XHRcdFx0XHR0aGlzLmVuYWJsZWQgPSBmYWxzZTtcclxuXHRcdFx0XHRcdCQoJ2JvZHknKS5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLmVuYWJsZWQgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIGlmICggdGhpcy5lbmFibGVkICkge1xyXG5cdFx0XHRcdHN3aXRjaCAodHlwZSkge1xyXG5cdFx0XHRcdFx0Y2FzZSAndHlwZSc6XHJcblx0XHRcdFx0XHRcdHRoaXMudHlwZSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmxvYWRTaGFwZSgpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ3NoYXBlJzpcclxuXHRcdFx0XHRcdFx0dGhpcy5zaGFwZSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmxvYWRTaGFwZSgpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2NvbG9yJzpcclxuXHRcdFx0XHRcdFx0dGhpcy5jb2xvciA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmxvYWRJbm5lci5jaGlsZHJlbignLnJpbmcsIC5zcXVhcmUyJykuY3NzKCdib3JkZXItY29sb3InLCB2YWx1ZSk7XHJcblx0XHRcdFx0XHRcdHRoaXMubG9hZElubmVyLmNoaWxkcmVuKCcuY2lyY2xlLCAuc3F1YXJlJykuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgdmFsdWUpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2ltZyc6XHJcblx0XHRcdFx0XHRcdHRoaXMuaW1nID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdHRoaXMubG9hZFNoYXBlKCk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAnYW5pbSc6XHJcblx0XHRcdFx0XHRcdHRoaXMuYW5pbSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmxvYWRTaGFwZSgpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2JnJzpcclxuXHRcdFx0XHRcdFx0dGhpcy5sb2FkZXIuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgdmFsdWUpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0fTtcclxuXHJcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtwYWdlLWxvYWRlcl0nLCBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHsgcGFnZUxvYWRlci5oYW5kbGUodG8sICdzd2l0Y2gnKTsgfSk7XHJcblx0fSk7XHJcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtwYWdlLWxvYWRlci10eXBlXScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykgeyBwYWdlTG9hZGVyLmhhbmRsZSh0bywgJ3R5cGUnKTsgfSk7XHJcblx0fSk7XHJcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtwYWdlLWxvYWRlci1zaGFwZV0nLCBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHsgcGFnZUxvYWRlci5oYW5kbGUodG8sICdzaGFwZScpOyB9KTtcclxuXHR9KTtcclxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3BhZ2UtbG9hZGVyLWNvbG9yXScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykgeyBwYWdlTG9hZGVyLmhhbmRsZSh0bywgJ2NvbG9yJyk7IH0pO1xyXG5cdH0pO1xyXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbcGFnZS1sb2FkZXItaW1nXScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykgeyBwYWdlTG9hZGVyLmhhbmRsZSh0bywgJ2ltZycpOyB9KTtcclxuXHR9KTtcclxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3BhZ2UtbG9hZGVyLWJnXScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykgeyBwYWdlTG9hZGVyLmhhbmRsZSh0bywgJ2JnJyk7IH0pO1xyXG5cdH0pO1xyXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbcGFnZS1sb2FkZXItYW5pbV0nLCBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHsgcGFnZUxvYWRlci5oYW5kbGUodG8sICdhbmltJyk7IH0pO1xyXG5cdH0pO1xyXG5cclxufSkoalF1ZXJ5KTsiLCJcclxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cclxuQ1VTVE9NSVpFUiBJTlRFR1JBVElPTiAtIEhFQURFUlxyXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuKCBmdW5jdGlvbigkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0LyogZ2xvYmFsIHdwLCBNSVhULCB0aW55Y29sb3IgKi9cclxuXHJcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtoZWFkLWJnLWNvbG9yXScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xyXG5cdFx0XHQkKCcuaGVhZC1tZWRpYSAubWVkaWEtY29udGFpbmVyJykuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgdG8pO1xyXG5cdFx0XHRpZiAoIHRpbnljb2xvcih0bykuaXNMaWdodCgpICkge1xyXG5cdFx0XHRcdCQoJy5oZWFkLW1lZGlhJykucmVtb3ZlQ2xhc3MoJ2JnLWRhcmsnKS5hZGRDbGFzcygnYmctbGlnaHQnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkKCcuaGVhZC1tZWRpYScpLnJlbW92ZUNsYXNzKCdiZy1saWdodCcpLmFkZENsYXNzKCdiZy1kYXJrJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHRmdW5jdGlvbiB1cGRhdGVIZWFkZXJUZXh0KCkge1xyXG5cdFx0dmFyIGNzcyA9ICcnLFxyXG5cdFx0XHRobSA9ICcuaGVhZC1tZWRpYScsXHJcblx0XHRcdGNvbG9yID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtoZWFkLXRleHQtY29sb3JdJykuZ2V0KCksXHJcblx0XHRcdGNvbG9yX2ludiA9IHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbaGVhZC1pbnYtdGV4dC1jb2xvcl0nKS5nZXQoKTtcclxuXHRcdGlmICggY29sb3IgIT0gJycgKSB7XHJcblx0XHRcdHZhciBobV9saWdodCA9IGhtKycuYmctbGlnaHQnO1xyXG5cdFx0XHRjc3MgKz0gaG1fbGlnaHQrJyAuY29udGFpbmVyLCAnK2htX2xpZ2h0KycgLm1lZGlhLWlubmVyID4gYSwgJytobV9saWdodCsnIC5oZWFkZXItc2Nyb2xsLCAnK2htX2xpZ2h0KycgI2JyZWFkY3J1bWJzID4gbGkgKyBsaTpiZWZvcmUgeyBjb2xvcjogJytjb2xvcisnICFpbXBvcnRhbnQ7IH0nO1xyXG5cdFx0fVxyXG5cdFx0aWYgKCBjb2xvcl9pbnYgIT0gJycgKSB7XHJcblx0XHRcdHZhciBobV9kYXJrID0gaG0rJy5iZy1kYXJrJztcclxuXHRcdFx0Y3NzICs9IGhtX2RhcmsrJyAuY29udGFpbmVyLCAnK2htX2RhcmsrJyAubWVkaWEtaW5uZXIgPiBhLCAnK2htX2RhcmsrJyAuaGVhZGVyLXNjcm9sbCwgJytobV9kYXJrKycgI2JyZWFkY3J1bWJzID4gbGkgKyBsaTpiZWZvcmUgeyBjb2xvcjogJytjb2xvcl9pbnYrJyAhaW1wb3J0YW50OyB9JztcclxuXHRcdH1cclxuXHRcdE1JWFQuc3R5bGVzaGVldCgnbWl4dC1oZWFkZXInLCBjc3MpO1xyXG5cdH1cclxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2hlYWQtdGV4dC1jb2xvcl0nLCBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdHVwZGF0ZUhlYWRlclRleHQoKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbaGVhZC1pbnYtdGV4dC1jb2xvcl0nLCBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdHVwZGF0ZUhlYWRlclRleHQoKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvYy1iYXItYmctY29sb3JdJywgZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XHJcblx0XHRcdCQoJyNsb2NhdGlvbi1iYXInKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCB0byk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvYy1iYXItYmctcGF0XScsIGZ1bmN0aW9uKCB2YWx1ZSApIHtcclxuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XHJcblx0XHRcdGlmICggdG8gPT0gJzAnICkge1xyXG5cdFx0XHRcdCQoJyNsb2NhdGlvbi1iYXInKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAnbm9uZScpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQoJyNsb2NhdGlvbi1iYXInKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKFwiJyArIHRvICsgJ1wiKScpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvYy1iYXItdGV4dC1jb2xvcl0nLCBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcclxuXHRcdFx0dmFyIGNzcyA9ICcjbG9jYXRpb24tYmFyLCAjbG9jYXRpb24tYmFyIGE6aG92ZXIsICNsb2NhdGlvbi1iYXIgbGk6YmVmb3JlIHsgY29sb3I6ICcrdG8rJzsgfSc7XHJcblx0XHRcdE1JWFQuc3R5bGVzaGVldCgnbWl4dC1sb2MtYmFyJywgY3NzKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9jLWJhci1ib3JkZXItY29sb3JdJywgZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XHJcblx0XHRcdCQoJyNsb2NhdGlvbi1iYXInKS5jc3MoJ2JvcmRlci1jb2xvcicsIHRvKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbYnJlYWRjcnVtYnMtcHJlZml4XScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xyXG5cdFx0XHR2YXIgYmNfcHJlZml4ID0gJCgnI2JyZWFkY3J1bWJzIC5iYy1wcmVmaXgnKTtcclxuXHRcdFx0aWYgKCBiY19wcmVmaXgubGVuZ3RoID09PSAwICkgYmNfcHJlZml4ID0gJCgnPGxpIGNsYXNzPVwiYmMtcHJlZml4XCI+PC9saT4nKS5wcmVwZW5kVG8oJCgnI2JyZWFkY3J1bWJzJykpO1xyXG5cdFx0XHRiY19wcmVmaXguaHRtbCh0byk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHJcbn0pKGpRdWVyeSk7IiwiXHJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXHJcbkNVU1RPTUlaRVIgSU5URUdSQVRJT04gLSBMT0dPXHJcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4oIGZ1bmN0aW9uKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHQvKiBnbG9iYWwgXywgd3AsIE1JWFQsIG1peHRfY3VzdG9taXplICovXHJcblxyXG5cdGZ1bmN0aW9uIHVwZGF0ZUxvZ28oKSB7XHJcblx0XHR2YXIgaHRtbCA9ICcnLFxyXG5cdFx0XHRjc3MgPSAnJyxcclxuXHRcdFx0dHlwZSA9IHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby10eXBlXScpLmdldCgpLFxyXG5cdFx0XHRpbWcgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28taW1nXScpLmdldCgpLFxyXG5cdFx0XHR0ZXh0ID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXRleHRdJykuZ2V0KCkgfHwgd3AuY3VzdG9taXplKCdibG9nbmFtZScpLmdldCgpLFxyXG5cdFx0XHRzaHJpbmsgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tc2hyaW5rXScpLmdldCgpLFxyXG5cdFx0XHRzaG93X3RhZyA9IHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby1zaG93LXRhZ2xpbmVdJykuZ2V0KCk7XHJcblxyXG5cdFx0Ly8gSW1hZ2UgTG9nb1xyXG5cdFx0aWYgKCB0eXBlID09ICdpbWcnICYmICEgXy5pc0VtcHR5KGltZy51cmwpICkge1xyXG5cdFx0XHR2YXIgd2lkdGggPSBpbWcud2lkdGgsXHJcblx0XHRcdFx0aGVpZ2h0ID0gaW1nLmhlaWdodCxcclxuXHRcdFx0XHRpbWdfaW52ID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLWltZy1pbnZdJykuZ2V0KCksXHJcblx0XHRcdFx0aGlyZXMgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28taW1nLWhyXScpLmdldCgpID09ICcxJyxcclxuXHRcdFx0XHR3aWR0aF92YWwsXHJcblx0XHRcdFx0aGVpZ2h0X3ZhbCxcclxuXHRcdFx0XHRzaHJpbmtfd2lkdGgsXHJcblx0XHRcdFx0c2hyaW5rX2hlaWdodDtcclxuXHJcblx0XHRcdGlmICggISBfLmlzRW1wdHkoaW1nX2ludi51cmwpICkge1xyXG5cdFx0XHRcdGh0bWwgKz0gJzxpbWcgY2xhc3M9XCJsb2dvLWltZyBsb2dvLWxpZ2h0XCIgc3JjPVwiJytpbWcudXJsKydcIiBhbHQ9XCInK3RleHQrJ1wiPic7XHJcblx0XHRcdFx0aHRtbCArPSAnPGltZyBjbGFzcz1cImxvZ28taW1nIGxvZ28tZGFya1wiIHNyYz1cIicraW1nX2ludi51cmwrJ1wiIGFsdD1cIicrdGV4dCsnXCI+JztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRodG1sICs9ICc8aW1nIGNsYXNzPVwibG9nby1pbWdcIiBzcmM9XCInK2ltZy51cmwrJ1wiIGFsdD1cIicrdGV4dCsnXCI+JztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCBoaXJlcyApIHtcclxuXHRcdFx0XHR3aWR0aCAgPSB3aWR0aCAvIDI7XHJcblx0XHRcdFx0aGVpZ2h0ID0gaGVpZ2h0IC8gMjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gTG9nbyBXaWRlIG9yIFRhbGxcclxuXHRcdFx0aWYgKCB3aWR0aCA+IGhlaWdodCApIHtcclxuXHRcdFx0XHR3aWR0aF92YWwgPSB3aWR0aCArICdweCc7XHJcblx0XHRcdFx0aGVpZ2h0X3ZhbCA9ICdhdXRvJztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR3aWR0aF92YWwgPSAnYXV0byc7XHJcblx0XHRcdFx0aGVpZ2h0X3ZhbCA9IGhlaWdodCArICdweCc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNzcyArPSAnI25hdi1sb2dvIGltZyB7IHdpZHRoOiAnK3dpZHRoX3ZhbCsnOyBoZWlnaHQ6ICcraGVpZ2h0X3ZhbCsnOyB9JztcclxuXHJcblx0XHRcdC8vIExvZ28gU2hyaW5rXHJcblx0XHRcdGlmICggc2hyaW5rICE9ICcwJyApIHtcclxuXHRcdFx0XHRpZiAoIHdpZHRoID4gaGVpZ2h0ICkge1xyXG5cdFx0XHRcdFx0c2hyaW5rX3dpZHRoICA9ICggd2lkdGggLSBzaHJpbmsgKSArICdweCc7XHJcblx0XHRcdFx0XHRzaHJpbmtfaGVpZ2h0ID0gJ2F1dG8nO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzaHJpbmtfd2lkdGggID0gJ2F1dG8nO1xyXG5cdFx0XHRcdFx0c2hyaW5rX2hlaWdodCA9ICggaGVpZ2h0IC0gc2hyaW5rICkgKyAncHgnO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjc3MgKz0gJy5maXhlZC1uYXYgI25hdi1sb2dvIGltZyB7IHdpZHRoOiAnK3Nocmlua193aWR0aCsnOyBoZWlnaHQ6ICcrc2hyaW5rX2hlaWdodCsnOyB9JztcclxuXHRcdFx0fVxyXG5cclxuXHRcdC8vIFRleHQgTG9nb1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIGNvbG9yID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXRleHQtY29sb3JdJykuZ2V0KCksXHJcblx0XHRcdFx0Y29sb3JfaW52ID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXRleHQtaW52XScpLmdldCgpLFxyXG5cdFx0XHRcdHRleHRfdHlwbyA9IG1peHRfY3VzdG9taXplLmxvZ29bJ3RleHQtdHlwbyddLFxyXG5cdFx0XHRcdHNocmlua19zaXplO1xyXG5cclxuXHRcdFx0aWYgKCBjb2xvcl9pbnYgIT0gJycgKSB7XHJcblx0XHRcdFx0aHRtbCArPSAnPHN0cm9uZyBjbGFzcz1cImxvZ28tbGlnaHRcIj4nK3RleHQrJzwvc3Ryb25nPic7XHJcblx0XHRcdFx0aHRtbCArPSAnPHN0cm9uZyBjbGFzcz1cImxvZ28tZGFya1wiPicrdGV4dCsnPC9zdHJvbmc+JztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRodG1sICs9ICc8c3Ryb25nPicrdGV4dCsnPC9zdHJvbmc+JztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y3NzICs9ICcjbmF2LWxvZ28gc3Ryb25nIHsnO1xyXG5cdFx0XHRcdGNzcyArPSAnY29sb3I6ICcrY29sb3IrJzsnO1xyXG5cdFx0XHRcdGNzcyArPSAnZm9udC1zaXplOiAnK3RleHRfdHlwb1snZm9udC1zaXplJ10rJzsnO1xyXG5cdFx0XHRcdGNzcyArPSAnZm9udC1mYW1pbHk6ICcrdGV4dF90eXBvWydmb250LWZhbWlseSddKyc7JztcclxuXHRcdFx0XHRjc3MgKz0gJ2ZvbnQtd2VpZ2h0OiAnK3RleHRfdHlwb1snZm9udC13ZWlnaHQnXSsnOyc7XHJcblx0XHRcdFx0Y3NzICs9ICd0ZXh0LXRyYW5zZm9ybTogJyt0ZXh0X3R5cG9bJ3RleHQtdHJhbnNmb3JtJ10rJzsnO1xyXG5cdFx0XHRjc3MgKz0gJ30nO1xyXG5cdFx0XHRjc3MgKz0gJyNuYXYtbG9nbyAubG9nby1kYXJrIHsgY29sb3I6ICcrY29sb3JfaW52Kyc7IH0nO1xyXG5cclxuXHRcdFx0Ly8gTG9nbyBTaHJpbmtcclxuXHRcdFx0aWYgKCBzaHJpbmsgIT0gJzAnICkge1xyXG5cdFx0XHRcdHNocmlua19zaXplID0gKCBwYXJzZUludCh0ZXh0X3R5cG9bJ2ZvbnQtc2l6ZSddLCAxMCkgLSBzaHJpbmsgKSArICdweCc7XHJcblxyXG5cdFx0XHRcdGNzcyArPSAnLmZpeGVkLW5hdiAjbmF2LWxvZ28gc3Ryb25nIHsgZm9udC1zaXplOiAnK3Nocmlua19zaXplKyc7IH0nO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVGFnbGluZVxyXG5cdFx0aWYgKCBzaG93X3RhZyA9PSAnMScgKSB7XHJcblx0XHRcdHZhciB0YWdsaW5lID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXRhZ2xpbmVdJykuZ2V0KCkgfHwgd3AuY3VzdG9taXplKCdibG9nZGVzY3JpcHRpb24nKS5nZXQoKSxcclxuXHRcdFx0XHR0YWdfY29sb3IgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tdGFnbGluZS1jb2xvcl0nKS5nZXQoKSxcclxuXHRcdFx0XHR0YWdfY29sb3JfaW52ID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXRhZ2xpbmUtaW52XScpLmdldCgpLFxyXG5cdFx0XHRcdHRhZ190eXBvID0gbWl4dF9jdXN0b21pemUubG9nb1sndGFnbGluZS10eXBvJ107XHJcblxyXG5cdFx0XHRpZiAoIHRhZ2xpbmUgIT0gJycgKSB7XHJcblx0XHRcdFx0aHRtbCArPSAnPHNtYWxsPicgKyB0YWdsaW5lICsgJzwvc21hbGw+JztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y3NzICs9ICcjbmF2LWxvZ28gc21hbGwgeyc7XHJcblx0XHRcdFx0Y3NzICs9ICdjb2xvcjogJyt0YWdfY29sb3IrJzsnO1xyXG5cdFx0XHRcdGNzcyArPSAnZm9udC1zaXplOiAnK3RhZ190eXBvWydmb250LXNpemUnXSsnOyc7XHJcblx0XHRcdFx0Y3NzICs9ICdmb250LWZhbWlseTogJyt0YWdfdHlwb1snZm9udC1mYW1pbHknXSsnOyc7XHJcblx0XHRcdFx0Y3NzICs9ICdmb250LXdlaWdodDogJyt0YWdfdHlwb1snZm9udC13ZWlnaHQnXSsnOyc7XHJcblx0XHRcdFx0Y3NzICs9ICd0ZXh0LXRyYW5zZm9ybTogJyt0YWdfdHlwb1sndGV4dC10cmFuc2Zvcm0nXSsnOyc7XHJcblx0XHRcdGNzcyArPSAnfSc7XHJcblx0XHRcdGNzcyArPSAnLmJnLWRhcmsgI25hdi1sb2dvIHNtYWxsIHsgY29sb3I6ICcrdGFnX2NvbG9yX2ludisnOyB9JztcclxuXHRcdH1cclxuXHJcblx0XHQkKCcjbmF2LWxvZ28nKS5odG1sKGh0bWwpO1xyXG5cclxuXHRcdE1JWFQuc3R5bGVzaGVldCgnbWl4dC1sb2dvJywgY3NzKTtcclxuXHR9XHJcblxyXG5cdHdwLmN1c3RvbWl6ZSgnYmxvZ25hbWUnLCBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7IHVwZGF0ZUxvZ28oKTsgfSk7XHJcblx0fSk7XHJcblx0d3AuY3VzdG9taXplKCdibG9nZGVzY3JpcHRpb24nLCBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7IHVwZGF0ZUxvZ28oKTsgfSk7XHJcblx0fSk7XHJcblxyXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby10eXBlXScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbigpIHsgdXBkYXRlTG9nbygpOyB9KTtcclxuXHR9KTtcclxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28taW1nXScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbigpIHsgdXBkYXRlTG9nbygpOyB9KTtcclxuXHR9KTtcclxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28taW1nLWludl0nLCBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7IHVwZGF0ZUxvZ28oKTsgfSk7XHJcblx0fSk7XHJcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLWltZy1ocl0nLCBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7IHVwZGF0ZUxvZ28oKTsgfSk7XHJcblx0fSk7XHJcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXRleHRdJywgZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkgeyB1cGRhdGVMb2dvKCk7IH0pO1xyXG5cdH0pO1xyXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby10ZXh0LWNvbG9yXScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbigpIHsgdXBkYXRlTG9nbygpOyB9KTtcclxuXHR9KTtcclxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tdGV4dC1pbnZdJywgZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkgeyB1cGRhdGVMb2dvKCk7IH0pO1xyXG5cdH0pO1xyXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby1zaHJpbmtdJywgZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkgeyB1cGRhdGVMb2dvKCk7IH0pO1xyXG5cdH0pO1xyXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby1zaG93LXRhZ2xpbmVdJywgZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR1cGRhdGVMb2dvKCk7XHJcblx0XHRcdCQod2luZG93KS50cmlnZ2VyKCdyZXNpemUnKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbG9nby10YWdsaW5lXScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbigpIHsgdXBkYXRlTG9nbygpOyB9KTtcclxuXHR9KTtcclxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tdGFnbGluZS1jb2xvcl0nLCBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7IHVwZGF0ZUxvZ28oKTsgfSk7XHJcblx0fSk7XHJcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtsb2dvLXRhZ2xpbmUtaW52XScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbigpIHsgdXBkYXRlTG9nbygpOyB9KTtcclxuXHR9KTtcclxuXHJcbn0pKGpRdWVyeSk7IiwiXHJcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvXHJcbkNVU1RPTUlaRVIgSU5URUdSQVRJT04gLSBOQVZCQVJTXHJcbi8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4oIGZ1bmN0aW9uKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHQvKiBnbG9iYWwgd3AsIE1JWFQsIG1peHRfb3B0LCBtaXh0X2N1c3RvbWl6ZSAqL1xyXG5cclxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi12ZXJ0aWNhbC1wb3NpdGlvbl0nLCBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcclxuXHRcdFx0aWYgKCB0byA9PSAnbGVmdCcgKSB7XHJcblx0XHRcdFx0JCgnI21haW4td3JhcCcpLnJlbW92ZUNsYXNzKCduYXYtcmlnaHQnKS5hZGRDbGFzcygnbmF2LWxlZnQnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkKCcjbWFpbi13cmFwJykucmVtb3ZlQ2xhc3MoJ25hdi1sZWZ0JykuYWRkQ2xhc3MoJ25hdi1yaWdodCcpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2xvZ28tYWxpZ25dJywgZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XHJcblx0XHRcdGlmICggdG8gPT0gJzEnICkge1xyXG5cdFx0XHRcdCQoJyNtYWluLW5hdi13cmFwJykucmVtb3ZlQ2xhc3MoJ2xvZ28tY2VudGVyIGxvZ28tcmlnaHQnKS5hZGRDbGFzcygnbG9nby1sZWZ0JykuYXR0cignZGF0YS1sb2dvLWFsaWduJywgJ2xlZnQnKTtcclxuXHRcdFx0fSBlbHNlIGlmICggdG8gPT0gJzInICkge1xyXG5cdFx0XHRcdCQoJyNtYWluLW5hdi13cmFwJykucmVtb3ZlQ2xhc3MoJ2xvZ28tbGVmdCBsb2dvLXJpZ2h0JykuYWRkQ2xhc3MoJ2xvZ28tY2VudGVyJykuYXR0cignZGF0YS1sb2dvLWFsaWduJywgJ2NlbnRlcicpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQoJyNtYWluLW5hdi13cmFwJykucmVtb3ZlQ2xhc3MoJ2xvZ28tY2VudGVyIGxvZ28tbGVmdCcpLmFkZENsYXNzKCdsb2dvLXJpZ2h0JykuYXR0cignZGF0YS1sb2dvLWFsaWduJywgJ3JpZ2h0Jyk7XHJcblx0XHRcdH1cclxuXHRcdFx0bmF2YmFyUGFkZGluZygpO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtdGV4dHVyZV0nLCBmdW5jdGlvbiggdmFsdWUgKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xyXG5cdFx0XHRpZiAoIHRvID09ICcwJyApIHtcclxuXHRcdFx0XHQkKCcjbWFpbi1uYXYnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAnbm9uZScpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQoJyNtYWluLW5hdicpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoXCInICsgdG8gKyAnXCIpJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2VjLW5hdi10ZXh0dXJlXScsIGZ1bmN0aW9uKCB2YWx1ZSApIHtcclxuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XHJcblx0XHRcdGlmICggdG8gPT0gJzAnICkge1xyXG5cdFx0XHRcdCQoJyNzZWNvbmQtbmF2JykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ25vbmUnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkKCcjc2Vjb25kLW5hdicpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoXCInICsgdG8gKyAnXCIpJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHRmdW5jdGlvbiBuYXZiYXJQYWRkaW5nKCkge1xyXG5cdFx0dmFyIGNzcyxcclxuXHRcdFx0c2hlZXQgPSBNSVhULnN0eWxlc2hlZXQoJ21peHQtbmF2LXBhZGRpbmcnKTtcclxuXHJcblx0XHRzaGVldC5odG1sKCcnKTtcclxuXHJcblx0XHR2YXIgbmF2X2hlaWdodCA9IHBhcnNlSW50KCQoJyNtYWluLW5hdicpLmhlaWdodCgpLCAxMCksXHJcblx0XHRcdHBhZGRpbmcgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi1wYWRkaW5nXScpLmdldCgpLFxyXG5cdFx0XHRmaXhlZF9wYWRkaW5nID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtZml4ZWQtcGFkZGluZ10nKS5nZXQoKSxcclxuXHRcdFx0bmF2X3dyYXBfaGVpZ2h0ID0gbmF2X2hlaWdodCArIHBhZGRpbmcgKiAyLFxyXG5cdFx0XHRmaXhlZF93cmFwX2hlaWdodCA9IG5hdl9oZWlnaHQgKyBmaXhlZF9wYWRkaW5nICogMixcclxuXHRcdFx0Zml4ZWRfaXRlbV9oZWlnaHQgPSBmaXhlZF93cmFwX2hlaWdodCxcclxuXHRcdFx0bWVkaWFfYnAgPSBtaXh0X2N1c3RvbWl6ZS5icmVha3BvaW50cy5tYXJzICsgMSxcclxuXHRcdFx0bG9nb19jZW50ZXIgPSAkKCcjbWFpbi1uYXYtd3JhcCcpLmF0dHIoJ2RhdGEtbG9nby1hbGlnbicpID09ICdjZW50ZXInO1xyXG5cclxuXHRcdGNzcyA9ICdAbWVkaWEgKCBtaW4td2lkdGg6ICcrbWVkaWFfYnArJ3B4ICkgeyc7XHJcblx0XHRcdGNzcyArPSAnLm5hdmJhci1taXh0IHsgcGFkZGluZy10b3A6ICcrcGFkZGluZysncHg7IHBhZGRpbmctYm90dG9tOiAnK3BhZGRpbmcrJ3B4OyB9JztcclxuXHRcdFx0Y3NzICs9ICcuZml4ZWQtbmF2IC5uYXZiYXItbWl4dCB7IHBhZGRpbmctdG9wOiAnK2ZpeGVkX3BhZGRpbmcrJ3B4OyBwYWRkaW5nLWJvdHRvbTogJytmaXhlZF9wYWRkaW5nKydweDsgfSc7XHJcblx0XHRcdGlmICggbG9nb19jZW50ZXIgKSB7XHJcblx0XHRcdFx0dmFyIGhhbGZfcGFkZGluZyA9IGZpeGVkX3BhZGRpbmcgLyAyO1xyXG5cdFx0XHRcdGZpeGVkX2l0ZW1faGVpZ2h0ID0gZml4ZWRfaXRlbV9oZWlnaHQgLSBuYXZfaGVpZ2h0IC8gMiAtIGhhbGZfcGFkZGluZztcclxuXHRcdFx0XHRjc3MgKz0gJyNtYWluLW5hdi13cmFwLmxvZ28tY2VudGVyIHsgbWluLWhlaWdodDogJytuYXZfd3JhcF9oZWlnaHQrJ3B4OyB9JztcclxuXHRcdFx0XHRjc3MgKz0gJy5maXhlZC1uYXYgI21haW4tbmF2LXdyYXAubG9nby1jZW50ZXIgeyBtaW4taGVpZ2h0OiAnK2ZpeGVkX3dyYXBfaGVpZ2h0KydweDsgfSc7XHJcblx0XHRcdFx0Y3NzICs9ICcuZml4ZWQtbmF2IC5uYXZiYXItbWl4dCAubmF2YmFyLWhlYWRlciB7IG1hcmdpbi10b3A6IC0nK2hhbGZfcGFkZGluZysncHg7IH0nO1xyXG5cdFx0XHRcdGNzcyArPSAnLmZpeGVkLW5hdiAubmF2YmFyLW1peHQgLm5hdiA+IGxpIHsgbWFyZ2luLXRvcDogJytoYWxmX3BhZGRpbmcrJ3B4OyBtYXJnaW4tYm90dG9tOiAtJytmaXhlZF9wYWRkaW5nKydweDsgfSc7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y3NzICs9ICcjbWFpbi1uYXYtd3JhcCB7IG1pbi1oZWlnaHQ6ICcrbmF2X3dyYXBfaGVpZ2h0KydweDsgfSc7XHJcblx0XHRcdFx0Y3NzICs9ICcuZml4ZWQtbmF2ICNtYWluLW5hdi13cmFwIHsgbWluLWhlaWdodDogJytmaXhlZF93cmFwX2hlaWdodCsncHg7IH0nO1xyXG5cdFx0XHRcdGNzcyArPSAnLmZpeGVkLW5hdiAubmF2YmFyLW1peHQgLm5hdiA+IGxpIHsgbWFyZ2luLXRvcDogLScrZml4ZWRfcGFkZGluZysncHg7IG1hcmdpbi1ib3R0b206IC0nK2ZpeGVkX3BhZGRpbmcrJ3B4OyB9JztcclxuXHRcdFx0fVxyXG5cdFx0XHRjc3MgKz0gJy5maXhlZC1uYXYgLm5hdmJhci1taXh0IC5uYXYgPiBsaSwgLmZpeGVkLW5hdiAubmF2YmFyLW1peHQgLm5hdiA+IGxpID4gYSB7IGhlaWdodDogJytmaXhlZF9pdGVtX2hlaWdodCsncHg7IGxpbmUtaGVpZ2h0OiAnK2ZpeGVkX2l0ZW1faGVpZ2h0KydweDsgfSc7XHJcblx0XHRjc3MgKz0gJ30nO1xyXG5cclxuXHRcdHNoZWV0Lmh0bWwoY3NzKTtcclxuXHR9XHJcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtcGFkZGluZ10nLCBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7IG5hdmJhclBhZGRpbmcoKTsgfSk7XHJcblx0fSk7XHJcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtZml4ZWQtcGFkZGluZ10nLCBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24oKSB7IG5hdmJhclBhZGRpbmcoKTsgfSk7XHJcblx0fSk7XHJcblxyXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbmF2LW9wYWNpdHldJywgZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XHJcblx0XHRcdG1peHRfb3B0Lm5hdi5vcGFjaXR5ID0gdG87XHJcblx0XHRcdCQoJyNtYWluLW5hdicpLnRyaWdnZXIoJ3JlZnJlc2gnKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbmF2LXRvcC1vcGFjaXR5XScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xyXG5cdFx0XHRtaXh0X29wdC5uYXZbJ3RvcC1vcGFjaXR5J10gPSB0bztcclxuXHRcdFx0JCgnI21haW4tbmF2JykudHJpZ2dlcigncmVmcmVzaCcpO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtdHJhbnNwYXJlbnRdJywgZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XHJcblx0XHRcdGlmICggdG8gPT0gJzEnICYmIHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbaGVhZC1tZWRpYV0nKS5nZXQoKSA9PSAnMScgKSB7XHJcblx0XHRcdFx0JCgnI21haW4td3JhcCcpLmFkZENsYXNzKCduYXYtdHJhbnNwYXJlbnQnKTtcclxuXHRcdFx0XHRtaXh0X29wdC5uYXYudHJhbnNwYXJlbnQgPSB0cnVlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQoJyNtYWluLXdyYXAnKS5yZW1vdmVDbGFzcygnbmF2LXRyYW5zcGFyZW50Jyk7XHJcblx0XHRcdFx0bWl4dF9vcHQubmF2LnRyYW5zcGFyZW50ID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdFx0JCgnI21haW4tbmF2JykudHJpZ2dlcigncmVmcmVzaCcpO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcblxyXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbmF2LWhvdmVyLWJnXScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xyXG5cdFx0XHRpZiAoIHRvID09ICcwJyApIHtcclxuXHRcdFx0XHQkKCcjbWFpbi1uYXYnKS5hZGRDbGFzcygnbm8taG92ZXItYmcnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkKCcjbWFpbi1uYXYnKS5yZW1vdmVDbGFzcygnbm8taG92ZXItYmcnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSk7XHJcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtzZWMtbmF2LWhvdmVyLWJnXScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xyXG5cdFx0XHRpZiAoIHRvID09ICcwJyApIHtcclxuXHRcdFx0XHQkKCcjc2Vjb25kLW5hdicpLmFkZENsYXNzKCduby1ob3Zlci1iZycpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQoJyNzZWNvbmQtbmF2JykucmVtb3ZlQ2xhc3MoJ25vLWhvdmVyLWJnJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHRmdW5jdGlvbiBuYXZiYXJBY3RpdmVCYXIobmF2YmFyLCBlbmFibGVkLCBwb3NpdGlvbikge1xyXG5cdFx0bmF2YmFyLnJlbW92ZUNsYXNzKCdhY3RpdmUtdG9wIGFjdGl2ZS1ib3R0b20gYWN0aXZlLWxlZnQgYWN0aXZlLXJpZ2h0Jyk7XHJcblx0XHRpZiAoIGVuYWJsZWQgKSB7XHJcblx0XHRcdG5hdmJhci5yZW1vdmVDbGFzcygnbm8tYWN0aXZlJykuYWRkQ2xhc3MoJ2FjdGl2ZS0nK3Bvc2l0aW9uKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdG5hdmJhci5hZGRDbGFzcygnbm8tYWN0aXZlJyk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbmF2LWFjdGl2ZS1iYXJdJywgZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XHJcblx0XHRcdHZhciBlbmFibGVkID0gdG8gPT0gJzEnLFxyXG5cdFx0XHRcdHBvc2l0aW9uID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtuYXYtYWN0aXZlLWJhci1wb3NdJykuZ2V0KCk7XHJcblx0XHRcdG5hdmJhckFjdGl2ZUJhcigkKCcjbWFpbi1uYXYgLm5hdicpLCBlbmFibGVkLCBwb3NpdGlvbik7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi1hY3RpdmUtYmFyLXBvc10nLCBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcclxuXHRcdFx0dmFyIGVuYWJsZWQgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi1hY3RpdmUtYmFyXScpLmdldCgpID09ICcxJztcclxuXHRcdFx0bmF2YmFyQWN0aXZlQmFyKCQoJyNtYWluLW5hdiAubmF2JyksIGVuYWJsZWQsIHRvKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2VjLW5hdi1hY3RpdmUtYmFyXScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xyXG5cdFx0XHR2YXIgZW5hYmxlZCA9IHRvID09ICcxJyxcclxuXHRcdFx0XHRwb3NpdGlvbiA9IHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2VjLW5hdi1hY3RpdmUtYmFyLXBvc10nKS5nZXQoKTtcclxuXHRcdFx0bmF2YmFyQWN0aXZlQmFyKCQoJyNzZWNvbmQtbmF2IC5uYXYnKSwgZW5hYmxlZCwgcG9zaXRpb24pO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtzZWMtbmF2LWFjdGl2ZS1iYXItcG9zXScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xyXG5cdFx0XHR2YXIgZW5hYmxlZCA9IHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2VjLW5hdi1hY3RpdmUtYmFyXScpLmdldCgpID09ICcxJztcclxuXHRcdFx0bmF2YmFyQWN0aXZlQmFyKCQoJyNzZWNvbmQtbmF2IC5uYXYnKSwgZW5hYmxlZCwgdG8pO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcblxyXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbmF2LWJvcmRlcmVkXScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xyXG5cdFx0XHRpZiAoIHRvID09ICcxJyApIHtcclxuXHRcdFx0XHQkKCcjbWFpbi1uYXYnKS5hZGRDbGFzcygnYm9yZGVyZWQnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkKCcjbWFpbi1uYXYnKS5yZW1vdmVDbGFzcygnYm9yZGVyZWQnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSk7XHJcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtzZWMtbmF2LWJvcmRlcmVkXScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xyXG5cdFx0XHRpZiAoIHRvID09ICcxJyApIHtcclxuXHRcdFx0XHQkKCcjc2Vjb25kLW5hdicpLmFkZENsYXNzKCdib3JkZXJlZCcpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQoJyNzZWNvbmQtbmF2JykucmVtb3ZlQ2xhc3MoJ2JvcmRlcmVkJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3NlYy1uYXYtbGVmdC1jb2RlXScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xyXG5cdFx0XHQkKCcjc2Vjb25kLW5hdiAubGVmdCAuY29kZS1pbm5lcicpLmh0bWwodG8pO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtzZWMtbmF2LWxlZnQtaGlkZV0nLCBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcclxuXHRcdFx0dmFyIG5hdiA9ICQoJyNzZWNvbmQtbmF2Jyk7XHJcblx0XHRcdGlmICggdG8gPT0gJzEnICkge1xyXG5cdFx0XHRcdG5hdi5maW5kKCcubGVmdCcpLmFkZENsYXNzKCdoaWRkZW4teHMnKTtcclxuXHRcdFx0XHRpZiAoIHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2VjLW5hdi1yaWdodC1oaWRlXScpLmdldCgpID09ICcxJyApIG5hdi5hZGRDbGFzcygnaGlkZGVuLXhzJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bmF2LnJlbW92ZUNsYXNzKCdoaWRkZW4teHMnKTtcclxuXHRcdFx0XHRuYXYuZmluZCgnLmxlZnQnKS5yZW1vdmVDbGFzcygnaGlkZGVuLXhzJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2VjLW5hdi1yaWdodC1jb2RlXScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xyXG5cdFx0XHQkKCcjc2Vjb25kLW5hdiAucmlnaHQgLmNvZGUtaW5uZXInKS5odG1sKHRvKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2VjLW5hdi1yaWdodC1oaWRlXScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xyXG5cdFx0XHR2YXIgbmF2ID0gJCgnI3NlY29uZC1uYXYnKTtcclxuXHRcdFx0aWYgKCB0byA9PSAnMScgKSB7XHJcblx0XHRcdFx0bmF2LmZpbmQoJy5yaWdodCcpLmFkZENsYXNzKCdoaWRkZW4teHMnKTtcclxuXHRcdFx0XHRpZiAoIHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbc2VjLW5hdi1sZWZ0LWhpZGVdJykuZ2V0KCkgPT0gJzEnICkgbmF2LmFkZENsYXNzKCdoaWRkZW4teHMnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRuYXYucmVtb3ZlQ2xhc3MoJ2hpZGRlbi14cycpO1xyXG5cdFx0XHRcdG5hdi5maW5kKCcucmlnaHQnKS5yZW1vdmVDbGFzcygnaGlkZGVuLXhzJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxufSkoalF1ZXJ5KTsiLCJcclxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cclxuQ1VTVE9NSVpFUiBJTlRFR1JBVElPTiAtIFRIRU1FU1xyXG4vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLyogZ2xvYmFsIF8sIHdwLCBNSVhUICovXHJcblxyXG5NSVhULnRoZW1lcyA9IHtcclxuXHRyZWdleDogL3RoZW1lLShbXlxcc10qKS8sXHJcblx0c2l0ZTogZmFsc2UsXHJcblx0bmF2OiBmYWxzZSxcclxuXHRzZWNOYXY6IGZhbHNlLFxyXG5cdGZvb3RlcjogZmFsc2UsXHJcblx0c2V0dXA6IGZhbHNlLFxyXG5cdGluaXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKCAhIHRoaXMuc2V0dXAgKSB7XHJcblx0XHRcdHRoaXMuc2l0ZSA9IGpRdWVyeSgnI21haW4td3JhcC1pbm5lcicpWzBdLmNsYXNzTmFtZS5tYXRjaCh0aGlzLnJlZ2V4KVsxXTtcclxuXHRcdFx0dGhpcy5uYXYgPSBqUXVlcnkoJyNtYWluLW5hdicpWzBdLmNsYXNzTmFtZS5tYXRjaCh0aGlzLnJlZ2V4KVsxXTtcclxuXHRcdFx0aWYgKCBqUXVlcnkoJyNzZWNvbmQtbmF2JykubGVuZ3RoICkgdGhpcy5zZWNOYXYgPSBqUXVlcnkoJyNzZWNvbmQtbmF2JylbMF0uY2xhc3NOYW1lLm1hdGNoKHRoaXMucmVnZXgpWzFdO1xyXG5cdFx0XHR0aGlzLmZvb3RlciA9IGpRdWVyeSgnI2NvbG9waG9uJylbMF0uY2xhc3NOYW1lLm1hdGNoKHRoaXMucmVnZXgpWzFdO1xyXG5cdFx0XHR0aGlzLnNldHVwID0gdHJ1ZTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHNldFRoZW1lOiBmdW5jdGlvbihlbGVtLCB0aGVtZSkge1xyXG5cdFx0aWYgKCBlbGVtLmxlbmd0aCA9PT0gMCApIHJldHVybjtcclxuXHRcdGlmICggdGhlbWUgPT0gJ2F1dG8nICkge1xyXG5cdFx0XHR0aGVtZSA9IHRoaXMuc2l0ZTtcclxuXHRcdFx0ZWxlbS5hdHRyKCdkYXRhLXRoZW1lJywgJ2F1dG8nKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGVsZW0ucmVtb3ZlQXR0cignZGF0YS10aGVtZScpO1xyXG5cdFx0fVxyXG5cdFx0ZWxlbVswXS5jbGFzc05hbWUgPSBlbGVtWzBdLmNsYXNzTmFtZS5yZXBsYWNlKHRoaXMucmVnZXgsICd0aGVtZS0nICsgdGhlbWUpO1xyXG5cdFx0ZWxlbS50cmlnZ2VyKCdyZWZyZXNoJykudHJpZ2dlcigndGhlbWUtY2hhbmdlJywgdGhlbWUpO1xyXG5cdH1cclxufTtcclxuXHJcbiggZnVuY3Rpb24oJCkge1xyXG5cdFxyXG5cdHZhciB0aGVtZXMgPSBNSVhULnRoZW1lcztcclxuXHJcblx0dGhlbWVzLmluaXQoKTtcclxuXHRcclxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3NpdGUtdGhlbWVdJywgZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XHJcblx0XHRcdHRoZW1lcy5zaXRlID0gdG87XHJcblx0XHRcdHZhciBlbGVtcyA9ICQoJyNtYWluLXdyYXAtaW5uZXIsIFtkYXRhLXRoZW1lPVwiYXV0b1wiXScpO1xyXG5cdFx0XHRlbGVtcy5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKHRoaXMpWzBdLmNsYXNzTmFtZSA9ICQodGhpcylbMF0uY2xhc3NOYW1lLnJlcGxhY2UodGhlbWVzLnJlZ2V4LCAndGhlbWUtJyArIHRvKTtcclxuXHRcdFx0XHQkKHRoaXMpLnRyaWdnZXIoJ3JlZnJlc2gnKS50cmlnZ2VyKCd0aGVtZS1jaGFuZ2UnLCB0byk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcblxyXG5cdHdwLmN1c3RvbWl6ZSgnbWl4dF9vcHRbbmF2LXRoZW1lXScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xyXG5cdFx0XHR0aGVtZXMubmF2ID0gdG87XHJcblx0XHRcdHRoZW1lcy5zZXRUaGVtZSgkKCcjbWFpbi1uYXYnKSwgdG8pO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcblx0d3AuY3VzdG9taXplKCdtaXh0X29wdFtzZWMtbmF2LXRoZW1lXScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xyXG5cdFx0XHR0aGVtZXMuc2VjTmF2ID0gdG87XHJcblx0XHRcdHRoZW1lcy5zZXRUaGVtZSgkKCcjc2Vjb25kLW5hdicpLCB0byk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W2Zvb3Rlci10aGVtZV0nLCBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dmFsdWUuYmluZCggZnVuY3Rpb24odG8pIHtcclxuXHRcdFx0dGhlbWVzLmZvb3RlciA9IHRvO1xyXG5cdFx0XHR0aGVtZXMuc2V0VGhlbWUoJCgnI2NvbG9waG9uJyksIHRvKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxufSkoalF1ZXJ5KTsiLCJcclxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC9cclxuQ1VTVE9NSVpFUiBJTlRFR1JBVElPTiAtIE5BViBUSEVNRVNcclxuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbiggZnVuY3Rpb24oJCkge1xyXG5cclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdC8qIGdsb2JhbCBfLCB3cCwgTUlYVCwgbWl4dF9jdXN0b21pemUsIHRpbnljb2xvciAqL1xyXG5cdFxyXG5cdHZhciBkZWZhdWx0cyA9IHtcclxuXHRcdCdhY2NlbnQnOiAgICAgJyNkZDNlM2UnLFxyXG5cdFx0J2JnJzogICAgICAgICAnI2ZmZicsXHJcblx0XHQnY29sb3InOiAgICAgICcjMzMzJyxcclxuXHRcdCdjb2xvci1pbnYnOiAgJyNmZmYnLFxyXG5cdFx0J2JvcmRlcic6ICAgICAnI2RkZCcsXHJcblx0XHQnYm9yZGVyLWludic6ICcjMzMzJyxcclxuXHR9O1xyXG5cclxuXHR2YXIgdGhlbWVzID0gTUlYVC50aGVtZXM7XHJcblx0XHJcblx0ZnVuY3Rpb24gdXBkYXRlTmF2VGhlbWVzKGRhdGEpIHtcclxuXHRcdCQuZWFjaChkYXRhLCBmdW5jdGlvbihpZCwgdGhlbWUpIHtcclxuXHRcdFx0dmFyIGNzcztcclxuXHJcblx0XHRcdC8vIEdlbmVyYXRlIHRoZW1lIGlmIGFuIGVsZW1lbnQgdXNlcyBpdFxyXG5cdFx0XHRpZiAoIHRoZW1lcy5uYXYgPT0gaWQgfHwgdGhlbWVzLnNlY05hdiA9PSBpZCB8fCAoICggdGhlbWVzLm5hdiA9PSAnYXV0bycgfHwgdGhlbWVzLnNlY05hdiA9PSAnYXV0bycgKSAmJiB0aGVtZXMuc2l0ZSA9PSBpZCApICkge1xyXG5cclxuXHRcdFx0XHR2YXIgbmF2YmFyID0gJy5uYXZiYXIudGhlbWUtJytpZCxcclxuXHRcdFx0XHRcdG1haW5fbmF2YmFyID0gJy5uYXZiYXItbWl4dC50aGVtZS0nK2lkLFxyXG5cdFx0XHRcdFx0bWFpbl9uYXZfb3BhY2l0eSA9IG1peHRfY3VzdG9taXplLm5hdi5vcGFjaXR5IHx8IDAuOTUsXHJcblx0XHRcdFx0XHRuYXZiYXJfZGFyayxcclxuXHRcdFx0XHRcdG5hdmJhcl9saWdodCxcclxuXHJcblx0XHRcdFx0XHRhY2NlbnQgPSB0aGVtZS5hY2NlbnQgfHwgZGVmYXVsdHMuYWNjZW50LFxyXG5cdFx0XHRcdFx0YWNjZW50X2ludiA9IHRoZW1lWydhY2NlbnQtaW52J10gfHwgYWNjZW50LFxyXG5cclxuXHRcdFx0XHRcdGJnID0gdGhlbWUuYmcgfHwgZGVmYXVsdHMuYmcsXHJcblx0XHRcdFx0XHRiZ19kYXJrID0gdGhlbWVbJ2JnLWRhcmsnXSA9PSAnMScsXHJcblxyXG5cdFx0XHRcdFx0Ym9yZGVyID0gdGhlbWUuYm9yZGVyIHx8IGRlZmF1bHRzLmJvcmRlcixcclxuXHRcdFx0XHRcdGJvcmRlcl9pbnYgPSB0aGVtZVsnYm9yZGVyLWludiddIHx8IGRlZmF1bHRzWydib3JkZXItaW52J10sXHJcblxyXG5cdFx0XHRcdFx0Y29sb3IgPSB0aGVtZS5jb2xvciB8fCBkZWZhdWx0cy5jb2xvcixcclxuXHRcdFx0XHRcdGNvbG9yX2ludiA9IHRoZW1lWydjb2xvci1pbnYnXSB8fCBkZWZhdWx0c1snY29sb3ItaW52J10sXHJcblxyXG5cdFx0XHRcdFx0Y29sb3JfZm9yX2FjY2VudCA9IHRpbnljb2xvci5tb3N0UmVhZGFibGUoYWNjZW50LCBbJyNmZmYnLCAnIzAwMCddKS50b0hleFN0cmluZygpLFxyXG5cclxuXHRcdFx0XHRcdG1lbnVfYmcgPSB0aGVtZVsnbWVudS1iZyddIHx8IGJnLFxyXG5cdFx0XHRcdFx0bWVudV9iZ19kYXJrID0gdGlueWNvbG9yKG1lbnVfYmcpLmlzRGFyaygpLFxyXG5cdFx0XHRcdFx0bWVudV9ib3JkZXIgPSB0aGVtZVsnbWVudS1ib3JkZXInXSB8fCBib3JkZXIsXHJcblx0XHRcdFx0XHRtZW51X2JnX2hvdmVyID0gdGhlbWVbJ21lbnUtYmctaG92ZXInXSB8fCB0aW55Y29sb3IobWVudV9iZykuZGFya2VuKDIpLnRvU3RyaW5nKCksXHJcblx0XHRcdFx0XHRtZW51X2hvdmVyX2NvbG9yID0gdGhlbWVbJ21lbnUtaG92ZXItY29sb3InXSB8fCBhY2NlbnQsXHJcblx0XHRcdFx0XHRtZW51X2FjY2VudCxcclxuXHRcdFx0XHRcdG1lbnVfY29sb3IsXHJcblx0XHRcdFx0XHRtZW51X2NvbG9yX2ZhZGUsXHJcblxyXG5cdFx0XHRcdFx0YmdfbGlnaHRfYWNjZW50LCBiZ19saWdodF9jb2xvciwgYmdfbGlnaHRfYm9yZGVyLFxyXG5cdFx0XHRcdFx0YmdfZGFya19hY2NlbnQsIGJnX2RhcmtfY29sb3IsIGJnX2RhcmtfYm9yZGVyLFxyXG5cclxuXHRcdFx0XHRcdHRoZW1lX3JnYmEgPSB0aGVtZS5yZ2JhID09ICcxJyxcclxuXHRcdFx0XHRcdGJvcmRlcl9yZ2JhID0gJycsXHJcblx0XHRcdFx0XHRtZW51X2JnX3JnYmEgPSAnJyxcclxuXHRcdFx0XHRcdG1lbnVfYm9yZGVyX3JnYmEgPSAnJztcclxuXHJcblx0XHRcdFx0Ly8gU2V0IEFjY2VudCBBbmQgVGV4dCBDb2xvcnMgQWNjb3JkaW5nIFRvIFRoZSBCYWNrZ3JvdW5kIENvbG9yXHJcblxyXG5cdFx0XHRcdGlmICggYmdfZGFyayApIHtcclxuXHRcdFx0XHRcdG5hdmJhcl9kYXJrICA9IG5hdmJhcjtcclxuXHRcdFx0XHRcdG5hdmJhcl9saWdodCA9IG5hdmJhcisnLmJnLWxpZ2h0JztcclxuXHJcblx0XHRcdFx0XHRiZ19saWdodF9jb2xvciAgPSBjb2xvcl9pbnY7XHJcblx0XHRcdFx0XHRiZ19saWdodF9hY2NlbnQgPSBhY2NlbnRfaW52O1xyXG5cclxuXHRcdFx0XHRcdGJnX2RhcmtfY29sb3IgID0gY29sb3I7XHJcblx0XHRcdFx0XHRiZ19kYXJrX2FjY2VudCA9IGFjY2VudDtcclxuXHJcblx0XHRcdFx0XHRiZ19kYXJrX2JvcmRlciAgPSBib3JkZXI7XHJcblx0XHRcdFx0XHRiZ19saWdodF9ib3JkZXIgPSBib3JkZXJfaW52O1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRuYXZiYXJfZGFyayAgPSBuYXZiYXIrJy5iZy1kYXJrJztcclxuXHRcdFx0XHRcdG5hdmJhcl9saWdodCA9IG5hdmJhcjtcclxuXHJcblx0XHRcdFx0XHRiZ19saWdodF9jb2xvciAgPSBjb2xvcjtcclxuXHRcdFx0XHRcdGJnX2xpZ2h0X2FjY2VudCA9IGFjY2VudDtcclxuXHJcblx0XHRcdFx0XHRiZ19kYXJrX2NvbG9yICA9IGNvbG9yX2ludjtcclxuXHRcdFx0XHRcdGJnX2RhcmtfYWNjZW50ID0gYWNjZW50X2ludjtcclxuXHJcblx0XHRcdFx0XHRiZ19kYXJrX2JvcmRlciAgPSBib3JkZXJfaW52O1xyXG5cdFx0XHRcdFx0YmdfbGlnaHRfYm9yZGVyID0gYm9yZGVyO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dmFyIGhhc19pbnZfYWNjZW50ID0gKCBiZ19saWdodF9hY2NlbnQgIT0gYmdfZGFya19hY2NlbnQgKTtcclxuXHJcblx0XHRcdFx0Ly8gU2V0IE1lbnUgQWNjZW50IEFuZCBUZXh0IENvbG9ycyBBY2NvcmRpbmcgVG8gVGhlIEJhY2tncm91bmQgQ29sb3JcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZiAoIG1lbnVfYmdfZGFyayApIHtcclxuXHRcdFx0XHRcdG1lbnVfY29sb3IgICAgICA9IHRoZW1lWydtZW51LWNvbG9yJ10gfHwgYmdfZGFya19jb2xvcjtcclxuXHRcdFx0XHRcdG1lbnVfY29sb3JfZmFkZSA9IHRoZW1lWydtZW51LWNvbG9yLWZhZGUnXSB8fCBtZW51X2NvbG9yO1xyXG5cdFx0XHRcdFx0bWVudV9hY2NlbnQgICAgID0gYmdfZGFya19hY2NlbnQ7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG1lbnVfY29sb3IgICAgICA9IHRoZW1lWydtZW51LWNvbG9yJ10gfHwgYmdfbGlnaHRfY29sb3I7XHJcblx0XHRcdFx0XHRtZW51X2NvbG9yX2ZhZGUgPSB0aGVtZVsnbWVudS1jb2xvci1mYWRlJ10gfHwgbWVudV9jb2xvcjtcclxuXHRcdFx0XHRcdG1lbnVfYWNjZW50ICAgICA9IGJnX2xpZ2h0X2FjY2VudDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIE1ha2UgUkdCQSBDb2xvcnMgSWYgRW5hYmxlZFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmICggdGhlbWVfcmdiYSApIHtcclxuXHRcdFx0XHRcdGJvcmRlcl9yZ2JhID0gJ2JvcmRlci1jb2xvcjogJyt0aW55Y29sb3IoYm9yZGVyKS5zZXRBbHBoYSgwLjgpLnRvUGVyY2VudGFnZVJnYlN0cmluZygpKyc7JztcclxuXHRcdFx0XHRcdG1lbnVfYmdfcmdiYSA9ICdiYWNrZ3JvdW5kLWNvbG9yOiAnK3Rpbnljb2xvcihtZW51X2JnKS5zZXRBbHBoYSgwLjk1KS50b1BlcmNlbnRhZ2VSZ2JTdHJpbmcoKSsnOyc7XHJcblx0XHRcdFx0XHRtZW51X2JvcmRlcl9yZ2JhID0gJ2JvcmRlci1jb2xvcjogJyt0aW55Y29sb3IobWVudV9ib3JkZXIpLnNldEFscGhhKDAuOCkudG9QZXJjZW50YWdlUmdiU3RyaW5nKCkrJzsnO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gU1RBUlQgQ1NTIFJVTEVTXHJcblxyXG5cdFx0XHRcdGNzcyA9IG5hdmJhcisnIHsgYm9yZGVyLWNvbG9yOiAnK2JvcmRlcisnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnKyc7IH0nO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmICggbWFpbl9uYXZfb3BhY2l0eSA8IDEgKSB7XHJcblx0XHRcdFx0XHRjc3MgKz0gbWFpbl9uYXZiYXIrJzpub3QoLnBvc2l0aW9uLXRvcCk6bm90KC52ZXJ0aWNhbCkgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK3Rpbnljb2xvcihiZykuc2V0QWxwaGEobWFpbl9uYXZfb3BhY2l0eSkudG9QZXJjZW50YWdlUmdiU3RyaW5nKCkrJzsgfSc7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjc3MgKz0gbmF2YmFyKycuaW5pdCB7IGJhY2tncm91bmQtY29sb3I6ICcrYmcrJyAhaW1wb3J0YW50OyB9JztcclxuXHJcblx0XHRcdFx0aWYgKCBiZ19kYXJrICkge1xyXG5cdFx0XHRcdFx0Y3NzICs9IG5hdmJhcisnIC5uYXZiYXItZGF0YTpiZWZvcmUgeyBjb250ZW50OiBcImRhcmtcIjsgfSc7XHJcblx0XHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgI25hdi1sb2dvIC5sb2dvLWRhcmsgeyBwb3NpdGlvbjogc3RhdGljOyBvcGFjaXR5OiAxOyB2aXNpYmlsaXR5OiB2aXNpYmxlOyB9JztcclxuXHRcdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAjbmF2LWxvZ28gLmxvZ28tbGlnaHQgeyBwb3NpdGlvbjogYWJzb2x1dGU7IG9wYWNpdHk6IDA7IHZpc2liaWxpdHk6IGhpZGRlbjsgfSc7XHJcblx0XHRcdFx0XHRjc3MgKz0gbmF2YmFyX2xpZ2h0KycgI25hdi1sb2dvIC5sb2dvLWRhcmsgeyBwb3NpdGlvbjogYWJzb2x1dGU7IG9wYWNpdHk6IDA7IHZpc2liaWxpdHk6IGhpZGRlbjsgfSc7XHJcblx0XHRcdFx0XHRjc3MgKz0gbmF2YmFyX2xpZ2h0KycgI25hdi1sb2dvIC5sb2dvLWxpZ2h0IHsgcG9zaXRpb246IHN0YXRpYzsgb3BhY2l0eTogMTsgdmlzaWJpbGl0eTogdmlzaWJsZTsgfSc7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAubmF2YmFyLWRhdGE6YmVmb3JlIHsgY29udGVudDogXCJsaWdodFwiOyB9JztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIFN1Ym1lbnVzXHJcblxyXG5cdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAuc3ViLW1lbnUgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK21lbnVfYmcrJzsgJyttZW51X2JnX3JnYmErJyB9JztcclxuXHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLnN1Yi1tZW51IGxpID4gYTpob3ZlciwgJytuYXZiYXIrJyAuc3ViLW1lbnUgbGkgPiBhOmhvdmVyOmZvY3VzLCAnO1xyXG5cdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAuc3ViLW1lbnUgbGk6aG92ZXIgPiBhOmhvdmVyLCAnK25hdmJhcisnIC5zdWItbWVudSBsaS5ob3ZlciA+IGE6aG92ZXIgeyBjb2xvcjogJyttZW51X2hvdmVyX2NvbG9yKyc7IGJhY2tncm91bmQtY29sb3I6ICcrbWVudV9iZ19ob3ZlcisnOyB9JztcclxuXHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLnN1Yi1tZW51IGxpID4gYSwgJytuYXZiYXIrJyAuc3ViLW1lbnUgaW5wdXQgeyBjb2xvcjogJyttZW51X2NvbG9yKyc7IH0nO1xyXG5cdFx0XHRcdGNzcyArPSBuYXZiYXIrJyAuc3ViLW1lbnUgaW5wdXQ6Oi13ZWJraXQtaW5wdXQtcGxhY2Vob2xkZXIgeyBjb2xvcjogJyttZW51X2NvbG9yX2ZhZGUrJzsgfSc7XHJcblx0XHRcdFx0Y3NzICs9IG5hdmJhcisnIC5zdWItbWVudSBpbnB1dDo6LW1vei1wbGFjZWhvbGRlciB7IGNvbG9yOiAnK21lbnVfY29sb3JfZmFkZSsnOyB9JztcclxuXHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLnN1Yi1tZW51IGlucHV0Oi1tcy1pbnB1dC1wbGFjZWhvbGRlciB7IGNvbG9yOiAnK21lbnVfY29sb3JfZmFkZSsnOyB9JztcclxuXHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLnN1Yi1tZW51LCAnK25hdmJhcisnIC5zdWItbWVudSA+IGxpLCAnK25hdmJhcisnIC5zdWItbWVudSA+IGxpID4gYSB7IGJvcmRlci1jb2xvcjogJyttZW51X2JvcmRlcisnOyAnK21lbnVfYm9yZGVyX3JnYmErJyB9JztcclxuXHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLnN1Yi1tZW51IGxpID4gYTpob3ZlciwgJytuYXZiYXIrJyAuc3ViLW1lbnUgLmFjdGl2ZSA+IGEsICcrbmF2YmFyKycgLnN1Yi1tZW51IC5hY3RpdmUgPiBhOmhvdmVyIHsgY29sb3I6ICcrbWVudV9hY2NlbnQrJzsgfSc7XHJcblxyXG5cdFx0XHRcdC8vIE90aGVyIEVsZW1lbnRzXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Y3NzICs9IG5hdmJhcisnIC5uYXYtc2VhcmNoIC5zZWFyY2gtZm9ybSBidXR0b24geyBib3JkZXItY29sb3I6ICcrbWVudV9ib3JkZXIrJzsgJyttZW51X2JvcmRlcl9yZ2JhKycgYmFja2dyb3VuZC1jb2xvcjogJyt0aW55Y29sb3IobWVudV9iZykuZGFya2VuKDMpLnRvU3RyaW5nKCkrJzsgfSc7XHJcblx0XHRcdFx0Y3NzICs9IG5hdmJhcisnIC5uYXYtc2VhcmNoIC5zZWFyY2gtZm9ybSBidXR0b24sICRuYXZiYXIgLm5hdi1zZWFyY2ggLnNlYXJjaC1mb3JtIGlucHV0IHsgY29sb3I6ICcrbWVudV9jb2xvcisnOyB9JztcclxuXHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLmFjY2VudC1iZyB7IGNvbG9yOiAnK2NvbG9yX2Zvcl9hY2NlbnQrJzsgYmFja2dyb3VuZC1jb2xvcjogJythY2NlbnQrJzsgfSc7XHJcblxyXG5cdFx0XHRcdC8vIExpZ2h0IEJhY2tncm91bmRcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRjc3MgKz0gbmF2YmFyX2xpZ2h0KycgLm5hdiA+IGxpID4gYSwgJytuYXZiYXJfbGlnaHQrJyAudGV4dC1jb250LCAnK25hdmJhcl9saWdodCsnIC50ZXh0LWNvbnQgYTpob3ZlciwgJytuYXZiYXJfbGlnaHQrJyAudGV4dC1jb250IGEubm8tY29sb3IgeyBjb2xvcjogJytiZ19saWdodF9jb2xvcisnOyB9JztcclxuXHRcdFx0XHRpZiAoIGhhc19pbnZfYWNjZW50ICkge1xyXG5cdFx0XHRcdFx0Y3NzICs9IG5hdmJhcl9saWdodCsnIC5uYXYgPiBsaTpob3ZlciA+IGEsICcrbmF2YmFyX2xpZ2h0KycgLm5hdiA+IGxpLmhvdmVyID4gYSwgJytuYXZiYXJfbGlnaHQrJyAubmF2ID4gbGkgPiBhOmhvdmVyLCAnK25hdmJhcl9saWdodCsnIC5uYXYgPiAuYWN0aXZlID4gYSwgJytuYXZiYXJfbGlnaHQrJyAudGV4dC1jb250IGEgeyBjb2xvcjogJytiZ19saWdodF9hY2NlbnQrJzsgfSc7XHJcblx0XHRcdFx0XHRjc3MgKz0gbmF2YmFyX2xpZ2h0KycgLm5hdiA+IC5hY3RpdmUgPiBhOmJlZm9yZSB7IGJhY2tncm91bmQtY29sb3I6ICcrYmdfbGlnaHRfYWNjZW50Kyc7IH0nO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjc3MgKz0gbmF2YmFyX2xpZ2h0KycgLm5hdmJhci10b2dnbGUgLmljb24tYmFyIHsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19saWdodF9jb2xvcisnOyB9JztcclxuXHRcdFx0XHRjc3MgKz0gbmF2YmFyX2xpZ2h0KycgLm5hdiA+IGxpLCAnK25hdmJhcl9saWdodCsnIC5uYXYgPiBsaSA+IGEsICcrbmF2YmFyX2xpZ2h0KycgLm5hdmJhci10b2dnbGUgeyBib3JkZXItY29sb3I6ICcrYmdfbGlnaHRfYm9yZGVyKyc7IH0nO1xyXG5cdFx0XHRcdGNzcyArPSBuYXZiYXJfbGlnaHQrJyAuZGl2aWRlciB7IGJhY2tncm91bmQtY29sb3I6ICcrYmdfbGlnaHRfYm9yZGVyKyc7IH0nO1xyXG5cclxuXHRcdFx0XHQvLyBEYXJrIEJhY2tncm91bmRcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRjc3MgKz0gbmF2YmFyX2RhcmsrJyAubmF2ID4gbGkgPiBhLCAnK25hdmJhcl9kYXJrKycgLnRleHQtY29udCwgJytuYXZiYXJfZGFyaysnIC50ZXh0LWNvbnQgYTpob3ZlciwgJytuYXZiYXJfZGFyaysnIC50ZXh0LWNvbnQgYS5uby1jb2xvciB7IGNvbG9yOiAnK2JnX2RhcmtfY29sb3IrJzsgfSc7XHJcblx0XHRcdFx0aWYgKCBoYXNfaW52X2FjY2VudCApIHtcclxuXHRcdFx0XHRcdGNzcyArPSBuYXZiYXJfZGFyaysnIC5uYXYgPiBsaTpob3ZlciA+IGEsICcrbmF2YmFyX2RhcmsrJyAubmF2ID4gbGkuaG92ZXIgPiBhLCAnK25hdmJhcl9kYXJrKycgLm5hdiA+IGxpID4gYTpob3ZlciwgJytuYXZiYXJfZGFyaysnIC5uYXYgPiAuYWN0aXZlID4gYSwgJytuYXZiYXJfZGFyaysnIC50ZXh0LWNvbnQgYSB7IGNvbG9yOiAnK2JnX2RhcmtfYWNjZW50Kyc7IH0nO1xyXG5cdFx0XHRcdFx0Y3NzICs9IG5hdmJhcl9kYXJrKycgLm5hdiA+IC5hY3RpdmUgPiBhOmJlZm9yZSB7IGJhY2tncm91bmQtY29sb3I6ICcrYmdfZGFya19hY2NlbnQrJzsgfSc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNzcyArPSBuYXZiYXJfZGFyaysnIC5uYXZiYXItdG9nZ2xlIC5pY29uLWJhciB7IGJhY2tncm91bmQtY29sb3I6ICcrYmdfZGFya19jb2xvcisnOyB9JztcclxuXHRcdFx0XHRjc3MgKz0gbmF2YmFyX2RhcmsrJyAubmF2ID4gbGksICcrbmF2YmFyX2RhcmsrJyAubmF2ID4gbGkgPiBhLCAnK25hdmJhcl9kYXJrKycgLm5hdmJhci10b2dnbGUgeyBib3JkZXItY29sb3I6ICcrYmdfZGFya19ib3JkZXIrJzsgfSc7XHJcblx0XHRcdFx0Y3NzICs9IG5hdmJhcl9kYXJrKycgLmRpdmlkZXIgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2RhcmtfYm9yZGVyKyc7IH0nO1xyXG5cclxuXHRcdFx0XHRpZiAoICEgaGFzX2ludl9hY2NlbnQgKSB7XHJcblx0XHRcdFx0XHRjc3MgKz0gbmF2YmFyKycgLm5hdiA+IGxpOmhvdmVyID4gYSwgJytuYXZiYXIrJyAubmF2ID4gbGkuaG92ZXIgPiBhLCAnK25hdmJhcisnIC5uYXYgPiBsaSA+IGE6aG92ZXIsICcrbmF2YmFyKycgLm5hdiA+IGxpLmFjdGl2ZSA+IGEsICcrbmF2YmFyKycgLnRleHQtY29udCBhIHsgY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xyXG5cdFx0XHRcdFx0Y3NzICs9IG5hdmJhcisnIC5uYXYgPiAuYWN0aXZlID4gYTpiZWZvcmUgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2FjY2VudCsnOyB9JztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIE1haW4gTmF2YmFyIE1vYmlsZSBTdHlsaW5nXHJcblxyXG5cdFx0XHRcdGNzcyArPSAnQG1lZGlhICggbWF4LXdpZHRoOiAnK21peHRfY3VzdG9taXplLmJyZWFrcG9pbnRzLm1hcnMrJ3B4ICkgeyc7XHJcblx0XHRcdFx0XHRjc3MgKz0gbWFpbl9uYXZiYXIrJyAubmF2YmFyLWlubmVyIHsgYmFja2dyb3VuZC1jb2xvcjogJyttZW51X2JnKyc7ICcrbWVudV9iZ19yZ2JhKycgfSc7XHJcblx0XHRcdFx0XHRjc3MgKz0gbWFpbl9uYXZiYXIrJyAubmF2YmFyLWlubmVyIC50ZXh0LWNvbnQsICcrbWFpbl9uYXZiYXIrJyAubmF2YmFyLWlubmVyIC50ZXh0LWNvbnQgYTpob3ZlciwgJyttYWluX25hdmJhcisnIC5uYXZiYXItaW5uZXIgLnRleHQtY29udCBhLm5vLWNvbG9yLCAnK21haW5fbmF2YmFyKycgLm5hdiA+IGxpID4gYSB7IGNvbG9yOiAnK21lbnVfY29sb3IrJzsgfSc7XHJcblx0XHRcdFx0XHRjc3MgKz0gbWFpbl9uYXZiYXIrJyAubmF2ID4gbGkgPiBhOmhvdmVyLCAnK21haW5fbmF2YmFyKycgLm5hdiA+IGxpID4gYTpob3Zlcjpmb2N1cywgJyttYWluX25hdmJhcisnIC5uYXYgPiBsaTpob3ZlciA+IGE6aG92ZXIsICc7XHJcblx0XHRcdFx0XHRjc3MgKz0gbWFpbl9uYXZiYXIrJyAubmF2ID4gbGkuaG92ZXIgPiBhOmhvdmVyLCAnK21haW5fbmF2YmFyKycgLm5hdiA+IGxpLmFjdGl2ZSA+IGE6aG92ZXIgeyBjb2xvcjogJyttZW51X2hvdmVyX2NvbG9yKyc7IGJhY2tncm91bmQtY29sb3I6ICcrbWVudV9iZ19ob3ZlcisnOyB9JztcclxuXHRcdFx0XHRcdGNzcyArPSBtYWluX25hdmJhcisnIC5uYXYgPiBsaTpob3ZlciA+IGEsICcrbWFpbl9uYXZiYXIrJyAubmF2ID4gbGkuaG92ZXIgPiBhIHsgY29sb3I6ICcrbWVudV9jb2xvcisnOyB9JztcclxuXHRcdFx0XHRcdGNzcyArPSBtYWluX25hdmJhcisnIC5uYXYgbGkubmF2LXNlYXJjaDpob3ZlciA+IGEsICcrbWFpbl9uYXZiYXIrJyAubmF2IGxpLm5hdi1zZWFyY2guaG92ZXIgPiBhIHsgY29sb3I6ICcrbWVudV9jb2xvcisnICFpbXBvcnRhbnQ7IGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50ICFpbXBvcnRhbnQ7IH0nO1xyXG5cdFx0XHRcdFx0Y3NzICs9IG1haW5fbmF2YmFyKycgLm5hdiA+IGxpLmFjdGl2ZSA+IGEsICcrbWFpbl9uYXZiYXIrJyAubmF2YmFyLWlubmVyIC50ZXh0LWNvbnQgYSB7IGNvbG9yOiAnK21lbnVfYWNjZW50Kyc7IH0nO1xyXG5cdFx0XHRcdFx0aWYgKCBoYXNfaW52X2FjY2VudCApIHtcclxuXHRcdFx0XHRcdFx0Y3NzICs9IG1haW5fbmF2YmFyKycgLm5hdiA+IC5hY3RpdmUgPiBhOmJlZm9yZSB7IGJhY2tncm91bmQtY29sb3I6ICcrbWVudV9hY2NlbnQrJzsgfSc7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjc3MgKz0gbWFpbl9uYXZiYXIrJyAubmF2YmFyLWlubmVyLCAnK21haW5fbmF2YmFyKycgLm5hdiA+IGxpLCAnK21haW5fbmF2YmFyKycgLm5hdiA+IGxpID4gYSB7IGJvcmRlci1jb2xvcjogJyttZW51X2JvcmRlcisnOyAnK21lbnVfYm9yZGVyX3JnYmErJyB9JztcclxuXHRcdFx0XHRjc3MgKz0gJ30nO1xyXG5cclxuXHRcdFx0XHRNSVhULnN0eWxlc2hlZXQoJ25hdi10aGVtZS0nK2lkLCBjc3MpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHQkKCcubmF2YmFyJykudHJpZ2dlcigncmVmcmVzaCcpO1xyXG5cdH1cclxuXHRcclxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi10aGVtZXNdJywgZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHZhbHVlLmJpbmQoIGZ1bmN0aW9uKHRvKSB7XHJcblx0XHRcdHVwZGF0ZU5hdlRoZW1lcyh0byk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHJcblx0Ly8gR2VuZXJhdGUgY3VzdG9tIHRoZW1lcyBpZiB0aGVtZSBpcyBjaGFuZ2VkIGZyb20gb25lIG9mIHRoZSBkZWZhdWx0c1xyXG5cdGZ1bmN0aW9uIG1heWJlVXBkYXRlTmF2VGhlbWVzKGlkKSB7XHJcblx0XHRpZiAoIGlkID09ICdhdXRvJyApIGlkID0gdGhlbWVzLnNpdGU7XHJcblx0XHRpZiAoICEgXy5oYXMobWl4dF9jdXN0b21pemUudGhlbWVzLCBpZCkgKSB7XHJcblx0XHRcdHZhciBuYXZUaGVtZXMgPSB3cC5jdXN0b21pemUoJ21peHRfb3B0W25hdi10aGVtZXNdJykuZ2V0KCk7XHJcblx0XHRcdHVwZGF0ZU5hdlRoZW1lcyhuYXZUaGVtZXMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQkKCcjbWFpbi1uYXYnKS5vbigndGhlbWUtY2hhbmdlJywgZnVuY3Rpb24oZXZlbnQsIHRoZW1lKSB7XHJcblx0XHRtYXliZVVwZGF0ZU5hdlRoZW1lcyh0aGVtZSk7XHJcblx0fSk7XHJcblx0JCgnI3NlY29uZC1uYXYnKS5vbigndGhlbWUtY2hhbmdlJywgZnVuY3Rpb24oZXZlbnQsIHRoZW1lKSB7XHJcblx0XHRtYXliZVVwZGF0ZU5hdlRoZW1lcyh0aGVtZSk7XHJcblx0fSk7XHJcblxyXG59KShqUXVlcnkpOyIsIlxyXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gL1xyXG5DVVNUT01JWkVSIElOVEVHUkFUSU9OIC0gU0lURSBUSEVNRVNcclxuLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbiggZnVuY3Rpb24oJCkge1xyXG5cclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdC8qIGdsb2JhbCBfLCB3cCwgTUlYVCwgbWl4dF9jdXN0b21pemUsIHRpbnljb2xvciAqL1xyXG5cdFxyXG5cdHZhciBkZWZhdWx0cyA9IHtcclxuXHRcdCdhY2NlbnQnOiAgICAgJyNkZDNlM2UnLFxyXG5cdFx0J2JnJzogICAgICAgICAnI2ZmZicsXHJcblx0XHQnY29sb3InOiAgICAgICcjMzMzJyxcclxuXHRcdCdjb2xvci1pbnYnOiAgJyNmZmYnLFxyXG5cdFx0J2JvcmRlcic6ICAgICAnI2RkZCcsXHJcblx0fTtcclxuXHJcblx0dmFyIHRoZW1lcyA9IE1JWFQudGhlbWVzO1xyXG5cclxuXHRmdW5jdGlvbiBwYXJzZV9zZWxlY3RvcihwYXR0ZXJuLCBzZWwpIHtcclxuXHRcdHZhciBzZWxlY3RvciA9ICcnO1xyXG5cdFx0aWYgKCBfLmlzQXJyYXkoc2VsKSApIHtcclxuXHRcdFx0JC5lYWNoKHNlbCwgZnVuY3Rpb24oaSwgc2luZ2xlX3NlbCkge1xyXG5cdFx0XHRcdHNlbGVjdG9yICs9IHBhdHRlcm4ucmVwbGFjZSgvXFx7XFx7c2VsXFx9XFx9L2csIHNpbmdsZV9zZWwpICsgJywnO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0c2VsZWN0b3IgPSBzZWxlY3Rvci5yZXBsYWNlKC8sKyQvLCAnJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzZWxlY3RvciA9IHBhdHRlcm4ucmVwbGFjZSgvXFx7XFx7c2VsXFx9XFx9L2csIHNlbCk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gc2VsZWN0b3I7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRfdGV4dHNoX2Zvcl9iZyhiZywgY29sb3JzKSB7XHJcblx0XHRjb2xvcnMgPSBjb2xvcnMgfHwgWydyZ2JhKDAsMCwwLDAuMSknLCAncmdiYSgyNTUsMjU1LDI1NSwwLjEpJ107XHJcblx0XHRpZiAoIHRpbnljb2xvcihiZykuaXNMaWdodCgpICkge1xyXG5cdFx0XHRyZXR1cm4gY29sb3JzWzBdO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIGNvbG9yc1sxXTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGJ1dHRvbl9jb2xvcihzZWwsIGNvbG9yLCBwcmUpIHtcclxuXHRcdHByZSA9IHByZSB8fCAnLm1peHQnO1xyXG5cclxuXHRcdHZhciBjc3MgPSAnJyxcclxuXHRcdFx0Y29sb3JfZm9yX2JnID0gdGlueWNvbG9yLm1vc3RSZWFkYWJsZShjb2xvciwgWycjZmZmJywgJyMwMDAnXSkudG9IZXhTdHJpbmcoKSxcclxuXHRcdFx0Ym9yZGVyX2NvbG9yID0gdGlueWNvbG9yKGNvbG9yKS5kYXJrZW4oNSkudG9TdHJpbmcoKSxcclxuXHRcdFx0dGV4dF9zaGFkb3cgID0gc2V0X3RleHRzaF9mb3JfYmcoY29sb3IpLFxyXG5cdFx0XHRjb2xvcl9kYXJrZXIgPSB0aW55Y29sb3IoY29sb3IpLmRhcmtlbigxMCkudG9TdHJpbmcoKSxcclxuXHRcdFx0YnRuX3NvbGlkX2hvdmVyX2JnLFxyXG5cdFx0XHRidG5fb3V0bGluZV9ob3Zlcl9iZztcclxuXHJcblx0XHRpZiAoIHRpbnljb2xvcihjb2xvcikuaXNMaWdodCgpICkge1xyXG5cdFx0XHRidG5fc29saWRfaG92ZXJfYmcgPSB0aW55Y29sb3IoY29sb3IpLmRhcmtlbig1KS50b1N0cmluZygpO1xyXG5cdFx0XHRidG5fb3V0bGluZV9ob3Zlcl9iZyA9ICdyZ2JhKDAsMCwwLDAuMDMpJztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGJ0bl9zb2xpZF9ob3Zlcl9iZyA9IHRpbnljb2xvcihjb2xvcikubGlnaHRlbig1KS50b1N0cmluZygpO1xyXG5cdFx0XHRidG5fb3V0bGluZV9ob3Zlcl9iZyA9ICdyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpJztcclxuXHRcdH1cclxuXHJcblx0XHQvLyBTb2xpZCBCYWNrZ3JvdW5kXHJcblx0XHRcclxuXHRcdGNzcyArPSBwYXJzZV9zZWxlY3RvcihwcmUrJyAuYnRuLXt7c2VsfX0nLCBzZWwpICsgJyB7IGJvcmRlci1jb2xvcjogJytib3JkZXJfY29sb3IrJzsgdGV4dC1zaGFkb3c6IDAgMXB4IDFweCAnK3RleHRfc2hhZG93Kyc7IGJhY2tncm91bmQtY29sb3I6ICcrY29sb3IrJzsgfSc7XHJcblx0XHRjc3MgKz0gcGFyc2Vfc2VsZWN0b3IocHJlKycgLmJ0bi17e3NlbH19OmhvdmVyLCAnK3ByZSsnIC5idG4te3tzZWx9fTpmb2N1cycsIHNlbCkgKyAnIHsgYmFja2dyb3VuZC1jb2xvcjogJytidG5fc29saWRfaG92ZXJfYmcrJzsgfSc7XHJcblx0XHRjc3MgKz0gcGFyc2Vfc2VsZWN0b3IocHJlKycgLmJ0bi1ob3Zlci17e3NlbH19OmhvdmVyLCAnK3ByZSsnIC5idG4taG92ZXIte3tzZWx9fTpmb2N1cycsIHNlbCkgKyAnIHsgYm9yZGVyLWNvbG9yOiAnK2JvcmRlcl9jb2xvcisnOyB0ZXh0LXNoYWRvdzogMCAxcHggMXB4ICcrdGV4dF9zaGFkb3crJzsgYmFja2dyb3VuZC1jb2xvcjogJytjb2xvcisnICFpbXBvcnRhbnQ7IH0nO1xyXG5cdFx0Y3NzICs9IHBhcnNlX3NlbGVjdG9yKHByZSsnIC5idG4te3tzZWx9fTphY3RpdmUsICcrcHJlKycgLmJ0bi17e3NlbH19LmFjdGl2ZSwgJytwcmUrJyAuYnRuLWhvdmVyLXt7c2VsfX06aG92ZXI6YWN0aXZlLCAnK3ByZSsnIC5idG4taG92ZXIte3tzZWx9fTpob3Zlci5hY3RpdmUnLCBzZWwpICsgJyB7IGJvcmRlci1jb2xvcjogJytjb2xvcl9kYXJrZXIrJzsgYm94LXNoYWRvdzogaW5zZXQgMCAxcHggMTJweCAnK2NvbG9yX2RhcmtlcisnOyB9JztcclxuXHRcdGNzcyArPSBwYXJzZV9zZWxlY3RvcihwcmUrJyAuYnRuLXt7c2VsfX0sICcrcHJlKycgYS5idG4te3tzZWx9fSwgJytwcmUrJyAuYnRuLXt7c2VsfX06aG92ZXIsICcrcHJlKycgLmJ0bi17e3NlbH19OmZvY3VzLCAnK3ByZSsnIC5idG4taG92ZXIte3tzZWx9fTpob3ZlciwgJytwcmUrJyBhLmJ0bi1ob3Zlci17e3NlbH19OmhvdmVyLCAnK3ByZSsnIC5idG4taG92ZXIte3tzZWx9fTpmb2N1cycsIHNlbCkgKyAnIHsgY29sb3I6ICcrY29sb3JfZm9yX2JnKyc7IH0nO1xyXG5cclxuXHRcdC8vIE91dGxpbmVcclxuXHRcdFxyXG5cdFx0Y3NzICs9IHBhcnNlX3NlbGVjdG9yKHByZSsnIC5idG4tb3V0bGluZS17e3NlbH19OmhvdmVyJywgc2VsKSArICcgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2J0bl9vdXRsaW5lX2hvdmVyX2JnKyc7IH0nO1xyXG5cdFx0Y3NzICs9IHBhcnNlX3NlbGVjdG9yKHByZSsnIC5idG4tb3V0bGluZS17e3NlbH19LCAnK3ByZSsnIC5idG4taG92ZXItb3V0bGluZS17e3NlbH19OmhvdmVyJywgc2VsKSArICcgeyBib3JkZXI6IDFweCBzb2xpZCAnK2JvcmRlcl9jb2xvcisnOyB0ZXh0LXNoYWRvdzogbm9uZSAhaW1wb3J0YW50OyBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDsgfSc7XHJcblx0XHRjc3MgKz0gcGFyc2Vfc2VsZWN0b3IocHJlKycgLmJ0bi1vdXRsaW5lLXt7c2VsfX06YWN0aXZlLCAnK3ByZSsnIC5idG4tb3V0bGluZS17e3NlbH19LmFjdGl2ZSwgJytwcmUrJyAuYnRuLWhvdmVyLW91dGxpbmUte3tzZWx9fTpob3ZlcjphY3RpdmUsICcrcHJlKycgLmJ0bi1ob3Zlci1vdXRsaW5lLXt7c2VsfX06aG92ZXIuYWN0aXZlJywgc2VsKSArICcgeyBib3gtc2hhZG93OiBpbnNldCAwIDFweCAxNnB4IHJnYmEoMCwwLDAsMC4wNSk7IH0nO1xyXG5cdFx0Y3NzICs9IHBhcnNlX3NlbGVjdG9yKHByZSsnIC5idG4taG92ZXItb3V0bGluZS17e3NlbH19OmhvdmVyJywgc2VsKSArICcgeyBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudCAhaW1wb3J0YW50OyB9JztcclxuXHRcdGNzcyArPSBwYXJzZV9zZWxlY3RvcihwcmUrJyAuYnRuLW91dGxpbmUte3tzZWx9fSwgJytwcmUrJyBhLmJ0bi1vdXRsaW5lLXt7c2VsfX0sICcrcHJlKycgLmJ0bi1vdXRsaW5lLXt7c2VsfX06aG92ZXIsICcrcHJlKycgLmJ0bi1vdXRsaW5lLXt7c2VsfX06Zm9jdXMsICcrcHJlKycgLmJ0bi1ob3Zlci1vdXRsaW5lLXt7c2VsfX06aG92ZXIsICcrcHJlKycgYS5idG4taG92ZXItb3V0bGluZS17e3NlbH19OmhvdmVyLCAnK3ByZSsnIC5idG4taG92ZXItb3V0bGluZS17e3NlbH19OmZvY3VzJywgc2VsKSArICcgeyBjb2xvcjogJytjb2xvcisnOyB9JztcclxuXHJcblx0XHQvLyBBbmltYXRpb25zXHJcblxyXG5cdFx0Y3NzICs9IHBhcnNlX3NlbGVjdG9yKHByZSsnIC5idG4tZmlsbC1pbi17e3NlbH19Jywgc2VsKSArICcgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2NvbG9yKycgIWltcG9ydGFudDsgfSc7XHJcblx0XHRjc3MgKz0gcGFyc2Vfc2VsZWN0b3IocHJlKycgLmJ0bi1maWxsLWluLXt7c2VsfX06aG92ZXIsICcrcHJlKycgLmJ0bi1maWxsLWluLXt7c2VsfX06Zm9jdXMsICcrcHJlKycgLmJ0bi1maWxsLWluLXt7c2VsfX06YWN0aXZlJywgc2VsKSArICcgeyBjb2xvcjogJytjb2xvcl9mb3JfYmcrJzsgYm9yZGVyLWNvbG9yOiAnK2NvbG9yKyc7IHRleHQtc2hhZG93OiAwIDFweCAxcHggJyt0ZXh0X3NoYWRvdysnOyB9JztcclxuXHRcdGNzcyArPSBwYXJzZV9zZWxlY3RvcihwcmUrJyAuYnRuLXt7c2VsfX0uYnRuLWZpbGwtaW46YmVmb3JlJywgc2VsKSArICcgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2NvbG9yKyc7IH0nO1xyXG5cdFx0Y3NzICs9IHBhcnNlX3NlbGVjdG9yKHByZSsnIC5idG4tZmlsbC17e3NlbH19OmhvdmVyLCAnK3ByZSsnIC5idG4tZmlsbC17e3NlbH19OmZvY3VzLCAnK3ByZSsnIC5idG4tZmlsbC17e3NlbH19OmFjdGl2ZScsIHNlbCkgKyAnIHsgY29sb3I6ICcrY29sb3JfZm9yX2JnKyc7IGJvcmRlci1jb2xvcjogJytjb2xvcisnOyB0ZXh0LXNoYWRvdzogMCAxcHggMXB4ICcrdGV4dF9zaGFkb3crJzsgfSc7XHJcblx0XHRjc3MgKz0gcGFyc2Vfc2VsZWN0b3IocHJlKycgLmJ0bi1maWxsLXt7c2VsfX06YmVmb3JlJywgc2VsKSArICcgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2NvbG9yKyc7IH0nO1xyXG5cclxuXHRcdC8vIFdvb0NvbW1lcmNlIEFjY2VudCBCdXR0b25cclxuXHRcdFxyXG5cdFx0aWYgKCBfLmlzQXJyYXkoc2VsKSAmJiBfLmNvbnRhaW5zKHNlbCwgJ2FjY2VudCcpICkge1xyXG5cdFx0XHRjc3MgKz0gcHJlKycgLndvb2NvbW1lcmNlIC5idXR0b24uYWx0LCAnK3ByZSsnIC53b29jb21tZXJjZSBpbnB1dFt0eXBlPXN1Ym1pdF0uYnV0dG9uLCAnK3ByZSsnIC53b29jb21tZXJjZSAjcmVzcG9uZCBpbnB1dCNzdWJtaXQgeyBjb2xvcjogJytjb2xvcl9mb3JfYmcrJyAhaW1wb3J0YW50OyBib3JkZXItY29sb3I6ICcrYm9yZGVyX2NvbG9yKycgIWltcG9ydGFudDsgdGV4dC1zaGFkb3c6IDAgMXB4IDFweCAnK3RleHRfc2hhZG93KycgIWltcG9ydGFudDsgYmFja2dyb3VuZC1jb2xvcjogJytjb2xvcisnICFpbXBvcnRhbnQ7IH0nO1xyXG5cdFx0XHRjc3MgKz0gcHJlKycgLndvb2NvbW1lcmNlIC5idXR0b24uYWx0OmhvdmVyLCAnK3ByZSsnIC53b29jb21tZXJjZSBpbnB1dFt0eXBlPXN1Ym1pdF0uYnV0dG9uOmhvdmVyLCAnK3ByZSsnIC53b29jb21tZXJjZSAjcmVzcG9uZCBpbnB1dCNzdWJtaXQ6aG92ZXIsICcgK1xyXG5cdFx0XHRcdCAgIHByZSsnIC53b29jb21tZXJjZSAuYnV0dG9uLmFsdDpmb2N1cywgJytwcmUrJyAud29vY29tbWVyY2UgaW5wdXRbdHlwZT1zdWJtaXRdLmJ1dHRvbjpmb2N1cywgJytwcmUrJyAud29vY29tbWVyY2UgI3Jlc3BvbmQgaW5wdXQjc3VibWl0OmZvY3VzIHsgYmFja2dyb3VuZC1jb2xvcjogJytidG5fc29saWRfaG92ZXJfYmcrJyAhaW1wb3J0YW50OyB9JztcclxuXHRcdFx0Y3NzICs9IHByZSsnIC53b29jb21tZXJjZSAuYnV0dG9uLmFsdDphY3RpdmUsICcrcHJlKycgLndvb2NvbW1lcmNlIGlucHV0W3R5cGU9c3VibWl0XS5idXR0b246YWN0aXZlLCAnK3ByZSsnIC53b29jb21tZXJjZSAjcmVzcG9uZCBpbnB1dCNzdWJtaXQ6YWN0aXZlLCAnICtcclxuXHRcdFx0XHQgICBwcmUrJyAud29vY29tbWVyY2UgLmJ1dHRvbi5hbHQuYWN0aXZlLCAnK3ByZSsnIC53b29jb21tZXJjZSBpbnB1dFt0eXBlPXN1Ym1pdF0uYnV0dG9uOmZvY3VzLCAnK3ByZSsnIC53b29jb21tZXJjZSAjcmVzcG9uZCBpbnB1dCNzdWJtaXQuYWN0aXZlIHsgYm9yZGVyLWNvbG9yOiAnK2NvbG9yX2RhcmtlcisnICFpbXBvcnRhbnQ7IGJveC1zaGFkb3c6IGluc2V0IDAgMXB4IDEycHggJytjb2xvcl9kYXJrZXIrJyAhaW1wb3J0YW50OyB9JztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gY3NzO1xyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiB1cGRhdGVTaXRlVGhlbWVzKGRhdGEpIHtcclxuXHRcdCQuZWFjaChkYXRhLCBmdW5jdGlvbihpZCwgdGhlbWUpIHtcclxuXHRcdFx0dmFyIGNzcztcclxuXHJcblx0XHRcdC8vIEdlbmVyYXRlIHRoZW1lIGlmIGl0J3MgaW4gdXNlXHJcblx0XHRcdGlmICggdGhlbWVzLnNpdGUgPT0gaWQgKSB7XHJcblxyXG5cdFx0XHRcdHZhciB0aCA9ICcudGhlbWUtJytpZCxcclxuXHJcblx0XHRcdFx0XHRhY2NlbnQgPSB0aGVtZS5hY2NlbnQgfHwgZGVmYXVsdHMuYWNjZW50LFxyXG5cdFx0XHRcdFx0YWNjZW50X2RhcmtlciA9IHRpbnljb2xvcihhY2NlbnQpLmRhcmtlbigxMCkudG9TdHJpbmcoKSxcclxuXHRcdFx0XHRcdGNvbG9yX2Zvcl9hY2NlbnQgPSB0aW55Y29sb3IubW9zdFJlYWRhYmxlKGFjY2VudCwgWycjZmZmJywgJyMwMDAnXSkudG9IZXhTdHJpbmcoKSxcclxuXHRcdFx0XHRcdHRleHRzaF9mb3JfYWNjZW50ID0gc2V0X3RleHRzaF9mb3JfYmcoYWNjZW50KSxcclxuXHJcblx0XHRcdFx0XHRiZyA9IHRoZW1lLmJnIHx8IGRlZmF1bHRzLmJnLFxyXG5cdFx0XHRcdFx0YmdfZGFya2VyID0gdGlueWNvbG9yKGJnKS5kYXJrZW4oMykudG9TdHJpbmcoKSxcclxuXHRcdFx0XHRcdGJnX2xpZ2h0ZXIgPSB0aW55Y29sb3IoYmcpLmxpZ2h0ZW4oMykudG9TdHJpbmcoKSxcclxuXHRcdFx0XHRcdGJnX2RhcmsgPSB0aGVtZVsnYmctZGFyayddID09ICcxJyxcclxuXHJcblx0XHRcdFx0XHRib3JkZXIgPSB0aGVtZS5ib3JkZXIgfHwgZGVmYXVsdHMuYm9yZGVyLFxyXG5cclxuXHRcdFx0XHRcdGNvbG9yID0gdGhlbWUuY29sb3IgfHwgZGVmYXVsdHMuY29sb3IsXHJcblx0XHRcdFx0XHRjb2xvcl9mYWRlID0gdGhlbWVbJ2NvbG9yLWZhZGUnXSB8fCB0aW55Y29sb3IoY29sb3IpLmxpZ2h0ZW4oMjApLnRvU3RyaW5nKCksXHJcblx0XHRcdFx0XHRjb2xvcl9pbnYgPSB0aGVtZVsnY29sb3ItaW52J10gfHwgZGVmYXVsdHNbJ2NvbG9yLWludiddLFxyXG5cdFx0XHRcdFx0Y29sb3JfaW52X2ZhZGUgPSB0aGVtZVsnY29sb3ItaW52LWZhZGUnXSB8fCB0aW55Y29sb3IoY29sb3JfaW52KS5kYXJrZW4oNDApLnRvU3RyaW5nKCksXHJcblxyXG5cdFx0XHRcdFx0YmdfYWx0ID0gdGhlbWVbJ2JnLWFsdCddIHx8IGJnX2RhcmtlcixcclxuXHRcdFx0XHRcdGNvbG9yX2FsdCA9IHRoZW1lWydjb2xvci1hbHQnXSB8fCB0aW55Y29sb3IubW9zdFJlYWRhYmxlKGJnX2FsdCwgW2NvbG9yLCBjb2xvcl9pbnZdKS50b0hleFN0cmluZygpLFxyXG5cdFx0XHRcdFx0Ym9yZGVyX2FsdCA9IHRoZW1lWydib3JkZXItYWx0J10gfHwgYm9yZGVyLFxyXG5cclxuXHRcdFx0XHRcdGJnX2ludiA9IHRoZW1lWydiZy1pbnYnXSB8fCB0aW55Y29sb3IoYmcpLnNwaW4oMTgwKS50b1N0cmluZygpLFxyXG5cdFx0XHRcdFx0Ym9yZGVyX2ludiA9IHRoZW1lWydib3JkZXItaW52J10gfHwgdGlueWNvbG9yKGJnKS5kYXJrZW4oMTApLnRvU3RyaW5nKCksXHJcblxyXG5cdFx0XHRcdFx0YmdfbGlnaHRfY29sb3IsIGJnX2xpZ2h0X2NvbG9yX2ZhZGUsXHJcblx0XHRcdFx0XHRiZ19kYXJrX2NvbG9yLCBiZ19kYXJrX2NvbG9yX2ZhZGU7XHJcblxyXG5cdFx0XHRcdC8vIFNldCBUZXh0IENvbG9ycyBBY2NvcmRpbmcgVG8gVGhlIEJhY2tncm91bmQgQ29sb3JcclxuXHJcblx0XHRcdFx0aWYgKCBiZ19kYXJrICkge1xyXG5cdFx0XHRcdFx0YmdfbGlnaHRfY29sb3IgPSBjb2xvcl9pbnY7XHJcblx0XHRcdFx0XHRiZ19saWdodF9jb2xvcl9mYWRlID0gY29sb3JfaW52X2ZhZGU7XHJcblxyXG5cdFx0XHRcdFx0YmdfZGFya19jb2xvciA9IGNvbG9yO1xyXG5cdFx0XHRcdFx0YmdfZGFya19jb2xvcl9mYWRlID0gY29sb3JfZmFkZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0YmdfbGlnaHRfY29sb3IgPSBjb2xvcjtcclxuXHRcdFx0XHRcdGJnX2xpZ2h0X2NvbG9yX2ZhZGUgPSBjb2xvcl9mYWRlO1xyXG5cclxuXHRcdFx0XHRcdGJnX2RhcmtfY29sb3IgPSBjb2xvcl9pbnY7XHJcblx0XHRcdFx0XHRiZ19kYXJrX2NvbG9yX2ZhZGUgPSBjb2xvcl9pbnZfZmFkZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIFNUQVJUIENTUyBSVUxFU1xyXG5cclxuXHRcdFx0XHQvLyBNYWluIEJhY2tncm91bmQgQ29sb3JcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRjc3MgPSB0aCsnIHsgYmFja2dyb3VuZC1jb2xvcjogJytiZysnOyB9JztcclxuXHJcblx0XHRcdFx0Ly8gSGVscGVyIENsYXNzZXNcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAudGhlbWUtYmcgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnKyc7IH0nO1xyXG5cclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAudGhlbWUtY29sb3IgeyBjb2xvcjogJytjb2xvcisnOyB9JztcclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAudGhlbWUtY29sb3ItZmFkZSB7IGNvbG9yOiAnK2NvbG9yX2ZhZGUrJzsgfSc7XHJcblx0XHRcdFx0Y3NzICs9IHRoKycgLnRoZW1lLWNvbG9yLWludiB7IGNvbG9yOiAnK2NvbG9yX2ludisnOyB9JztcclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAudGhlbWUtY29sb3ItaW52LWZhZGUgeyBjb2xvcjogJytjb2xvcl9pbnZfZmFkZSsnOyB9JztcclxuXHJcblx0XHRcdFx0Y3NzICs9IHRoKycgLnRoZW1lLWJnLWxpZ2h0LWNvbG9yIHsgY29sb3I6ICcrYmdfbGlnaHRfY29sb3IrJzsgfSc7XHJcblx0XHRcdFx0Y3NzICs9IHRoKycgLnRoZW1lLWJnLWxpZ2h0LWNvbG9yLWZhZGUgeyBjb2xvcjogJytiZ19saWdodF9jb2xvcl9mYWRlKyc7IH0nO1xyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC50aGVtZS1iZy1kYXJrLWNvbG9yIHsgY29sb3I6ICcrYmdfZGFya19jb2xvcisnOyB9JztcclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAudGhlbWUtYmctZGFyay1jb2xvci1mYWRlIHsgY29sb3I6ICcrYmdfZGFya19jb2xvcl9mYWRlKyc7IH0nO1xyXG5cclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAuYWNjZW50LWNvbG9yIHsgY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC5hY2NlbnQtYmcsICcrdGgrJyAudGhlbWUtc2VjdGlvbi1hY2NlbnQgeyBjb2xvcjogJytjb2xvcl9mb3JfYWNjZW50Kyc7IGJhY2tncm91bmQtY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xyXG5cclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAudGhlbWUtYmQgeyBib3JkZXItY29sb3I6ICcrYm9yZGVyKyc7IH0nO1xyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC50aGVtZS1hY2NlbnQtYmQgeyBib3JkZXItY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xyXG5cclxuXHRcdFx0XHQvLyBUaGVtZSBTZWN0aW9uIENvbG9yc1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC50aGVtZS1zZWN0aW9uLW1haW4geyBjb2xvcjogJytjb2xvcisnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnKyc7IGJvcmRlci1jb2xvcjogJytib3JkZXIrJzsgfSc7XHJcblx0XHRcdFx0Y3NzICs9IHRoKycgLnRoZW1lLXNlY3Rpb24tYWx0IHsgY29sb3I6ICcrY29sb3JfYWx0Kyc7IGJvcmRlci1jb2xvcjogJytib3JkZXJfYWx0Kyc7IGJhY2tncm91bmQtY29sb3I6ICcrYmdfYWx0Kyc7IH0nO1xyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC50aGVtZS1zZWN0aW9uLWFjY2VudCB7IGJvcmRlci1jb2xvcjogJythY2NlbnRfZGFya2VyKyc7IH0nO1xyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC50aGVtZS1zZWN0aW9uLWludiB7IGNvbG9yOiAnK2NvbG9yX2ludisnOyBib3JkZXItY29sb3I6ICcrYm9yZGVyX2ludisnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2ludisnOyB9JztcclxuXHJcblx0XHRcdFx0Ly8gVGV4dCBDb2xvcnNcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAjY29udGVudC13cmFwIHsgY29sb3I6ICcrY29sb3IrJzsgfSc7XHJcblx0XHRcdFx0Y3NzICs9IHRoKycgYSwgJyt0aCsnIC5wb3N0LW1ldGEgYTpob3ZlciwgJyt0aCsnICNicmVhZGNydW1icyBhOmhvdmVyLCAnK3RoKycgLnBhZ2VyIGE6aG92ZXIsICcrdGgrJyAucGFnZXIgbGkgPiBzcGFuLCAnK3RoKycgLmhvdmVyLWFjY2VudC1jb2xvcjpob3ZlciB7IGNvbG9yOiAnK2FjY2VudCsnOyB9JztcclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAucG9zdC1tZXRhIGEsICcrdGgrJyAucG9zdC1tZXRhID4gc3BhbiB7IGNvbG9yOiAnK2NvbG9yX2ZhZGUrJzsgfSc7XHJcblx0XHRcdFx0Y3NzICs9IHRoKycgLmhlYWQtbWVkaWEuYmctbGlnaHQgLmNvbnRhaW5lciwgJyt0aCsnIC5oZWFkLW1lZGlhLmJnLWxpZ2h0IC5tZWRpYS1pbm5lciA+IGEsICcrdGgrJyAuaGVhZC1tZWRpYS5iZy1saWdodCAuaGVhZGVyLXNjcm9sbCwgJyt0aCsnIC5oZWFkLW1lZGlhLmJnLWxpZ2h0ICNicmVhZGNydW1icyA+IGxpICsgbGk6YmVmb3JlIHsgY29sb3I6ICcrYmdfbGlnaHRfY29sb3IrJzsgfSc7XHJcblx0XHRcdFx0Y3NzICs9IHRoKycgLmhlYWQtbWVkaWEuYmctZGFyayAuY29udGFpbmVyLCAnK3RoKycgLmhlYWQtbWVkaWEuYmctZGFyayAubWVkaWEtaW5uZXIgPiBhLCAnK3RoKycgLmhlYWQtbWVkaWEuYmctZGFyayAuaGVhZGVyLXNjcm9sbCwgJyt0aCsnIC5oZWFkLW1lZGlhLmJnLWRhcmsgI2JyZWFkY3J1bWJzID4gbGkgKyBsaTpiZWZvcmUgeyBjb2xvcjogJytiZ19kYXJrX2NvbG9yKyc7IH0nO1xyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC5wb3N0LXJlbGF0ZWQgLnJlbGF0ZWQtdGl0bGUgeyBjb2xvcjogJytiZ19kYXJrX2NvbG9yKyc7IH0nO1xyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC5saW5rLWxpc3QgbGkgYSB7IGNvbG9yOiAnK2NvbG9yX2ZhZGUrJzsgfSc7XHJcblx0XHRcdFx0Y3NzICs9IHRoKycgLmxpbmstbGlzdCBsaSBhOmhvdmVyLCAnK3RoKycgLmxpbmstbGlzdCBsaSBhOmFjdGl2ZSwgJyt0aCsnIC5saW5rLWxpc3QgbGkuYWN0aXZlID4gYSB7IGNvbG9yOiAnK2FjY2VudCsnOyB9JztcclxuXHJcblx0XHRcdFx0Ly8gQm9yZGVyIENvbG9yc1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGNzcyArPSB0aCsnLCAnK3RoKycgI2NvbnRlbnQtd3JhcCwgJyt0aCsnIC5zaWRlYmFyIHVsLCAnK3RoKycgLndwLWNhcHRpb24sICcrdGgrJyBociB7IGJvcmRlci1jb2xvcjogJytib3JkZXIrJzsgfSc7XHJcblx0XHRcdFx0Y3NzICs9IHRoKycgLmNvbW1lbnQtbGlzdCBsaS5ieXBvc3RhdXRob3IgeyBib3JkZXItbGVmdC1jb2xvcjogJythY2NlbnQrJzsgfSc7XHJcblxyXG5cclxuXHRcdFx0XHQvLyBCYWNrZ3JvdW5kIENvbG9yc1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC5hY2NlbnQtYmc6aG92ZXIsICcrdGgrJyAuaG92ZXItYWNjZW50LWJnOmhvdmVyLCAnK3RoKycgLnRhZy1saXN0IGE6aG92ZXIsICcrdGgrJyAudGFnY2xvdWQgYTpob3ZlciB7IGNvbG9yOiAnK2NvbG9yX2Zvcl9hY2NlbnQrJyAhaW1wb3J0YW50OyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2FjY2VudCsnOyB9JztcclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAuYXJ0aWNsZSAucG9zdC1pbmZvIC5wb3N0LWRhdGUgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2RhcmtlcisnOyB9JztcclxuXHJcblx0XHRcdFx0Ly8gT3RoZXIgQ29sb3JzXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Y3NzICs9IHRoKycgOjpzZWxlY3Rpb24geyBvcGFjaXR5OiAwLjg7IGJhY2tncm91bmQ6ICcrYWNjZW50Kyc7IGNvbG9yOiAnK2NvbG9yX2Zvcl9hY2NlbnQrJzsgfSc7XHJcblxyXG5cdFx0XHRcdGNzcyArPSB0aCsnIGJsb2NrcXVvdGUgeyBib3JkZXItY29sb3I6ICcrYm9yZGVyKyc7IGJvcmRlci1sZWZ0LWNvbG9yOiAnK2FjY2VudCsnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2RhcmtlcisnOyB9JztcclxuXHRcdFx0XHRjc3MgKz0gdGgrJyBibG9ja3F1b3RlIGNpdGUgeyBjb2xvcjogJytjb2xvcl9mYWRlKyc7IH0nO1xyXG5cclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAuc2lkZWJhciAuY2hpbGQtcGFnZS1uYXYgbGkgYTpob3ZlciwgJyt0aCsnIC5zaWRlYmFyIC5uYXYgbGkgYTpob3ZlciB7IGNvbG9yOiAnK2FjY2VudCsnOyB9JztcclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAuc2lkZWJhciAuY2hpbGQtcGFnZS1uYXYgLmN1cnJlbnRfcGFnZV9pdGVtLCAnK3RoKycgLnNpZGViYXIgLmNoaWxkLXBhZ2UtbmF2IC5jdXJyZW50X3BhZ2VfaXRlbTpiZWZvcmUgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2RhcmtlcisnOyB9JztcclxuXHJcblx0XHRcdFx0Ly8gQm9vdHN0cmFwIEVsZW1lbnRzXHJcblxyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC5hbGVydC1kZWZhdWx0IHsgY29sb3I6ICcrY29sb3IrJzsgYm9yZGVyLWNvbG9yOiAnK2JvcmRlcisnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2RhcmtlcisnOyB9JztcclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAuYWxlcnQtZGVmYXVsdCBhIHsgY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC5wYW5lbCB7IGJvcmRlci1jb2xvcjogJytib3JkZXIrJzsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19saWdodGVyKyc7IH0nO1xyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC53ZWxsIHsgYm9yZGVyLWNvbG9yOiAnK2JvcmRlcisnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2RhcmtlcisnOyB9JztcclxuXHJcblx0XHRcdFx0Ly8gQmFja2dyb3VuZCBWYXJpYW50c1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC5iZy1saWdodCB7IGNvbG9yOiAnK2JnX2xpZ2h0X2NvbG9yKyc7IH0gJyt0aCsnIC5iZy1saWdodCAudGV4dC1mYWRlIHsgY29sb3I6ICcrYmdfbGlnaHRfY29sb3JfZmFkZSsnOyB9JztcclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAuYmctZGFyayB7IGNvbG9yOiAnK2JnX2RhcmtfY29sb3IrJzsgfSAnK3RoKycgLmJnLWRhcmsgLnRleHQtZmFkZSB7IGNvbG9yOiAnK2JnX2RhcmtfY29sb3JfZmFkZSsnOyB9JztcclxuXHJcblx0XHRcdFx0Ly8gSW5wdXRzXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Y3NzICs9IHRoKycgaW5wdXQ6bm90KFt0eXBlPXN1Ym1pdF0pOm5vdChbdHlwZT1idXR0b25dKTpub3QoLmJ0biksICcrdGgrJyBzZWxlY3QsICcrdGgrJyB0ZXh0YXJlYSwgJyt0aCsnIC5mb3JtLWNvbnRyb2wsICcgK1xyXG5cdFx0XHRcdFx0ICAgdGgrJyAucG9zdC1wYXNzd29yZC1mb3JtIGlucHV0W3R5cGU9XCJwYXNzd29yZFwiXSwgJyt0aCsnIC53b29jb21tZXJjZSAuaW5wdXQtdGV4dCB7IGNvbG9yOiAnK2NvbG9yKyc7IGJvcmRlci1jb2xvcjogJytib3JkZXIrJzsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19kYXJrZXIrJzsgfSc7XHJcblx0XHRcdFx0Y3NzICs9IHRoKycgaW5wdXQ6bm90KFt0eXBlPXN1Ym1pdF0pOm5vdChbdHlwZT1idXR0b25dKTpub3QoLmJ0bik6Zm9jdXMsICcrdGgrJyBzZWxlY3Q6Zm9jdXMsICcrdGgrJyB0ZXh0YXJlYTpmb2N1cywgJyt0aCsnIC5mb3JtLWNvbnRyb2w6Zm9jdXMsICcgK1xyXG5cdFx0XHRcdFx0ICAgdGgrJyAucG9zdC1wYXNzd29yZC1mb3JtIGlucHV0W3R5cGU9XCJwYXNzd29yZFwiXTpmb2N1cywgJyt0aCsnIC53b29jb21tZXJjZSAuaW5wdXQtdGV4dDpmb2N1cyB7IGJvcmRlci1jb2xvcjogJyt0aW55Y29sb3IoYm9yZGVyKS5saWdodGVuKDIpLnRvU3RyaW5nKCkrJzsgYmFja2dyb3VuZC1jb2xvcjogJyt0aW55Y29sb3IoYmcpLmxpZ2h0ZW4oMikudG9TdHJpbmcoKSsnOyB9JztcclxuXHRcdFx0XHRjc3MgKz0gdGgrJyBpbnB1dDo6LXdlYmtpdC1pbnB1dC1wbGFjZWhvbGRlciwgJyt0aCsnIC5mb3JtLWNvbnRyb2w6Oi13ZWJraXQtaW5wdXQtcGxhY2Vob2xkZXIgeyBjb2xvcjogJytjb2xvcl9mYWRlKyc7IH0nO1xyXG5cdFx0XHRcdGNzcyArPSB0aCsnIGlucHV0OjotbW96LXBsYWNlaG9sZGVyLCAnK3RoKycgLmZvcm0tY29udHJvbDo6LW1vei1wbGFjZWhvbGRlciB7IGNvbG9yOiAnK2NvbG9yX2ZhZGUrJzsgfSc7XHJcblx0XHRcdFx0Y3NzICs9IHRoKycgaW5wdXQ6LW1zLWlucHV0LXBsYWNlaG9sZGVyLCAnK3RoKycgLmZvcm0tY29udHJvbDotbXMtaW5wdXQtcGxhY2Vob2xkZXIgeyBjb2xvcjogJytjb2xvcl9mYWRlKyc7IH0nO1xyXG5cdFx0XHRcdGlmICggYmdfZGFyayApIHtcclxuXHRcdFx0XHRcdGNzcyArPSB0aCsnIHNlbGVjdCwgLm1peHQgJyt0aCsnIC5zZWxlY3QyLWNvbnRhaW5lciAuc2VsZWN0Mi1hcnJvdyBiOmFmdGVyIHsgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiJyttaXh0X2N1c3RvbWl6ZVsnbWl4dC11cmknXSsnL2Fzc2V0cy9pbWcvaWNvbnMvc2VsZWN0LWFycm93LWxpZ2h0LnBuZ1wiKTsgfSc7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBCdXR0b25zXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Y3NzICs9IGJ1dHRvbl9jb2xvcihbJ3ByaW1hcnknLCAnYWNjZW50J10sIGFjY2VudCwgdGgpO1xyXG5cdFx0XHRcdGNzcyArPSBidXR0b25fY29sb3IoJ21pbmltYWwnLCBiZ19kYXJrZXIsIHRoKTtcclxuXHJcblx0XHRcdFx0Ly8gRWxlbWVudCBDb2xvcnNcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAubWl4dC1zdGF0LnR5cGUtYm94LCAnK3RoKycgLm1peHQtaGVhZGxpbmUgc3Bhbi5jb2xvci1hdXRvOmFmdGVyLCAnK3RoKycgLm1peHQtdGltZWxpbmUgLnRpbWVsaW5lLWJsb2NrOmJlZm9yZSB7IGJvcmRlci1jb2xvcjogJytib3JkZXIrJzsgfSc7XHJcblx0XHRcdFx0Y3NzICs9IHRoKycgLm1peHQtcm93LXNlcGFyYXRvci5uby1maWxsIHN2ZyB7IGZpbGw6ICcrYmcrJzsgfSc7XHJcblx0XHRcdFx0Y3NzICs9IHRoKycgLm1peHQtbWFwIHsgY29sb3I6ICcrYmdfbGlnaHRfY29sb3IrJzsgfSc7XHJcblx0XHRcdFx0Y3NzICs9IHRoKycgLm1peHQtZmxpcGNhcmQgPiAuaW5uZXIgPiAuYWNjZW50IHsgY29sb3I6ICcrY29sb3JfZm9yX2FjY2VudCsnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2FjY2VudCsnOyBib3JkZXItY29sb3I6ICcrYWNjZW50X2RhcmtlcisnOyB9JztcclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAubWl4dC1wcmljaW5nLmFjY2VudCAubWl4dC1wcmljaW5nLWlubmVyIC5oZWFkZXIgeyBjb2xvcjogJytjb2xvcl9mb3JfYWNjZW50Kyc7IGJhY2tncm91bmQtY29sb3I6ICcrYWNjZW50Kyc7IGJveC1zaGFkb3c6IDAgMCAwIDFweCAnK2FjY2VudF9kYXJrZXIrJzsgdGV4dC1zaGFkb3c6IDAgMXB4IDFweCAnK3RleHRzaF9mb3JfYWNjZW50Kyc7IH0nO1xyXG5cdFx0XHRcdC8vIEFjY2VudCBDb2xvciBWYXJpYW50c1xyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC5taXh0LWljb24gaS5hY2NlbnQsICcrdGgrJyAubWl4dC1zdGF0LmNvbG9yLW91dGxpbmUuYWNjZW50IHsgY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xyXG5cdFx0XHRcdC8vIEFjY2VudCBCb3JkZXIgVmFyaWFudHNcclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAubWl4dC1pY29uLmljb24tb3V0bGluZS5hY2NlbnQsICcgK1xyXG5cdFx0XHRcdFx0ICAgdGgrJyAubWl4dC1zdGF0LmNvbG9yLW91dGxpbmUuYWNjZW50LCAnICtcclxuXHRcdFx0XHRcdCAgIHRoKycgLm1peHQtaWNvbmJveCAuaW5uZXIuYm9yZGVyZWQuYWNjZW50LCAnICtcclxuXHRcdFx0XHRcdCAgIHRoKycgLm1peHQtaW1hZ2UgLmltYWdlLXdyYXAuYWNjZW50IHsgYm9yZGVyLWNvbG9yOiAnK2FjY2VudCsnOyB9JztcclxuXHRcdFx0XHQvLyBBY2NlbnQgQmcgVmFyaWFudHNcclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAubWl4dC1zdGF0LmNvbG9yLWJnLmFjY2VudCwgJyArXHJcblx0XHRcdFx0XHQgICB0aCsnIC5taXh0LWljb24uaWNvbi1zb2xpZC5hY2NlbnQsICcgK1xyXG5cdFx0XHRcdFx0ICAgdGgrJyAubWl4dC1pY29uYm94IC5pbm5lci5zb2xpZC5hY2NlbnQsICcgK1xyXG5cdFx0XHRcdFx0ICAgdGgrJyAubWl4dC1yZXZpZXcuYm94ZWQuYWNjZW50LCAnICtcclxuXHRcdFx0XHRcdCAgIHRoKycgLm1peHQtcmV2aWV3LmJ1YmJsZSAucmV2aWV3LWNvbnRlbnQuYWNjZW50LCAnICtcclxuXHRcdFx0XHRcdCAgIHRoKycgLm1peHQtcmV2aWV3LmJ1YmJsZSAucmV2aWV3LWNvbnRlbnQuYWNjZW50OmJlZm9yZSwgJyArXHJcblx0XHRcdFx0XHQgICB0aCsnIC5taXh0LXRpbWVsaW5lIC50aW1lbGluZS1ibG9jayAuY29udGVudC5ib3hlZC5hY2NlbnQsICcgK1xyXG5cdFx0XHRcdFx0ICAgdGgrJyAubWl4dC10aW1lbGluZSAudGltZWxpbmUtYmxvY2sgLmNvbnRlbnQuYnViYmxlLmFjY2VudCwgJyArXHJcblx0XHRcdFx0XHQgICB0aCsnIC5taXh0LXRpbWVsaW5lIC50aW1lbGluZS1ibG9jayAuY29udGVudC5idWJibGUuYWNjZW50OmJlZm9yZSwgJyArXHJcblx0XHRcdFx0XHQgICB0aCsnIC5ob3Zlci1jb250ZW50IC5vbi1ob3Zlci5hY2NlbnQgeyBjb2xvcjogJytjb2xvcl9mb3JfYWNjZW50Kyc7IGJvcmRlci1jb2xvcjogJythY2NlbnRfZGFya2VyKyc7IGJhY2tncm91bmQtY29sb3I6ICcrYWNjZW50Kyc7IHRleHQtc2hhZG93OiAwIDFweCAxcHggJyt0ZXh0c2hfZm9yX2FjY2VudCsnOyB9JztcclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAubWl4dC1pY29uLmljb24tc29saWQuYWNjZW50LmFuaW0taW52ZXJ0OmhvdmVyLCAnK3RoKycgLmljb24tY29udDpob3ZlciAubWl4dC1pY29uLmljb24tc29saWQuYWNjZW50LmFuaW0taW52ZXJ0IHsgY29sb3I6ICcrYWNjZW50Kyc7IGJvcmRlci1jb2xvcjogJythY2NlbnRfZGFya2VyKyc7IGJhY2tncm91bmQtY29sb3I6ICcrY29sb3JfZm9yX2FjY2VudCsnOyB0ZXh0LXNoYWRvdzogMCAxcHggMXB4ICcrc2V0X3RleHRzaF9mb3JfYmcoY29sb3JfZm9yX2FjY2VudCkrJzsgfSc7XHJcblx0XHRcdFx0Y3NzICs9IHRoKycgLmhvdmVyLWNvbnRlbnQgLm9uLWhvdmVyLmFjY2VudCB7IGJhY2tncm91bmQtY29sb3I6ICcrdGlueWNvbG9yKGFjY2VudCkuc2V0QWxwaGEoMC43NSkudG9QZXJjZW50YWdlUmdiU3RyaW5nKCkrJzsgfSc7XHJcblxyXG5cdFx0XHRcdC8vIFBsdWdpbiBDb2xvcnNcclxuXHJcblx0XHRcdFx0Ly8gTGlnaHRTbGlkZXJcclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAubFNTbGlkZU91dGVyIC5sU1BhZ2VyLmxTcGcgPiBsaTpob3ZlciBhLCAnK3RoKycgLmxTU2xpZGVPdXRlciAubFNQYWdlci5sU3BnID4gbGkuYWN0aXZlIGEgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2FjY2VudCsnOyB9JztcclxuXHJcblx0XHRcdFx0Ly8gTGlnaHRHYWxsZXJ5XHJcblx0XHRcdFx0Y3NzICs9IHRoKycgLmxnLW91dGVyIC5sZy10aHVtYi1pdGVtLmFjdGl2ZSwgJyt0aCsnIC5sZy1vdXRlciAubGctdGh1bWItaXRlbTpob3ZlciB7IGJvcmRlci1jb2xvcjogJythY2NlbnQrJzsgfSc7XHJcblx0XHRcdFx0Y3NzICs9IHRoKycgLmxnLXByb2dyZXNzLWJhciAubGctcHJvZ3Jlc3MgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2FjY2VudCsnOyB9JztcclxuXHJcblx0XHRcdFx0Ly8gU2VsZWN0MlxyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC5zZWxlY3QyLWNvbnRhaW5lciBhLnNlbGVjdDItY2hvaWNlLCAnK3RoKycgLnNlbGVjdDItZHJvcCwgJyt0aCsnIC5zZWxlY3QyLWRyb3Auc2VsZWN0Mi1kcm9wLWFjdGl2ZSB7IGNvbG9yOiAnK2NvbG9yKyc7IGJvcmRlci1jb2xvcjogJytib3JkZXIrJzsgYmFja2dyb3VuZC1jb2xvcjogJytiZ19kYXJrZXIrJzsgfSc7XHJcblx0XHRcdFx0Y3NzICs9IHRoKycgLnNlbGVjdDItcmVzdWx0cyB7IGJhY2tncm91bmQtY29sb3I6ICcrYmdfZGFya2VyKyc7IH0nO1xyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC5zZWxlY3QyLXJlc3VsdHMgLnNlbGVjdDItaGlnaGxpZ2h0ZWQgeyBjb2xvcjogJytjb2xvcisnOyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2JnX2xpZ2h0ZXIrJzsgfSc7XHJcblxyXG5cdFx0XHRcdC8vIFZpc3VhbCBDb21wb3NlclxyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC53cGJfY29udGVudF9lbGVtZW50IC53cGJfdG91cl90YWJzX3dyYXBwZXIgLndwYl90YWJzX25hdiBhOmhvdmVyLCAnK3RoKycgLndwYl9jb250ZW50X2VsZW1lbnQgLndwYl9hY2NvcmRpb25faGVhZGVyIGE6aG92ZXIgeyBjb2xvcjogJythY2NlbnQrJzsgfSc7XHJcblx0XHRcdFx0Y3NzICs9IHRoKycgLnZjX3NlcGFyYXRvci50aGVtZS1iZCAudmNfc2VwX2hvbGRlciAudmNfc2VwX2xpbmUgeyBib3JkZXItY29sb3I6ICcrYm9yZGVyKyc7IH0nO1xyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC5taXh0LWdyaWQtaXRlbSAuZ2l0ZW0tdGl0bGUtY29udCB7IGNvbG9yOiAnK2NvbG9yKyc7IGJhY2tncm91bmQtY29sb3I6ICcrYmdfbGlnaHRlcisnOyB9JztcclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAudmNfdHRhLnZjX3R0YS1zdHlsZS1jbGFzc2ljOm5vdCgudmNfdHRhLW8tbm8tZmlsbCkgLnZjX3R0YS1wYW5lbC1ib2R5LCAnK3RoKycgLnZjX3R0YS52Y190dGEtc3R5bGUtbW9kZXJuOm5vdCgudmNfdHRhLW8tbm8tZmlsbCkgLnZjX3R0YS1wYW5lbC1ib2R5IHsgY29sb3I6ICcrYmdfbGlnaHRfY29sb3IrJzsgfSc7XHJcblxyXG5cdFx0XHRcdC8vIFdvb0NvbW1lcmNlXHJcblx0XHRcdFx0Y3NzICs9IHRoKycgLndvb2NvbW1lcmNlIC5wcmljZSAuYW1vdW50LCAnK3RoKycgLndvb2NvbW1lcmNlIC50b3RhbCAuYW1vdW50LCAnK3RoKycgLndvb2NvbW1lcmNlIC53b28tY2FydCAuYW1vdW50LCAnK3RoKycgLndvb2NvbW1lcmNlIC5uYXYgbGkgLmFtb3VudCB7IGNvbG9yOiAnK2FjY2VudCsnOyB9JztcclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAud29vY29tbWVyY2UgLm5hdiBsaSBkZWwgLmFtb3VudCwgJyt0aCsnIC53b29jb21tZXJjZSAjcmV2aWV3cyAjY29tbWVudHMgb2wuY29tbWVudGxpc3QgbGkgLm1ldGEgeyBjb2xvcjogJytjb2xvcl9mYWRlKyc7IH0nO1xyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC53b29jb21tZXJjZSAud2lkZ2V0X3ByaWNlX2ZpbHRlciAudWktc2xpZGVyIC51aS1zbGlkZXItcmFuZ2UgeyBiYWNrZ3JvdW5kLWNvbG9yOiAnK2FjY2VudCsnOyB9JztcclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAud29vY29tbWVyY2UgLmJhZGdlLWNvbnQgLmJhZGdlLnNhbGUtYmFkZ2UgeyBjb2xvcjogJytjb2xvcl9mb3JfYWNjZW50Kyc7IGJhY2tncm91bmQtY29sb3I6ICcrYWNjZW50Kyc7IH0nO1xyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC53b29jb21tZXJjZSAud29vY29tbWVyY2UtdGFicyB1bC50YWJzIGxpIGEgeyBjb2xvcjogJytjb2xvcl9mYWRlKycgIWltcG9ydGFudDsgfSc7XHJcblx0XHRcdFx0Y3NzICs9IHRoKycgLndvb2NvbW1lcmNlIC53b29jb21tZXJjZS10YWJzIHVsLnRhYnMgbGkuYWN0aXZlIHsgYm9yZGVyLWJvdHRvbS1jb2xvcjogJytiZysnICFpbXBvcnRhbnQ7IH0nO1xyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC53b29jb21tZXJjZSAud29vY29tbWVyY2UtdGFicyB1bC50YWJzIGxpLmFjdGl2ZSBhIHsgY29sb3I6ICcrY29sb3IrJyAhaW1wb3J0YW50OyB9JztcclxuXHRcdFx0XHRjc3MgKz0gdGgrJyAud29vY29tbWVyY2UgLndvb2NvbW1lcmNlLXRhYnMgdWwudGFicyBsaS5hY3RpdmUsICcrdGgrJyAud29vY29tbWVyY2UgLndvb2NvbW1lcmNlLXRhYnMgLndjLXRhYiB7IGNvbG9yOiAnK2NvbG9yKycgIWltcG9ydGFudDsgYmFja2dyb3VuZC1jb2xvcjogJytiZysnICFpbXBvcnRhbnQ7IH0nO1xyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC53b29jb21tZXJjZSB0YWJsZS5zaG9wX3RhYmxlLCAnK3RoKycgLndvb2NvbW1lcmNlIHRhYmxlLnNob3BfdGFibGUgdGgsICcrdGgrJyAud29vY29tbWVyY2UgdGFibGUuc2hvcF90YWJsZSB0ZCwgJyArXHJcblx0XHRcdFx0XHQgICB0aCsnIC53b29jb21tZXJjZSAuY2FydC1jb2xsYXRlcmFscyAuY2FydF90b3RhbHMgdHIgdGQsICcrdGgrJyAud29vY29tbWVyY2UgLmNhcnQtY29sbGF0ZXJhbHMgLmNhcnRfdG90YWxzIHRyIHRoIHsgYm9yZGVyLWNvbG9yOiAnK2JvcmRlcisnICFpbXBvcnRhbnQ7IH0nO1xyXG5cdFx0XHRcdGNzcyArPSB0aCsnIC53b29jb21tZXJjZS1jaGVja291dCAjcGF5bWVudCwgJyArXHJcblx0XHRcdFx0XHQgICB0aCsnIC53b29jb21tZXJjZSBmb3JtIC5mb3JtLXJvdy53b29jb21tZXJjZS12YWxpZGF0ZWQgLnNlbGVjdDItY2hvaWNlLCAnK3RoKycgLndvb2NvbW1lcmNlIGZvcm0gLmZvcm0tcm93Lndvb2NvbW1lcmNlLXZhbGlkYXRlZCBpbnB1dC5pbnB1dC10ZXh0LCAnK3RoKycgLndvb2NvbW1lcmNlIGZvcm0gLmZvcm0tcm93Lndvb2NvbW1lcmNlLXZhbGlkYXRlZCBzZWxlY3QsICcgK1xyXG5cdFx0XHRcdFx0ICAgdGgrJyAud29vY29tbWVyY2UgZm9ybSAuZm9ybS1yb3cud29vY29tbWVyY2UtaW52YWxpZCAuc2VsZWN0Mi1jaG9pY2UsICcrdGgrJyAud29vY29tbWVyY2UgZm9ybSAuZm9ybS1yb3cud29vY29tbWVyY2UtaW52YWxpZCBpbnB1dC5pbnB1dC10ZXh0LCAnK3RoKycgLndvb2NvbW1lcmNlIGZvcm0gLmZvcm0tcm93Lndvb2NvbW1lcmNlLWludmFsaWQgc2VsZWN0IHsgYm9yZGVyLWNvbG9yOiAnK2JvcmRlcisnOyB9JztcclxuXHJcblx0XHRcdFx0TUlYVC5zdHlsZXNoZWV0KCdzaXRlLXRoZW1lLScraWQsIGNzcyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHR3cC5jdXN0b21pemUoJ21peHRfb3B0W3NpdGUtdGhlbWVzXScsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZS5iaW5kKCBmdW5jdGlvbih0bykge1xyXG5cdFx0XHR1cGRhdGVTaXRlVGhlbWVzKHRvKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHQvLyBHZW5lcmF0ZSBjdXN0b20gdGhlbWVzIGlmIHRoZW1lIGlzIGNoYW5nZWQgZnJvbSBvbmUgb2YgdGhlIGRlZmF1bHRzXHJcblx0ZnVuY3Rpb24gbWF5YmVVcGRhdGVTaXRlVGhlbWVzKGlkKSB7XHJcblx0XHRpZiAoIGlkID09ICdhdXRvJyApIGlkID0gdGhlbWVzLnNpdGU7XHJcblx0XHRpZiAoICEgXy5oYXMobWl4dF9jdXN0b21pemUudGhlbWVzLCBpZCkgKSB7XHJcblx0XHRcdHZhciBzaXRlVGhlbWVzID0gd3AuY3VzdG9taXplKCdtaXh0X29wdFtzaXRlLXRoZW1lc10nKS5nZXQoKTtcclxuXHRcdFx0dXBkYXRlU2l0ZVRoZW1lcyhzaXRlVGhlbWVzKTtcclxuXHRcdH1cclxuXHR9XHJcblx0JCgnI21haW4td3JhcC1pbm5lcicpLm9uKCd0aGVtZS1jaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgdGhlbWUpIHtcclxuXHRcdG1heWJlVXBkYXRlU2l0ZVRoZW1lcyh0aGVtZSk7XHJcblx0fSk7XHJcblx0JCgnI2NvbG9waG9uJykub24oJ3RoZW1lLWNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50LCB0aGVtZSkge1xyXG5cdFx0bWF5YmVVcGRhdGVTaXRlVGhlbWVzKHRoZW1lKTtcclxuXHR9KTtcclxuXHJcbn0pKGpRdWVyeSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9