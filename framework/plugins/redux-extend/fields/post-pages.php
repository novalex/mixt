<?php

/**
 * Output Fields Array For Posts Pages
 *
 * @param  string $type Page type
 * @param  string $icon
 * @param  array  $defaults
 * @return array
 */
function postsPageFields( $type, $icon = 'check-empty', $defaults = array() ) {
	if ( empty($type) ) return;

	$preset_defaults = array(
		'inherit'           => false,
		'fullwidth'         => 'auto',
		'sidebar'           => 'auto',
		'type'              => 'standard',
		'columns'           => '3',
		'feat-show'         => true,
		'feat-size'         => 'blog-small',
		'post-info'         => true,
		'meta-show'         => 'header',
		'page-title'        => true,
		'page-content'      => true,
		'post-content-type' => 'excerpt',
	);
	$defaults = wp_parse_args( $defaults, $preset_defaults );

	$title = sprintf( __('%s Page', 'mixt'), ucfirst($type) );
	$desc  = sprintf( __('Manage the %s page and content appearance', 'mixt'), $type );

	$fields = array(
		'title'      => $title,
		'desc'       => $desc,
		'icon'       => 'el-icon-'.$icon,
		'subsection' => true,
		'customizer' => false,
		'fields'     => array(

			// Inherit Blog Settings
			array(
				'id'       => $type.'-page-inherit',
				'type'     => 'switch',
				'title'    => __( 'Inherit Blog Options', 'mixt' ),
				'subtitle' => __( 'Enable to inherit all options from the blog page', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => $defaults['inherit'],
			),

			// Nav Menu
			array(
				'id'       => $type.'-page-nav-menu',
				'type'     => 'select',
				'title'    => __( 'Nav Menu', 'mixt' ),
				'subtitle' => __( 'Select the menu for this page', 'mixt' ),
				'options'  => mixt_get_nav_menus(),
				'default'  => 'auto',
				'required' => array($type.'-page-inherit', '=', false),
			),

			// Fullwidth
			array(
				'id'       => $type.'-page-page-fullwidth',
				'type'     => 'button_set',
				'title'    => __( 'Full Width', 'mixt' ),
				'options'  => array(
					'auto'  => __( 'Auto', 'mixt' ),
					'true'  => __( 'Yes', 'mixt' ),
					'false' => __( 'No', 'mixt' ),
				),
				'default'  => $defaults['fullwidth'],
				'required' => array($type.'-page-inherit', '=', false),
			),

			// Sidebar
			array(
				'id'       => $type.'-page-page-sidebar',
				'type'     => 'button_set',
				'title'    => __( 'Show Sidebar', 'mixt' ),
				'options'  => array(
					'auto'  => __( 'Auto', 'mixt' ),
					'true'  => __( 'Yes', 'mixt' ),
					'false' => __( 'No', 'mixt' ),
				),
				'default'  => $defaults['sidebar'],
				'required' => array($type.'-page-inherit', '=', false),
			),

			// Sidebar ID
			array(
				'id'       => $type.'-page-sidebar-id',
				'type'     => 'select',
				'title'    => __( 'Sidebar', 'mixt' ),
				'desc'     => __( 'Select a sidebar to use on this page', 'mixt' ),
				'options'  => mixt_get_sidebars(),
				'default'  => 'auto',
				'required' => array($type.'-page-inherit', '=', false),
			),

			// Layout Type
			array(
				'id'       => $type.'-page-layout-type',
				'type'     => 'button_set',
				'title'    => __( 'Layout Type', 'mixt' ),
				'subtitle' => __( 'Select the layout type for this page', 'mixt' ),
				'options'  => array(
					'standard' => __( 'Standard', 'mixt' ),
					'grid'     => __( 'Grid', 'mixt' ),
					'masonry'  => __( 'Masonry', 'mixt' ),
				),
				'default'  => $defaults['type'],
				'required' => array($type.'-page-inherit', '=', false),
			),

			// Columns
			array(
				'id'       => $type.'-page-layout-columns',
				'type'     => 'button_set',
				'title'    => __( 'Columns', 'mixt' ),
				'subtitle' => __( 'Number of columns for grid and masonry layout', 'mixt' ),
				'options'  => array(
					'2' => '2',
					'3' => '3',
					'4' => '4',
					'5' => '5',
					'6' => '6',
				),
				'default'  => $defaults['columns'],
				'required' => array(
					array($type.'-page-inherit', '=', false),
					array($type.'-page-layout-type', '!=', 'standard'),
				),
			),

			// Post Media Display
			array(
				'id'       => $type.'-page-feat-show',
				'type'     => 'switch',
				'title'    => __( 'Show Media', 'mixt' ),
				'subtitle' => __( 'Display the post featured media', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => $defaults['feat-show'],
				'required' => array($type.'-page-inherit', '=', false),
			),

			// Post Media Size
			array(
				'id'       => $type.'-page-feat-size',
				'type'     => 'button_set',
				'title'    => __( 'Media Size', 'mixt' ),
				'subtitle' => __( 'Select a size for the post featured media', 'mixt' ),
				'options'  => array(
					'blog-large'  => __( 'Large', 'mixt' ),
					'blog-medium' => __( 'Medium', 'mixt' ),
					'blog-small'  => __( 'Small', 'mixt' ),
				),
				'default'  => $defaults['feat-size'],
				'required' => array(
					array($type.'-page-inherit', '=', false),
					array($type.'-page-layout-type', '=', 'standard'),
					array($type.'-page-feat-show', '=', true),
				),
			),

			// Post Info Display
			array(
				'id'       => $type.'-page-post-info',
				'type'     => 'switch',
				'title'    => __( 'Post Info', 'mixt' ),
				'subtitle' => __( 'Display the post format and date', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => $defaults['post-info'],
				'required' => array($type.'-page-inherit', '=', false),
			),

			// Meta Position / Display
			array(
				'id'       => $type.'-page-meta-show',
				'type'     => 'button_set',
				'title'    => __( 'Post Meta', 'mixt' ),
				'subtitle' => __( 'Display the meta in the post header, footer, or do not display', 'mixt' ),
				'options'  => array(
					'header'  => __( 'In Header', 'mixt' ),
					'footer'  => __( 'In Footer', 'mixt' ),
					'false'   => __( 'No', 'mixt' ),
				),
				'default'  => $defaults['meta-show'],
				'required' => array($type.'-page-inherit', '=', false),
			),

			// Title Display
			array(
				'id'       => $type.'-page-title',
				'type'     => 'switch',
				'title'    => __( 'Post Title', 'mixt' ),
				'subtitle' => __( 'Display the post title', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => $defaults['page-title'],
				'required' => array($type.'-page-inherit', '=', false),
			),

			// Content Display
			array(
				'id'       => $type.'-page-content',
				'type'     => 'switch',
				'title'    => __( 'Post Content', 'mixt' ),
				'subtitle' => __( 'Display the post content', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => $defaults['page-content'],
				'required' => array($type.'-page-inherit', '=', false),
			),

			// Post Content Type
			array(
				'id'       => $type.'-page-post-content-type',
				'type'     => 'button_set',
				'title'    => __( 'Post Content Type', 'mixt' ),
				'subtitle' => __( 'Show the post\'s excerpt or full content', 'mixt' ),
				'options'  => array(
					'full'    => __( 'Full', 'mixt' ),
					'excerpt' => __( 'Excerpt', 'mixt' ),
				),
				'default'  => $defaults['post-content-type'],
				'required' => array($type.'-page-inherit', '=', false),
			),

			// Divider
			array(
				'id'   => $type.'-divider',
				'type' => 'divide',
			),

			// ROLLOVER
			array(
				'id'       => $type.'-rollover-section',
				'type'     => 'section',
				'title'    => __( 'Rollover', 'mixt' ),
				'indent'   => true,
			),

				// Show Rollover
				array(
					'id'       => $type.'-rollover',
					'type'     => 'switch',
					'title'    => __( 'Show Rollover', 'mixt' ),
					'subtitle' => __( 'Display an overlay with useful links and info when a post is hovered', 'mixt' ),
					'on'       => __( 'Yes', 'mixt' ),
					'off'      => __( 'No', 'mixt' ),
					'default'  => false,
				),

				// Rollover Items
				array(
	                'id'       => $type.'-rollover-items',
					'type'     => 'checkbox',
					'title'    => __( 'Items', 'mixt' ),
					'options'  => array(
						'title'   => __( 'Title', 'mixt' ),
						'excerpt' => __( 'Excerpt', 'mixt' ),
						'view'    => __( 'View Post Button', 'mixt' ),
						'full'    => __( 'Full Image Button', 'mixt' ),
					),
					'default' => array(
						'title'   => '1',
						'excerpt' => '0',
						'view'    => '0',
						'full'    => '0',
					),
					'required' => array($type.'-rollover', '=', true),
				),

				// Rollover Color
				array(
					'id'       => $type.'-rollover-color',
					'type'     => 'select',
					'title'    => __( 'Background Color', 'mixt' ),
					'options'  => mixt_get_assets('colors', 'basic'),
					'default'  => 'black',
					'required' => array($type.'-rollover', '=', true),
				),

				// Animation - In
				array(
					'id'       => $type.'-rollover-anim-in',
					'type'     => 'select',
					'title'    => __( 'Animation - In', 'mixt' ),
					'options'  => mixt_css_anims('trans-in'),
					'default'  => 'fadeIn',
					'required' => array($type.'-rollover', '=', true),
				),

				// Animation - Out
				array(
					'id'       => $type.'-rollover-anim-out',
					'type'     => 'select',
					'title'    => __( 'Animation - Out', 'mixt' ),
					'options'  => mixt_css_anims('trans-out'),
					'default'  => 'fadeOut',
					'required' => array($type.'-rollover', '=', true),
				),

				// Item Style
				array(
					'id'       => $type.'-rollover-item-style',
					'type'     => 'select',
					'title'    => __( 'Item Style', 'mixt' ),
					'options'  => array(
						'plain'         => __( 'Plain', 'mixt' ),
						'btn'           => __( 'Button', 'mixt' ),
						'btn btn-round' => __( 'Round Button', 'mixt' ),
					),
					'default'  => 'plain',
					'required' => array($type.'-rollover', '=', true),
				),

				// Button Color
				array(
					'id'       => $type.'-rollover-btn-color',
					'type'     => 'select',
					'title'    => __( 'Button Color', 'mixt' ),
					'options'  => mixt_get_assets('colors', 'buttons'),
					'default'  => 'primary',
					'required' => array(
						array($type.'-rollover', '=', true),
						array($type.'-rollover-item-style', '!=', 'plain')
					),
				),
		),
	);

	return $fields;
}


// GENERAL
$this->sections[] = array(
	'title'      => __( 'Post Pages', 'mixt' ),
	'desc'       => __( 'Manage post and archive pages', 'mixt' ),
	'icon'       => 'el-icon-book',
	'customizer' => false,
	'fields'     => array(

		// Animate Posts On Load
		array(
			'id'       => 'animate-posts',
			'type'     => 'switch',
			'title'    => __( 'Animate Posts', 'mixt' ),
			'subtitle' => __( 'Apply animation to posts on page load', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => true,
		),

		// Pagination Type
		array(
			'id'       => 'pagination-type',
			'type'     => 'select',
			'title'    => __( 'Pagination', 'mixt' ),
			'subtitle' => __( 'Select a pagination type', 'mixt' ),
			'options'  => array(
				'classic'     => __( 'Classic', 'mixt' ),
				'numbered'    => __( 'Numbered', 'mixt' ),
				'ajax-click'  => __( 'Ajax On Click', 'mixt' ),
				'ajax-scroll' => __( 'Ajax On Scroll', 'mixt' ),
			),
			'default'  => 'numbered',
		),

		// Show Page Numbers
		array(
			'id'       => 'show-page-nr',
			'type'     => 'switch',
			'title'    => __( 'Show Page Numbers', 'mixt' ),
			'subtitle' => __( 'Display a link with the current page number', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => false,
			'required' => array(
				array('pagination-type', '!=', 'classic'),
				array('pagination-type', '!=', 'numbered'),
			),
		),

		// Post Excerpt Limit
		array(
			'id'       => 'post-excerpt-length',
			'type'     => 'slider',
			'title'    => __( 'Excerpt Limit', 'mixt' ),
			'subtitle' => __( 'Set a maximum excerpt length (in words)', 'mixt' ),
			'default'  => 55,
			'min'      => 10,
			'max'      => 200,
		),

		// Sticky Label
		array(
			'id'       => 'sticky-label',
			'type'     => 'text',
			'title'    => __( 'Sticky Label', 'mixt' ),
			'subtitle' => __( 'Set the sticky post label text, or empty to hide the label', 'mixt' ),
			'default'  => __( 'Sticky', 'mixt' ),
		),
	),
);

// BLOG PAGE
$this->sections[] = array(
	'title'      => __( 'Blog Page', 'mixt' ),
	'desc'       => __( 'Manage the blog page and post appearance', 'mixt' ),
	'icon'       => 'el-icon-th-list',
	'subsection' => true,
	'customizer' => false,
	'fields'     => array(

		// Nav Menu
		array(
			'id'       => 'blog-nav-menu',
			'type'     => 'select',
			'title'    => __( 'Nav Menu', 'mixt' ),
			'subtitle' => __( 'Select the menu for this page', 'mixt' ),
			'options'  => mixt_get_nav_menus(),
			'default'  => 'auto',
		),

		// Fullwidth
		array(
			'id'       => 'blog-page-fullwidth',
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
			'id'       => 'blog-page-sidebar',
			'type'     => 'button_set',
			'title'    => __( 'Show Sidebar', 'mixt' ),
			'options'  => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default'  => 'auto',
		),

		// Sidebar ID
		array(
			'id'       => 'blog-sidebar-id',
			'type'     => 'select',
			'title'    => __( 'Sidebar', 'mixt' ),
			'desc'     => __( 'Select a sidebar to use on this page', 'mixt' ),
			'options'  => mixt_get_sidebars(),
			'default'  => 'auto',
		),

		// Layout Type
		array(
			'id'       => 'blog-layout-type',
			'type'     => 'button_set',
			'title'    => __( 'Layout Type', 'mixt' ),
			'subtitle' => __( 'Select the blog layout type', 'mixt' ),
			'options'  => array(
				'standard' => __( 'Standard', 'mixt' ),
				'grid'     => __( 'Grid', 'mixt' ),
				'masonry'  => __( 'Masonry', 'mixt' ),
			),
			'default'  => 'standard',
		),

		// Columns
		array(
			'id'       => 'blog-layout-columns',
			'type'     => 'button_set',
			'title'    => __( 'Blog Columns', 'mixt' ),
			'subtitle' => __( 'Number of columns for grid and masonry layout', 'mixt' ),
			'options'  => array(
				'2' => '2',
				'3' => '3',
				'4' => '4',
				'5' => '5',
				'6' => '6',
			),
			'default'  => '2',
			'required' => array('blog-layout-type', '!=', 'standard'),
		),

		// Post Media Display
		array(
			'id'       => 'blog-feat-show',
			'type'     => 'switch',
			'title'    => __( 'Show Media', 'mixt' ),
			'subtitle' => __( 'Display the post featured media', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => true,
		),

		// Post Media Size
		array(
			'id'       => 'blog-feat-size',
			'type'     => 'button_set',
			'title'    => __( 'Media Size', 'mixt' ),
			'subtitle' => __( 'Select a size for the post featured media', 'mixt' ),
			'options'  => array(
				'blog-large'  => __( 'Large', 'mixt' ),
				'blog-medium' => __( 'Medium', 'mixt' ),
				'blog-small'  => __( 'Small', 'mixt' ),
			),
			'default'  => 'blog-large',
			'required' => array(
				array('blog-layout-type', '=', 'standard'),
				array('blog-feat-show', '=', true),
			),
		),

		// Post Info Display
		array(
			'id'       => 'blog-post-info',
			'type'     => 'switch',
			'title'    => __( 'Post Info', 'mixt' ),
			'subtitle' => __( 'Display the post format and date', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => false,
		),

		// Meta Position / Display
		array(
			'id'       => 'blog-meta-show',
			'type'     => 'button_set',
			'title'    => __( 'Post Meta', 'mixt' ),
			'subtitle' => __( 'Display the meta in the post header, footer, or do not display', 'mixt' ),
			'options'  => array(
				'header'  => __( 'In Header', 'mixt' ),
				'footer'  => __( 'In Footer', 'mixt' ),
				'false'   => __( 'No', 'mixt' ),
			),
			'default'  => 'header',
		),

		// Title Display
		array(
			'id'       => 'blog-page-title',
			'type'     => 'switch',
			'title'    => __( 'Post Title', 'mixt' ),
			'subtitle' => __( 'Display the post title', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => true,
		),

		// Content Display
		array(
			'id'       => 'blog-page-content',
			'type'     => 'switch',
			'title'    => __( 'Post Content', 'mixt' ),
			'subtitle' => __( 'Display the post content', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => true,
		),

		// Post Content Type
		array(
			'id'       => 'blog-post-content-type',
			'type'     => 'button_set',
			'title'    => __( 'Post Content Type', 'mixt' ),
			'subtitle' => __( 'Show the post\'s excerpt or full content', 'mixt' ),
			'options'  => array(
				'full'    => __( 'Full', 'mixt' ),
				'excerpt' => __( 'Excerpt', 'mixt' ),
			),
			'default'  => 'full',
		),

		// Divider
		array(
			'id'   => 'blog-divider',
			'type' => 'divide',
		),

		// ROLLOVER
		array(
			'id'       => 'blog-rollover-section',
			'type'     => 'section',
			'title'    => __( 'Rollover', 'mixt' ),
			'indent'   => true,
		),

			// Show Rollover
			array(
				'id'       => 'blog-rollover',
				'type'     => 'switch',
				'title'    => __( 'Show Rollover', 'mixt' ),
				'subtitle' => __( 'Display an overlay with useful links and info when a post is hovered', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => false,
			),

			// Rollover Items
			array(
                'id'       => 'blog-rollover-items',
				'type'     => 'checkbox',
				'title'    => __( 'Items', 'mixt' ),
				'options'  => array(
					'title'   => __( 'Title', 'mixt' ),
					'excerpt' => __( 'Excerpt', 'mixt' ),
					'view'    => __( 'View Post Button', 'mixt' ),
					'full'    => __( 'Full Image Button', 'mixt' ),
				),
				'default' => array(
					'title'   => '1',
					'excerpt' => '0',
					'view'    => '0',
					'full'    => '0',
				),
				'required' => array('blog-rollover', '=', true),
			),

			// Rollover Color
			array(
				'id'       => 'blog-rollover-color',
				'type'     => 'select',
				'title'    => __( 'Background Color', 'mixt' ),
				'options'  => mixt_get_assets('colors', 'basic'),
				'default'  => 'black',
				'required' => array('blog-rollover', '=', true),
			),

			// Animation - In
			array(
				'id'       => 'blog-rollover-anim-in',
				'type'     => 'select',
				'title'    => __( 'Animation - In', 'mixt' ),
				'options'  => mixt_css_anims('trans-in'),
				'default'  => 'fadeIn',
				'required' => array('blog-rollover', '=', true),
			),

			// Animation - Out
			array(
				'id'       => 'blog-rollover-anim-out',
				'type'     => 'select',
				'title'    => __( 'Animation - Out', 'mixt' ),
				'options'  => mixt_css_anims('trans-out'),
				'default'  => 'fadeOut',
				'required' => array('blog-rollover', '=', true),
			),

			// Item Style
			array(
				'id'       => 'blog-rollover-item-style',
				'type'     => 'select',
				'title'    => __( 'Item Style', 'mixt' ),
				'options'  => array(
					'plain'         => __( 'Plain', 'mixt' ),
					'btn'           => __( 'Button', 'mixt' ),
					'btn btn-round' => __( 'Round Button', 'mixt' ),
				),
				'default'  => 'plain',
				'required' => array('blog-rollover', '=', true),
			),

			// Button Color
			array(
				'id'       => 'blog-rollover-btn-color',
				'type'     => 'select',
				'title'    => __( 'Button Color', 'mixt' ),
				'options'  => mixt_get_assets('colors', 'buttons'),
				'default'  => 'primary',
				'required' => array(
					array('blog-rollover', '=', true),
					array('blog-rollover-item-style', '!=', 'plain'),
					array('blog-rollover-item-style', '!=', '')
				),
			),
	),
);

// AUTHOR PAGE
$this->sections[] = postsPageFields('author', 'user', array( 'meta-show' => 'false' ));

// CATEGORY PAGE
$this->sections[] = postsPageFields('category', 'folder-open');

// DATE PAGE
$this->sections[] = postsPageFields('date', 'time', array( 'post-info' => false ));

// SEARCH PAGE
$this->sections[] = postsPageFields('search', 'search', array( 'meta-show' => 'header' ));

// TAG PAGE
$this->sections[] = postsPageFields('tag', 'tag');

// TAXONOMY PAGE
$this->sections[] = postsPageFields('taxonomy', 'tags', array( 'post-info' => false ));
