
// MIXT GLOBAL FUNCTIONS

(function ($) {

// GLOBAL VARS

var viewport   = $(window),
	bodyEl     = $('body'),
	mainWrap   = $('#main-wrap'),
	topNavBar  = $('#top-nav'),
	topNavWrap = $('#top-nav-wrap');


// NAVBAR FUNCTIONS

var navbarObj = {

	// Sticky Navbar

	stickyNav: function(isMobile) {
		
		stickyNavToggle();

		var navScrollHandler = $.throttle( 50, stickyNavToggle );

		if (!isMobile) { viewport.on('scroll', navScrollHandler); }
		else { viewport.off('scroll', navScrollHandler); }

		function stickyNavToggle() {
			var navPos    = topNavWrap.offset().top,
				scrollMg  = 0,
				scrollVal = viewport.scrollTop();

			if (bodyEl.hasClass('admin-bar'))
				scrollMg += parseFloat($('#main-wrap').css('padding-top'), 10);

			scrollVal = isMobile === true ? 0 : scrollVal += scrollMg;

			if (scrollVal > navPos) {  
				bodyEl.addClass('fixed-nav');
				topNavBar.removeClass('position-top');
			} else {
				bodyEl.removeClass('fixed-nav');
				topNavBar.addClass('position-top');
			}
		}
	},

	// Prevent Navbar Submenu Overflow Out Of Viewport

	menuOverflow: function() {

		var navbar  = $('.navbar-inner', topNavBar),
			navbarOff = 0,
			mainSub = navbar.find('.drop-menu .dropdown-menu, .mega-menu-column > .submenu');

		if (navbar.length > 0) navbarOff = navbar.outerWidth() + parseInt(navbar.offset().left, 10);

		// Set Menu Drop Left

		function setDropLeft(target) {
			target.addClass('arrow-left').removeClass('arrow-right');
			target.find('.drop-submenu').addClass('arrow-left').removeClass('arrow-right');
			target.find('.submenu').addClass('drop-left');
		}
		// Reset Menu Drop

		function resetArrow(target) {
			target.addClass('arrow-right').removeClass('arrow-left');
			target.find('.drop-submenu').addClass('arrow-right').removeClass('arrow-left');
			target.find('.submenu').removeClass('drop-left');
		}

		// Reset Mobile Adjustments

		topNavBar.css({ 'position': '', 'top': '' }).removeClass('stopped');

		mainSub.each( function() {
			var sub      = $(this),
				topSub   = sub,
				subPar   = sub.parent(),
				subPos   = parseInt(sub.offset().left, 10),
				subW     = sub.outerWidth() + 1,
				nestOff  = subPos + subW,
				nestSubs = sub.children('.drop-submenu'),
				subMg    = 0,
				overflowingSubs = nestSubs,
				correction;

			if (subPar.is('.mega-menu-column')) {
				topSub = subPar.parents('.dropdown-menu');
				overflowingSubs = topSub.children('.mega-menu-column:last-child .drop-submenu');
			}

			subMg = parseInt(topSub.css('margin-left'), 10);

			// Top Level Submenus

			if (nestOff > navbarOff) {
				correction = '-' + (nestOff - navbarOff) + 'px';
				topSub.css('margin-left', correction);
				setDropLeft(overflowingSubs);
			}

			// Nested Submenus

			nestSubs.each( function() {
				var subNow    = $(this),
					nestSubsW = [];
				subNow.find('.submenu:not(:has(.drop-submenu))').map( function(i) {
					var $this    = $(this),
						parents  = $this.parents('.submenu'),
						parentsW = 0;

					parents.each( function() {
						var $this = $(this);
						if (!$this.hasClass('dropdown-menu') && !$this.hasClass('mega-menu-column')) {
							parentsW += $(this).outerWidth();
						}
					});

				    nestSubsW[i] = $this.outerWidth() + parentsW;
				});

				var maxNestW = $.isEmptyObject(nestSubsW) ? 0 : Math.max.apply(null, nestSubsW);

				if ((nestOff + maxNestW) >= bodyEl.width()) {
					setDropLeft(subNow);
				} else {
					resetArrow(subNow);
				}

			});

		});
	},

	// Nav Mega Menu Rows

	megaMenuRows: function() {
		topNavBar.find('.mega-menu').each( function() {
			var mainMenu = $(this).children('.submenu'),
				columns  = mainMenu.children('.mega-menu-column');

			if (columns.length > 4) mainMenu.addClass('multi-row');
		});
	},

	// Nav Mobile Functions

	navMobile: function() {

		// Enable Nav Scrolling If Nav Height > Viewport

		function navScroll() {
			if (topNavBar.hasClass('sticky')) {
				var viewportH = viewport.height(),
					viewportS = viewport.scrollTop(),
					navbarH   = $('.navbar-header', topNavBar).height() + $('.navbar-inner', topNavBar).height(),
					navbarTop = topNavBar.offset().top,
					scrollHandler = $.throttle( 50, navStopScroll );

				if (bodyEl.hasClass('admin-bar')) navbarTop -= $('#wpadminbar').height();

				if (navbarH > viewportH) {
					viewport.on('scroll', scrollHandler);
					if (topNavBar.not('stopped')) {
						topNavBar.addClass('stopped').css({ 'position': 'absolute', 'top': navbarTop });
					}
				} else {
					viewport.off('scroll', scrollHandler);
					topNavBar.css({ 'position': '', 'top': '' }).removeClass('stopped');
				}
			}

			function navStopScroll() {
				var viewScroll = viewport.scrollTop(),
					stopScroll = topNavBar.hasClass('stopped') ? true : false;
				if (viewportS > $('.navbar-toggle', topNavBar).offset().top) stopScroll = false;
				if (viewportS > viewScroll && stopScroll) { viewport.scrollTop(viewportS); }
			}
		}

		// Show/hide Submenus On Handle Click

		$('.dropdown-toggle', topNavBar).on('click touchstart', function(event) {
			if ($(event.target).is('.drop-arrow')) {
				if(event.handled !== true) {
		            var handle = $(this),
		            	menu   = handle.closest('.menu-item');

		            if (menu.hasClass('expand')) {
		            	menu.removeClass('expand');
		            	$('.menu-item', menu).removeClass('expand');
		            } else {
		            	menu.addClass('expand').siblings('li').removeClass('expand').find('.expand').removeClass('expand');
		            }

		            navScroll();

		            event.handled = true;
		        } else {
		            return false;
		        }
		        event.preventDefault();
			}
			event.stopPropagation();
		});

		$('.navbar-toggle', topNavBar).on('click touchstart', function() {
			$('.menu-item', topNavBar).removeClass('expand');
			navScroll();
		});

		navScroll();
	}
};


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

if (mainWrap.is('.has-head-media') && $('.head-media').children('.media-container').length == 1) {
	var mediaCont = $('.head-media'),
		imgsrc = mediaCont.children('.media-container').attr('data-imgsrc');

	/* global imageLoD */

	if (imgsrc != 'undefined' && typeof imageLoD != 'undefined') {
		imageLoD(imgsrc, function(brightness) {
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
		elem = $('#' + elem);
		if (elem.css('display') == 'block') { return 1; }
		else if (elem.css('display') == 'inline') { return 2; }
		else { return 0; }
	};

	var mqNav = mqCheck('navbar-check');

	if (mqNav === 0) {
		navbarObj.menuOverflow();
	} else if (mqNav > 0) {
		navbarObj.navMobile();
	}

	if (topNavBar.hasClass('sticky')) {
		if (mqNav === 1) {
			navbarObj.stickyNav(true);
		} else {
			navbarObj.stickyNav(false);
		}
	}

}

resizeFunctions();

$(window).resize( $.debounce( 1000, resizeFunctions ));


// RUN ON LOAD

$(window).load( function() {

	// Hide loading animation
	$('html, body').removeClass('loading');
	$('#mixt_load_class').remove();

	navbarObj.megaMenuRows();

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