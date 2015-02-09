
/* ------------------------------------------------ /
NAVBAR FUNCTIONS
/ ------------------------------------------------ */

+function ($) {

	'use strict';

	var viewport   = $(window),
		bodyEl     = $('body'),
		mainWrap   = $('#main-wrap'),
		topNavBar  = $('#top-nav'),
		topNavWrap = $('#top-nav-wrap');

	var navbarObj = {

		// Sticky Navbar

		stickyNav: function(isMobile) {

			var navScrollHandler = $.throttle( 50, stickyNavToggle ),
				scrollCorrection = 0,
				topNavHeight = 0;

			if (!isMobile) { viewport.on('scroll', navScrollHandler); }
			else { viewport.off('scroll', navScrollHandler); }

			if (bodyEl.hasClass('admin-bar')) {
				scrollCorrection += parseFloat($('#main-wrap').css('padding-top'), 10);
			}
			if (mainWrap.hasClass('nav-transparent') && mainWrap.hasClass('nav-below-header')) {
				var navDataH = topNavBar.attr('data-height');
				topNavHeight = topNavBar.outerHeight();

				if (!navDataH) {
					topNavBar.attr('data-height', topNavHeight);
				} else if (navDataH < topNavHeight) {
					topNavHeight = navDataH;
				}
				
				topNavBar.css('margin-top', (topNavHeight * -1));
			}

			function stickyNavToggle() {
				var navPos    = topNavWrap.offset().top - topNavHeight,
					scrollVal = viewport.scrollTop();

				scrollVal = isMobile === true ? 0 : scrollVal += scrollCorrection;

				if (scrollVal > navPos) {  
					bodyEl.addClass('fixed-nav');
					topNavBar.removeClass('position-top');
				} else {
					bodyEl.removeClass('fixed-nav');
					topNavBar.addClass('position-top');
				}
			}

			stickyNavToggle();
		},

		// Center Align Elements When Menu Has Many Items

		navOverlap: function(navbar, isMobile) {
			isMobile = isMobile || false;


		},

		// Prevent Navbar Submenu Overflow Out Of Viewport

		menuOverflow: function(navbar) {

			if ( ! navbar.jquery) {
				return;
			}

			var navbarOff = 0,
				mainSub = navbar.find('.drop-menu .dropdown-menu, .mega-menu-column > .sub-menu, .mega-menu-column > a');

			if (navbar.length > 0) {
				navbarOff = navbar.outerWidth() + parseInt(navbar.offset().left, 10);
			}

			// Set Menu Drop Left

			function setDropLeft(target) {
				target.find('.sub-menu').addClass('drop-left');
				if ( target.hasClass('arrow-left') || target.hasClass('arrow-right') ) {
					target.addClass('arrow-left').removeClass('arrow-right');
					target.find('.drop-submenu').addClass('arrow-left').removeClass('arrow-right');
				}
			}
			// Reset Menu Drop

			function resetArrow(target) {
				target.find('.sub-menu').removeClass('drop-left');
				if ( target.hasClass('arrow-left') || target.hasClass('arrow-right') ) {
					target.addClass('arrow-right').removeClass('arrow-left');
					target.find('.drop-submenu').addClass('arrow-right').removeClass('arrow-left');
				}
			}

			// Reset Mobile Adjustments

			topNavBar.css({ 'position': '', 'top': '' }).removeClass('stopped');

			// Perform menu overflow checks

			mainSub.each( function() {
				var sub      = $(this),
					topSub   = sub,
					subPar   = sub.parent(),
					subPos   = parseInt(sub.offset().left, 10),
					subW     = sub.outerWidth() + 1,
					nestOff  = subPos + subW,
					nestSubs = sub.children('.drop-submenu'),
					overflowingSubs = nestSubs,
					correction;

				if (subPar.is('.mega-menu-column')) {
					topSub = subPar.parents('.dropdown-menu');
					overflowingSubs = topSub.find('.mega-menu-column:nth-child(4n) .drop-submenu, .mega-menu-column:nth-child(n-4):last-child .drop-submenu');
				}

				// Top Level Submenus

				if (nestOff > navbarOff) {
					var mgNow = parseInt(topSub.css('margin-left'), 10);
					correction = (nestOff - navbarOff - 2) * -1;
					if (topSub.css('border-right-width') == '1px') {
						correction -= 1;
					}
					if (correction < mgNow) {
						topSub.css('margin-left', correction + 'px');
					}
					setDropLeft(overflowingSubs);
				}

				// Nested Submenus

				nestSubs.each( function() {
					var subNow    = $(this),
						nestSubsW = [];
					subNow.find('.sub-menu:not(:has(.drop-submenu))').map( function(i) {
						var $this    = $(this),
							parents  = $this.parents('.sub-menu'),
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
			mainWrap.find('.mega-menu').each( function() {
				var mainMenu = $(this).children('.sub-menu'),
					columns  = mainMenu.children('.mega-menu-column');

				if (columns.length > 4) mainMenu.addClass('multi-row');
			});
		},

		// Nav Mobile Functions

		navMobile: function() {

			// Enable Nav Scrolling If Navbar Height > Viewport

			function navScroll() {
				if (topNavBar.hasClass('sticky')) {
					var viewportH     = viewport.height(),
						viewportS     = viewport.scrollTop(),
						navbarH       = $('.navbar-header', topNavBar).height() + $('.navbar-inner', topNavBar).height(),
						navbarMg      = 0,
						navbarTop     = topNavBar.offset().top,
						navwrapTop    = topNavWrap.offset().top,

						scrollHandler = $.throttle( 50, navStopScroll );

					if (bodyEl.hasClass('admin-bar')) {
						var adminBarH = $('#wpadminbar').height();
						viewportH -= adminBarH;
						navwrapTop -= adminBarH;
						navbarTop -= adminBarH;
					}

					if (mainWrap.hasClass('nav-transparent') && mainWrap.hasClass('nav-below-header')) {
						navbarMg = topNavBar.data('height') * -1;
					}

					if (navbarH > viewportH) {
						viewport.on('scroll', scrollHandler);
						if (topNavBar.not('stopped')) {
							topNavBar.addClass('stopped').css({ 'position': 'absolute', 'top': (navbarTop - navwrapTop), 'margin-top': '0' });
						}
					} else {
						viewport.off('scroll', scrollHandler);
						topNavBar.css({ 'position': '', 'top': '', 'margin-top': navbarMg }).removeClass('stopped');
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

			$('.navbar-inner', topNavBar).on('shown.bs.collapse hidden.bs.collapse', function() {
				$('.menu-item', topNavBar).removeClass('expand');
				navScroll();
			});

			navScroll();
		}
	};

	// RUN NAVBAR FUNCTIONS

	function resizeFunctions() {

		var mqCheck = function( elem ) {
			elem = $('#' + elem);
			if (elem.css('display') == 'block') { return 1; }
			else if (elem.css('display') == 'inline') { return 2; }
			else { return 0; }
		};

		// Navigation Functions
		$('.navbar').find('.navbar-inner').each( function() {
			navbarObj.menuOverflow($(this));
		});

		// Primary Navigation Functions

		var mqNav = mqCheck('navbar-check');

		if (mqNav === 0) {
			navbarObj.menuOverflow($('.navbar-mixt .navbar-inner'));
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

	$(window).resize( $.debounce( 500, resizeFunctions ));

	$(document).ready( function() {
		navbarObj.megaMenuRows();
	});

}(jQuery);