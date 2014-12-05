<?php
/**
 * @category MIXT
 * @package  Metaboxes
 * @license  http://www.opensource.org/licenses/gpl-license.php GPL v2.0 (or later)
 * @link     https://github.com/webdevstudios/Custom-Metaboxes-and-Fields-for-WordPress
 */

/**
 *
 * MIXT Custom Meta Boxes
 *
 * This file contains the options meta box displayed on the page/post edit screen.
 *
 */

// Load CMB2

if ( file_exists(  __DIR__ .'/cmb2-mixt/init.php' ) ) {
	require_once  __DIR__ .'/cmb2-mixt/init.php';
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

	$prefix = 'mixt_';

	$meta_boxes['page_header'] = array(
		'id'           => 'page_header',
		'title'        => __('Page Header', 'cmb2'),
		'object_types' => array( 'page', ), // Post type
		'context'      => 'normal',
		'priority'     => 'high',
		'show_names'   => true,
		'fields'       => array(

			// Sticky Nav Switch
			array(
				'name'    => __('Sticky Nav', 'cmb2'),
				'desc'    => __('Navbar scrolls with page', 'cmb2'),
				'id'      => $prefix . 'nav_sticky',
				'type'    => 'radio_inline',
				'options' => array(
					'auto'  => __('Auto', 'cmb2'),
					'true'  => __('Yes', 'cmb2'),
					'false' => __('No', 'cmb2'),
				),
				'default' => 'auto',
			),

			// Navbar Scheme
			array(
				'name' => __('Navbar Scheme', 'cmb2'),
				'id'   => $prefix . 'nav_scheme',
				'type' => 'radio_inline',
				'options' => array(
					'auto'  => __('Auto', 'cmb2'),
					'light' => __('Light', 'cmb2'),
					'dark'  => __('Dark', 'cmb2'),
				),
				'default' => 'auto',
			),

			// Navbar Menu Scheme
			array(
				'name'    => __('Navbar Menu Scheme', 'cmb2'),
				'id'      => $prefix . 'nav_sub_scheme',
				'type'    => 'radio_inline',
				'options' => array(
					'auto'  => __('Auto', 'cmb2'),
					'light' => __('Light', 'cmb2'),
					'dark'  => __('Dark', 'cmb2'),
				),
				'default' => 'auto',
			),

			// Header Media
			array(
				'name'       => __( 'Header Media', 'cmb2' ),
				'desc'       => __( 'Display media, a slider & other content in the header', 'cmb2' ),
				'id'         => $prefix . 'head_media',
				'type'       => 'radio_inline',
				'options' => array(
					'true'  => __( 'Yes', 'cmb2' ),
					'false' => __( 'No', 'cmb2' ),
				),
				'default' => 'false',
			),
			// Transparent Nav
			array(
				'name'      => __( 'Transparent Nav', 'cmb2' ),
				'desc'      => __( 'Navbar transparent when not scrolled', 'cmb2' ),
				'id'        => $prefix . 'nav_tsp',
				'type'      => 'radio_inline',
				'options'   => array(
					'true'  => __( 'Yes', 'cmb2' ),
					'false' => __( 'No', 'cmb2' ),
				),
				'default'   => 'false',
				'attributes' => array(
					'class'  => 'conditional nested',
					'data-parent-field' => 'mixt_head_media',
			        'data-show-on' => 'mixt_head_media',
			    ),
			),
			// Use Featured Image as Header Image
	        array(
	            'name' => __( 'Use featured image', 'cmb2'),
	            'id'   => $prefix . 'head_img_feat',
	            'type' => 'radio_inline',
	            'options' => array(
					'true'  => __( 'Yes', 'cmb2' ),
					'false' => __( 'No', 'cmb2' ),
				),
				'default' => 'false',
				'attributes' => array(
					'class' => 'conditional nested',
					'data-parent-field' => 'mixt_head_media',
			        'data-show-on' => 'mixt_head_media',
			    ),
	        ),
	        // Repeat / Pattern Header Image
	        array(
	            'name' => __('Repeat Image', 'cmb2'),
	            'id'   => $prefix . 'head_img_repeat',
	            'type' => 'radio_inline',
	            'options' => array(
					'true'  => __( 'Yes', 'cmb2' ),
					'false' => __( 'No', 'cmb2' ),
				),
				'default' => 'false',
				'attributes'  => array(
					'class' => 'conditional nested',
					'data-parent-field' => 'mixt_head_media',
			        'data-show-on' => 'mixt_head_media',
			    ),
	        ),
	        // Custom HTML Wysiwyg Field
	        array(
	            'name' => __('Header Code', 'cmb2'),
	            'desc' => __('Code to output in the header (can use shortcodes)', 'cmb2'),
	            'id'   => $prefix . 'head_code',
	            'type' => 'wysiwyg',
	            'options' => array(
                    'wpautop'       => false,
                    'media_buttons' => false,
                    'textarea_name' => 'mixt-header-code-field',
                    'textarea_rows' => '4',
                    'editor_class' => 'nested conditional parent__mixt_head_media',
                ),
	        ),

	        // Page Full Width Switch
			array(
				'name'       => __( 'Full Width', 'cmb2' ),
				'desc'       => __( 'Display page in full width mode', 'cmb2' ),
				'id'         => $prefix . 'page_fullwidth',
				'type'       => 'radio_inline',
				'options' => array(
					'true'  => __( 'Yes', 'cmb2' ),
					'false' => __( 'No', 'cmb2' ),
				),
				'default' => 'false',
			),

			// Sidebar Switch
			array(
				'name'       => __( 'Show Sidebar', 'cmb2' ),
				'desc'       => __( 'Show or hide the sidebar on this page', 'cmb2' ),
				'id'         => $prefix . 'page_sidebar',
				'type'       => 'radio_inline',
				'options' => array(
					'true'  => __( 'Yes', 'cmb2' ),
					'false'  => __( 'No', 'cmb2' ),
				),
				'default' => 'true',
			),
			array(
				'name' => __( 'Test Text Small', 'cmb2' ),
				'desc' => __( 'field description (optional)', 'cmb2' ),
				'id'   => $prefix . 'test_textsmall',
				'type' => 'text_small',
			),
		),
	);

	// Add other metaboxes as needed

	return $meta_boxes;
}
