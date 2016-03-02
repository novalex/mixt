<?php

$this->sections[] = array(
	'title'      => __( 'Social', 'mixt' ),
	'desc'       => __( 'Manage your social settings and profiles', 'mixt' ),
	'icon'       => 'el-icon-group',
	'customizer' => false,
	'fields'     => array(

		// Enable Open Graph Meta
		array(
			'id'       => 'social-og-meta',
			'type'     => 'switch',
			'title'    => __( 'Open Graph Meta', 'mixt' ),
			'subtitle' => __( 'Add Open Graph attributes and meta information to improve social sharing for various sites', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => false,
		),

		// FB App ID
		array(
			'id'       => 'social-fb-appid',
			'type'     => 'text',
			'title'    => __( 'Facebook App ID', 'mixt' ),
			'subtitle' => __( 'Enter your Facebook app ID here to enable analytics and other features', 'mixt' ),
			'required' => array('social-og-meta', '=', true),
		),

		// FB Admins
		array(
			'id'       => 'social-fb-admins',
			'type'     => 'multi_text',
			'title'    => __( 'Facebook Admins', 'mixt' ),
			'subtitle' => __( 'Enter your Facebook admin ID(s) here to enable analytics and other features', 'mixt' ),
			'required' => array('social-og-meta', '=', true),
		),

		// Sharing Site Name
		array(
			'id'       => 'social-site-name',
			'type'     => 'text',
			'title'    => __( 'Site Name', 'mixt' ),
			'subtitle' => __( 'Show a custom site name when sharing (leave empty to use the site title from the settings)', 'mixt' ),
			'required' => array('social-og-meta', '=', true),
		),

		// Sharing Image Placeholder
		array(
			'id'             => 'social-img-ph',
			'type'           => 'media',
			'title'          => __( 'Sharing Image Placeholder', 'mixt' ),
			'subtitle'       => __( 'Select a placeholder image to show if the post being shared does not have a featured image', 'mixt' ),
			'mode'           => 'jpg, jpeg, png',
			'library_filter' => array('jpg', 'jpeg', 'png'),
			'required'       => array('social-og-meta', '=', true),
		),

		// Social Icons Color On Hover
		array(
			'id'       => 'social-icons-color',
			'type'     => 'button_set',
			'title'    => __( 'Social Icons Color On Hover', 'mixt' ),
			'subtitle' => __( 'Color the icon, its background, or neither on hover', 'mixt' ),
			'options'  => array(
				'icon' => __( 'Icon', 'mixt' ),
				'bg'   => __( 'Background', 'mixt' ),
				'none' => __( 'Neither', 'mixt' ),
			),
			'default'  => 'bg',
		),

		// Social Icons Tooltip
		array(
			'id'       => 'social-icons-tooltip',
			'type'     => 'switch',
			'title'    => __( 'Social Icons Tooltip', 'mixt' ),
			'subtitle' => __( 'Show a tooltip when a social icon is hovered', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => true,
		),
			
		// Social Profiles
		array(
			'id'       => 'social-profiles',
			'type'     => 'mixt_multi_input',
			'no_title' => true,
			'add_text' => __( 'New Profile', 'mixt' ),
			'sortable' => true,
			'inputs'   => array(
				'name' => array(
					'icon'        => 'el-icon-tag',
					'wrap_class'  => 'social-label social-name',
					'input_class' => 'mixt-social-field network-name',
					'placeholder' => __( 'Name', 'mixt' ),
				),
				'url' => array(
					'icon'        => 'el-icon-globe',
					'wrap_class'  => 'social-label social-url',
					'input_class' => 'mixt-social-field network-url',
					'placeholder' => __( 'URL', 'mixt' ),
				),
				'icon' => array(
					'icon'        => 'el-icon-stop',
					'wrap_class'  => 'social-label social-icon',
					'input_class' => 'mixt-social-field network-icon',
					'placeholder' => __( 'Icon', 'mixt' ),
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
					'placeholder' => __( 'Title', 'mixt' ),
				),
			),
			'default'  => $social_profiles,
		),
	),
);
