
/* ------------------------------------------------ /
UI FUNCTIONS
/ ------------------------------------------------ */

+function ($) {

	'use strict';

	/* global mixt_opt */

	var viewport = $(window),
		htmlEl   = $('html'),
		bodyEl   = $('body');


	// Spinner Input
	$('.mixt-spinner').on('click', '.btn', function() {
		var $el     = $(this),
			spinner = $el.parents('.mixt-spinner'),
			input   = spinner.children('.spinner-val'),
			step    = input.attr('step') || 1,
			minVal  = input.attr('min') || 0,
			maxVal  = input.attr('max') || null,
			val     = input.val(),
			newVal;
		if ( isNaN(val) ) val = minVal;
		
		if ( $el.hasClass('minus') ) {
			// Decrease
			newVal = parseFloat(val) - parseFloat(step);
			if ( newVal < minVal ) newVal = minVal;
			input.val(newVal);
		} else {
			// Increase
			newVal = parseFloat(val) + parseFloat(step);
			if ( maxVal !== null && newVal > maxVal ) newVal = maxVal;
			input.val(newVal);
		}
	});


	// Content Filtering
	$('.content-filter-links').children().click( function() {
		var link = $(this),
			filter = link.data('filter'),
			content = $('.' + link.parents('.content-filter-links').data('content')),
			filterClass = 'filter-hidden';
		link.addClass('active').siblings().removeClass('active');
		if ( filter == 'all' ) { content.find('.'+filterClass).removeClass(filterClass).slideDown(600); }
		else { content.find('.' + filter).removeClass(filterClass).slideDown(600).siblings(':not(.'+filter+')').addClass(filterClass).slideUp(600); }
	});


	// Sort portfolio items
	$('.portfolio-sorter a').click( function(event) {
		event.preventDefault();
		var elem = $(this),
			targetTag = elem.data('sort'),
			targetContainer = $('.posts-container');

		elem.parent().addClass('active').siblings().removeClass('active');

		if ( mixt_opt.layout.type == 'masonry' && typeof $.fn.isotope === 'function' ) {
			if (targetTag == 'all') {
				targetContainer.isotope({ filter: '*' });
			} else {
				targetContainer.isotope({ filter: '.' + targetTag });
			}
		} else {
			var projects = targetContainer.children('.portfolio');
			if ( targetTag == 'all' ) {
				projects.fadeIn(300).addClass('filtered');
			} else {
				projects.fadeOut(0).removeClass('filtered').filter('.' + targetTag).fadeIn(300).addClass('filtered');
			}
		}
	});


	// Offset scrolling to link anchor (hash)
	$('a[href^="#"]').on('click', function(e) {
		var link = $(this),
			hash = link.attr('href');

		if ( link.data('no-hash-scroll') ) return;

		if ( hash.length ) {
			e.preventDefault();
			var target = $(hash);
			if ( target.length) {
				/* global breakpoint */
				var hashOffset = $(hash).offset().top;
				if ( mixt_opt.nav.mode == 'fixed' && breakpoint.name != 'pluto' && breakpoint.name != 'mercury' ) { hashOffset -= $('#main-nav').outerHeight(); }
				htmlEl.add(bodyEl).animate({ scrollTop: hashOffset }, 600);
			}
			window.location.hash = hash;
		}
	});
	// Ignore specific anchors
	$('.tabs a, .vc_tta a').attr('data-no-hash-scroll', true);


	// Social Icons
	$('.social-links').not('.hover-none').each( function() {
		var cont = $(this);

		cont.children().each( function() {
			var icon = $(this),
				link = icon.children('a'),
				dataColor = link.attr('data-color');

			if ( cont.hasClass('hover-bg') ) {
				link.hover( function() {
					if ( cont.parents('.position-top').length === 0 && cont.parents('.no-hover-bg').length === 0 ) {
						link.css({ backgroundColor: dataColor, borderColor: dataColor, zIndex: 1 });
					}
				}, function() { link.css({ backgroundColor: '', borderColor: '', zIndex: '' }); });
			} else {
				link.hover( function() {
					if ( cont.parents('.navbar.position-top').length === 0 ) {
						link.css({ color: dataColor, zIndex: 1 });
					}
				}, function() { link.css({ color: '', zIndex: '' }); });
			}
		});
	});


	// Functions run on page load and "refresh" event
	function runOnRefresh() {
		// Tooltips Init
		$('[data-toggle="tooltip"], .related-title-tip').tooltip({
			placement: 'auto',
			container: 'body'
		});


		// On Hover Animations Init
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
	}
	viewport.on('refresh', function() {
		runOnRefresh();
	}).trigger('refresh');


	// Back To Top Button
	function backToTopDisplay() {
		var scrollTop = viewport.scrollTop();
		if ( scrollTop > 200 ) {
			backToTop.fadeIn(300);
		} else {
			backToTop.fadeOut(300);
		}
	}

	var backToTop = $('#back-to-top');

	if ( backToTop.length ) {
		viewport.on('scroll', $.throttle( 1000, backToTopDisplay )).scroll();

		backToTop.click( function() {
			htmlEl.add(bodyEl).animate({ scrollTop: 0 }, 600);
		});
	}

}(jQuery);
