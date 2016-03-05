<?php

mixt_cmb_make_tab( $fields, esc_html__( 'Footer', 'mixt' ), 'dashicons dashicons-minus', array(

	// Widget Area Switch
	array(
		'id'      => $prefix . 'footer-widgets-show',
		'name'    => esc_html__( 'Display Widget Area', 'mixt' ),
		'desc'    => esc_html__( 'Show the footer widget area on this page', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Copyright Area Switch
	array(
		'id'      => $prefix . 'footer-copy-show',
		'name'    => esc_html__( 'Display Copyright Area', 'mixt' ),
		'desc'    => esc_html__( 'Show the footer copyright area on this page', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),
) );
