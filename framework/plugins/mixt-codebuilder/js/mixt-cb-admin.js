jQuery(document).ready(function() {

	'use strict'; /* jshint unused: false */

	(function() {
		/* global tinymce, mixt_cb */
		tinymce.PluginManager.add('mixt_cb', function( editor ) {
			editor.addButton( 'mixt_cb_button', {
				title: mixt_cb.button_title,
				type: 'button',
				image: mixt_cb.dir + '/img/icon.png',
				onclick: function() {
					jQuery('#mixt-cb-trigger').click();
					jQuery('#TB_window').addClass('mixt-cb-panel');
				}
			});
		});
	})();

	function htmlEscape(str) {
		return String(str)
				.replace(/&/g, '&amp;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#39;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');
	}

	function addShortcode() {
		var select          = jQuery('#mcb-main-select').val(),
			element         = jQuery('#' + select),
			template        = element.data('shortcode-template'),
			childTemplate   = element.data('shortcode-child-template'),
			fields          = element.find('.field').not('.mcb-clone-template'),
			attributes      = '',
			childContent    = '',
			contentToEditor = '';

		/* jshint -W083 */
		for ( var i = 0; i < fields.length; i++ ) {
			var field   = jQuery(fields[i]),
				isChild = field.hasClass('child-field'),
				elems   = field.find('.mcb-input'),
				content = '';

			attributes = jQuery.map(elems, function(el, index) {
				var input = jQuery(el),
					value = input.val();
				if ( input.attr('id') == 'content' ) {
					content = value;
					if ( input.attr('data-encode') == 1 ) { content = htmlEscape(content); }
					return '';
				} else if ( value !== '' ) {
					return input.attr('id') + '="' + value + '"';
				}
			});
			attributes = attributes.join(' ').trim();

			if ( isChild && childTemplate ) {
				childContent += childTemplate.replace('{{attributes}}', attributes).replace('{{content}}', content);
			} else {
				contentToEditor += template.replace('{{attributes}}', attributes).replace('{{content}}', content);
			}
		}

		// Insert built content into the parent template
		if ( childTemplate ) {
			contentToEditor = contentToEditor.replace('{{nested}}', childContent);
		}

		// Send the shortcode to the content editor and reset the fields
		window.send_to_editor( contentToEditor );
		resetPanel();
	}

	// Set the inputs to empty state
	function resetPanel() {
		jQuery('#mcb-main-select').val(0);
		jQuery('#mixt-cb-wrap .panel-body').empty();
	}

	// Function to redraw the thickbox for new content
	function resizePanel() {
		var	panel = jQuery('#TB_window'),
			content = jQuery('#TB_ajaxContent');

		panel.add(content).css({
			height: 'auto',
			overflow: 'auto'
		});
	}

	// Simple function to clone an included template
	function cloneElement(el) {
		var clone = jQuery(el).find('.mcb-clone-template').clone().removeClass('hidden mcb-clone-template').removeAttr('id').addClass('mcb-cloned');
		jQuery(el).children('.field-repeat').before(clone);
	}

	// Collapse Fields
	function collapseFields() {
		jQuery('.field-title.toggle').off().on('click', function(e) {
			if ( jQuery(e.target).is('.mcb-remove') ) {
				jQuery(this).parent('.field').remove();
			} else {
				jQuery(this).siblings('.field-content').slideToggle(400);
			}
		});
	}

	jQuery(document).ready( function($) {
		var panel = $('#mixt-cb-wrap'),
			mainSelect = $('#mcb-main-select'),
			panelBody  = panel.children('.panel-body'),
			panelLoad  = panel.children('.panel-load');

		panelLoad.hide();

		$('#mcb-add-shortcode').click( function() { addShortcode(); });

		mainSelect.change( function() {
			panelLoad.slideDown(400);
			panelBody.slideUp(400);

			/* global ajaxurl */
			$.ajax({
				url: ajaxurl,
				data: {
					'action': 'mixtcb_element',
					'mixtcb-key': mainSelect.val()
				},
				method: 'post',
				dataType: 'xml',
				success: function(data) {
					var $data = $(data).find('mixtcb_element response_data').text(),
						html = $.parseHTML($data);

					panelLoad.slideUp(400);
					panelBody.empty().append(html).slideDown(400);

					resizePanel();

					panel.find('.field.preset').each( function() {
						if ( $(this).children('.field-title.toggle').length ) {
							$(this).children('.field-content').slideToggle(0);
							collapseFields();
						}
					});

					if ( typeof $.fn.wpColorPicker === 'function' ) {
						$('.mcb-color').wpColorPicker();
					}

					$('.mcb-input.color-select').on('change', function() {
						var select = $(this),
							selOption = select.children('option:selected');
						select.css({
							'color': selOption.css('color')
						});
					});

					// Clone a set of input fields
					$('.field-repeat').on('click', function() {
						cloneElement($(this).parent());
						resizePanel();
						$('.mcb-sortable').sortable('refresh');
						collapseFields();
					});

					// Remove a set of input fields
					$('.mcb-remove').on('click', function() {
						$(this).parent('.field').remove();
					});

					// Make content sortable using the jQuery UI Sortable method
					$('.mcb-sortable').sortable({
						items: '.field:not(".hidden")',
						placeholder: 'mcb-sortable-placeholder'
					});
				},
				error: function(data) {
					panelLoad.slideUp(400);
					panelBody.empty().append('<p class="error">An error occurred! <br><strong>' + data.status + ' ' + data.statusText + '</strong></p>').slideDown(400);
					console.log(data);
				}
			});
		});
	});

});