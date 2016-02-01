<?php

// PROJECT TAB

if ( mixt_cmb_show_tab('project') ) {
	mixt_cmb_make_tab( $fields, __( 'Project', 'mixt' ), 'dashicons dashicons-edit', array(
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

		// Display Featured Image
		array(
			'id'      => $prefix . 'project-feat-show',
			'name'    => __( 'Show Featured Media', 'mixt' ),
			'desc'    => __( 'Display the post featured media', 'mixt' ),
			'type'    => 'radio_inline',
			'options' => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default'    => 'auto',
		),
	) );
}

// PORTFOLIO TAB

if ( mixt_cmb_show_tab('portfolio') && function_exists('cmb2_post_search_render_field') ) {
	mixt_cmb_make_tab( $fields, __( 'Portfolio', 'mixt' ), 'dashicons dashicons-category', array(
		// Type
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

		// Columns
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

		// Post Info Display
		array(
			'id'      => $prefix . 'portfolio-page-post-info',
			'type'    => 'radio_inline',
			'name'    => __( 'Post Info', 'mixt' ),
			'desc'    => __( 'Display the post format and date', 'mixt' ),
			'options' => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default' => 'auto',
		),

		// Meta Position / Display
		array(
			'id'       => $prefix . 'portfolio-page-meta-show',
			'type'     => 'radio_inline',
			'name'     => __( 'Post Meta', 'mixt' ),
			'desc'     => __( 'Display the meta in the post header, footer, or do not display', 'mixt' ),
			'options'  => array(
				'auto'    => __( 'Auto', 'mixt' ),
				'header'  => __( 'In Header', 'mixt' ),
				'footer'  => __( 'In Footer', 'mixt' ),
				'false'   => __( 'No', 'mixt' ),
			),
			'default'  => 'auto',
		),

		// Title Display
		array(
			'id'      => $prefix . 'portfolio-page-title',
			'type'    => 'radio_inline',
			'name'    => __( 'Post Title', 'mixt' ),
			'desc'    => __( 'Display the post title', 'mixt' ),
			'options' => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default' => 'auto',
		),

		// Excerpt Display
		array(
			'id'      => $prefix . 'portfolio-page-excerpt',
			'type'    => 'radio_inline',
			'name'    => __( 'Post Excerpt', 'mixt' ),
			'desc'    => __( 'Display the post excerpt', 'mixt' ),
			'options' => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default' => 'auto',
		),

		// Filters
		array(
			'id'      => $prefix . 'portfolio-page-filters',
			'type'    => 'radio_inline',
			'name'    => __( 'Filters', 'mixt' ),
			'desc'    => __( 'Display filter links', 'mixt' ),
			'options' => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
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

		// Show Rollover
		array(
			'id'      => $prefix . 'portfolio-rollover',
			'type'    => 'radio_inline',
			'name'    => __( 'Show Rollover', 'mixt' ),
			'desc'    => __( 'Display an overlay with useful links and info when a project is hovered', 'mixt' ),
			'options' => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default' => 'auto',
		),

		// Rollover Items
		array(
            'id'       => $prefix . 'portfolio-rollover-items',
			'type'     => 'multicheck',
			'name'     => __( 'Items', 'mixt' ),
			'options'  => array(
				'title'   => __( 'Title', 'mixt' ),
				'excerpt' => __( 'Excerpt', 'mixt' ),
				'view'    => __( 'View Post Button', 'mixt' ),
				'full'    => __( 'Full Image Button', 'mixt' ),
			),
			'default'  => array( 'title' ),
			'attributes' => array(
				'data-parent-field' => $prefix . 'portfolio-rollover',
				'data-show-on'      => $prefix . 'portfolio-rollover',
			),
			'select_all_button' => false,
		),

		// Rollover Color
		array(
			'id'         => $prefix . 'portfolio-rollover-color',
			'type'       => 'select',
			'name'       => __( 'Background Color', 'mixt' ),
			'options'    => array_merge( array('auto' => 'Auto' ), mixt_get_assets('colors', 'basic') ),
			'default'    => 'auto',
			'attributes' => array(
				'data-parent-field' => $prefix . 'portfolio-rollover',
				'data-show-on'      => $prefix . 'portfolio-rollover',
			),
		),

		// Animation - In
		array(
			'id'         => $prefix . 'portfolio-rollover-anim-in',
			'type'       => 'select',
			'name'       => __( 'Animation - In', 'mixt' ),
			'options'    => array_merge( array('auto' => 'Auto' ), mixt_css_anims('trans-in') ),
			'default'    => 'auto',
			'attributes' => array(
				'data-parent-field' => $prefix . 'portfolio-rollover',
				'data-show-on'      => $prefix . 'portfolio-rollover',
			),
		),

		// Animation - Out
		array(
			'id'         => $prefix . 'portfolio-rollover-anim-out',
			'type'       => 'select',
			'name'       => __( 'Animation - Out', 'mixt' ),
			'options'    => array_merge( array('auto' => 'Auto' ), mixt_css_anims('trans-out') ),
			'default'    => 'auto',
			'attributes' => array(
				'data-parent-field' => $prefix . 'portfolio-rollover',
				'data-show-on'      => $prefix . 'portfolio-rollover',
			),
		),

		// Item Style
		array(
			'id'       => $prefix . 'portfolio-rollover-item-style',
			'type'     => 'select',
			'name'     => __( 'Item Style', 'mixt' ),
			'options'  => array(
				'auto'          => 'Auto',
				'plain'         => __( 'Plain', 'mixt' ),
				'btn'           => __( 'Button', 'mixt' ),
				'btn btn-round' => __( 'Round Button', 'mixt' ),
			),
			'default'  => 'auto',
			'attributes' => array(
				'data-parent-field' => $prefix . 'portfolio-rollover',
				'data-show-on'      => $prefix . 'portfolio-rollover',
			),
		),

		// Button Color
		array(
			'id'         => $prefix . 'portfolio-rollover-btn-color',
			'type'       => 'select',
			'name'       => __( 'Button Color', 'mixt' ),
			'options'    => array_merge( array('auto' => 'Auto' ), mixt_get_assets('colors', 'buttons') ),
			'default'    => 'auto',
			'attributes' => array(
				'data-parent-field' => $prefix . 'portfolio-rollover',
				'data-show-on'      => $prefix . 'portfolio-rollover',
			),
		),
	) );
}