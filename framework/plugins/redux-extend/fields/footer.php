<?php

$this->sections[] = array(
	'title'      => __( 'Footer', 'mixt' ),
	'desc'       => __( 'Customize the site footer', 'mixt' ),
	'icon'       => 'el-icon-download-alt',
	'customizer' => false,
	'fields'     => array(

		// Footer Theme Select
		array(
			'id'       => 'footer-theme',
			'type'     => 'select',
			'title'    => __( 'Footer Theme', 'mixt' ),
			'subtitle' => __( 'Select the theme to be used for the footer', 'mixt' ),
			'options'  => $footer_themes,
			'default'  => 'auto',
		),
		
		// Back To Top Button
		array(
			'id'       => 'back-to-top',
			'type'     => 'switch',
			'title'    => __( 'Back To Top Button', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
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
			'title'    => __( 'Widget Area', 'mixt' ),
			'indent'   => true,
		),

			// Display
			array(
				'id'       => 'footer-widgets-show',
				'type'     => 'switch',
				'title'    => __( 'Display Widget Area', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => true,
			),
		
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
				'default'  => '',
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
			
			// Hide On Mobile
			array(
				'id'       => 'footer-widgets-hide',
				'type'     => 'switch',
				'title'    => __( 'Hide On Mobile', 'mixt' ),
				'subtitle' => __( 'Hide the widget area on mobile / small screens', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
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
			'title'    => __( 'Copyright Area', 'mixt' ),
			'indent'   => true,
		),

			// Display
			array(
				'id'       => 'footer-copy-show',
				'type'     => 'switch',
				'title'    => __( 'Display Copyright Area', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => true,
			),
		
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
				'default'  => '',
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
				'default'  => '2',
			),

			// Left Side Code
			array(
				'id'           => 'footer-left-code',
				'type'         => 'textarea',
				'title'        => __( 'Left Side Code', 'mixt' ),
				'subtitle'     => __( 'Text or code to display on the left side', 'mixt' ),
				'default'      => 'Copyright &copy; {{year}} Your Company',
				'allowed_html' => $text_allowed_html,
				'placeholder'  => $text_code_placeholder,
				'required'     => array('footer-left-content', '=', '2'),
			),

			// Left Side Hide On Mobile
			array(
				'id'       => 'footer-left-hide',
				'type'     => 'switch',
				'title'    => __( 'Hide Left Side On Mobile', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => false,
				'required' => array('footer-left-content', '!=', '0'),
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
				'default'  => '0',
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

			// Right Side Hide On Mobile
			array(
				'id'       => 'footer-right-hide',
				'type'     => 'switch',
				'title'    => __( 'Hide Right Side On Mobile', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => false,
				'required' => array('footer-right-content', '!=', '0'),
			),

			// Social Icons To Display
			array(
				'id'       => 'footer-social-profiles',
				'type'     => 'checkbox',
				'title'    => __( 'Social Profiles', 'mixt' ),
				'subtitle' => __( 'Select which social profiles to display', 'mixt' ),
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
			'title'    => __( 'Info Bar', 'mixt' ),
			'subtitle' => __( 'Settings for the info bar. Can be used to show the cookie law notice, a promotion or any other information.', 'mixt' ),
			'indent'   => true,
		),

			// Enable
			array(
				'id'       => 'info-bar',
				'type'     => 'switch',
				'title'    => __( 'Show', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => false,
			),

			// Content
			array(
				'id'           => 'info-bar-content',
				'type'         => 'textarea',
				'title'        => __( 'Content', 'mixt' ),
				'subtitle'     => __( 'Text or code to display in the info bar', 'mixt' ),
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
				'title'    => __( 'Fixed Position', 'mixt' ),
				'subtitle' => __( 'Make the info bar fixed (sticky)', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => false,
				'required' => array('info-bar', '=', true),
			),

			// Hide On Mobile
			array(
				'id'       => 'info-bar-hide',
				'type'     => 'switch',
				'title'    => __( 'Hide On Mobile', 'mixt' ),
				'subtitle' => __( 'Hide the info bar on mobile / small screens', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => false,
				'required' => array('info-bar', '=', true),
			),
	),
);
