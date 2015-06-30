<?php

/**
 * Visual Composer Extend
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access

// Load Custom Fields
foreach ( glob( __DIR__ . '/fields/*.php' ) as $filename ) {
	require_once $filename;
}


/**
 * Add custom parameters to Visual Composer
 */
function mixt_vc_extend() {

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

	// Remove VC Image Carousel
	vc_remove_element( 'vc_images_carousel' );
}
add_action( 'vc_before_init', 'mixt_vc_extend' );


/**
 * Customize VC classes
 */
function mixt_vc_custom_classes( $classes, $tag ) {
	switch ($tag) {
		case 'vc_accordion':
			return $classes . ' theme-bd';
			break;
		// case 'vc_row':
		// case 'vc_row_inner':
		// 	return str_replace('vc_row', 'row', $classes);
		// 	break;
		// case 'vc_column':
		// case 'vc_column_inner':
		// 	return str_replace('vc_col', 'col', $classes);
		// 	break;
		default:
			return $classes;
	}
}
add_filter( 'vc_shortcodes_css_class', 'mixt_vc_custom_classes', 10, 2 );


/**
 * Add custom colors to elements with color selects
 */
function mixt_vc_colors() {
	// Progress Bar
	$param = WPBMap::getParam('vc_progress_bar', 'bgcolor');
	$param['value'][__( 'Theme Accent', 'mixt' )] = 'bar_accent';
	vc_update_shortcode_param('vc_progress_bar', $param);
}
add_action( 'vc_after_init', 'mixt_vc_colors' );
