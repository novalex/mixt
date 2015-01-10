
jQuery(document).ready( function($) {

	// MIXT Menu Handling Scripts

	// Check if item is a mega menu
	// If it is, label it as "Mega Menu" and its children as "Mega Menu Column"
	function megaMenuCheck(menuItem) {
		var itemType     = menuItem.find('.item-controls .item-type'),
			itemSubs     = menuItem.nextUntil('.menu-item-depth-0'),
			megaCheck    = menuItem.find('.field-megamenu input:checked'),
			megaCheckVal = megaCheck.val() ? true : false,
			defaultType;

		if (megaCheckVal === true) {
			defaultType = itemType.text();
			menuItem.addClass('is-mega');
			itemType.text('Mega Menu').attr('data-def-type', defaultType);

			// Handle Mega Menu Columns
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
			defaultType = itemType.attr('data-def-type');
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

	// Check if item is disabled
	// If it is, append "(disabled)" to its title
	function disabledCheck(menuItem) {
		var disCheck    = menuItem.find('.field-disabled input:checked'),
			disCheckVal = disCheck.val() ? true : false,
			itemTitle   = menuItem.find('.menu-item-title'),
			newTitle;

		if (disCheckVal === true) {
			newTitle = itemTitle.text() + ' (disabled)';
		} else {
			newTitle = itemTitle.text().replace(' (disabled)', '');
		}
		itemTitle.text(newTitle);
	}

	function checkMegaMenu() {
		$('.menu-item-depth-0').each( function() {
			var menuItem = $(this);
			megaMenuCheck(menuItem);
		});

		$('.field-megamenu input').on('change', function() {
			var target = $(this).parents('.menu-item-depth-0');
			megaMenuCheck(target);
		});
	}

	function checkDisabled() {
		$('.menu-item').each( function() {
			var menuItem = $(this);
			disabledCheck(menuItem);
		});

		$('.field-disabled input').on('change', function() {
			var target = $(this).parents('.menu-item');
			disabledCheck(target);
		});
	}

	checkMegaMenu();
	checkDisabled();

	$( document ).ajaxComplete(function() {
		checkMegaMenu();
		checkDisabled();
	});

});