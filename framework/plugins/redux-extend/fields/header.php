<?php

$this->sections[] = array(
	'title'      => __( 'Header', 'mixt' ),
	'desc'       => __( 'Customize the site header', 'mixt' ),
	'icon'       => 'el-icon-screen',
	'customizer' => false,
	'fields'     => array(

		// HEAD MEDIA
		array(
			'id'       => 'head-media-section',
			'type'     => 'section',
			'title'    => __( 'Header Media', 'mixt' ),
			'subtitle' => __( 'Configure the header media element and its appearance', 'mixt' ),
			'indent'   => true,
		),

			// Enable
			array(
				'id'       => 'head-media',
				'type'     => 'switch',
				'title'    => __( 'Enabled', 'mixt' ),
				'subtitle' => __( 'Display the header media element on all pages where possible', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => false,
			),

			// Height
			array(
				'id'       => 'head-height',
				'type'     => 'dimensions',
				'title'    => __( 'Height', 'mixt' ),
				'subtitle' => __( 'Set a height for the header, in pixels or percent (relative to viewport). 100% will make the header cover the whole screen.', 'mixt' ),
				'units'    => array( 'px', '%' ),
				'width'    => false,
			),

			// Min Height
			array(
				'id'       => 'head-min-height',
				'type'     => 'dimensions',
				'title'    => __( 'Minimum Height', 'mixt' ),
				'subtitle' => __( 'Set a minimum height for the header', 'mixt' ),
				'units'    => array( 'px' ),
				'width'    => false,
			),

			// Background Color
			array(
				'id'       => 'head-bg-color',
				'type'     => 'color',
				'title'    => __( 'Background Color', 'mixt' ),
				'subtitle' => __( 'Select a background color for the header', 'mixt' ),
				'transparent' => false,
				'validate' => 'color',
				'default'  => '',
			),

			// Text Color
			array(
				'id'       => 'head-text-color',
				'type'     => 'color',
				'title'    => __( 'Text Color', 'mixt' ),
				'subtitle' => __( 'The color for text on light backgrounds', 'mixt' ),
				'transparent' => false,
				'validate' => 'color',
				'default'  => '',
			),

			// Background Color
			array(
				'id'       => 'head-inv-text-color',
				'type'     => 'color',
				'title'    => __( 'Inverse Text Color', 'mixt' ),
				'subtitle' => __( 'The color for text on dark backgrounds', 'mixt' ),
				'transparent' => false,
				'validate' => 'color',
				'default'  => '',
			),

			// Media Type
			array(
				'id'       => 'head-media-type',
				'type'     => 'button_set',
				'title'    => __( 'Media Type', 'mixt' ),
				'subtitle' => __( 'Type of media to use in the header', 'mixt' ),
				'options'  => array(
					'color'  => __( 'Solid Color', 'mixt' ),
					'image'  => __( 'Image', 'mixt' ),
					'video'  => __( 'Video', 'mixt' ),
					'slider' => __( 'Slider', 'mixt' ),
				),
				'default'  => 'color',
			),

			// Image Placeholder
			array(
				'id'             => 'head-img-ph',
				'type'           => 'media',
				'title'          => __( 'Image Placeholder', 'mixt' ),
				'subtitle'       => __( 'Select a placeholder image to show if the desired image can\'t be found', 'mixt' ),
				'mode'           => 'jpg, jpeg, png',
				'library_filter' => array('jpg', 'jpeg', 'png'),
				'required'       => array('head-media-type', '=', 'image'),
			),

			// Image Source
			array(
				'id'       => 'head-img-src',
				'type'     => 'button_set',
				'title'    => __( 'Image Source', 'mixt' ),
				'subtitle' => __( 'Select an image or use the featured one', 'mixt' ),
				'options'  => array(
					'gallery' => __( 'Gallery', 'mixt' ),
					'feat'    => __( 'Featured', 'mixt' ),
				),
				'default'  => 'gallery',
				'required' => array('head-media-type', '=', 'image'),
			),

			// Image Select
			array(
				'id'       => 'head-img',
				'type'     => 'media',
				'title'    => __( 'Select Image', 'mixt' ),
				'subtitle' => __( 'Select an image from the gallery or upload one', 'mixt' ),
				'required' => array('head-img-src', '=', 'gallery'),
			),

			// Repeat / Pattern Image
			array(
				'id'       => 'head-img-repeat',
				'type'     => 'switch',
				'title'    => __( 'Repeat / Pattern Image', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => true,
				'required' => array('head-media-type', '=', 'image'),
			),

			// Video Source
			array(
				'id'       => 'head-video-src',
				'type'     => 'button_set',
				'title'    => __( 'Video Source', 'mixt' ),
				'subtitle' => __( 'Use an embedded video or a hosted one', 'mixt' ),
				'options'  => array(
					'embed' => __( 'Embedded', 'mixt' ),
					'local' => __( 'Hosted', 'mixt' ),
				),
				'default'  => 'embed',
				'required' => array('head-media-type', '=', 'video'),
			),

			// Video Embed Code
			array(
				'id'       => 'head-video-embed',
				'type'     => 'textarea',
				'title'    => __( 'Video Embed Code', 'mixt' ),
				'subtitle' => __( 'The embed code for the video you want to use', 'mixt' ),
				'validate' => 'html_custom',
				'allowed_html' => array( 
					'iframe' => array(
						'src'             => array(),
						'width'           => array(),
						'height'          => array(),
						'frameborder'     => array(),
						'allowfullscreen' => array(),
					),
				),
				'required' => array('head-video-src', '=', 'embed'),
			),

			// Video Select
			array(
				'id'             => 'head-video',
				'type'           => 'media',
				'title'          => __( 'Video', 'mixt' ),
				'subtitle'       => __( 'Select a video from the gallery or upload one', 'mixt' ),
				'mode'           => 'webm, mp4, ogg',
				'library_filter' => array('webm', 'mp4', 'ogg'),
				'placeholder'    => __( 'No video selected', 'mixt' ),
				'required'       => array('head-video-src', '=', 'local'),
			),

			// Video Fallback Select
			array(
				'id'             => 'head-video-2',
				'type'           => 'media',
				'title'          => __( 'Video Fallback', 'mixt' ),
				'subtitle'       => __( 'Select a fallback video from the gallery or upload one', 'mixt' ),
				'mode'           => 'webm, mp4, ogg',
				'library_filter' => array('webm', 'mp4', 'ogg'),
				'placeholder'    => __( 'No video selected', 'mixt' ),
				'required'       => array('head-video-src', '=', 'local'),
			),

			// Video Poster
			array(
				'id'             => 'head-video-poster',
				'type'           => 'media',
				'title'          => __( 'Video Poster', 'mixt' ),
				'subtitle'       => __( 'Select an image to show while the video loads or if video is not supported', 'mixt' ),
				'mode'           => 'jpg, jpeg, png',
				'library_filter' => array('jpg', 'jpeg', 'png'),
				'required'       => array('head-video-src', '=', 'local'),
			),

			// Video Loop
			array(
				'id'       => 'head-video-loop',
				'type'     => 'switch',
				'title'    => __( 'Video Loop', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => true,
				'required' => array('head-video-src', '=', 'local'),
			),

			// Video Luminance
			array(
				'id'       => 'head-video-lum',
				'type'     => 'button_set',
				'title'    => __( 'Video Luminance', 'mixt' ),
				'subtitle' => __( 'Header text color will be adjusted based on this', 'mixt' ),
				'options'  => array(
					'light' => __( 'Light', 'mixt' ),
					'dark'  => __( 'Dark', 'mixt' ),
				),
				'default'  => 'light',
				'required' => array('head-media-type', '=', 'video'),
			),

			// Slider ID
			array(
				'id'       => 'head-slider',
				'type'     => 'text',
				'title'    => __( 'Slider ID', 'mixt' ),
				'subtitle' => __( 'The ID number or slug of the slider to use', 'mixt' ),
				'required' => array('head-media-type', '=', 'slider'),
			),

			// Parallax Effect
			array(
				'id'       => 'head-parallax',
				'type'     => 'button_set',
				'title'    => __( 'Parallax Effect', 'mixt' ),
				'options'  => array(
					'none' => __( 'None', 'mixt' ),
					'slow' => __( 'Slow', 'mixt' ),
					'fast' => __( 'Fast', 'mixt' ),
				),
				'default'  => 'none',
			),

			// Content Align
			array(
				'id'      => 'head-content-align',
				'type'    => 'button_set',
				'title'   => __( 'Content Align', 'mixt' ),
				'options' => array(
					'left'   => __( 'Left', 'mixt' ),
					'center' => __( 'Center', 'mixt' ),
					'right'  => __( 'Right', 'mixt' ),
				),
				'default' => 'left',
			),

			// Content Size
			array(
				'id'      => 'head-content-size',
				'type'    => 'button_set',
				'title'   => __( 'Content Size', 'mixt' ),
				'options' => array(
					'normal'    => __( 'Normal', 'mixt' ),
					'fullwidth' => __( 'Full Width', 'mixt' ),
					'cover'     => __( 'Cover', 'mixt' ),
				),
				'default' => 'normal',
			),

			// Content Fade Effect
			array(
				'id'      => 'head-content-fade',
				'type'    => 'switch',
				'title'   => __( 'Content Fade Effect', 'mixt' ),
				'on'      => __( 'Yes', 'mixt' ),
				'off'     => __( 'No', 'mixt' ),
				'default' => false,
			),

			// Scroll To Content
			array(
				'id'       => 'head-content-scroll',
				'type'     => 'switch',
				'title'    => __( 'Scroll To Content', 'mixt' ),
				'subtitle' => __( 'Show an arrow that scrolls down to the page content when clicked', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => false,
			),

			// Post Info
			array(
				'id'       => 'head-content-info',
				'type'     => 'switch',
				'title'    => __( 'Post Info', 'mixt' ),
				'subtitle' => __( 'Show the post title and meta in the header', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => false,
			),

			// Custom Code
			array(
				'id'       => 'head-content-code',
				'type'     => 'switch',
				'title'    => __( 'Custom Code', 'mixt' ),
				'subtitle' => __( 'Output custom code in the header (can use shortcodes)', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => false,
			),

			// Custom Code Field
			array(
				'id'      => 'head-code',
				'type'    => 'editor',
				'title'   => __( 'Custom Code Content', 'mixt' ),
				'args' => array(
					'teeny'         => false,
					'wpautop'       => false,
					'media_buttons' => false,
					'textarea_rows' => '4',
				),
				'required' => array('head-content-code', '=', true),
			),

		// Divider
		array(
			'id'   => 'global-divider',
			'type' => 'divide',
		),

		// LOCATION BAR
		array(
			'id'       => 'loc-bar-section',
			'type'     => 'section',
			'title'    => __( 'Location Bar', 'mixt' ),
			'subtitle' => __( 'Configure the location bar and its appearance', 'mixt' ),
			'indent'   => true,
		),

			// On/Off Switch
			array(
				'id'       => 'location-bar',
				'type'     => 'switch',
				'title'    => __( 'Location Bar', 'mixt' ),
				'subtitle' => __( 'Display the location bar', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => true,
			),

			// Background Color
			array(
				'id'       => 'loc-bar-bg-color',
				'type'     => 'color',
				'title'    => __( 'Background Color', 'mixt' ),
				'transparent' => false,
				'validate' => 'color',
				'required' => array('location-bar', '=', true),
			),

			// Background Pattern
			array(
				'id'       => 'loc-bar-bg-pat',
				'type'     => 'mixt_image_select',
				'title'    => __( 'Background Pattern', 'mixt' ),
				'options'  => $img_patterns,
				'empty'    => true,
				'default'  => '',
				'required' => array('location-bar', '=', true),
			),

			// Text Color
			array(
				'id'       => 'loc-bar-text-color',
				'type'     => 'color',
				'title'    => __( 'Text Color', 'mixt' ),
				'transparent' => false,
				'validate' => 'color',
				'required' => array('location-bar', '=', true),
			),

			// Border Color
			array(
				'id'       => 'loc-bar-border-color',
				'type'     => 'color',
				'title'    => __( 'Border Color', 'mixt' ),
				'transparent' => false,
				'validate' => 'color',
				'required' => array('location-bar', '=', true),
			),

			// Left Side Content
			array(
				'id'       => 'loc-bar-left-content',
				'type'     => 'select',
				'title'    => __( 'Left Side Content', 'mixt' ),
				'subtitle' => __( 'Content to show on the left side of the bar', 'mixt' ),
				'options'  => array(
					'0' => __( 'No Content', 'mixt' ),
					'1' => __( 'Title', 'mixt' ),
					'2' => __( 'Breadcrumbs', 'mixt' ),
				),
				'default'  => '1',
				'required' => array('location-bar', '=', true),
			),

			// Right Side Content
			array(
				'id'       => 'loc-bar-right-content',
				'type'     => 'select',
				'title'    => __( 'Right Side Content', 'mixt' ),
				'subtitle' => __( 'Content to show on the right side of the bar', 'mixt' ),
				'options'  => array(
					'0' => __( 'No Content', 'mixt' ),
					'1' => __( 'Title', 'mixt' ),
					'2' => __( 'Breadcrumbs', 'mixt' ),
				),
				'default'  => '2',
				'required' => array('location-bar', '=', true),
			),

			// Breadcrumbs Prefix
			array(
				'id'       => 'breadcrumbs-prefix',
				'type'     => 'text',
				'title'    => __( 'Breadcrumbs Prefix', 'mixt' ),
				'subtitle' => __( 'Text to display before the breadcrumbs', 'mixt' ),
				'required' => array('location-bar', '=', true),
			),
	),
);
