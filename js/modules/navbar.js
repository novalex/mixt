
/* ------------------------------------------------ /
NAVBAR FUNCTIONS
/ ------------------------------------------------ */

+function ($) {

	'use strict';

	/* global mixt_opt, colorLoD */

	var viewport    = $(window),
		bodyEl      = $('body'),
		mainWrap    = $('#main-wrap'),
		topNavBar   = $('#top-nav'),
		topNavWrap  = $('#top-nav-wrap'),
		topNavHead  = $('.navbar-header', topNavBar),
		topNavInner = $('.navbar-inner', topNavBar),
		secNavBar   = $('#second-nav'),
		navbars     = $('.navbar'),
		mediaWrap   = $('.head-media');

	var navbarObj = {

		navBg: '',
		navBgTop: '',

		// Set Background Color Class

		init: function(navbar) {

			var bgColor  = navbar.css('background-color'),
				colorLum = colorLoD(bgColor);

			if ( colorLum == 'dark' ) {
				navbar.addClass('bg-dark');
			}

			if ( navbar.is(topNavBar) ) {
				navbarObj.navBg    = colorLum == 'dark' ? 'bg-dark' : '';
				if ( mixt_opt['nav-transparent'] == 'true' && mixt_opt['head-media'] == 'true' ) {
					navbarObj.navBgTop = mediaWrap.hasClass('bg-dark') ? 'bg-dark' : '';
				} else {
					navbarObj.navBgTop = navbarObj.navBg;
				}
			}
		},

		// Sticky (fixed) Navbar Function

		stickyNav: function(isMobile) {

			var navScrollHandler = $.throttle( 50, stickyNavToggle ),
				scrollCorrection = 0,
				topNavHeight     = 0,
				topNavPos        = 0,
				topNavMg         = 0;

			if ( isMobile === false ) { viewport.on('scroll', navScrollHandler); }
			else { viewport.off('scroll', navScrollHandler); }

			if ( mixt_opt['show-admin-bar'] == 'true' ) {
				scrollCorrection += parseFloat(mainWrap.css('padding-top'), 10);
			}

			if ( mixt_opt['nav-transparent'] == 'true' && mixt_opt['nav-position'] == 'below' ) {
				topNavHeight = topNavBar.css('height', '').outerHeight();
				topNavPos    = parseInt(topNavBar.css('top'), 10);
				topNavMg     = topNavHeight;

				if ( topNavPos === 0 || isNaN(topNavPos) ) {
					topNavBar.css('margin-top', (topNavHeight * -1));
				}
			}

			function stickyNavToggle() {
				var navPos    = topNavWrap.offset().top - topNavMg,
					scrollVal = viewport.scrollTop(),
					bgTopCls  = navbarObj.navBgTop;

				scrollVal = isMobile === true ? 0 : scrollVal += scrollCorrection;

				if ( topNavBar.hasClass('slide-bg-dark') ) { bgTopCls = 'bg-dark'; }
				if ( topNavBar.hasClass('slide-bg-light') ) { bgTopCls = ''; }

				if ( scrollVal > navPos ) {  
					bodyEl.addClass('fixed-nav');
					topNavBar.removeClass('position-top ' + bgTopCls).addClass(navbarObj.navBg);
				} else {
					bodyEl.removeClass('fixed-nav');
					topNavBar.removeClass(navbarObj.navBg).addClass('position-top ' + bgTopCls);
				}
			}

			stickyNavToggle();
		},

		// Prevent Navbar Submenu Overflow Out Of Viewport

		menuOverflow: function(navbar) {

			var navbarOff = 0,
				mainSub = navbar.find('.drop-menu .dropdown-menu, .mega-menu-column > .sub-menu, .mega-menu-column > a');

			if ( navbar.length > 0 ) {
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

				if ( subPar.is('.mega-menu-column') ) {
					topSub = subPar.parents('.dropdown-menu');
					overflowingSubs = topSub.find('.mega-menu-column:nth-child(4n) .drop-submenu, .mega-menu-column:nth-child(n-4):last-child .drop-submenu');
				}

				// Top Level Submenus

				if ( nestOff > navbarOff ) {
					var mgNow = parseInt(topSub.css('margin-left'), 10);
					correction = (nestOff - navbarOff - 2) * -1;

					if ( topSub.css('border-right-width') == '1px' ) { correction -= 1; }

					if ( navbar.hasClass('bordered') || navbar.parents('.navbar').hasClass('bordered') ) { correction -= 1; }

					if ( correction < mgNow ) {
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
							if ( ! $this.hasClass('dropdown-menu') && ! $this.hasClass('mega-menu-column')) {
								parentsW += $(this).outerWidth();
							}
						});

						nestSubsW[i] = $this.outerWidth() + parentsW;
					});

					var maxNestW = $.isEmptyObject(nestSubsW) ? 0 : Math.max.apply(null, nestSubsW);

					if ( (nestOff + maxNestW) >= bodyEl.width() ) {
						setDropLeft(subNow);
					} else {
						resetArrow(subNow);
					}

				});

			});
		},

		// Mega Menu Enable / Disable

		megaMenuToggle: function(toggle, navbar) {
			var megaMenus;

			if ( toggle == 'enable' ) {
				megaMenus = navbar.find('.drop-menu[data-mega-menu="true"]');
				megaMenus.each( function() {
					var megaMenu = $(this);

					megaMenu.addClass('mega-menu').removeClass('drop-menu').removeAttr('data-mega-menu');
					$('> .sub-menu > .drop-submenu', megaMenu).removeClass('drop-submenu').addClass('mega-menu-column');
				});
				megaMenus.children('ul').css('margin-left', '');
			} else if ( toggle == 'disable' ) {
				megaMenus = navbar.find('.mega-menu');
				megaMenus.each( function() {
					var megaMenu = $(this);

					megaMenu.removeClass('mega-menu').addClass('drop-menu').attr('data-mega-menu', 'true');
					megaMenu.find('.mega-menu-column').removeClass('mega-menu-column').addClass('drop-submenu');
				});
				megaMenus.children('ul').css('margin-left', '');
			}
		},

		// Create Mega Menu Rows If There Are More Than 4 Columns

		megaMenuRows: function() {
			mainWrap.find('.mega-menu').each( function() {
				var mainMenu = $(this).children('.sub-menu'),
					columns  = mainMenu.children('.mega-menu-column');

				if ( columns.length > 4 ) mainMenu.addClass('multi-row');
			});
		},

		// Mobile Functions

		navMobile: function(mqNav) {

			// Enable Nav Scrolling If Navbar Height > Viewport

			function navScroll() {
				if ( mixt_opt['nav-mode'] == 'fixed' && mqNav == 2 ) {
					var viewportH     = viewport.height(),
						viewportS     = viewport.scrollTop(),
						navbarHeaderH = topNavHead.height() + 1,
						navbarInnerH  = topNavInner.hasClass('in') ? topNavInner.height() : 0,
						navbarH       = navbarHeaderH + navbarInnerH,
						navbarMg      = 0,
						navbarTop     = topNavBar.offset().top,
						navwrapTop    = topNavWrap.offset().top,

						scrollHandler = $.throttle( 50, navStopScroll );

					if ( mixt_opt['show-admin-bar'] == 'true' ) {
						var adminBarH = $('#wpadminbar').height();
						viewportH  -= adminBarH;
						navwrapTop -= adminBarH;
						navbarTop  -= adminBarH;
					}

					if ( mixt_opt['nav-transparent'] == 'true' && mixt_opt['nav-position'] == 'below' ) {
						navbarMg = navbarHeaderH * -1;
					}

					if ( navbarH > viewportH ) {
						viewport.on('scroll', scrollHandler);
						if ( topNavBar.not('stopped') ) {
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
					if ( viewportS > topNavHead.offset().top ) { stopScroll = false; }
					if ( viewportS > viewScroll && stopScroll ) { viewport.scrollTop(viewportS); }
				}
			}

			// Show/hide Submenus On Handle Click

			$('.dropdown-toggle', topNavBar).on('click touchstart', function(event) {
				if ( $(event.target).is('.drop-arrow') ) {
					if( event.handled !== true ) {
						var handle = $(this),
							menu   = handle.closest('.menu-item');

						if ( menu.hasClass('expand') ) {
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

			topNavInner.on('shown.bs.collapse hidden.bs.collapse', function() {
				$('.menu-item', topNavBar).removeClass('expand');
				navScroll();
			});

			navScroll();
		}
	};

	// RUN NAVBAR FUNCTIONS

	// Check which media queries are active
	var mqCheck = function( elem ) {
		elem = $('#' + elem);
		var display = elem.css('display');

		if ( display == 'block' ) { return 1; }
		else if ( display == 'inline') { return 2; }
		else { return 0; }
	};

	// Handle navbar items overlapping
	var topNavCont    = topNavBar.children('.container'),
		topNavLogoCls = topNavWrap.attr('data-logo-align'),
		topNavItemsWidth = 0,

		secNavCont = secNavBar.children('.container'),
		secNavItemsWidth = 0;

	if ( topNavLogoCls != 'logo-center' ) {
		topNavItemsWidth = topNavHead.outerWidth(true) + $('#main-menu').outerWidth(true);
	}
	if ( secNavBar.length ) {
		secNavItemsWidth = $('.left', secNavBar).outerWidth(true) + $('.right', secNavBar).outerWidth(true);
	}

	// Enable Menu Hover On Touch Screens
	var menuParents = navbars.find('.menu-item-has-children, li.dropdown');
	function menuTouchHover(event) {
		var link = $(event.delegateTarget),
			ancestors = link.parents('.hover');
		if (link.hasClass('hover')) {
			return true;
		} else {
			link.addClass('hover');
			menuParents.not(link).not(ancestors).removeClass('hover');
			event.preventDefault();
			return false;
		}
	}
	function menuTouchRemoveHover(event) {
		if ( ! $(event.delegateTarget).is(menuParents) ) { menuParents.removeClass('hover'); }
	}

	// Functions Run On Load & Window Resize
	function navbarFn() {

		var mqNav = mqCheck('navbar-check'); // Equals "0" for desktop, "1" for mobile and "2" for tablets

		// Run function to prevent submenus going outside viewport
		navbars.not(topNavBar).each( function() {
			navbarObj.menuOverflow($('.navbar-inner', this));
		});

		// Run functions based on currently active media query
		if ( mqNav === 0 ) {
			navbarObj.menuOverflow(topNavInner);
			topNavBar.css('height', '');

			navbars.each( function() {
				navbarObj.megaMenuToggle('enable', $(this));
			});

			menuParents.on('touchstart', menuTouchHover);
			bodyEl.on('touchstart', menuTouchRemoveHover);
		} else if ( mqNav > 0 ) {
			navbarObj.navMobile(mqNav);

			var navHeight = topNavHead.outerHeight() + 1;
			topNavBar.css('height', navHeight);

			navbars.each( function() {
				navbarObj.megaMenuToggle('disable', $(this));
			});

			menuParents.off('touchstart', menuTouchHover);
			bodyEl.off('touchstart', menuTouchRemoveHover);
		}

		// Make primary navbar sticky if option enabled
		if ( mixt_opt['nav-mode'] == 'fixed' ) {
			if ( mqNav === 1 ) {
				navbarObj.stickyNav(true);
			} else {
				navbarObj.stickyNav(false);
			}
		} else {
			topNavBar.addClass('position-top');
		}

		navbarOverlap();
	}

	// Handle Navbar Items Overlap
	function navbarOverlap() {

		var mqNav = mqCheck('navbar-check');

		// Primary Navbar
		if ( topNavLogoCls != 'logo-center' ) {
			if ( mqNav === 0 ) {
				var topNavContWidth = topNavCont.innerWidth();
				if ( topNavItemsWidth > topNavContWidth ) {
					topNavWrap.removeClass(topNavLogoCls).addClass('logo-center');
				} else {
					topNavWrap.removeClass('logo-center').addClass(topNavLogoCls);
				}
			} else {
				topNavWrap.removeClass('logo-center').addClass(topNavLogoCls);
			}
		}

		// Secondary Navbar
		if ( secNavBar.length ) {
			var secNavContWidth = secNavCont.innerWidth();
			if ( secNavItemsWidth > secNavContWidth ) {
				secNavBar.addClass('items-overlap');
			} else {
				secNavBar.removeClass('items-overlap');
			}
		}
	}
	navbarOverlap();

	navbars.each( function() {
		navbarObj.init($(this));
	});

	navbarFn();

	navbarObj.megaMenuRows();

	$(window).resize( $.debounce( 500, navbarFn ));

}(jQuery);