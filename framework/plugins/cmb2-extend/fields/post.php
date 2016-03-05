<?php

if ( mixt_cmb_show_tab('project') ) {
	$post_tab_title = esc_html__( 'Project', 'mixt' );
	$post_type_prefix = 'project-';
} else {
	$post_tab_title = esc_html__( 'Post', 'mixt' );
	$post_type_prefix = 'post-';
}

mixt_cmb_make_tab( $fields, $post_tab_title, 'dashicons dashicons-edit', array(

	// Layout
	array(
		'id'      => $prefix . $post_type_prefix . 'layout',
		'name'    => esc_html__( 'Layout', 'mixt' ),
		'desc'    => esc_html__( 'Set the featured media width. The content will fill the remaining space.', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'       => esc_html__( 'Auto', 'mixt' ),
			'full'       => esc_html__( 'Full Width', 'mixt' ),
			'two-thirds' => '2/3',
			'half'       => '1/2',
			'one-third'  => '1/3',
		),
		'default' => 'auto',
	),

	// Display Featured Image
	array(
		'id'      => $prefix . 'feat-show',
		'name'    => esc_html__( 'Show Featured Media', 'mixt' ),
		'desc'    => esc_html__( 'Display the post featured media', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Post Info
	array(
		'id'      => $prefix . 'post-info',
		'name'    => esc_html__( 'Post Info', 'mixt' ),
		'desc'    => esc_html__( 'Display the post format and date', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Meta Position / Display
	array(
		'id'      => $prefix . 'meta-show',
		'name'    => esc_html__( 'Post Meta', 'mixt' ),
		'desc'    => esc_html__( 'Display the meta in the post header, footer, or do not display', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'   => esc_html__( 'Auto', 'mixt' ),
			'header' => esc_html__( 'In Header', 'mixt' ),
			'footer' => esc_html__( 'In Footer', 'mixt' ),
			'false'  => esc_html__( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Taxonomies
	array(
		'id'      => $prefix . $post_type_prefix . 'tags',
		'name'    => esc_html__( 'Show Tags', 'mixt' ),
		'desc'    => esc_html__( 'Display post tags, types and attributes', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Sharing Buttons
	array(
		'id'      => $prefix . $post_type_prefix . 'sharing',
		'name'    => esc_html__( 'Show Sharing Buttons', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Navigation
	array(
		'id'      => $prefix . $post_type_prefix . 'navigation',
		'name'    => esc_html__( 'Post Navigation', 'mixt' ),
		'desc'    => esc_html__( 'Show links to next and previous posts', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Navigation
	array(
		'id'      => $prefix . $post_type_prefix . 'about-author',
		'name'    => esc_html__( 'About The Author', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),
	
) );
