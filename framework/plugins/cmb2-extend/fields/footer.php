<?php

mixt_cmb_make_tab( $fields, __( 'Footer', 'mixt' ), 'dashicons dashicons-minus', array(

	// Widget Area Switch
	array(
		'id'      => $prefix . 'footer-widgets-show',
		'name'    => __( 'Display Widget Area', 'mixt' ),
		'desc'    => __( 'Show the footer widget area on this page', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => __( 'Auto', 'mixt' ),
			'true'  => __( 'Yes', 'mixt' ),
			'false' => __( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Copyright Area Switch
	array(
		'id'      => $prefix . 'footer-copy-show',
		'name'    => __( 'Display Copyright Area', 'mixt' ),
		'desc'    => __( 'Show the footer copyright area on this page', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => __( 'Auto', 'mixt' ),
			'true'  => __( 'Yes', 'mixt' ),
			'false' => __( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),
) );
