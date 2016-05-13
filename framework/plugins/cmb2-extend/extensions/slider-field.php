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
		$step = $field->step();
		$step = ( empty($step) ) ? 'none' : $step;

		if ( ! is_numeric($min) || ! is_numeric($max) || ! is_numeric($step) ) {
			echo '<p>' . esc_html__( 'The min, max and step values of the slider must be numeric!', 'mixt' ) . '</p>';
		} else {
			$slider_value = ( $escaped_value == 'auto' ) ? ( $max + $min ) / 2 : $escaped_value;

			echo '<div class="mixt-slider"></div>';
			echo mixt_clean( $field_type->input( array(
				'type'         => 'text',
				'class'        => 'mixt-slider-value',
				'value'        => esc_attr($escaped_value),
				'data-value'   => esc_attr($slider_value),
				'data-min'     => esc_attr($min),
				'data-max'     => esc_attr($max),
				'data-step'    => esc_attr($step),
				'data-tooltip' => esc_attr($field->tooltip()),
				'desc'         => '',
			) ), 'strip');
		}

		$field_type->_desc( true, true );
	}
}
new Mixt_Cmb_Slider_Field;
