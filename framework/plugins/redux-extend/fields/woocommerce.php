<?php

$this->sections[] = array(
	'title'      => esc_html__( 'Shop', 'mixt' ),
	'desc'       => esc_html__( 'Customize the shop\'s options and appearance', 'mixt' ),
	'icon'       => 'el-icon-shopping-cart',
	'customizer' => false,
	'fields'     => array(

		// Nav Menu
		array(
			'id'       => 'shop-page-nav-menu',
			'type'     => 'select',
			'title'    => esc_html__( 'Nav Menu', 'mixt' ),
			'subtitle' => esc_html__( 'Select the menu for this page', 'mixt' ),
			'options'  => $nav_menus,
			'default'  => 'auto',
		),

		// Fullwidth
		array(
			'id'       => 'shop-page-page-fullwidth',
			'type'     => 'button_set',
			'title'    => esc_html__( 'Full Width', 'mixt' ),
			'options'  => array(
				'auto'  => esc_html__( 'Auto', 'mixt' ),
				'true'  => esc_html__( 'Yes', 'mixt' ),
				'false' => esc_html__( 'No', 'mixt' ),
			),
			'default'  => 'auto',
		),

		// Sidebar
		array(
			'id'       => 'shop-page-page-sidebar',
			'type'     => 'button_set',
			'title'    => esc_html__( 'Show Sidebar', 'mixt' ),
			'options'  => array(
				'auto'  => esc_html__( 'Auto', 'mixt' ),
				'true'  => esc_html__( 'Yes', 'mixt' ),
				'false' => esc_html__( 'No', 'mixt' ),
			),
			'default'  => 'auto',
		),

		// Shop Sidebar
		array(
			'id'       => 'shop-page-sidebar-id',
			'type'     => 'select',
			'title'    => esc_html__( 'Sidebar', 'mixt' ),
			'subtitle' => esc_html__( 'Select a sidebar to use on this page', 'mixt' ),
			'options'  => $available_sidebars,
			'default'  => '',
		),

		// Divider
		array(
			'id'   => 'shop-divider',
			'type' => 'divide',
		),

		// RELATED POSTS
		array(
			'id'       => 'shop-catalog-section',
			'type'     => 'section',
			'title'    => esc_html__( 'Catalog Page', 'mixt' ),
			'indent'   => true,
		),

			// Columns
			array(
				'id'       => 'wc-cols',
				'type'     => 'slider',
				'title'    => esc_html__( 'Product Columns', 'mixt' ),
				'subtitle' => esc_html__( 'How many columns (products per row) to display', 'mixt' ),
				'default'  => 3,
				'min'      => 1,
				'max'      => 6,
			),

			// Product Count
			array(
				'id'      => 'wc-product-count',
				'type'    => 'switch',
				'title'   => esc_html__( 'Show Product Count', 'mixt' ),
				'on'      => esc_html__( 'Yes', 'mixt' ),
				'off'     => esc_html__( 'No', 'mixt' ),
				'default' => false,
			),

			// Products Per Page
			array(
				'id'       => 'wc-per-page',
				'type'     => 'spinner',
				'title'    => esc_html__( 'Products Per Page', 'mixt' ),
				'subtitle' => esc_html__( 'How many products to display per page', 'mixt' ),
				'max'      => '1000',
				'min'      => '1',
				'step'     => '1',
				'default'  => '15',
			),

			// Products Per Page Select
			array(
				'id'      => 'wc-per-page-select',
				'type'    => 'switch',
				'title'   => esc_html__( 'Products Per Page Dropdown', 'mixt' ),
				'on'      => esc_html__( 'Yes', 'mixt' ),
				'off'     => esc_html__( 'No', 'mixt' ),
				'default' => true,
			),

			// Order By Select
			array(
				'id'      => 'wc-orderby',
				'type'    => 'switch',
				'title'   => esc_html__( 'Order By Dropdown', 'mixt' ),
				'on'      => esc_html__( 'Yes', 'mixt' ),
				'off'     => esc_html__( 'No', 'mixt' ),
				'default' => true,
			),

			// Thumbnails
			array(
				'id'      => 'wc-thumb',
				'type'    => 'switch',
				'title'   => esc_html__( 'Show Product Thumbnails', 'mixt' ),
				'on'      => esc_html__( 'Yes', 'mixt' ),
				'off'     => esc_html__( 'No', 'mixt' ),
				'default' => true,
			),

			// Thumbnail Style
			array(
				'id'       => 'wc-thumb-style',
				'type'     => 'select',
				'title'    => esc_html__( 'Thumbnail Style', 'mixt' ),
				'options'  => mixt_get_assets('image-styles'),
				'default'  => '',
				'required' => array('wc-thumb', '=', true),
			),

			// Thumbnail Border Color
			array(
				'id'       => 'wc-thumb-border',
				'type'     => 'select',
				'title'    => esc_html__( 'Thumbnail Border Color', 'mixt' ),
				'options'  => mixt_get_assets('colors', 'basic'),
				'default'  => 'accent',
				'required' => array('wc-thumb-style', '=', array(
						'image-border', 'image-outline',
						'image-rounded image-border', 'image-rounded image-outline',
						'image-circle image-border', 'image-circle image-outline'
					),
				),
			),

			// Price
			array(
				'id'      => 'wc-price',
				'type'    => 'switch',
				'title'   => esc_html__( 'Show Price', 'mixt' ),
				'on'      => esc_html__( 'Yes', 'mixt' ),
				'off'     => esc_html__( 'No', 'mixt' ),
				'default' => true,
			),

			// Rating
			array(
				'id'      => 'wc-rating',
				'type'    => 'switch',
				'title'   => esc_html__( 'Show Rating', 'mixt' ),
				'on'      => esc_html__( 'Yes', 'mixt' ),
				'off'     => esc_html__( 'No', 'mixt' ),
				'default' => true,
			),

			// Categories
			array(
				'id'      => 'wc-cats',
				'type'    => 'switch',
				'title'   => esc_html__( 'Show Categories', 'mixt' ),
				'on'      => esc_html__( 'Yes', 'mixt' ),
				'off'     => esc_html__( 'No', 'mixt' ),
				'default' => false,
			),

			// Stock
			array(
				'id'      => 'wc-stock',
				'type'    => 'switch',
				'title'   => esc_html__( 'Show Stock', 'mixt' ),
				'on'      => esc_html__( 'Yes', 'mixt' ),
				'off'     => esc_html__( 'No', 'mixt' ),
				'default' => false,
			),

			// Add To Cart Button
			array(
				'id'      => 'wc-add-to-cart',
				'type'    => 'switch',
				'title'   => esc_html__( 'Show &quot;Add To Cart&quot; Button', 'mixt' ),
				'on'      => esc_html__( 'Yes', 'mixt' ),
				'off'     => esc_html__( 'No', 'mixt' ),
				'default' => false,
			),

			// Sale Badge
			array(
				'id'      => 'wc-sale-badge',
				'type'    => 'switch',
				'title'   => esc_html__( 'Show &quot;Sale&quot; Badge', 'mixt' ),
				'on'      => esc_html__( 'Yes', 'mixt' ),
				'off'     => esc_html__( 'No', 'mixt' ),
				'default' => true,
			),

			// New Badge
			array(
				'id'      => 'wc-new-badge',
				'type'    => 'switch',
				'title'   => esc_html__( 'Show &quot;New&quot; Badge', 'mixt' ),
				'on'      => esc_html__( 'Yes', 'mixt' ),
				'off'     => esc_html__( 'No', 'mixt' ),
				'default' => false,
			),

			// New Period
			array(
				'id'       => 'wc-new-days',
				'type'     => 'spinner',
				'title'    => esc_html__( 'Days To Show &quot;New&quot; Badge', 'mixt' ),
				'max'      => '365',
				'min'      => '1',
				'step'     => '1',
				'default'  => '30',
				'required' => array('wc-new-badge', '=', true),
			),
	),
);


