<?php

mixt_cmb_make_tab( $fields, __( 'Blog', 'mixt' ), 'dashicons dashicons-screenoptions', array(

	// Blog Type
	array(
		'id'      => $prefix . 'layout-type',
		'name'    => __( 'Layout Type', 'mixt' ),
		'desc'    => __( 'Select the blog layout type', 'mixt' ),
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
		'id'      => $prefix . 'layout-columns',
		'name'    => __( 'Blog Columns', 'mixt' ),
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
		'id'      => $prefix . 'feat-show',
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
		'id'      => $prefix . 'feat-size',
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
		'id'       => $prefix . 'post-info',
		'type'     => 'radio_inline',
		'name'     => __( 'Post Info', 'mixt' ),
		'desc'     => __( 'Display the post format and date', 'mixt' ),
		'options'  => array(
			'auto'  => __( 'Auto', 'mixt' ),
			'true'  => __( 'Yes', 'mixt' ),
			'false' => __( 'No', 'mixt' ),
		),
		'default'  => 'auto',
	),

	// Meta Position / Display
	array(
		'id'       => $prefix . 'meta-show',
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
		'id'      => $prefix . 'blog-page-title',
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

	// Content Display
	array(
		'id'      => $prefix . 'blog-page-content',
		'type'    => 'radio_inline',
		'name'    => __( 'Post Content', 'mixt' ),
		'desc'    => __( 'Display the post content', 'mixt' ),
		'options' => array(
			'auto'  => __( 'Auto', 'mixt' ),
			'true'  => __( 'Yes', 'mixt' ),
			'false' => __( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Show Rollover
	array(
		'id'      => $prefix . 'blog-rollover',
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
        'id'       => $prefix . 'blog-rollover-items',
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
			'data-parent-field' => $prefix . 'blog-rollover',
			'data-show-on'      => $prefix . 'blog-rollover',
		),
		'select_all_button' => false,
	),

	// Rollover Color
	array(
		'id'         => $prefix . 'blog-rollover-color',
		'type'       => 'select',
		'name'       => __( 'Background Color', 'mixt' ),
		'options'    => array_merge( array('auto' => 'Auto' ), mixt_get_assets('colors', 'basic') ),
		'default'    => 'auto',
		'attributes' => array(
			'data-parent-field' => $prefix . 'blog-rollover',
			'data-show-on'      => $prefix . 'blog-rollover',
		),
	),

	// Animation - In
	array(
		'id'         => $prefix . 'blog-rollover-anim-in',
		'type'       => 'select',
		'name'       => __( 'Animation - In', 'mixt' ),
		'options'    => array_merge( array('auto' => 'Auto' ), mixt_css_anims('trans-in') ),
		'default'    => 'auto',
		'attributes' => array(
			'data-parent-field' => $prefix . 'blog-rollover',
			'data-show-on'      => $prefix . 'blog-rollover',
		),
	),

	// Animation - Out
	array(
		'id'         => $prefix . 'blog-rollover-anim-out',
		'type'       => 'select',
		'name'       => __( 'Animation - Out', 'mixt' ),
		'options'    => array_merge( array('auto' => 'Auto' ), mixt_css_anims('trans-out') ),
		'default'    => 'auto',
		'attributes' => array(
			'data-parent-field' => $prefix . 'blog-rollover',
			'data-show-on'      => $prefix . 'blog-rollover',
		),
	),

	// Item Style
	array(
		'id'       => $prefix . 'blog-rollover-item-style',
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
			'data-parent-field' => $prefix . 'blog-rollover',
			'data-show-on'      => $prefix . 'blog-rollover',
		),
	),

	// Button Color
	array(
		'id'         => $prefix . 'blog-rollover-btn-color',
		'type'       => 'select',
		'name'       => __( 'Button Color', 'mixt' ),
		'options'    => array_merge( array('auto' => 'Auto' ), mixt_get_assets('colors', 'buttons') ),
		'default'    => 'auto',
		'attributes' => array(
			'data-parent-field' => $prefix . 'blog-rollover',
			'data-show-on'      => $prefix . 'blog-rollover',
		),
	),
) );
