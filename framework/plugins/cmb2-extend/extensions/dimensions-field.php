<?php

/**
 * Dimensions field type
 * 
 * Author: novalex
 * Author URI: http://novalx.com
 */

class Mixt_Cmb_Dimensions_Field {
	public $version = 1.0;

	public function __construct() {
		add_action( 'cmb2_render_dimensions', array($this, 'render_field'), 10, 5 );
		add_action( 'cmb2_sanitize_dimensions', array($this, 'sanitize_field'), 10, 4 );
	}

	public function render_field( $field, $escaped_value, $object_id, $object_type, $field_type ) {
		$html = '';

		$values = array(
			'width' => ( isset($escaped_value['width']) ) ? $escaped_value['width'] : '',
			'height' => ( isset($escaped_value['height']) ) ? $escaped_value['height'] : '',
			'units' => ( isset($escaped_value['units']) ) ? $escaped_value['units'] : '',
		);

		if ( $field->width() == true ) {
			$html .= $field_type->input( array(
				'type'        => 'text',
				'name'        => $field_type->_name('[width]'),
				'id'          => $field_type->_id('_width'),
				'class'       => 'mixt-dimensions-width regular-text',
				'value'       => $values['width'],
				'placeholder' => __( 'Width', 'mixt' ),
				'desc'        => '',
			) );
		}

		if ( $field->height() == true ) {
			$html .= $field_type->input( array(
				'type'        => 'text',
				'name'        => $field_type->_name('[height]'),
				'id'          => $field_type->_id('_height'),
				'class'       => 'mixt-dimensions-height regular-text',
				'value'       => $values['height'],
				'placeholder' => __( 'Height', 'mixt' ),
				'desc'        => '',
			) );
		}
		
		$units = ( empty( $field->units() ) ) ? array('px') : $field->units();
		$unit_options = '';
		foreach ( $units as $unit ) {
			$args = array(
				'value' => $unit,
				'label' => $unit,
				'checked' => ( $values['units'] == $unit ),
			);
			$unit_options .= $field_type->select_option($args);
		}

		$html .= $field_type->select( array(
			'class'   => 'mixt-dimensions-units cmb2_select',
			'name'    => $field_type->_name('[units]'),
			'id'      => $field_type->_id('_units'),
			'options' => $unit_options,
			'desc'    => '',
		) );

		echo $html;

		$field_type->_desc( true, true );
	}

	public function sanitize_field($override, $value, $object_id, $field_args) {
		if ( ( isset($field_args['width']) && $field_args['width'] == true && empty($value['width']) ) || ( isset($field_args['height']) && $field_args['height'] == true && empty($value['height']) ) ) {
			return 'auto';
		}
		return $value;
	}
}
new Mixt_Cmb_Dimensions_Field;
