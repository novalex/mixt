<?php

// Portfolio Redux Fields

// DIVIDER
$this->sections[] = array(
	'type' => 'divide',
);

// PORTFOLIO SECTION
$this->sections[] = array(
	'title'      => __( 'Portfolio', 'mixt' ),
	'desc'       => __( 'Customize the portfolio\'s options and appearance', 'mixt' ),
	'icon'       => 'el-icon-folder-open',
	'customizer' => false,
	'fields'     => array(

		// Fullwidth
		array(
			'id'       => 'portfolio-page-page-fullwidth',
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
			'id'       => 'portfolio-page-page-sidebar',
			'type'     => 'button_set',
			'title'    => __( 'Show Sidebar', 'mixt' ),
			'options'  => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default'  => 'auto',
		),

		// Inherit Blog Settings
		array(
			'id'       => 'portfolio-page-inherit',
			'type'     => 'switch',
			'title'    => __( 'Inherit Blog Layout', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => false,
		),

		// Layout Type
		array(
			'id'       => 'portfolio-page-type',
			'type'     => 'button_set',
			'title'    => __( 'Layout Type', 'mixt' ),
			'subtitle' => __( 'Select the layout type for this page', 'mixt' ),
			'options'  => array(
				'standard' => __( 'Standard', 'mixt' ),
				'grid'     => __( 'Grid', 'mixt' ),
				'masonry'  => __( 'Masonry', 'mixt' ),
			),
			'default'  => 'grid',
			'required' => array('portfolio-page-inherit', '=', false),
		),

		// Columns
		array(
			'id'       => 'portfolio-page-columns',
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
			'default'  => '3',
			'required' => array(
				array('portfolio-page-inherit', '=', false),
				array('portfolio-page-type', '!=', 'standard'),
			),
		),

		// Post Media Display
		array(
			'id'       => 'portfolio-page-feat-show',
			'type'     => 'switch',
			'title'    => __( 'Show Media', 'mixt' ),
			'subtitle' => __( 'Display the post featured media', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => true,
			'required' => array('portfolio-page-inherit', '=', false),
		),

		// Featured Media Placeholder
		array(
			'id'             => 'portfolio-page-feat-ph',
			'type'           => 'media',
			'title'          => __( 'Featured Media Placeholder', 'mixt' ),
			'subtitle'       => __( 'Select a placeholder image to show if a project does not have any featured media', 'mixt' ),
			'mode'           => 'jpg, jpeg, png',
			'library_filter' => array( 'jpg', 'jpeg', 'png' ),
			'required' => array('portfolio-page-feat-show', '=', true),
		),

		// Post Media Size
		array(
			'id'       => 'portfolio-page-feat-size',
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
				array('portfolio-page-inherit', '=', false),
				array('portfolio-page-type', '=', 'standard'),
				array('portfolio-page-feat-show', '=', true),
			),
		),

		// Post Info Display
		array(
			'id'       => 'portfolio-page-post-info',
			'type'     => 'switch',
			'title'    => __( 'Post Info', 'mixt' ),
			'subtitle' => __( 'Display the post format and date', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => false,
			'required' => array('portfolio-page-inherit', '=', false),
		),

		// Meta Position / Display
		array(
			'id'       => 'portfolio-page-meta-show',
			'type'     => 'button_set',
			'title'    => __( 'Post Meta', 'mixt' ),
			'subtitle' => __( 'Display the meta in the post header, footer, or do not display', 'mixt' ),
			'options'  => array(
				'header'  => __( 'In Header', 'mixt' ),
				'footer'  => __( 'In Footer', 'mixt' ),
				'false'   => __( 'No', 'mixt' ),
			),
			'default'  => 'false',
			'required' => array('portfolio-page-inherit', '=', false),
		),

		// Title Display
		array(
			'id'       => 'portfolio-page-title',
			'type'     => 'switch',
			'title'    => __( 'Post Title', 'mixt' ),
			'subtitle' => __( 'Display the post title', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => true,
		),

		// Excerpt Display
		array(
			'id'       => 'portfolio-page-excerpt',
			'type'     => 'switch',
			'title'    => __( 'Post Excerpt', 'mixt' ),
			'subtitle' => __( 'Display the post excerpt', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => false,
		),

		// Filters
		array(
			'id'       => 'portfolio-page-filters',
			'type'     => 'switch',
			'title'    => __( 'Filters', 'mixt' ),
			'subtitle' => __( 'Display filter links', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => true,
		),

		// Divider
		array(
			'id'   => 'portfolio-divider',
			'type' => 'divide',
		),

		// ROLLOVER SECTION
		array(
			'id'       => 'portfolio-rollover-section',
			'type'     => 'section',
			'title'    => __( 'Rollover', 'mixt' ),
			'indent'   => true,
		),

			// Show Rollover
			array(
				'id'       => 'portfolio-rollover',
				'type'     => 'switch',
				'title'    => __( 'Show Rollover', 'mixt' ),
				'subtitle' => __( 'Display an overlay with useful links and info when a project is hovered', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => true,
			),

			// Rollover Elements
			array(
                'id'      => 'portfolio-rollover-elem',
				'type'    => 'checkbox',
				'title'   => __( 'Elements', 'mixt' ),
				'options' => array(
					'title'   => __( 'Title', 'mixt' ),
					'excerpt' => __( 'Excerpt', 'mixt' ),
					'view'    => __( 'View Post Button', 'mixt' ),
					'full'    => __( 'Full Image Button', 'mixt' ),
				),
				'default' => array(
					'title'   => '0',
					'excerpt' => '1',
					'view'    => '1',
					'full'    => '0',
				),
				'required' => array('portfolio-rollover', '=', true),
			),

			// Rollover Color
			array(
				'id'      => 'portfolio-rollover-color',
				'type'    => 'select',
				'title'   => __( 'Background Color', 'mixt' ),
				'options' => mixt_get_assets('colors', 'basic'),
				'default' => 'black',
			),

			// Animation - In
			array(
				'id'      => 'portfolio-rollover-anim-in',
				'type'    => 'select',
				'title'   => __( 'Animation - In', 'mixt' ),
				'options' => mixt_css_anims('trans-in'),
				'default' => 'fadeInLeft',
			),

			// Animation - Out
			array(
				'id'      => 'portfolio-rollover-anim-out',
				'type'    => 'select',
				'title'   => __( 'Animation - Out', 'mixt' ),
				'options' => mixt_css_anims('trans-out'),
				'default' => 'fadeOutRight',
			),

			// View Post Icon
			array(
				'id'      => 'portfolio-rollover-view-icon',
				'type'    => 'text',
				'title'   => __( 'View Post Icon', 'mixt' ),
				'default' => 'fa fa-share',
			),

			// Full Image Icon
			array(
				'id'      => 'portfolio-rollover-full-icon',
				'type'    => 'text',
				'title'   => __( 'Full Image Icon', 'mixt' ),
				'default' => 'fa fa-search',
			),

			// Button Color
			array(
				'id'      => 'portfolio-rollover-btn-color',
				'type'    => 'select',
				'title'   => __( 'Button Color', 'mixt' ),
				'options' => mixt_get_assets('button', 'colors'),
				'default' => 'primary',
			),
	),
);

// SINGLE PROJECT PAGE SECTION
$this->sections[] = array(
	'title'      => __( 'Project Page', 'mixt' ),
	'desc'       => __( 'Manage the single project pages', 'mixt' ),
	'icon'       => 'el-icon-edit',
	'customizer' => false,
	'subsection' => true,
	'fields'     => array(

		// Layout
		array(
			'id'       => 'project-layout',
			'type'     => 'button_set',
			'title'    => __( 'Layout', 'mixt' ),
			'subtitle' => __( 'Set the project featured media width. The content will fill the remaining space.', 'mixt' ),
			'options'  => array(
				'full'       => __( 'Full Width', 'mixt' ),
				'two-thirds' => '2/3',
				'half'       => '1/2',
				'one-third'  => '1/3',
			),
			'default'  => 'half',
		),

		// Taxonomies
		array(
			'id'       => 'project-taxonomies',
			'type'     => 'switch',
			'title'    => __( 'Show Taxonomies', 'mixt' ),
			'subtitle' => __( 'Display project types and attributes', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => false,
		),

		// Sharing Buttons
		array(
			'id'      => 'project-sharing',
			'type'    => 'switch',
			'title'   => __( 'Show Sharing Buttons', 'mixt' ),
			'on'      => __( 'Yes', 'mixt' ),
			'off'     => __( 'No', 'mixt' ),
			'default' => false,
		),

		// Sharing Profiles To Display
		array(
			'id'       => 'project-sharing-profiles',
			'type'     => 'checkbox',
			'title'    => __( 'Sharing Profiles', 'mixt' ),
			'subtitle' => __( 'Select which sharing profiles to display', 'mixt' ),
			'options'  => $social_sharing_profile_names,
			'required' => array('project-sharing', '=', true),
		),

		// Navigation
		array(
			'id'       => 'project-navigation',
			'type'     => 'switch',
			'title'    => __( 'Prev/Next Navigation', 'mixt' ),
			'subtitle' => __( 'Show links to next and previous projects', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => false,
		),
		
		// Comments
		array(
			'id'       => 'project-comments',
			'type'     => 'switch',
			'title'    => __( 'Comments', 'mixt' ),
			'subtitle' => __( 'Show comments', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => true,
		),

		// Divider
		array(
			'id'   => 'project-divider',
			'type' => 'divide',
		),

		// RELATED PROJECTS SECTION
		array(
			'id'       => 'project-related-section',
			'type'     => 'section',
			'title'    => __( 'Related Projects', 'mixt' ),
			'indent'   => true,
		),

			// Show Related Projects
			array(
				'id'      => 'project-related',
				'type'    => 'switch',
				'title'   => __( 'Show Related Projects', 'mixt' ),
				'on'      => __( 'Yes', 'mixt' ),
				'off'     => __( 'No', 'mixt' ),
				'default' => true,
			),

			// Related Projects
			array(
				'id'       => 'project-related-number',
				'type'     => 'spinner',
				'title'    => __( 'Related Projects', 'mixt' ),
				'subtitle' => __( 'How many related projects to display', 'mixt' ),
				'max'      => '15',
				'min'      => '1',
				'step'     => '1',
				'default'  => '3',
				'required' => array('project-related', '=', true),
			),

			// Related Projects Slider
			array(
				'id'       => 'project-related-slider',
				'type'     => 'switch',
				'title'    => __( 'Slider Style', 'mixt' ),
				'subtitle' => __( 'Display related projects in a slider/carousel', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => false,
				'required' => array(
					array('project-related', '=', true),
					array('project-related-number', '>', 3),
				),
			),

			// Related Projects Featured Media Placeholder
			array(
				'id'             => 'project-related-feat-ph',
				'type'           => 'media',
				'title'          => __( 'Featured Media Placeholder', 'mixt' ),
				'subtitle'       => __( 'Select a placeholder image to show if a project does not have any featured media', 'mixt' ),
				'mode'           => 'jpg, jpeg, png',
				'library_filter' => array( 'jpg', 'jpeg', 'png' ),
				'required' => array('project-related', '=', true),
			),
	),
);
