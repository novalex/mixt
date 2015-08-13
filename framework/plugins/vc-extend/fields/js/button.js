
// MIXT Button Field Script

'use strict';
/* global _, Backbone */
/* jshint unused: false */

var vc = { atts: {} };

if ( ! _.isUndefined( window.vc ) ) {
	vc = window.vc;	
}

( function($) {
	/**
	 * Button view
	 * @type {*}
	 */
	var MixtButton = vc.Button = Backbone.View.extend( {
		fields: {},
		save: function() {
			var value = $.map(this.fields, function(el) {
					var $el = $(el),
						val = $el.val();
					if ( ! _.isEmpty($el.data('attr')) && val !== '' ) {
						val = $el.data('attr') + ':' + val;
					}
					return val;
				});
			return $.grep(value, Boolean).join(',');
		},
	} );


	/**
	 * Add new param to atts types list for vc
	 * @type {Object}
	 */
	vc.atts.button = {
		init: function(param, $field) {
			$('.mixt-button-field', this.content() ).each( function() {
				var cont   = $(this),
					fields = cont.find('.button-field'),
					$param = cont.find('.wpb_vc_param_value[name="'+param.param_name+'"]'),
					value  = $param.val(),
					button = new MixtButton();

				button.fields = fields;

				$param.data('vcFieldManager', button );
			});
		},
		parse: function(param) {
			var field  = this.content().find('.wpb_vc_param_value[name="'+param.param_name+'"]'),
				button = field.data('vcFieldManager'),
				result = button.save();

			return result;
		}
	};

})( window.jQuery );