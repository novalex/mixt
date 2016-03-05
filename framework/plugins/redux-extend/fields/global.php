<?php

$this->sections[] = array(
	'title'      => esc_html__( 'Global Options', 'mixt' ),
	'desc'       => esc_html__( 'Customize the site\'s global options and settings', 'mixt' ),
	'icon'       => 'el-icon-off',
	'customizer' => false,
	'fields'     => array(

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
			'default'  => 'wide',
		),

		// Boxed layout & vertical nav notification
		array(
			'id'       => 'site-layout-warn',
			'type'     => 'info',
			'style'    => 'warning',
			'subtitle' => esc_html__( 'The site layout cannot be boxed while the navbar is vertical. Wide layout will be used instead.', 'mixt' ),
			'required' => array(
				array('site-layout', '=', 'boxed'),
				array('nav-layout', '=', 'vertical'),
			),
		),

		// Site Background Color
		array(
			'id'          => 'site-bg-color',
			'type'        => 'color',
			'title'       => esc_html__( 'Background Color', 'mixt' ),
			'subtitle'    => esc_html__( 'Select the site background color', 'mixt' ),
			'transparent' => false,
			'default'     => '#fff',
			'validate'    => 'color',
			'required'    => array('site-layout', '=', 'boxed'),
		),

		// Site Background
		array(
			'id'       => 'site-bg',
			'type'     => 'background',
			'title'    => esc_html__( 'Site Background', 'mixt' ),
			'subtitle' => esc_html__( 'Choose an image and other options for the site background', 'mixt' ),
			'default'  => array(
				'background-attachment' => 'fixed',
				'background-size'       => 'cover',
				'background-repeat'     => 'no-repeat',
				'background-position'   => 'center top',
			),
			'required' => array('site-layout', '=', 'boxed'),
			'background-color' => false,
		),

		// Site Background Pattern
		array(
			'id'       => 'site-bg-pat',
			'type'     => 'mixt_image_select',
			'title'    => esc_html__( 'Background Pattern', 'mixt' ),
			'subtitle' => esc_html__( 'Choose a pattern for the site background', 'mixt' ),
			'options'  => $img_patterns,
			'empty'    => true,
			'default'  => '',
			'required' => array('site-layout', '=', 'boxed'),
		),

		// Site-Wide Theme Select
		array(
			'id'       => 'site-theme',
			'type'     => 'select',
			'title'    => esc_html__( 'Site Theme', 'mixt' ),
			'subtitle' => esc_html__( 'Select the theme to be used site-wide', 'mixt' ),
			'options'  => $site_themes,
			'default'  => MIXT_THEME,
		),

		// Site Width
		array(
			'id'       => 'site-width',
			'type'     => 'dimensions',
			'title'    => esc_html__( 'Site Width', 'mixt' ),
			'subtitle' => esc_html__( 'Set a custom site width', 'mixt' ),
			'units'    => array('px', '%'),
			'height'   => false,
		),

		// Responsive Layout
		array(
			'id'       => 'site-responsive',
			'type'     => 'switch',
			'title'    => esc_html__( 'Responsive Layout', 'mixt' ),
			'subtitle' => esc_html__( 'Enable responsive features for the best experience on all screen sizes', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => true,
		),

		// Header Code
		array(
			'id'       => 'head-user-code',
			'type'     => 'ace_editor',
			'title'    => esc_html__( 'Head Code', 'mixt' ),
			'subtitle' => esc_html__( 'Add custom code before the closing &lt;head&gt; tag', 'mixt' ),
			'mode'     => 'html',
			'theme'    => 'chrome',
		),
	),
);


