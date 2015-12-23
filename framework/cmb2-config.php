<?php

/**
 * MIXT Custom Meta Boxes Config
 *
 * @package  MIXT\Plugins\CMB2
 * @license  http://www.opensource.org/licenses/gpl-license.php GPL v2.0 (or later)
 * @link     https://github.com/webdevstudios/Custom-Metaboxes-and-Fields-for-WordPress
 */

// Load CMB2
if ( file_exists(  __DIR__ . '/plugins/cmb2/init.php' ) ) {
	require_once( __DIR__ . '/plugins/cmb2/init.php' );
}


/**
 * Check if a tab should display on the current page
 * @param  string $tab The tab to check
 * @return bool
 */
function mixt_cmb_show_tab($tab) {
	// Get the current ID
	if ( isset( $_GET['post'] ) ) {
		$post_id = $_GET['post'];
	} else if ( isset( $_POST['post_ID'] ) ) {
		$post_id = $_POST['post_ID'];
	}
	if ( ! isset( $post_id ) ) { return false; }

	$page_template = get_page_template_slug($post_id);

	global $get_post_type;

	switch ( $tab ) {
		case 'blog':
			$posts_page = get_option('page_for_posts');
			return ( $post_id == $posts_page || $page_template == 'templates/blog.php' );
			break;
		case 'posts':
			return ( $page_template == 'templates/blog.php' );
			break;
		case 'project':
			return ( get_post_type($post_id) == 'portfolio' );
			break;
		case 'portfolio':
			return ( $page_template == 'templates/portfolio.php' );
			break;
		default:
			return false;
	}
}


/**
 * Wrap a group of options in a tab and add it to the metabox fields array
 */
function mixt_cmb_make_tab(&$fields, $name, $icon = '', $options) {
	$id = sanitize_title($name);

	$fields[] = array(
		'id'   => $id . '_tab',
		'name' => $name,
		'type' => 'tab',
		'icon' => $icon,
		'render_row_cb' => 'mixt_cmb_render_tab_row',
	);

	foreach ( $options as $option ) {
		$fields[] = $option;
	}

	$fields[] = array(
		'id'   => $id . '_tab_end',
		'type' => 'tab-close',
		'render_row_cb' => 'mixt_cmb_render_tab_close_row',
	);
}


/**
 * Custom label callback with 'auto' checkbox
 */
function mixt_cmb_auto_label_cb($args, $field) {
	if ( ! $field->args( 'name' ) ) {
		return '';
	}
	$field_id = $field->id();
	$auto_id  = $field_id . '_auto';
	$auto_text = __( 'Auto', 'mixt' );
	$auto_atts = ( $field->escaped_value() == 'auto' ) ? ' checked="checked"' : '';
	$style = ! $field->args( 'show_names' ) ? ' style="display:none;"' : '';

	return sprintf( "\n" . '<label%1$s for="%2$s">%3$s</label>' . "\n", $style, $field_id, $field->args( 'name' ) ) .
		   "<span class='mixt-field-auto'><input id='$auto_id' type='checkbox'$auto_atts><label for='$auto_id'>$auto_text</label></span>";
}


/**
 * Sanitize WYSIWYG editor
 */
function mixt_cmb_sanitize_editor($override, $value, $object_id) {
	return htmlspecialchars_decode( stripslashes( $value ) );
}
add_filter('cmb2_sanitize_wysiwyg', 'mixt_cmb_sanitize_editor', 10, 3);


/**
 * Define the metabox and field configurations.
 *
 * @param  array $meta_boxes
 * @return array
 */
