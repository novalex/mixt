<?php

/**
 * Visual Composer Extend
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access

function mixt_vc_extend() {

	// Flip Card
	vc_map( array(
		'name'        => __( 'Flip Card', 'mixt' ),
		'description' => __( 'Two sided card that flips', 'mixt' ),
		'base'        => 'mixt_flipcard',
		'icon'        => 'mixt_flipcard',
		'category'    => __( 'MIXT', 'mixt' ),
		'as_parent'   => array('except' => 'flipcard'),
		'js_view'     => 'VcColumnView',
		'params'      => array(
			array(
				'type'        => 'textarea_html',
				'heading'     => __( 'Back Side', 'mixt' ),
				'description' => __( 'Content for the back of the card', 'mixt' ),
				'param_name'  => 'back',
				'value'       => __( 'Flip Card Back Side', 'mixt' ),
			),
			array(
				'type'        => 'dropdown',
				'heading'     => __( 'Direction', 'mixt' ),
				'description' => __( 'Direction of the card flip', 'mixt' ),
				'param_name'  => 'dir',
				'admin_label' => true,
				'value'       => array(
					__( 'Vertical', 'mixt' )   => 'vertical',
					__( 'Horizontal', 'mixt' ) => 'horizontal',
				),
			),
		)
	));

	// Row Columns Match Height
	$cols_matchheight = array(
		'type'       => 'dropdown',
		'heading'    => 'Match Columns Height',
		'param_name' => 'cols_matchheight',
		'value'      => array(
			__( 'No', 'mixt' )  => false,
			__( 'Yes', 'mixt' ) => true,
		)
	);
	vc_add_param( 'vc_row', $cols_matchheight );
	vc_add_param( 'vc_row_inner', $cols_matchheight );
}
add_action( 'vc_before_init', 'mixt_vc_extend' );

if ( class_exists( 'WPBakeryShortCodesContainer' ) ) {
    class WPBakeryShortCode_Flipcard extends WPBakeryShortCodesContainer {
    }
}