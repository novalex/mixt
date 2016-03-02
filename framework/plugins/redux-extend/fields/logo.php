<?php

$this->sections[] = array(
	'title'      => __( 'Logo', 'mixt' ),
	'icon'       => 'el-icon-globe',
	'fields'     => array(

		// Type
		array(
			'id'       => 'logo-type',
			'type'     => 'button_set',
			'title'    => __( 'Type', 'mixt' ),
			'subtitle' => __( 'Display text or an image as the logo', 'mixt' ),
			'options'  => array(
				'img'  => __( 'Image', 'mixt' ),
				'text' => __( 'Text', 'mixt' ),
			),
			'default'  => 'text',
		),

		// Image Select
		array(
			'id'       => 'logo-img',
			'type'     => 'media',
			'url'      => false,
			'title'    => __( 'Image', 'mixt' ),
			'subtitle' => __( 'Select the image you want to use as the site\'s logo', 'mixt' ),
			'required' => array('logo-type', '=', 'img'),
		),

		// Inverse Image Select
		array(
			'id'       => 'logo-img-inv',
			'type'     => 'media',
			'url'      => false,
			'title'    => __( 'Inverse Image', 'mixt' ),
			'subtitle' => __( 'Select an inverse logo image for dark backgrounds', 'mixt' ),
			'required' => array('logo-type', '=', 'img'),
		),

		// Hi-Res
		array(
			'id'       => 'logo-img-hr',
			'type'     => 'switch',
			'title'    => __( 'Hi-Res', 'mixt' ),
			'subtitle' => __( 'Scale down logo to half size so it will look sharp on high-resolution screens like Retina', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => true,
			'required' => array('logo-type', '=', 'img'),
		),

		// Text Field
		array(
			'id'       => 'logo-text',
			'type'     => 'text',
			'title'    => __( 'Text', 'mixt' ),
			'subtitle' => __( 'Enter the logo text (leave empty to use the site name)', 'mixt' ),
			'required' => array('logo-type', '=', 'text'),
		),

		// Text Style
		array(
			'id'             => 'logo-text-typo',
			'type'           => 'typography',
			'title'          => __( 'Text Style', 'mixt' ),
			'subtitle'       => __( 'Set up how you want your text logo to look', 'mixt' ),
			'color'          => false,
			'google'         => true,
			'font-backup'    => true,
			'line-height'    => false,
			'text-align'     => false,
			'text-transform' => true,
			'units'          => 'px',
			'default'        => array(
				'google' => false,
			),
			'required'       => array('logo-type', '=', 'text'),
		),

		// Text Color
		array(
			'id'       => 'logo-text-color',
			'type'     => 'color',
			'title'    => __( 'Text Color', 'mixt' ),
			'subtitle' => __( 'Select a logo text color', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
			'default'  => '#333',
			'required' => array('logo-type', '=', 'text'),
		),

		// Text Inverse Color
		array(
			'id'       => 'logo-text-inv',
			'type'     => 'color',
			'title'    => __( 'Text Inverse Color', 'mixt' ),
			'subtitle' => __( 'Select a logo text color for dark backgrounds', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
			'default'  => '#fff',
			'required' => array('logo-type', '=', 'text'),
		),

		// Shrink
		array(
			'id'       => 'logo-shrink',
			'type'     => 'spinner',
			'title'    => __( 'Shrink', 'mixt' ),
			'subtitle' => __( 'Amount of pixels the logo will shrink when the navbar becomes fixed <br>(0 means no shrink)', 'mixt' ),
			'min'      => '0',
			'max'      => '20',
			'step'     => '1',
			'default'  => '6',
		),

		// Tagline
		array(
			'id'       => 'logo-show-tagline',
			'type'     => 'switch',
			'title'    => __( 'Tagline', 'mixt' ),
			'subtitle' => __( 'Show the site\'s tagline (or a custom one) next to the logo', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => false,
		),

		// Tagline Text
		array(
			'id'       => 'logo-tagline',
			'type'     => 'text',
			'title'    => __( 'Tagline Text', 'mixt' ),
			'subtitle' => __( 'Enter the tagline text (leave empty to use the site tagline)', 'mixt' ),
			'required' => array('logo-show-tagline', '=', true),
		),

		// Tagline Style
		array(
			'id'             => 'logo-tagline-typo',
			'type'           => 'typography',
			'title'          => __( 'Tagline Style', 'mixt' ),
			'color'          => false,
			'google'         => true,
			'font-backup'    => true,
			'line-height'    => false,
			'text-align'     => false,
			'text-transform' => true,
			'units'          => 'px',
			'default'        => array(
				'google' => false,
			),
			'required'       => array('logo-show-tagline', '=', true),
		),

		// Tagline Color
		array(
			'id'       => 'logo-tagline-color',
			'type'     => 'color',
			'title'    => __( 'Tagline Color', 'mixt' ),
			'subtitle' => __( 'Select a tagline text color', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
			'default'  => '#333',
			'required' => array('logo-show-tagline', '=', true),
		),

		// Tagline Inverse Color
		array(
			'id'       => 'logo-tagline-inv',
			'type'     => 'color',
			'title'    => __( 'Tagline Inverse Color', 'mixt' ),
			'subtitle' => __( 'Select a tagline text color for dark backgrounds', 'mixt' ),
			'transparent' => false,
			'validate' => 'color',
			'default'  => '#fff',
			'required' => array('logo-show-tagline', '=', true),
		),
	),
);
