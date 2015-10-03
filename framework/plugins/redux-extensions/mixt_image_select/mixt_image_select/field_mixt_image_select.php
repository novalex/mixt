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
 * @subpackage  Field_Images
 * @author      Daniel J Griffiths (Ghost1227)
 * @author      Dovy Paukstys
 * @version     3.0.0
 *
 * This extension was modified for use with the MIXT theme
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) { exit; }

// Don't duplicate me!
if ( ! class_exists( 'ReduxFramework_mixt_image_select' ) ) {

	/**
	 * Main ReduxFramework_mixt_image_select class
	 *
	 * @since       1.0.0
	 */
	class ReduxFramework_mixt_image_select {

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

			$allow_empty = false;

			if ( isset($this->field['empty']) && $this->field['empty'] === true ) {
				$allow_empty = true;

				$select_none = array(
					0 => array(
						'alt' => 'No Image',
						'img' => MIXT_URI . '/assets/img/icons/none.png',
					),
				);
				$this->field['options'] = array_merge($select_none, $this->field['options']);
			}

			if ( ! empty( $this->field['options'] ) ) {
				echo '<div class="redux-table-container">';
				echo '<ul class="redux-mixt-image-select">';

				$x = 1;

				foreach ( $this->field['options'] as $k => $v ) {

					if ( ! is_array( $v ) ) {
						$v = array( 'img' => $v );
					}

					if ( ! isset( $v['title'] ) ) {
						$v['title'] = '';
					}

					if ( ! isset( $v['alt'] ) ) {
						$v['alt'] = $v['title'];
					}

					$style = '';

					if ( ! empty( $this->field['width'] ) ) {
						$style .= 'width: ' . $this->field['width'];
						if ( is_numeric( $this->field['width'] ) ) { $style .= 'px'; }
						$style .= ';';
					} else {
						$style .= " width: 100%; ";
					}

					if ( ! empty( $this->field['height'] ) ) {
						$style .= 'height: ' . $this->field['height'];
						if ( is_numeric( $this->field['height'] ) ) { $style .= 'px'; }
						$style .= ';';
					}

					if ( $allow_empty && $k == 0 ) {
						$theValue = 0;
						$input_val = 0;
					} else {
						$theValue = $v['img'];
						$input_val = $v['img'];
					}
					$selected = ( checked( $this->value, $theValue, false ) != '' ) ? ' redux-mixt-image-select-selected' : '';

					echo '<li class="redux-mixt-image-select">';
					echo '<label class="' . $selected . ' redux-mixt-image-select' . $this->field['id'] . '_' . $x . '" for="' . $this->field['id'] . '_' . ( array_search( $k, array_keys( $this->field['options'] ) ) + 1 ) . '">';

					echo '<input type="radio" class="' . $this->field['class'] . '" id="' . $this->field['id'] . '_' . ( array_search( $k, array_keys( $this->field['options'] ) ) + 1 ) . '" name="' . $this->field['name'] . $this->field['name_suffix'] . '" value="' . $input_val . '" ' . checked( $this->value, $theValue, false ) . '/>';
					if ( ! empty( $this->field['tiles'] ) && $this->field['tiles'] == true ) {
						echo '<span class="tiles" style="background-image: url(' . $v['img'] . ');" rel="' . $v['img'] . '"">&nbsp;</span>';
					} else {
						echo '<img src="' . $v['img'] . '" alt="' . $v['alt'] . '" title="' . $v['alt'] . '" style="' . $style . '" />';
					}

					if ( $v['title'] != '' ) {
						echo '<br /><span>' . $v['title'] . '</span>';
					}

					echo '</label>';
					echo '</li>';

					$x ++;
				}

				echo '</ul>';
				echo '</div>';
			}
		}

		/**
		 * Enqueue Function.
		 * If this field requires any scripts, or css define this function and register/enqueue the scripts/css
		 *
		 * @since       1.0.0
		 * @access      public
		 * @return      void
		 */
		public function enqueue() {

			$file_url = MIXT_PLUGINS_URI . '/redux-extensions/mixt_image_select/mixt_image_select';

			wp_enqueue_script(
				'redux-field-mixt-image-select-js',
				$file_url . '/field_mixt_image_select' . Redux_Functions::isMin() . '.js',
				array( 'jquery', 'redux-js' ),
				time(),
				true
			);
		}

		public function getCSS( $mode = '' ) {
			$css   = '';
			$value = $this->value;

			$output = '';
			if ( ! empty( $value ) && ! is_array($value) ) {
				switch ( $mode ) {
					case 'background-image':
						$output = "background-image: url('" . $value . "');";
						break;

					default:
						$output = $mode . ": " . $value . ";";
				}
			}

			$css .= $output;

			return $css;
		}

		public function output() {
			$mode = ( isset( $this->field['mode'] ) && ! empty( $this->field['mode'] ) ? $this->field['mode'] : 'background-image' );

			if ( ( ! isset( $this->field['output'] ) || ! is_array( $this->field['output'] ) ) && ( ! isset( $this->field['compiler'] ) ) ) {
				return;
			}

			$style = $this->getCSS( $mode );

			if ( ! empty( $style ) ) {

				if ( ! empty( $this->field['output'] ) && is_array( $this->field['output'] ) ) {
					$keys  = implode( ",", $this->field['output'] );
					$style = $keys . "{" . $style . '}';
					$this->parent->outputCSS .= $style;
				}

				if ( ! empty( $this->field['compiler'] ) && is_array( $this->field['compiler'] ) ) {
					$keys  = implode( ",", $this->field['compiler'] );
					$style = $keys . "{" . $style . '}';
					$this->parent->compilerCSS .= $style;
				}
			}
		}
	}
}
