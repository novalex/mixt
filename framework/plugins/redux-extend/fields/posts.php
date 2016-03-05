<?php

$this->sections[] = array(
	'title'      => esc_html__( 'Posts', 'mixt' ),
	'desc'       => esc_html__( 'Configure the posts\' appearance', 'mixt' ),
	'icon'       => 'el-icon-pencil',
	'customizer' => false,
	'fields'     => array(

		// Sidebar
		array(
			'id'       => 'single-page-sidebar',
			'type'     => 'button_set',
			'title'    => esc_html__( 'Show Sidebar', 'mixt' ),
			'subtitle' => esc_html__( 'Display the sidebar on post pages', 'mixt' ),
			'options'  => array(
				'auto'  => esc_html__( 'Auto', 'mixt' ),
				'true'  => esc_html__( 'Yes', 'mixt' ),
				'false' => esc_html__( 'No', 'mixt' ),
			),
			'default'  => 'auto',
		),

		// Layout
		array(
			'id'       => 'post-layout',
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
			'id'       => 'single-post-info',
			'type'     => 'switch',
			'title'    => esc_html__( 'Post Info', 'mixt' ),
			'subtitle' => esc_html__( 'Display the post format and date', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => false,
		),

		// Meta Position / Display
		array(
			'id'       => 'single-meta-show',
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

		// Post Tags
		array(
			'id'       => 'post-tags',
			'type'     => 'switch',
			'title'    => esc_html__( 'Post Tags', 'mixt' ),
			'subtitle' => esc_html__( 'Show the post\'s tags', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => false,
		),

		// Post Navigation
		array(
			'id'       => 'post-navigation',
			'type'     => 'switch',
			'title'    => esc_html__( 'Post Navigation', 'mixt' ),
			'subtitle' => esc_html__( 'Display links to the previous and next posts', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => false,
		),

		// About The Author
		array(
			'id'       => 'post-about-author',
			'type'     => 'switch',
			'title'    => esc_html__( 'About The Author', 'mixt' ),
			'subtitle' => esc_html__( 'Show info about the author', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => true,
		),

		// Divider
		array(
			'id'   => 'post-divider',
			'type' => 'divide',
		),

		// RELATED POSTS
		array(
			'id'       => 'post-related-section',
			'type'     => 'section',
			'title'    => esc_html__( 'Related Posts', 'mixt' ),
			'indent'   => true,
		),

			// Related Posts
			array(
				'id'       => 'post-related',
				'type'     => 'switch',
				'title'    => esc_html__( 'Show', 'mixt' ),
				'subtitle' => esc_html__( 'Display related posts at the bottom of the post', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => true,
			),

			// Related By
			array(
				'id'       => 'post-related-by',
				'type'     => 'button_set',
				'title'    => esc_html__( 'Related By', 'mixt' ),
				'subtitle' => esc_html__( 'Show posts related by tags or categories', 'mixt' ),
				'options'  => array(
					'cats' => esc_html__( 'Categories', 'mixt' ),
					'tags' => esc_html__( 'Tags', 'mixt' ),
				),
				'default'  => 'cats',
				'required' => array('post-related', '=', true),
			),

			// Related Posts Number
			array(
				'id'       => 'post-related-number',
				'type'     => 'spinner',
				'title'    => esc_html__( 'Number', 'mixt' ),
				'subtitle' => esc_html__( 'How many related posts to display', 'mixt' ),
				'min'      => '1',
				'max'      => '15',
				'step'     => '1',
				'default'  => '3',
				'required' => array('post-related', '=', true),
			),

			// Post Slider
			array(
				'id'       => 'post-related-slider',
				'type'     => 'switch',
				'title'    => esc_html__( 'Slider Style', 'mixt' ),
				'subtitle' => esc_html__( 'Display related posts in a slider/carousel', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => false,
				'required' => array(
					array('post-related', '=', true),
					array('post-related-number', '>', 3),
				),
			),

			// Columns
			array(
				'id'       => 'post-related-cols',
				'type'     => 'slider',
				'title'    => esc_html__( 'Columns', 'mixt' ),
				'subtitle' => esc_html__( 'How many columns (related posts per row) to display', 'mixt' ),
				'default'  => 3,
				'min'      => 1,
				'max'      => 6,
				'required' => array('post-related', '=', true),
			),

			// Tablet (medium screen) Columns
			array(
				'id'       => 'post-related-tablet-cols',
				'type'     => 'slider',
				'title'    => esc_html__( 'Tablet Columns', 'mixt' ),
				'subtitle' => esc_html__( 'How many columns to display on tablets / medium screens', 'mixt' ),
				'default'  => 3,
				'min'      => 1,
				'max'      => 6,
				'required' => array('post-related', '=', true),
			),

			// Mobile (small screen) Columns
			array(
				'id'       => 'post-related-mobile-cols',
				'type'     => 'slider',
				'title'    => esc_html__( 'Mobile Columns', 'mixt' ),
				'subtitle' => esc_html__( 'How many columns to display on mobiles / small screens', 'mixt' ),
				'default'  => 2,
				'min'      => 1,
				'max'      => 3,
				'required' => array('post-related', '=', true),
			),

			// Display Type
			array(
				'id'       => 'post-related-type',
				'type'     => 'button_set',
				'title'    => esc_html__( 'Type', 'mixt' ),
				'subtitle' => esc_html__( 'Display posts with media or text only', 'mixt' ),
				'options'  => array(
					'media' => esc_html__( 'Media', 'mixt' ),
					'text'  => esc_html__( 'Text', 'mixt' ),
				),
				'default'  => 'media',
				'required' => array('post-related', '=', true),
			),

			// Text Elements
			array(
				'id'       => 'post-related-elements',
				'type'     => 'checkbox',
				'title'    => esc_html__( 'Post Elements', 'mixt' ),
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
					array('post-related', '=', true),
					array('post-related-type', '=', 'text'),
				),
			),

			// Minimal Style
			array(
				'id'       => 'post-related-mini',
				'type'     => 'switch',
				'title'    => esc_html__( 'Minimal Style', 'mixt' ),
				'subtitle' => esc_html__( 'Hide the title and shrink items on small screens', 'mixt' ),
				'on'       => esc_html__( 'Yes', 'mixt' ),
				'off'      => esc_html__( 'No', 'mixt' ),
				'default'  => true,
				'required' => array(
					array('post-related', '=', true),
					array('post-related-type', '=', 'media'),
				),
			),

			// Featured Media Placeholder
			array(
				'id'             => 'post-related-feat-ph',
				'type'           => 'media',
				'title'          => esc_html__( 'Featured Media Placeholder', 'mixt' ),
				'subtitle'       => esc_html__( 'Select a placeholder image to show if a post does not have any featured media', 'mixt' ),
				'mode'           => 'jpg, jpeg, png',
				'library_filter' => array('jpg', 'jpeg', 'png'),
				'required' => array(
					array('post-related', '=', true),
					array('post-related-type', '=', 'media'),
				),
			),
	),
);

// POST META
$this->sections[] = array(
	'title'      => esc_html__( 'Post Meta', 'mixt' ),
	'desc'       => esc_html__( 'Configure the post meta appearance and icons', 'mixt' ),
	'icon'       => 'el-icon-tasks',
	'subsection' => true,
	'customizer' => false,
	'fields'     => array(

		// Meta Author
		array(
			'id'       => 'meta-author',
			'type'     => 'switch',
			'title'    => esc_html__( 'Author', 'mixt' ),
			'subtitle' => esc_html__( 'Display the post author', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => true,
		),

		// Meta Date
		array(
			'id'       => 'meta-date',
			'type'     => 'switch',
			'title'    => esc_html__( 'Date', 'mixt' ),
			'subtitle' => esc_html__( 'Display the post date and time', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => true,
		),

		// Meta Category
		array(
			'id'       => 'meta-category',
			'type'     => 'switch',
			'title'    => esc_html__( 'Category', 'mixt' ),
			'subtitle' => esc_html__( 'Display the post category(es)', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => true,
		),

		// Meta Comments
		array(
			'id'       => 'meta-comments',
			'type'     => 'switch',
			'title'    => esc_html__( 'Comments', 'mixt' ),
			'subtitle' => esc_html__( 'Display the comments number', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => true,
		),

		// Meta Icons
		array(
			'id'       => 'meta-icons',
			'type'     => 'switch',
			'title'    => esc_html__( 'Icons', 'mixt' ),
			'subtitle' => esc_html__( 'Display icons next to the meta', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => true,
		),

		// Meta Separator
		array(
			'id'       => 'meta-separator',
			'type'     => 'text',
			'title'    => esc_html__( 'Separator', 'mixt' ),
			'subtitle' => esc_html__( 'Character(s) for the meta separator', 'mixt' ),
		),
	),
);

// SOCIAL SHARING
$this->sections[] = array(
	'title'      => esc_html__( 'Social Sharing', 'mixt' ),
	'desc'       => esc_html__( 'Manage your social sharing profiles and add new ones', 'mixt' ),
	'icon'       => 'el-icon-retweet',
	'customizer' => false,
	'subsection' => true,
	'fields'     => array(

		// Show Share Buttons
		array(
			'id'       => 'post-sharing',
			'type'     => 'switch',
			'title'    => esc_html__( 'Show', 'mixt' ),
			'subtitle' => esc_html__( 'Display the share buttons', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => true,
		),

		// Social Icons Color On Hover
		array(
			'id'   => 'post-sharing-color',
			'type' => 'button_set',
			'title'    => esc_html__( 'Social Icons Color On Hover', 'mixt' ),
			'subtitle' => esc_html__( 'Color the icon, its background, or neither on hover', 'mixt' ),
			'options' => array(
				'icon' => esc_html__( 'Icon', 'mixt' ),
				'bg'   => esc_html__( 'Background', 'mixt' ),
				'none' => esc_html__( 'Neither', 'mixt' ),
			),
			'default' => 'bg',
		),

		// Use Bit.ly URL Shortener Service
		array(
			'id'       => 'post-sharing-short',
			'type'     => 'switch',
			'title'    => esc_html__( 'Shorten URLs', 'mixt' ),
			'subtitle' => esc_html__( 'Shorten the {link2} tag with Bit.ly', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => false,
		),

		// Bit.ly Login
		array(
			'id'          => 'short-url-login',
			'type'        => 'password',
			'title'       => esc_html__( 'Bit.ly login', 'mixt' ),
			'subtitle'    => sprintf( esc_html__( 'Your user and API key. Get them here: %s', 'mixt' ), '<a href="https://bitly.com/a/settings/advanced">Bit.ly Account</a>' ),
			'username'    => true,
			'placeholder' => array(
				'username' => esc_html__( 'Enter your Username', 'mixt' ),
				'password' => esc_html__( 'Enter your API Key', 'mixt' ),
			),
			'required' => array('post-sharing-short', '=', true),
		),
		
		// Social Sharing Profiles
		array(
			'id'       => 'post-sharing-profiles',
			'type'     => 'mixt_multi_input',
			'no_title' => true,
			'add_text' => esc_html__( 'New Profile', 'mixt' ),
			'sortable' => true,
			'inputs'   => array(
				'name' => array(
					'icon'        => 'el-icon-tag',
					'wrap_class'  => 'social-label social-name',
					'input_class' => 'mixt-social-field network-name',
					'placeholder' => esc_html__( 'Name', 'mixt' ),
				),
				'url' => array(
					'icon'        => 'el-icon-globe',
					'wrap_class'  => 'social-label social-url',
					'input_class' => 'mixt-social-field network-url',
					'placeholder' => esc_html__( 'Share URL', 'mixt' ),
				),
				'icon' => array(
					'icon'        => 'el-icon-stop',
					'wrap_class'  => 'social-label social-icon',
					'input_class' => 'mixt-social-field network-icon',
					'placeholder' => esc_html__( 'Icon', 'mixt' ),
				),
				'color' => array(
					'type'        => 'color',
					'wrap_class'  => 'social-label social-color',
					'input_class' => 'mixt-social-field network-color',
				),
				'title' => array(
					'icon'        => 'el-icon-comment',
					'wrap_class'  => 'social-label social-title',
					'input_class' => 'mixt-social-field network-title',
					'placeholder' => esc_html__( 'Title', 'mixt' ),
				),
			),
			'default'  => $social_sharing_profiles,
		),
	),
);

// COMMENTS
$this->sections[] = array(
	'title'      => esc_html__( 'Comments', 'mixt' ),
	'desc'       => esc_html__( 'Configure the comments\' appearance', 'mixt' ),
	'icon'       => 'el-icon-comment',
	'subsection' => true,
	'customizer' => false,
	'fields'     => array(

		// Pagination Type
		array(
			'id'       => 'comment-pagination-type',
			'type'     => 'select',
			'title'    => esc_html__( 'Pagination', 'mixt' ),
			'subtitle' => esc_html__( 'Select a comment pagination type', 'mixt' ),
			'options'  => array(
				'classic'     => esc_html__( 'Classic', 'mixt' ),
				'numbered'    => esc_html__( 'Numbered', 'mixt' ),
				'ajax-click'  => esc_html__( 'Ajax On Click', 'mixt' ),
				'ajax-scroll' => esc_html__( 'Ajax On Scroll', 'mixt' ),
			),
			'default'  => 'numbered',
		),

		// Pagination Links Display
		array(
			'id'       => 'comment-pagination-display',
			'type'     => 'select',
			'title'    => esc_html__( 'Pagination Display', 'mixt' ),
			'subtitle' => esc_html__( 'Show pagination links at top of comments, at the bottom, or both', 'mixt' ),
			'options'  => array(
				'top'     => esc_html__( 'Top', 'mixt' ),
				'bottom'  => esc_html__( 'Bottom', 'mixt' ),
				'both'    => esc_html__( 'Both', 'mixt' ),
			),
			'default'  => 'bottom',
		),

		// Comment Before Notes
		array(
			'id'       => 'comment-notes-before',
			'type'     => 'switch',
			'title'    => esc_html__( 'Show Before Notes', 'mixt' ),
			'subtitle' => esc_html__( 'Display the notes before the comment fields for users not logged in', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => false,
		),

		// Show Logged In As
		array(
			'id'       => 'comment-logged-in',
			'type'     => 'switch',
			'title'    => esc_html__( 'Logged in as', 'mixt' ),
			'subtitle' => esc_html__( 'Display the &quot;logged in as&quot; message', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => false,
		),

		// Show Allowed Tags
		array(
			'id'       => 'comment-notes-after',
			'type'     => 'switch',
			'title'    => esc_html__( 'Allowed Tags', 'mixt' ),
			'subtitle' => esc_html__( 'Display the allowed tags in the comment form', 'mixt' ),
			'on'       => esc_html__( 'Yes', 'mixt' ),
			'off'      => esc_html__( 'No', 'mixt' ),
			'default'  => false,
		),
	),
);
