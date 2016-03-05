<?php

$sidebar_fields = array(

	// Sidebar Switch
	array(
		'id'      => $prefix . 'page-sidebar',
		'name'    => esc_html__( 'Display', 'mixt' ),
		'desc'    => esc_html__( 'Show the sidebar on this page', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Position
	array(
		'id'      => $prefix . 'sidebar-position',
		'name'    => esc_html__( 'Position', 'mixt' ),
		'desc'    => esc_html__( 'Sidebar to the left or to the right of the page', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'left'  => esc_html__( 'Left', 'mixt' ),
			'right' => esc_html__( 'Right', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Hide On Mobile
	array(
		'id'      => $prefix . 'sidebar-hide',
		'name'    => esc_html__( 'Hide On Mobile', 'mixt' ),
		'desc'    => esc_html__( 'Hide sidebar on mobile / small screens', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Child Page Navigation
	array(
		'id'      => $prefix . 'child-page-nav',
		'name'    => esc_html__( 'Child Pages Menu', 'mixt' ),
		'desc'    => esc_html__( 'Display a navigation menu of child pages in the sidebar, when available', 'mixt' ),
		'type'    => 'radio_inline',
		'options'  => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),
);

// Custom sidebar select
$custom_sidebars = mixt_get_sidebars();
if ( $custom_sidebars ) {
	$sidebar_fields[] = array(
		'id'      => $prefix . 'sidebar-id',
		'name'    => esc_html__( 'Sidebar', 'mixt' ),
		'desc'    => esc_html__( 'The sidebar to use for this page', 'mixt' ),
		'type'    => 'select',
		'options' => $custom_sidebars,
		'default' => 'auto',
	);
}

mixt_cmb_make_tab( $fields, esc_html__( 'Sidebar', 'mixt' ), 'dashicons dashicons-align-left', $sidebar_fields );
