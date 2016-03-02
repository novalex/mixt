<?php

$navigation_fields = array(

	// Nav Menu
	array(
		'id'      => $prefix . 'nav-menu',
		'name'    => __( 'Nav Menu', 'mixt' ),
		'desc'    => __( 'Select the menu for this page', 'mixt' ),
		'type'    => 'select',
		'options' => mixt_get_nav_menus(),
		'default' => 'auto',
	),

	// Navbar Theme
	array(
		'id'      => $prefix . 'nav-theme',
		'name'    => __( 'Theme', 'mixt' ),
		'desc'    => __( 'The navbar theme for this page', 'mixt' ),
		'type'    => 'select',
		'options' => $nav_themes,
		'default' => 'auto',
	),

	// See-Through Nav
	array(
		'id'      => $prefix . 'nav-transparent',
		'name'    => __( 'See-Through', 'mixt' ),
		'desc'    => __( 'Navbar see-through when at the top', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => __( 'Auto', 'mixt' ),
			'true'  => __( 'Yes', 'mixt' ),
			'false' => __( 'No', 'mixt' ),
		),
		'default'    => 'auto',
	),

	// See-Through Opacity
	array(
		'id'         => $prefix . 'nav-top-opacity',
		'name'       => __( 'See-Through Opacity', 'mixt' ),
		'desc'       => __( 'Set the navbar&#39;s see-through opacity, between 0 (transparent) and 1 (opaque)', 'mixt' ),
		'type'       => 'slider',
		'min'        => 0,
		'max'        => 1,
		'step'       => 0.05,
		'default'    => 'auto',
		'tooltip'    => true,
		'label_cb'   => 'mixt_cmb_auto_label_cb',
		'attributes' => array(
			'data-parent-field' => $prefix . 'nav-transparent',
			'data-show-on-id'   => $prefix . 'nav-transparent2',
		),
	),
);

if ( mixt_get_option( array( 'key' => 'nav-layout', 'return' => 'value' ) ) == 'horizontal' ) {

	// Nav Position (Above or Below Header)
	$navigation_fields[] = array(
		'id'      => $prefix . 'nav-position',
		'name'    => __( 'Position', 'mixt' ),
		'desc'    => __( 'Navbar above or below header', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => __( 'Auto', 'mixt' ),
			'above' => __( 'Above', 'mixt' ),
			'below' => __( 'Below', 'mixt' ),
		),
		'default' => 'auto',
	);
}

// Secondary Nav Switch
$navigation_fields[] = array(
	'id'      => $prefix . 'second-nav',
	'name'    => __( 'Secondary Navbar', 'mixt' ),
	'desc'    => __( 'Show the secondary navbar', 'mixt' ),
	'type'    => 'radio_inline',
	'options' => array(
		'auto'  => __( 'Auto', 'mixt' ),
		'true'  => __( 'Yes', 'mixt' ),
		'false' => __( 'No', 'mixt' ),
	),
	'default' => 'auto',
);

// Secondary Nav Theme
$navigation_fields[] = array(
	'id'      => $prefix . 'sec-nav-theme',
	'name'    => __( 'Secondary Nav Theme', 'mixt' ),
	'desc'    => __( 'Select the theme for the secondary navbar', 'mixt' ),
	'type'    => 'select',
	'options' => $nav_themes,
	'default' => 'auto',
);

mixt_cmb_make_tab( $fields, __( 'Navigation', 'mixt' ), 'dashicons dashicons-menu', $navigation_fields );
