
/* ------------------------------------------------ /
REDUX OPTION PANEL SCRIPTS
/ ------------------------------------------------ */

( function($) {

	'use strict';

	// Lighten / Darken Color
	function shadeColor(color, percent) {
		if ( color.length === 0 ) return;
		var f = parseInt(color.slice(1),16),
			t = percent < 0 ? 0 : 255,
			p = percent < 0 ? percent * -1 : percent,
			R = f >> 16,
			G = f >> 8&0x00FF,
			B = f&0x0000FF;
		return '#'+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
	}

	// Page Loader Function

	function pageLoadPreview() {
		var pageLoadImage = $('#mixt_opt-page-loader-img').find('.redux-option-image'),
			pageLoadColorVal = $('#page-loader-bg-color').val();

		pageLoadImage.css({
			backgroundColor: pageLoadColorVal,
			borderColor: shadeColor(pageLoadColorVal, -0.2)
		});
	}

	$(document).ready( function() {
		pageLoadPreview();

		$('#mixt_opt-page-loader-bg').on('mouseup', function() { setTimeout(pageLoadPreview, 100); });

		// Multi Input Fields

		$('.mixt-multi-input').each( function() {
			var cont = $(this),
				parent = cont.parents('tr'),
				parClass = 'multi-input-cont';

			if ( cont.hasClass('no-title') ) {
				parent.children('th').hide().siblings('td').attr('colspan', 2);
			}

			if ( cont.hasClass('sortable') ) {
				cont.sortable({
					opacity: 0.8,
					revert: 200,
					items: '> li:not(.multi-input-model)',
					handle: '.sort-handle',
					placeholder: 'sort-placeholder',
					containment: cont,
					tolerance: 'pointer',
					forcePlaceholderSize: true
				});
			}

			parent.addClass(parClass);
		});

		// Remove Unnecessary Borders

		$('.form-table tr:last-child').each( function() {
			var row = $(this);

			if ( row.css('display') == 'none' ) {
				row.prev('tr').css('border-bottom', '0');
			}
		});
	});

})(jQuery);