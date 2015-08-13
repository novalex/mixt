
/* ------------------------------------------------ /
MIXT INTEGRATION FUNCTIONS
/ ------------------------------------------------ */

'use strict';

// Skip Link Focus Fix

( function() {
	var is_webkit = navigator.userAgent.toLowerCase().indexOf( 'webkit' ) > -1,
		is_opera  = navigator.userAgent.toLowerCase().indexOf( 'opera' )  > -1,
		is_ie     = navigator.userAgent.toLowerCase().indexOf( 'msie' )   > -1;

	if ( ( is_webkit || is_opera || is_ie ) && 'undefined' !== typeof( document.getElementById ) ) {
		var eventMethod = ( window.addEventListener ) ? 'addEventListener' : 'attachEvent';
		window[ eventMethod ]( 'hashchange', function() {
			var element = document.getElementById( location.hash.substring( 1 ) );

			if ( element ) {
				if ( ! /^(?:a|select|input|button|textarea|div)$/i.test( element.tagName ) ) {
					element.tabIndex = -1;
				}

				element.focus();
			}
		}, false );
	}
})();

// Run On Page Load

jQuery( document ).ready( function( $ ) {

	// Add Bootstrap Classes

	$('input.search-field').addClass('form-control');
	$('input.search-submit').addClass('btn btn-default');

	$('.widget_rss ul').addClass('media-list');

	$('.widget_meta ul, .widget_recent_entries ul, .widget_archive ul, .widget_categories ul, .widget_nav_menu ul, .widget_pages ul').addClass('nav');

	$('.widget_recent_comments ul#recentcomments').css('list-style', 'none').css('padding-left', '0');
	$('.widget_recent_comments ul#recentcomments li').css('padding', '5px 15px');

	$('table#wp-calendar').addClass('table table-striped');

	// Handle Post Count

	$('.widget_archive li, .widget_categories li').each( function() {
		var $this     = $(this),
			children  = $this.children(),
			anchor    = children.filter('a'),
			contents  = $this.contents(),
			countText = contents.not(children).text();

		if ( countText !== '' ) {
			anchor.append('<span class="post-count">' + countText + '</span>');
			contents.filter( function() {
				return this.nodeType === 3; 
			}).remove();
		}
	});

	// Gallery Arrow Navigation

	$( document ).keydown( function(e) {
		var url = false;
		if ( e.which === 37 ) {  // Left arrow key code
			url = $('.previous-image a').attr('href');
		}
		else if ( e.which === 39 ) {  // Right arrow key code
			url = $('.entry-attachment a').attr('href');
		}
		if ( url && ( !$('textarea, input').is(':focus') ) ) {
			window.location = url;
		}
	});

});