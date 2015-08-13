<?php

/**
 * Visual Composer Extend
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access


// Load Modules
foreach ( glob( __DIR__ . '/modules/*.php' ) as $file ) { require_once $file; }
// Load Custom Fields
foreach ( glob( __DIR__ . '/fields/*.php' ) as $file ) { require_once $file; }


/**
 * Add custom parameters to Visual Composer
 */
function mixt_vc_extend() {

	// Custom Row Params
	$row_custom = array(
		// Separators
		array(
			'type'        => 'dropdown',
			'heading'     => __( 'Row Separator', 'mixt' ),
			'description' => __( 'Apply a separator to this row. Use inverted separators when using a background image for this row.', 'mixt' ),
			'param_name'  => 'separator',
			'std'         => '',
			'value'       => array_flip(mixt_element_assets('row-separators')),
		),
		array(
			'type'        => 'colorpicker',
			'heading'     => __( 'Separator Color', 'mixt' ),
			'description' => __( 'The separator\'s color. Select the same color as the row for normal separators, or the next row\'s color for inverted ones.', 'mixt' ),
			'param_name'  => 'separator_color',
			'std'         => '',
			'dependency'  => array('element' => 'separator', 'not_empty' => true),
		),
		array(
			'type'        => 'iconpicker',
			'heading'     => __( 'Separator Icon', 'mixt' ),
			'param_name'  => 'separator_icon',
			'std'         => '',
			'dependency'  => array('element' => 'separator', 'not_empty' => true),
		),
		// First Row Check
		array(
			'type'        => 'checkbox',
			'heading'     => __( 'First Row', 'mixt' ),
			'description' => __( 'Check if this row should sit flush against the header', 'mixt' ),
			'param_name'  => 'first_row',
			'std' => false,
		),
	);
	vc_add_params( 'vc_row', $row_custom );

	// Row Columns Equal Height
	$cols_matchheight = array(
		'type'        => 'checkbox',
		'heading'     => __( 'Equal Columns Height', 'mixt' ),
		'description' => __( 'Make the columns in this row equal height', 'mixt' ),
		'param_name'  => 'cols_matchheight',
		'std'         => false,
	);
	vc_add_param( 'vc_row', $cols_matchheight );
	vc_add_param( 'vc_row_inner', $cols_matchheight );

	// Remove VC Image Carousel
	vc_remove_element( 'vc_images_carousel' );

	// Set Editor Post Types
	vc_set_default_editor_post_types( array('page', 'post', 'portfolio') );
}
add_action( 'vc_before_init', 'mixt_vc_extend' );


/**
 * Customize VC classes
 */
function mixt_vc_custom_classes( $classes, $tag ) {
	switch ($tag) {
		case 'vc_toggle':
		case 'vc_accordion':
			return $classes . ' theme-bd';
			break;
		case 'vc_row':
		case 'vc_row_inner':
			return $classes . ' row';
			break;
		case 'vc_column':
		case 'vc_column_inner':
			preg_match_all('/vc_(col-\w{2}-\d{1,2})/', $classes, $col_classes);
			return $classes . ' ' . implode(' ', $col_classes[1]);
			break;
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
