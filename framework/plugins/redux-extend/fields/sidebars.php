<?php

$this->sections[] = array(
	'title'      => esc_html__( 'Sidebars', 'mixt' ),
	'desc'       => esc_html__( 'Configure the sidebars and their appearance', 'mixt' ),
	'icon'       => 'el-icon-pause',
	'customizer' => false,
	'fields'     => array(

		// Enable Sidebar
		array(
			'id'       => 'page-sidebar',
			'type'     => 'switch',
			'title'    => esc_html__( 'Enabled', 'mixt' ),
			'subtitle' => esc_html__( 'Display the sidebar', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => true,
		),

		// Sidebar Position
		array(
			'id'       => 'sidebar-position',
			'type'     => 'button_set',
			'title'    => esc_html__( 'Position', 'mixt' ),
			'subtitle' => esc_html__( 'Sidebar to the left or to the right of the page', 'mixt' ),
			'options'  => array(
				'left'  => esc_html__( 'Left', 'mixt' ),
				'right' => esc_html__( 'Right', 'mixt' ),
			),
			'default'  => 'right',
		),

		// Sidebar Width
		array(
			'id'       => 'sidebar-width',
			'type'     => 'dimensions',
			'title'    => esc_html__( 'Width', 'mixt' ),
			'subtitle' => esc_html__( 'Set a custom sidebar width', 'mixt' ),
			'units'    => array('px', '%'),
			'height'   => false,
		),

		// Small Sidebar Width
		array(
			'id'       => 'sidebar-width-sm',
			'type'     => 'dimensions',
			'title'    => esc_html__( 'Small Width', 'mixt' ),
			'subtitle' => esc_html__( 'Set a custom sidebar width for smaller screens', 'mixt' ),
			'units'    => array('px', '%'),
			'height'   => false,
		),

		// Hide On Mobile
		array(
			'id'       => 'sidebar-hide',
			'type'     => 'switch',
			'title'    => esc_html__( 'Hide On Mobile', 'mixt' ),
			'subtitle' => esc_html__( 'Hide sidebar on mobile / small screens', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => false,
		),

		// Child Page Navigation
		array(
			'id'       => 'child-page-nav',
			'type'     => 'switch',
			'title'    => esc_html__( 'Child Pages Menu', 'mixt' ),
			'subtitle' => esc_html__( 'Display a navigation menu of child pages in the sidebar, when available', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => true,
		),

		// Additional Sidebars
		array(
			'id'       => 'reg-sidebars',
			'type'     => 'mixt_multi_input',
			'title'    => esc_html__( 'Custom Sidebars', 'mixt' ),
			'subtitle' => esc_html__( 'Register custom sidebars to use on different pages or locations', 'mixt' ),
			'add_text' => esc_html__( 'New Sidebar', 'mixt' ),
			'sortable' => true,
			'inputs'   => array(
				'name' => array(
					'wrap_class'  => 'sidebar-custom sidebar-name',
					'placeholder' => esc_html__( 'Name', 'mixt' ),
				),
				'id' => array(
					'wrap_class'  => 'sidebar-custom sidebar-id',
					'placeholder' => esc_html__( 'ID', 'mixt' ),
				),
			),
		),
	),
);
