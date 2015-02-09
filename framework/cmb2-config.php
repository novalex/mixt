<?php

/**
 * @category MIXT
 * @package  Metaboxes
 * @license  http://www.opensource.org/licenses/gpl-license.php GPL v2.0 (or later)
 * @link     https://github.com/webdevstudios/Custom-Metaboxes-and-Fields-for-WordPress
 */

// MIXT Custom Meta Boxes

// Load CMB2
if ( file_exists(  __DIR__ . '/plugins/cmb2/init.php' ) ) {
	require_once( __DIR__ . '/plugins/cmb2/init.php' );
}

/**
 * Conditionally displays a field when used as a callback in the 'show_on_cb' field parameter
 *
 * @param  CMB2_Field object $field Field object
 *
 * @return bool                     True if metabox should show
 */
function cmb2_hide_if_no_cats( $field ) {
	// Don't show this field if not in the cats category
	if ( ! has_tag( 'cats', $field->object_id ) ) {
		return false;
	}
	return true;
}

add_filter( 'cmb2_meta_boxes', 'cmb2_mixt_metaboxes' );

/**
 * Define the metabox and field configurations.
 *
 * @param  array $meta_boxes
 * @return array
 */
function cmb2_mixt_metaboxes( array $meta_boxes ) {

	$prefix = '_mixt-'; // Start with underscore ('_prefix_') to hide custom meta from 'Custom Fields' section

	$nav_themes_auto = array('auto' => 'Auto');
	$nav_themes = mixt_get_themes('nav');

	$nav_themes = array_merge($nav_themes_auto, $nav_themes);

	// PAGE OPTIONS BOX
	$meta_boxes['mixt_page_meta'] = array(
		'id'           => 'page_options',
		'title'        => __('Page Options', 'mixt'),
		'object_types' => array( 'page', 'post' ), // Post type
		'context'      => 'normal',
		'priority'     => 'high',
		'show_names'   => true,
		'fields'       => array(

			// Page Full Width Switch
			array(
				'id'      => $prefix . 'page-fullwidth',
				'name'    => __( 'Full Width', 'mixt' ),
				'desc'    => __( 'Display page in full width mode', 'mixt' ),
				'type'    => 'radio_inline',
				'options' => array(
					'true'  => __( 'Yes', 'mixt' ),
					'false' => __( 'No', 'mixt' ),
				),
				'default' => 'false',
			),

			// Sticky Nav Switch
			array(
				'id'      => $prefix . 'nav-mode',
				'name'    => __('Navbar Mode', 'mixt'),
				'desc'    => __( 'Navbar fixed (scrolls with page) or static (stays at the top)', 'mixt' ),
				'type'    => 'radio_inline',
				'options' => array(
					'auto'   => __('Auto', 'mixt'),
					'fixed'  => __('Fixed', 'mixt'),
					'static' => __('Static', 'mixt'),
				),
				'default' => 'auto',
			),

			// Navbar Scheme
			array(
				'id'      => $prefix . 'nav-scheme',
				'name'    => __('Navbar Color Scheme', 'mixt'),
				'desc'    => __( 'Light or dark navbar color scheme', 'mixt' ),
				'type'    => 'radio_inline',
				'options' => array(
					'auto'  => __('Auto', 'mixt'),
					'light' => __('Light', 'mixt'),
					'dark'  => __('Dark', 'mixt'),
				),
				'default' => 'auto',
			),

			// Navbar Theme
			array(
				'id'      => $prefix . 'nav-theme',
				'name'    => __('Navbar Theme', 'mixt'),
				'desc'    => __( 'The navbar theme for this page', 'mixt' ),
				'type'    => 'select',
				'options' => $nav_themes,
				'default' => 'auto',
			),

			// Navbar Menu Scheme
			array(
				'id'      => $prefix . 'nav-sub-scheme',
				'name'    => __('Navbar Menu Scheme', 'mixt'),
				'desc'    => __( 'Light or dark dropdown menu color scheme', 'mixt' ),
				'type'    => 'radio_inline',
				'options' => array(
					'auto'  => __('Auto', 'mixt'),
					'light' => __('Light', 'mixt'),
					'dark'  => __('Dark', 'mixt'),
				),
				'default' => 'auto',
			),

			// Transparent Nav
			array(
				'id'      => $prefix . 'nav-transparent',
				'name'    => __( 'Transparent Nav', 'mixt' ),
				'desc'    => __( 'Navbar transparent when not scrolled', 'mixt' ),
				'type'    => 'radio_inline',
				'options' => array(
					'auto'  => __('Auto', 'mixt'),
					'true'  => __( 'Yes', 'mixt' ),
					'false' => __( 'No', 'mixt' ),
				),
				'default'    => 'auto',
			),

			// Sidebar Switch
			array(
				'id'      => $prefix . 'page-sidebar',
				'name'    => __( 'Show Sidebar', 'mixt' ),
				'desc'    => __( 'Show or hide the sidebar on this page', 'mixt' ),
				'type'    => 'radio_inline',
				'options' => array(
					'true'  => __( 'Yes', 'mixt' ),
					'false' => __( 'No', 'mixt' ),
				),
				'default' => 'true',
			),
		),
	);

	$meta_boxes['mixt_header_meta'] = array(
		'id'           => 'page-header-options',
		'title'        => __('Page Header Options', 'mixt'),
		'object_types' => array( 'page', 'post' ), // Post type
		'context'      => 'normal',
		'priority'     => 'high',
		'show_names'   => true,
		'fields'       => array(

			// Header Media
			array(
				'id'      => $prefix . 'head-media',
				'name'    => __( 'Header Media', 'mixt' ),
				'desc'    => __( 'Display media, a slider & other content in the header', 'mixt' ),
				'type'    => 'radio_inline',
				'options' => array(
					'true'  => __( 'Yes', 'mixt' ),
					'false' => __( 'No', 'mixt' ),
				),
				'default' => 'false',
			),

			// Transparent Nav
			array(
				'id'      => $prefix . 'head-full-height',
				'name'    => __( 'Full Height', 'mixt' ),
				'desc'    => __( 'Header takes up the entire screen height', 'mixt' ),
				'type'    => 'radio_inline',
				'options' => array(
					'true'  => __( 'Yes', 'mixt' ),
					'false' => __( 'No', 'mixt' ),
				),
				'default'    => 'false',
				'attributes' => array(
					'class'             => 'conditional nested',
					'data-parent-field' => $prefix . 'head-media',
					'data-show-on'      => $prefix . 'head-media',
				),
			),

			// Nav Position (Above or Below Header)
			array(
				'id'      => $prefix . 'nav-position',
				'name'    => __( 'Nav Position', 'mixt' ),
				'desc'    => __( 'Navbar above or below header', 'mixt' ),
				'type'    => 'radio_inline',
				'options' => array(
					'above' => __( 'Above', 'mixt' ),
					'below' => __( 'Below', 'mixt' ),
				),
				'default'    => 'above',
				'attributes' => array(
					'class'             => 'conditional nested',
					'data-parent-field' => $prefix . 'head-media',
					'data-show-on'      => $prefix . 'head-media',
				),
			),

			// Media Type For Header
			array(
				'id'      => $prefix . 'head-media-type',
				'name'    => __( 'Media Type', 'mixt'),
				'desc'    => __( 'Type of media to use for the header', 'mixt' ),
				'type'    => 'radio_inline',
				'options' => array(
					'color'  => __( 'Solid Color', 'mixt' ),
					'image'  => __( 'Image', 'mixt' ),
					'video'  => __( 'Video', 'mixt' ),
					'slider' => __( 'Slider', 'mixt' ),
				),
				'default'    => 'color',
				'attributes' => array(
					'class'             => 'conditional nested',
					'data-parent-field' => $prefix . 'head-media',
					'data-show-on'      => $prefix . 'head-media',
				),
			),

			// Header Color Picker
			array(
				'id'      => $prefix . 'head-color',
				'name'    => __( 'Header Color', 'mixt'),
				'desc'    => __( 'Choose a color for the header', 'mixt' ),
				'type'    => 'colorpicker',
				'default' => '#eeeeee',
				'attributes' => array(
					'class'             => 'conditional nested color-picker',
					'data-parent-field' => $prefix . 'head-media-type',
					'data-show-on-id'   => $prefix . 'head-media-type1',
				),
			),

			// Header Image Source
			array(
				'id'      => $prefix . 'head-img-src',
				'name'    => __( 'Image Source', 'mixt'),
				'desc'    => __( 'What is the image source', 'mixt' ),
				'type'    => 'radio_inline',
				'options' => array(
					'gallery' => __( 'Gallery Image', 'mixt' ),
					'feat'    => __( 'Featured Image', 'mixt' ),
				),
				'default'    => 'feat',
				'attributes' => array(
					'class'             => 'conditional nested',
					'data-parent-field' => $prefix . 'head-media-type',
					'data-show-on-id'   => $prefix . 'head-media-type2',
				),
			),

			// Header Image Gallery Select
			array(
				'id'    => $prefix . 'head-img',
				'name'  => __( 'Select Image', 'mixt'),
				'desc'  => __( 'Select an image from the gallery or upload one', 'mixt' ),
				'type'  => 'file',
				'allow' => array( 'attachment' ),
				'attributes' => array(
					'class'             => 'conditional nested',
					'data-parent-field' => $prefix . 'head-img-src',
					'data-show-on-id'   => $prefix . 'head-img-src1',
				),
			),

			// Repeat / Pattern Header Image
			array(
				'id'      => $prefix . 'head-img-repeat',
				'name'    => __('Repeat Image', 'mixt'),
				'type'    => 'radio_inline',
				'options' => array(
					'true'  => __( 'Yes', 'mixt' ),
					'false' => __( 'No', 'mixt' ),
				),
				'default'    => 'false',
				'attributes' => array(
					'class'             => 'conditional nested',
					'data-parent-field' => $prefix . 'head-media-type',
					'data-show-on-id'   => $prefix . 'head-media-type2',
				),
			),

			// Header Slider ID Field
			array(
				'id'      => $prefix . 'head-slider',
				'name'    => __( 'Slider ID', 'mixt' ),
				'type'    => 'text',
				'default' => '',
				'attributes' => array(
					'class'             => 'conditional nested',
					'data-parent-field' => $prefix . 'head-media-type',
					'data-show-on-id'   => $prefix . 'head-media-type4',
				),
			),

			// Show Post Info In Header
			array(
				'id'      => $prefix . 'head-content-info',
				'name'    => __('Show Post Info', 'mixt'),
				'type'    => 'radio_inline',
				'options' => array(
					'true'  => __( 'Yes', 'mixt' ),
					'false' => __( 'No', 'mixt' ),
				),
				'default'    => 'false',
				'attributes' => array(
					'class'             => 'conditional nested',
					'data-parent-field' => $prefix . 'head-media',
					'data-show-on'     => $prefix . 'head-media',
				),
			),

			// Show Custom HTML
			array(
				'id'      => $prefix . 'head-content-code',
				'name'    => __('Show Header Code', 'mixt'),
				'type'    => 'radio_inline',
				'options' => array(
					'true'  => __( 'Yes', 'mixt' ),
					'false' => __( 'No', 'mixt' ),
				),
				'default'    => 'false',
				'attributes' => array(
					'class'             => 'conditional nested',
					'data-parent-field' => $prefix . 'head-media',
					'data-show-on'     => $prefix . 'head-media',
				),
			),

			// Custom HTML Field
			array(
				'id'      => $prefix . 'head-code',
				'name'    => __('Header Code', 'mixt'),
				'desc'    => __('Code to output in the header (can use shortcodes)', 'mixt'),
				'type'    => 'wysiwyg',
				'options' => array(
					'wpautop'       => false,
					'media_buttons' => false,
					'textarea_name' => 'mixt-header-code-field',
					'textarea_rows' => '4',
					'editor_class'  => 'nested conditional parent_' . $prefix . 'head-content-code',
				),
				'attributes' => array(
					'data-parent-field' => $prefix . 'head-content-code',
					'data-show-on-id'   => $prefix . 'head-content-code1',
				),
			),

		),
	);

	return $meta_boxes;
}