// PAGE LOADER
$this->sections[] = array(
	'title'      => esc_html__( 'Page Loader', 'mixt' ),
	'desc'       => esc_html__( 'Settings for the page loader', 'mixt' ),
	'icon'       => 'el-icon-record',
	'subsection' => true,
	'customizer' => false,
	'fields'     => array(

		// Enable
		array(
			'id'       => 'page-loader',
			'type'     => 'switch',
			'title'    => esc_html__( 'Enable', 'mixt' ),
			'subtitle' => esc_html__( 'Show animations when pages are loading', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => false,
		),

		// Type
		array(
			'id'       => 'page-loader-type',
			'type'     => 'button_set',
			'title'    => esc_html__( 'Type', 'mixt' ),
			'subtitle' => esc_html__( 'Use a shape or image for the loader', 'mixt' ),
			'options'  => array(
				'1' => esc_html__( 'Shape', 'mixt' ),
				'2' => esc_html__( 'Image', 'mixt' ),
			),
			'default'  => '1',
			'required' => array('page-loader', '=', true),
		),

		// Shape Select
		array(
			'id'       => 'page-loader-shape',
			'type'     => 'select',
			'title'    => esc_html__( 'Shape', 'mixt' ),
			'subtitle' => esc_html__( 'Shape to use for the loader', 'mixt' ),
			'options'  => array(
				'circle'  => esc_html__( 'Circle', 'mixt' ),
				'ring'    => esc_html__( 'Ring', 'mixt' ),
				'square'  => esc_html__( 'Square', 'mixt' ),
				'square2' => esc_html__( 'Empty Square', 'mixt' ),
			),
			'default'  => 'ring',
			'required' => array('page-loader-type', '=', '1'),
		),

		// Shape Color Select
		array(
			'id'          => 'page-loader-color',
			'type'        => 'color',
			'title'       => esc_html__( 'Shape Color', 'mixt' ),
			'subtitle'    => esc_html__( 'Select a loader shape color', 'mixt' ),
			'transparent' => false,
			'default'     => '#333333',
			'validate'    => 'color',
			'required'    => array('page-loader-type', '=', '1'),
		),

		// Image Select
		array(
			'id'       => 'page-loader-img',
			'type'     => 'media',
			'url'      => false,
			'title'    => esc_html__( 'Image', 'mixt' ),
			'subtitle' => esc_html__( 'Image to use for the loader', 'mixt' ),
			'required' => array('page-loader-type', '=', '2'),
		),

		// Background Color Select
		array(
			'id'          => 'page-loader-bg',
			'type'        => 'color',
			'title'       => esc_html__( 'Background Color', 'mixt' ),
			'subtitle'    => esc_html__( 'The page loader background color', 'mixt' ),
			'transparent' => false,
			'default'     => '#ffffff',
			'validate'    => 'color',
			'required'    => array('page-loader', '=', true),
		),

		// Animation Select
		array(
			'id'       => 'page-loader-anim',
			'type'     => 'select',
			'title'    => esc_html__( 'Animation', 'mixt' ),
			'subtitle' => esc_html__( 'Animation to use for the loader', 'mixt' ),
			'options'  => $page_loader_anims,
			'default'  => 'pulsate',
			'required' => array('page-loader', '=', true),
		),
	),
);


// MISCELLANEOUS
$this->sections[] = array(
	'title'      => esc_html__( 'Miscellaneous', 'mixt' ),
	'icon'       => 'el-icon-adjust-alt',
	'subsection' => true,
	'customizer' => false,
	'fields'     => array(

		// Smooth Scrolling
		array(
			'id'       => 'smooth-scroll',
			'type'     => 'switch',
			'title'    => esc_html__( 'Smooth Scrolling', 'mixt' ),
			'subtitle' => esc_html__( 'Enable smooth scrolling for browsers without native support', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => true,
		),

		// Page Comments
		array(
			'id'       => 'page-show-comments',
			'type'     => 'switch',
			'title'    => esc_html__( 'Page Comments', 'mixt' ),
			'subtitle' => esc_html__( 'Show comments on single pages', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => true,
		),

		// Divider
		array(
			'id'   => 'misc-divider',
			'type' => 'divide',
		),


		// MODULES
		array(
			'id'       => 'modules-section',
			'type'     => 'section',
			'title'    => esc_html__( 'Modules', 'mixt' ),
			'indent'   => true,
		),	

			// Icon Fonts
			array(
				'id'       => 'icon-fonts',
				'type'     => 'checkbox',
				'title'    => esc_html__( 'Icon Font Sets', 'mixt' ),
				'subtitle' => esc_html__( 'Select which icon font sets you want to use.', 'mixt' ),
				'options'  => array(
					'fontawesome' => 'Font Awesome',
					'typicons'    => 'Typicons',
					'entypo'      => 'Entypo',
					'linecons'    => 'Linecons',
				),
				'default'  => array(
					'fontawesome' => '1',
				),
			),

			// Themes Master Switch
			array(
				'id'       => 'themes-master',
				'type'     => 'switch',
				'title'    => esc_html__( 'Enable Themes', 'mixt' ),
				'subtitle' => esc_html__( 'Add theme sections and management. Disable if customizing themes in CSS directly.', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => true,
			),

			// Page Metaboxes
			array(
				'id'       => 'page-metaboxes',
				'type'     => 'switch',
				'title'    => esc_html__( 'Page Option Metaboxes', 'mixt' ),
				'subtitle' => esc_html__( 'Enable option metaboxes when editing pages or posts', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => true,
			),

			// BrowserSync Script
			array(
				'id'       => 'bsync-script',
				'type'     => 'switch',
				'title'    => esc_html__( 'BrowserSync Script', 'mixt' ),
				'subtitle' => esc_html__( 'Add BrowserSync script in the footer (only for logged in admins)', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => false,
			),
	),
);
