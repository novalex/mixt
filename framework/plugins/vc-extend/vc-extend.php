<?php

/**
 * Visual Composer Extend
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access

function mixt_vc_extend() {

	$extra_class_field = array(
		'type'        => 'textfield',
		'heading'     => __( 'Extra Classes', 'mixt' ),
		'param_name'  => 'class',
	);

	$colors = array(
		__( 'Auto', 'js_composer' )        => 'color-auto',
		__( 'Blue', 'js_composer' )        => 'blue',
		__( 'Turquoise', 'js_composer' )   => 'turquoise',
		__( 'Pink', 'js_composer' )        => 'pink',
		__( 'Violet', 'js_composer' )      => 'violet',
		__( 'Peacoc', 'js_composer' )      => 'peacoc',
		__( 'Chino', 'js_composer' )       => 'chino',
		__( 'Mulled Wine', 'js_composer' ) => 'mulled-wine',
		__( 'Vista Blue', 'js_composer' )  => 'vista-blue',
		__( 'Black', 'js_composer' )       => 'black',
		__( 'Grey', 'js_composer' )        => 'grey',
		__( 'Orange', 'js_composer' )      => 'orange',
		__( 'Sky', 'js_composer' )         => 'sky',
		__( 'Green', 'js_composer' )       => 'green',
		__( 'Juicy pink', 'js_composer' )  => 'juicy-pink',
		__( 'Sandy brown', 'js_composer' ) => 'sandy-brown',
		__( 'Purple', 'js_composer' )      => 'purple',
		__( 'White', 'js_composer' )       => 'white'
	);

	// Headline
	vc_map( array(
		'name'        => __( 'Headline', 'mixt' ),
		'description' => __( 'Heading with lines on the side', 'mixt' ),
		'base'        => 'mixt_headline',
		'icon'        => 'mixt_headline',
		'category'    => __( 'MIXT', 'mixt' ),
		'params'      => array(
			array(
				'type'        => 'textfield',
				'heading'     => __( 'Text', 'mixt' ),
				'description' => __( 'Heading text', 'mixt' ),
				'param_name'  => 'text',
				'admin_label' => true,
			),
			array(
				'type'        => 'dropdown',
				'heading'     => __( 'Align', 'mixt' ),
				'description' => __( 'Heading alignment', 'mixt' ),
				'param_name'  => 'align',
				'value'       => array(
					__( 'Left', 'mixt' )   => 'left',
					__( 'Center', 'mixt' ) => 'center',
					__( 'Right', 'mixt' )  => 'right',
				),
			),
			array(
				'type'        => 'dropdown',
				'heading'     => __( 'Tag', 'mixt' ),
				'description' => __( 'Heading tag', 'mixt' ),
				'param_name'  => 'tag',
				'value'       => array(
					'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
				),
			),
			array(
				'type'        => 'dropdown',
				'heading'     => __( 'Line Style', 'mixt' ),
				'param_name'  => 'style',
				'value'       => array(
					__( 'Solid', 'mixt' )  => 'solid',
					__( 'Dashed', 'mixt' ) => 'dashed',
					__( 'Dotted', 'mixt' ) => 'dotted',
					__( 'Double', 'mixt' ) => 'double',
				),
			),
			array(
				'type'               => 'dropdown',
				'heading'            => __( 'Color', 'js_composer' ),
				'param_name'         => 'color',
				'value'              => array_merge( $colors, array( __( 'Custom color', 'js_composer' ) => 'custom' ) ),
				'std'                => 'grey',
				'param_holder_class' => 'vc_colored-dropdown',
			),
			array(
				'type'       => 'colorpicker',
				'heading'    => __( 'Custom Color', 'js_composer' ),
				'param_name' => 'color_custom',
				'dependency' => array(
					'element' => 'color',
					'value'   => array( 'custom' ),
				),
			),
			$extra_class_field,
		),
	));


	// Form
	vc_map( array(
		'name'        => __( 'Form', 'mixt' ),
		'description' => __( 'A form with custom fields', 'mixt' ),
		'base'        => 'mixt_form',
		'icon'        => 'mixt_form',
		'category'    => __( 'MIXT', 'mixt' ),
		'params'      => array(
			array(
				'type'        => 'textfield',
				'heading'     => __( 'Email Address', 'mixt' ),
				'description' => __( 'Address to send the message to', 'mixt' ),
				'param_name'  => 'address',
				'value'       => get_option('admin_email'),
			),
			array(
				'type'        => 'dropdown',
				'heading'     => __( 'Label Position', 'mixt' ),
				'param_name'  => 'labels',
				'value'       => array(
					__( 'Top', 'mixt' )  => 'top',
					__( 'Left', 'mixt' ) => 'left',
				),
			),
			array(
				'type'        => 'textfield',
				'heading'     => __( 'Button Text', 'mixt' ),
				'description' => __( 'Text on the submit button', 'mixt' ),
				'param_name'  => 'btn_text',
			),
			array(
				'type'        => 'textfield',
				'heading'     => __( 'Form Action', 'mixt' ),
				'description' => __( 'Set a custom action for the form', 'mixt' ),
				'param_name'  => 'action',
			),
			$extra_class_field,
		),
	));


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
			$extra_class_field,
		),
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