<?php

$this->sections[] = array(
	'title'      => esc_html__( 'Header', 'mixt' ),
	'desc'       => esc_html__( 'Customize the site header', 'mixt' ),
	'icon'       => 'el-icon-screen',
	'customizer' => false,
	'fields'     => array(

		// HEAD MEDIA
		array(
			'id'       => 'head-media-section',
			'type'     => 'section',
			'title'    => esc_html__( 'Header Media', 'mixt' ),
			'subtitle' => esc_html__( 'Configure the header media element and its appearance', 'mixt' ),
			'indent'   => true,
		),

			// Enable
			array(
				'id'       => 'head-media',
				'type'     => 'switch',
				'title'    => esc_html__( 'Enabled', 'mixt' ),
				'subtitle' => esc_html__( 'Display the header media element on all pages where possible', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => false,
			),

			// Height
			array(
				'id'       => 'head-height',
				'type'     => 'dimensions',
				'title'    => esc_html__( 'Height', 'mixt' ),
				'subtitle' => esc_html__( 'Set a height for the header, in pixels or percent (relative to viewport). 100% will make the header cover the whole screen.', 'mixt' ),
				'units'    => array( 'px', '%' ),
				'width'    => false,
			),

			// Min Height
			array(
				'id'       => 'head-min-height',
				'type'     => 'dimensions',
				'title'    => esc_html__( 'Minimum Height', 'mixt' ),
				'subtitle' => esc_html__( 'Set a minimum height for the header', 'mixt' ),
				'units'    => array( 'px' ),
				'width'    => false,
			),

			// Background Color
			array(
				'id'       => 'head-bg-color',
				'type'     => 'color',
				'title'    => esc_html__( 'Background Color', 'mixt' ),
				'subtitle' => esc_html__( 'Select a background color for the header', 'mixt' ),
				'transparent' => false,
				'validate' => 'color',
				'default'  => '',
			),

			// Text Color
			array(
				'id'       => 'head-text-color',
				'type'     => 'color',
				'title'    => esc_html__( 'Text Color', 'mixt' ),
				'subtitle' => esc_html__( 'The color for text on light backgrounds', 'mixt' ),
				'transparent' => false,
				'validate' => 'color',
				'default'  => '',
			),

			// Background Color
			array(
				'id'       => 'head-inv-text-color',
				'type'     => 'color',
				'title'    => esc_html__( 'Inverse Text Color', 'mixt' ),
				'subtitle' => esc_html__( 'The color for text on dark backgrounds', 'mixt' ),
				'transparent' => false,
				'validate' => 'color',
				'default'  => '',
			),

			// Media Type
			array(
				'id'       => 'head-media-type',
				'type'     => 'button_set',
				'title'    => esc_html__( 'Media Type', 'mixt' ),
				'subtitle' => esc_html__( 'Type of media to use in the header', 'mixt' ),
				'options'  => array(
					'color'  => esc_html__( 'Solid Color', 'mixt' ),
					'image'  => esc_html__( 'Image', 'mixt' ),
					'video'  => esc_html__( 'Video', 'mixt' ),
					'slider' => esc_html__( 'Slider', 'mixt' ),
				),
				'default'  => 'color',
			),

			// Image Placeholder
			array(
				'id'             => 'head-img-ph',
				'type'           => 'media',
				'title'          => esc_html__( 'Image Placeholder', 'mixt' ),
				'subtitle'       => esc_html__( 'Select a placeholder image to show if the desired image can\'t be found', 'mixt' ),
				'mode'           => 'jpg, jpeg, png',
				'library_filter' => array('jpg', 'jpeg', 'png'),
				'required'       => array('head-media-type', '=', 'image'),
			),

			// Image Source
			array(
				'id'       => 'head-img-src',
				'type'     => 'button_set',
				'title'    => esc_html__( 'Image Source', 'mixt' ),
				'subtitle' => esc_html__( 'Select an image or use the featured one', 'mixt' ),
				'options'  => array(
					'gallery' => esc_html__( 'Gallery', 'mixt' ),
					'feat'    => esc_html__( 'Featured', 'mixt' ),
				),
				'default'  => 'gallery',
				'required' => array('head-media-type', '=', 'image'),
			),

			// Image Select
			array(
				'id'       => 'head-img',
				'type'     => 'media',
				'title'    => esc_html__( 'Select Image', 'mixt' ),
				'subtitle' => esc_html__( 'Select an image from the gallery or upload one', 'mixt' ),
				'required' => array('head-img-src', '=', 'gallery'),
			),

			// Repeat / Pattern Image
			array(
				'id'       => 'head-img-repeat',
				'type'     => 'switch',
				'title'    => esc_html__( 'Repeat / Pattern Image', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => true,
				'required' => array('head-media-type', '=', 'image'),
			),

			// Video Source
			array(
				'id'       => 'head-video-src',
				'type'     => 'button_set',
				'title'    => esc_html__( 'Video Source', 'mixt' ),
				'subtitle' => esc_html__( 'Use an embedded video or a hosted one', 'mixt' ),
				'options'  => array(
					'embed' => esc_html__( 'Embedded', 'mixt' ),
					'local' => esc_html__( 'Hosted', 'mixt' ),
				),
				'default'  => 'embed',
				'required' => array('head-media-type', '=', 'video'),
			),

			// Video Embed Code
			array(
				'id'       => 'head-video-embed',
				'type'     => 'textarea',
				'title'    => esc_html__( 'Video Embed Code', 'mixt' ),
				'subtitle' => esc_html__( 'The embed code for the video you want to use', 'mixt' ),
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
				'title'          => esc_html__( 'Video', 'mixt' ),
				'subtitle'       => esc_html__( 'Select a video from the gallery or upload one', 'mixt' ),
				'mode'           => 'webm, mp4, ogg',
				'library_filter' => array('webm', 'mp4', 'ogg'),
				'placeholder'    => esc_html__( 'No video selected', 'mixt' ),
				'required'       => array('head-video-src', '=', 'local'),
			),

			// Video Fallback Select
			array(
				'id'             => 'head-video-2',
				'type'           => 'media',
				'title'          => esc_html__( 'Video Fallback', 'mixt' ),
				'subtitle'       => esc_html__( 'Select a fallback video from the gallery or upload one', 'mixt' ),
				'mode'           => 'webm, mp4, ogg',
				'library_filter' => array('webm', 'mp4', 'ogg'),
				'placeholder'    => esc_html__( 'No video selected', 'mixt' ),
				'required'       => array('head-video-src', '=', 'local'),
			),

			// Video Poster
			array(
				'id'             => 'head-video-poster',
				'type'           => 'media',
				'title'          => esc_html__( 'Video Poster', 'mixt' ),
				'subtitle'       => esc_html__( 'Select an image to show while the video loads or if video is not supported', 'mixt' ),
				'mode'           => 'jpg, jpeg, png',
				'library_filter' => array('jpg', 'jpeg', 'png'),
				'required'       => array('head-video-src', '=', 'local'),
			),

			// Video Loop
			array(
				'id'       => 'head-video-loop',
				'type'     => 'switch',
				'title'    => esc_html__( 'Video Loop', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => true,
				'required' => array('head-video-src', '=', 'local'),
			),

			// Video Luminance
			array(
				'id'       => 'head-video-lum',
				'type'     => 'button_set',
				'title'    => esc_html__( 'Video Luminance', 'mixt' ),
				'subtitle' => esc_html__( 'Header text color will be adjusted based on this', 'mixt' ),
				'options'  => array(
					'light' => esc_html__( 'Light', 'mixt' ),
					'dark'  => esc_html__( 'Dark', 'mixt' ),
				),
				'default'  => 'light',
				'required' => array('head-media-type', '=', 'video'),
			),

			// Slider ID
			array(
				'id'       => 'head-slider',
				'type'     => 'text',
				'title'    => esc_html__( 'Slider ID', 'mixt' ),
				'subtitle' => esc_html__( 'The ID number or slug of the slider to use', 'mixt' ),
				'required' => array('head-media-type', '=', 'slider'),
			),

			// Parallax Effect
			array(
				'id'       => 'head-parallax',
				'type'     => 'button_set',
				'title'    => esc_html__( 'Parallax Effect', 'mixt' ),
				'options'  => array(
					'none' => esc_html__( 'None', 'mixt' ),
					'slow' => esc_html__( 'Slow', 'mixt' ),
					'fast' => esc_html__( 'Fast', 'mixt' ),
				),
				'default'  => 'none',
			),

			// Content Align
			array(
				'id'      => 'head-content-align',
				'type'    => 'button_set',
				'title'   => esc_html__( 'Content Align', 'mixt' ),
				'options' => array(
					'left'   => esc_html__( 'Left', 'mixt' ),
					'center' => esc_html__( 'Center', 'mixt' ),
					'right'  => esc_html__( 'Right', 'mixt' ),
				),
				'default' => 'left',
			),

			// Content Size
			array(
				'id'      => 'head-content-size',
				'type'    => 'button_set',
				'title'   => esc_html__( 'Content Size', 'mixt' ),
				'options' => array(
					'normal'    => esc_html__( 'Normal', 'mixt' ),
					'fullwidth' => esc_html__( 'Full Width', 'mixt' ),
					'cover'     => esc_html__( 'Cover', 'mixt' ),
				),
				'default' => 'normal',
			),

			// Content Fade Effect
			array(
				'id'      => 'head-content-fade',
				'type'    => 'switch',
				'title'   => esc_html__( 'Content Fade Effect', 'mixt' ),
				'on'      => esc_html__( 'Yes', 'mixt' ),
				'off'     => esc_html__( 'No', 'mixt' ),
				'default' => false,
			),

			// Scroll To Content
			array(
				'id'       => 'head-content-scroll',
				'type'     => 'switch',
				'title'    => esc_html__( 'Scroll To Content', 'mixt' ),
				'subtitle' => esc_html__( 'Show an arrow that scrolls down to the page content when clicked', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => false,
			),

			// Post Info
			array(
				'id'       => 'head-content-info',
				'type'     => 'switch',
				'title'    => esc_html__( 'Post Info', 'mixt' ),
				'subtitle' => esc_html__( 'Show the post title and meta in the header', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => false,
			),

			// Custom Code
			array(
				'id'       => 'head-content-code',
				'type'     => 'switch',
				'title'    => esc_html__( 'Custom Code', 'mixt' ),
				'subtitle' => esc_html__( 'Output custom code in the header (can use shortcodes)', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => false,
			),

			// Custom Code Field
			array(
				'id'      => 'head-code',
				'type'    => 'editor',
				'title'   => esc_html__( 'Custom Code Content', 'mixt' ),
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
			'title'    => esc_html__( 'Location Bar', 'mixt' ),
			'subtitle' => esc_html__( 'Configure the location bar and its appearance', 'mixt' ),
			'indent'   => true,
		),

			// On/Off Switch
			array(
				'id'       => 'location-bar',
				'type'     => 'switch',
				'title'    => esc_html__( 'Location Bar', 'mixt' ),
				'subtitle' => esc_html__( 'Display the location bar', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => true,
			),

			// Background Color
			array(
				'id'       => 'loc-bar-bg-color',
				'type'     => 'color',
				'title'    => esc_html__( 'Background Color', 'mixt' ),
				'transparent' => false,
				'validate' => 'color',
				'required' => array('location-bar', '=', true),
			),

			// Background Pattern
			array(
				'id'       => 'loc-bar-bg-pat',
				'type'     => 'mixt_image_select',
				'title'    => esc_html__( 'Background Pattern', 'mixt' ),
				'options'  => $img_patterns,
				'empty'    => true,
				'default'  => '',
				'required' => array('location-bar', '=', true),
			),

			// Text Color
			array(
				'id'       => 'loc-bar-text-color',
				'type'     => 'color',
				'title'    => esc_html__( 'Text Color', 'mixt' ),
				'transparent' => false,
				'validate' => 'color',
				'required' => array('location-bar', '=', true),
			),

			// Border Color
			array(
				'id'       => 'loc-bar-border-color',
				'type'     => 'color',
				'title'    => esc_html__( 'Border Color', 'mixt' ),
				'transparent' => false,
				'validate' => 'color',
				'required' => array('location-bar', '=', true),
			),

			// Left Side Content
			array(
				'id'       => 'loc-bar-left-content',
				'type'     => 'select',
				'title'    => esc_html__( 'Left Side Content', 'mixt' ),
				'subtitle' => esc_html__( 'Content to show on the left side of the bar', 'mixt' ),
				'options'  => array(
					'0' => esc_html__( 'No Content', 'mixt' ),
					'1' => esc_html__( 'Title', 'mixt' ),
					'2' => esc_html__( 'Breadcrumbs', 'mixt' ),
				),
				'default'  => '1',
				'required' => array('location-bar', '=', true),
			),

			// Right Side Content
			array(
				'id'       => 'loc-bar-right-content',
				'type'     => 'select',
				'title'    => esc_html__( 'Right Side Content', 'mixt' ),
				'subtitle' => esc_html__( 'Content to show on the right side of the bar', 'mixt' ),
				'options'  => array(
					'0' => esc_html__( 'No Content', 'mixt' ),
					'1' => esc_html__( 'Title', 'mixt' ),
					'2' => esc_html__( 'Breadcrumbs', 'mixt' ),
				),
				'default'  => '2',
				'required' => array('location-bar', '=', true),
			),

			// Breadcrumbs Prefix
			array(
				'id'       => 'breadcrumbs-prefix',
				'type'     => 'text',
				'title'    => esc_html__( 'Breadcrumbs Prefix', 'mixt' ),
				'subtitle' => esc_html__( 'Text to display before the breadcrumbs', 'mixt' ),
				'required' => array('location-bar', '=', true),
			),
	),
);
