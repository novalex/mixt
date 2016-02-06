
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