<?php

$this->sections[] = array(
	'title'      => __( 'Global Options', 'mixt' ),
	'desc'       => __( 'Customize the site\'s global options and settings', 'mixt' ),
	'icon'       => 'el-icon-off',
	'customizer' => false,
	'fields'     => array(

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
			'default'  => 'wide',
		),

		// Boxed layout & vertical nav notification
		array(
			'id'       => 'site-layout-warn',
			'type'     => 'info',
			'style'    => 'warning',
			'subtitle' => __( 'The site layout cannot be boxed while the navbar is vertical. Wide layout will be used instead.', 'mixt' ),
			'required' => array(
				array('site-layout', '=', 'boxed'),
				array('nav-layout', '=', 'vertical'),
			),
		),

		// Site Background Color
		array(
			'id'          => 'site-bg-color',
			'type'        => 'color',
			'title'       => __( 'Background Color', 'mixt' ),
			'subtitle'    => __( 'Select the site background color', 'mixt' ),
			'transparent' => false,
			'default'     => '#fff',
			'validate'    => 'color',
			'required'    => array('site-layout', '=', 'boxed'),
		),

		// Site Background
		array(
			'id'       => 'site-bg',
			'type'     => 'background',
			'title'    => __( 'Site Background', 'mixt' ),
			'subtitle' => __( 'Choose an image and other options for the site background', 'mixt' ),
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
			'title'    => __( 'Background Pattern', 'mixt' ),
			'subtitle' => __( 'Choose a pattern for the site background', 'mixt' ),
			'options'  => $img_patterns,
			'empty'    => true,
			'default'  => '',
			'required' => array('site-layout', '=', 'boxed'),
		),

		// Site-Wide Theme Select
		array(
			'id'       => 'site-theme',
			'type'     => 'select',
			'title'    => __( 'Site Theme', 'mixt' ),
			'subtitle' => __( 'Select the theme to be used site-wide', 'mixt' ),
			'options'  => $site_themes,
			'default'  => MIXT_THEME,
		),

		// Site Width
		array(
			'id'       => 'site-width',
			'type'     => 'dimensions',
			'title'    => __( 'Site Width', 'mixt' ),
			'subtitle' => __( 'Set a custom site width', 'mixt' ),
			'units'    => array('px', '%'),
			'height'   => false,
		),

		// Responsive Layout
		array(
			'id'       => 'site-responsive',
			'type'     => 'switch',
			'title'    => __( 'Responsive Layout', 'mixt' ),
			'subtitle' => __( 'Enable responsive features for the best experience on all screen sizes', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => true,
		),

		// Header Code
		array(
			'id'       => 'head-user-code',
			'type'     => 'ace_editor',
			'title'    => __( 'Head Code', 'mixt' ),
			'subtitle' => __( 'Add custom code before the closing &lt;head&gt; tag', 'mixt' ),
			'mode'     => 'html',
			'theme'    => 'chrome',
		),
	),
);


// PAGE LOADER
$this->sections[] = array(
	'title'      => __( 'Page Loader', 'mixt' ),
	'desc'       => __( 'Settings for the page loader', 'mixt' ),
	'icon'       => 'el-icon-record',
	'subsection' => true,
	'customizer' => false,
	'fields'     => array(

		// Enable
		array(
			'id'       => 'page-loader',
			'type'     => 'switch',
			'title'    => __( 'Enable', 'mixt' ),
			'subtitle' => __( 'Show animations when pages are loading', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => false,
		),

		// Type
		array(
			'id'       => 'page-loader-type',
			'type'     => 'button_set',
			'title'    => __( 'Type', 'mixt' ),
			'subtitle' => __( 'Use a shape or image for the loader', 'mixt' ),
			'options'  => array(
				'1' => __( 'Shape', 'mixt' ),
				'2' => __( 'Image', 'mixt' ),
			),
			'default'  => '1',
			'required' => array('page-loader', '=', true),
		),

		// Shape Select
		array(
			'id'       => 'page-loader-shape',
			'type'     => 'select',
			'title'    => __( 'Shape', 'mixt' ),
			'subtitle' => __( 'Shape to use for the loader', 'mixt' ),
			'options'  => array(
				'circle'  => __( 'Circle', 'mixt' ),
				'ring'    => __( 'Ring', 'mixt' ),
				'square'  => __( 'Square', 'mixt' ),
				'square2' => __( 'Empty Square', 'mixt' ),
			),
			'default'  => 'ring',
			'required' => array('page-loader-type', '=', '1'),
		),

		// Shape Color Select
		array(
			'id'          => 'page-loader-color',
			'type'        => 'color',
			'title'       => __( 'Shape Color', 'mixt' ),
			'subtitle'    => __( 'Select a loader shape color', 'mixt' ),
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
			'title'    => __( 'Image', 'mixt' ),
			'subtitle' => __( 'Image to use for the loader', 'mixt' ),
			'required' => array('page-loader-type', '=', '2'),
		),

		// Background Color Select
		array(
			'id'          => 'page-loader-bg',
			'type'        => 'color',
			'title'       => __( 'Background Color', 'mixt' ),
			'subtitle'    => __( 'The page loader background color', 'mixt' ),
			'transparent' => false,
			'default'     => '#ffffff',
			'validate'    => 'color',
			'required'    => array('page-loader', '=', true),
		),

		// Animation Select
		array(
			'id'       => 'page-loader-anim',
			'type'     => 'select',
			'title'    => __( 'Animation', 'mixt' ),
			'subtitle' => __( 'Animation to use for the loader', 'mixt' ),
			'options'  => $page_loader_anims,
			'default'  => 'pulsate',
			'required' => array('page-loader', '=', true),
		),
	),
);


// MISCELLANEOUS
$this->sections[] = array(
	'title'      => __( 'Miscellaneous', 'mixt' ),
	'icon'       => 'el-icon-adjust-alt',
	'subsection' => true,
	'customizer' => false,
	'fields'     => array(

		// Smooth Scrolling
		array(
			'id'       => 'smooth-scroll',
			'type'     => 'switch',
			'title'    => __( 'Smooth Scrolling', 'mixt' ),
			'subtitle' => __( 'Enable smooth scrolling for browsers without native support', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => true,
		),

		// Page Comments
		array(
			'id'       => 'page-show-comments',
			'type'     => 'switch',
			'title'    => __( 'Page Comments', 'mixt' ),
			'subtitle' => __( 'Show comments on single pages', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => false,
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
			'title'    => __( 'Modules', 'mixt' ),
			'indent'   => true,
		),	

			// Icon Fonts
			array(
				'id'       => 'icon-fonts',
				'type'     => 'checkbox',
				'title'    => __( 'Icon Font Sets', 'mixt' ),
				'subtitle' => __( 'Select which icon font sets you want to use.', 'mixt' ),
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
				'title'    => __( 'Enable Themes', 'mixt' ),
				'subtitle' => __( 'Add theme sections and management. Disable if customizing themes in CSS directly.', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => true,
			),

			// Page Metaboxes
			array(
				'id'       => 'page-metaboxes',
				'type'     => 'switch',
				'title'    => __( 'Page Option Metaboxes', 'mixt' ),
				'subtitle' => __( 'Enable option metaboxes when editing pages or posts', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => true,
			),

			// BrowserSync Script
			array(
				'id'       => 'bsync-script',
				'type'     => 'switch',
				'title'    => __( 'BrowserSync Script', 'mixt' ),
				'subtitle' => __( 'Add BrowserSync script in the footer (only for logged in admins)', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => false,
			),
	),
);
