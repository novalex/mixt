
/* ------------------------------------------------ /
MIXT GLOBAL FUNCTIONS
/ ------------------------------------------------ */

(function ($) {

	'use strict';

	/* global mixt_opt */

	var viewport = $(window),
		bodyEl   = $('body');

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

		// Add loading animation on page unload

		if ( $('#load-overlay').length ) {
			viewport.unload( function() {
				bodyEl.addClass('loading-out');
				$('#load-overlay .loader').fadeIn(300);
				setTimeout( function() {
					bodyEl.addClass('loading');
				}, 300);
			});
		}

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

		$('.social-links').each( function() {
			var cont = $(this);

			if ( ! cont.hasClass('hover-none') ) {
				cont.children('li').each( function() {
					var icon = $(this),
						link = icon.children('a'),
						dataColor = link.attr('data-color'),
						hoverColor,
						hoverBgColor;

					if ( cont.hasClass('hover-icon') ) {
						hoverColor = dataColor;
						hoverBgColor = '';

						link.hover( function() {
							if ( cont.parents('.position-top').length === 0 ) {
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
			}
		});

		// Featured Gallery Slider
		if ( typeof $.fn.lightSlider === 'function' ) {
			var gallerySlider = $('.gallery-slider');

			gallerySlider.lightSlider({
				item: 1,
				auto: true,
				loop: true,
				pager: false,
				pause: 5000,
				keyPress: true,
				slideMargin: 0,
			});
		}

	});

	// Isotope Masonry Init

	if ( mixt_opt['blog-type'] == 'masonry' ) {
		var blogCont = $('.blog-masonry .blog-container');

		blogCont.isotope({
			itemSelector: '.hentry',
			layout: 'masonry'
		});

		blogCont.imagesLoaded( function() {
			blogCont.isotope('layout');
		});
	}

	// lightSlider Instances

	var postGallerySlider = $('.gallery-slider');

	// Equalize Related Posts Height For Featured Media
	if ( typeof $.fn.matchHeight === 'function' ) {
		$('.post-related .post-feat').matchHeight();
	}

	// Resize Embedded Videos Proportionally

	function iframeAspect() {
		var iframes = $('.post iframe');

		iframes.each( function() {
			var width = $(this).width();
			if ( typeof($(this).data('ratio')) == 'undefined' ) {
				var attrW = this.width,
					attrH = this.height;
				$(this).data('ratio', attrH / attrW ).removeAttr('width').removeAttr('height');
			}
			$(this).height( width * $(this).data('ratio') );
		});
	}
	iframeAspect();

	// Functions to run on window resize

	function resizeFn() {
		iframeAspect();

		postGallerySlider.css('height', '');
	}

	viewport.resize( $.debounce( 500, resizeFn ));

	// $(document).ready( function() {
	// 	// Init Stellar Parallax

	// 	$('.parallax').stellar({
	// 		responsive: true
	// 	});
	// });

}(jQuery));