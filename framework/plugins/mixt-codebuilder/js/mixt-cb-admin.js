jQuery(document).ready(function() {

	'use strict'; /* jshint unused: false */

	// Redraw the thickbox for new content
	function resizePanel() {
		var	panel = jQuery('#TB_window'),
			content = jQuery('#TB_ajaxContent');

		panel.add(content).css({
			height: 'auto',
			overflow: 'auto'
		});
	}

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
					resizePanel();
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
		var element         = jQuery('.mcb-element-cont'),
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
				elems   = field.find('.row').not('.disabled').find('.mcb-input'),
				content = '';

			attributes = jQuery.map(elems, function(el, index) {
				var input = jQuery(el),
					attr  = input.data('attr'),
					value = input.val();
				if ( input.is('[type="checkbox"]:not(:checked)') ) { value = ''; }
				if ( input.data('encode') === true ) { value = htmlEscape(value); }
				if ( input.data('explode') === true ) { value = value.replace(/\n+/g, ','); }
				if ( attr == 'content' ) {
					content = value;
					return '';
				} else if ( value !== '' ) {
					return attr + '="' + value + '"';
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
		jQuery('#mcb-main-select .el-button').removeClass('active');
		jQuery('#mixt-cb-wrap .panel-body').empty();
	}

	// Clone field from template
	function cloneElement(el) {
		var clone = jQuery(el).find('.mcb-clone-template').clone().removeClass('hidden mcb-clone-template').removeAttr('id').addClass('mcb-cloned');
		jQuery(el).children('.field-repeat').before(clone);
	}

	// Collapse fields
	function collapseFields() {
		jQuery('.field-title.toggle').off().on('click', function(e) {
			if ( jQuery(e.target).is('.mcb-remove') ) {
				jQuery(this).parent('.field').remove();
			} else {
				jQuery(this).siblings('.field-content').slideToggle(400);
			}
		});
	}

	// Field dependencies
	function elementDepends() {
		jQuery('.row.requires').each( function() {
			var row     = jQuery(this),
				reqData = row.data('required').split(','),
				parent  = reqData[0],
				reqType = reqData[1],
				reqVal  = reqData[2].split('|');
			jQuery('.mcb-input[data-attr="' + parent + '"]').on('change init', function() {
				var parentVal = jQuery(this).val();
				if ( reqType == '=' ) {
					if ( jQuery.inArray(parentVal, reqVal) > -1 ) { row.slideDown(400).removeClass('disabled'); }
					else { row.slideUp(300).addClass('disabled'); }
				} else {
					if ( jQuery.inArray(parentVal, reqVal) == -1 ) { row.slideDown(400).removeClass('disabled'); }
					else { row.slideUp(300).addClass('disabled'); }
				}
			}).trigger('init');
		});
	}

	// Media Frame
	function mediaLibrary() {
		var media_frame;

		jQuery('.mcb-media-select').click(function(e) {
			var input = jQuery(this),
				multiple = input.data('multiple') === true ? true : false;
			e.preventDefault();

			if ( media_frame ) {
				media_frame.open();
				return;
			}

			/* global wp */
			media_frame = wp.media({
				title: mixt_cb.media_frame_title,
				multiple: multiple
			});

			media_frame.on('select', function() {
				var media = media_frame.state().get('selection').toJSON(),
					ids   = jQuery.map(media, function(ob) {
						return ob.id;
					});
				input.val(ids.join(','));
			});

			media_frame.open();
		});
	}

	jQuery(document).ready( function($) {
		var panel = $('#mixt-cb-wrap'),
			elButtons = $('#mcb-main-select .el-button'),
			panelBody = panel.children('.panel-body'),
			panelLoad = panel.children('.panel-load');

		panelLoad.hide();

		$('#mcb-add-shortcode').click( function() { addShortcode(); });

		elButtons.click( function() {
			panelLoad.slideDown(400);
			panelBody.slideUp(400);
			$(this).addClass('active').siblings().removeClass('active');

			/* global ajaxurl */
			$.ajax({
				url: ajaxurl,
				data: {
					'action': 'mixtcb_element',
					'mixtcb-key': $(this).children('a').attr('href').replace('#', '')
				},
				method: 'post',
				dataType: 'xml',
				success: function(data) {
					var $data = $(data).find('mixtcb_element response_data').text(),
						html = $.parseHTML($data);

					panelLoad.slideUp(400);
					panelBody.empty().append(html).slideDown(400);

					resizePanel();
					$('.mcb-input').off('change');
					$('.mcb-multi-input').off('click');
					elementDepends();

					panel.find('.field.preset').each( function() {
						if ( $(this).children('.field-title.toggle').length ) {
							$(this).children('.field-content').slideToggle(0);
							collapseFields();
						}
					});

					// Colorpicker
					if ( typeof $.fn.wpColorPicker === 'function' ) { $('.mcb-color').wpColorPicker(); }

					$('.mcb-input.color-select').change( function() {
						var select = $(this),
							selOption = select.children('option:selected');
						select.css({
							'color': selOption.css('color')
						});
					});

					// Clone a set of input fields
					$('.field-repeat').click( function() {
						cloneElement($(this).parent());
						resizePanel();
						$('.mcb-sortable').sortable('refresh');
						collapseFields();
					});

					// Remove a set of input fields
					$('.mcb-remove').click( function() {
						$(this).parent('.field').remove();
					});

					// Make content sortable using the jQuery UI Sortable method
					$('.mcb-sortable').sortable({
						items: '.field:not(".hidden")',
						placeholder: 'mcb-sortable-placeholder'
					});

					// Media Select
					mediaLibrary();

					// Multi input val
					$('.mcb-multi-input').on('click', 'label input', function() {
						var cont = $(this).parents('.mcb-multi-input'),
							main = cont.children('.mcb-input'),
							inputs = cont.find('.mcb-multi-child'),
							value = $.map(inputs, function(el) {
								var $el = $(el);
								if ( $el.is('.mcb-checkbox') ) {
									return $el.is(':checked') ? $el.val() : '';
								} else {
									return $el.val();
								}
							});
						main.val($.grep(value, Boolean).join(','));
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