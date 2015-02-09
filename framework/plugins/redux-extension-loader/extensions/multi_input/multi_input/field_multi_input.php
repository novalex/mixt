<?php

/* ------------------------------------------------ /
MIXT MULTI INPUT (REPEATER) FIELD
/ ------------------------------------------------ */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) { exit; }


if ( ! class_exists( 'ReduxFramework_multi_input' ) ) {

	/**
	 * Main ReduxFramework_multi_input class
	 *
	 * @since       1.0.0
	 */
	class ReduxFramework_multi_input {

		/**
		 * Field Constructor.
		 * Required - must call the parent constructor, then assign field and value to vars, and obviously call the render field function
		 *
		 * @since       1.0.0
		 * @access      public
		 * @return      void
		 */
		function __construct( $field = array(), $value = '', $parent ) {
			$this->parent = $parent;
			$this->field  = $field;
			$this->value  = $value;
		}

		/**
		 * Field Render Function.
		 * Takes the vars and outputs the HTML for the field in the settings
		 *
		 * @since       1.0.0
		 * @access      public
		 * @return      void
		 */
		public function render() {

			$default_field = function() {
				$default_id    = array('type' => 'multi_text');
				$default_field = array_merge($default_id, $field_defaults);

				return build_input($default_field);
			};
			$this->presets  = ( isset( $this->field['default'] ) ) ? $this->field['default'] : $default_field;

			$this->add_text = ( isset( $this->field['add_text'] ) ) ? $this->field['add_text'] : __( 'Add More', 'redux-framework' );
			$this->fields   = ( isset( $this->field['inputs'] ) ) ? $this->field['inputs'] : $this->presets;

			$field_defaults = array(
				'type'        => 'text',
				'name'        => '',
				'value'       => '',
				'label'       => '',
				'icon'        => '',
				'placeholder' => '',
				'wrap_class'  => '',
				'input_class' => '',
			);

			if ( ! function_exists('build_input') ) {

				/**
				 * Build input
				 *
				 * @param arr $data
				 */
				function build_input( $data ) {

					if ( isset($data['id']) ) {

						global $field_defaults;

						$type     = isset($data['type']) ? $data['type'] : 'text';
						$id       = $data['id'];
						$name     = isset($data['name']) ? $data['name'] : '';
						$val      = isset($data['value']) ? $data['value'] : '';
						$label    = isset($data['label']) ? $data['label'] : '';
						$icon     = isset($data['icon']) ? $data['icon'] : '';
						$ph       = isset($data['placeholder']) ? $data['placeholder'] : '';
						$wrap_cls = isset($data['wrap_class']) ? $data['wrap_class'] : '';
						$inp_cls  = isset($data['input_class']) ? $data['input_class'] : '';

						if ( $icon != '' ) {
							$wrap_cls .= ' has-icon';
							$icon   = '<i class="icon field-icon ' . $icon . '"></i>';
						}

						if ( $label != '' ) {
							$label = '<small class="label-text">' . $label . '</small>';
						}

						$input = '<label class="multi-input-field ' . $wrap_cls . '">' . $label . $icon;

						if ( $type == 'text') {
							$input .= '<input type="text" id="' . $id . '" name="' . $name . '" value="' . $val . '" placeholder="' . $ph . '" class="regular-text ' . $inp_cls . '" />';
						} else if ( $type == 'color' ) {
							if ( isset($data['alpha']) ) {
								$inp_cls .= ' cs-wp-color-picker';
							}
							$input .= '<input type="text" id="' . $id . '" name="' . $name . '" value="' . $val . '" class="multi-input-color wp-colorpicker ' . $inp_cls . '"/>';
						}

						$input .= '</label>';

						return $input;
					}
				}
			}

			$inputs_arr = array();

			// Model Input Array
			foreach ( $this->fields as $field => $input ) {

				$input = wp_parse_args($input, $field_defaults);

				$inputs_arr[$field] = $input;
			}

			$group_elems = '';
			// Build Group Elements
			foreach ($this->fields as $k => $input) {
				$input['id']   = $this->field['name'] . $this->field['name_suffix'] . '[field-id][' . $k . ']';
				$input['name'] = '';

				$group_elems .= build_input($input);
			}

			// PRINT SAVED FIELDS

			echo '<ul id="' . $this->field['id'] . '-ul" class="redux-multi-input">';

				if ( isset( $this->value ) && is_array( $this->value ) ) {

					// Print Groups
					foreach ( $this->value as $k => $value ) {

						if ( $value == '' || !is_array($value) ) {
							return;
						}

						$group_fields = '';

						foreach ( $value as $field => $val ) {
							$saved_field = $inputs_arr[$field];

							$saved_field['id']    = $this->field['name'] . $this->field['name_suffix'] . '[' . $k . '][' . $field . ']';
							$saved_field['name']  = $this->field['name'] . $this->field['name_suffix'] . '[' . $k . '][' . $field . ']';
							$saved_field['value'] = $val;
							
							$group_fields .= build_input($saved_field);
						}

						echo '<li>';
							echo $group_fields;
							echo '<br style="clear: both;">';
							echo '<a href="javascript:void(0);" class="deletion redux-multi-input-remove">' . __( 'Remove', 'redux-framework' ) . '</a>';
						echo '</li>';
					}
				}

				// PRINT MODEL INPUT
				echo '<li class="multi-input-model" style="display:none;">';
					echo $group_elems;
					echo '<br style="clear: both;">';
					echo '<a href="javascript:void(0);" class="deletion redux-multi-input-remove">' . __( 'Remove', 'redux-framework' ) . '</a>';
				echo '</li>';

			echo '</ul>';

			$this->field['add_number'] = ( isset( $this->field['add_number'] ) && is_numeric( $this->field['add_number'] ) ) ? $this->field['add_number'] : 1;

			echo '<a href="javascript:void(0);" class="button button-primary redux-multi-input-add" data-add_number="' . $this->field['add_number'] . '" data-id="' . $this->field['id'] . '-ul" data-name="' . $this->field['name'] . $this->field['name_suffix'] . '[]">' . $this->add_text . '</a><br/>';
		}

		// EMPTY FIELD <input type="text" id="' . $this->field['id'] . '" name="' . $this->field['name'] . $this->field['name_suffix'] . '[]' . '" value="" class="regular-text ' . $this->field['class'] . '" />

		/**
		 * Enqueue Function.
		 * If this field requires any scripts, or css define this function and register/enqueue the scripts/css
		 *
		 * @since       1.0.0
		 * @access      public
		 * @return      void
		 */
		public function enqueue() {

			$file_url = MIXT_PLUGINS_URI . '/redux-extension-loader/extensions/multi_input/multi_input';

			wp_enqueue_script(
				'redux-field-multi-input-js',
				$file_url . '/field_multi_input.js',
				array( 'jquery', 'redux-js' ),
				time(),
				true
			);

			wp_enqueue_style(
				'redux-field-multi-input-css',
				$file_url . '/field_multi_input.css',
				time(),
				true
			);
		}
	}
}