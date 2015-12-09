<?php

/**
 * Tab field type
 * 
 * Author: novalex
 * Author URI: http://novalx.com
 */

class Mixt_Cmb_Slider_Field {
	public $version = 1.0;

	public function __construct() {
		add_action( 'cmb2_render_slider', array($this, 'render_field'), 10, 5 );
	}

	public function render_field( $field, $escaped_value, $object_id, $object_type, $field_type ) {
		$min = $field->min();
		$max = $field->max();
		$step = ( empty($field->step()) ) ? 'none' : $field->step();

		if ( ! is_numeric($min) || ! is_numeric($max) || ! is_numeric($step) ) {
			echo '<p>' . __( 'The min, max and step values of the slider must be numeric!', 'mixt' ) . '</p>';
		} else {
			$slider_value = ( $escaped_value == 'auto' ) ? ( $max + $min ) / 2 : $escaped_value;

			echo '<div class="mixt-slider"></div>';
			echo $field_type->input( array(
				'type'         => 'text',
				'class'        => 'mixt-slider-value',
				'value'        => $escaped_value,
				'data-value'   => $slider_value,
				'data-min'     => $min,
				'data-max'     => $max,
				'data-step'    => $step,
				'data-tooltip' => $field->tooltip(),
				'desc'         => '',
			) );
		}

		$field_type->_desc( true, true );
	}
}
new Mixt_Cmb_Slider_Field;
