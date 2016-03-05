<?php

mixt_cmb_make_tab( $fields, esc_html__( 'Posts', 'mixt' ), 'dashicons dashicons-admin-page', array(

	// Posts
	array(
		'id'      => $prefix . 'attached-posts',
		'name'    => esc_html__( 'Posts', 'mixt' ),
		'desc'    => esc_html__( 'Select the posts to display on this page (empty to display all)', 'mixt' ),
		'type'    => 'post_search_text',
		'default' => '',
	),

	// Posts Per Page
	array(
		'id'      => $prefix . 'posts-page',
		'name'    => esc_html__( 'Posts Per Page', 'mixt' ),
		'desc'    => esc_html__( 'Number of posts to display on each page (-1 to display all, auto to use value from site settings)', 'mixt' ),
		'type'    => 'text',
		'default' => 'auto',
	),
) );
