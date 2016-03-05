<?php

mixt_cmb_make_tab( $fields, esc_html__( 'Header', 'mixt' ), 'dashicons dashicons-align-center', array(

	// Location Bar Switch
	array(
		'id'      => $prefix . 'location-bar',
		'name'    => esc_html__( 'Location Bar', 'mixt' ),
		'desc'    => esc_html__( 'Show the location bar on this page', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Enable Header Media
	array(
		'id'      => $prefix . 'head-media',
		'name'    => esc_html__( 'Header Media', 'mixt' ),
		'desc'    => esc_html__( 'Display media, a slider & other content in the header', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Height
	array(
		'id'         => $prefix . 'head-height',
		'name'       => esc_html__( 'Height', 'mixt' ),
		'desc'       => esc_html__( 'Set a height for the header, in pixels or percent (relative to viewport). 100% will make the header cover the whole screen.', 'mixt' ),
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
		'name'       => esc_html__( 'Minimum Height', 'mixt' ),
		'desc'       => esc_html__( 'Set a minimum height for the header', 'mixt' ),
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
		'name'    => esc_html__( 'Background Color', 'mixt' ),
		'desc'    => esc_html__( 'Select a background color for the header', 'mixt' ),
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
		'name'    => esc_html__( 'Text Color', 'mixt' ),
		'desc'    => esc_html__( 'The color for text on light backgrounds', 'mixt' ),
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
		'name'    => esc_html__( 'Inverse Text Color', 'mixt' ),
		'desc'    => esc_html__( 'The color for text on dark backgrounds', 'mixt' ),
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
		'name'    => esc_html__( 'Media Type', 'mixt' ),
		'desc'    => esc_html__( 'Type of media to use in the header', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'   => esc_html__( 'Auto', 'mixt' ),
			'color'  => esc_html__( 'Solid Color', 'mixt' ),
			'image'  => esc_html__( 'Image', 'mixt' ),
			'video'  => esc_html__( 'Video', 'mixt' ),
			'slider' => esc_html__( 'Slider', 'mixt' ),
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
		'name'    => esc_html__( 'Image Source', 'mixt' ),
		'desc'    => esc_html__( 'Select an image or use the featured one', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'    => esc_html__( 'Auto', 'mixt' ),
			'gallery' => esc_html__( 'Gallery', 'mixt' ),
			'feat'    => esc_html__( 'Featured', 'mixt' ),
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
		'name'  => esc_html__( 'Select Image', 'mixt' ),
		'desc'  => esc_html__( 'Select an image from the gallery or upload one', 'mixt' ),
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
		'name'    => esc_html__( 'Repeat / Pattern Image', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
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
		'name'    => esc_html__( 'Video Source', 'mixt' ),
		'desc'    => esc_html__( 'Use an embedded video or a hosted one', 'mixt' ),
		'options' => array(
			'embed' => esc_html__( 'Embedded', 'mixt' ),
			'local' => esc_html__( 'Hosted', 'mixt' ),
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
		'name'     => esc_html__( 'Video Embed Code', 'mixt' ),
		'desc'     => esc_html__( 'The embed code for the video you want to use', 'mixt' ),
		'attributes' => array(
			'data-parent-field' => $prefix . 'head-video-src',
			'data-show-on-id'   => $prefix . 'head-video-src1',
		),
	),

	// Video Select
	array(
		'id'         => $prefix . 'head-video',
		'name'       => esc_html__( 'Video', 'mixt' ),
		'desc'       => esc_html__( 'Select a video from the gallery or upload one', 'mixt' ),
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
		'name'       => esc_html__( 'Video Fallback', 'mixt' ),
		'desc'       => esc_html__( 'Select a fallback video from the gallery or upload one', 'mixt' ),
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
		'name'           => esc_html__( 'Video Poster', 'mixt' ),
		'desc'           => esc_html__( 'Select an image to show while the video loads or if video is not supported', 'mixt' ),
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
		'name'       => esc_html__( 'Video Loop', 'mixt' ),
		'type'       => 'radio_inline',
		'options'    => array(
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
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
		'name'       => esc_html__( 'Video Luminance', 'mixt' ),
		'desc'       => esc_html__( 'Header text color will be adjusted based on this', 'mixt' ),
		'type'       => 'radio_inline',
		'options'    => array(
			'light' => esc_html__( 'Light', 'mixt' ),
			'dark'  => esc_html__( 'Dark', 'mixt' ),
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
		'name'       => esc_html__( 'Slider ID', 'mixt' ),
		'desc'       => esc_html__( 'The ID number or slug of the slider to use', 'mixt' ),
		'type'       => 'text',
		'default'    => '',
		'attributes' => array(
			'data-parent-field' => $prefix . 'head-media-type',
			'data-show-on-id'   => $prefix . 'head-media-type5',
		),
	),

	// Parallax Effect
	array(
		'id'      => $prefix . 'head-parallax',
		'name'    => esc_html__( 'Parallax Effect', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto' => esc_html__( 'Auto', 'mixt' ),
			'none' => esc_html__( 'None', 'mixt' ),
			'slow' => esc_html__( 'Slow', 'mixt' ),
			'fast' => esc_html__( 'Fast', 'mixt' ),
		),
		'default'    => 'auto',
		'attributes' => array(
			'data-parent-field' => $prefix . 'head-media',
			'data-show-on'      => $prefix . 'head-media',
		),
	),

	// Content Align
	array(
		'id'      => $prefix . 'head-content-align',
		'name'    => esc_html__( 'Content Align', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'   => esc_html__( 'Auto', 'mixt' ),
			'left'   => esc_html__( 'Left', 'mixt' ),
			'center' => esc_html__( 'Center', 'mixt' ),
			'right'  => esc_html__( 'Right', 'mixt' ),
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
		'name'    => esc_html__( 'Content Size', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'      => esc_html__( 'Auto', 'mixt' ),
			'normal'    => esc_html__( 'Normal', 'mixt' ),
			'fullwidth' => esc_html__( 'Full Width', 'mixt' ),
			'cover'     => esc_html__( 'Cover', 'mixt' ),
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
		'name'    => esc_html__( 'Content Fade Effect', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
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
		'name'    => esc_html__( 'Scroll To Content', 'mixt' ),
		'desc'    => esc_html__( 'Show an arrow that scrolls down to the page content when clicked', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
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
		'name'    => esc_html__( 'Post Info', 'mixt' ),
		'desc'    => esc_html__( 'Show the post title and meta in the header', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
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
		'name'    => esc_html__( 'Custom Code', 'mixt' ),
		'desc'    => esc_html__( 'Output custom code in the header (can use shortcodes)', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
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
		'name'    => esc_html__( 'Custom Code Content', 'mixt' ),
		'type'    => 'wysiwyg',
		'options' => array(
			'wpautop'       => false,
			'textarea_rows' => '4',
			'textarea_name' => 'mixt-header-code-field',
			'editor_class'  => 'nested conditional parent_' . $prefix . 'head-content-code',
		),
	),
) );
