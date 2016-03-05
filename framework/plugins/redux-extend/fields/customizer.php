<?php

// REDUX CUSTOMIZER FIELDS


// GLOBAL OPTIONS

$this->sections[] = array(
	'title'           => esc_html__( 'Global', 'mixt' ),
	'customizer_only' => true,
	'fields'          => array(

		// Site Layout
		array(
			'id'       => 'site-layout',
			'type'     => 'button_set',
			'title'    => esc_html__( 'Site Layout', 'mixt' ),
			'subtitle' => esc_html__( 'Choose the layout for the site', 'mixt' ),
			'options'  => array(
				'wide'  => esc_html__( 'Wide', 'mixt' ),
				'boxed' => esc_html__( 'Boxed', 'mixt' ),
			),
		),

		// Site Background Color
		array(
			'id'          => 'site-bg-color',
			'type'        => 'color',
			'title'       => esc_html__( 'Background Color (Boxed)', 'mixt' ),
			'subtitle'    => esc_html__( 'Select the site background color', 'mixt' ),
			'transparent' => false,
			'validate'    => 'color',
		),

		// Site Background Pattern
		array(
			'id'       => 'site-bg-pat',
			'type'     => 'mixt_image_select',
			'title'    => esc_html__( 'Background Pattern (Boxed)', 'mixt' ),
			'subtitle' => esc_html__( 'The site\'s background pattern', 'mixt' ),
			'options'  => $img_patterns,
			'empty'    => true,
		),

		// Page Loader
		array(
			'id'       => 'page-loader',
			'type'     => 'switch',
			'title'    => esc_html__( 'Page Loader', 'mixt' ),
			'subtitle' => esc_html__( 'Enable page loader to show animations when loading site', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
		),

		// Page Loader Type
		array(
			'id'       => 'page-loader-type',
			'type'     => 'button_set',
			'title'    => esc_html__( 'Loader Type', 'mixt' ),
			'subtitle' => esc_html__( 'Use a shape or image for the loader', 'mixt' ),
			'options'  => array(
				'1' => esc_html__( 'Shape', 'mixt' ),
				'2' => esc_html__( 'Image', 'mixt' ),
			),
		),

		// Page Loader Shape Select
		array(
			'id'       => 'page-loader-shape',
			'type'     => 'select',
			'title'    => esc_html__( 'Loader Shape', 'mixt' ),
			'subtitle' => esc_html__( 'Shape to use for the loader', 'mixt' ),
			'options'  => array(
				'circle'  => esc_html__( 'Circle', 'mixt' ),
				'ring'    => esc_html__( 'Ring', 'mixt' ),
				'square'  => esc_html__( 'Square', 'mixt' ),
				'square2' => esc_html__( 'Empty Square', 'mixt' ),
			),
		),

		// Page Loader Shape Color Select
		array(
			'id'          => 'page-loader-color',
			'type'        => 'color',
			'title'       => esc_html__( 'Loader Shape Color', 'mixt' ),
			'subtitle'    => esc_html__( 'Select a loader shape color', 'mixt' ),
			'transparent' => false,
			'validate'    => 'color',
		),

		// Page Loader Image Select
		array(
			'id'       => 'page-loader-img',
			'type'     => 'media',
			'url'      => false,
			'title'    => esc_html__( 'Loader Image', 'mixt' ),
			'subtitle' => esc_html__( 'Image to use for the loader', 'mixt' ),
		),

		// Page Loader Background Color Select
		array(
			'id'          => 'page-loader-bg',
			'type'        => 'color',
			'title'       => esc_html__( 'Loader Background Color', 'mixt' ),
			'subtitle'    => esc_html__( 'The page loader background color', 'mixt' ),
			'transparent' => false,
			'validate'    => 'color',
		),

		// Page Loader Animation Select
		array(
			'id'       => 'page-loader-anim',
			'type'     => 'select',
			'title'    => esc_html__( 'Loader Animation', 'mixt' ),
			'subtitle' => esc_html__( 'Animation to use for the loader', 'mixt' ),
			'options'  => $page_loader_anims,
		),
	),
);


// HEADER

$this->sections[] = array(
	'title'           => esc_html__( 'Header', 'mixt' ),
	'customizer_only' => true,
	'fields'          => array(),
);

// HEADER MEDIA
$this->sections[] = array(
	'title'           => esc_html__( 'Header Media', 'mixt' ),
	'subsection'      => true,
	'customizer_only' => true,
	'fields'          => array(

		// Enable
		array(
			'id'       => 'head-media',
			'type'     => 'switch',
			'title'    => esc_html__( 'Enabled', 'mixt' ),
			'subtitle' => esc_html__( 'Display the header media element on all pages where possible', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
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
		),

		// Text Color
		array(
			'id'       => 'head-text-color',
			'type'     => 'color',
			'title'    => esc_html__( 'Text Color', 'mixt' ),
			'subtitle' => esc_html__( 'The color for text on light backgrounds', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
		),

		// Background Color
		array(
			'id'       => 'head-inv-text-color',
			'type'     => 'color',
			'title'    => esc_html__( 'Inverse Text Color', 'mixt' ),
			'subtitle' => esc_html__( 'The color for text on dark backgrounds', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
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
	),
);

// HEADER MEDIA IMAGE
$this->sections[] = array(
	'title'           => esc_html__( 'Header Image', 'mixt' ),
	'subsection'      => true,
	'customizer_only' => true,
	'fields'          => array(

		// Image Placeholder
		array(
			'id'             => 'head-img-ph',
			'type'           => 'media',
			'title'          => esc_html__( 'Image Placeholder', 'mixt' ),
			'subtitle'       => esc_html__( 'Select a placeholder image to show if the desired image can\'t be found', 'mixt' ),
			'mode'           => 'jpg, jpeg, png',
			'library_filter' => array('jpg', 'jpeg', 'png'),
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
		),

		// Image Select
		array(
			'id'       => 'head-img',
			'type'     => 'media',
			'title'    => esc_html__( 'Select Image', 'mixt' ),
			'subtitle' => esc_html__( 'Select an image from the gallery or upload one', 'mixt' ),
		),

		// Repeat / Pattern Image
		array(
			'id'      => 'head-img-repeat',
			'type'    => 'switch',
			'title'   => esc_html__( 'Repeat / Pattern Image', 'mixt' ),
			'on'      => esc_html__( 'Yes', 'mixt' ),
			'off'     => esc_html__( 'No', 'mixt' ),
		),
	),
);

// HEADER MEDIA VIDEO
$this->sections[] = array(
	'title'           => esc_html__( 'Header Video', 'mixt' ),
	'subsection'      => true,
	'customizer_only' => true,
	'fields'          => array(

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
		),

		// Video Poster
		array(
			'id'             => 'head-video-poster',
			'type'           => 'media',
			'title'          => esc_html__( 'Video Poster', 'mixt' ),
			'subtitle'       => esc_html__( 'Select an image to show while the video loads or if video is not supported', 'mixt' ),
			'mode'           => 'jpg, jpeg, png',
			'library_filter' => array('jpg', 'jpeg', 'png'),
		),

		// Video Loop
		array(
			'id'      => 'head-video-loop',
			'type'    => 'switch',
			'title'   => esc_html__( 'Video Loop', 'mixt' ),
			'on'      => esc_html__( 'Yes', 'mixt' ),
			'off'     => esc_html__( 'No', 'mixt' ),
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
		),
	),
);

// HEADER MEDIA SLIDER
$this->sections[] = array(
	'title'           => esc_html__( 'Header Slider', 'mixt' ),
	'subsection'      => true,
	'customizer_only' => true,
	'fields'          => array(

		// Slider ID
		array(
			'id'       => 'head-slider',
			'type'     => 'text',
			'title'    => esc_html__( 'Slider ID', 'mixt' ),
			'subtitle' => esc_html__( 'The ID of the slider to use', 'mixt' ),
		),
	),
);

// HEADER MEDIA CONTENT
$this->sections[] = array(
	'title'           => esc_html__( 'Header Content', 'mixt' ),
	'subsection'      => true,
	'customizer_only' => true,
	'fields'          => array(

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
		),

		// Content Fade Effect
		array(
			'id'      => 'head-content-fade',
			'type'    => 'switch',
			'title'   => esc_html__( 'Content Fade Effect', 'mixt' ),
			'on'      => esc_html__( 'Yes', 'mixt' ),
			'off'     => esc_html__( 'No', 'mixt' ),
		),

		// Scroll To Content
		array(
			'id'       => 'head-content-scroll',
			'type'     => 'switch',
			'title'    => esc_html__( 'Scroll To Content', 'mixt' ),
			'subtitle' => esc_html__( 'Show an arrow that scrolls down to the page content when clicked', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
		),

		// Post Info
		array(
			'id'       => 'head-content-info',
			'type'     => 'switch',
			'title'    => esc_html__( 'Post Info', 'mixt' ),
			'subtitle' => esc_html__( 'Show the post title and meta in the header', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
		),
	),
);

// LOCATION BAR
$this->sections[] = array(
	'title'           => esc_html__( 'Location Bar', 'mixt' ),
	'subsection'      => true,
	'customizer_only' => true,
	'fields'          => array(

		// On/Off Switch
		array(
			'id'       => 'location-bar',
			'type'     => 'switch',
			'title'    => esc_html__( 'Location Bar', 'mixt' ),
			'subtitle' => esc_html__( 'Display the location bar', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
		),

		// Background Color
		array(
			'id'       => 'loc-bar-bg-color',
			'type'     => 'color',
			'title'    => esc_html__( 'Background Color', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
		),

		// Background Pattern
		array(
			'id'       => 'loc-bar-bg-pat',
			'type'     => 'mixt_image_select',
			'title'    => esc_html__( 'Background Pattern', 'mixt' ),
			'options'  => $img_patterns,
			'empty'    => true,
		),

		// Text Color
		array(
			'id'       => 'loc-bar-text-color',
			'type'     => 'color',
			'title'    => esc_html__( 'Text Color', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
		),

		// Border Color
		array(
			'id'       => 'loc-bar-border-color',
			'type'     => 'color',
			'title'    => esc_html__( 'Border Color', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
		),

		// Right Side Content
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
		),

		// Breadcrumbs Prefix
		array(
			'id'       => 'breadcrumbs-prefix',
			'type'     => 'text',
			'title'    => esc_html__( 'Breadcrumbs Prefix', 'mixt' ),
			'subtitle' => esc_html__( 'Text to display before the breadcrumbs', 'mixt' ),
		),
	),
);


// THEMES

$this->sections[] = array(
	'id'              => 'mixt-themes',
	'title'           => esc_html__( 'Themes', 'mixt' ),
	'customizer_only' => true,
	'fields'          => array(

		// Site-Wide Theme Select
		array(
			'id'       => 'site-theme',
			'type'     => 'select',
			'title'    => esc_html__( 'Site Theme', 'mixt' ),
			'subtitle' => esc_html__( 'Select the theme to be used site-wide', 'mixt' ),
			'options'  => $site_themes,
		),

		// Navbar Theme Select
		array(
			'id'       => 'nav-theme',
			'type'     => 'select',
			'title'    => esc_html__( 'Navbar Theme', 'mixt' ),
			'subtitle' => esc_html__( 'Select the theme for the primary navbar', 'mixt' ),
			'options'  => $nav_themes,
		),

		// Secondary Navbar Theme Select
		array(
			'id'       => 'sec-nav-theme',
			'type'     => 'select',
			'title'    => esc_html__( 'Secondary Navbar Theme', 'mixt' ),
			'subtitle' => esc_html__( 'Select the theme for the secondary navbar', 'mixt' ),
			'options'  => $nav_themes,
		),

		// Footer Theme Select
		array(
			'id'       => 'footer-theme',
			'type'     => 'select',
			'title'    => esc_html__( 'Footer Theme', 'mixt' ),
			'subtitle' => esc_html__( 'Select the theme to be used for the footer', 'mixt' ),
			'options'  => $footer_themes,
		),
	),
);

if ( $themes_enabled ) {

	// SITE-WIDE THEMES
	$this->sections[] = array(
		'title'  => esc_html__( 'Site Themes', 'mixt' ),
		'desc'   => esc_html__( 'Create and manage site-wide themes.', 'mixt' ) . ' ' .
					esc_html__( 'Fields marked * can be left empty and their respective colors will be automatically generated.', 'mixt' ),
		'subsection'      => true,
		'customizer_only' => true,
		'fields'          => array(

			array(
				'id'       => 'site-themes',
				'type'     => 'mixt_multi_input',
				'no_title' => true,
				'add_text' => esc_html__( 'New Theme', 'mixt' ),
				'inputs'   => array(

					// Theme Name
					'name' => array(
						'type'       => 'text',
						'icon'       => 'el-icon-brush',
						'label'      => esc_html__( 'Theme Name', 'mixt' ),
						'wrap_class' => 'theme-name',
					),

					// Theme ID
					'id' => array(
						'type'       => 'group-id',
						'icon'       => 'el-icon-tags',
						'label'      => esc_html__( 'Theme ID', 'mixt' ),
						'wrap_class' => 'theme-id',
					),

					// Accent
					'accent' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Accent', 'mixt' ),
					),

					// Background Color
					'bg' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Background Color', 'mixt' ),
					),

					// Text Color
					'color' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Text Color', 'mixt' ),
					),

					// Text Color Fade
					'color-fade' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Text Color Fade', 'mixt' ) . ' *',
					),

					// Inverse Text Color
					'color-inv' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Inverse Text Color', 'mixt' ),
					),

					// Inverse Text Color Fade
					'color-inv-fade' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Inverse Text Fade', 'mixt' ) . ' *',
					),

					// Border Color
					'border' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Border Color', 'mixt' ),
					),

					// Inverse Background Color
					'bg-inv' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Inverse Background', 'mixt' ) . ' *',
					),

					// Alt Background Color
					'bg-alt' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Alt Background', 'mixt' ) . ' *',
					),

					// Alt Text Color
					'color-alt' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Alt Text Color', 'mixt' ) . ' *',
					),

					// Inverse Border Color
					'border-inv' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Inverse Border', 'mixt' ) . ' *',
					),

					// Alt Border Color
					'border-alt' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Alt Border', 'mixt' ) . ' *',
					),

					// Dark Background Check
					'bg-dark' => array(
						'type'       => 'checkbox',
						'label'      => esc_html__( 'Dark Background', 'mixt' ),
					),
				),
			),
		),
	);

	// NAVBAR THEMES
	$this->sections[] = array(
		'title'  => esc_html__( 'Navbar Themes', 'mixt' ),
		'desc'   => esc_html__( 'Create and manage themes for the navbar.', 'mixt' ) . ' ' .
					esc_html__( 'Fields marked * can be left empty and their respective colors will be automatically generated.', 'mixt' ),
		'subsection'      => true,
		'customizer_only' => true,
		'fields'          => array(
			array(
				'id'       => 'nav-themes',
				'type'     => 'mixt_multi_input',
				'no_title' => true,
				'add_text' => esc_html__( 'New Theme', 'mixt' ),
				'inputs'   => array(

					// Theme Name
					'name' => array(
						'type'       => 'text',
						'icon'       => 'el-icon-brush',
						'label'      => esc_html__( 'Theme Name', 'mixt' ),
						'wrap_class' => 'theme-name',
					),

					// Theme ID
					'id' => array(
						'type'       => 'group-id',
						'icon'       => 'el-icon-tags',
						'label'      => esc_html__( 'Theme ID', 'mixt' ),
						'wrap_class' => 'theme-id',
					),

					// Accent
					'accent' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Accent', 'mixt' ),
					),

					// Inverse Accent
					'accent-inv' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Inverse Accent', 'mixt' ) . ' *',
					),

					// Background Color
					'bg' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Background Color', 'mixt' ),
					),

					// Text Color
					'color' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Text Color', 'mixt' ),
					),

					// Inverse Text Color
					'color-inv' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Inverse Text Color', 'mixt' ),
					),

					// Border Color
					'border' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Border Color', 'mixt' ),
					),

					// Inverse Border Color
					'border-inv' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Inverse Border', 'mixt' ),
					),

					// Menu Background Color
					'menu-bg' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Menu Background', 'mixt' ) . ' *',
					),

					// Menu Text Color
					'menu-color' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Menu Text Color', 'mixt' ) . ' *',
					),

					// Menu Text Fade Color
					'menu-color-fade' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Menu Text Fade', 'mixt' ) . ' *',
					),

					// Menu Hover Background Color
					'menu-bg-hover' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Menu Hover Bg', 'mixt' ) . ' *',
					),

					// Menu Hover Text Color
					'menu-hover-color' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Menu Hover Text', 'mixt' ) . ' *',
					),

					// Menu Border Color
					'menu-border' => array(
						'type'  => 'color',
						'label' => esc_html__( 'Menu Border', 'mixt' ) . ' *',
					),

					// Dark Background Check
					'bg-dark' => array(
						'type'       => 'checkbox',
						'label'      => esc_html__( 'Dark Background', 'mixt' ),
					),

					// RGBA Check
					'rgba' => array(
						'type'       => 'checkbox',
						'label'      => esc_html__( 'Enable Opacity', 'mixt' ),
						'wrap_class' => 'rgba-field',
					),
				),
			),
		),
	);

}


