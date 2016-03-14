<?php

/**
 * Visual Composer Extend
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access


// Load Custom Fields
foreach ( glob( __DIR__ . '/fields/*.php' ) as $file ) { require_once $file; }


/**
 * Add custom parameters to Visual Composer
 */
function mixt_vc_extend() {
	vc_set_as_theme();

	// Custom Row Params
	$row_custom = array(

		// Row Theme Color
		array(
			'type'        => 'dropdown',
			'heading'     => esc_html__( 'Row Color', 'mixt' ),
			'description' => esc_html__( 'Set a theme color for this row', 'mixt' ),
			'param_name'  => 'theme_color',
			'std'         => 'auto',
			'value'       => array(
				esc_html__( 'Auto', 'mixt' )        => 'auto',
				esc_html__( 'Main', 'mixt' )        => 'main',
				esc_html__( 'Alternative', 'mixt' ) => 'alt',
				esc_html__( 'Inverse', 'mixt' )     => 'inv',
				esc_html__( 'Accent', 'mixt' )      => 'accent',
			),
		),

		// Row Padding
		array(
			'type'        => 'checkbox',
			'heading'     => esc_html__( 'Row Padding', 'mixt' ),
			'description' => esc_html__( 'Apply padding to this row', 'mixt' ),
			'param_name'  => 'row_padding',
			'value'       => array(
				esc_html__( 'Vertical', 'mixt' )         => 'vertical',
				esc_html__( 'Vertical (large)', 'mixt' ) => 'vertical-l',
				esc_html__( 'Vertical (extra)', 'mixt' ) => 'vertical-xl',
				esc_html__( 'Horizontal', 'mixt' )       => 'horizontal',
			),
		),

		// First Row Check
		array(
			'type'        => 'checkbox',
			'heading'     => esc_html__( 'First Row', 'mixt' ),
			'description' => esc_html__( 'Check if this row should sit flush against the header', 'mixt' ),
			'param_name'  => 'first_row',
			'std' => false,
		),
	);
	if ( class_exists('Mixt_Elements') ) {

		// Separators
		$row_custom[] = array(
			'type'        => 'dropdown',
			'heading'     => esc_html__( 'Row Separator', 'mixt' ),
			'description' => esc_html__( 'Apply a separator to this row. Use inverted separators when using a background image for this row.', 'mixt' ),
			'param_name'  => 'separator',
			'std'         => '',
			'value'       => array_flip(mixt_element_assets('row-separators')),
		);
		$row_custom[] = array(
			'type'        => 'colorpicker',
			'heading'     => esc_html__( 'Separator Color', 'mixt' ),
			'description' => esc_html__( 'The separator\'s color. Select the same color as the row for normal separators, or the next row\'s color for inverted ones.', 'mixt' ),
			'param_name'  => 'separator_color',
			'std'         => '',
			'dependency'  => array('element' => 'separator', 'not_empty' => true),
		);
		$row_custom[] = array(
			'type'        => 'iconpicker',
			'heading'     => esc_html__( 'Separator Icon', 'mixt' ),
			'param_name'  => 'separator_icon',
			'std'         => '',
			'dependency'  => array('element' => 'separator', 'not_empty' => true),
		);
	}
	vc_add_params( 'vc_row', $row_custom );

	// Remove VC Image Carousel
	vc_remove_element( 'vc_images_carousel' );

	// Set Editor Post Types
	vc_set_default_editor_post_types( array(
		'page',
		'post',
		'portfolio',
		'product',
	) );

	// Disable welcome page
	remove_action('init', 'vc_page_welcome_redirect');
}
add_action('vc_before_init', 'mixt_vc_extend');


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
			preg_match_all('/vc_(col-\w{2}-offset-\d{1,2})/', $classes, $offset_classes);
			return $classes . ' ' . implode(' ', $col_classes[1]) . ' ' . implode(' ', $offset_classes[1]);
			break;
		default:
			return $classes;
	}
}
add_filter('vc_shortcodes_css_class', 'mixt_vc_custom_classes', 10, 2);


/**
 * Add custom grid item templates
 */
function mixt_vc_grid_templates( $templates ) {
	return array_merge( array(
		'masonry-scale-rotate' => array(
			'name'     => esc_html__( 'MIXT - Masonry: Scale And Rotate', 'mixt' ),
			'template' => '[vc_gitem c_zone_position="bottom" el_class="mixt-grid-item scale-and-rotate"][vc_gitem_animated_block animation="scaleRotateIn"][vc_gitem_zone_a height_mode="original" featured_image="yes" css=".vc_custom_1437041109909{background-position: 0 0 !important;background-repeat: repeat !important;}"][vc_gitem_row position="top"][vc_gitem_col][/vc_gitem_col][/vc_gitem_row][vc_gitem_row position="middle"][vc_gitem_col][/vc_gitem_col][/vc_gitem_row][vc_gitem_row position="bottom"][vc_gitem_col][/vc_gitem_col][/vc_gitem_row][/vc_gitem_zone_a][vc_gitem_zone_b][vc_gitem_row position="top"][vc_gitem_col][/vc_gitem_col][/vc_gitem_row][vc_gitem_row position="middle"][vc_gitem_col el_class="col-xs-6"][mixt_gitem_hover link_post="" hover_color="accent" items="image,post"][/vc_gitem_col][/vc_gitem_row][vc_gitem_row position="bottom"][vc_gitem_col][/vc_gitem_col][/vc_gitem_row][/vc_gitem_zone_b][/vc_gitem_animated_block][vc_gitem_zone_c el_class="gitem-title-cont"][vc_gitem_row][vc_gitem_col][vc_gitem_post_title link="post_link" font_container="tag:h4|text_align:left"][/vc_gitem_col][/vc_gitem_row][/vc_gitem_zone_c][/vc_gitem]',
		),
		'grid-fadein-title' => array(
			'name'     => esc_html__( 'MIXT - Grid: Fade In With Title', 'mixt' ),
			'template' => '[vc_gitem el_class="mixt-grid-item fade-in with-title"][vc_gitem_animated_block][vc_gitem_zone_a height_mode="4-3" featured_image="yes"][vc_gitem_row position="top"][vc_gitem_col][/vc_gitem_col][/vc_gitem_row][vc_gitem_row position="middle"][vc_gitem_col][mixt_gitem_hover hover_color="accent" btn_color="default"][/vc_gitem_col][/vc_gitem_row][vc_gitem_row position="bottom"][vc_gitem_col][/vc_gitem_col][/vc_gitem_row][/vc_gitem_zone_a][vc_gitem_zone_b][vc_gitem_row position="top"][vc_gitem_col][/vc_gitem_col][/vc_gitem_row][vc_gitem_row position="middle"][vc_gitem_col][mixt_gitem_hover hover_color="accent" item_style="" btn_color="default"][/vc_gitem_col][/vc_gitem_row][vc_gitem_row position="bottom"][vc_gitem_col][/vc_gitem_col][/vc_gitem_row][/vc_gitem_zone_b][/vc_gitem_animated_block][/vc_gitem]',
		),
	), $templates);
}
add_filter('vc_grid_item_predefined_templates', 'mixt_vc_grid_templates');


/**
 * Add custom colors to elements with color selects
 */
function mixt_vc_colors() {
	// Progress Bar
	$param = WPBMap::getParam('vc_progress_bar', 'bgcolor');
	$param['value'][esc_html__( 'Theme Accent', 'mixt' )] = 'accent';
	vc_update_shortcode_param('vc_progress_bar', $param);
}
add_action('vc_after_init', 'mixt_vc_colors');
