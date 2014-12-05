
jQuery(document).ready( function($) {

	// Mega Menu Handling

	function megaMenuCheck(menuItem) {
		var itemType = menuItem.find('.item-controls .item-type'),
			itemSubs = menuItem.nextUntil('.menu-item-depth-0'),
			megaCheck    = menuItem.find('.field-megamenu input:checkbox:checked'),
			megaCheckVal = (megaCheck.val() ? true : false);

		if (megaCheckVal == true) {
			var defaultType = itemType.text();
			menuItem.addClass('is-mega');
			itemType.text('Mega Menu').attr('data-def-type', defaultType);

			// Mega menu columns
			itemSubs.each( function() {
				var subItem = $(this);
				if (subItem.is('.menu-item-depth-1')) {
					var itemType = $(this).find('.item-controls .item-type'),
						defaultType = itemType.text();
					subItem.addClass('is-column');
					itemType.text('Mega Menu Column').attr('data-def-type', defaultType);
				} else {
					return;
				}
			});
		} else if (menuItem.hasClass('is-mega')) {
			var defaultType = itemType.attr('data-def-type');
			itemType.text(defaultType).removeAttr('data-def-type');
			menuItem.removeClass('is-mega');
			
			itemSubs.each( function() {
				var subItem = $(this);
				if (subItem.is('.is-column')) {
					var itemType = $(this).find('.item-controls .item-type'),
						defaultType = itemType.attr('data-def-type');
					itemType.text(defaultType).removeAttr('data-def-type');
					subItem.removeClass('is-column');
				}
			});
		}
	}

	// Check only top level items
	$('.menu-item-depth-0').each( function() {
		var menuItem = $(this);
		megaMenuCheck(menuItem);

		$('.field-megamenu input:checkbox', menuItem).change( function() {
			megaMenuCheck(menuItem);
		});
	});

});