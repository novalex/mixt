<?php

$this->sections[] = array(
	'title'      => esc_html__( 'Navbars', 'mixt' ),
	'desc'       => esc_html__( 'Customize the primary and secondary navbars', 'mixt' ),
	'icon'       => 'el-icon-minus',
	'customizer' => false,
	'fields'     => array(
		
		// Navbar Icons
		array(
			'id'       => 'nav-menu-icons',
			'type'     => 'switch',
			'title'    => esc_html__( 'Menu Icons', 'mixt' ),
			'subtitle' => esc_html__( 'Enable icons for menu items', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => true,
		),

		// Navbar Dropdown Arrows
		array(
			'id'       => 'nav-menu-arrows',
			'type'     => 'switch',
			'title'    => esc_html__( 'Menu Dropdown Arrows', 'mixt' ),
			'subtitle' => esc_html__( 'Enable arrows for menu items with dropdowns', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => true,
		),

		// Navbar Submenu Dropdown Arrows
		array(
			'id'       => 'nav-submenu-arrows',
			'type'     => 'switch',
			'title'    => esc_html__( 'Submenu Dropdown Arrows', 'mixt' ),
			'subtitle' => esc_html__( 'Enable arrows for submenu items with dropdowns', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
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
			'title'    => esc_html__( 'Primary Navbar', 'mixt' ),
			'subtitle' => esc_html__( 'Settings for the primary navbar', 'mixt' ),
			'indent'   => true,
		),

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
				'default'  => 'horizontal',
			),

			// Vertical Position
			array(
				'id'       => 'nav-vertical-position',
				'type'     => 'button_set',
				'title'    => esc_html__( 'Position', 'mixt' ),
				'subtitle' => esc_html__( 'Position the navbar to the left or right of the page', 'mixt' ),
				'options'  => array(
					'left'  => esc_html__( 'Left', 'mixt' ),
					'right' => esc_html__( 'Right', 'mixt' ),
				),
				'default'  => 'left',
				'required' => array('nav-layout', '=', 'vertical'),
			),

			// Vertical Width
			array(
				'id'       => 'nav-vertical-width',
				'type'     => 'dimensions',
				'title'    => esc_html__( 'Width', 'mixt' ),
				'subtitle' => esc_html__( 'Set a custom navbar width', 'mixt' ),
				'units'    => array('px', '%'),
				'height'   => false,
				'required' => array('nav-layout', '=', 'vertical'),
			),

			// Small Vertical Width
			array(
				'id'       => 'nav-vertical-width-sm',
				'type'     => 'dimensions',
				'title'    => esc_html__( 'Small Width', 'mixt' ),
				'subtitle' => esc_html__( 'Set a custom navbar width for smaller screens', 'mixt' ),
				'units'    => array('px', '%'),
				'height'   => false,
				'required' => array('nav-layout', '=', 'vertical'),
			),

			// Vertical Mode
			array(
				'id'       => 'nav-vertical-mode',
				'type'     => 'button_set',
				'title'    => esc_html__( 'Mode', 'mixt' ),
				'subtitle' => esc_html__( 'Navbar fixed (scrolls with page) or static (stays at the top)', 'mixt' ),
				'options'  => array(
					'fixed'  => esc_html__( 'Fixed', 'mixt' ),
					'static' => esc_html__( 'Static', 'mixt' ),
				),
				'default'  => 'fixed',
				'required' => array('nav-layout', '=', 'vertical'),
			),

			// Logo Alignment
			array(
				'id'       => 'logo-align',
				'type'     => 'button_set',
				'title'    => esc_html__( 'Logo Alignment', 'mixt' ),
				'subtitle' => esc_html__( 'Where the logo will be displayed in the navbar', 'mixt' ),
				'options'  => array(
					'1' => esc_html__( 'Left', 'mixt' ),
					'2' => esc_html__( 'Center', 'mixt' ),
					'3' => esc_html__( 'Right', 'mixt' ),
				),
				'default'  => '1',
			),

			// Mode
			array(
				'id'       => 'nav-mode',
				'type'     => 'button_set',
				'title'    => esc_html__( 'Mode', 'mixt' ),
				'subtitle' => esc_html__( 'Navbar fixed (scrolls with page) or static (stays at the top)', 'mixt' ),
				'options'  => array(
					'fixed'  => esc_html__( 'Fixed', 'mixt' ),
					'static' => esc_html__( 'Static', 'mixt' ),
				),
				'default'  => 'fixed',
				'required' => array('nav-layout', '=', 'horizontal'),
			),

			// Theme Select
			array(
				'id'       => 'nav-theme',
				'type'     => 'select',
				'title'    => esc_html__( 'Theme', 'mixt' ),
				'subtitle' => esc_html__( 'Select the theme for the primary navbar', 'mixt' ),
				'options'  => $nav_themes,
				'default'  => 'auto',
			),

			// Texture
			array(
				'id'       => 'nav-texture',
				'type'     => 'mixt_image_select',
				'title'    => esc_html__( 'Texture', 'mixt' ),
				'subtitle' => esc_html__( 'Texture the navbar', 'mixt' ),
				'options'  => $img_textures,
				'default'  => '',
				'empty'    => true,
			),

			// Padding
			array(
				'id'       => 'nav-padding',
				'type'     => 'slider',
				'title'    => esc_html__( 'Padding', 'mixt' ),
				'subtitle' => esc_html__( 'Set the navbar\'s padding (in px) when at the top', 'mixt' ),
				'default'  => 20,
				'min'      => 0,
				'max'      => 50,
				'required' => array('nav-layout', '=', 'horizontal'),
			),

			// Fixed Padding
			array(
				'id'       => 'nav-fixed-padding',
				'type'     => 'slider',
				'title'    => esc_html__( 'Padding When Fixed', 'mixt' ),
				'subtitle' => esc_html__( 'Set the navbar\'s padding (in px) when fixed', 'mixt' ),
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
				'title'      => esc_html__( 'Opacity', 'mixt' ),
				'subtitle'   => esc_html__( 'Set the navbar\'s opacity when fixed', 'mixt' ),
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
				'title'    => esc_html__( 'See-Through', 'mixt' ),
				'subtitle' => esc_html__( 'Make navbar transparent (when possible)', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => false,
				'required' => array('nav-layout', '=', 'horizontal'),
			),

			// See-Through Opacity
			array(
				'id'         => 'nav-top-opacity',
				'type'       => 'slider',
				'title'      => esc_html__( 'See-Through Opacity', 'mixt' ),
				'subtitle'   => esc_html__( 'Set the navbar\'s see-through opacity', 'mixt' ),
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
				'title'    => esc_html__( 'Position', 'mixt' ),
				'subtitle' => esc_html__( 'Display navbar above or below header (when possible)', 'mixt' ),
				'options'  => array(
					'above' => esc_html__( 'Above', 'mixt' ),
					'below' => esc_html__( 'Below', 'mixt' ),
				),
				'default' => 'above',
				'required' => array('nav-layout', '=', 'horizontal'),
			),

			// Hover Item Background
			array(
				'id'       => 'nav-hover-bg',
				'type'     => 'switch',
				'title'    => esc_html__( 'Hover Item Background', 'mixt' ),
				'subtitle' => esc_html__( 'Item background color on hover', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default' => true,
			),

			// Active Item Bar
			array(
				'id'       => 'nav-active-bar',
				'type'     => 'switch',
				'title'    => esc_html__( 'Active Item Bar', 'mixt' ),
				'subtitle' => esc_html__( 'Show an accent bar for active menu items', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default' => true,
			),

			// Active Item Bar Position
			array(
				'id'       => 'nav-active-bar-pos',
				'type'     => 'button_set',
				'title'    => esc_html__( 'Active Bar Position', 'mixt' ),
				'subtitle' => esc_html__( 'Where will the active bar be placed', 'mixt' ),
				'options'  => array(
					'top'    => esc_html__( 'Top', 'mixt' ),
					'left'   => esc_html__( 'Left', 'mixt' ),
					'right'  => esc_html__( 'Right', 'mixt' ),
					'bottom' => esc_html__( 'Bottom', 'mixt' ),
				),
				'default'  => 'bottom',
				'required' => array('nav-active-bar', '=', true),
			),

			// Border Items
			array(
				'id'       => 'nav-bordered',
				'type'     => 'switch',
				'title'    => esc_html__( 'Border Items', 'mixt' ),
				'subtitle' => esc_html__( 'Add borders to the navbar items', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
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
			'title'    => esc_html__( 'Secondary Navbar', 'mixt' ),
			'subtitle' => esc_html__( 'Settings for the secondary navbar', 'mixt' ),
			'indent'   => true,
		),

			// On/Off Switch
			array(
				'id'       => 'second-nav',
				'type'     => 'switch',
				'title'    => esc_html__( 'Enable Secondary Navbar', 'mixt' ),
				'subtitle' => esc_html__( 'Show the secondary navbar above the header', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => false,
			),

			// Theme Select
			array(
				'id'       => 'sec-nav-theme',
				'type'     => 'select',
				'title'    => esc_html__( 'Theme', 'mixt' ),
				'subtitle' => esc_html__( 'Select the theme for the secondary navbar', 'mixt' ),
				'options'  => $nav_themes,
				'default'  => 'auto',
				'required' => array('second-nav', '=', true),
			),

			// Texture
			array(
				'id'       => 'sec-nav-texture',
				'type'     => 'mixt_image_select',
				'title'    => esc_html__( 'Texture', 'mixt' ),
				'subtitle' => esc_html__( 'Texture the navbar', 'mixt' ),
				'options'  => $img_textures,
				'empty'    => true,
				'default'  => '',
				'required' => array('second-nav', '=', true),
			),

			// Hover Item Background
			array(
				'id'       => 'sec-nav-hover-bg',
				'type'     => 'switch',
				'title'    => esc_html__( 'Hover Item Background', 'mixt' ),
				'subtitle' => esc_html__( 'Item background color on hover', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => true,
				'required' => array('second-nav', '=', true),
			),

			// Active Item Bar
			array(
				'id'       => 'sec-nav-active-bar',
				'type'     => 'switch',
				'title'    => esc_html__( 'Active Item Bar', 'mixt' ),
				'subtitle' => esc_html__( 'Show an accent bar for active menu items', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => false,
				'required' => array('second-nav', '=', true),
			),

			// Active Item Bar Position
			array(
				'id'       => 'sec-nav-active-bar-pos',
				'type'     => 'button_set',
				'title'    => esc_html__( 'Active Bar Position', 'mixt' ),
				'subtitle' => esc_html__( 'Where will the active bar be placed', 'mixt' ),
				'options'  => array(
					'top'    => esc_html__( 'Top', 'mixt' ),
					'left'   => esc_html__( 'Left', 'mixt' ),
					'right'  => esc_html__( 'Right', 'mixt' ),
					'bottom' => esc_html__( 'Bottom', 'mixt' ),
				),
				'default'  => 'bottom',
				'required' => array('sec-nav-active-bar', '=', true),
			),

			// Border Items
			array(
				'id'       => 'sec-nav-bordered',
				'type'     => 'switch',
				'title'    => esc_html__( 'Border Items', 'mixt' ),
				'subtitle' => esc_html__( 'Add borders to the navbar items', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => true,
				'required' => array('second-nav', '=', true),
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
				'default'  => '0',
				'required' => array('second-nav', '=', true),
			),

			// Left Side Code
			array(
				'id'           => 'sec-nav-left-code',
				'type'         => 'textarea',
				'title'        => esc_html__( 'Left Side Code', 'mixt' ),
				'subtitle'     => esc_html__( 'Text or code to display on the left side', 'mixt' ),
				'allowed_html' => $text_allowed_html,
				'placeholder'  => $text_code_placeholder,
				'required'     => array('sec-nav-left-content', '=', '3'),
			),

			// Left Side Hide On Mobile
			array(
				'id'       => 'sec-nav-left-hide',
				'type'     => 'switch',
				'title'    => esc_html__( 'Hide Left Side On Mobile', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => false,
				'required' => array('sec-nav-left-content', '!=', '0'),
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
				'default'  => '0',
				'required' => array('second-nav', '=', true),
			),

			// Right Side Code
			array(
				'id'           => 'sec-nav-right-code',
				'type'         => 'textarea',
				'title'        => esc_html__( 'Right Side Code', 'mixt' ),
				'subtitle'     => esc_html__( 'Text or code to display on the right side', 'mixt' ),
				'allowed_html' => $text_allowed_html,
				'placeholder'  => $text_code_placeholder,
				'required'     => array('sec-nav-right-content', '=', '3'),
			),

			// Right Side Hide On Mobile
			array(
				'id'       => 'sec-nav-right-hide',
				'type'     => 'switch',
				'title'    => esc_html__( 'Hide Right Side On Mobile', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => false,
				'required' => array('sec-nav-right-content', '!=', '0'),
			),
	),
);
