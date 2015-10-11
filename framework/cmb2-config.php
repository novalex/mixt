<?php

/**
 * MIXT Custom Meta Boxes Config
 *
 * @category MIXT
 * @package  Metaboxes
 * @license  http://www.opensource.org/licenses/gpl-license.php GPL v2.0 (or later)
 * @link     https://github.com/webdevstudios/Custom-Metaboxes-and-Fields-for-WordPress
 */

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

	$themes_auto = array('auto' => 'Auto');
	$nav_themes = mixt_get_themes('nav');
	if ( ! empty($nav_themes) && is_array($nav_themes) ) {
		$nav_themes = $themes_auto + $nav_themes;
	} else {
		$nav_themes = $themes_auto;
	}

	// PAGE OPTIONS

	$meta_boxes['mixt_page_meta'] = array(
		'id'           => 'mixt_page_options',
		'title'        => __( 'Page Options', 'mixt' ),
		'object_types' => array( 'page', 'post', 'portfolio', 'product' ),
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
					'auto'  => __( 'Auto', 'mixt' ),
					'true'  => __( 'Yes', 'mixt' ),
					'false' => __( 'No', 'mixt' ),
				),
				'default' => 'auto',
			),

			// Sticky Nav Switch
			array(
				'id'      => $prefix . 'nav-mode',
				'name'    => __('Navbar Mode', 'mixt'),
				'desc'    => __( 'Navbar fixed (scrolls with page) or static (stays at the top)', 'mixt' ),
				'type'    => 'radio_inline',
				'options' => array(
					'auto'   => __( 'Auto', 'mixt' ),
					'fixed'  => __( 'Fixed', 'mixt' ),
					'static' => __( 'Static', 'mixt' ),
				),
				'default' => 'auto',
			),

			// Navbar Theme
			array(
				'id'      => $prefix . 'nav-theme',
				'name'    => __( 'Navbar Theme', 'mixt' ),
				'desc'    => __( 'The navbar theme for this page', 'mixt' ),
				'type'    => 'select',
				'options' => $nav_themes,
				'default' => 'auto',
			),

			// See-Through Nav
			array(
				'id'      => $prefix . 'nav-transparent',
				'name'    => __( 'See-Through Navbar', 'mixt' ),
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
				'id'      => $prefix . 'nav-top-opacity',
				'name'    => __( 'See-Through Opacity', 'mixt' ),
				'desc'    => __( 'Set the navbar&#39;s see-through opacity, between 0.0 (transparent) and 1.0 (opaque)', 'mixt' ),
				'type'    => 'text',
				'default'    => '0.25',
				'attributes' => array(
					'class'             => 'conditional nested',
					'data-parent-field' => $prefix . 'nav-transparent',
					'data-show-on-id'   => $prefix . 'nav-transparent2',
				),
			),

			// Nav Position (Above or Below Header)
			array(
				'id'      => $prefix . 'nav-position',
				'name'    => __( 'Navbar Position', 'mixt' ),
				'desc'    => __( 'Navbar above or below header', 'mixt' ),
				'type'    => 'radio_inline',
				'options' => array(
					'auto'  => __( 'Auto', 'mixt' ),
					'above' => __( 'Above', 'mixt' ),
					'below' => __( 'Below', 'mixt' ),
				),
				'default'    => 'auto',
			),

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

			// Sidebar Switch
			array(
				'id'      => $prefix . 'page-sidebar',
				'name'    => __( 'Sidebar', 'mixt' ),
				'desc'    => __( 'Show the sidebar on this page', 'mixt' ),
				'type'    => 'radio_inline',
				'options' => array(
					'auto'  => __( 'Auto', 'mixt' ),
					'true'  => __( 'Yes', 'mixt' ),
					'false' => __( 'No', 'mixt' ),
				),
				'default' => 'auto',
			),
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
		$meta_boxes['mixt_page_meta']['fields'][] = array(
			'id'      => $prefix . 'sidebar-id',
			'name'    => __( 'Sidebar', 'mixt' ),
			'desc'    => __( 'The sidebar to use for this page', 'mixt' ),
			'type'    => 'select',
			'options' => $sidebar_options,
			'default' => 'auto',
		);
	}


	// BLOG OPTIONS

	$meta_boxes['mixt_blog_meta'] = array(
		'id'           => 'mixt_blog_options',
		'title'        => __( 'Blog Options', 'mixt' ),
		'object_types' => array( 'page' ),
		'show_on'      => array( 'key' => 'blog', 'value' => '' ),
		'context'      => 'normal',
		'priority'     => 'high',
		'show_names'   => true,
		'fields'       => array(

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
		),
	);


	// POSTS PAGE OPTIONS

	if ( function_exists('cmb2_post_search_render_field') ) {

		$meta_boxes['mixt_posts_page_meta'] = array(
			'id'           => 'mixt_posts_page_options',
			'title'        => __( 'Posts', 'mixt' ),
			'object_types' => array( 'page' ),
			'show_on'      => array(
				'key'   => 'page-template',
				'value' => 'templates/blog.php'
			),
			'context'      => 'normal',
			'priority'     => 'high',
			'show_names'   => true,
			'fields'       => array(

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
					'desc'    => __( 'Number of posts to display on each page (-1 to display all, auto to display number set in options)', 'mixt' ),
					'type'    => 'text',
					'default' => 'auto',
				),
			),
		);

	}


	// HEADER OPTIONS

	$meta_boxes['mixt_header_meta'] = array(
		'id'           => 'mixt_header_options',
		'title'        => __( 'Header Options', 'mixt' ),
		'object_types' => array( 'page', 'post', 'portfolio', 'product' ),
		'context'      => 'normal',
		'priority'     => 'high',
		'show_names'   => true,
		'fields'       => array(

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

			// Fullscreen
			array(
				'id'      => $prefix . 'head-fullscreen',
				'name'    => __( 'Fullscreen', 'mixt' ),
				'desc'    => __( 'Header fills entire screen size', 'mixt' ),
				'type'    => 'radio_inline',
				'options' => array(
					'auto'  => __( 'Auto', 'mixt' ),
					'true'  => __( 'Yes', 'mixt' ),
					'false' => __( 'No', 'mixt' ),
				),
				'default'    => 'auto',
				'attributes' => array(
					'class'             => 'conditional nested',
					'data-parent-field' => $prefix . 'head-media',
					'data-show-on'      => $prefix . 'head-media',
				),
			),

			// Height
			array(
				'id'         => $prefix . 'head-height',
				'name'       => __( 'Custom Height', 'mixt' ),
				'desc'       => __( 'Set a custom height (in px) for the header', 'mixt' ),
				'type'       => 'text',
				'default'    => 'none',
				'attributes' => array(
					'class'             => 'conditional nested',
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
					'class'             => 'conditional nested color-picker',
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
					'class'             => 'conditional nested color-picker',
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
					'class'             => 'conditional nested color-picker',
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
					'class'             => 'conditional nested',
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
					'class'             => 'conditional nested',
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
					'class'             => 'conditional nested',
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
					'class'             => 'conditional nested',
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
					'class'             => 'conditional nested',
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
					'class'             => 'conditional nested',
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
					'class'             => 'conditional nested',
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
					'class'             => 'conditional nested',
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
					'class'             => 'conditional nested',
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
					'class'             => 'conditional nested',
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
					'class'             => 'conditional nested',
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
					'class'             => 'conditional nested',
					'data-parent-field' => $prefix . 'head-media-type',
					'data-show-on-id'   => $prefix . 'head-media-type4',
				),
			),

			// Slider ID Field
			array(
				'id'         => $prefix . 'head-slider',
				'name'       => __( 'Slider ID', 'mixt' ),
				'desc'       => __( 'The ID of the slider to use', 'mixt' ),
				'type'       => 'text',
				'default'    => '',
				'attributes' => array(
					'class'             => 'conditional nested',
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
					'class'             => 'conditional nested',
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
					'class'             => 'conditional nested',
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
					'class'             => 'conditional nested',
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
					'class'             => 'conditional nested',
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
					'class'             => 'conditional nested',
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
					'class'             => 'conditional nested',
					'data-parent-field' => $prefix . 'head-media',
					'data-show-on'      => $prefix . 'head-media',
				),
			),

			// Custom Code Field
			array(
				'id'      => $prefix . 'head-code',
				'name'    => __( 'Custom Code', 'mixt' ),
				'type'    => 'wysiwyg',
				'options' => array(
					'wpautop'       => false,
					'textarea_rows' => '4',
					'textarea_name' => 'mixt-header-code-field',
					'editor_class'  => 'nested conditional parent_' . $prefix . 'head-content-code',
				),
				'attributes' => array(
					'data-parent-field' => $prefix . 'head-content-code',
					'data-show-on-id'   => $prefix . 'head-content-code1',
				),
			),

		),
	);


	// PORTFOLIO OPTIONS
	
	if ( class_exists('Mixt_Portfolio') ) {
		include_once( MIXT_PLUGINS_DIR . '/cmb2-extend/portfolio-fields.php' );
	}


	return $meta_boxes;
}


/**
 * Show metabox on blog template and posts page
 *
 * @param bool $display
 * @param array $meta_box
 * @return bool display metabox
 */
function mixt_metabox_show_on_blog( $display, $meta_box ) {

	if ( empty($meta_box['show_on']['key']) || $meta_box['show_on']['key'] !== 'blog' ) {
		return $display;
	}

	// Get the current ID
	if ( isset( $_GET['post'] ) ) {
		$post_id = $_GET['post'];
	} else if ( isset( $_POST['post_ID'] ) ) {
		$post_id = $_POST['post_ID'];
	}
	if ( ! isset( $post_id ) ) { return false; }

	$posts_page = get_option('page_for_posts');

	$page_template = get_page_template_slug($post_id);

	if ( $post_id == $posts_page || $page_template == 'templates/blog.php' ) {
		return true;
	}
}
add_filter( 'cmb2_show_on', 'mixt_metabox_show_on_blog', 10, 2 );