<?php

$this->sections[] = array(
	'title'      => esc_html__( 'Typography', 'mixt' ),
	'desc'       => esc_html__( 'Manage the site\'s typography options and fonts.', 'mixt' ),
	'icon'       => 'el-icon-font',
	'customizer' => false,
	'fields'     => array(

		// Site-Wide Font
		array(
			'id'           => 'font-sitewide',
			'type'         => 'typography',
			'title'        => esc_html__( 'Main Font', 'mixt' ),
			'subtitle'     => esc_html__( 'Select the font to use site-wide', 'mixt' ),
			'google'       => true,
			'font-backup'  => true,
			'all_styles'   => true,
			'color'        => false,
			'line-height'  => false,
			'text-align'   => false,
			'font-style'   => false,
			'font-weight'  => false,
			'custom_fonts' => true,
			'units'        => 'px',
			'default'      => array(
				'google'      => true,
				'font-family' => 'Lato',
				'font-size'   => '14px',
			),
		),

		// Nav Font
		array(
			'id'             => 'font-nav',
			'type'           => 'typography',
			'title'          => esc_html__( 'Navbar Font', 'mixt' ),
			'subtitle'       => esc_html__( 'Select the font to use for the navbar', 'mixt' ),
			'google'         => true,
			'font-backup'    => true,
			'color'          => false,
			'line-height'    => false,
			'text-align'     => false,
			'font-style'     => false,
			'font-weight'    => true,
			'text-transform' => true,
			'units'          => 'px',
			'default'        => array(
				'google' => false,
			),
		),

		// Nav Submenu Font
		array(
			'id'             => 'font-nav-sub',
			'type'           => 'typography',
			'title'          => esc_html__( 'Navbar Submenu Font', 'mixt' ),
			'subtitle'       => esc_html__( 'Select the font to use for the navbar submenus', 'mixt' ),
			'google'         => true,
			'font-backup'    => true,
			'color'          => false,
			'line-height'    => false,
			'text-align'     => false,
			'font-style'     => false,
			'font-weight'    => true,
			'text-transform' => true,
			'units'          => 'px',
			'default'        => array(
				'google' => false,
			),
		),

		// Header Font
		array(
			'id'             => 'font-header',
			'type'           => 'typography',
			'title'          => esc_html__( 'Header Font', 'mixt' ),
			'subtitle'       => esc_html__( 'Select the font to use for the header', 'mixt' ),
			'google'         => true,
			'font-backup'    => true,
			'color'          => false,
			'line-height'    => false,
			'text-align'     => false,
			'font-style'     => false,
			'font-weight'    => true,
			'text-transform' => true,
			'units'          => 'px',
			'default'        => array(
				'google' => false,
			),
		),

		// Location Bar Font
		array(
			'id'             => 'font-loc-bar',
			'type'           => 'typography',
			'title'          => esc_html__( 'Location Bar Font', 'mixt' ),
			'subtitle'       => esc_html__( 'Select the font to use for the location bar', 'mixt' ),
			'google'         => true,
			'font-backup'    => true,
			'color'          => false,
			'line-height'    => false,
			'text-align'     => false,
			'font-style'     => false,
			'font-weight'    => true,
			'text-transform' => true,
			'units'          => 'px',
			'default'        => array(
				'google' => false,
			),
		),

		// Sidebar Font
		array(
			'id'             => 'font-sidebar',
			'type'           => 'typography',
			'title'          => esc_html__( 'Sidebar Font', 'mixt' ),
			'subtitle'       => esc_html__( 'Select the font to use for the sidebar', 'mixt' ),
			'google'         => true,
			'font-backup'    => true,
			'color'          => false,
			'line-height'    => false,
			'text-align'     => false,
			'font-style'     => false,
			'font-weight'    => true,
			'text-transform' => true,
			'units'          => 'px',
			'default'        => array(
				'google' => false,
			),
		),

		// Footer Widgets Font
		array(
			'id'             => 'font-footer-widgets',
			'type'           => 'typography',
			'title'          => esc_html__( 'Footer Widgets Font', 'mixt' ),
			'subtitle'       => esc_html__( 'Select the font to use for the footer widgets', 'mixt' ),
			'google'         => true,
			'font-backup'    => true,
			'color'          => false,
			'line-height'    => false,
			'text-align'     => false,
			'font-style'     => false,
			'font-weight'    => true,
			'text-transform' => true,
			'units'          => 'px',
			'default'        => array(
				'google' => false,
			),
		),

		// Footer Copyright Font
		array(
			'id'             => 'font-footer-copyright',
			'type'           => 'typography',
			'title'          => esc_html__( 'Footer Copyright Font', 'mixt' ),
			'subtitle'       => esc_html__( 'Select the font to use for the footer copyright', 'mixt' ),
			'google'         => true,
			'font-backup'    => true,
			'color'          => false,
			'line-height'    => false,
			'text-align'     => false,
			'font-style'     => false,
			'font-weight'    => true,
			'text-transform' => true,
			'units'          => 'px',
			'default'        => array(
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
		'id'             => "font-heading-h{$hx}",
		'type'           => 'typography',
		'title'          => sprintf( esc_html__( 'Heading %d', 'mixt' ), $hx ),
		'google'         => true,
		'font-backup'    => true,
		'color'          => false,
		'line-height'    => false,
		'text-align'     => false,
		'font-size'      => true,
		'font-style'     => false,
		'font-weight'    => true,
		'text-transform' => true,
		'units'          => 'px',
		'default'        => array(
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


// POSTS

$this->sections[] = array(
	'title'      => esc_html__( 'Posts', 'mixt' ),
	'icon'       => 'el-icon-fontsize',
	'subsection' => true,
	'customizer' => false,
	'fields'     => array(

		// Post Title Font
		array(
			'id'             => 'font-post-title',
			'type'           => 'typography',
			'title'          => esc_html__( 'Post Title Font', 'mixt' ),
			'subtitle'       => esc_html__( 'Select the font to use for post titles', 'mixt' ),
			'google'         => true,
			'font-backup'    => true,
			'color'          => false,
			'line-height'    => false,
			'text-align'     => false,
			'font-style'     => false,
			'font-weight'    => true,
			'text-transform' => true,
			'units'          => 'px',
			'default'        => array(
				'google' => false,
			),
		),

		// Post Content Font
		array(
			'id'             => 'font-post-content',
			'type'           => 'typography',
			'title'          => esc_html__( 'Post Content Font', 'mixt' ),
			'subtitle'       => esc_html__( 'Select the font to use for post content', 'mixt' ),
			'google'         => true,
			'font-backup'    => true,
			'color'          => false,
			'line-height'    => false,
			'text-align'     => false,
			'font-style'     => false,
			'font-weight'    => true,
			'text-transform' => true,
			'units'          => 'px',
			'default'        => array(
				'google' => false,
			),
		),

		// Comments Font
		array(
			'id'             => 'font-comments',
			'type'           => 'typography',
			'title'          => esc_html__( 'Comments Font', 'mixt' ),
			'subtitle'       => esc_html__( 'Select the font to use for comments', 'mixt' ),
			'google'         => true,
			'font-backup'    => true,
			'color'          => false,
			'line-height'    => false,
			'text-align'     => false,
			'font-style'     => false,
			'font-weight'    => true,
			'text-transform' => true,
			'units'          => 'px',
			'default'        => array(
				'google' => false,
			),
		),

	),
);