
/* ------------------------------------------------ /
MIXT GLOBAL JS FUNCTIONS
/ ------------------------------------------------ */

(function ($) {

	'use strict';

	/* global mixt_opt */

	var viewport = $(window),
		htmlEl   = $('html'),
		bodyEl   = $('body'),
		content  = $('#content');


	// Fix WPML Dropdown
	$('.menu-item-language').addClass('dropdown drop-menu').find('.sub-menu').addClass('dropdown-menu');

	// Fix PolyLang Menu Items And Make Them Dropdown
	$('.menu-item.lang-item').removeClass('disabled');

	function plLangDrop() {
		var item = $('.lang-item.current-lang');
		if (item.length === 0) {
			item = $('.lang-item').first();
		}
		var langs = item.siblings('.lang-item');
		item.addClass('dropdown drop-menu');
		langs.wrapAll('<ul class="sub-menu dropdown-menu"></ul>').parent().appendTo(item);
	}
	plLangDrop();


	// RUN ON LOAD

	viewport.load( function() {

		// Hide loading animation
		bodyEl.removeClass('loading');
		$('#load-overlay .loader').fadeOut(300);

		// Remove focus outlines if mouse is used, enable if Tab is pressed
		bodyEl.on('mousedown', function() {
			bodyEl.addClass('no-outline');
		});
		bodyEl.on('keyup', function(event) {
			var code = event.keyCode || event.which;
			if ( code == '9' ) {
				bodyEl.removeClass('no-outline');
			}
		});

		// Set Content Min Height
		// var contentMinH = viewport.height() - content.offset().top - $('#colophon').outerHeight(true);
		// content.css('min-height', contentMinH);

		// Sort portfolio items
		$('.portfolio-sorter button').click( function(event) {
			event.preventDefault();
			var elem = $(this),
				targetTag = elem.data('sort'),
				targetContainer = $('.grid-container');

			elem.addClass('active').siblings('button').removeClass('active');

			targetContainer.isotope({
				itemSelector: 'article',
				layout: 'masonry'
			});

			if (targetTag == 'all') {
				targetContainer.isotope({ filter: '*' });
			} else {
				targetContainer.isotope({ filter: '.' + targetTag });
			}
		});

		// Social Icons
		$('.social-links').not('.hover-none').each( function() {
			var cont = $(this);

			cont.children().each( function() {
				var icon = $(this),
					link = icon.children('a'),
					dataColor = link.attr('data-color'),
					hoverColor,
					hoverBgColor;

				if ( cont.hasClass('hover-icon') ) {
					hoverColor = dataColor;
					hoverBgColor = '';

					link.hover( function() {
						if ( cont.parents('.navbar.position-top').length === 0 ) {
							link.css({ color: hoverColor, backgroundColor: hoverBgColor, zIndex: 1 });
						}
					}, function() {
						link.css({ color: '', backgroundColor: '', zIndex: '' });
					});
				} else {
					hoverColor = '#fff';
					hoverBgColor = dataColor;

					link.hover( function() {
						if ( cont.parents('.position-top').length === 0 && cont.parents('.no-hover-bg').length === 0 ) {
							link.css({ color: hoverColor, backgroundColor: hoverBgColor, boxShadow: '0 0 0 1px ' + hoverBgColor, zIndex: 1 });
						}
					}, function() {
						link.css({ color: '', backgroundColor: '', boxShadow: '', zIndex: '' });
					});
				}
			});
		});


		// Tooltips Init
		$('[data-toggle="tooltip"], .related-title-tip').tooltip({
			placement: 'auto',
			container: 'body'
		});


		// Animations Init
		var animHoverEl = $('.anim-on-hover');
		animHoverEl.hoverIntent( function() {
			$(this).addClass('hovered');
			var inner   = $(this).children('.on-hover'),
				animIn  = inner.data('anim-in') || 'fadeIn',
				animOut = inner.data('anim-out') || 'fadeOut';
			inner.removeClass(animOut).addClass('animated ' + animIn);
		}, function() {
			$(this).removeClass('hovered');
			var inner   = $(this).children('.on-hover'),
				animIn  = inner.data('anim-in') || 'fadeIn',
				animOut = inner.data('anim-out') || 'fadeOut';
			inner.removeClass(animIn).addClass(animOut);
		}, 300);
		animHoverEl.on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function() {
			if ( ! $(this).hasClass('hovered') ) {
				$(this).children('.on-hover').removeClass('animated');
			}
		});


		// Image Carousels
		if ( typeof $.fn.lightSlider === 'function' ) {
			var carousels = $('.carousel-slider').not('.lightSlider');
			carousels.each( function() {
				var slider = $(this),
					vertical = ( slider.data('direction') == 'vertical' ) ? true : false;

				slider.imagesLoaded( function() {
					slider.lightSlider({
						item: ( slider.data('items') > 1 ) ? slider.data('items') : 1,
						auto: ( slider.data('auto') === true ) ? true : false,
						loop: ( slider.data('loop') === true ) ? true : false,
						pause: ( slider.data('interval') > 0 ) ? slider.data('interval') : 5000,
						vertical: vertical,
						pager: ( slider.data('pagination') === true ) ? true : false,
						controls: ( slider.data('navigation') === true ) ? true : false,
						keyPress: true,
						slideMargin: 15,
						responsive : [{
							breakpoint: 768,
							settings: { item: ( slider.data('items-tablet') > 1 ) ? slider.data('items-tablet') : 1 }
						}, {
							breakpoint:480,
							settings: { item: ( slider.data('items-mobile') > 1 ) ? slider.data('items-mobile') : 1 }
						}],
						onSliderLoad: function(el) {
							var slides = slider.children('.lslide');
							if ( slider.data('lightbox') === true && typeof $.fn.lightGallery === 'function' ) {
								el.lightGallery({ selector: slides });
							}
							if ( typeof $.fn.matchHeight === 'function' && ! vertical ) {
								slides.matchHeight();
								slider.css('height', '');
							}
						}
					});
				});
			});
		}

	});

	// Functions To Run On Window Resize
	function resizeFn() {
		if ( typeof $.fn.matchHeight === 'function' ) {
			var mhElements = $('.cols-match-height .wpb_column');
			mhElements.matchHeight();
		}
	}
	viewport.resize( $.debounce( 500, resizeFn )).resize();

	// Offset scrolling to link anchor (hash)
	function hashAnimate() {
		var hash = window.location.hash;

		if ( hash.length ) {
			var hashOffset = $(hash).offset().top;
			if ( mixt_opt.nav.mode == 'fixed' ) { hashOffset -= $('#top-nav').height(); }
			htmlEl.add(bodyEl).animate({ scrollTop: hashOffset }, 100);
		}
		return false;
	}
	viewport.on('hashchange', function() {
		hashAnimate();
	});

}(jQuery));
