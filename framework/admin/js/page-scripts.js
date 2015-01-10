
jQuery(document).ready( function($) {

	// Nest fields

	var pageFieldsNest = function() {

		var fieldRow     = '.cmb-row',
			nestedFields = $(fieldRow + ' .nested');

		if (nestedFields.length > 0) {
			nestedFields.each( function() {
				var field     = $(this),
					fieldCls  = field.attr('class'),
					fieldCont = field.closest(fieldRow),
					fieldParent = field.attr('data-parent-field');

				if (typeof fieldParent == 'undefined' && fieldCls.indexOf('parent__') >= 0) {
					fieldParent = fieldCls.split('parent__')[1].split(' ')[0];
				}

				var nestParent = (typeof fieldParent !== 'undefined' ? 'cmb2-id-' + fieldParent.replace(/_/g, '-') : false);
				if (nestParent !== false && fieldCont.parent(fieldRow).not(nestParent)) {
					var $nestParent = $('.' + nestParent);
					fieldCont.appendTo($nestParent);
					$nestParent.addClass('nest-parent');
				}
			});
		}
	};

	pageFieldsNest();

	// Hide & Show fields

	var pageFieldsVis = function() {

		var conditionalFields = $('.cmb-row .conditional');

		if (conditionalFields.length > 0) {
			conditionalFields.each( function() {
				var field     = $(this),
					fieldCls  = field.attr('class'),
					fieldCont = field.closest('.cmb-row'),
					trigger   = field.attr('data-show-on'),
					triggerID = field.attr('data-show-on-id');

				if (typeof trigger == 'undefined' && fieldCls.indexOf('parent__') >= 0) {
					trigger = fieldCls.split('parent__')[1].split(' ')[0];
				} else if (typeof trigger == 'undefined') {
					trigger = false;
				}
				if (trigger || triggerID) {
					var triggerVal;
					if (trigger) {
						triggerVal = ($('input[name="' + trigger + '"]:checked').val() == 'true' ? true : false);

					} else {
						triggerVal = ($('input[id="' + triggerID + '"]').is(':checked') ? true : false);
					}

					if (triggerVal === true) {
						fieldCont.fadeIn(300);
					} else {
						fieldCont.fadeOut(300);
					}
				}
			});
		}
	};

	pageFieldsVis();

	$('#page_header input').on('click', function() {
		pageFieldsVis();
	});

});