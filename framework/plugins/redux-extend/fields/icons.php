<?php

$this->sections[] = array(
	'title'      => esc_html__( 'Icons', 'mixt' ),
	'desc'       => esc_html__( 'Define various icons used throughout the site', 'mixt' ),
	'icon'       => 'el-icon-adjust',
	'customizer' => false,
	'fields'     => array(

		// Left Arrow
		array(
			'id'       => 'left-arrow-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Left Arrow', 'mixt' ),
			'default'  => 'fa fa-chevron-left',
		),

		// Right Arrow
		array(
			'id'       => 'right-arrow-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Right Arrow', 'mixt' ),
			'default'  => 'fa fa-chevron-right',
		),

		// Up Arrow
		array(
			'id'       => 'up-arrow-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Up Arrow', 'mixt' ),
			'default'  => 'fa fa-chevron-up',
		),

		// Down Arrow
		array(
			'id'       => 'down-arrow-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Down Arrow', 'mixt' ),
			'default'  => 'fa fa-chevron-down',
		),

		// Search
		array(
			'id'       => 'search-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Search', 'mixt' ),
			'default'  => 'fa fa-search',
		),

		// Scroll To Content
		array(
			'id'       => 'head-content-scroll-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Scroll To Content', 'mixt' ),
			'default'  => 'fa fa-chevron-down',
		),

		// View Post
		array(
			'id'       => 'view-post-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'View Post', 'mixt' ),
			'default'  => 'fa fa-share',
		),

		// View Image
		array(
			'id'       => 'view-image-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'View Image', 'mixt' ),
			'default'  => 'fa fa-search',
		),

		// Author
		array(
			'id'       => 'author-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Author', 'mixt' ),
			'default'  => 'fa fa-user',
		),

		// Date
		array(
			'id'       => 'date-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Date', 'mixt' ),
			'default'  => 'fa fa-clock-o',
		),

		// Category
		array(
			'id'       => 'category-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Category', 'mixt' ),
			'default'  => 'fa fa-folder-open',
		),

		// Comments
		array(
			'id'       => 'comments-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Comments', 'mixt' ),
			'default'  => 'fa fa-comment',
		),

		// Back To Top
		array(
			'id'       => 'back-to-top-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Back To Top', 'mixt' ),
			'default'  => 'fa fa-chevron-up',
		),

		// Shopping Cart
		array(
			'id'       => 'shop-cart-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Shopping Cart', 'mixt' ),
			'default'  => 'fa fa-shopping-cart',
		),

		// Standard Format
		array(
			'id'       => 'format-standard-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Standard Format', 'mixt' ),
			'default'  => 'fa fa-align-left',
		),

		// Aside Format
		array(
			'id'       => 'format-aside-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Aside Format', 'mixt' ),
			'default'  => 'fa fa-pencil',
		),

		// Image Format
		array(
			'id'       => 'format-image-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Image Format', 'mixt' ),
			'default'  => 'fa fa-picture-o',
		),

		// Video Format
		array(
			'id'       => 'format-video-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Video Format', 'mixt' ),
			'default'  => 'fa fa-play',
		),

		// Audio Format
		array(
			'id'       => 'format-audio-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Audio Format', 'mixt' ),
			'default'  => 'fa fa-music',
		),

		// Gallery Format
		array(
			'id'       => 'format-gallery-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Gallery Format', 'mixt' ),
			'default'  => 'fa fa-camera',
		),

		// Quote Format
		array(
			'id'       => 'format-quote-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Quote Format', 'mixt' ),
			'default'  => 'fa fa-quote-right',
		),

		// Link Format
		array(
			'id'       => 'format-link-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Link Format', 'mixt' ),
			'default'  => 'fa fa-link',
		),

		// Status Format
		array(
			'id'       => 'format-status-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Status Format', 'mixt' ),
			'default'  => 'fa fa-sticky-note',
		),

		// Chat Format
		array(
			'id'       => 'format-chat-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Chat Format', 'mixt' ),
			'default'  => 'fa fa-comments',
		),

		// Page Format
		array(
			'id'       => 'format-page-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Page Format', 'mixt' ),
			'default'  => 'fa fa-file-text',
		),

		// Product Format
		array(
			'id'       => 'format-product-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Product Format', 'mixt' ),
			'default'  => 'fa fa-shopping-cart',
		),
	),
);
