<?php

mixt_cmb_make_tab( $fields, __( 'General', 'mixt' ), 'dashicons dashicons-admin-site', array(

	// Site Theme
	array(
		'id'      => $prefix . 'site-theme',
		'name'    => __( 'Theme', 'mixt' ),
		'desc'    => __( 'The site-wide theme for this page', 'mixt' ),
		'type'    => 'select',
		'options' => $site_themes,
		'default' => 'auto',
	),

	// Page Full Width Switch
	array(
		'id'      => $prefix . 'page-fullwidth',
		'name'    => __( 'Full Width', 'mixt' ),
		'desc'    => __( 'Display page in full width mode', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => __( 'Auto', 'mixt' ),
			'true'  => __( 'Yes', 'mixt' ),
			'false' => __( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),
) );
