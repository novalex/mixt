<?php

$this->sections[] = array(
	'title'      => __( 'Shop', 'mixt' ),
	'desc'       => __( 'Customize the shop\'s options and appearance', 'mixt' ),
	'icon'       => 'el-icon-shopping-cart',
	'customizer' => false,
	'fields'     => array(

		// Nav Menu
		array(
			'id'       => 'shop-page-nav-menu',
			'type'     => 'select',
			'title'    => __( 'Nav Menu', 'mixt' ),
			'subtitle' => __( 'Select the menu for this page', 'mixt' ),
			'options'  => $nav_menus,
			'default'  => 'auto',
		),

		// Fullwidth
		array(
			'id'       => 'shop-page-page-fullwidth',
			'type'     => 'button_set',
			'title'    => __( 'Full Width', 'mixt' ),
			'options'  => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default'  => 'auto',
		),

		// Sidebar
		array(
			'id'       => 'shop-page-page-sidebar',
			'type'     => 'button_set',
			'title'    => __( 'Show Sidebar', 'mixt' ),
			'options'  => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default'  => 'auto',
		),

		// Shop Sidebar
		array(
			'id'       => 'shop-page-sidebar-id',
			'type'     => 'select',
			'title'    => __( 'Sidebar', 'mixt' ),
			'subtitle' => __( 'Select a sidebar to use on this page', 'mixt' ),
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
			'title'    => __( 'Catalog Page', 'mixt' ),
			'indent'   => true,
		),

			// Columns
			array(
				'id'       => 'wc-cols',
				'type'     => 'slider',
				'title'    => __( 'Product Columns', 'mixt' ),
				'subtitle' => __( 'How many columns (products per row) to display', 'mixt' ),
				'default'  => 3,
				'min'      => 1,
				'max'      => 6,
			),

			// Product Count
			array(
				'id'      => 'wc-product-count',
				'type'    => 'switch',
				'title'   => __( 'Show Product Count', 'mixt' ),
				'on'      => __( 'Yes', 'mixt' ),
				'off'     => __( 'No', 'mixt' ),
				'default' => false,
			),

			// Products Per Page
			array(
				'id'       => 'wc-per-page',
				'type'     => 'spinner',
				'title'    => __( 'Products Per Page', 'mixt' ),
				'subtitle' => __( 'How many products to display per page', 'mixt' ),
				'max'      => '1000',
				'min'      => '1',
				'step'     => '1',
				'default'  => '15',
			),

			// Products Per Page Select
			array(
				'id'      => 'wc-per-page-select',
				'type'    => 'switch',
				'title'   => __( 'Products Per Page Dropdown', 'mixt' ),
				'on'      => __( 'Yes', 'mixt' ),
				'off'     => __( 'No', 'mixt' ),
				'default' => true,
			),

			// Order By Select
			array(
				'id'      => 'wc-orderby',
				'type'    => 'switch',
				'title'   => __( 'Order By Dropdown', 'mixt' ),
				'on'      => __( 'Yes', 'mixt' ),
				'off'     => __( 'No', 'mixt' ),
				'default' => true,
			),

			// Thumbnails
			array(
				'id'      => 'wc-thumb',
				'type'    => 'switch',
				'title'   => __( 'Show Product Thumbnails', 'mixt' ),
				'on'      => __( 'Yes', 'mixt' ),
				'off'     => __( 'No', 'mixt' ),
				'default' => true,
			),

			// Thumbnail Style
			array(
				'id'       => 'wc-thumb-style',
				'type'     => 'select',
				'title'    => __( 'Thumbnail Style', 'mixt' ),
				'options'  => mixt_get_assets('image-styles'),
				'default'  => '',
				'required' => array('wc-thumb', '=', true),
			),

			// Thumbnail Border Color
			array(
				'id'       => 'wc-thumb-border',
				'type'     => 'select',
				'title'    => __( 'Thumbnail Border Color', 'mixt' ),
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
				'title'   => __( 'Show Price', 'mixt' ),
				'on'      => __( 'Yes', 'mixt' ),
				'off'     => __( 'No', 'mixt' ),
				'default' => true,
			),

			// Rating
			array(
				'id'      => 'wc-rating',
				'type'    => 'switch',
				'title'   => __( 'Show Rating', 'mixt' ),
				'on'      => __( 'Yes', 'mixt' ),
				'off'     => __( 'No', 'mixt' ),
				'default' => true,
			),

			// Categories
			array(
				'id'      => 'wc-cats',
				'type'    => 'switch',
				'title'   => __( 'Show Categories', 'mixt' ),
				'on'      => __( 'Yes', 'mixt' ),
				'off'     => __( 'No', 'mixt' ),
				'default' => false,
			),

			// Stock
			array(
				'id'      => 'wc-stock',
				'type'    => 'switch',
				'title'   => __( 'Show Stock', 'mixt' ),
				'on'      => __( 'Yes', 'mixt' ),
				'off'     => __( 'No', 'mixt' ),
				'default' => false,
			),

			// Add To Cart Button
			array(
				'id'      => 'wc-add-to-cart',
				'type'    => 'switch',
				'title'   => __( 'Show &quot;Add To Cart&quot; Button', 'mixt' ),
				'on'      => __( 'Yes', 'mixt' ),
				'off'     => __( 'No', 'mixt' ),
				'default' => false,
			),

			// Sale Badge
			array(
				'id'      => 'wc-sale-badge',
				'type'    => 'switch',
				'title'   => __( 'Show &quot;Sale&quot; Badge', 'mixt' ),
				'on'      => __( 'Yes', 'mixt' ),
				'off'     => __( 'No', 'mixt' ),
				'default' => true,
			),

			// New Badge
			array(
				'id'      => 'wc-new-badge',
				'type'    => 'switch',
				'title'   => __( 'Show &quot;New&quot; Badge', 'mixt' ),
				'on'      => __( 'Yes', 'mixt' ),
				'off'     => __( 'No', 'mixt' ),
				'default' => false,
			),

			// New Period
			array(
				'id'       => 'wc-new-days',
				'type'     => 'spinner',
				'title'    => __( 'Days To Show &quot;New&quot; Badge', 'mixt' ),
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
	'title'      => __( 'Product Page', 'mixt' ),
	'desc'       => __( 'Manage the single product page', 'mixt' ),
	'icon'       => 'el-icon-edit',
	'customizer' => false,
	'subsection' => true,
	'fields'     => array(

		// Thumbnails
		array(
			'id'      => 'wc-single-thumb',
			'type'    => 'switch',
			'title'   => __( 'Show Product Thumbnails', 'mixt' ),
			'on'      => __( 'Yes', 'mixt' ),
			'off'     => __( 'No', 'mixt' ),
			'default' => true,
		),

		// Thumbnail Style
		array(
			'id'       => 'wc-single-thumb-style',
			'type'     => 'select',
			'title'    => __( 'Thumbnail Style', 'mixt' ),
			'options'  => mixt_get_assets('image-styles'),
			'default'  => '',
			'required' => array('wc-single-thumb', '=', true),
		),

		// Thumbnail Border Color
		array(
			'id'       => 'wc-single-thumb-border',
			'type'     => 'select',
			'title'    => __( 'Thumbnail Border Color', 'mixt' ),
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
			'title'    => __( 'Thumbnail Columns', 'mixt' ),
			'subtitle' => __( 'How many thumbnails per row to display below the main product image', 'mixt' ),
			'default'  => 4,
			'min'      => 1,
			'max'      => 6,
			'required' => array('wc-single-thumb', '=', true),
		),

		// Sharing Buttons
		array(
			'id'      => 'wc-sharing',
			'type'    => 'switch',
			'title'   => __( 'Show Sharing Buttons', 'mixt' ),
			'on'      => __( 'Yes', 'mixt' ),
			'off'     => __( 'No', 'mixt' ),
			'default' => false,
		),

		// Sharing Profiles To Display
		array(
			'id'       => 'wc-sharing-profiles',
			'type'     => 'checkbox',
			'title'    => __( 'Sharing Profiles', 'mixt' ),
			'subtitle' => __( 'Select which sharing profiles to display', 'mixt' ),
			'options'  => $social_sharing_profile_names,
			'required' => array('wc-sharing', '=', true),
		),

		// Upsells
		array(
			'id'      => 'wc-upsells',
			'type'    => 'switch',
			'title'   => __( 'Show Upsells', 'mixt' ),
			'on'      => __( 'Yes', 'mixt' ),
			'off'     => __( 'No', 'mixt' ),
			'default' => true,
		),

		// Upsell Columns
		array(
			'id'       => 'wc-upsell-cols',
			'type'     => 'slider',
			'title'    => __( 'Upsell Columns', 'mixt' ),
			'subtitle' => __( 'How many columns (products per row) to display for upsells', 'mixt' ),
			'default'  => 3,
			'min'      => 1,
			'max'      => 6,
			'required' => array('wc-upsells', '=', true),
		),

		// Show Related Products
		array(
			'id'      => 'wc-single-related',
			'type'    => 'switch',
			'title'   => __( 'Show Related Products', 'mixt' ),
			'on'      => __( 'Yes', 'mixt' ),
			'off'     => __( 'No', 'mixt' ),
			'default' => true,
		),

		// Related Products
		array(
			'id'       => 'wc-single-related-nr',
			'type'     => 'spinner',
			'title'    => __( 'Related Products', 'mixt' ),
			'subtitle' => __( 'How many related products to display', 'mixt' ),
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
			'title'    => __( 'Related Product Columns', 'mixt' ),
			'subtitle' => __( 'How many columns (related products per row) to display', 'mixt' ),
			'default'  => 4,
			'min'      => 1,
			'max'      => 6,
			'required' => array('wc-single-related', '=', true),
		),
	),
);
