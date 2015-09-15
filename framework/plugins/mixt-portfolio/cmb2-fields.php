<?php

// PROJECT OPTIONS

$meta_boxes['mixt_project_meta'] = array(
	'id'           => 'mixt_project_options',
	'title'        => __( 'Project Options', 'mixt' ),
	'object_types' => array( 'portfolio' ),
	'context'      => 'normal',
	'priority'     => 'high',
	'show_names'   => true,
	'fields'       => array(

		// Layout
		array(
			'id'      => $prefix . 'project-layout',
			'name'    => __( 'Layout', 'mixt' ),
			'desc'    => __( 'Set the project featured media width. The content will fill the remaining space.', 'mixt' ),
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
	),
);

// PORTFOLIO OPTIONS

if ( function_exists('cmb2_post_search_render_field') ) {

	$meta_boxes['mixt_portfolio_meta'] = array(
		'id'           => 'mixt_portfolio_options',
		'title'        => __( 'Portfolio Options', 'mixt' ),
		'object_types' => array( 'page' ),
		'show_on'      => array(
			'key'   => 'page-template',
			'value' => 'templates/portfolio.php'
		),
		'context'      => 'normal',
		'priority'     => 'high',
		'show_names'   => true,
		'fields'       => array(

			// Blog Type
			array(
				'id'      => $prefix . 'portfolio-page-type',
				'name'    => __( 'Layout Type', 'mixt' ),
				'desc'    => __( 'Select the layout type', 'mixt' ),
				'type'    => 'radio_inline',
				'options' => array(
					'auto'     => __( 'Auto', 'mixt' ),
					'standard' => __( 'Standard', 'mixt' ),
					'grid'     => __( 'Grid', 'mixt' ),
					'masonry'  => __( 'Masonry', 'mixt' ),
				),
				'default' => 'auto',
			),

			// Blog Columns
			array(
				'id'      => $prefix . 'portfolio-page-columns',
				'name'    => __( 'Columns', 'mixt' ),
				'desc'    => __( 'Number of columns for grid and masonry layout', 'mixt' ),
				'type'    => 'radio_inline',
				'options' => array(
					'auto' => __( 'Auto', 'mixt' ),
					'2'    => '2',
					'3'    => '3',
					'4'    => '4',
					'5'    => '5',
					'6'    => '6',
				),
				'default' => 'auto',
			),

			// Post Media Display
			array(
				'id'      => $prefix . 'portfolio-page-feat-show',
				'name'    => __( 'Show Media', 'mixt' ),
				'desc'    => __( 'Display the post featured media', 'mixt' ),
				'type'    => 'radio_inline',
				'options' => array(
					'auto'  => __( 'Auto', 'mixt' ),
					'true'  => __( 'Yes', 'mixt' ),
					'false' => __( 'No', 'mixt' ),
				),
				'default'    => 'auto',
			),

			// Post Media Size
			array(
				'id'      => $prefix . 'portfolio-page-feat-size',
				'name'    => __( 'Media Size', 'mixt' ),
				'desc'    => __( 'Select a size for the featured post media', 'mixt' ),
				'type'    => 'radio_inline',
				'options' => array(
					'auto'   => __( 'Auto', 'mixt' ),
					'blog-large'  => __( 'Large', 'mixt' ),
					'blog-medium' => __( 'Medium', 'mixt' ),
					'blog-small'  => __( 'Small', 'mixt' ),
				),
				'default' => 'auto',
			),

			// Posts
			array(
				'id'      => $prefix . 'portfolio-attached-posts',
				'name'    => __( 'Posts', 'mixt' ),
				'desc'    => __( 'Select the posts to display on this page (empty to display all)', 'mixt' ),
				'type'    => 'post_search_text',
				'default' => '',
			),

			// Posts Per Page
			array(
				'id'      => $prefix . 'portfolio-posts-page',
				'name'    => __( 'Posts Per Page', 'mixt' ),
				'desc'    => __( 'Number of posts to display on each page (-1 to display all, auto to display number set in options)', 'mixt' ),
				'type'    => 'text',
				'default' => 'auto',
			),
		),
	);
}