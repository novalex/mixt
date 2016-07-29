<?php

$this->sections[] = array(
	'title'      => esc_html__( 'Forums', 'mixt' ),
	'desc'       => esc_html__( 'Customize the forum\'s options and appearance', 'mixt' ),
	'icon'       => 'el-icon-comment-alt',
	'customizer' => false,
	'fields'     => array(

		// Nav Menu
		array(
			'id'       => 'forum-page-nav-menu',
			'type'     => 'select',
			'title'    => esc_html__( 'Nav Menu', 'mixt' ),
			'subtitle' => esc_html__( 'Select the menu for this page', 'mixt' ),
			'options'  => $nav_menus,
			'default'  => 'auto',
		),

		// Fullwidth
		array(
			'id'       => 'forum-page-page-fullwidth',
			'type'     => 'button_set',
			'title'    => esc_html__( 'Full Width', 'mixt' ),
			'options'  => array(
				'auto'  => esc_html__( 'Auto', 'mixt' ),
				'true'  => esc_html__( 'Yes', 'mixt' ),
				'false' => esc_html__( 'No', 'mixt' ),
			),
			'default'  => 'auto',
		),

		// Sidebar
		array(
			'id'       => 'forum-page-page-sidebar',
			'type'     => 'button_set',
			'title'    => esc_html__( 'Show Sidebar', 'mixt' ),
			'options'  => array(
				'auto'  => esc_html__( 'Auto', 'mixt' ),
				'true'  => esc_html__( 'Yes', 'mixt' ),
				'false' => esc_html__( 'No', 'mixt' ),
			),
			'default'  => 'auto',
		),

		// Forums Sidebar
		array(
			'id'       => 'forum-page-sidebar-id',
			'type'     => 'select',
			'title'    => esc_html__( 'Sidebar', 'mixt' ),
			'subtitle' => esc_html__( 'Select a sidebar to use on this page', 'mixt' ),
			'options'  => $available_sidebars,
			'default'  => '',
		),
	),
);


// SINGLE TOPIC PAGE

$this->sections[] = array(
	'title'      => esc_html__( 'Topic Page', 'mixt' ),
	'desc'       => esc_html__( 'Manage the forum topic page', 'mixt' ),
	'icon'       => 'el-icon-edit',
	'customizer' => false,
	'subsection' => true,
	'fields'     => array(
		//
	),
);
