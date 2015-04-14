/* global redux_change, redux */

(function( $ ) {

	'use strict';

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
				input.wpColorPicker();
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

		// (function(e,t,n,r){"use strict";if(typeof Color.fn.toString!==r){Color.fn.toString=function(){if(this._alpha<1){return this.toCSS("rgba",this._alpha).replace(/\s+/g,"")}var e=parseInt(this._color,10).toString(16);if(this.error){return""}if(e.length<6){for(var t=6-e.length-1;t>=0;t--){e="0"+e}}return"#"+e}}e.cs_ParseColorValue=function(e){var t=e.replace(/\s+/g,""),n=t.indexOf("rgba")!==-1?parseFloat(t.replace(/^.*,(.+)\)/,"$1")*100):100,r=n<100?true:false;return{value:t,alpha:n,rgba:r}};e.fn.cs_wpColorPicker=function(){return this.each(function(){var t=e(this);if(t.data("rgba")!==false){var n=e.cs_ParseColorValue(t.val());t.wpColorPicker({change:function(e,n){t.closest(".wp-picker-container").find(".cs-alpha-slider-offset").css("background-color",n.color.toString());t.trigger("keyup")},create:function(r,i){var s=t.data("a8cIris"),o=t.closest(".wp-picker-container"),u=e('<div class="cs-alpha-wrap">'+'<div class="cs-alpha-slider"></div>'+'<div class="cs-alpha-slider-offset"></div>'+'<div class="cs-alpha-text"></div>'+"</div>").appendTo(o.find(".wp-picker-holder")),a=u.find(".cs-alpha-slider"),f=u.find(".cs-alpha-text"),l=u.find(".cs-alpha-slider-offset");a.slider({slide:function(e,n){var r=parseFloat(n.value/100);s._color._alpha=r;t.wpColorPicker("color",s._color.toString());f.text(r<1?r:"")},create:function(){var r=parseFloat(n.alpha/100),i=r<1?r:"";f.text(i);l.css("background-color",n.value);o.on("click",".wp-picker-clear",function(){s._color._alpha=1;f.text("");a.slider("option","value",100).trigger("slide")});o.on("click",".wp-picker-default",function(){var n=e.cs_ParseColorValue(t.data("default-color")),r=parseFloat(n.alpha/100),i=r<1?r:"";s._color._alpha=r;f.text(i);a.slider("option","value",n.alpha).trigger("slide")});o.on("click",".wp-color-result",function(){u.toggle()});e("body").on("click.wpcolorpicker",function(){u.hide()})},value:n.alpha,step:1,min:1,max:100})}})}else{t.wpColorPicker({change:function(){t.trigger("keyup")}})}})};e(n).ready(function(){e(".cs-wp-color-picker").cs_wpColorPicker()})})(jQuery,window,document);
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