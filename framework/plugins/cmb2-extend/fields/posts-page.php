<?php

mixt_cmb_make_tab( $fields, __( 'Posts', 'mixt' ), 'dashicons dashicons-admin-page', array(

	// Posts
	array(
		'id'      => $prefix . 'attached-posts',
		'name'    => __( 'Posts', 'mixt' ),
		'desc'    => __( 'Select the posts to display on this page (empty to display all)', 'mixt' ),
		'type'    => 'post_search_text',
		'default' => '',
	),

	// Posts Per Page
	array(
		'id'      => $prefix . 'posts-page',
		'name'    => __( 'Posts Per Page', 'mixt' ),
		'desc'    => __( 'Number of posts to display on each page (-1 to display all, auto to use value from site settings)', 'mixt' ),
		'type'    => 'text',
		'default' => 'auto',
	),
) );
