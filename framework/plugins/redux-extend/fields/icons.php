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
			'default'  => $default_icons['left-arrow'],
		),

		// Right Arrow
		array(
			'id'       => 'right-arrow-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Right Arrow', 'mixt' ),
			'default'  => $default_icons['right-arrow'],
		),

		// Up Arrow
		array(
			'id'       => 'up-arrow-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Up Arrow', 'mixt' ),
			'default'  => $default_icons['up-arrow'],
		),

		// Down Arrow
		array(
			'id'       => 'down-arrow-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Down Arrow', 'mixt' ),
			'default'  => $default_icons['down-arrow'],
		),

		// Search
		array(
			'id'       => 'search-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Search', 'mixt' ),
			'default'  => $default_icons['search'],
		),

		// Scroll To Content
		array(
			'id'       => 'head-content-scroll-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Scroll To Content', 'mixt' ),
			'default'  => $default_icons['head-content-scroll'],
		),

		// View Post
		array(
			'id'       => 'view-post-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'View Post', 'mixt' ),
			'default'  => $default_icons['view-post'],
		),

		// View Image
		array(
			'id'       => 'view-image-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'View Image', 'mixt' ),
			'default'  => $default_icons['view-image'],
		),

		// Author
		array(
			'id'       => 'author-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Author', 'mixt' ),
			'default'  => $default_icons['author'],
		),

		// Date
		array(
			'id'       => 'date-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Date', 'mixt' ),
			'default'  => $default_icons['date'],
		),

		// Category
		array(
			'id'       => 'category-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Category', 'mixt' ),
			'default'  => $default_icons['category'],
		),

		// Comments
		array(
			'id'       => 'comments-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Comments', 'mixt' ),
			'default'  => $default_icons['comments'],
		),

		// Back To Top
		array(
			'id'       => 'back-to-top-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Back To Top', 'mixt' ),
			'default'  => $default_icons['back-to-top'],
		),

		// Shopping Cart
		array(
			'id'       => 'shop-cart-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Shopping Cart', 'mixt' ),
			'default'  => $default_icons['shop-cart'],
		),

		// Standard Format
		array(
			'id'       => 'format-standard-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Standard Format', 'mixt' ),
			'default'  => $default_icons['format-standard'],
		),

		// Aside Format
		array(
			'id'       => 'format-aside-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Aside Format', 'mixt' ),
			'default'  => $default_icons['format-aside'],
		),

		// Image Format
		array(
			'id'       => 'format-image-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Image Format', 'mixt' ),
			'default'  => $default_icons['format-image'],
		),

		// Video Format
		array(
			'id'       => 'format-video-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Video Format', 'mixt' ),
			'default'  => $default_icons['format-video'],
		),

		// Audio Format
		array(
			'id'       => 'format-audio-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Audio Format', 'mixt' ),
			'default'  => $default_icons['format-audio'],
		),

		// Gallery Format
		array(
			'id'       => 'format-gallery-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Gallery Format', 'mixt' ),
			'default'  => $default_icons['format-gallery'],
		),

		// Quote Format
		array(
			'id'       => 'format-quote-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Quote Format', 'mixt' ),
			'default'  => $default_icons['format-quote'],
		),

		// Link Format
		array(
			'id'       => 'format-link-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Link Format', 'mixt' ),
			'default'  => $default_icons['format-link'],
		),

		// Status Format
		array(
			'id'       => 'format-status-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Status Format', 'mixt' ),
			'default'  => $default_icons['format-status'],
		),

		// Chat Format
		array(
			'id'       => 'format-chat-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Chat Format', 'mixt' ),
			'default'  => $default_icons['format-chat'],
		),

		// Page Format
		array(
			'id'       => 'format-page-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Page Format', 'mixt' ),
			'default'  => $default_icons['format-page'],
		),

		// Product Format
		array(
			'id'       => 'format-product-icon',
			'type'     => 'text',
			'title'    => esc_html__( 'Product Format', 'mixt' ),
			'default'  => $default_icons['format-product'],
		),
	),
);
