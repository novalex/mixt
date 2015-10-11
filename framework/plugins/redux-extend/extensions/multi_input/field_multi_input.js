
(function( $ ) {

	'use strict';

	/* global _, redux_change, redux */

	redux.field_objects = redux.field_objects || {};
	redux.field_objects.multi_input = redux.field_objects.multi_input || {};

	function makeCheckbox(input) {
		if ( input.hasClass('init') ) {
			var checkbox = '<input type="checkbox" class="checkbox" />';
			input.removeClass('init').after(checkbox);

			checkbox = input.next('.checkbox');

			if ( input.val() == 1 ) {
				checkbox.attr('checked', 'checked');
			}

			checkbox.on('click', function() {
				if ( $(this).is(':checked') ) {
					input.val(1);
				} else {
					input.val(0);
				}
			});
		}
	}

	function groupInit(group, groupID) {
		group.find('input').each( function() {
			var input   = $(this);

			if ( input.hasClass('wp-colorpicker') ) {
				input.wpColorPicker({
					change: _.throttle(function() {
						$(this).trigger('change');
					}, 100)
				});
			}

			if ( input.hasClass('multi-input-checkbox') ) {
				makeCheckbox(input);
			}


		});

		group.find('.group-id').on('focusout', function() {
			var field = $(this),
				input = field.find('input'),
				group = field.closest('li'),
				groupID = input.val();

			setGroupId(group, groupID);
		}).children('input').val(groupID);

		if ( typeof(groupID) != 'undefined' && groupID !== '' ) {
			setGroupId(group, groupID);
		}
	}

	function setGroupId(group, groupID) {
		if ( typeof(groupID) !== 'undefined' && groupID !== '' ) {

			var oldGroupID = group.attr('data-group-id');

			if ( typeof(oldGroupID) == 'undefined' ) {
				oldGroupID = 'field-id';
			}

			group.find('input').each( function() {
				var input   = $(this),
					oldId   = input.attr('id');

				if ( typeof(oldId) != 'undefined' ) {
					var newId   = oldId.replace(oldGroupID, groupID);

					input.attr({
						id: newId,
						name: newId
					});

					group.attr('data-group-id', groupID);
				}
			});
		}
	}

	$( document ).ready( function() {
		//redux.field_objects.multi_input.init();


		$('.redux-multi-input').find('li:not(.multi-input-model)').each( function() {
			var group = $(this),
				idField = group.find('.group-id input');

			if ( idField.length ) {
				var groupID = idField.val();
				groupInit(group, groupID);
			} else {
				groupInit(group);
			}
		});
	});

	redux.field_objects.multi_input.init = function( selector ) {

		if ( !selector ) {
			selector = $( document ).find( '.redux-container-multi_input:visible' );
		}

		$( selector ).each(
			function() {
				var el = $( this );
				var parent = el;
				if ( !el.hasClass( 'redux-field-container' ) ) {
					parent = el.parents( '.redux-field-container:first' );
				}
				if ( parent.is(':hidden') ) { // Skip hidden fields
					return;
				}
				if ( parent.hasClass( 'redux-field-init' ) ) {
					parent.removeClass( 'redux-field-init' );
				} else {
					return;
				}

				el.find( '.redux-multi-input-remove' ).live('click', function() {
					redux_change( $( this ) );
					$( this ).prev( 'input[type="text"]' ).val( '' );
					$( this ).parent().slideUp(
						'medium', function() {
							$( this ).remove();
						}
					);
				});

				el.find( '.redux-multi-input-add' ).click(
					function() {
						var number = parseInt( $( this ).attr( 'data-add_number' ) );
						var id = $( this ).attr( 'data-id' );
						var name = $( this ).attr( 'data-name' );
						for ( var i = 0; i < number; i++ ) {
							var container = $('#' + id),
								new_input = container.find('.multi-input-model').clone();

							container.append( new_input );

							var groupNr   = container.find('li').length,
								lastGroup = container.find('li:last-child');
							lastGroup.removeAttr('style').removeClass('multi-input-model');

							groupInit(lastGroup, groupNr);
						}
					}
				);
			}
		);
	};
})( jQuery );