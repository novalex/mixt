
// MIXT Menu Handling Scripts

jQuery(document).ready( function($) {

	'use strict';

	// Check if item is a mega menu
	// Label it as "Mega Menu" and its children as "Mega Menu Column"
	function megaMenuCheck(menuItem) {
		var itemType     = menuItem.find('.item-controls .item-type'),
			itemSubs     = menuItem.nextUntil('.menu-item-depth-0'),
			megaCheck    = menuItem.find('.field-mixt-megamenu input:checked'),
			megaCheckVal = megaCheck.val() ? true : false,
			defaultType;

		if ( megaCheckVal === true ) {
			defaultType = itemType.text();
			itemType.text('Mega Menu').attr('data-def-type', defaultType);

			menuItem.addClass('is-mega');

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
		} else if ( menuItem.hasClass('is-mega') ) {
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

	function checkMegaMenu() {
		$('.menu-item-depth-0').each( function() {
			megaMenuCheck($(this));
		});

		$('.field-mixt-megamenu input').on('change', function() {
			var target = $(this).parents('.menu-item-depth-0');
			megaMenuCheck(target);
		});
	}

	// Check if item is disabled
	// Append "(disabled)" to its title
	function disabledCheck(menuItem) {
		var disCheck    = menuItem.find('.field-mixt-disabled input:checked'),
			disCheckVal = disCheck.val() ? true : false,
			itemTitle   = menuItem.find('.menu-item-title'),
			newTitle;

		if ( disCheckVal === true ) {
			newTitle = itemTitle.text().replace(' (disabled)', '') + ' (disabled)';
		} else {
			newTitle = itemTitle.text().replace(' (disabled)', '');
		}
		itemTitle.text(newTitle);
	}

	function checkDisabled() {
		$('.menu-item').each( function() {
			var menuItem = $(this);
			disabledCheck(menuItem);
		});

		$('.field-mixt-disabled input').on('change', function() {
			var target = $(this).parents('.menu-item');
			disabledCheck(target);
		});
	}

	$.fn.extend({
		mixtMenuItems: function() {
			var item     = this,
				itemType = item.find('.edit-menu-item-mixt-type').val();

			// Divider
			if ( itemType == 'divider' ) {
				item.find('.item-type, .description').hide();
				item.find('.menu-item-actions').css({ 'padding-top' : '0' });

			// Search Form
			} else if ( itemType == 'search' ) {
				item.find('.item-type').text('Search Form');
				item.find('.field-url, .field-link-target, .field-xfn, .field-mixt-megamenu').hide();

			// Button
			} else if ( itemType == 'button' ) {
				item.find('.item-type').text('Button');
				item.find('.field-xfn, .field-mixt-megamenu').hide();

			// Shopping Cart
			} else if ( itemType == 'cart' ) {
				item.find('.item-type').text('Shopping Cart');
				item.find('.field-url, .field-link-target, .field-xfn, .field-mixt-megamenu').hide();

			// Social Icon
			} else if ( itemType == 'social-icon' ) {
				item.find('.item-type').text('Social Icon');
				item.find('.field-xfn, .field-mixt-megamenu').hide();

			// Social Icon List
			} else if ( itemType == 'social-icons' ) {
				item.find('.item-type').text('Social Icon List');
				item.find('.description').hide();
				item.find('.menu-item-actions').css({ 'padding-top' : '0' });
			}
		},

		mixtNewItem: function() {
			var lastItem   = this,
				itemChecks = mixtElems.find('.menu-item-checkbox.last'),
				itemMeta   = itemChecks.last().parents('li');

			if ( lastItem.length == 1 ) {
				var itemType = lastItem.find('.edit-menu-item-mixt-type'),
					itemIcon = lastItem.find('.edit-menu-item-mixt-icon'),
					metaType = itemMeta.children('.menu-item-mixt-type').val(),
					metaIcon = itemMeta.children('.menu-item-mixt-icon').val();
				
				if ( metaType !== '' && itemType.val() === '' ) { itemType.val(metaType); }
				if ( metaIcon !== '' && itemIcon.val() === '' ) { itemIcon.val(metaIcon); }

				$(itemChecks).removeClass('last');

				lastItem.mixtMenuItems();
			}
		}
	});

	// Check for new items
	// Fill out custom data like menu icon
	var mixtElems = $('#posttype-mixt-elem'),
		menuItems = $('#menu-to-edit');

	mixtElems.find('input.menu-item-checkbox').on('change', function() {
		var check = $(this),
			cont  = check.parents('li');
		cont.siblings('li').find('.menu-item-checkbox.last').prop('checked', false).removeClass('last');
		check.addClass('last');
	});

	// Run Custom Menu Item Function
	function runChecks() {
		checkMegaMenu();
		checkDisabled();
		$('#menu-to-edit .menu-item').each( function() {
			$(this).mixtMenuItems();
		});
	}
	runChecks();

	$(document).ajaxComplete(function() {
		runChecks();
		menuItems.children('li.pending').last().mixtNewItem();
	});

});