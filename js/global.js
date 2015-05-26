
/* ------------------------------------------------ /
MIXT GLOBAL JS FUNCTIONS
/ ------------------------------------------------ */

(function ($) {

	'use strict';

	/* global mixt_opt */

	var viewport = $(window),
		bodyEl   = $('body');


	// Functions To Run On Blog & Post Pages

	function postsPage() {

		// Featured gallery slider
		if ( typeof $.fn.lightSlider === 'function' ) {
			var gallerySlider = $('.gallery-slider').not('.lightSlider');

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

		// Equalize featured media height for related posts and grid blog
		if ( typeof $.fn.matchHeight === 'function' ) {
			$('.blog-grid .post-feat, .post-related .post-feat').matchHeight();
		}
	}


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

		// Tooltips Init

		$('.social-links [data-toggle="tooltip"]').tooltip({
			placement: 'auto',
			container: 'body'
		});


		// Isotope Masonry Init

		if ( mixt_opt['layout-type'] == 'masonry' ) {
			var blogCont = $('.blog-masonry .posts-container');

			blogCont.isotope({
				itemSelector: '.article',
				layout: 'masonry',
				gutter: 0
			});

			blogCont.imagesLoaded( function() { blogCont.isotope('layout'); });
			viewport.resize( $.debounce( 500, function() { blogCont.isotope('layout'); } ));
		}

		postsPage();

		// Related Posts Slider
		if ( typeof $.fn.lightSlider === 'function' ) {
			var relPostsSlider = $('.post-related .slider-cont');
			relPostsSlider.imagesLoaded( function() {
				relPostsSlider.lightSlider({
					item: 3,
					pager: false,
					keyPress: true,
					slideMargin: 20,
				});

				if ( typeof $.fn.matchHeight === 'function' ) {
					$('.post-feat', relPostsSlider).matchHeight();
					relPostsSlider.css('height', '');
				}
			});
		}
	});

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


	// AJAX POST LOADING

	if ( mixt_opt['pagination-type'] != 'classic' ) {
		var pageNum = parseInt(mixt_opt['page-num']) + 1,
			pageMax = parseInt(mixt_opt['page-max']),
			nextLink = mixt_opt['next-page-link'],

			container = $('.posts-container'),
			pagCont   = $('.paging-navigation'),
			ajaxBtn   = $('.ajax-more', pagCont);

		// Trigger AJAX load upon reaching bottom of page
		var ajaxScrollHandle = $.debounce( 500, function() {
				/* global elemVisible */
				if ( elemVisible(ajaxBtn, viewport) === true ) {
					ajaxBtn.trigger('cont:bottom');
				}
			});
		if ( mixt_opt['pagination-type'] == 'ajax-scroll' && ajaxBtn.length ) {
			viewport.on('scroll', ajaxScrollHandle);
		}
		
		ajaxBtn.on('click cont:bottom', function() {
			/* jshint unused: false */

			var $button = $(this);

			// Prevent loading twice on scroll
			viewport.off('scroll', ajaxScrollHandle);
		
			// Are there more pages to load?
			if ( pageNum <= pageMax ) {
			
				$button.button('loading');

				// Load posts
				$('<div>').load(nextLink + ' .posts-container .article', function(response, status, xhr) {
					var newPosts = $(this);

					$button.blur();

					newPosts.children('.article').addClass('ajax-new');
					if ( mixt_opt['layout-type'] != 'masonry' && mixt_opt['show-page-nr'] == 'true' ) {
						newPosts.prepend('<div class="ajax-page page-'+ pageNum +'"><a href="'+ nextLink +'">Page '+ pageNum +'</a></div>');
					}
					container.append(newPosts.html());

					newPosts = container.children('.ajax-new');

					// Update page number and nextLink
					pageNum++;
					nextLink = nextLink.replace(/\/page\/[0-9]?/, '/page/'+ pageNum);
					
					// Update the button state
					if ( pageNum <= pageMax ) { $button.button('reset'); }
					else { $button.button('complete'); }

					// Update layout once posts have loaded
					setTimeout( function() {
						iframeAspect();
						postsPage();
						newPosts.removeClass('ajax-new');
						if ( mixt_opt['layout-type'] == 'masonry' ) {
							var $container = $('.blog-masonry .posts-container');
							$container.imagesLoaded( function() {
								$container.isotope('appended', newPosts);
							});
						}
					}, 100);

					if ( mixt_opt['pagination-type'] == 'ajax-scroll' ) { viewport.on('scroll', ajaxScrollHandle); }

					// Handle Errors
					if ( status == 'error' ) {
						$button.button('error');
						// Debugging info
						// alert('AJAX Error: ' + xhr.status + ' ' + xhr.statusText );
					}
				});
			}	
			
			return false;
		});
	}

	// Functions To Run On Window Resize

	var lightSliderInst = $('.gallery-slider'); // lightSlider Instances

	function resizeFn() {
		iframeAspect();
		lightSliderInst.css('height', '');
	}

	viewport.resize( $.debounce( 500, resizeFn ));

}(jQuery));