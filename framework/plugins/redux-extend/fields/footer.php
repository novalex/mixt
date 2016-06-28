<?php

$this->sections[] = array(
	'title'      => esc_html__( 'Footer', 'mixt' ),
	'desc'       => esc_html__( 'Customize the site footer', 'mixt' ),
	'icon'       => 'el-icon-download-alt',
	'customizer' => false,
	'fields'     => array(

		// Footer Theme Select
		array(
			'id'       => 'footer-theme',
			'type'     => 'select',
			'title'    => esc_html__( 'Footer Theme', 'mixt' ),
			'subtitle' => esc_html__( 'Select the theme to be used for the footer', 'mixt' ),
			'options'  => $footer_themes,
			'default'  => 'auto',
		),
		
		// Back To Top Button
		array(
			'id'       => 'back-to-top',
			'type'     => 'switch',
			'title'    => esc_html__( 'Back To Top Button', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => true,
		),
		
		// Divider
		array(
			'id'   => 'footer-divider',
			'type' => 'divide',
		),

		// WIDGET AREA
		array(
			'id'       => 'footer-widgets-section',
			'type'     => 'section',
			'title'    => esc_html__( 'Widget Area', 'mixt' ),
			'indent'   => true,
		),

			// Display
			array(
				'id'       => 'footer-widgets-show',
				'type'     => 'switch',
				'title'    => esc_html__( 'Display Widget Area', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => true,
			),
		
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
				'default'  => '',
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
			
			// Hide On Mobile
			array(
				'id'       => 'footer-widgets-hide',
				'type'     => 'switch',
				'title'    => esc_html__( 'Hide On Mobile', 'mixt' ),
				'subtitle' => esc_html__( 'Hide the widget area on mobile / small screens', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => false,
			),

		// Divider
		array(
			'id'   => 'footer-divider-2',
			'type' => 'divide',
		),

		// COPYRIGHT AREA
		array(
			'id'       => 'footer-copy-section',
			'type'     => 'section',
			'title'    => esc_html__( 'Copyright Area', 'mixt' ),
			'indent'   => true,
		),

			// Display
			array(
				'id'       => 'footer-copy-show',
				'type'     => 'switch',
				'title'    => esc_html__( 'Display Copyright Area', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => true,
			),
		
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
				'default'  => '',
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
				'default'  => '2',
			),

			// Left Side Code
			array(
				'id'           => 'footer-left-code',
				'type'         => 'textarea',
				'title'        => esc_html__( 'Left Side Code', 'mixt' ),
				'subtitle'     => esc_html__( 'Text or code to display on the left side', 'mixt' ),
				'default'      => 'Copyright &copy; {{year}} Your Company',
				'allowed_html' => $text_allowed_html,
				'placeholder'  => $text_code_placeholder,
				'required'     => array('footer-left-content', '=', '2'),
			),

			// Left Side Hide On Mobile
			array(
				'id'       => 'footer-left-hide',
				'type'     => 'switch',
				'title'    => esc_html__( 'Hide Left Side On Mobile', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => false,
				'required' => array('footer-left-content', '!=', '0'),
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
				'default'  => '0',
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

			// Right Side Hide On Mobile
			array(
				'id'       => 'footer-right-hide',
				'type'     => 'switch',
				'title'    => esc_html__( 'Hide Right Side On Mobile', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => false,
				'required' => array('footer-right-content', '!=', '0'),
			),

			// Social Icons To Display
			array(
				'id'       => 'footer-social-profiles',
				'type'     => 'checkbox',
				'title'    => esc_html__( 'Social Profiles', 'mixt' ),
				'subtitle' => esc_html__( 'Select which social profiles to display', 'mixt' ),
				'options'  => $social_profile_names,
			),

		// Divider
		array(
			'id'   => 'footer-divider-3',
			'type' => 'divide',
		),

		// INFO BAR
		array(
			'id'       => 'footer-info-section',
			'type'     => 'section',
			'title'    => esc_html__( 'Info Bar', 'mixt' ),
			'subtitle' => esc_html__( 'Settings for the info bar. Can be used to show the cookie law notice, a promotion or any other information.', 'mixt' ),
			'indent'   => true,
		),

			// Enable
			array(
				'id'       => 'info-bar',
				'type'     => 'switch',
				'title'    => esc_html__( 'Show', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => false,
			),

			// Only Show Once
			array(
				'id'       => 'info-bar-cookie',
				'type'     => 'switch',
				'title'    => esc_html__( 'Only show once', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => false,
				'required' => array('info-bar', '=', true),
			),

			// Cookie Persistence
			array(
				'id'       => 'info-bar-cookie-persist',
				'type'     => 'spinner',
				'title'    => esc_html__( 'Days until showing again', 'mixt' ),
				'subtitle' => esc_html__( 'How many days should pass before showing again', 'mixt' ),
				'default'  => 999,
				'min'      => 1,
				'max'      => 999,
				'step'     => 1,
				'required' => array('info-bar-cookie', '=', true),
			),

			// Content
			array(
				'id'           => 'info-bar-content',
				'type'         => 'textarea',
				'title'        => esc_html__( 'Content', 'mixt' ),
				'subtitle'     => esc_html__( 'Text or code to display in the info bar', 'mixt' ),
				'default'      => 'This site uses cookies to improve user experience. By continuing to use it, you are agreeing to our <a href="#">cookie policy</a>.' .
								  '<a href="#" class="btn btn-red btn-xs pull-right info-close"><i class="fa fa-remove"></i></a>',
				'allowed_html' => $text_allowed_html,
				'placeholder'  => $text_code_placeholder,
				'required'     => array('info-bar', '=', true),
			),

			// Fixed Position
			array(
				'id'       => 'info-bar-fixed',
				'type'     => 'switch',
				'title'    => esc_html__( 'Fixed Position', 'mixt' ),
				'subtitle' => esc_html__( 'Make the info bar fixed (sticky)', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => false,
				'required' => array('info-bar', '=', true),
			),

			// Hide On Mobile
			array(
				'id'       => 'info-bar-hide',
				'type'     => 'switch',
				'title'    => esc_html__( 'Hide On Mobile', 'mixt' ),
				'subtitle' => esc_html__( 'Hide the info bar on mobile / small screens', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => false,
				'required' => array('info-bar', '=', true),
			),
	),
);
