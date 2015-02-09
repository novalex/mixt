
/* ------------------------------------------------ /
MIXT GLOBAL FUNCTIONS
/ ------------------------------------------------ */

(function ($) {

'use strict';

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

// FUNCTIONS RUN ON WINDOW RESIZE

function resizeFunctions() {

	var mqCheck = function( elem ) {
		elem = $('#' + elem);
		if (elem.css('display') == 'block') { return 1; }
		else if (elem.css('display') == 'inline') { return 2; }
		else { return 0; }
	};

}

resizeFunctions();

$(window).resize( $.debounce( 500, resizeFunctions ));


// RUN ON LOAD

function mixt_on_load() {

	// Remove unneeded JS scripts

	$('#mixt-test-js, #mixt-loading-class').remove();

	// Hide loading animation

	$('body').removeClass('loading');
	$('#load-overlay .loader').fadeOut(300);

	// Listen for page changes and add loading animation

	$('a').click( function(event) {
		var href = $(this).attr('href'),
			diff = href.replace(window.location.href, ''),
			target = $(event.target);
		if ( diff.indexOf('#') !== 0 && diff.indexOf('?') !== 0 && target.is('a') && event.which == '1' ) {
			$('body').addClass('loading-out');
			$('#load-overlay .loader').fadeIn(300);
			setTimeout( function() {
				$('body').addClass('loading');
			}, 300);
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
}

$(window).load( function() {

	mixt_on_load();

});

$(document).ready( function() {
	// Init Stellar Parallax

	$('.parallax').stellar({
		responsive: true
	});
});

}(jQuery));