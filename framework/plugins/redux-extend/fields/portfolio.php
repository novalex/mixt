<?php

$this->sections[] = array(
	'title'      => esc_html__( 'Portfolio', 'mixt' ),
	'desc'       => esc_html__( 'Customize the portfolio\'s options and appearance', 'mixt' ),
	'icon'       => 'el-icon-folder-open',
	'customizer' => false,
	'fields'     => array(

		// Show Projects On Author Archives
		array(
			'id'       => 'show-projects-author-archives',
			'type'     => 'switch',
			'title'    => esc_html__( 'Show projects on author archives', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => true,
		),

		// Show Projects On Date Archives
		array(
			'id'       => 'show-projects-date-archives',
			'type'     => 'switch',
			'title'    => esc_html__( 'Show projects on date archives', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => true,
		),

		// Filters
		array(
			'id'       => 'portfolio-page-filters',
			'type'     => 'switch',
			'title'    => esc_html__( 'Filters', 'mixt' ),
			'subtitle' => esc_html__( 'Display filter links', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => true,
		),

		// Divider
		array(
			'id'   => 'portfolio-divider',
			'type' => 'divide',
		),

		// LAYOUT OPTIONS
		array(
			'id'       => 'portfolio-layout-section',
			'type'     => 'section',
			'title'    => esc_html__( 'Layout', 'mixt' ),
			'indent'   => true,
		),

			// Inherit Blog Settings
			array(
				'id'       => 'portfolio-page-inherit',
				'type'     => 'switch',
				'title'    => esc_html__( 'Inherit Blog Options', 'mixt' ),
				'subtitle' => esc_html__( 'Enable to inherit all options from the blog page', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => false,
			),

			// Nav Menu
			array(
				'id'       => 'portfolio-page-nav-menu',
				'type'     => 'select',
				'title'    => esc_html__( 'Nav Menu', 'mixt' ),
				'subtitle' => esc_html__( 'Select the menu for this page', 'mixt' ),
				'options'  => $nav_menus,
				'default'  => 'auto',
				'required' => array('portfolio-page-inherit', '=', false),
			),

			// Fullwidth
			array(
				'id'       => 'portfolio-page-page-fullwidth',
				'type'     => 'button_set',
				'title'    => esc_html__( 'Full Width', 'mixt' ),
				'options'  => array(
					'auto'  => esc_html__( 'Auto', 'mixt' ),
					'true'  => esc_html__( 'Yes', 'mixt' ),
					'false' => esc_html__( 'No', 'mixt' ),
				),
				'default'  => 'auto',
				'required' => array('portfolio-page-inherit', '=', false),
			),

			// Sidebar
			array(
				'id'       => 'portfolio-page-page-sidebar',
				'type'     => 'button_set',
				'title'    => esc_html__( 'Show Sidebar', 'mixt' ),
				'options'  => array(
					'auto'  => esc_html__( 'Auto', 'mixt' ),
					'true'  => esc_html__( 'Yes', 'mixt' ),
					'false' => esc_html__( 'No', 'mixt' ),
				),
				'default'  => 'auto',
				'required' => array('portfolio-page-inherit', '=', false),
			),

			// Sidebar ID
			array(
				'id'       => 'portfolio-page-sidebar-id',
				'type'     => 'select',
				'title'    => esc_html__( 'Sidebar', 'mixt' ),
				'subtitle' => esc_html__( 'Select a sidebar to use on this page', 'mixt' ),
				'options'  => $available_sidebars,
				'default'  => '',
				'required' => array('portfolio-page-inherit', '=', false),
			),

			// Layout Type
			array(
				'id'       => 'portfolio-page-layout-type',
				'type'     => 'button_set',
				'title'    => esc_html__( 'Layout Type', 'mixt' ),
				'subtitle' => esc_html__( 'Select the layout type for this page', 'mixt' ),
				'options'  => array(
					'standard' => esc_html__( 'Standard', 'mixt' ),
					'grid'     => esc_html__( 'Grid', 'mixt' ),
					'masonry'  => esc_html__( 'Masonry', 'mixt' ),
				),
				'default'  => 'grid',
				'required' => array('portfolio-page-inherit', '=', false),
			),

			// Columns
			array(
				'id'       => 'portfolio-page-layout-columns',
				'type'     => 'button_set',
				'title'    => esc_html__( 'Columns', 'mixt' ),
				'subtitle' => esc_html__( 'Number of columns for grid and masonry layout', 'mixt' ),
				'options'  => array(
					'2' => '2',
					'3' => '3',
					'4' => '4',
					'5' => '5',
					'6' => '6',
				),
				'default'  => '3',
				'required' => array(
					array('portfolio-page-inherit', '=', false),
					array('portfolio-page-layout-type', '!=', 'standard'),
				),
			),

			// Post Media Display
			array(
				'id'       => 'portfolio-page-feat-show',
				'type'     => 'switch',
				'title'    => esc_html__( 'Show Media', 'mixt' ),
				'subtitle' => esc_html__( 'Display the post featured media', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => true,
				'required' => array('portfolio-page-inherit', '=', false),
			),

			// Featured Media Placeholder
			array(
				'id'             => 'portfolio-page-feat-ph',
				'type'           => 'media',
				'title'          => esc_html__( 'Featured Media Placeholder', 'mixt' ),
				'subtitle'       => esc_html__( 'Select a placeholder image to show if a project does not have any featured media', 'mixt' ),
				'mode'           => 'jpg, jpeg, png',
				'library_filter' => array( 'jpg', 'jpeg', 'png' ),
				'required' => array('portfolio-page-feat-show', '=', true),
			),

			// Post Media Size
			array(
				'id'       => 'portfolio-page-feat-size',
				'type'     => 'button_set',
				'title'    => esc_html__( 'Media Size', 'mixt' ),
				'subtitle' => esc_html__( 'Select a size for the post featured media', 'mixt' ),
				'options'  => array(
					'mixt-large'  => esc_html__( 'Large', 'mixt' ),
					'mixt-medium' => esc_html__( 'Medium', 'mixt' ),
					'mixt-small'  => esc_html__( 'Small', 'mixt' ),
				),
				'default'  => 'mixt-large',
				'required' => array(
					array('portfolio-page-inherit', '=', false),
					array('portfolio-page-layout-type', '=', 'standard'),
					array('portfolio-page-feat-show', '=', true),
				),
			),

			// Post Info Display
			array(
				'id'       => 'portfolio-page-post-info',
				'type'     => 'switch',
				'title'    => esc_html__( 'Post Info', 'mixt' ),
				'subtitle' => esc_html__( 'Display the post format and date', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => false,
				'required' => array('portfolio-page-inherit', '=', false),
			),

			// Meta Position / Display
			array(
				'id'       => 'portfolio-page-meta-show',
				'type'     => 'button_set',
				'title'    => esc_html__( 'Post Meta', 'mixt' ),
				'subtitle' => esc_html__( 'Display the meta in the post header, footer, or do not display', 'mixt' ),
				'options'  => array(
					'header'  => esc_html__( 'In Header', 'mixt' ),
					'footer'  => esc_html__( 'In Footer', 'mixt' ),
					'false'   => esc_html__( 'No', 'mixt' ),
				),
				'default'  => 'false',
				'required' => array('portfolio-page-inherit', '=', false),
			),

			// Title Display
			array(
				'id'       => 'portfolio-page-title',
				'type'     => 'switch',
				'title'    => esc_html__( 'Post Title', 'mixt' ),
				'subtitle' => esc_html__( 'Display the post title', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => true,
				'required' => array('portfolio-page-inherit', '=', false),
			),

			// Content Display
			array(
				'id'       => 'portfolio-page-content',
				'type'     => 'switch',
				'title'    => esc_html__( 'Post Content', 'mixt' ),
				'subtitle' => esc_html__( 'Display the post content', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => false,
				'required' => array('portfolio-page-inherit', '=', false),
			),

			// Post Content Type
			array(
				'id'       => 'portfolio-page-post-content-type',
				'type'     => 'button_set',
				'title'    => esc_html__( 'Post Content Type', 'mixt' ),
				'subtitle' => esc_html__( 'Show the post\'s excerpt or full content', 'mixt' ),
				'options'  => array(
					'full'    => esc_html__( 'Full', 'mixt' ),
					'excerpt' => esc_html__( 'Excerpt', 'mixt' ),
				),
				'default'  => 'full',
				'required' => array('portfolio-page-inherit', '=', false),
			),

		// Divider
		array(
			'id'   => 'portfolio-divider-2',
			'type' => 'divide',
		),

		// ROLLOVER
		array(
			'id'       => 'portfolio-rollover-section',
			'type'     => 'section',
			'title'    => esc_html__( 'Rollover', 'mixt' ),
			'indent'   => true,
		),

			// Show Rollover
			array(
				'id'       => 'portfolio-rollover',
				'type'     => 'switch',
				'title'    => esc_html__( 'Show Rollover', 'mixt' ),
				'subtitle' => esc_html__( 'Display an overlay with useful links and info when a project is hovered', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => true,
			),

			// Rollover Items
			array(
                'id'       => 'portfolio-rollover-items',
				'type'     => 'checkbox',
				'title'    => esc_html__( 'Items', 'mixt' ),
				'options'  => array(
					'title'   => esc_html__( 'Title', 'mixt' ),
					'excerpt' => esc_html__( 'Excerpt', 'mixt' ),
					'view'    => esc_html__( 'View Post Button', 'mixt' ),
					'full'    => esc_html__( 'Full Image Button', 'mixt' ),
				),
				'default' => array(
					'title'   => '1',
					'excerpt' => '0',
					'view'    => '0',
					'full'    => '0',
				),
				'required' => array('portfolio-rollover', '=', true),
			),

			// Rollover Color
			array(
				'id'       => 'portfolio-rollover-color',
				'type'     => 'select',
				'title'    => esc_html__( 'Background Color', 'mixt' ),
				'options'  => mixt_get_assets('colors', 'basic'),
				'default'  => 'black',
				'required' => array('portfolio-rollover', '=', true),
			),

			// Animation - In
			array(
				'id'       => 'portfolio-rollover-anim-in',
				'type'     => 'select',
				'title'    => esc_html__( 'Animation - In', 'mixt' ),
				'options'  => mixt_css_anims('trans-in'),
				'default'  => 'fadeIn',
				'required' => array('portfolio-rollover', '=', true),
			),

			// Animation - Out
			array(
				'id'       => 'portfolio-rollover-anim-out',
				'type'     => 'select',
				'title'    => esc_html__( 'Animation - Out', 'mixt' ),
				'options'  => mixt_css_anims('trans-out'),
				'default'  => 'fadeOut',
				'required' => array('portfolio-rollover', '=', true),
			),

			// Item Style
			array(
				'id'       => 'portfolio-rollover-item-style',
				'type'     => 'select',
				'title'    => esc_html__( 'Item Style', 'mixt' ),
				'options'  => array(
					'plain'         => esc_html__( 'Plain', 'mixt' ),
					'btn'           => esc_html__( 'Button', 'mixt' ),
					'btn btn-round' => esc_html__( 'Round Button', 'mixt' ),
				),
				'default'  => 'plain',
				'required' => array('portfolio-rollover', '=', true),
			),

			// Button Color
			array(
				'id'       => 'portfolio-rollover-btn-color',
				'type'     => 'select',
				'title'    => esc_html__( 'Button Color', 'mixt' ),
				'options'  => mixt_get_assets('colors', 'buttons'),
				'default'  => 'primary',
				'required' => array(
					array('portfolio-rollover', '=', true),
					array('portfolio-rollover-item-style', '!=', 'plain'),
					array('portfolio-rollover-item-style', '!=', '')
				),
			),
	),
);


// SINGLE PROJECT PAGE

$this->sections[] = array(
	'title'      => esc_html__( 'Project Page', 'mixt' ),
	'desc'       => esc_html__( 'Manage the single project pages', 'mixt' ),
	'icon'       => 'el-icon-edit',
	'customizer' => false,
	'subsection' => true,
	'fields'     => array(

		// Sidebar
		array(
			'id'       => 'project-sidebar',
			'type'     => 'button_set',
			'title'    => esc_html__( 'Show Sidebar', 'mixt' ),
			'subtitle' => esc_html__( 'Display the sidebar on project pages', 'mixt' ),
			'options'  => array(
				'auto'  => esc_html__( 'Auto', 'mixt' ),
				'true'  => esc_html__( 'Yes', 'mixt' ),
				'false' => esc_html__( 'No', 'mixt' ),
			),
			'default'  => 'auto',
		),

		// Layout
		array(
			'id'       => 'project-layout',
			'type'     => 'button_set',
			'title'    => esc_html__( 'Layout', 'mixt' ),
			'subtitle' => esc_html__( 'Set the project featured media width. The content will fill the remaining space.', 'mixt' ),
			'options'  => array(
				'full'       => esc_html__( 'Full Width', 'mixt' ),
				'two-thirds' => '2/3',
				'half'       => '1/2',
				'one-third'  => '1/3',
			),
			'default'  => 'full',
		),

		// Post Info
		array(
			'id'       => 'project-post-info',
			'type'     => 'switch',
			'title'    => esc_html__( 'Post Info', 'mixt' ),
			'subtitle' => esc_html__( 'Display the post format and date', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => false,
		),

		// Meta Position / Display
		array(
			'id'       => 'project-meta-show',
			'type'     => 'button_set',
			'title'    => esc_html__( 'Post Meta', 'mixt' ),
			'subtitle' => esc_html__( 'Display the meta in the post header, footer, or do not display', 'mixt' ),
			'options'  => array(
				'header'  => esc_html__( 'In Header', 'mixt' ),
				'footer'  => esc_html__( 'In Footer', 'mixt' ),
				'false'   => esc_html__( 'No', 'mixt' ),
			),
			'default'  => 'header',
		),

		// Tags
		array(
			'id'       => 'project-tags',
			'type'     => 'switch',
			'title'    => esc_html__( 'Show Tags', 'mixt' ),
			'subtitle' => esc_html__( 'Display project types and attributes', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => false,
		),

		// Sharing Buttons
		array(
			'id'      => 'project-sharing',
			'type'    => 'switch',
			'title'   => esc_html__( 'Show Sharing Buttons', 'mixt' ),
			'on'      => esc_html__( 'Yes', 'mixt' ),
			'off'     => esc_html__( 'No', 'mixt' ),
			'default' => false,
		),

		// Sharing Profiles To Display
		array(
			'id'       => 'project-sharing-profiles',
			'type'     => 'checkbox',
			'title'    => esc_html__( 'Sharing Profiles', 'mixt' ),
			'subtitle' => esc_html__( 'Select which sharing profiles to display', 'mixt' ),
			'options'  => $social_sharing_profile_names,
			'required' => array('project-sharing', '=', true),
		),

		// Navigation
		array(
			'id'       => 'project-navigation',
			'type'     => 'switch',
			'title'    => esc_html__( 'Project Navigation', 'mixt' ),
			'subtitle' => esc_html__( 'Show links to next and previous projects', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => false,
		),
		
		// Comments
		array(
			'id'       => 'project-comments',
			'type'     => 'switch',
			'title'    => esc_html__( 'Comments', 'mixt' ),
			'subtitle' => esc_html__( 'Show comments', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => true,
		),

		// Divider
		array(
			'id'   => 'project-divider',
			'type' => 'divide',
		),

		// RELATED PROJECTS
		array(
			'id'       => 'project-related-section',
			'type'     => 'section',
			'title'    => esc_html__( 'Related Projects', 'mixt' ),
			'indent'   => true,
		),

			// Show Related Projects
			array(
				'id'      => 'project-related',
				'type'    => 'switch',
				'title'   => esc_html__( 'Show Related Projects', 'mixt' ),
				'on'      => esc_html__( 'Yes', 'mixt' ),
				'off'     => esc_html__( 'No', 'mixt' ),
				'default' => true,
			),

			// Related Projects Number
			array(
				'id'       => 'project-related-number',
				'type'     => 'spinner',
				'title'    => esc_html__( 'Related Projects', 'mixt' ),
				'subtitle' => esc_html__( 'How many related projects to display', 'mixt' ),
				'max'      => '15',
				'min'      => '1',
				'step'     => '1',
				'default'  => '3',
				'required' => array('project-related', '=', true),
			),

			// Project Slider
			array(
				'id'       => 'project-related-slider',
				'type'     => 'switch',
				'title'    => esc_html__( 'Slider Style', 'mixt' ),
				'subtitle' => esc_html__( 'Display related projects in a slider/carousel', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => false,
				'required' => array(
					array('project-related', '=', true),
					array('project-related-number', '>', 3),
				),
			),

			// Columns
			array(
				'id'       => 'project-related-cols',
				'type'     => 'slider',
				'title'    => esc_html__( 'Columns', 'mixt' ),
				'subtitle' => esc_html__( 'How many columns (related projects per row) to display', 'mixt' ),
				'default'  => 3,
				'min'      => 1,
				'max'      => 6,
				'required' => array('project-related', '=', true),
			),

			// Tablet (medium screen) Columns
			array(
				'id'       => 'project-related-tablet-cols',
				'type'     => 'slider',
				'title'    => esc_html__( 'Tablet Columns', 'mixt' ),
				'subtitle' => esc_html__( 'How many columns to display on tablets / medium screens', 'mixt' ),
				'default'  => 3,
				'min'      => 1,
				'max'      => 6,
				'required' => array('project-related', '=', true),
			),

			// Mobile (small screen) Columns
			array(
				'id'       => 'project-related-mobile-cols',
				'type'     => 'slider',
				'title'    => esc_html__( 'Mobile Columns', 'mixt' ),
				'subtitle' => esc_html__( 'How many columns to display on mobiles / small screens', 'mixt' ),
				'default'  => 2,
				'min'      => 1,
				'max'      => 3,
				'required' => array('project-related', '=', true),
			),

			// Display Type
			array(
				'id'       => 'project-related-type',
				'type'     => 'button_set',
				'title'    => esc_html__( 'Type', 'mixt' ),
				'subtitle' => esc_html__( 'Display text-only projects or with featured media', 'mixt' ),
				'options'  => array(
					'media' => esc_html__( 'Media', 'mixt' ),
					'text'  => esc_html__( 'Text', 'mixt' ),
				),
				'default'  => 'media',
				'required' => array('project-related', '=', true),
			),

			// Text Elements
			array(
				'id'       => 'project-related-elements',
				'type'     => 'checkbox',
				'title'    => esc_html__( 'Text Elements', 'mixt' ),
				'subtitle' => esc_html__( 'Select which elements to display', 'mixt' ),
				'options'  => array(
					'date'     => esc_html__( 'Date', 'mixt' ),
					'comments' => esc_html__( 'Comments', 'mixt' ),
					'excerpt'  => esc_html__( 'Excerpt', 'mixt' ),
				),
				'default'  => array(
					'date'     => '1',
					'comments' => '1',
				),
				'required' => array(
					array('project-related', '=', true),
					array('project-related-type', '=', 'text'),
				),
			),

			// Minimal Style
			array(
				'id'       => 'project-related-mini',
				'type'     => 'switch',
				'title'    => esc_html__( 'Minimal Style', 'mixt' ),
				'subtitle' => esc_html__( 'Hide the title and shrink items on small screens', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => true,
				'required' => array(
					array('project-related', '=', true),
					array('project-related-type', '=', 'media'),
				),
			),

			// Featured Media Placeholder
			array(
				'id'       => 'project-related-feat-ph',
				'type'     => 'media',
				'title'    => esc_html__( 'Featured Media Placeholder', 'mixt' ),
				'subtitle' => esc_html__( 'Select a placeholder image to show if a project does not have any featured media', 'mixt' ),
				'mode'     => 'jpg, jpeg, png',
				'library_filter' => array( 'jpg', 'jpeg', 'png' ),
				'required' => array(
					array('project-related', '=', true),
					array('project-related-type', '=', 'media'),
				),
			),
	),
);
