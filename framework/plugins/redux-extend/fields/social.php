<?php

$this->sections[] = array(
	'title'      => esc_html__( 'Social', 'mixt' ),
	'desc'       => esc_html__( 'Manage your social settings and profiles', 'mixt' ),
	'icon'       => 'el-icon-group',
	'customizer' => false,
	'fields'     => array(

		// Enable Open Graph Meta
		array(
			'id'       => 'social-og-meta',
			'type'     => 'switch',
			'title'    => esc_html__( 'Open Graph Meta', 'mixt' ),
			'subtitle' => esc_html__( 'Add Open Graph attributes and meta information to improve social sharing for various sites', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => false,
		),

		// FB App ID
		array(
			'id'       => 'social-fb-appid',
			'type'     => 'text',
			'title'    => esc_html__( 'Facebook App ID', 'mixt' ),
			'subtitle' => esc_html__( 'Enter your Facebook app ID here to enable analytics and other features', 'mixt' ),
			'required' => array('social-og-meta', '=', true),
		),

		// FB Admins
		array(
			'id'       => 'social-fb-admins',
			'type'     => 'multi_text',
			'title'    => esc_html__( 'Facebook Admins', 'mixt' ),
			'subtitle' => esc_html__( 'Enter your Facebook admin ID(s) here to enable analytics and other features', 'mixt' ),
			'required' => array('social-og-meta', '=', true),
		),

		// Sharing Site Name
		array(
			'id'       => 'social-site-name',
			'type'     => 'text',
			'title'    => esc_html__( 'Site Name', 'mixt' ),
			'subtitle' => esc_html__( 'Show a custom site name when sharing (leave empty to use the site title from the settings)', 'mixt' ),
			'required' => array('social-og-meta', '=', true),
		),

		// Sharing Image Placeholder
		array(
			'id'             => 'social-img-ph',
			'type'           => 'media',
			'title'          => esc_html__( 'Sharing Image Placeholder', 'mixt' ),
			'subtitle'       => esc_html__( 'Select a placeholder image to show if the post being shared does not have a featured image', 'mixt' ),
			'mode'           => 'jpg, jpeg, png',
			'library_filter' => array('jpg', 'jpeg', 'png'),
			'required'       => array('social-og-meta', '=', true),
		),

		// Social Icons Color On Hover
		array(
			'id'       => 'social-icons-color',
			'type'     => 'button_set',
			'title'    => esc_html__( 'Social Icons Color On Hover', 'mixt' ),
			'subtitle' => esc_html__( 'Color the icon, its background, or neither on hover', 'mixt' ),
			'options'  => array(
				'icon' => esc_html__( 'Icon', 'mixt' ),
				'bg'   => esc_html__( 'Background', 'mixt' ),
				'none' => esc_html__( 'Neither', 'mixt' ),
			),
			'default'  => 'bg',
		),

		// Social Icons Tooltip
		array(
			'id'       => 'social-icons-tooltip',
			'type'     => 'switch',
			'title'    => esc_html__( 'Social Icons Tooltip', 'mixt' ),
			'subtitle' => esc_html__( 'Show a tooltip when a social icon is hovered', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => true,
		),
			
		// Social Profiles
		array(
			'id'       => 'social-profiles',
			'type'     => 'mixt_multi_input',
			'no_title' => true,
			'add_text' => esc_html__( 'New Profile', 'mixt' ),
			'sortable' => true,
			'inputs'   => array(
				'name' => array(
					'icon'        => 'el-icon-tag',
					'wrap_class'  => 'social-label social-name',
					'input_class' => 'mixt-social-field network-name',
					'placeholder' => esc_html__( 'Name', 'mixt' ),
				),
				'url' => array(
					'icon'        => 'el-icon-globe',
					'wrap_class'  => 'social-label social-url',
					'input_class' => 'mixt-social-field network-url',
					'placeholder' => esc_html__( 'URL', 'mixt' ),
				),
				'icon' => array(
					'icon'        => 'el-icon-stop',
					'wrap_class'  => 'social-label social-icon',
					'input_class' => 'mixt-social-field network-icon',
					'placeholder' => esc_html__( 'Icon', 'mixt' ),
				),
				'color' => array(
					'type'        => 'color',
					'wrap_class'  => 'social-label social-color',
					'input_class' => 'mixt-social-field network-color',
				),
				'title' => array(
					'icon'        => 'el-icon-comment',
					'wrap_class'  => 'social-label social-title',
					'input_class' => 'mixt-social-field network-title',
					'placeholder' => esc_html__( 'Title', 'mixt' ),
				),
			),
			'default'  => $social_profiles,
		),
	),
);
