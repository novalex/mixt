
// MIXT Redux Functions

jQuery(document).ready( function($) {

	'use strict';

	// Lighten / Darken Color
	function shadeColor(color, percent) {   
	    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
	    return '#'+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
	}

	// Page Loader Function

	var pageLoadImgSelect = $('#mixt_opt-page-loader-img'),
		pageLoadColor = $('#page-loader-color-color');

	function pageLoadPreview() {
		var pageLoadImage = pageLoadImgSelect.find('.redux-option-image'),
			pageLoadColorVal = pageLoadColor.val();

		pageLoadImage.css({
			backgroundColor: pageLoadColorVal,
			borderColor: shadeColor(pageLoadColorVal, -0.2)
		});
	}

	pageLoadPreview();

	$('#mixt_opt-page-loader-color').on('mouseup', function() { setTimeout(pageLoadPreview, 100); });


	// Favicons Function

	function faviconInit() {
		$('#mixt_opt-favicon-img').on('click', '.button', function() {
			$('#mixt_opt-favicon-rebuild').find('.cb-enable').get(0).click();
		});
	}

	faviconInit();

	// Social Profiles Function

	function mixt_social_profiles() {

		var listCont = $('#social-profiles-ul'),
			mainCont = listCont.parents('table');

		// Add class to parent table
		mainCont.addClass('social-profiles-table');
	}

	mixt_social_profiles();

});