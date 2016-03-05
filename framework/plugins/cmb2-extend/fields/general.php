<?php

mixt_cmb_make_tab( $fields, esc_html__( 'General', 'mixt' ), 'dashicons dashicons-admin-site', array(

	// Site Theme
	array(
		'id'      => $prefix . 'site-theme',
		'name'    => esc_html__( 'Theme', 'mixt' ),
		'desc'    => esc_html__( 'The site-wide theme for this page', 'mixt' ),
		'type'    => 'select',
		'options' => $site_themes,
		'default' => 'auto',
	),

	// Page Full Width Switch
	array(
		'id'      => $prefix . 'page-fullwidth',
		'name'    => esc_html__( 'Full Width', 'mixt' ),
		'desc'    => esc_html__( 'Display page in full width mode', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),
) );