// NAVBARS

$this->sections[] = array(
	'title'           => esc_html__( 'Navbars', 'mixt' ),
	'customizer_only' => true,
	'fields'          => array(),
);

// PRIMARY NAVBAR
$this->sections[] = array(
	'title'           => esc_html__( 'Primary Navbar', 'mixt' ),
	'subsection'      => true,
	'customizer_only' => true,
	'fields'          => array(

		// Layout
		array(
			'id'       => 'nav-layout',
			'type'     => 'button_set',
			'title'    => esc_html__( 'Layout', 'mixt' ),
			'subtitle' => esc_html__( 'Set the navbar layout (orientation)', 'mixt' ),
			'options'  => array(
				'horizontal' => esc_html__( 'Horizontal', 'mixt' ),
				'vertical'   => esc_html__( 'Vertical', 'mixt' ),
			),
		),

		// Vertical Position
		array(
			'id'       => 'nav-vertical-position',
			'type'     => 'button_set',
			'title'    => esc_html__( 'Vertical Position', 'mixt' ),
			'options'  => array(
				'left'  => esc_html__( 'Left', 'mixt' ),
				'right' => esc_html__( 'Right', 'mixt' ),
			),
		),

		// Logo Alignment
		array(
			'id'       => 'logo-align',
			'type'     => 'button_set',
			'title'    => esc_html__( 'Logo Alignment', 'mixt' ),
			'options'  => array(
				'1' => esc_html__( 'Left', 'mixt' ),
				'2' => esc_html__( 'Center', 'mixt' ),
				'3' => esc_html__( 'Right', 'mixt' ),
			),
		),

		// Texture
		array(
			'id'       => 'nav-texture',
			'type'     => 'mixt_image_select',
			'title'    => esc_html__( 'Texture', 'mixt' ),
			'options'  => $img_textures,
			'empty'    => true,
		),

		// Padding
		array(
			'id'       => 'nav-padding',
			'type'     => 'slider',
			'title'    => esc_html__( 'Padding', 'mixt' ),
			'subtitle' => esc_html__( 'Set the navbar\'s padding (in px) when at the top', 'mixt' ),
			'min'      => 0,
			'max'      => 50,
		),

		// Fixed Padding
		array(
			'id'       => 'nav-fixed-padding',
			'type'     => 'slider',
			'title'    => esc_html__( 'Padding When Fixed', 'mixt' ),
			'subtitle' => esc_html__( 'Set the navbar\'s padding (in px) when fixed', 'mixt' ),
			'min'      => 0,
			'max'      => 50,
		),

		// Opacity
		array(
			'id'         => 'nav-opacity',
			'type'       => 'slider',
			'title'      => esc_html__( 'Opacity', 'mixt' ),
			'subtitle'   => esc_html__( 'Set the navbar\'s opacity when fixed', 'mixt' ),
			'step'       => 0.05,
			'min'        => 0,
			'max'        => 1,
			'resolution' => 0.01,
		),

		// See-Through When Possible
		array(
			'id'       => 'nav-transparent',
			'type'     => 'switch',
			'title'    => esc_html__( 'See-Through', 'mixt' ),
			'subtitle' => esc_html__( 'Make navbar transparent (when possible)', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
		),

		// See-Through Opacity
		array(
			'id'         => 'nav-top-opacity',
			'type'       => 'slider',
			'title'      => esc_html__( 'See-Through Opacity', 'mixt' ),
			'subtitle'   => esc_html__( 'Set the navbar\'s see-through opacity', 'mixt' ),
			'step'       => 0.05,
			'min'        => 0,
			'max'        => 1,
			'resolution' => 0.01,
		),

		// Position
		array(
			'id'       => 'nav-position',
			'type'     => 'button_set',
			'title'    => esc_html__( 'Position', 'mixt' ),
			'subtitle' => esc_html__( 'Display navbar above or below header (when possible)', 'mixt' ),
			'options'  => array(
				'above' => esc_html__( 'Above', 'mixt' ),
				'below' => esc_html__( 'Below', 'mixt' ),
			),
		),

		// Hover Item Background
		array(
			'id'       => 'nav-hover-bg',
			'type'     => 'switch',
			'title'    => esc_html__( 'Hover Item Background', 'mixt' ),
			'subtitle' => esc_html__( 'Item background color on hover', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
		),

		// Active Item Bar
		array(
			'id'       => 'nav-active-bar',
			'type'     => 'switch',
			'title'    => esc_html__( 'Active Item Bar', 'mixt' ),
			'subtitle' => esc_html__( 'Show an accent bar for active menu items', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
		),

		// Active Item Bar Position
		array(
			'id'       => 'nav-active-bar-pos',
			'type'     => 'button_set',
			'title'    => esc_html__( 'Active Bar Position', 'mixt' ),
			'options'  => array(
				'top'    => esc_html__( 'Top', 'mixt' ),
				'left'   => esc_html__( 'Left', 'mixt' ),
				'right'  => esc_html__( 'Right', 'mixt' ),
				'bottom' => esc_html__( 'Bottom', 'mixt' ),
			),
		),

		// Border Items
		array(
			'id'       => 'nav-bordered',
			'type'     => 'switch',
			'title'    => esc_html__( 'Border Items', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
		),
	),
);

// SECONDARY NAVBAR
$this->sections[] = array(
	'title'           => esc_html__( 'Secondary Navbar', 'mixt' ),
	'subsection'      => true,
	'customizer_only' => true,
	'fields'          => array(

		// On/Off Switch
		array(
			'id'       => 'second-nav',
			'type'     => 'switch',
			'title'    => esc_html__( 'Enable Secondary Navbar', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
		),

		// Texture
		array(
			'id'       => 'sec-nav-texture',
			'type'     => 'mixt_image_select',
			'title'    => esc_html__( 'Texture', 'mixt' ),
			'options'  => $img_textures,
			'empty'    => true,
		),

		// Hover Item Background
		array(
			'id'       => 'sec-nav-hover-bg',
			'type'     => 'switch',
			'title'    => esc_html__( 'Hover Item Background', 'mixt' ),
			'subtitle' => esc_html__( 'Item background color on hover', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
		),

		// Active Item Bar
		array(
			'id'       => 'sec-nav-active-bar',
			'type'     => 'switch',
			'title'    => esc_html__( 'Active Item Bar', 'mixt' ),
			'subtitle' => esc_html__( 'Show an accent bar for active menu items', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
		),

		// Active Item Bar Position
		array(
			'id'       => 'sec-nav-active-bar-pos',
			'type'     => 'button_set',
			'title'    => esc_html__( 'Active Bar Position', 'mixt' ),
			'options'  => array(
				'top'    => esc_html__( 'Top', 'mixt' ),
				'left'   => esc_html__( 'Left', 'mixt' ),
				'right'  => esc_html__( 'Right', 'mixt' ),
				'bottom' => esc_html__( 'Bottom', 'mixt' ),
			),
		),

		// Border Items
		array(
			'id'       => 'sec-nav-bordered',
			'type'     => 'switch',
			'title'    => esc_html__( 'Border Items', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
		),

		// Left Side Content
		array(
			'id'       => 'sec-nav-left-content',
			'type'     => 'select',
			'title'    => esc_html__( 'Left Side Content', 'mixt' ),
			'subtitle' => esc_html__( 'Content to show on the left side of the navbar', 'mixt' ),
			'options'  => array(
				'0' => esc_html__( 'No Content', 'mixt' ),
				'1' => esc_html__( 'Navigation', 'mixt' ),
				'2' => esc_html__( 'Social Icons', 'mixt' ),
				'3' => esc_html__( 'Custom Text / Code', 'mixt' ),
			),
		),

		// Left Side Code
		array(
			'id'           => 'sec-nav-left-code',
			'type'         => 'textarea',
			'title'        => esc_html__( 'Left Side Code', 'mixt' ),
			'subtitle'     => esc_html__( 'Text or code to display on the left side', 'mixt' ),
			'allowed_html' => $text_allowed_html,
			'placeholder'  => $text_code_placeholder,
		),

		// Left Side Hide On Mobile
		array(
			'id'       => 'sec-nav-left-hide',
			'type'     => 'switch',
			'title'    => esc_html__( 'Hide Left Side On Mobile', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
		),

		// Right Side Content
		array(
			'id'       => 'sec-nav-right-content',
			'type'     => 'select',
			'title'    => esc_html__( 'Right Side Content', 'mixt' ),
			'subtitle' => esc_html__( 'Content to show on the right side of the navbar', 'mixt' ),
			'options'  => array(
				'0' => esc_html__( 'No Content', 'mixt' ),
				'1' => esc_html__( 'Navigation', 'mixt' ),
				'2' => esc_html__( 'Social Icons', 'mixt' ),
				'3' => esc_html__( 'Custom Text / Code', 'mixt' ),
			),
		),

		// Right Side Code
		array(
			'id'           => 'sec-nav-right-code',
			'type'         => 'textarea',
			'title'        => esc_html__( 'Right Side Code', 'mixt' ),
			'subtitle'     => esc_html__( 'Text or code to display on the right side', 'mixt' ),
			'allowed_html' => $text_allowed_html,
			'placeholder'  => $text_code_placeholder,
		),

		// Right Side Hide On Mobile
		array(
			'id'       => 'sec-nav-right-hide',
			'type'     => 'switch',
			'title'    => esc_html__( 'Hide Right Side On Mobile', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
		),
	),
);


// FOOTER

$this->sections[] = array(
	'title'           => esc_html__( 'Footer', 'mixt' ),
	'customizer_only' => true,
	'fields'          => array(),
);

// FOOTER WIDGET AREA
$this->sections[] = array(
	'title'           => esc_html__( 'Widget Area', 'mixt' ),
	'customizer_only' => true,
	'subsection'      => true,
	'fields'          => array(
		
		// Background Color
		array(
			'id'       => 'footer-widgets-bg-color',
			'type'     => 'color',
			'title'    => esc_html__( 'Background Color', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
		),

		// Background Pattern
		array(
			'id'       => 'footer-widgets-bg-pat',
			'type'     => 'mixt_image_select',
			'title'    => esc_html__( 'Background Pattern', 'mixt' ),
			'options'  => $img_patterns,
			'empty'    => true,
		),

		// Text Color
		array(
			'id'       => 'footer-widgets-text-color',
			'type'     => 'color',
			'title'    => esc_html__( 'Text Color', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
		),

		// Text Color
		array(
			'id'       => 'footer-widgets-border-color',
			'type'     => 'color',
			'title'    => esc_html__( 'Border Color', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
		),
	),
);

// FOOTER COPYRIGHT AREA
$this->sections[] = array(
	'title'           => esc_html__( 'Copyright Area', 'mixt' ),
	'customizer_only' => true,
	'subsection'      => true,
	'fields'          => array(
		
		// Background Color
		array(
			'id'       => 'footer-copy-bg-color',
			'type'     => 'color',
			'title'    => esc_html__( 'Background Color', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
		),

		// Background Pattern
		array(
			'id'       => 'footer-copy-bg-pat',
			'type'     => 'mixt_image_select',
			'title'    => esc_html__( 'Background Pattern', 'mixt' ),
			'options'  => $img_patterns,
			'empty'    => true,
		),

		// Text Color
		array(
			'id'       => 'footer-copy-text-color',
			'type'     => 'color',
			'title'    => esc_html__( 'Text Color', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
		),

		// Text Color
		array(
			'id'       => 'footer-copy-border-color',
			'type'     => 'color',
			'title'    => esc_html__( 'Border Color', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
		),

		// Left Side Content
		array(
			'id'       => 'footer-left-content',
			'type'     => 'select',
			'title'    => esc_html__( 'Left Side Content', 'mixt' ),
			'subtitle' => esc_html__( 'Content to show on the left side of the footer', 'mixt' ),
			'options'  => array(
				'0' => esc_html__( 'No Content', 'mixt' ),
				'1' => esc_html__( 'Social Icons', 'mixt' ),
				'2' => esc_html__( 'Custom Text / Code', 'mixt' ),
			),
		),

		// Left Side Code
		array(
			'id'           => 'footer-left-code',
			'type'         => 'textarea',
			'title'        => esc_html__( 'Left Side Code', 'mixt' ),
			'subtitle'     => esc_html__( 'Text or code to display on the left side', 'mixt' ),
			'allowed_html' => $text_allowed_html,
			'placeholder'  => $text_code_placeholder,
			'required'     => array('footer-left-content', '=', '2'),
		),

		// Right Side Content
		array(
			'id'       => 'footer-right-content',
			'type'     => 'select',
			'title'    => esc_html__( 'Right Side Content', 'mixt' ),
			'subtitle' => esc_html__( 'Content to show on the right side of the footer', 'mixt' ),
			'options'  => array(
				'0' => esc_html__( 'No Content', 'mixt' ),
				'1' => esc_html__( 'Social Icons', 'mixt' ),
				'2' => esc_html__( 'Custom Text / Code', 'mixt' ),
			),
		),

		// Right Side Code
		array(
			'id'           => 'footer-right-code',
			'type'         => 'textarea',
			'title'        => esc_html__( 'Right Side Code', 'mixt' ),
			'subtitle'     => esc_html__( 'Text or code to display on the right side', 'mixt' ),
			'allowed_html' => $text_allowed_html,
			'placeholder'  => $text_code_placeholder,
			'required'     => array('footer-right-content', '=', '2'),
		),
	),
);