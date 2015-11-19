<?php

if ( ! class_exists( 'Mixt_VC_Styler' ) ) {
	/**
	 * Class Mixt_VC_Styler
	 */
	class Mixt_VC_Styler {

		/** @var bool */
		protected $js_appended = false;

		/** @var array */
		protected $settings = array();

		/** @var string */
		protected $value = '';

		/** @var array */
		protected $fields = array();

		function __construct() {
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

		function fields( $fields ) {
			if ( is_array( $fields ) ) {
				$this->fields = $fields;
			}
			return $this->fields;
		}

		/**
		 * Render the field
		 * 
		 * filter: mixt_styler_cont
		 * @return mixed|void
		 */
		function render() {
			$output = '<div class="mixt-styler vc_row" data-parser="'.$this->setting('parser').'">' .
						  '<div class="styler-fields-wrap">'.$this->render_fields().'</div>' .
						  '<input name="'.$this->setting('param_name').'" class="wpb_vc_param_value '.$this->setting('type').'_field" type="hidden" value="'.esc_attr( $this->value() ).'">' .
					  '</div>';

			if ( ! $this->js_appended ) {
				$output .= '<script type="text/javascript" src="' . MIXT_PLUGINS_URI . '/vc-extend/fields/js/styler.js"></script>';
				$this->js_appended = true;
			}

			return apply_filters( 'mixt_styler_cont', $output );
		}

		/**
		 * Render the styler fields
		 */
		function render_fields() {
			$output = '';
			$fields = array();
			$grouped = false;
			$default_group = __( 'General', 'mixt' );
			$defaults = array(
				'type'     => 'color',
				'selector' => '',
				'label'    => '',
				'pattern'  => '',
				'value'    => '',
				'group'    => $default_group,
				'class'    => '',
				'cols'     => 12,
			);

			foreach ( $this->fields as $field ) {
				if ( array_key_exists('group', $field) ) {
					$grouped = true;
					break;
				}
			}

			foreach ( $this->fields as $id => $params ) {
				extract( wp_parse_args($params, $defaults) );

				$field_class = 'styler-field-cont vc_column vc_col-sm-' . (string)$cols;
				if ( $class != '' ) $field_class .= ' ' . $class;

				$field = '<div id="styler-'.$id.'" class="'.$field_class.'">';
					if ( $label != '' ) $field .= '<label>'.$label.'</label>';
					if ( $type == 'custom' ) $pattern = '';
					$data_atts = "data-selector='$selector' data-pattern='$pattern'";
				switch ( $type ) {
					case 'color':
						$field .= '<input type="text" name="'.$id.'" value="'.$value.'" '.$data_atts.' class="styler-field styler-colorpicker">';
						break;
					case 'unit':
						$field .= '<input type="text" name="'.$id.'" value="'.$value.'" '.$data_atts.' class="styler-field styler-unit" pattern="^(auto|0)$|^[+-]?[0-9]+.?([0-9]+)?(px|em|ex|%|in|cm|mm|pt|pc)$">';
						break;
					case 'custom':
						$field .= '<textarea name="'.$id.'" '.$data_atts.' class=" styler-field styler-custom">'.$value.'</textarea>';
						break;
				}
				$field .= '</div>';

				if ( $group != $default_group || $grouped ) {
					if ( ! array_key_exists($group, $fields) ) {
						$fields[$group] = array( 'label' => '<label class="wpb_element_label vc_col-sm-12 vc_column group-label">'.$group.'</label>' );
					}
					$fields[$group][] = $field;
				} else {
					$fields[] = $field;
				}
			}
			if ( $grouped ) {
				foreach ( $fields as $group ) $output .= implode($group, '');
			} else {
				foreach ( $fields as $field ) $output .= $field;
			}
			return $output;
		}
	}
}

/**
 * @param $settings
 * @param $value
 *
 * @return mixed|void
 */
function mixt_styler_form_field( $settings, $value ) {
	$styler = new Mixt_VC_Styler;
	$styler->settings( $settings );
	$styler->fields( $settings['fields'] );
	$styler->value( $value );

	return $styler->render();
}
vc_add_shortcode_param('styler', 'mixt_styler_form_field');