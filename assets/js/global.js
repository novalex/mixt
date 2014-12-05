
// MIXT GLOBAL FUNCTIONS

(function ($) {

// GLOBAL VARS

var bodyEl     = $('body'),
	mainWrap   = $('#main-wrap'),
	topNavBar  = $('#top-nav'),
	topNavWrap = $('#top-nav-wrap');


// Sticky Navbar

function stickyNav(isMobile) {

	var navPos = topNavWrap.offset().top,
		scrollMargin = 0,
		navTransparent = (mainWrap.hasClass('nav-transparent') ? true : false);

	if (bodyEl.hasClass('admin-bar'))
		scrollMargin += parseFloat($('#main-wrap').css('padding-top'));
	
	stickyNavToggle();

	if (!isMobile) $(window).scroll( $.throttle( 50, stickyNavToggle ));

	function stickyNavToggle() {
		if (($(window).scrollTop() + scrollMargin) > navPos) {  
			bodyEl.addClass('fixed-nav');
			if (!isMobile) topNavBar.removeClass('position-top');
		} else {
			bodyEl.removeClass('fixed-nav');
			topNavBar.addClass('position-top');
		}
	}
}


// Prevent Navbar Submenu Overflow

function navMenuOv() {

	var navbar = $('.navbar-mixt'),
		navbarW = navbar.width(),
		mainSub = $('.drop-menu .dropdown-menu, .mega-menu-column > .submenu', navbar);

	mainSub.each( function() {

		var sub      = $(this),
			subPos   = parseInt(sub.offset().left, 10),
			subW     = sub.innerWidth() + 1,
			subMg    = parseInt(sub.css('margin-left'), 10),
			nestOff  = subPos + subW,
			nestSubs = sub.children('.drop-submenu');

		function setArrowLeft(target) {
			target.addClass('drop-left arrow-left').removeClass('arrow-right');
			target.find('.drop-submenu').addClass('drop-left arrow-left').removeClass('arrow-right');
			target.find('.submenu').addClass('drop-left');
		}

		function resetArrow(target) {
			target.addClass('arrow-right').removeClass('drop-left arrow-left');
			target.find('.drop-submenu').addClass('arrow-right').removeClass('drop-left arrow-left');
			target.find('.submenu').removeClass('drop-left');
		}

		// Top level submenus
		var topSub = sub;
		if (sub.parent().is('.mega-menu-column')) topSub = sub.parents('.dropdown-menu');
		if ((nestOff + subMg) >= navbarW) {
			var correction = '-' + (nestOff - navbarW + 10) + 'px';
			topSub.css('margin-left', correction);

			setArrowLeft(nestSubs);
		} else {
			topSub.css('margin-left', '0');

			resetArrow(nestSubs);
		}

		// Multi level submenus
		if (nestSubs.length > 0) {
			nestSubs.each( function() {
				var	subNow      = $(this),
					nestSubs    = subNow.find('.submenu, .drop-submenu .submenu'),
					minWidth    = (nestSubs.length * 120),
					mapNestSubs = nestSubs.map( function() { return $(this).innerWidth(); }).get(),
					nestSubsW   = Math.max.apply(minWidth, mapNestSubs),
					totalCalc   = nestOff + nestSubsW + 12;

					if (nestSubsW < minWidth) totalCalc += (minWidth - nestSubsW);

				if (totalCalc >= navbarW) {
					setArrowLeft(subNow);
				} else {
					resetArrow(subNow);
				}
			});
		}
	});
}


// Isotope Masonry Init

$(function() {
	var $container = $('.grid-container');

	$container.isotope({
		itemSelector: 'article',
		layout: 'masonry'
	});

	$container.imagesLoaded( function() {
		$container.isotope('layout');
	});
});


// Check Nav Background Color

if (mainWrap.is('.has-head-media')) {
	var mediaCont = $('.head-media'),
		imgsrc = mediaCont.children('.media-container').attr('data-imgsrc');

	if (imgsrc != 'undefined') {
		getImageLightness(imgsrc, function(brightness) {
			console.log('Image brightness:' + brightness);
			if (brightness < 180) {
				topNavBar.addClass('text-light').removeClass('text-dark');
				mediaCont.addClass('text-light').removeClass('text-dark');
			} else {
			    topNavBar.addClass('text-dark').removeClass('text-light');
			    mediaCont.addClass('text-dark').removeClass('text-light');
			}
		});
	}
}


// FUNCTIONS RUN ON WINDOW RESIZE

function resizeFunctions() {

	var mqCheck = function( elem ) {
		if ($(elem).css('display') == 'block') { return true; }
		else { return false; }
	};

	if (!mqCheck('#navbar-check')) {
		navMenuOv();
	}

	if (topNavBar.hasClass('sticky')) {
		if (mqCheck('#navbar-check')) {
			stickyNav(true);
		} else {
			stickyNav(false);
		}
	}

}

$(window).resize( $.throttle( 1200, resizeFunctions ));


// RUN ON LOAD

$(window).load( function() {

	// Hide loading animation
	$('html, body').removeClass('loading');
	$('#mixt_load_class').remove();

	resizeFunctions();

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

});

}(jQuery));