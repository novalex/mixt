<?php

$navigation_fields = array(

	// Nav Menu
	array(
		'id'      => $prefix . 'nav-menu',
		'name'    => esc_html__( 'Nav Menu', 'mixt' ),
		'desc'    => esc_html__( 'Select the menu for this page', 'mixt' ),
		'type'    => 'select',
		'options' => mixt_get_nav_menus(),
		'default' => 'auto',
	),

	// Navbar Theme
	array(
		'id'      => $prefix . 'nav-theme',
		'name'    => esc_html__( 'Theme', 'mixt' ),
		'desc'    => esc_html__( 'The navbar theme for this page', 'mixt' ),
		'type'    => 'select',
		'options' => $nav_themes,
		'default' => 'auto',
	),

	// See-Through Nav
	array(
		'id'      => $prefix . 'nav-transparent',
		'name'    => esc_html__( 'See-Through', 'mixt' ),
		'desc'    => esc_html__( 'Navbar see-through when at the top', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
		),
		'default'    => 'auto',
	),

	// See-Through Opacity
	array(
		'id'         => $prefix . 'nav-top-opacity',
		'name'       => esc_html__( 'See-Through Opacity', 'mixt' ),
		'desc'       => esc_html__( 'Set the navbar&#39;s see-through opacity, between 0 (transparent) and 1 (opaque)', 'mixt' ),
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
		'name'    => esc_html__( 'Position', 'mixt' ),
		'desc'    => esc_html__( 'Navbar above or below header', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'above' => esc_html__( 'Above', 'mixt' ),
			'below' => esc_html__( 'Below', 'mixt' ),
		),
		'default' => 'auto',
	);
}

// Secondary Nav Switch
$navigation_fields[] = array(
	'id'      => $prefix . 'second-nav',
	'name'    => esc_html__( 'Secondary Navbar', 'mixt' ),
	'desc'    => esc_html__( 'Show the secondary navbar', 'mixt' ),
	'type'    => 'radio_inline',
	'options' => array(
		'auto'  => esc_html__( 'Auto', 'mixt' ),
		'true'  => esc_html__( 'Yes', 'mixt' ),
		'false' => esc_html__( 'No', 'mixt' ),
	),
	'default' => 'auto',
);

// Secondary Nav Theme
$navigation_fields[] = array(
	'id'      => $prefix . 'sec-nav-theme',
	'name'    => esc_html__( 'Secondary Nav Theme', 'mixt' ),
	'desc'    => esc_html__( 'Select the theme for the secondary navbar', 'mixt' ),
	'type'    => 'select',
	'options' => $nav_themes,
	'default' => 'auto',
);

mixt_cmb_make_tab( $fields, esc_html__( 'Navigation', 'mixt' ), 'dashicons dashicons-menu', $navigation_fields );
