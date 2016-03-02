<?php

$this->sections[] = array(
	'title'      => __( 'Sidebars', 'mixt' ),
	'desc'       => __( 'Configure the sidebars and their appearance', 'mixt' ),
	'icon'       => 'el-icon-pause',
	'customizer' => false,
	'fields'     => array(

		// Enable Sidebar
		array(
			'id'       => 'page-sidebar',
			'type'     => 'switch',
			'title'    => __( 'Enabled', 'mixt' ),
			'subtitle' => __( 'Display the sidebar', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => true,
		),

		// Sidebar Position
		array(
			'id'       => 'sidebar-position',
			'type'     => 'button_set',
			'title'    => __( 'Position', 'mixt' ),
			'subtitle' => __( 'Sidebar to the left or to the right of the page', 'mixt' ),
			'options'  => array(
				'left'  => __( 'Left', 'mixt' ),
				'right' => __( 'Right', 'mixt' ),
			),
			'default'  => 'right',
		),

		// Sidebar Width
		array(
			'id'       => 'sidebar-width',
			'type'     => 'dimensions',
			'title'    => __( 'Width', 'mixt' ),
			'subtitle' => __( 'Set a custom sidebar width', 'mixt' ),
			'units'    => array('px', '%'),
			'height'   => false,
		),

		// Small Sidebar Width
		array(
			'id'       => 'sidebar-width-sm',
			'type'     => 'dimensions',
			'title'    => __( 'Small Width', 'mixt' ),
			'subtitle' => __( 'Set a custom sidebar width for smaller screens', 'mixt' ),
			'units'    => array('px', '%'),
			'height'   => false,
		),

		// Hide On Mobile
		array(
			'id'       => 'sidebar-hide',
			'type'     => 'switch',
			'title'    => __( 'Hide On Mobile', 'mixt' ),
			'subtitle' => __( 'Hide sidebar on mobile / small screens', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => false,
		),

		// Child Page Navigation
		array(
			'id'       => 'child-page-nav',
			'type'     => 'switch',
			'title'    => __( 'Child Pages Menu', 'mixt' ),
			'subtitle' => __( 'Display a navigation menu of child pages in the sidebar, when available', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => true,
		),

		// Additional Sidebars
		array(
			'id'       => 'reg-sidebars',
			'type'     => 'mixt_multi_input',
			'title'    => __( 'Custom Sidebars', 'mixt' ),
			'subtitle' => __( 'Register custom sidebars to use on different pages or locations', 'mixt' ),
			'add_text' => __( 'New Sidebar', 'mixt' ),
			'sortable' => true,
			'inputs'   => array(
				'name' => array(
					'wrap_class'  => 'sidebar-custom sidebar-name',
					'placeholder' => __( 'Name', 'mixt' ),
				),
				'id' => array(
					'wrap_class'  => 'sidebar-custom sidebar-id',
					'placeholder' => __( 'ID', 'mixt' ),
				),
			),
		),
	),
);
