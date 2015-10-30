<?php

/**
 * Redux Framework is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * any later version.
 * Redux Framework is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with Redux Framework. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package     ReduxFramework
 * @subpackage  Field_Multi_Text
 * @author      Daniel J Griffiths (Ghost1227)
 * @author      Dovy Paukstys
 * @version     3.0.0
 *
 * This extension was modified for use with the MIXT theme
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) { exit; }


if ( ! class_exists( 'ReduxFramework_mixt_multi_input' ) ) {

	/**
	 * Main ReduxFramework_mixt_multi_input class
	 *
	 * @since       1.0.0
	 */
	class ReduxFramework_mixt_multi_input {

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

			$default_field = function() {
				$default_id    = array('type' => 'multi_text');
				$default_field = array_merge($default_id, $field_defaults);

				return build_field($default_field);
			};
			$this->presets  = ( ! empty( $this->field['default'] ) ) ? $this->field['default'] : $default_field;

			$this->add_text = ( isset( $this->field['add_text'] ) ) ? $this->field['add_text'] : __( 'Add More', 'redux-framework' );
			$this->fields   = ( isset( $this->field['inputs'] ) ) ? $this->field['inputs'] : $this->presets;

			$this->no_title = ( isset($this->field['no_title']) && $this->field['no_title'] === true );
			$this->sortable = ( isset($this->field['sortable']) && $this->field['sortable'] === true );
			$this->sort_icon = ( isset($this->field['sort_icon']) ) ? $this->field['sort_icon'] : 'el-icon-resize-vertical';

			$this->no_ajax = ( isset($this->field['no_ajax']) && $this->field['no_ajax'] === true );

			if ( ! function_exists('build_field') ) {

				/**
				 * Build input
				 *
				 * @param arr $data
				 */
				function build_field( $data ) {

					if ( isset($data['id']) ) {

						global $field_defaults;

						$id       = $data['id'];
						$type     = isset($data['type']) ? $data['type'] : 'text';
						$name     = isset($data['name']) ? $data['name'] : '';
						$val      = isset($data['value']) ? $data['value'] : '';
						$label    = isset($data['label']) ? $data['label'] : '';

						if ( $type == 'divider' ) {
							if ( $label != '' ) {
								$label = '<h3 class="divide-text">' . $label . '</h3>';
							}
							$input = '<div class="multi-input-divide">' . $label . '<input type="hidden" id="' . $id . '" name="' . $name . '" /></div>';
						} else {
							$icon     = isset($data['icon']) ? $data['icon'] : '';
							$ph       = isset($data['placeholder']) ? $data['placeholder'] : '';
							$wrap_cls = isset($data['wrap_class']) ? $data['wrap_class'] : '';
							$inp_cls  = isset($data['input_class']) ? $data['input_class'] : '';

							if ( $icon != '' ) {
								$wrap_cls .= ' has-icon';
								$icon   = '<i class="icon field-icon el ' . $icon . '"></i>';
							}

							if ( $label != '' ) {
								$label = '<small class="label-text">' . $label . '</small>';
							}

							if ( $type == 'group-id' ) {
								$wrap_cls .= ' group-id';
							}

							$input = '<label class="multi-input-field ' . $wrap_cls . '">' . $label . $icon;

							if ( $type == 'text' || $type == 'group-id' ) {
								$input .= '<input type="text" id="' . $id . '" name="' . $name . '" value="' . $val . '" placeholder="' . $ph . '" class="multi-input-text regular-text ' . $inp_cls . '" />';
							} else if ( $type == 'color' ) {
								$input .= '<input type="text" id="' . $id . '" name="' . $name . '" value="' . $val . '" class="multi-input-color wp-colorpicker ' . $inp_cls . '"/>';
							} else if ( $type == 'checkbox' ) {
								$val = $val == '' ? 0 : $val;
								$input .= '<input type="hidden" id="' . $id . '" name="' . $name . '" value="' . $val . '" class="multi-input-checkbox init ' . $inp_cls . '"/>';
							}

							$input .= '</label>';
						}

						return $input;
					}
				}
			}

			// Model Input Array
			$inputs_arr = array();
			foreach ( $this->fields as $field => $input ) {

				$input = wp_parse_args($input, $field_defaults);

				$inputs_arr[$field] = $input;
			}

			// Build Group Elements
			$group_elems = '';
			foreach ($this->fields as $k => $input) {
				$input['id']   = $this->field['name'] . $this->field['name_suffix'] . '[field-id][' . $k . ']';
				$input['name'] = '';

				$group_elems .= build_field($input);
			}

			// Field Controls
			$field_controls = '<br style="clear: both;">';			  
			// Sortable Handle
			if ( $this->sortable ) {
				$field_controls .= '<a href="javascript:void(0);" class="button sort-handle" title="Move Group"><i class="el ' . $this->sort_icon . '"></i></a>';
			}
			$field_controls .= '<a href="javascript:void(0);" class="button red deletion mixt-multi-input-remove">' . __( 'Remove', 'redux-framework' ) . '</a>';

			// PRINT SAVED FIELDS

			$cont_classes = 'mixt-multi-input ';

			if ( $this->no_title ) { $cont_classes .= 'no-title '; }
			if ( $this->sortable ) { $cont_classes .= 'sortable '; }
			if ( $this->no_ajax ) { $cont_classes .= 'no-ajax '; }

			echo '<ul id="' . $this->field['id'] . '-ul" class="' . $cont_classes . '">';

				if ( isset( $this->value ) && is_array( $this->value ) ) {

					// Print Groups
					foreach ( $this->value as $k => $value ) {

						if ( $value == '' || ! is_array($value) ) return;

						$group_fields = '';

						foreach ( $this->fields as $id => $atts ) {
							$saved_field = $inputs_arr[$id];

							$saved_field['id']    = $this->field['name'] . $this->field['name_suffix'] . '[' . $k . '][' . $id . ']';
							$saved_field['name']  = $this->field['name'] . $this->field['name_suffix'] . '[' . $k . '][' . $id . ']';

							if ( array_key_exists($id, $value) ) {
								$saved_field['value'] = $value[$id];
							}
							
							$group_fields .= build_field($saved_field);
						}

						// foreach ( $value as $field => $val ) {
						// 	if ( ! array_key_exists($field, $inputs_arr) ) continue;
						// 	$saved_field = $inputs_arr[$field];

						// 	$saved_field['id']    = $this->field['name'] . $this->field['name_suffix'] . '[' . $k . '][' . $field . ']';
						// 	$saved_field['name']  = $this->field['name'] . $this->field['name_suffix'] . '[' . $k . '][' . $field . ']';
						// 	$saved_field['value'] = $val;
							
						// 	$group_fields .= build_field($saved_field);
						// }

						echo '<li>';
							echo $group_fields;
							echo $field_controls;
						echo '</li>';
					}
				}

				// PRINT MODEL INPUT
				echo '<li class="multi-input-model" style="display:none;">';
					echo $group_elems;
					echo $field_controls;
				echo '</li>';

			echo '</ul>';

			$this->field['add_number'] = ( isset( $this->field['add_number'] ) && is_numeric( $this->field['add_number'] ) ) ? $this->field['add_number'] : 1;

			// Add More Button
			echo '<a href="javascript:void(0);" class="button button-primary mixt-multi-input-add" data-add_number="' . $this->field['add_number'] . '" data-id="' . $this->field['id'] . '-ul" data-name="' . $this->field['name'] . $this->field['name_suffix'] . '[]">' . $this->add_text . '</a><br/>';
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
			wp_enqueue_script(
				'redux-field-mixt-multi-input-js',
				MIXT_PLUGINS_URI . '/redux-extend/extensions/mixt_multi_input/field_mixt_multi_input.js',
				array( 'jquery', 'redux-js' ),
				time(),
				true
			);
		}
	}
}