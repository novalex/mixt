<?php

if ( ! class_exists( 'Mixt_VC_Button' ) ) {
	/**
	 * Class Mixt_VC_Button
	 */
	class Mixt_VC_Button {

		/** @var bool */
		protected $js_appended = false;

		/** @var array */
		protected $settings = array();

		/** @var string */
		protected $value = '';

		/** @var array button colors */
		protected $colors = array();
		/** @var array button sizes */
		protected $sizes = array();

		function __construct() {
			$this->colors = mixt_get_assets('button', 'colors');
			$this->sizes = mixt_get_assets('button', 'sizes');
		}

		/**
		 * @param  null $settings
		 * @return array
		 */
		function settings( $settings = null ) {
			if ( is_array( $settings ) ) {
				$this->settings = $settings;
			}
			return $this->settings;
		}

		/**
		 * @param  $key
		 * @return string
		 */
		function setting( $key ) {
			return isset( $this->settings[ $key ] ) ? $this->settings[ $key ] : '';
		}

		/**
		 * @param  null $value
		 * @return string
		 */
		function value( $value = null ) {
			if ( is_string( $value ) ) {
				$this->value = $value;
			}
			return $this->value;
		}

		/**
		 * @param  null $values
		 * @return array
		 */
		function params( $values = null ) {
			if ( is_array( $values ) ) {
				$this->params = $values;
			}
			return $this->params;
		}

		public function select_options($options, $selected = null) {
			$output = '';
			foreach ( $options as $value => $name ) {
				if ( $value == $selected ) {
					$output .= "<option value='$value' selected>$name</option>";
				} else {
					$output .= "<option value='$value'>$name</option>";
				}
			}
			return $output;
		}

		public function render_fields() {
			$output = '';
			$values = mixt_element_button($this->value(), 'value');

			// Color Select
			$output .= '<div class="vc_col-sm-4"><select class="button-field color-select button-colors" data-attr="color">' .
						   $this->select_options($this->colors, $values['color']) .
					   '</select></div>';

			// Size Select
			$output .= '<div class="vc_col-sm-4"><select class="button-field button-sizes" data-attr="size">' .
						   $this->select_options($this->sizes, $values['size']) .
					   '</select></div>';

			return $output;
		}

		/**
		 * Render the field
		 * 
		 * filter: mixt_button_field_cont
		 * @return mixed|void
		 */
		function render() {
			$output = '<div class="mixt-button-field vc_row">' .
						  '<div class="button-fields-wrap">' . $this->render_fields() . '</div>' .
						  '<input name="' . $this->setting( 'param_name' ) . '" class="wpb_vc_param_value  ' . $this->setting( 'type' ) . '_field" type="hidden" value="' . esc_attr( $this->value() ) . '">' .
					  '</div>';

			if ( ! $this->js_appended ) {
				$output .= '<script type="text/javascript" src="' . MIXT_PLUGINS_URI . '/vc-extend/fields/js/button.js"></script>';
				$this->js_appended = true;
			}

			return apply_filters( 'mixt_button_field_cont', $output );
		}
	}
}

/**
 * @param $settings
 * @param $value
 *
 * @return mixed|void
 */
function mixt_button_form_field( $settings, $value ) {
	$field = new Mixt_VC_Button;
	$field->settings( $settings );
	$field->value( $value );

	return $field->render();
}
add_shortcode_param('button', 'mixt_button_form_field');