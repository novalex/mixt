<?php

$this->sections[] = array(
	'title'      => __( 'Navbars', 'mixt' ),
	'desc'       => __( 'Customize the primary and secondary navbars', 'mixt' ),
	'icon'       => 'el-icon-minus',
	'customizer' => false,
	'fields'     => array(
		
		// Navbar Icons
		array(
			'id'       => 'nav-menu-icons',
			'type'     => 'switch',
			'title'    => __( 'Menu Icons', 'mixt' ),
			'subtitle' => __( 'Enable icons for menu items', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => true,
		),

		// Navbar Dropdown Arrows
		array(
			'id'       => 'nav-menu-arrows',
			'type'     => 'switch',
			'title'    => __( 'Menu Dropdown Arrows', 'mixt' ),
			'subtitle' => __( 'Enable arrows for menu items with dropdowns', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => true,
		),

		// Navbar Submenu Dropdown Arrows
		array(
			'id'       => 'nav-submenu-arrows',
			'type'     => 'switch',
			'title'    => __( 'Submenu Dropdown Arrows', 'mixt' ),
			'subtitle' => __( 'Enable arrows for submenu items with dropdowns', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => true,
		),

		// Divider
		array(
			'id'   => 'navbar-divider',
			'type' => 'divide',
		),

		// PRIMARY NAVBAR
		array(
			'id'       => 'primary-nav-section',
			'type'     => 'section',
			'title'    => __( 'Primary Navbar', 'mixt' ),
			'subtitle' => __( 'Settings for the primary navbar', 'mixt' ),
			'indent'   => true,
		),

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
				'default'  => 'horizontal',
			),

			// Vertical Position
			array(
				'id'       => 'nav-vertical-position',
				'type'     => 'button_set',
				'title'    => __( 'Position', 'mixt' ),
				'subtitle' => __( 'Position the navbar to the left or right of the page', 'mixt' ),
				'options'  => array(
					'left'  => __( 'Left', 'mixt' ),
					'right' => __( 'Right', 'mixt' ),
				),
				'default'  => 'left',
				'required' => array('nav-layout', '=', 'vertical'),
			),

			// Vertical Width
			array(
				'id'       => 'nav-vertical-width',
				'type'     => 'dimensions',
				'title'    => __( 'Width', 'mixt' ),
				'subtitle' => __( 'Set a custom navbar width', 'mixt' ),
				'units'    => array('px', '%'),
				'height'   => false,
				'required' => array('nav-layout', '=', 'vertical'),
			),

			// Small Vertical Width
			array(
				'id'       => 'nav-vertical-width-sm',
				'type'     => 'dimensions',
				'title'    => __( 'Small Width', 'mixt' ),
				'subtitle' => __( 'Set a custom navbar width for smaller screens', 'mixt' ),
				'units'    => array('px', '%'),
				'height'   => false,
				'required' => array('nav-layout', '=', 'vertical'),
			),

			// Vertical Mode
			array(
				'id'       => 'nav-vertical-mode',
				'type'     => 'button_set',
				'title'    => __( 'Mode', 'mixt' ),
				'subtitle' => __( 'Navbar fixed (scrolls with page) or static (stays at the top)', 'mixt' ),
				'options'  => array(
					'fixed'  => __( 'Fixed', 'mixt' ),
					'static' => __( 'Static', 'mixt' ),
				),
				'default'  => 'fixed',
				'required' => array('nav-layout', '=', 'vertical'),
			),

			// Logo Alignment
			array(
				'id'       => 'logo-align',
				'type'     => 'button_set',
				'title'    => __( 'Logo Alignment', 'mixt' ),
				'subtitle' => __( 'Where the logo will be displayed in the navbar', 'mixt' ),
				'options'  => array(
					'1' => __( 'Left', 'mixt' ),
					'2' => __( 'Center', 'mixt' ),
					'3' => __( 'Right', 'mixt' ),
				),
				'default'  => '1',
			),

			// Mode
			array(
				'id'       => 'nav-mode',
				'type'     => 'button_set',
				'title'    => __( 'Mode', 'mixt' ),
				'subtitle' => __( 'Navbar fixed (scrolls with page) or static (stays at the top)', 'mixt' ),
				'options'  => array(
					'fixed'  => __( 'Fixed', 'mixt' ),
					'static' => __( 'Static', 'mixt' ),
				),
				'default'  => 'fixed',
				'required' => array('nav-layout', '=', 'horizontal'),
			),

			// Theme Select
			array(
				'id'       => 'nav-theme',
				'type'     => 'select',
				'title'    => __( 'Theme', 'mixt' ),
				'subtitle' => __( 'Select the theme for the primary navbar', 'mixt' ),
				'options'  => $nav_themes,
				'default'  => 'auto',
			),

			// Texture
			array(
				'id'       => 'nav-texture',
				'type'     => 'mixt_image_select',
				'title'    => __( 'Texture', 'mixt' ),
				'subtitle' => __( 'Texture the navbar', 'mixt' ),
				'options'  => $img_textures,
				'default'  => '',
				'empty'    => true,
			),

			// Padding
			array(
				'id'       => 'nav-padding',
				'type'     => 'slider',
				'title'    => __( 'Padding', 'mixt' ),
				'subtitle' => __( 'Set the navbar\'s padding (in px) when at the top', 'mixt' ),
				'default'  => 20,
				'min'      => 0,
				'max'      => 50,
				'required' => array('nav-layout', '=', 'horizontal'),
			),

			// Fixed Padding
			array(
				'id'       => 'nav-fixed-padding',
				'type'     => 'slider',
				'title'    => __( 'Padding When Fixed', 'mixt' ),
				'subtitle' => __( 'Set the navbar\'s padding (in px) when fixed', 'mixt' ),
				'default'  => 0,
				'min'      => 0,
				'max'      => 50,
				'required' => array(
					array('nav-layout', '=', 'horizontal'),
					array('nav-mode', '=', 'fixed'),
				),
			),

			// Opacity
			array(
				'id'         => 'nav-opacity',
				'type'       => 'slider',
				'title'      => __( 'Opacity', 'mixt' ),
				'subtitle'   => __( 'Set the navbar\'s opacity when fixed', 'mixt' ),
				'default'    => 0.95,
				'step'       => 0.05,
				'min'        => 0,
				'max'        => 1,
				'resolution' => 0.01,
				'required'   => array('nav-layout', '=', 'horizontal'),
			),

			// See-Through When Possible
			array(
				'id'       => 'nav-transparent',
				'type'     => 'switch',
				'title'    => __( 'See-Through', 'mixt' ),
				'subtitle' => __( 'Make navbar transparent (when possible)', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => false,
				'required' => array('nav-layout', '=', 'horizontal'),
			),

			// See-Through Opacity
			array(
				'id'         => 'nav-top-opacity',
				'type'       => 'slider',
				'title'      => __( 'See-Through Opacity', 'mixt' ),
				'subtitle'   => __( 'Set the navbar\'s see-through opacity', 'mixt' ),
				'default'    => 0.25,
				'step'       => 0.05,
				'min'        => 0,
				'max'        => 1,
				'resolution' => 0.01,
				'required'   => array(
					array('nav-layout', '=', 'horizontal'),
					array('nav-transparent', '=', true),
				),
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
				'default' => 'above',
				'required' => array('nav-layout', '=', 'horizontal'),
			),

			// Hover Item Background
			array(
				'id'       => 'nav-hover-bg',
				'type'     => 'switch',
				'title'    => __( 'Hover Item Background', 'mixt' ),
				'subtitle' => __( 'Item background color on hover', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default' => true,
			),

			// Active Item Bar
			array(
				'id'       => 'nav-active-bar',
				'type'     => 'switch',
				'title'    => __( 'Active Item Bar', 'mixt' ),
				'subtitle' => __( 'Show an accent bar for active menu items', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default' => true,
			),

			// Active Item Bar Position
			array(
				'id'       => 'nav-active-bar-pos',
				'type'     => 'button_set',
				'title'    => __( 'Active Bar Position', 'mixt' ),
				'subtitle' => __( 'Where will the active bar be placed', 'mixt' ),
				'options'  => array(
					'top'    => __( 'Top', 'mixt' ),
					'left'   => __( 'Left', 'mixt' ),
					'right'  => __( 'Right', 'mixt' ),
					'bottom' => __( 'Bottom', 'mixt' ),
				),
				'default'  => 'bottom',
				'required' => array('nav-active-bar', '=', true),
			),

			// Border Items
			array(
				'id'       => 'nav-bordered',
				'type'     => 'switch',
				'title'    => __( 'Border Items', 'mixt' ),
				'subtitle' => __( 'Add borders to the navbar items', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => false,
			),

		// Divider
		array(
			'id'   => 'navbar-divider-2',
			'type' => 'divide',
		),

		// SECONDARY NAVBAR
		array(
			'id'       => 'secondary-nav-section',
			'type'     => 'section',
			'title'    => __( 'Secondary Navbar', 'mixt' ),
			'subtitle' => __( 'Settings for the secondary navbar', 'mixt' ),
			'indent'   => true,
		),

			// On/Off Switch
			array(
				'id'       => 'second-nav',
				'type'     => 'switch',
				'title'    => __( 'Enable Secondary Navbar', 'mixt' ),
				'subtitle' => __( 'Show the secondary navbar above the header', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => false,
			),

			// Theme Select
			array(
				'id'       => 'sec-nav-theme',
				'type'     => 'select',
				'title'    => __( 'Theme', 'mixt' ),
				'subtitle' => __( 'Select the theme for the secondary navbar', 'mixt' ),
				'options'  => $nav_themes,
				'default'  => 'auto',
				'required' => array('second-nav', '=', true),
			),

			// Texture
			array(
				'id'       => 'sec-nav-texture',
				'type'     => 'mixt_image_select',
				'title'    => __( 'Texture', 'mixt' ),
				'subtitle' => __( 'Texture the navbar', 'mixt' ),
				'options'  => $img_textures,
				'empty'    => true,
				'default'  => '',
				'required' => array('second-nav', '=', true),
			),

			// Hover Item Background
			array(
				'id'       => 'sec-nav-hover-bg',
				'type'     => 'switch',
				'title'    => __( 'Hover Item Background', 'mixt' ),
				'subtitle' => __( 'Item background color on hover', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => true,
				'required' => array('second-nav', '=', true),
			),

			// Active Item Bar
			array(
				'id'       => 'sec-nav-active-bar',
				'type'     => 'switch',
				'title'    => __( 'Active Item Bar', 'mixt' ),
				'subtitle' => __( 'Show an accent bar for active menu items', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => false,
				'required' => array('second-nav', '=', true),
			),

			// Active Item Bar Position
			array(
				'id'       => 'sec-nav-active-bar-pos',
				'type'     => 'button_set',
				'title'    => __( 'Active Bar Position', 'mixt' ),
				'subtitle' => __( 'Where will the active bar be placed', 'mixt' ),
				'options'  => array(
					'top'    => __( 'Top', 'mixt' ),
					'left'   => __( 'Left', 'mixt' ),
					'right'  => __( 'Right', 'mixt' ),
					'bottom' => __( 'Bottom', 'mixt' ),
				),
				'default'  => 'bottom',
				'required' => array('sec-nav-active-bar', '=', true),
			),

			// Border Items
			array(
				'id'       => 'sec-nav-bordered',
				'type'     => 'switch',
				'title'    => __( 'Border Items', 'mixt' ),
				'subtitle' => __( 'Add borders to the navbar items', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => true,
				'required' => array('second-nav', '=', true),
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
				'default'  => '0',
				'required' => array('second-nav', '=', true),
			),

			// Left Side Code
			array(
				'id'           => 'sec-nav-left-code',
				'type'         => 'textarea',
				'title'        => __( 'Left Side Code', 'mixt' ),
				'subtitle'     => __( 'Text or code to display on the left side', 'mixt' ),
				'allowed_html' => $text_allowed_html,
				'placeholder'  => $text_code_placeholder,
				'required'     => array('sec-nav-left-content', '=', '3'),
			),

			// Left Side Hide On Mobile
			array(
				'id'       => 'sec-nav-left-hide',
				'type'     => 'switch',
				'title'    => __( 'Hide Left Side On Mobile', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => false,
				'required' => array('sec-nav-left-content', '!=', '0'),
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
				'default'  => '0',
				'required' => array('second-nav', '=', true),
			),

			// Right Side Code
			array(
				'id'           => 'sec-nav-right-code',
				'type'         => 'textarea',
				'title'        => __( 'Right Side Code', 'mixt' ),
				'subtitle'     => __( 'Text or code to display on the right side', 'mixt' ),
				'allowed_html' => $text_allowed_html,
				'placeholder'  => $text_code_placeholder,
				'required'     => array('sec-nav-right-content', '=', '3'),
			),

			// Right Side Hide On Mobile
			array(
				'id'       => 'sec-nav-right-hide',
				'type'     => 'switch',
				'title'    => __( 'Hide Right Side On Mobile', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => false,
				'required' => array('sec-nav-right-content', '!=', '0'),
			),
	),
);
