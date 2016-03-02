<?php

if ( mixt_cmb_show_tab('project') ) {
	$post_tab_title = __( 'Project', 'mixt' );
	$post_type_prefix = 'project-';
} else {
	$post_tab_title = __( 'Post', 'mixt' );
	$post_type_prefix = 'post-';
}

mixt_cmb_make_tab( $fields, $post_tab_title, 'dashicons dashicons-edit', array(

	// Layout
	array(
		'id'      => $prefix . $post_type_prefix . 'layout',
		'name'    => __( 'Layout', 'mixt' ),
		'desc'    => __( 'Set the featured media width. The content will fill the remaining space.', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'       => __( 'Auto', 'mixt' ),
			'full'       => __( 'Full Width', 'mixt' ),
			'two-thirds' => '2/3',
			'half'       => '1/2',
			'one-third'  => '1/3',
		),
		'default' => 'auto',
	),

	// Display Featured Image
	array(
		'id'      => $prefix . 'feat-show',
		'name'    => __( 'Show Featured Media', 'mixt' ),
		'desc'    => __( 'Display the post featured media', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => __( 'Auto', 'mixt' ),
			'true'  => __( 'Yes', 'mixt' ),
			'false' => __( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Post Info
	array(
		'id'      => $prefix . 'post-info',
		'name'    => __( 'Post Info', 'mixt' ),
		'desc'    => __( 'Display the post format and date', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => __( 'Auto', 'mixt' ),
			'true'  => __( 'Yes', 'mixt' ),
			'false' => __( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Meta Position / Display
	array(
		'id'      => $prefix . 'meta-show',
		'name'    => __( 'Post Meta', 'mixt' ),
		'desc'    => __( 'Display the meta in the post header, footer, or do not display', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'   => __( 'Auto', 'mixt' ),
			'header' => __( 'In Header', 'mixt' ),
			'footer' => __( 'In Footer', 'mixt' ),
			'false'  => __( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Taxonomies
	array(
		'id'      => $prefix . $post_type_prefix . 'tags',
		'name'    => __( 'Show Tags', 'mixt' ),
		'desc'    => __( 'Display post tags, types and attributes', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => __( 'Auto', 'mixt' ),
			'true'  => __( 'Yes', 'mixt' ),
			'false' => __( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Sharing Buttons
	array(
		'id'      => $prefix . $post_type_prefix . 'sharing',
		'name'    => __( 'Show Sharing Buttons', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => __( 'Auto', 'mixt' ),
			'true'  => __( 'Yes', 'mixt' ),
			'false' => __( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Navigation
	array(
		'id'      => $prefix . $post_type_prefix . 'navigation',
		'name'    => __( 'Post Navigation', 'mixt' ),
		'desc'    => __( 'Show links to next and previous posts', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => __( 'Auto', 'mixt' ),
			'true'  => __( 'Yes', 'mixt' ),
			'false' => __( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Navigation
	array(
		'id'      => $prefix . $post_type_prefix . 'about-author',
		'name'    => __( 'About The Author', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => __( 'Auto', 'mixt' ),
			'true'  => __( 'Yes', 'mixt' ),
			'false' => __( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),
	
) );
