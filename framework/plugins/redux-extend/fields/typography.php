<?php

$this->sections[] = array(
	'title'      => esc_html__( 'Typography', 'mixt' ),
	'desc'       => esc_html__( 'Manage the site\'s typography options and fonts.', 'mixt' ),
	'icon'       => 'el-icon-font',
	'customizer' => false,
	'fields'     => array(

		// Site-Wide Font
		array(
			'id'          => 'font-sitewide',
			'type'        => 'typography',
			'title'       => esc_html__( 'Main Font', 'mixt' ),
			'subtitle'    => esc_html__( 'Select the font to use site-wide', 'mixt' ),
			'google'      => true,
			'font-backup' => true,
			'all_styles'  => true,
			'color'       => false,
			'line-height' => false,
			'text-align'  => false,
			'font-style'  => false,
			'font-weight' => false,
			'custom_fonts' => true,
			'units'       => 'px',
			'default'     => array(
				'google'      => true,
				'font-family' => 'Lato',
				'font-size'   => '14px',
			),
		),

		// Nav Font
		array(
			'id'          => 'font-nav',
			'type'        => 'typography',
			'title'       => esc_html__( 'Navbar Font', 'mixt' ),
			'subtitle'    => esc_html__( 'Select the font to use for the navbar', 'mixt' ),
			'google'      => true,
			'font-backup' => true,
			'color'       => false,
			'line-height' => false,
			'text-align'  => false,
			'font-style'  => false,
			'font-weight' => true,
			'text-transform' => true,
			'units'       => 'px',
			'default'     => array(
				'google' => false,
			),
		),

		// Nav Submenu Font
		array(
			'id'          => 'font-nav-sub',
			'type'        => 'typography',
			'title'       => esc_html__( 'Navbar Submenu Font', 'mixt' ),
			'subtitle'    => esc_html__( 'Select the font to use for the navbar submenus', 'mixt' ),
			'google'      => true,
			'font-backup' => true,
			'color'       => false,
			'line-height' => false,
			'text-align'  => false,
			'font-style'  => false,
			'font-weight' => true,
			'text-transform' => true,
			'units'       => 'px',
			'default'     => array(
				'google' => false,
			),
		),
	),
);

// HEADINGS

$heading_fields = array(

	// Heading Font
	array(
		'id'          => 'font-heading-main',
		'type'        => 'typography',
		'title'       => esc_html__( 'Heading Font', 'mixt' ),
		'subtitle'    => esc_html__( 'Set the default options for headings (can be overridden individually below)', 'mixt' ),
		'google'      => true,
		'font-backup' => true,
		'color'       => false,
		'line-height' => false,
		'text-align'  => false,
		'font-size'   => false,
		'font-style'  => false,
		'font-weight' => true,
		'text-transform' => true,
		'units'       => 'px',
		'default'     => array(
			'google' => false,
		),
	),

);

$hx = 1;
while ( $hx <= 6 ) {

	// Advanced typo field
	$heading_fields[] = array(
		'id'          => "font-heading-h{$hx}",
		'type'        => 'typography',
		'title'       => sprintf( esc_html__( 'Heading %d', 'mixt' ), $hx ),
		'google'      => true,
		'font-backup' => true,
		'color'       => false,
		'line-height' => false,
		'text-align'  => false,
		'font-size'   => true,
		'font-style'  => false,
		'font-weight' => true,
		'text-transform' => true,
		'units'       => 'px',
		'default'     => array(
			'google' => false,
		),
	);

	$hx++;
}

$this->sections[] = array(
	'title'      => esc_html__( 'Headings', 'mixt' ),
	'icon'       => 'el-icon-fontsize',
	'subsection' => true,
	'customizer' => false,
	'fields'     => $heading_fields,
);