function cmb2_mixt_metaboxes( array $meta_boxes ) {

	$prefix = '_mixt-'; // Start with underscore to hide custom meta from 'Custom Fields' section

	$site_themes = ( (bool) get_option('mixt-themes-enabled') ) ? mixt_get_themes('site', 'all') : mixt_get_themes('site', 'default');
	$site_themes = array_merge( array('auto' => __( 'Auto', 'mixt')), $site_themes );
	$nav_themes = ( (bool) get_option('mixt-themes-enabled') ) ? mixt_get_themes('nav', 'all') : mixt_get_themes('nav', 'default');
	$nav_themes = array_merge( array('auto' => __( 'Auto', 'mixt')), $nav_themes );

	$fields = array();


	// GENERAl TAB

	mixt_cmb_make_tab( $fields, __( 'General', 'mixt' ), 'dashicons dashicons-admin-site', array(
		// Site Theme
		array(
			'id'      => $prefix . 'site-theme',
			'name'    => __( 'Theme', 'mixt' ),
			'desc'    => __( 'The site-wide theme for this page', 'mixt' ),
			'type'    => 'select',
			'options' => $site_themes,
			'default' => 'auto',
		),

		// Page Full Width Switch
		array(
			'id'      => $prefix . 'page-fullwidth',
			'name'    => __( 'Full Width', 'mixt' ),
			'desc'    => __( 'Display page in full width mode', 'mixt' ),
			'type'    => 'radio_inline',
			'options' => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default' => 'auto',
		),
	) );


	// BLOG TAB

	if ( mixt_cmb_show_tab('blog') ) {
		mixt_cmb_make_tab( $fields, __( 'Blog', 'mixt' ), 'dashicons dashicons-screenoptions', array(
			// Blog Type
			array(
				'id'      => $prefix . 'blog-type',
				'name'    => __( 'Layout Type', 'mixt' ),
				'desc'    => __( 'Select the blog layout type', 'mixt' ),
				'type'    => 'radio_inline',
				'options' => array(
					'auto'     => __( 'Auto', 'mixt' ),
					'standard' => __( 'Standard', 'mixt' ),
					'grid'     => __( 'Grid', 'mixt' ),
					'masonry'  => __( 'Masonry', 'mixt' ),
				),
				'default' => 'auto',
			),

			// Blog Columns
			array(
				'id'      => $prefix . 'blog-columns',
				'name'    => __( 'Blog Columns', 'mixt' ),
				'desc'    => __( 'Number of columns for grid and masonry layout', 'mixt' ),
				'type'    => 'radio_inline',
				'options' => array(
					'auto' => __( 'Auto', 'mixt' ),
					'2'    => '2',
					'3'    => '3',
					'4'    => '4',
					'5'    => '5',
					'6'    => '6',
				),
				'default' => 'auto',
			),

			// Post Media Display
			array(
				'id'      => $prefix . 'blog-feat-show',
				'name'    => __( 'Show Media', 'mixt' ),
				'desc'    => __( 'Display the post featured media', 'mixt' ),
				'type'    => 'radio_inline',
				'options' => array(
					'auto'  => __( 'Auto', 'mixt' ),
					'true'  => __( 'Yes', 'mixt' ),
					'false' => __( 'No', 'mixt' ),
				),
				'default'    => 'auto',
			),

			// Post Media Size
			array(
				'id'      => $prefix . 'blog-feat-size',
				'name'    => __( 'Media Size', 'mixt' ),
				'desc'    => __( 'Select a size for the featured post media', 'mixt' ),
				'type'    => 'radio_inline',
				'options' => array(
					'auto'   => __( 'Auto', 'mixt' ),
					'blog-large'  => __( 'Large', 'mixt' ),
					'blog-medium' => __( 'Medium', 'mixt' ),
					'blog-small'  => __( 'Small', 'mixt' ),
				),
				'default' => 'auto',
			),

			// Meta Position / Display
			array(
				'id'       => $prefix . 'blog-meta-show',
				'type'     => 'radio_inline',
				'name'     => __( 'Post Meta', 'mixt' ),
				'desc'     => __( 'Display the meta in the post header, footer, or do not display', 'mixt' ),
				'options'  => array(
					'auto'    => __( 'Auto', 'mixt' ),
					'header'  => __( 'In Header', 'mixt' ),
					'footer'  => __( 'In Footer', 'mixt' ),
					'false'   => __( 'No', 'mixt' ),
				),
				'default'  => 'auto',
			),

			// Post Info Display
			array(
				'id'       => $prefix . 'blog-post-info',
				'type'     => 'radio_inline',
				'name'     => __( 'Post Info', 'mixt' ),
				'desc'     => __( 'Display the post format and date', 'mixt' ),
				'options'  => array(
					'auto'  => __( 'Auto', 'mixt' ),
					'true'  => __( 'Yes', 'mixt' ),
					'false' => __( 'No', 'mixt' ),
				),
				'default'  => 'auto',
			),
		) );
	}


	// POSTS TAB

	if ( mixt_cmb_show_tab('posts') && function_exists('cmb2_post_search_render_field') ) {
		mixt_cmb_make_tab( $fields, __( 'Posts', 'mixt' ), 'dashicons dashicons-admin-page', array(
			// Posts
			array(
				'id'      => $prefix . 'attached-posts',
				'name'    => __( 'Posts', 'mixt' ),
				'desc'    => __( 'Select the posts to display on this page (empty to display all)', 'mixt' ),
				'type'    => 'post_search_text',
				'default' => '',
			),

			// Posts Per Page
			array(
				'id'      => $prefix . 'posts-page',
				'name'    => __( 'Posts Per Page', 'mixt' ),
				'desc'    => __( 'Number of posts to display on each page (-1 to display all, auto to use value from site settings)', 'mixt' ),
				'type'    => 'text',
				'default' => 'auto',
			),
		) );
	}


	// PORTFOLIO OPTIONS
	
	if ( class_exists('Mixt_Portfolio') ) {
		include_once( MIXT_PLUGINS_DIR . '/cmb2-extend/portfolio-fields.php' );
	}


	// NAVIGATION TAB

	$navigation_fields = array(
		// Navbar Theme
		array(
			'id'      => $prefix . 'nav-theme',
			'name'    => __( 'Theme', 'mixt' ),
			'desc'    => __( 'The navbar theme for this page', 'mixt' ),
			'type'    => 'select',
			'options' => $nav_themes,
			'default' => 'auto',
		),

		// See-Through Nav
		array(
			'id'      => $prefix . 'nav-transparent',
			'name'    => __( 'See-Through', 'mixt' ),
			'desc'    => __( 'Navbar see-through when at the top', 'mixt' ),
			'type'    => 'radio_inline',
			'options' => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default'    => 'auto',
		),

		// See-Through Opacity
		array(
			'id'         => $prefix . 'nav-top-opacity',
			'name'       => __( 'See-Through Opacity', 'mixt' ),
			'desc'       => __( 'Set the navbar&#39;s see-through opacity, between 0 (transparent) and 1 (opaque)', 'mixt' ),
			'type'       => 'slider',
			'min'        => 0,
			'max'        => 1,
			'step'       => 0.05,
			'default'    => 'auto',
			'tooltip'    => true,
			'label_cb'   => 'mixt_cmb_auto_label_cb',
			'attributes' => array(
				'data-parent-field' => $prefix . 'nav-transparent',
				'data-show-on-id'   => $prefix . 'nav-transparent2',
			),
		),
	);

	if ( mixt_get_option( array( 'key' => 'nav-layout', 'return' => 'value' ) ) == 'horizontal' ) {
		// Nav Position (Above or Below Header)
		$navigation_fields[] = array(
			'id'      => $prefix . 'nav-position',
			'name'    => __( 'Position', 'mixt' ),
			'desc'    => __( 'Navbar above or below header', 'mixt' ),
			'type'    => 'radio_inline',
			'options' => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'above' => __( 'Above', 'mixt' ),
				'below' => __( 'Below', 'mixt' ),
			),
			'default' => 'auto',
		);
	}

	// Secondary Nav Switch
	$navigation_fields[] = array(
		'id'      => $prefix . 'second-nav',
		'name'    => __( 'Secondary Navbar', 'mixt' ),
		'desc'    => __( 'Show the secondary navbar', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => __( 'Auto', 'mixt' ),
			'true'  => __( 'Yes', 'mixt' ),
			'false' => __( 'No', 'mixt' ),
		),
		'default' => 'auto',
	);

	// Secondary Nav Theme
	$navigation_fields[] = array(
		'id'      => $prefix . 'sec-nav-theme',
		'name'    => __( 'Secondary Nav Theme', 'mixt' ),
		'desc'    => __( 'Select the theme for the secondary navbar', 'mixt' ),
		'type'    => 'select',
		'options' => $nav_themes,
		'default' => 'auto',
	);

	mixt_cmb_make_tab( $fields, __( 'Navigation', 'mixt' ), 'dashicons dashicons-menu', $navigation_fields );


	// HEADER TAB

	mixt_cmb_make_tab( $fields, __( 'Header', 'mixt' ), 'dashicons dashicons-align-center', array(
		// Location Bar Switch
		array(
			'id'      => $prefix . 'location-bar',
			'name'    => __( 'Location Bar', 'mixt' ),
			'desc'    => __( 'Show the location bar on this page', 'mixt' ),
			'type'    => 'radio_inline',
			'options' => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default' => 'auto',
		),

		// Enable Header Media
		array(
			'id'      => $prefix . 'head-media',
			'name'    => __( 'Header Media', 'mixt' ),
			'desc'    => __( 'Display media, a slider & other content in the header', 'mixt' ),
			'type'    => 'radio_inline',
			'options' => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default' => 'auto',
		),

		// Height
		array(
			'id'         => $prefix . 'head-height',
			'name'       => __( 'Height', 'mixt' ),
			'desc'       => __( 'Set a height for the header, in pixels or percent (relative to viewport). 100% will make the header cover the whole screen.', 'mixt' ),
			'type'       => 'dimensions',
			'height'     => true,
			'units'      => array('px', '%'),
			'attributes' => array(
				'data-parent-field' => $prefix . 'head-media',
				'data-show-on'      => $prefix . 'head-media',
			),
		),

		// Min Height
		array(
			'id'         => $prefix . 'head-min-height',
			'name'       => __( 'Minimum Height', 'mixt' ),
			'desc'       => __( 'Set a minimum height for the header', 'mixt' ),
			'type'       => 'dimensions',
			'height'     => true,
			'units'      => array('px'),
			'attributes' => array(
				'data-parent-field' => $prefix . 'head-media',
				'data-show-on'      => $prefix . 'head-media',
			),
		),

		// Background Color
		array(
			'id'      => $prefix . 'head-bg-color',
			'name'    => __( 'Background Color', 'mixt' ),
			'desc'    => __( 'Select a background color for the header', 'mixt' ),
			'type'    => 'colorpicker',
			'default' => '',
			'attributes' => array(
				'class'             => 'color-picker',
				'data-parent-field' => $prefix . 'head-media',
				'data-show-on'      => $prefix . 'head-media',
			),
		),

		// Text Color
		array(
			'id'      => $prefix . 'head-text-color',
			'name'    => __( 'Text Color', 'mixt' ),
			'desc'    => __( 'The color for text on light backgrounds', 'mixt' ),
			'type'    => 'colorpicker',
			'default' => '',
			'attributes' => array(
				'class'             => 'color-picker',
				'data-parent-field' => $prefix . 'head-media',
				'data-show-on'      => $prefix . 'head-media',
			),
		),

		// Inverse Text Color
		array(
			'id'      => $prefix . 'head-inv-text-color',
			'name'    => __( 'Inverse Text Color', 'mixt' ),
			'desc'    => __( 'The color for text on dark backgrounds', 'mixt' ),
			'type'    => 'colorpicker',
			'default' => '',
			'attributes' => array(
				'class'             => 'color-picker',
				'data-parent-field' => $prefix . 'head-media',
				'data-show-on'      => $prefix . 'head-media',
			),
		),

		// Media Type
		array(
			'id'      => $prefix . 'head-media-type',
			'name'    => __( 'Media Type', 'mixt' ),
			'desc'    => __( 'Type of media to use in the header', 'mixt' ),
			'type'    => 'radio_inline',
			'options' => array(
				'auto'   => __( 'Auto', 'mixt' ),
				'color'  => __( 'Solid Color', 'mixt' ),
				'image'  => __( 'Image', 'mixt' ),
				'video'  => __( 'Video', 'mixt' ),
				'slider' => __( 'Slider', 'mixt' ),
			),
			'default'    => 'auto',
			'attributes' => array(
				'data-parent-field' => $prefix . 'head-media',
				'data-show-on'      => $prefix . 'head-media',
			),
		),

		// Image Source
		array(
			'id'      => $prefix . 'head-img-src',
			'name'    => __( 'Image Source', 'mixt' ),
			'desc'    => __( 'Select an image or use the featured one', 'mixt' ),
			'type'    => 'radio_inline',
			'options' => array(
				'auto'    => __( 'Auto', 'mixt' ),
				'gallery' => __( 'Gallery', 'mixt' ),
				'feat'    => __( 'Featured', 'mixt' ),
			),
			'default'    => 'auto',
			'attributes' => array(
				'data-parent-field' => $prefix . 'head-media-type',
				'data-show-on-id'   => $prefix . 'head-media-type3',
			),
		),

		// Image Select
		array(
			'id'    => $prefix . 'head-img',
			'name'  => __( 'Select Image', 'mixt' ),
			'desc'  => __( 'Select an image from the gallery or upload one', 'mixt' ),
			'type'  => 'file',
			'allow' => array( 'attachment' ),
			'options' => array(
				'url' => false,
			),
			'attributes' => array(
				'data-parent-field' => $prefix . 'head-img-src',
				'data-show-on-id'   => $prefix . 'head-img-src2',
			),
		),

		// Repeat / Pattern Image
		array(
			'id'      => $prefix . 'head-img-repeat',
			'name'    => __( 'Repeat / Pattern Image', 'mixt' ),
			'type'    => 'radio_inline',
			'options' => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default'    => 'auto',
			'attributes' => array(
				'data-parent-field' => $prefix . 'head-media-type',
				'data-show-on-id'   => $prefix . 'head-media-type3',
			),
		),

		// Image Parallax Effect
		array(
			'id'      => $prefix . 'head-img-parallax',
			'name'    => __( 'Parallax Effect', 'mixt' ),
			'type'    => 'radio_inline',
			'options' => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default'    => 'auto',
			'attributes' => array(
				'data-parent-field' => $prefix . 'head-media-type',
				'data-show-on-id'   => $prefix . 'head-media-type3',
			),
		),

		// Video Source
		array(
			'id'      => $prefix . 'head-video-src',
			'type'    => 'radio_inline',
			'name'    => __( 'Video Source', 'mixt' ),
			'desc'    => __( 'Use an embedded video or a hosted one', 'mixt' ),
			'options' => array(
				'embed' => __( 'Embedded', 'mixt' ),
				'local' => __( 'Hosted', 'mixt' ),
			),
			'default'  => 'embed',
			'attributes' => array(
				'data-parent-field' => $prefix . 'head-media-type',
				'data-show-on-id'   => $prefix . 'head-media-type4',
			),
		),

		// Video Embed Code
		array(
			'id'       => $prefix . 'head-video-embed',
			'type'     => 'textarea_code',
			'name'     => __( 'Video Embed Code', 'mixt' ),
			'desc'     => __( 'The embed code for the video you want to use', 'mixt' ),
			'attributes' => array(
				'data-parent-field' => $prefix . 'head-video-src',
				'data-show-on-id'   => $prefix . 'head-video-src1',
			),
		),

		// Video Select
		array(
			'id'         => $prefix . 'head-video',
			'name'       => __( 'Video', 'mixt' ),
			'desc'       => __( 'Select a video from the gallery or upload one', 'mixt' ),
			'type'       => 'file',
			'allow'      => array( 'attachment' ),
			'options' => array(
				'url' => false,
			),
			'attributes' => array(
				'data-parent-field' => $prefix . 'head-video-src',
				'data-show-on-id'   => $prefix . 'head-video-src2',
			),
		),

		// Video Fallback Select
		array(
			'id'         => $prefix . 'head-video-2',
			'name'       => __( 'Video Fallback', 'mixt' ),
			'desc'       => __( 'Select a fallback video from the gallery or upload one', 'mixt' ),
			'type'       => 'file',
			'allow'      => array( 'attachment' ),
			'options'    => array(
				'url' => false,
			),
			'attributes' => array(
				'data-parent-field' => $prefix . 'head-video-src',
				'data-show-on-id'   => $prefix . 'head-video-src2',
			),
		),

		// Video Poster Select
		array(
			'id'             => $prefix . 'head-video-poster',
			'name'           => __( 'Video Poster', 'mixt' ),
			'desc'           => __( 'Select an image to show while the video loads or if video is not supported', 'mixt' ),
			'type'           => 'file',
			'allow'          => array( 'attachment' ),
			'options'        => array(
				'url' => false,
			),
			'attributes'     => array(
				'data-parent-field' => $prefix . 'head-video-src',
				'data-show-on-id'   => $prefix . 'head-video-src2',
			),
		),

		// Video Loop
		array(
			'id'         => $prefix . 'head-video-loop',
			'name'       => __( 'Video Loop', 'mixt' ),
			'type'       => 'radio_inline',
			'options'    => array(
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default'    => 'true',
			'attributes' => array(
				'data-parent-field' => $prefix . 'head-video-src',
				'data-show-on-id'   => $prefix . 'head-video-src2',
			),
		),

		// Video Luminance
		array(
			'id'         => $prefix . 'head-video-lum',
			'name'       => __( 'Video Luminance', 'mixt' ),
			'desc'       => __( 'Header text color will be adjusted based on this', 'mixt' ),
			'type'       => 'radio_inline',
			'options'    => array(
				'light' => __( 'Light', 'mixt' ),
				'dark'  => __( 'Dark', 'mixt' ),
			),
			'default'    => 'light',
			'attributes' => array(
				'data-parent-field' => $prefix . 'head-media-type',
				'data-show-on-id'   => $prefix . 'head-media-type4',
			),
		),

		// Slider ID Field
		array(
			'id'         => $prefix . 'head-slider',
			'name'       => __( 'Slider ID', 'mixt' ),
			'desc'       => __( 'The ID number or slug of the slider to use', 'mixt' ),
			'type'       => 'text',
			'default'    => '',
			'attributes' => array(
				'data-parent-field' => $prefix . 'head-media-type',
				'data-show-on-id'   => $prefix . 'head-media-type5',
			),
		),

		// Content Align
		array(
			'id'      => $prefix . 'head-content-align',
			'name'    => __( 'Content Align', 'mixt' ),
			'type'    => 'radio_inline',
			'options' => array(
				'auto'   => __( 'Auto', 'mixt' ),
				'left'   => __( 'Left', 'mixt' ),
				'center' => __( 'Center', 'mixt' ),
				'right'  => __( 'Right', 'mixt' ),
			),
			'default'    => 'auto',
			'attributes' => array(
				'data-parent-field' => $prefix . 'head-media',
				'data-show-on'      => $prefix . 'head-media',
			),
		),

		// Content Size
		array(
			'id'      => $prefix . 'head-content-size',
			'name'    => __( 'Content Size', 'mixt' ),
			'type'    => 'radio_inline',
			'options' => array(
				'auto'      => __( 'Auto', 'mixt' ),
				'normal'    => __( 'Normal', 'mixt' ),
				'fullwidth' => __( 'Full Width', 'mixt' ),
				'cover'     => __( 'Cover', 'mixt' ),
			),
			'default'    => 'auto',
			'attributes' => array(
				'data-parent-field' => $prefix . 'head-media',
				'data-show-on'      => $prefix . 'head-media',
			),
		),

		// Content Fade Effect
		array(
			'id'      => $prefix . 'head-content-fade',
			'name'    => __( 'Content Fade Effect', 'mixt' ),
			'type'    => 'radio_inline',
			'options' => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default'    => 'auto',
			'attributes' => array(
				'data-parent-field' => $prefix . 'head-media',
				'data-show-on'      => $prefix . 'head-media',
			),
		),

		// Scroll To Content
		array(
			'id'      => $prefix . 'head-content-scroll',
			'name'    => __( 'Scroll To Content', 'mixt' ),
			'desc'    => __( 'Show an arrow that scrolls down to the page content when clicked', 'mixt' ),
			'type'    => 'radio_inline',
			'options' => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default'    => 'auto',
			'attributes' => array(
				'data-parent-field' => $prefix . 'head-media',
				'data-show-on'      => $prefix . 'head-media',
			),
		),

		// Post Info In Header
		array(
			'id'      => $prefix . 'head-content-info',
			'name'    => __( 'Post Info', 'mixt' ),
			'desc'    => __( 'Show the post title and meta in the header', 'mixt' ),
			'type'    => 'radio_inline',
			'options' => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default'    => 'auto',
			'attributes' => array(
				'data-parent-field' => $prefix . 'head-media',
				'data-show-on'      => $prefix . 'head-media',
			),
		),

		// Custom Code
		array(
			'id'      => $prefix . 'head-content-code',
			'name'    => __( 'Custom Code', 'mixt' ),
			'desc'    => __( 'Output custom code in the header (can use shortcodes)', 'mixt' ),
			'type'    => 'radio_inline',
			'options' => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default'    => 'auto',
			'attributes' => array(
				'data-parent-field' => $prefix . 'head-media',
				'data-show-on'      => $prefix . 'head-media',
			),
		),

		// Custom Code Field
		array(
			'id'      => $prefix . 'head-code',
			'name'    => __( 'Custom Code Content', 'mixt' ),
			'type'    => 'wysiwyg',
			'options' => array(
				'wpautop'       => false,
				'textarea_rows' => '4',
				'textarea_name' => 'mixt-header-code-field',
				'editor_class'  => 'nested conditional parent_' . $prefix . 'head-content-code',
			),
		),
	) );


	// SIDEBAR TAB

	$sidebar_fields = array(
		// Sidebar Switch
		array(
			'id'      => $prefix . 'page-sidebar',
			'name'    => __( 'Display', 'mixt' ),
			'desc'    => __( 'Show the sidebar on this page', 'mixt' ),
			'type'    => 'radio_inline',
			'options' => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default' => 'auto',
		),

		// Position
		array(
			'id'      => $prefix . 'sidebar-position',
			'name'    => __( 'Position', 'mixt' ),
			'desc'    => __( 'Sidebar to the left or to the right of the page', 'mixt' ),
			'type'    => 'radio_inline',
			'options' => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'left'  => __( 'Left', 'mixt' ),
				'right' => __( 'Right', 'mixt' ),
			),
			'default' => 'auto',
		),

		// Hide On Mobile
		array(
			'id'      => $prefix . 'sidebar-hide',
			'name'    => __( 'Hide On Mobile', 'mixt' ),
			'desc'    => __( 'Hide sidebar on mobile / small screens', 'mixt' ),
			'type'    => 'radio_inline',
			'options' => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default' => 'auto',
		),

		// Child Page Navigation
		array(
			'id'      => $prefix . 'child-page-nav',
			'name'    => __( 'Child Pages Menu', 'mixt' ),
			'desc'    => __( 'Display a navigation menu of child pages in the sidebar, when available', 'mixt' ),
			'type'    => 'radio_inline',
			'options'  => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default' => 'auto',
		),
	);

	// Custom sidebar select
	$custom_sidebars = get_option('mixt-sidebars');
	if ( $custom_sidebars ) {
		$sidebar_options = array(
			'auto'      => __( 'Auto', 'mixt' ),
			'sidebar-1' => __( 'Default', 'mixt' ),
		);
		foreach ( $custom_sidebars as $sidebar ) { $sidebar_options[$sidebar['id']] = $sidebar['name']; }
		$sidebar_fields[] = array(
			'id'      => $prefix . 'sidebar-id',
			'name'    => __( 'Sidebar', 'mixt' ),
			'desc'    => __( 'The sidebar to use for this page', 'mixt' ),
			'type'    => 'select',
			'options' => $sidebar_options,
			'default' => 'auto',
		);
	}

	mixt_cmb_make_tab( $fields, __( 'Sidebar', 'mixt' ), 'dashicons dashicons-align-left', $sidebar_fields );


	// FOOTER TAB
	
	mixt_cmb_make_tab( $fields, __( 'Footer', 'mixt' ), 'dashicons dashicons-minus', array(
		// Widget Area Switch
		array(
			'id'      => $prefix . 'footer-widgets-show',
			'name'    => __( 'Display Widget Area', 'mixt' ),
			'desc'    => __( 'Show the footer widget area on this page', 'mixt' ),
			'type'    => 'radio_inline',
			'options' => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default' => 'auto',
		),

		// Copyright Area Switch
		array(
			'id'      => $prefix . 'footer-copy-show',
			'name'    => __( 'Display Copyright Area', 'mixt' ),
			'desc'    => __( 'Show the footer copyright area on this page', 'mixt' ),
			'type'    => 'radio_inline',
			'options' => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default' => 'auto',
		),
	) );


	// BUILD PAGE OPTIONS METABOX

	$meta_boxes['mixt_page_meta'] = array(
		'id'           => 'mixt_page_options',
		'title'        => __( 'Page Options', 'mixt' ),
		'object_types' => array( 'page', 'post', 'portfolio', 'product' ),
		'context'      => 'normal',
		'priority'     => 'high',
		'show_names'   => true,
		'fields'       => $fields,
	);

	return $meta_boxes;
}
add_filter( 'cmb2_meta_boxes', 'cmb2_mixt_metaboxes' );
