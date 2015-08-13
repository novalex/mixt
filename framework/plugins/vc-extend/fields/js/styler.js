
// MIXT Styler Field Script

'use strict';
/* global _, Backbone */
/* jshint unused: false */

var vc = { atts: {} };

if ( ! _.isUndefined( window.vc ) ) {
	vc = window.vc;	
}

/**
 * Generate a unique ID
 * Based on http://stackoverflow.com/a/1349426
 */
function makeid() {
	var text  = '',
	chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for ( var i = 0; i < 7; i++ ) text += chars.charAt(Math.floor(Math.random() * chars.length));

	return text;
}

( function($) {
	/**
	 * Styler view
	 * @type {*}
	 */
	var MixtStyler = vc.Styler = Backbone.View.extend( {
		attrs: {},
		events: {},
		values: {},
		fields: {},
		parser: '',
		initialize: function() {
		},
		render: function(value) {
			if ( _.isString(value) && ! _.isEmpty(value) ) {
				this.values = this.parse(value);
				this.setFields(this.values);
			}
			return this;
		},
		parse: function(value) {
			if ( _.isEmpty(value) ) return;

			var values = {},
				rules  = value.split('|');
			_.each( rules, function(rule) {
				var matches  = rule.match(/(\.styler-.*?\s)?\.(.+?){(.*?)}/),
					selector = ( _.isEmpty(matches[1]) ) ? '&' : matches[2],
					props_s  = matches[3].split(';'),
					props    = {};

				_.each( props_s, function(prop) {
					if ( ! _.isEmpty(prop) ) {
						var matches = prop.match(/(.*?):(.*)/);
						props[matches[1]] = matches[2].trim();
					}
				});

				if ( _.isUndefined(values[selector]) ) { values[selector] = {}; }
				$.extend(values[selector], props);
			});

			return values;
		},
		setFields: function(values) {
			_.each( this.fields, function(field) {
				var $field   = $(field),
					value    = '',
					selector = $field.data('selector'),
					pattern  = $field.data('pattern'),
					prop     = '';

				selector = ( _.isEmpty(selector) ) ? '&' : selector.replace(/[\.#:]/, '');
				// Custom CSS Field
				if ( _.isEmpty(pattern) ) {
					if ( ! _.isUndefined(values[selector]) ) {
						_.each( values[selector], function(prop_val, prop) {
							value += prop + ': ' + prop_val + '; ';
						});
					}
				// Other Fields
				} else {
					prop = pattern.match(/(.*?):(?:.*)/)[1];
					if ( _.isEmpty(values[selector]) || _.isEmpty(values[selector][prop]) ) {
						value = '';
					} else {
						value = values[selector][prop];
						delete values[selector][prop];
					}
				}
				$field.val(value);
			});
		},
		getFields: function() {
			var data = [];
			_.each( this.fields, function(field) {
				var $field = $(field),
					atts   = {
						val:      $field.val().trim(),
						name:     $field.attr('name'),
						selector: $field.data('selector'),
						pattern:  $field.data('pattern'),
					};
				atts.val.length && data.push(atts);
			}, this );
			this.attrs = data;
		},
		save: function() {
			var css = '',
				props = '',
				selectors = {};
			this.attrs = {};
			this.getFields();
			
			if ( ! _.isEmpty(this.attrs) ) {
				var rule = 'styler-' + makeid();

				_.each( this.attrs, function(att) {
					var prop = ( _.isEmpty(att.pattern) ) ? att.val : att.pattern.replace(/{{val}}/g, att.val) + ';';
					if ( _.isEmpty(att.selector) ) {
						props += prop;
					} else {
						if ( _.isUndefined(selectors[att.selector]) ) {
							selectors[att.selector] = prop;
						} else {
							selectors[att.selector] = selectors[att.selector] + prop;
						}
					}
				} );

				if ( ! _.isEmpty(props) ) css += '.'+rule + '{' + props + '}';

				if ( ! _.isEmpty(selectors) ) {
					_.each( selectors, function(props, selector) {
						if ( ! _.isEmpty(css) ) css += '|';
						css += '.'+rule + ' ' + selector + '{' + props + '}';
					});
				}
			}

			return css;
		},
		injectCss: function(css) {
			var $head = $('#vc_inline-frame').length ? $('#vc_inline-frame').contents().find('head') : $('head');

			$head.children('[data-id="mixt-styler-css"]').remove();
			if ( this.parser === '' ) {
				css = css.replace(/\|/g, '').replace(/;/g, ' !important;');
				$head.append($('<style type="text/css" data-id="mixt-styler-css">' + css + '</style>'));
			} else {
				/* global ajaxurl */
				jQuery.post(
					ajaxurl, { 'action': this.parser, 'data': css }, 
					function(response) {
						css = JSON.parse(response);
						$head.append($('<style type="text/css" data-id="mixt-styler-css">' + css + '</style>'));
					}
				);
			}
		},
	} );


	/**
	 * Add new param to atts types list for vc
	 * @type {Object}
	 */
	vc.atts.styler = {
		parse: function(param) {
			var field  = this.content().find('.wpb_vc_param_value[name="'+param.param_name+'"]'),
				styler = field.data('vcFieldManager'),
				result = styler.save();

			if ( ! _.isEmpty(result) ) styler.injectCss(result);

			return result;
		},
		init: function(param, $field) {
			$('.mixt-styler', this.content() ).each( function() {
				var cont   = $(this),
					fields = cont.find('.styler-field'),
					$param = cont.find('.wpb_vc_param_value[name="'+param.param_name+'"]'),
					value  = $param.val(),
					styler = new MixtStyler({ el: cont });

				styler.fields = fields;
				styler.parser = cont.data('parser');

				$param.data('vcFieldManager', styler.render(value) );
			});
			if ( typeof $.fn.wpColorPicker === 'function' ) { $('.styler-colorpicker').wpColorPicker(); }
		}
	};

})( window.jQuery );