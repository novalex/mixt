<?php

$sidebar_fields = array(

	// Sidebar Switch
	array(
		'id'      => $prefix . 'page-sidebar',
		'name'    => __( 'Display', 'mixt' ),
		'desc'    => __( 'Show the sidebar on this page', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => __( 'Auto', 'mixt' ),
			'true'  => __( 'Yes', 'mixt' ),
			'false' => __( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Position
	array(
		'id'      => $prefix . 'sidebar-position',
		'name'    => __( 'Position', 'mixt' ),
		'desc'    => __( 'Sidebar to the left or to the right of the page', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => __( 'Auto', 'mixt' ),
			'left'  => __( 'Left', 'mixt' ),
			'right' => __( 'Right', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Hide On Mobile
	array(
		'id'      => $prefix . 'sidebar-hide',
		'name'    => __( 'Hide On Mobile', 'mixt' ),
		'desc'    => __( 'Hide sidebar on mobile / small screens', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => __( 'Auto', 'mixt' ),
			'true'  => __( 'Yes', 'mixt' ),
			'false' => __( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Child Page Navigation
	array(
		'id'      => $prefix . 'child-page-nav',
		'name'    => __( 'Child Pages Menu', 'mixt' ),
		'desc'    => __( 'Display a navigation menu of child pages in the sidebar, when available', 'mixt' ),
		'type'    => 'radio_inline',
		'options'  => array(
			'auto'  => __( 'Auto', 'mixt' ),
			'true'  => __( 'Yes', 'mixt' ),
			'false' => __( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),
);

// Custom sidebar select
$custom_sidebars = mixt_get_sidebars();
if ( $custom_sidebars ) {
	$sidebar_fields[] = array(
		'id'      => $prefix . 'sidebar-id',
		'name'    => __( 'Sidebar', 'mixt' ),
		'desc'    => __( 'The sidebar to use for this page', 'mixt' ),
		'type'    => 'select',
		'options' => $custom_sidebars,
		'default' => 'auto',
	);
}

mixt_cmb_make_tab( $fields, __( 'Sidebar', 'mixt' ), 'dashicons dashicons-align-left', $sidebar_fields );
