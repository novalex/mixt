<?php

$this->sections[] = array(
	'title'      => __( 'Posts', 'mixt' ),
	'desc'       => __( 'Configure the posts\' appearance', 'mixt' ),
	'icon'       => 'el-icon-pencil',
	'customizer' => false,
	'fields'     => array(

		// Sidebar
		array(
			'id'       => 'single-page-sidebar',
			'type'     => 'button_set',
			'title'    => __( 'Show Sidebar', 'mixt' ),
			'subtitle' => __( 'Display the sidebar on post pages', 'mixt' ),
			'options'  => array(
				'auto'  => __( 'Auto', 'mixt' ),
				'true'  => __( 'Yes', 'mixt' ),
				'false' => __( 'No', 'mixt' ),
			),
			'default'  => 'auto',
		),

		// Layout
		array(
			'id'       => 'post-layout',
			'type'     => 'button_set',
			'title'    => __( 'Layout', 'mixt' ),
			'subtitle' => __( 'Set the project featured media width. The content will fill the remaining space.', 'mixt' ),
			'options'  => array(
				'full'       => __( 'Full Width', 'mixt' ),
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
			'title'    => __( 'Post Info', 'mixt' ),
			'subtitle' => __( 'Display the post format and date', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => false,
		),

		// Meta Position / Display
		array(
			'id'       => 'single-meta-show',
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

		// Post Tags
		array(
			'id'       => 'post-tags',
			'type'     => 'switch',
			'title'    => __( 'Post Tags', 'mixt' ),
			'subtitle' => __( 'Show the post\'s tags', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => false,
		),

		// Post Navigation
		array(
			'id'       => 'post-navigation',
			'type'     => 'switch',
			'title'    => __( 'Post Navigation', 'mixt' ),
			'subtitle' => __( 'Display links to the previous and next posts', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => false,
		),

		// About The Author
		array(
			'id'       => 'post-about-author',
			'type'     => 'switch',
			'title'    => __( 'About The Author', 'mixt' ),
			'subtitle' => __( 'Show info about the author', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
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
			'title'    => __( 'Related Posts', 'mixt' ),
			'indent'   => true,
		),

			// Related Posts
			array(
				'id'       => 'post-related',
				'type'     => 'switch',
				'title'    => __( 'Show', 'mixt' ),
				'subtitle' => __( 'Display related posts at the bottom of the post', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
				'default'  => true,
			),

			// Related By
			array(
				'id'       => 'post-related-by',
				'type'     => 'button_set',
				'title'    => __( 'Related By', 'mixt' ),
				'subtitle' => __( 'Show posts related by tags or categories', 'mixt' ),
				'options'  => array(
					'cats' => __( 'Categories', 'mixt' ),
					'tags' => __( 'Tags', 'mixt' ),
				),
				'default'  => 'cats',
				'required' => array('post-related', '=', true),
			),

			// Related Posts Number
			array(
				'id'       => 'post-related-number',
				'type'     => 'spinner',
				'title'    => __( 'Number', 'mixt' ),
				'subtitle' => __( 'How many related posts to display', 'mixt' ),
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
				'title'    => __( 'Slider Style', 'mixt' ),
				'subtitle' => __( 'Display related posts in a slider/carousel', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
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
				'title'    => __( 'Columns', 'mixt' ),
				'subtitle' => __( 'How many columns (related posts per row) to display', 'mixt' ),
				'default'  => 3,
				'min'      => 1,
				'max'      => 6,
				'required' => array('post-related', '=', true),
			),

			// Tablet (medium screen) Columns
			array(
				'id'       => 'post-related-tablet-cols',
				'type'     => 'slider',
				'title'    => __( 'Tablet Columns', 'mixt' ),
				'subtitle' => __( 'How many columns to display on tablets / medium screens', 'mixt' ),
				'default'  => 3,
				'min'      => 1,
				'max'      => 6,
				'required' => array('post-related', '=', true),
			),

			// Mobile (small screen) Columns
			array(
				'id'       => 'post-related-mobile-cols',
				'type'     => 'slider',
				'title'    => __( 'Mobile Columns', 'mixt' ),
				'subtitle' => __( 'How many columns to display on mobiles / small screens', 'mixt' ),
				'default'  => 2,
				'min'      => 1,
				'max'      => 3,
				'required' => array('post-related', '=', true),
			),

			// Display Type
			array(
				'id'       => 'post-related-type',
				'type'     => 'button_set',
				'title'    => __( 'Type', 'mixt' ),
				'subtitle' => __( 'Display posts with media or text only', 'mixt' ),
				'options'  => array(
					'media' => __( 'Media', 'mixt' ),
					'text'  => __( 'Text', 'mixt' ),
				),
				'default'  => 'media',
				'required' => array('post-related', '=', true),
			),

			// Text Elements
			array(
				'id'       => 'post-related-elements',
				'type'     => 'checkbox',
				'title'    => __( 'Post Elements', 'mixt' ),
				'subtitle' => __( 'Select which elements to display', 'mixt' ),
				'options'  => array(
					'date'     => __( 'Date', 'mixt' ),
					'comments' => __( 'Comments', 'mixt' ),
					'excerpt'  => __( 'Excerpt', 'mixt' ),
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
				'title'    => __( 'Minimal Style', 'mixt' ),
				'subtitle' => __( 'Hide the title and shrink items on small screens', 'mixt' ),
				'on'       => __( 'Yes', 'mixt' ),
				'off'      => __( 'No', 'mixt' ),
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
				'title'          => __( 'Featured Media Placeholder', 'mixt' ),
				'subtitle'       => __( 'Select a placeholder image to show if a post does not have any featured media', 'mixt' ),
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
	'title'      => __( 'Post Meta', 'mixt' ),
	'desc'       => __( 'Configure the post meta appearance and icons', 'mixt' ),
	'icon'       => 'el-icon-tasks',
	'subsection' => true,
	'customizer' => false,
	'fields'     => array(

		// Meta Author
		array(
			'id'       => 'meta-author',
			'type'     => 'switch',
			'title'    => __( 'Author', 'mixt' ),
			'subtitle' => __( 'Display the post author', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => true,
		),

		// Meta Date
		array(
			'id'       => 'meta-date',
			'type'     => 'switch',
			'title'    => __( 'Date', 'mixt' ),
			'subtitle' => __( 'Display the post date and time', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => true,
		),

		// Meta Category
		array(
			'id'       => 'meta-category',
			'type'     => 'switch',
			'title'    => __( 'Category', 'mixt' ),
			'subtitle' => __( 'Display the post category(es)', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => true,
		),

		// Meta Comments
		array(
			'id'       => 'meta-comments',
			'type'     => 'switch',
			'title'    => __( 'Comments', 'mixt' ),
			'subtitle' => __( 'Display the comments number', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => true,
		),

		// Meta Icons
		array(
			'id'       => 'meta-icons',
			'type'     => 'switch',
			'title'    => __( 'Icons', 'mixt' ),
			'subtitle' => __( 'Display icons next to the meta', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => true,
		),

		// Meta Separator
		array(
			'id'       => 'meta-separator',
			'type'     => 'text',
			'title'    => __( 'Separator', 'mixt' ),
			'subtitle' => __( 'Character(s) for the meta separator', 'mixt' ),
		),
	),
);

// SOCIAL SHARING
$this->sections[] = array(
	'title'      => __( 'Social Sharing', 'mixt' ),
	'desc'       => __( 'Manage your social sharing profiles and add new ones', 'mixt' ),
	'icon'       => 'el-icon-retweet',
	'customizer' => false,
	'subsection' => true,
	'fields'     => array(

		// Show Share Buttons
		array(
			'id'       => 'post-sharing',
			'type'     => 'switch',
			'title'    => __( 'Show', 'mixt' ),
			'subtitle' => __( 'Display the share buttons', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => true,
		),

		// Social Icons Color On Hover
		array(
			'id'   => 'post-sharing-color',
			'type' => 'button_set',
			'title'    => __( 'Social Icons Color On Hover', 'mixt' ),
			'subtitle' => __( 'Color the icon, its background, or neither on hover', 'mixt' ),
			'options' => array(
				'icon' => __( 'Icon', 'mixt' ),
				'bg'   => __( 'Background', 'mixt' ),
				'none' => __( 'Neither', 'mixt' ),
			),
			'default' => 'bg',
		),

		// Use Bit.ly URL Shortener Service
		array(
			'id'       => 'post-sharing-short',
			'type'     => 'switch',
			'title'    => __( 'Shorten URLs', 'mixt' ),
			'subtitle' => __( 'Shorten the {link2} tag with Bit.ly', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => false,
		),

		// Bit.ly Login
		array(
			'id'          => 'short-url-login',
			'type'        => 'password',
			'title'       => __( 'Bit.ly login', 'mixt' ),
			'subtitle'    => sprintf(__( 'Your user and API key. Get them here: %s', 'mixt' ), '<a href="https://bitly.com/a/settings/advanced">Bit.ly Account</a>'),
			'username'    => true,
			'placeholder' => array(
				'username' => __( 'Enter your Username', 'mixt' ),
				'password' => __( 'Enter your API Key', 'mixt' ),
			),
			'required' => array('post-sharing-short', '=', true),
		),
		
		// Social Sharing Profiles
		array(
			'id'       => 'post-sharing-profiles',
			'type'     => 'mixt_multi_input',
			'no_title' => true,
			'add_text' => __( 'New Profile', 'mixt' ),
			'sortable' => true,
			'inputs'   => array(
				'name' => array(
					'icon'        => 'el-icon-tag',
					'wrap_class'  => 'social-label social-name',
					'input_class' => 'mixt-social-field network-name',
					'placeholder' => __( 'Name', 'mixt' ),
				),
				'url' => array(
					'icon'        => 'el-icon-globe',
					'wrap_class'  => 'social-label social-url',
					'input_class' => 'mixt-social-field network-url',
					'placeholder' => __( 'Share URL', 'mixt' ),
				),
				'icon' => array(
					'icon'        => 'el-icon-stop',
					'wrap_class'  => 'social-label social-icon',
					'input_class' => 'mixt-social-field network-icon',
					'placeholder' => __( 'Icon', 'mixt' ),
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
					'placeholder' => __( 'Title', 'mixt' ),
				),
			),
			'default'  => $social_sharing_profiles,
		),
	),
);

// COMMENTS
$this->sections[] = array(
	'title'      => __( 'Comments', 'mixt' ),
	'desc'       => __( 'Configure the comments\' appearance', 'mixt' ),
	'icon'       => 'el-icon-comment',
	'subsection' => true,
	'customizer' => false,
	'fields'     => array(

		// Pagination Type
		array(
			'id'       => 'comment-pagination-type',
			'type'     => 'select',
			'title'    => __( 'Pagination', 'mixt' ),
			'subtitle' => __( 'Select a comment pagination type', 'mixt' ),
			'options'  => array(
				'classic'     => __( 'Classic', 'mixt' ),
				'numbered'    => __( 'Numbered', 'mixt' ),
				'ajax-click'  => __( 'Ajax On Click', 'mixt' ),
				'ajax-scroll' => __( 'Ajax On Scroll', 'mixt' ),
			),
			'default'  => 'numbered',
		),

		// Pagination Links Display
		array(
			'id'       => 'comment-pagination-display',
			'type'     => 'select',
			'title'    => __( 'Pagination Display', 'mixt' ),
			'subtitle' => __( 'Show pagination links at top of comments, at the bottom, or both', 'mixt' ),
			'options'  => array(
				'top'     => __( 'Top', 'mixt' ),
				'bottom'  => __( 'Bottom', 'mixt' ),
				'both'    => __( 'Both', 'mixt' ),
			),
			'default'  => 'bottom',
		),

		// Comment Before Notes
		array(
			'id'       => 'comment-notes-before',
			'type'     => 'switch',
			'title'    => __( 'Show Before Notes', 'mixt' ),
			'subtitle' => __( 'Display the notes before the comment fields for users not logged in', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => false,
		),

		// Show Logged In As
		array(
			'id'       => 'comment-logged-in',
			'type'     => 'switch',
			'title'    => __( 'Logged in as', 'mixt' ),
			'subtitle' => __( 'Display the &quot;logged in as&quot; message', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => false,
		),

		// Show Allowed Tags
		array(
			'id'       => 'comment-notes-after',
			'type'     => 'switch',
			'title'    => __( 'Allowed Tags', 'mixt' ),
			'subtitle' => __( 'Display the allowed tags in the comment form', 'mixt' ),
			'on'       => __( 'Yes', 'mixt' ),
			'off'      => __( 'No', 'mixt' ),
			'default'  => false,
		),
	),
);
