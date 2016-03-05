<?php

mixt_cmb_make_tab( $fields, esc_html__( 'Blog', 'mixt' ), 'dashicons dashicons-screenoptions', array(

	// Blog Type
	array(
		'id'      => $prefix . 'layout-type',
		'name'    => esc_html__( 'Layout Type', 'mixt' ),
		'desc'    => esc_html__( 'Select the blog layout type', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'     => esc_html__( 'Auto', 'mixt' ),
			'standard' => esc_html__( 'Standard', 'mixt' ),
			'grid'     => esc_html__( 'Grid', 'mixt' ),
			'masonry'  => esc_html__( 'Masonry', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Blog Columns
	array(
		'id'      => $prefix . 'layout-columns',
		'name'    => esc_html__( 'Blog Columns', 'mixt' ),
		'desc'    => esc_html__( 'Number of columns for grid and masonry layout', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto' => esc_html__( 'Auto', 'mixt' ),
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
		'name'    => esc_html__( 'Show Media', 'mixt' ),
		'desc'    => esc_html__( 'Display the post featured media', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
		),
		'default'    => 'auto',
	),

	// Post Media Size
	array(
		'id'      => $prefix . 'feat-size',
		'name'    => esc_html__( 'Media Size', 'mixt' ),
		'desc'    => esc_html__( 'Select a size for the featured post media', 'mixt' ),
		'type'    => 'radio_inline',
		'options' => array(
			'auto'   => esc_html__( 'Auto', 'mixt' ),
			'mixt-large'  => esc_html__( 'Large', 'mixt' ),
			'mixt-medium' => esc_html__( 'Medium', 'mixt' ),
			'mixt-small'  => esc_html__( 'Small', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Post Info Display
	array(
		'id'       => $prefix . 'post-info',
		'type'     => 'radio_inline',
		'name'     => esc_html__( 'Post Info', 'mixt' ),
		'desc'     => esc_html__( 'Display the post format and date', 'mixt' ),
		'options'  => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
		),
		'default'  => 'auto',
	),

	// Meta Position / Display
	array(
		'id'       => $prefix . 'meta-show',
		'type'     => 'radio_inline',
		'name'     => esc_html__( 'Post Meta', 'mixt' ),
		'desc'     => esc_html__( 'Display the meta in the post header, footer, or do not display', 'mixt' ),
		'options'  => array(
			'auto'    => esc_html__( 'Auto', 'mixt' ),
			'header'  => esc_html__( 'In Header', 'mixt' ),
			'footer'  => esc_html__( 'In Footer', 'mixt' ),
			'false'   => esc_html__( 'No', 'mixt' ),
		),
		'default'  => 'auto',
	),

	// Title Display
	array(
		'id'      => $prefix . 'blog-page-title',
		'type'    => 'radio_inline',
		'name'    => esc_html__( 'Post Title', 'mixt' ),
		'desc'    => esc_html__( 'Display the post title', 'mixt' ),
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Content Display
	array(
		'id'      => $prefix . 'blog-page-content',
		'type'    => 'radio_inline',
		'name'    => esc_html__( 'Post Content', 'mixt' ),
		'desc'    => esc_html__( 'Display the post content', 'mixt' ),
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Show Rollover
	array(
		'id'      => $prefix . 'blog-rollover',
		'type'    => 'radio_inline',
		'name'    => esc_html__( 'Show Rollover', 'mixt' ),
		'desc'    => esc_html__( 'Display an overlay with useful links and info when a project is hovered', 'mixt' ),
		'options' => array(
			'auto'  => esc_html__( 'Auto', 'mixt' ),
			'true'  => esc_html__( 'Yes', 'mixt' ),
			'false' => esc_html__( 'No', 'mixt' ),
		),
		'default' => 'auto',
	),

	// Rollover Items
	array(
        'id'       => $prefix . 'blog-rollover-items',
		'type'     => 'multicheck',
		'name'     => esc_html__( 'Items', 'mixt' ),
		'options'  => array(
			'title'   => esc_html__( 'Title', 'mixt' ),
			'excerpt' => esc_html__( 'Excerpt', 'mixt' ),
			'view'    => esc_html__( 'View Post Button', 'mixt' ),
			'full'    => esc_html__( 'Full Image Button', 'mixt' ),
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
		'name'       => esc_html__( 'Background Color', 'mixt' ),
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
		'name'       => esc_html__( 'Animation - In', 'mixt' ),
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
		'name'       => esc_html__( 'Animation - Out', 'mixt' ),
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
		'name'     => esc_html__( 'Item Style', 'mixt' ),
		'options'  => array(
			'auto'          => 'Auto',
			'plain'         => esc_html__( 'Plain', 'mixt' ),
			'btn'           => esc_html__( 'Button', 'mixt' ),
			'btn btn-round' => esc_html__( 'Round Button', 'mixt' ),
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
		'name'       => esc_html__( 'Button Color', 'mixt' ),
		'options'    => array_merge( array('auto' => 'Auto' ), mixt_get_assets('colors', 'buttons') ),
		'default'    => 'auto',
		'attributes' => array(
			'data-parent-field' => $prefix . 'blog-rollover',
			'data-show-on'      => $prefix . 'blog-rollover',
		),
	),
) );