// SINGLE PRODUCT PAGE

$this->sections[] = array(
	'title'      => esc_html__( 'Product Page', 'mixt' ),
	'desc'       => esc_html__( 'Manage the single product page', 'mixt' ),
	'icon'       => 'el-icon-edit',
	'customizer' => false,
	'subsection' => true,
	'fields'     => array(

		// Thumbnails
		array(
			'id'      => 'wc-single-thumb',
			'type'    => 'switch',
			'title'   => esc_html__( 'Show Product Thumbnails', 'mixt' ),
			'on'      => esc_html__( 'Yes', 'mixt' ),
			'off'     => esc_html__( 'No', 'mixt' ),
			'default' => true,
		),

		// Thumbnail Style
		array(
			'id'       => 'wc-single-thumb-style',
			'type'     => 'select',
			'title'    => esc_html__( 'Thumbnail Style', 'mixt' ),
			'options'  => mixt_get_assets('image-styles'),
			'default'  => '',
			'required' => array('wc-single-thumb', '=', true),
		),

		// Thumbnail Border Color
		array(
			'id'       => 'wc-single-thumb-border',
			'type'     => 'select',
			'title'    => esc_html__( 'Thumbnail Border Color', 'mixt' ),
			'options'  => mixt_get_assets('colors', 'basic'),
			'default'  => 'accent',
			'required' => array('wc-single-thumb-style', '=', array(
					'image-border', 'image-outline',
					'image-rounded image-border', 'image-rounded image-outline',
					'image-circle image-border', 'image-circle image-outline'
				),
			),
		),

		// Thumbnail Columns
		array(
			'id'       => 'wc-single-thumb-cols',
			'type'     => 'slider',
			'title'    => esc_html__( 'Thumbnail Columns', 'mixt' ),
			'subtitle' => esc_html__( 'How many thumbnails per row to display below the main product image', 'mixt' ),
			'default'  => 4,
			'min'      => 1,
			'max'      => 6,
			'required' => array('wc-single-thumb', '=', true),
		),

		// Sharing Buttons
		array(
			'id'      => 'wc-sharing',
			'type'    => 'switch',
			'title'   => esc_html__( 'Show Sharing Buttons', 'mixt' ),
			'on'      => esc_html__( 'Yes', 'mixt' ),
			'off'     => esc_html__( 'No', 'mixt' ),
			'default' => false,
		),

		// Sharing Profiles To Display
		array(
			'id'       => 'wc-sharing-profiles',
			'type'     => 'checkbox',
			'title'    => esc_html__( 'Sharing Profiles', 'mixt' ),
			'subtitle' => esc_html__( 'Select which sharing profiles to display', 'mixt' ),
			'options'  => $social_sharing_profile_names,
			'required' => array('wc-sharing', '=', true),
		),

		// Upsells
		array(
			'id'      => 'wc-upsells',
			'type'    => 'switch',
			'title'   => esc_html__( 'Show Upsells', 'mixt' ),
			'on'      => esc_html__( 'Yes', 'mixt' ),
			'off'     => esc_html__( 'No', 'mixt' ),
			'default' => true,
		),

		// Upsell Columns
		array(
			'id'       => 'wc-upsell-cols',
			'type'     => 'slider',
			'title'    => esc_html__( 'Upsell Columns', 'mixt' ),
			'subtitle' => esc_html__( 'How many columns (products per row) to display for upsells', 'mixt' ),
			'default'  => 3,
			'min'      => 1,
			'max'      => 6,
			'required' => array('wc-upsells', '=', true),
		),

		// Show Related Products
		array(
			'id'      => 'wc-single-related',
			'type'    => 'switch',
			'title'   => esc_html__( 'Show Related Products', 'mixt' ),
			'on'      => esc_html__( 'Yes', 'mixt' ),
			'off'     => esc_html__( 'No', 'mixt' ),
			'default' => true,
		),

		// Related Products
		array(
			'id'       => 'wc-single-related-nr',
			'type'     => 'spinner',
			'title'    => esc_html__( 'Related Products', 'mixt' ),
			'subtitle' => esc_html__( 'How many related products to display', 'mixt' ),
			'max'      => '30',
			'min'      => '1',
			'step'     => '1',
			'default'  => '4',
			'required' => array('wc-single-related', '=', true),
		),

		// Related Product Columns
		array(
			'id'       => 'wc-single-related-cols',
			'type'     => 'slider',
			'title'    => esc_html__( 'Related Product Columns', 'mixt' ),
			'subtitle' => esc_html__( 'How many columns (related products per row) to display', 'mixt' ),
			'default'  => 4,
			'min'      => 1,
			'max'      => 6,
			'required' => array('wc-single-related', '=', true),
		),
	),
);
