<?php

// REDUX CUSTOMIZER FIELDS

// GLOBAL OPTIONS SECTION

$this->sections[] = array(
	'title'           => __( 'Global', 'mixt' ),
	'customizer_only' => true,
	'fields'          => array(

		// Site Layout
		array(
			'id'       => 'site-layout',
			'type'     => 'button_set',
			'title'    => __( 'Site Layout', 'mixt' ),
			'subtitle' => __( 'Choose the layout for the site', 'mixt' ),
			'options'  => array(
				'wide'  => __( 'Wide', 'mixt' ),
				'boxed' => __( 'Boxed', 'mixt' ),
			),
		),

		// Site Background Color
		array(
			'id'          => 'site-bg-color',
			'type'        => 'color',
			'title'       => __( 'Background Color (Boxed)', 'mixt' ),
			'subtitle'    => __( 'Select the site background color', 'mixt' ),
			'transparent' => false,
			'validate'    => 'color',
		),

		// Site Background Pattern
		array(
			'id'       => 'site-bg-pat',
			'type'     => 'mixt_image_select',
			'title'    => __( 'Background Pattern (Boxed)', 'mixt' ),
			'subtitle' => __( 'The site\'s background pattern', 'mixt' ),
			'options'  => $img_patterns,
			'empty'    => true,
		),

		// Page Loader
		array(
			'id'       => 'page-loader',
			'type'     => 'switch',
			'title'    => __( 'Page Loader', 'mixt' ),
			'subtitle' => __( 'Enable page loader to show animations when loading site', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
		),

		// Page Loader Type
		array(
			'id'       => 'page-loader-type',
			'type'     => 'button_set',
			'title'    => __( 'Loader Type', 'mixt' ),
			'subtitle' => __( 'Use a shape or image for the loader', 'mixt' ),
			'options'  => array(
				'1' => __( 'Shape', 'mixt' ),
				'2' => __( 'Image', 'mixt' ),
			),
		),

		// Page Loader Shape Select
		array(
			'id'       => 'page-loader-shape',
			'type'     => 'select',
			'title'    => __( 'Loader Shape', 'mixt' ),
			'subtitle' => __( 'Shape to use for the loader', 'mixt' ),
			'options'  => array(
				'circle'  => __( 'Circle', 'mixt' ),
				'ring'    => __( 'Ring', 'mixt' ),
				'square'  => __( 'Square', 'mixt' ),
				'square2' => __( 'Empty Square', 'mixt' ),
			),
		),

		// Page Loader Shape Color Select
		array(
			'id'          => 'page-loader-color',
			'type'        => 'color',
			'title'       => __( 'Loader Shape Color', 'mixt' ),
			'subtitle'    => __( 'Select a loader shape color', 'mixt' ),
			'transparent' => false,
			'validate'    => 'color',
		),

		// Page Loader Image Select
		array(
			'id'       => 'page-loader-img',
			'type'     => 'media',
			'url'      => false,
			'title'    => __( 'Loader Image', 'mixt' ),
			'subtitle' => __( 'Image to use for the loader', 'mixt' ),
		),

		// Page Loader Background Color Select
		array(
			'id'          => 'page-loader-bg',
			'type'        => 'color',
			'title'       => __( 'Loader Background Color', 'mixt' ),
			'subtitle'    => __( 'The page loader background color', 'mixt' ),
			'transparent' => false,
			'validate'    => 'color',
		),

		// Page Loader Animation Select
		array(
			'id'       => 'page-loader-anim',
			'type'     => 'select',
			'title'    => __( 'Loader Animation', 'mixt' ),
			'subtitle' => __( 'Animation to use for the loader', 'mixt' ),
			'options'  => $page_loader_anims,
		),
	),
);


// HEADER SECTION

$this->sections[] = array(
	'title'           => __( 'Header', 'mixt' ),
	'customizer_only' => true,
	'fields'          => array(),
);

// HEADER MEDIA SECTION
$this->sections[] = array(
	'title'           => __( 'Header Media', 'mixt' ),
	'subsection'      => true,
	'customizer_only' => true,
	'fields'          => array(

		// Enable
		array(
			'id'       => 'head-media',
			'type'     => 'switch',
			'title'    => __( 'Enabled', 'mixt' ),
			'subtitle' => __( 'Display the header media element on all pages where possible', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
		),

		// Fullscreen
		array(
			'id'       => 'head-fullscreen',
			'type'     => 'switch',
			'title'    => __( 'Fullscreen', 'mixt' ),
			'subtitle' => __( 'Header fills entire screen size', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
		),

		// Height
		array(
			'id'       => 'head-height',
			'type'     => 'text',
			'title'    => __( 'Custom Height', 'mixt' ),
			'subtitle' => __( 'Set a custom height (in px) for the header', 'mixt' ),
		),

		// Background Color
		array(
			'id'       => 'head-bg-color',
			'type'     => 'color',
			'title'    => __( 'Background Color', 'mixt' ),
			'subtitle' => __( 'Select a background color for the header', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
		),

		// Text Color
		array(
			'id'       => 'head-text-color',
			'type'     => 'color',
			'title'    => __( 'Text Color', 'mixt' ),
			'subtitle' => __( 'The color for text on light backgrounds', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
		),

		// Background Color
		array(
			'id'       => 'head-inv-text-color',
			'type'     => 'color',
			'title'    => __( 'Inverse Text Color', 'mixt' ),
			'subtitle' => __( 'The color for text on dark backgrounds', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
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
		),
	),
);

// HEADER MEDIA IMAGE SECTION
$this->sections[] = array(
	'title'  => __( 'Header Image', 'mixt' ),
	'subsection'      => true,
	'customizer_only' => true,
	'fields'          => array(

		// Image Placeholder
		array(
			'id'             => 'head-img-ph',
			'type'           => 'media',
			'title'          => __( 'Image Placeholder', 'mixt' ),
			'subtitle'       => __( 'Select a placeholder image to show if the desired image can\'t be found', 'mixt' ),
			'mode'           => 'jpg, jpeg, png',
			'library_filter' => array('jpg', 'jpeg', 'png'),
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
		),

		// Image Select
		array(
			'id'       => 'head-img',
			'type'     => 'media',
			'title'    => __( 'Select Image', 'mixt' ),
			'subtitle' => __( 'Select an image from the gallery or upload one', 'mixt' ),
		),

		// Repeat / Pattern Image
		array(
			'id'      => 'head-img-repeat',
			'type'    => 'switch',
			'title'   => __( 'Repeat / Pattern Image', 'mixt' ),
			'on'      => __( 'Yes', 'mixt' ),
			'off'     => __( 'No', 'mixt' ),
		),

		// Parallax Effect
		array(
			'id'      => 'head-img-parallax',
			'type'    => 'switch',
			'title'   => __( 'Parallax Effect', 'mixt' ),
			'on'      => __( 'Yes', 'mixt' ),
			'off'     => __( 'No', 'mixt' ),
		),
	),
);

// HEADER MEDIA VIDEO SECTION
$this->sections[] = array(
	'title'  => __( 'Header Video', 'mixt' ),
	'subsection'      => true,
	'customizer_only' => true,
	'fields'          => array(

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
		),

		// Video Poster
		array(
			'id'             => 'head-video-poster',
			'type'           => 'media',
			'title'          => __( 'Video Poster', 'mixt' ),
			'subtitle'       => __( 'Select an image to show while the video loads or if video is not supported', 'mixt' ),
			'mode'           => 'jpg, jpeg, png',
			'library_filter' => array('jpg', 'jpeg', 'png'),
		),

		// Video Loop
		array(
			'id'      => 'head-video-loop',
			'type'    => 'switch',
			'title'   => __( 'Video Loop', 'mixt' ),
			'on'      => __( 'Yes', 'mixt' ),
			'off'     => __( 'No', 'mixt' ),
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
		),
	),
);

// HEADER MEDIA SLIDER SECTION
$this->sections[] = array(
	'title'  => __( 'Header Slider', 'mixt' ),
	'subsection'      => true,
	'customizer_only' => true,
	'fields'          => array(

		// Slider ID
		array(
			'id'       => 'head-slider',
			'type'     => 'text',
			'title'    => __( 'Slider ID', 'mixt' ),
			'subtitle' => __( 'The ID of the slider to use', 'mixt' ),
		),
	),
);

// HEADER MEDIA CONTENT SECTION
$this->sections[] = array(
	'title'  => __( 'Header Content', 'mixt' ),
	'subsection'      => true,
	'customizer_only' => true,
	'fields'          => array(

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
		),

		// Content Fade Effect
		array(
			'id'      => 'head-content-fade',
			'type'    => 'switch',
			'title'   => __( 'Content Fade Effect', 'mixt' ),
			'on'      => __( 'Yes', 'mixt' ),
			'off'     => __( 'No', 'mixt' ),
		),

		// Scroll To Content
		array(
			'id'       => 'head-content-scroll',
			'type'     => 'switch',
			'title'    => __( 'Scroll To Content', 'mixt' ),
			'subtitle' => __( 'Show an arrow that scrolls down to the page content when clicked', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
		),

		// Post Info
		array(
			'id'       => 'head-content-info',
			'type'     => 'switch',
			'title'    => __( 'Post Info', 'mixt' ),
			'subtitle' => __( 'Show the post title and meta in the header', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
		),
	),
);

// LOCATION BAR SECTION
$this->sections[] = array(
	'title'  => __( 'Location Bar', 'mixt' ),
	'subsection'      => true,
	'customizer_only' => true,
	'fields'          => array(

		// On/Off Switch
		array(
			'id'       => 'location-bar',
			'type'     => 'switch',
			'title'    => __( 'Location Bar', 'mixt' ),
			'subtitle' => __( 'Display the location bar', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
		),

		// Background Color
		array(
			'id'       => 'loc-bar-bg-color',
			'type'     => 'color',
			'title'    => __( 'Background Color', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
		),

		// Background Pattern
		array(
			'id'       => 'loc-bar-bg-pat',
			'type'     => 'mixt_image_select',
			'title'    => __( 'Background Pattern', 'mixt' ),
			'options'  => $img_patterns,
			'empty'    => true,
		),

		// Text Color
		array(
			'id'       => 'loc-bar-text-color',
			'type'     => 'color',
			'title'    => __( 'Text Color', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
		),

		// Border Color
		array(
			'id'       => 'loc-bar-border-color',
			'type'     => 'color',
			'title'    => __( 'Border Color', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
		),

		// Right Side Content
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
		),

		// Breadcrumbs Prefix
		array(
			'id'       => 'breadcrumbs-prefix',
			'type'     => 'text',
			'title'    => __( 'Breadcrumbs Prefix', 'mixt' ),
			'subtitle' => __( 'Text to display before the breadcrumbs', 'mixt' ),
		),
	),
);


// THEMES SECTION

$this->sections[] = array(
	'id'              => 'mixt-themes',
	'title'           => __( 'Themes', 'mixt' ),
	'customizer_only' => true,
	'fields'          => array(

		// Site-Wide Theme Select
		array(
			'id'       => 'site-theme',
			'type'     => 'select',
			'title'    => __( 'Site Theme', 'mixt' ),
			'subtitle' => __( 'Select the theme to be used site-wide', 'mixt' ),
			'options'  => $site_themes,
		),

		// Navbar Theme Select
		array(
			'id'       => 'nav-theme',
			'type'     => 'select',
			'title'    => __( 'Navbar Theme', 'mixt' ),
			'subtitle' => __( 'Select the theme for the primary navbar', 'mixt' ),
			'options'  => $nav_themes,
		),

		// Secondary Navbar Theme Select
		array(
			'id'       => 'sec-nav-theme',
			'type'     => 'select',
			'title'    => __( 'Secondary Navbar Theme', 'mixt' ),
			'subtitle' => __( 'Select the theme for the secondary navbar', 'mixt' ),
			'options'  => $nav_themes,
		),

		// Footer Theme Select
		array(
			'id'       => 'footer-theme',
			'type'     => 'select',
			'title'    => __( 'Footer Theme', 'mixt' ),
			'subtitle' => __( 'Select the theme to be used for the footer', 'mixt' ),
			'options'  => $footer_themes,
		),
	),
);

if ( $themes_enabled ) {

	// SITE-WIDE THEMES SECTION
	$this->sections[] = array(
		'title'  => __( 'Site Themes', 'mixt' ),
		'desc'   => __( 'Create and manage site-wide themes.', 'mixt' ) . ' ' .
					__( 'Fields marked * can be left empty and their respective colors will be automatically generated.', 'mixt' ),
		'subsection'      => true,
		'customizer_only' => true,
		'fields'          => array(

			array(
				'id'       => 'site-themes',
				'type'     => 'mixt_multi_input',
				'no_title' => true,
				'add_text' => __( 'New Theme', 'mixt' ),
				'inputs'   => array(

					// Theme Name
					'name' => array(
						'type'       => 'text',
						'icon'       => 'el-icon-brush',
						'label'      => __( 'Theme Name', 'mixt' ),
						'wrap_class' => 'theme-name',
					),

					// Theme ID
					'id' => array(
						'type'       => 'group-id',
						'icon'       => 'el-icon-tags',
						'label'      => __( 'Theme ID', 'mixt' ),
						'wrap_class' => 'theme-id',
					),

					// Accent
					'accent' => array(
						'type'  => 'color',
						'label' => __( 'Accent', 'mixt' ),
					),

					// Background Color
					'bg' => array(
						'type'  => 'color',
						'label' => __( 'Background Color', 'mixt' ),
					),

					// Text Color
					'color' => array(
						'type'  => 'color',
						'label' => __( 'Text Color', 'mixt' ),
					),

					// Text Color Fade
					'color-fade' => array(
						'type'  => 'color',
						'label' => __( 'Text Color Fade', 'mixt' ) . ' *',
					),

					// Inverse Text Color
					'color-inv' => array(
						'type'  => 'color',
						'label' => __( 'Inverse Text Color', 'mixt' ),
					),

					// Inverse Text Color Fade
					'color-inv-fade' => array(
						'type'  => 'color',
						'label' => __( 'Inverse Text Fade', 'mixt' ) . ' *',
					),

					// Border Color
					'border' => array(
						'type'  => 'color',
						'label' => __( 'Border Color', 'mixt' ),
					),

					// Inverse Background Color
					'bg-inv' => array(
						'type'  => 'color',
						'label' => __( 'Inverse Background', 'mixt' ) . ' *',
					),

					// Alt Background Color
					'bg-alt' => array(
						'type'  => 'color',
						'label' => __( 'Alt Background', 'mixt' ) . ' *',
					),

					// Alt Text Color
					'color-alt' => array(
						'type'  => 'color',
						'label' => __( 'Alt Text Color', 'mixt' ) . ' *',
					),

					// Inverse Border Color
					'border-inv' => array(
						'type'  => 'color',
						'label' => __( 'Inverse Border', 'mixt' ) . ' *',
					),

					// Alt Border Color
					'border-alt' => array(
						'type'  => 'color',
						'label' => __( 'Alt Border', 'mixt' ) . ' *',
					),

					// Dark Background Check
					'bg-dark' => array(
						'type'       => 'checkbox',
						'label'      => __( 'Dark Background', 'mixt' ),
					),
				),
			),
		),
	);

	// NAVBAR THEMES SECTION
	$this->sections[] = array(
		'title'  => __( 'Navbar Themes', 'mixt' ),
		'desc'   => __( 'Create and manage themes for the navbar.', 'mixt' ) . ' ' .
					__( 'Fields marked * can be left empty and their respective colors will be automatically generated.', 'mixt' ),
		'subsection'      => true,
		'customizer_only' => true,
		'fields'          => array(
			array(
				'id'       => 'nav-themes',
				'type'     => 'mixt_multi_input',
				'no_title' => true,
				'add_text' => __( 'New Theme', 'mixt' ),
				'inputs'   => array(

					// Theme Name
					'name' => array(
						'type'       => 'text',
						'icon'       => 'el-icon-brush',
						'label'      => __( 'Theme Name', 'mixt' ),
						'wrap_class' => 'theme-name',
					),

					// Theme ID
					'id' => array(
						'type'       => 'group-id',
						'icon'       => 'el-icon-tags',
						'label'      => __( 'Theme ID', 'mixt' ),
						'wrap_class' => 'theme-id',
					),

					// Accent
					'accent' => array(
						'type'  => 'color',
						'label' => __( 'Accent', 'mixt' ),
					),

					// Inverse Accent
					'accent-inv' => array(
						'type'  => 'color',
						'label' => __( 'Inverse Accent', 'mixt' ) . ' *',
					),

					// Background Color
					'bg' => array(
						'type'  => 'color',
						'label' => __( 'Background Color', 'mixt' ),
					),

					// Text Color
					'color' => array(
						'type'  => 'color',
						'label' => __( 'Text Color', 'mixt' ),
					),

					// Inverse Text Color
					'color-inv' => array(
						'type'  => 'color',
						'label' => __( 'Inverse Text Color', 'mixt' ),
					),

					// Border Color
					'border' => array(
						'type'  => 'color',
						'label' => __( 'Border Color', 'mixt' ),
					),

					// Inverse Border Color
					'border-inv' => array(
						'type'  => 'color',
						'label' => __( 'Inverse Border', 'mixt' ),
					),

					// Menu Background Color
					'menu-bg' => array(
						'type'  => 'color',
						'label' => __( 'Menu Background', 'mixt' ) . ' *',
					),

					// Menu Text Color
					'menu-color' => array(
						'type'  => 'color',
						'label' => __( 'Menu Text Color', 'mixt' ) . ' *',
					),

					// Menu Text Fade Color
					'menu-color-fade' => array(
						'type'  => 'color',
						'label' => __( 'Menu Text Fade', 'mixt' ) . ' *',
					),

					// Menu Hover Background Color
					'menu-bg-hover' => array(
						'type'  => 'color',
						'label' => __( 'Menu Hover Bg', 'mixt' ) . ' *',
					),

					// Menu Hover Text Color
					'menu-hover-color' => array(
						'type'  => 'color',
						'label' => __( 'Menu Hover Text', 'mixt' ) . ' *',
					),

					// Menu Border Color
					'menu-border' => array(
						'type'  => 'color',
						'label' => __( 'Menu Border', 'mixt' ) . ' *',
					),

					// Dark Background Check
					'bg-dark' => array(
						'type'       => 'checkbox',
						'label'      => __( 'Dark Background', 'mixt' ),
					),

					// RGBA Check
					'rgba' => array(
						'type'       => 'checkbox',
						'label'      => __( 'Enable Opacity', 'mixt' ),
						'wrap_class' => 'rgba-field',
					),
				),
			),
		),
	);

}


// NAVBARS SECTION

$this->sections[] = array(
	'title'           => __( 'Navbars', 'mixt' ),
	'customizer_only' => true,
	'fields'          => array(),
);

// PRIMARY NAVBAR SECTION
$this->sections[] = array(
	'title'           => __( 'Primary Navbar', 'mixt' ),
	'subsection'      => true,
	'customizer_only' => true,
	'fields'          => array(

		// Layout
		array(
			'id'       => 'nav-layout',
			'type'     => 'button_set',
			'title'    => __( 'Layout', 'mixt' ),
			'subtitle' => __( 'Set the navbar layout (orientation)', 'mixt' ),
			'options'  => array(
				'horizontal' => __( 'Horizontal', 'mixt' ),
				'vertical'   => __( 'Vertical', 'mixt' ),
			),
		),

		// Vertical Position
		array(
			'id'       => 'nav-vertical-position',
			'type'     => 'button_set',
			'title'    => __( 'Vertical Position', 'mixt' ),
			'options'  => array(
				'left'  => __( 'Left', 'mixt' ),
				'right' => __( 'Right', 'mixt' ),
			),
		),

		// Logo Alignment
		array(
			'id'       => 'logo-align',
			'type'     => 'button_set',
			'title'    => __( 'Logo Alignment', 'mixt' ),
			'options'  => array(
				'1' => __( 'Left', 'mixt' ),
				'2' => __( 'Center', 'mixt' ),
				'3' => __( 'Right', 'mixt' ),
			),
		),

		// Texture
		array(
			'id'       => 'nav-texture',
			'type'     => 'mixt_image_select',
			'title'    => __( 'Texture', 'mixt' ),
			'options'  => $img_textures,
			'empty'    => true,
		),

		// Padding
		array(
			'id'       => 'nav-padding',
			'type'     => 'slider',
			'title'    => __( 'Padding', 'mixt' ),
			'subtitle' => __( 'Set the navbar\'s padding (in px) when at the top', 'mixt' ),
			'min'      => 0,
			'max'      => 50,
		),

		// Fixed Padding
		array(
			'id'       => 'nav-fixed-padding',
			'type'     => 'slider',
			'title'    => __( 'Padding When Fixed', 'mixt' ),
			'subtitle' => __( 'Set the navbar\'s padding (in px) when fixed', 'mixt' ),
			'min'      => 0,
			'max'      => 50,
		),

		// Opacity
		array(
			'id'         => 'nav-opacity',
			'type'       => 'slider',
			'title'      => __( 'Opacity', 'mixt' ),
			'subtitle'   => __( 'Set the navbar\'s opacity when fixed', 'mixt' ),
			'step'       => 0.05,
			'min'        => 0,
			'max'        => 1,
			'resolution' => 0.01,
		),

		// See-Through When Possible
		array(
			'id'       => 'nav-transparent',
			'type'     => 'switch',
			'title'    => __( 'See-Through', 'mixt' ),
			'subtitle' => __( 'Make navbar transparent (when possible)', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
		),

		// See-Through Opacity
		array(
			'id'         => 'nav-top-opacity',
			'type'       => 'slider',
			'title'      => __( 'See-Through Opacity', 'mixt' ),
			'subtitle'   => __( 'Set the navbar\'s see-through opacity', 'mixt' ),
			'step'       => 0.05,
			'min'        => 0,
			'max'        => 1,
			'resolution' => 0.01,
		),

		// Position
		array(
			'id'       => 'nav-position',
			'type'     => 'button_set',
			'title'    => __( 'Position', 'mixt' ),
			'subtitle' => __( 'Display navbar above or below header (when possible)', 'mixt' ),
			'options'  => array(
				'above' => __( 'Above', 'mixt' ),
				'below' => __( 'Below', 'mixt' ),
			),
		),

		// Hover Item Background
		array(
			'id'       => 'nav-hover-bg',
			'type'     => 'switch',
			'title'    => __( 'Hover Item Background', 'mixt' ),
			'subtitle' => __( 'Item background color on hover', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
		),

		// Active Item Bar
		array(
			'id'       => 'nav-active-bar',
			'type'     => 'switch',
			'title'    => __( 'Active Item Bar', 'mixt' ),
			'subtitle' => __( 'Show an accent bar for active menu items', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
		),

		// Active Item Bar Position
		array(
			'id'       => 'nav-active-bar-pos',
			'type'     => 'button_set',
			'title'    => __( 'Active Bar Position', 'mixt' ),
			'options'  => array(
				'top'    => __( 'Top', 'mixt' ),
				'left'   => __( 'Left', 'mixt' ),
				'right'  => __( 'Right', 'mixt' ),
				'bottom' => __( 'Bottom', 'mixt' ),
			),
		),

		// Border Items
		array(
			'id'       => 'nav-bordered',
			'type'     => 'switch',
			'title'    => __( 'Border Items', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
		),
	),
);

// SECONDARY NAVBAR SECTION
$this->sections[] = array(
	'title'           => __( 'Secondary Navbar', 'mixt' ),
	'subsection'      => true,
	'customizer_only' => true,
	'fields'          => array(

		// On/Off Switch
		array(
			'id'       => 'second-nav',
			'type'     => 'switch',
			'title'    => __( 'Enable Secondary Navbar', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
		),

		// Texture
		array(
			'id'       => 'sec-nav-texture',
			'type'     => 'mixt_image_select',
			'title'    => __( 'Texture', 'mixt' ),
			'options'  => $img_textures,
			'empty'    => true,
		),

		// Hover Item Background
		array(
			'id'       => 'sec-nav-hover-bg',
			'type'     => 'switch',
			'title'    => __( 'Hover Item Background', 'mixt' ),
			'subtitle' => __( 'Item background color on hover', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
		),

		// Active Item Bar
		array(
			'id'       => 'sec-nav-active-bar',
			'type'     => 'switch',
			'title'    => __( 'Active Item Bar', 'mixt' ),
			'subtitle' => __( 'Show an accent bar for active menu items', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
		),

		// Active Item Bar Position
		array(
			'id'       => 'sec-nav-active-bar-pos',
			'type'     => 'button_set',
			'title'    => __( 'Active Bar Position', 'mixt' ),
			'options'  => array(
				'top'    => __( 'Top', 'mixt' ),
				'left'   => __( 'Left', 'mixt' ),
				'right'  => __( 'Right', 'mixt' ),
				'bottom' => __( 'Bottom', 'mixt' ),
			),
		),

		// Border Items
		array(
			'id'       => 'sec-nav-bordered',
			'type'     => 'switch',
			'title'    => __( 'Border Items', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
		),

		// Left Side Content
		array(
			'id'       => 'sec-nav-left-content',
			'type'     => 'select',
			'title'    => __( 'Left Side Content', 'mixt' ),
			'subtitle' => __( 'Content to show on the left side of the navbar', 'mixt' ),
			'options'  => array(
				'0' => __( 'No Content', 'mixt' ),
				'1' => __( 'Navigation', 'mixt' ),
				'2' => __( 'Social Icons', 'mixt' ),
				'3' => __( 'Custom Text / Code', 'mixt' ),
			),
		),

		// Left Side Code
		array(
			'id'           => 'sec-nav-left-code',
			'type'         => 'textarea',
			'title'        => __( 'Left Side Code', 'mixt' ),
			'subtitle'     => __( 'Text or code to display on the left side', 'mixt' ),
			'allowed_html' => $text_allowed_html,
			'placeholder'  => $text_code_placeholder,
		),

		// Left Side Hide On Mobile
		array(
			'id'       => 'sec-nav-left-hide',
			'type'     => 'switch',
			'title'    => __( 'Hide Left Side On Mobile', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
		),

		// Right Side Content
		array(
			'id'       => 'sec-nav-right-content',
			'type'     => 'select',
			'title'    => __( 'Right Side Content', 'mixt' ),
			'subtitle' => __( 'Content to show on the right side of the navbar', 'mixt' ),
			'options'  => array(
				'0' => __( 'No Content', 'mixt' ),
				'1' => __( 'Navigation', 'mixt' ),
				'2' => __( 'Social Icons', 'mixt' ),
				'3' => __( 'Custom Text / Code', 'mixt' ),
			),
		),

		// Right Side Code
		array(
			'id'           => 'sec-nav-right-code',
			'type'         => 'textarea',
			'title'        => __( 'Right Side Code', 'mixt' ),
			'subtitle'     => __( 'Text or code to display on the right side', 'mixt' ),
			'allowed_html' => $text_allowed_html,
			'placeholder'  => $text_code_placeholder,
		),

		// Right Side Hide On Mobile
		array(
			'id'       => 'sec-nav-right-hide',
			'type'     => 'switch',
			'title'    => __( 'Hide Right Side On Mobile', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
		),
	),
);


// FOOTER SECTION

$this->sections[] = array(
	'title'           => __( 'Footer', 'mixt' ),
	'customizer_only' => true,
	'fields'          => array(),
);

// FOOTER WIDGET AREA SECTION
$this->sections[] = array(
	'title'           => __( 'Widget Area', 'mixt' ),
	'customizer_only' => true,
	'subsection'      => true,
	'fields'          => array(
		
		// Background Color
		array(
			'id'       => 'footer-widgets-bg-color',
			'type'     => 'color',
			'title'    => __( 'Background Color', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
		),

		// Background Pattern
		array(
			'id'       => 'footer-widgets-bg-pat',
			'type'     => 'mixt_image_select',
			'title'    => __( 'Background Pattern', 'mixt' ),
			'options'  => $img_patterns,
			'empty'    => true,
		),

		// Text Color
		array(
			'id'       => 'footer-widgets-text-color',
			'type'     => 'color',
			'title'    => __( 'Text Color', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
		),

		// Text Color
		array(
			'id'       => 'footer-widgets-border-color',
			'type'     => 'color',
			'title'    => __( 'Border Color', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
		),
	),
);

// FOOTER COPYRIGHT AREA SECTION
$this->sections[] = array(
	'title'           => __( 'Copyright Area', 'mixt' ),
	'customizer_only' => true,
	'subsection'      => true,
	'fields'          => array(
		
		// Background Color
		array(
			'id'       => 'footer-copy-bg-color',
			'type'     => 'color',
			'title'    => __( 'Background Color', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
		),

		// Background Pattern
		array(
			'id'       => 'footer-copy-bg-pat',
			'type'     => 'mixt_image_select',
			'title'    => __( 'Background Pattern', 'mixt' ),
			'options'  => $img_patterns,
			'empty'    => true,
		),

		// Text Color
		array(
			'id'       => 'footer-copy-text-color',
			'type'     => 'color',
			'title'    => __( 'Text Color', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
		),

		// Text Color
		array(
			'id'       => 'footer-copy-border-color',
			'type'     => 'color',
			'title'    => __( 'Border Color', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
		),

		// Left Side Content
		array(
			'id'       => 'footer-left-content',
			'type'     => 'select',
			'title'    => __( 'Left Side Content', 'mixt' ),
			'subtitle' => __( 'Content to show on the left side of the footer', 'mixt' ),
			'options'  => array(
				'0' => __( 'No Content', 'mixt' ),
				'1' => __( 'Social Icons', 'mixt' ),
				'2' => __( 'Custom Text / Code', 'mixt' ),
			),
		),

		// Left Side Code
		array(
			'id'           => 'footer-left-code',
			'type'         => 'textarea',
			'title'        => __( 'Left Side Code', 'mixt' ),
			'subtitle'     => __( 'Text or code to display on the left side', 'mixt' ),
			'allowed_html' => $text_allowed_html,
			'placeholder'  => $text_code_placeholder,
			'required'     => array('footer-left-content', '=', '2'),
		),

		// Right Side Content
		array(
			'id'       => 'footer-right-content',
			'type'     => 'select',
			'title'    => __( 'Right Side Content', 'mixt' ),
			'subtitle' => __( 'Content to show on the right side of the footer', 'mixt' ),
			'options'  => array(
				'0' => __( 'No Content', 'mixt' ),
				'1' => __( 'Social Icons', 'mixt' ),
				'2' => __( 'Custom Text / Code', 'mixt' ),
			),
		),

		// Right Side Code
		array(
			'id'           => 'footer-right-code',
			'type'         => 'textarea',
			'title'        => __( 'Right Side Code', 'mixt' ),
			'subtitle'     => __( 'Text or code to display on the right side', 'mixt' ),
			'allowed_html' => $text_allowed_html,
			'placeholder'  => $text_code_placeholder,
			'required'     => array('footer-right-content', '=', '2'),
		),
	),
);