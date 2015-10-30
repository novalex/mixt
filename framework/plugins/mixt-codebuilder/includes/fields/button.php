<?php

/**
 * CodeBuilder Button Field
 *
 * @package MIXT\Plugins\CodeBuilder
 */

if ( ! class_exists( 'Mixt_CB_Button' ) ) {
	class Mixt_CB_Button {

		/** @var array Field params */
		protected $param = array();
		/** @var array Button colors */
		protected $colors = array();
		/** @var array Button sizes */
		protected $sizes = array();
		/** @var array Button styles */
		protected $styles = array();

		public function __construct() {
			$this->colors = mixt_get_assets('colors', 'buttons');
			$this->sizes = mixt_get_assets('button', 'sizes');

			add_action('mixtcb_load', array($this, 'cb_add_field'));
		}

		public function cb_add_field() {
			mixtcb_field('button', array($this, 'render'));
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
			$values = mixt_element_button($this->param['std'], 'value');

			// Color Select
			$output .= '<div class="col-sm-4"><select class="mcb-child-input color-select button-colors" data-child-attr="color">' .
						   $this->select_options($this->colors, $values['color']) .
					   '</select></div>';

			// Size Select
			$output .= '<div class="col-sm-4"><select class="mcb-child-input button-sizes" data-child-attr="size">' .
						   $this->select_options($this->sizes, $values['size']) .
					   '</select></div>';

			return $output;
		}

		public function render($param) {
			$this->param = $param;
			$output = '<div class="cb-button-field mcb-multi-input">' .
						  $this->render_fields() .
						  '<input type="hidden" class="mcb-input" data-attr="'.$param['key'].'" value="'.$param['std'].'">' .
					  '</div>';
			return $output;
		}
	}
}
new Mixt_CB_Button;
