<?php

/**
 * MIXT Redux Config
 *
 * @package MIXT
 */

if ( ! class_exists( 'Redux_MIXT_config' ) ) {

	class Redux_MIXT_config {

		public $args = array();
		public $sections = array();
		public $theme;
		public $ReduxFramework;

		public function __construct() {
			if ( ! class_exists( 'ReduxFramework' ) ) { return; }
			$this->initSettings();
		}

		public function initSettings() {

			// Just for demo purposes. Not needed per say.
			$this->theme = wp_get_theme();

			// Set the default arguments
			$this->setArguments();

			// Set a few help tabs so you can see how it's done
			$this->setHelpTabs();

			// Create the sections and fields
			$this->setSections();

			if ( ! isset( $this->args['opt_name'] ) ) { // No errors please
				return;
			}

			// If Redux is running as a plugin, this will remove the demo notice and links
			add_action( 'redux/loaded', array( $this, 'remove_demo' ) );

			$this->ReduxFramework = new ReduxFramework( $this->sections, $this->args );
		}

		// Remove the demo link and the notice of integrated demo from the redux-framework plugin
		function remove_demo() {

			// Used to hide the demo mode link from the plugin page. Only used when Redux is a plugin.
			if ( class_exists( 'ReduxFrameworkPlugin' ) ) {
				remove_filter( 'plugin_row_meta', array(
					ReduxFrameworkPlugin::instance(),
					'plugin_metalinks'
				), null, 2 );

				// Used to hide the activation notice informing users of the demo panel. Only used when Redux is a plugin.
				remove_action( 'admin_notices', array( ReduxFrameworkPlugin::instance(), 'admin_notices' ) );
			}
		}

		public function setSections() {

			// GET ASSETS

			$page_loader_anims = array(
				'none' => 'No Animation',
			);
			$css_loop_anims = mixt_css_anims('loops');
			$page_loader_anims = array_merge($page_loader_anims, $css_loop_anims);

			// Themes
			$themes_enabled = (bool) get_option('mixt-themes-enabled');
			if ( $themes_enabled ) {
				$site_themes = mixt_get_themes('site', 'all');
				$nav_themes = mixt_get_themes('nav', 'all');
			} else {
				$site_themes = mixt_get_themes('site', 'default');
				$nav_themes = mixt_get_themes('nav', 'default');
			}
			$nav_themes = array_merge( array('auto' => __( 'Auto', 'mixt')), $nav_themes );
			$footer_themes = array_merge( array('auto' => __( 'Auto', 'mixt' )), $site_themes );

			// Image Patterns
			$img_patterns = mixt_get_images('patterns');

			// Image Textures
			$img_textures = mixt_get_images('textures');

			// Social Networks
			$social_profiles = get_option('mixt-social-profiles', array());
			$social_sharing_profiles = get_option('mixt-sharing-profiles', array());
			$social_profile_names = $social_sharing_profile_names = array();
			foreach ( $social_profiles as $key => $profile ) { $social_profile_names[$key] = $profile['name']; }
			foreach ( $social_sharing_profiles as $key => $profile ) { $social_sharing_profile_names[$key] = $profile['name']; }

			// HTML Allowed in textareas
			$text_allowed_html = array(
				'a'   => array(
					'href'  => array(),
					'title' => array(),
					'class' => array(),
				),
				'i'      => array( 'class' => array() ),
				'span'   => array( 'class' => array() ),
				'strong' => array( 'class' => array() ),
				'em'     => array( 'class' => array() ),
			);
			// Textarea code field placeholder
			$text_code_placeholder = __( 'Allowed HTML tags and attributes:', 'mixt' ) . ' <a href="" title="">, <i>, <span>, <strong>, <em>';

			// Sidebars
			$available_sidebars = array(
				'sidebar-1' => __( 'Default', 'mixt' ),
			);
			$custom_sidebars = get_option('mixt-sidebars');
			if ( $custom_sidebars ) {
				foreach ( $custom_sidebars as $sidebar ) { $available_sidebars[$sidebar['id']] = $sidebar['name']; }
			}


			// Output Fields Array For Posts Pages
			function postsPageFields( $type, $icon = 'check-empty', $defaults = array() ) {
				if ( empty($type) ) return;

				$preset_defaults = array(
					'fullwidth' => 'auto',
					'sidebar'   => 'auto',
					'inherit'   => false,
					'type'      => 'standard',
					'columns'   => '3',
					'feat-show' => true,
					'feat-size' => 'blog-small',
					'post-info' => true,
					'meta-show' => 'header',
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
						),

						// Inherit Blog Settings
						array(
							'id'       => $type.'-page-inherit',
							'type'     => 'switch',
							'title'    => __( 'Inherit Blog Layout', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => $defaults['inherit'],
						),

						// Layout Type
						array(
							'id'       => $type.'-page-type',
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
							'id'       => $type.'-page-columns',
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
								array($type.'-page-type', '!=', 'standard'),
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
								array($type.'-page-type', '=', 'standard'),
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
					),
				);

				return $fields;
			}


			// DECLARATION OF SECTIONS

			// GLOBAL OPTIONS SECTION
			$this->sections[] = array(
				'title'      => __( 'Global Options', 'mixt' ),
				'desc'       => __( 'Customize the site\'s global options and settings', 'mixt' ),
				'icon'       => 'el-icon-off',
				'customizer' => false,
				'fields'     => array(

					// Site Layout
					array(
						'id'       => 'site-layout',
						'type'     => 'button_set',
						'title'    => __( 'Site Layout', 'mixt' ),
						'subtitle' => __( 'Choose the layout for the site', 'mixt' ),
						'options'  => array(
							'wide'  => __( 'Wide', 'mixt' ),
							'boxed' => __( 'Boxed', 'mixt' ),
						),
						'default'  => 'wide',
					),

					// Boxed layout & vertical nav notification
					array(
						'id'       => 'site-layout-warn',
						'type'     => 'info',
						'style'    => 'warning',
						'subtitle' => __( 'The site layout cannot be boxed while the navbar is vertical. Wide layout will be used instead.', 'mixt' ),
						'required' => array(
							array('site-layout', '=', 'boxed'),
							array('nav-layout', '=', 'vertical'),
						),
					),

					// Site Background Color
					array(
						'id'          => 'site-bg-color',
						'type'        => 'color',
						'title'       => __( 'Background Color', 'mixt' ),
						'subtitle'    => __( 'Select the site background color', 'mixt' ),
						'transparent' => false,
						'default'     => '#fff',
						'validate'    => 'color',
						'required'    => array('site-layout', '=', 'boxed'),
					),

					// Site Background
					array(
						'id'       => 'site-bg',
						'type'     => 'background',
						'title'    => __( 'Site Background', 'mixt' ),
						'subtitle' => __( 'Choose an image and other options for the site background', 'mixt' ),
						'default'  => array(
							'background-attachment' => 'fixed',
							'background-size'       => 'cover',
							'background-repeat'     => 'no-repeat',
							'background-position'   => 'center top',
						),
						'required' => array('site-layout', '=', 'boxed'),
						'background-color' => false,
					),

					// Site Background Pattern
					array(
						'id'       => 'site-bg-pat',
						'type'     => 'mixt_image_select',
						'title'    => __( 'Background Pattern', 'mixt' ),
						'subtitle' => __( 'Choose a pattern for the site background', 'mixt' ),
						'options'  => $img_patterns,
						'empty'    => true,
						'default'  => '',
						'required' => array('site-layout', '=', 'boxed'),
					),

					// Site-Wide Theme Select
					array(
						'id'       => 'site-theme',
						'type'     => 'select',
						'title'    => __( 'Site Theme', 'mixt' ),
						'subtitle' => __( 'Select the theme to be used site-wide', 'mixt' ),
						'options'  => $site_themes,
						'default'  => MIXT_THEME,
					),

					// Site Width
					array(
						'id'       => 'site-width',
						'type'     => 'text',
						'title'    => __( 'Site Width', 'mixt' ),
						'subtitle' => __( 'Set a custom site width, e.g. \'1140px\' or \'100%\'', 'mixt' ),
					),

					// Responsive Layout
					array(
						'id'       => 'site-responsive',
						'type'     => 'switch',
						'title'    => __( 'Responsive Layout', 'mixt' ),
						'subtitle' => __( 'Enable responsive features for the best experience on all screen sizes', 'mixt' ),
						'on'       => __( 'Yes', 'mixt' ),
						'off'      => __( 'No', 'mixt' ),
						'default'  => true,
					),

					// Header Code
					array(
						'id'       => 'head-user-code',
						'type'     => 'ace_editor',
						'title'    => __( 'Head Code', 'mixt' ),
						'subtitle' => __( 'Add custom code before the closing &lt;head&gt; tag', 'mixt' ),
						'mode'     => 'html',
						'theme'    => 'chrome',
					),

					// Divider
					array(
						'id'   => 'global-divider-1',
						'type' => 'divide',
					),

					// PAGE LOADER SECTION
					array(
						'id'       => 'page-loader-section',
						'type'     => 'section',
						'title'    => __( 'Page Loader', 'mixt' ),
						'subtitle' => __( 'Settings for the page (pre)loader', 'mixt' ),
						'indent'   => true,
					),

						// Page Loader
						array(
							'id'       => 'page-loader',
							'type'     => 'switch',
							'title'    => __( 'Page Loader', 'mixt' ),
							'subtitle' => __( 'Enable page loader to show animations when loading site', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => false,
						),

						// Page Loader Type
						array(
							'id'       => 'page-loader-type',
							'type'     => 'button_set',
							'title'    => __( 'Loader Type', 'mixt' ),
							'subtitle' => __( 'Use a shape or image for the loader', 'mixt' ),
							'options'  => array(
								'1' => __( 'Shape', 'mixt' ),
								'2' => __( 'Image', 'mixt' ),
							),
							'default'  => '1',
							'required' => array('page-loader', '=', true),
						),

						// Page Loader Shape Select
						array(
							'id'       => 'page-loader-shape',
							'type'     => 'select',
							'title'    => __( 'Loader Shape', 'mixt' ),
							'subtitle' => __( 'Shape to use for the loader', 'mixt' ),
							'options'  => array(
								'circle'  => __( 'Circle', 'mixt' ),
								'ring'    => __( 'Ring', 'mixt' ),
								'square'  => __( 'Square', 'mixt' ),
								'square2' => __( 'Empty Square', 'mixt' ),
							),
							'default'  => 'ring',
							'required' => array('page-loader-type', '=', '1'),
						),

						// Page Loader Shape Color Select
						array(
							'id'          => 'page-loader-color',
							'type'        => 'color',
							'title'       => __( 'Loader Shape Color', 'mixt' ),
							'subtitle'    => __( 'Select a loader shape color', 'mixt' ),
							'transparent' => false,
							'default'     => '#333333',
							'validate'    => 'color',
							'required'    => array('page-loader-type', '=', '1'),
						),

						// Page Loader Image Select
						array(
							'id'       => 'page-loader-img',
							'type'     => 'media',
							'url'      => false,
							'title'    => __( 'Loader Image', 'mixt' ),
							'subtitle' => __( 'Image to use for the loader', 'mixt' ),
							'required' => array('page-loader-type', '=', '2'),
						),

						// Page Loader Background Color Select
						array(
							'id'          => 'page-loader-bg',
							'type'        => 'color',
							'title'       => __( 'Loader Background Color', 'mixt' ),
							'subtitle'    => __( 'The page loader background color', 'mixt' ),
							'transparent' => false,
							'default'     => '#ffffff',
							'validate'    => 'color',
							'required'    => array('page-loader', '=', true),
						),

						// Page Loader Animation Select
						array(
							'id'       => 'page-loader-anim',
							'type'     => 'select',
							'title'    => __( 'Loader Animation', 'mixt' ),
							'subtitle' => __( 'Animation to use for the loader', 'mixt' ),
							'options'  => $page_loader_anims,
							'default'  => 'pulsate',
							'required' => array('page-loader', '=', true),
						),

					// Divider
					array(
						'id'   => 'global-divider-2',
						'type' => 'divide',
					),

					// MODULES SECTION
					array(
						'id'       => 'modules-section',
						'type'     => 'section',
						'title'    => __( 'Modules', 'mixt' ),
						'subtitle' => __( 'Configure which modules &amp; plugins to load', 'mixt' ),
						'indent'   => true,
					),

						// Icon Fonts
						array(
							'id'       => 'icon-fonts',
							'type'     => 'checkbox',
							'title'    => __( 'Icon Font Sets', 'mixt' ),
							'subtitle' => __( 'Select which icon font sets you want to use.', 'mixt' ),
							'options'  => array(
								'fontawesome' => __( 'Font Awesome', 'mixt' ),
								'linecons'    => __( 'Linecons', 'mixt' ),
							),
							'default'  => array(
								'fontawesome' => '1',
							),
						),

						// Themes Master Switch
						array(
							'id'       => 'themes-master',
							'type'     => 'switch',
							'title'    => __( 'Enable Themes', 'mixt' ),
							'subtitle' => __( 'Add theme sections and management. Disable if customizing themes in CSS directly.', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => true,
						),

						// Page Metaboxes
						array(
							'id'       => 'page-metaboxes',
							'type'     => 'switch',
							'title'    => __( 'Page Option Metaboxes', 'mixt' ),
							'subtitle' => __( 'Enable option metaboxes when editing pages or posts', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => true,
						),

						// BrowserSync Script
						array(
							'id'       => 'bsync-script',
							'type'     => 'switch',
							'title'    => __( 'BrowserSync Script', 'mixt' ),
							'subtitle' => __( 'Add BrowserSync script in the footer (only for logged in admins)', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => false,
						),
				),
			);


			// HEADER SECTION
			$this->sections[] = array(
				'title'      => __( 'Header', 'mixt' ),
				'desc'       => __( 'Customize the site header', 'mixt' ),
				'icon'       => 'el-icon-screen',
				'customizer' => false,
				'fields'     => array(

					// HEAD MEDIA SECTION
					array(
						'id'       => 'head-media-section',
						'type'     => 'section',
						'title'    => __( 'Header Media', 'mixt' ),
						'subtitle' => __( 'Configure the header media element and its appearance', 'mixt' ),
						'indent'   => true,
					),

						// Enable
						array(
							'id'       => 'head-media',
							'type'     => 'switch',
							'title'    => __( 'Enabled', 'mixt' ),
							'subtitle' => __( 'Display the header media element on all pages where possible', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => false,
						),

						// Fullscreen
						array(
							'id'       => 'head-fullscreen',
							'type'     => 'switch',
							'title'    => __( 'Fullscreen', 'mixt' ),
							'subtitle' => __( 'Header fills entire screen size', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => false,
						),

						// Height
						array(
							'id'       => 'head-height',
							'type'     => 'text',
							'title'    => __( 'Custom Height', 'mixt' ),
							'subtitle' => __( 'Set a custom height (in px) for the header', 'mixt' ),
						),

						// Background Color
						array(
							'id'       => 'head-bg-color',
							'type'     => 'color',
							'title'    => __( 'Background Color', 'mixt' ),
							'subtitle' => __( 'Select a background color for the header', 'mixt' ),
							'transparent' => false,
							'validate' => 'color',
							'default'  => '',
						),

						// Text Color
						array(
							'id'       => 'head-text-color',
							'type'     => 'color',
							'title'    => __( 'Text Color', 'mixt' ),
							'subtitle' => __( 'The color for text on light backgrounds', 'mixt' ),
							'transparent' => false,
							'validate' => 'color',
							'default'  => '',
						),

						// Background Color
						array(
							'id'       => 'head-inv-text-color',
							'type'     => 'color',
							'title'    => __( 'Inverse Text Color', 'mixt' ),
							'subtitle' => __( 'The color for text on dark backgrounds', 'mixt' ),
							'transparent' => false,
							'validate' => 'color',
							'default'  => '',
						),

						// Media Type
						array(
							'id'       => 'head-media-type',
							'type'     => 'button_set',
							'title'    => __( 'Media Type', 'mixt' ),
							'subtitle' => __( 'Type of media to use in the header', 'mixt' ),
							'options'  => array(
								'color'  => __( 'Solid Color', 'mixt' ),
								'image'  => __( 'Image', 'mixt' ),
								'video'  => __( 'Video', 'mixt' ),
								'slider' => __( 'Slider', 'mixt' ),
							),
							'default'  => 'color',
						),

						// Image Placeholder
						array(
							'id'             => 'head-img-ph',
							'type'           => 'media',
							'title'          => __( 'Image Placeholder', 'mixt' ),
							'subtitle'       => __( 'Select a placeholder image to show if the desired image can\'t be found', 'mixt' ),
							'mode'           => 'jpg, jpeg, png',
							'library_filter' => array('jpg', 'jpeg', 'png'),
							'required'       => array('head-media-type', '=', 'image'),
						),

						// Image Source
						array(
							'id'       => 'head-img-src',
							'type'     => 'button_set',
							'title'    => __( 'Image Source', 'mixt' ),
							'subtitle' => __( 'Select an image or use the featured one', 'mixt' ),
							'options'  => array(
								'gallery' => __( 'Gallery', 'mixt' ),
								'feat'    => __( 'Featured', 'mixt' ),
							),
							'default'  => 'gallery',
							'required' => array('head-media-type', '=', 'image'),
						),

						// Image Select
						array(
							'id'       => 'head-img',
							'type'     => 'media',
							'title'    => __( 'Select Image', 'mixt' ),
							'subtitle' => __( 'Select an image from the gallery or upload one', 'mixt' ),
							'required' => array('head-img-src', '=', 'gallery'),
						),

						// Repeat / Pattern Image
						array(
							'id'       => 'head-img-repeat',
							'type'     => 'switch',
							'title'    => __( 'Repeat / Pattern Image', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => true,
							'required' => array('head-media-type', '=', 'image'),
						),

						// Parallax Effect
						array(
							'id'       => 'head-img-parallax',
							'type'     => 'switch',
							'title'    => __( 'Parallax Effect', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => false,
							'required' => array('head-media-type', '=', 'image'),
						),

						// Video Source
						array(
							'id'       => 'head-video-src',
							'type'     => 'button_set',
							'title'    => __( 'Video Source', 'mixt' ),
							'subtitle' => __( 'Use an embedded video or a hosted one', 'mixt' ),
							'options'  => array(
								'embed' => __( 'Embedded', 'mixt' ),
								'local' => __( 'Hosted', 'mixt' ),
							),
							'default'  => 'embed',
							'required' => array('head-media-type', '=', 'video'),
						),

						// Video Embed Code
						array(
							'id'       => 'head-video-embed',
							'type'     => 'textarea',
							'title'    => __( 'Video Embed Code', 'mixt' ),
							'subtitle' => __( 'The embed code for the video you want to use', 'mixt' ),
							'validate' => 'html_custom',
							'allowed_html' => array( 
								'iframe' => array(
									'src'             => array(),
									'width'           => array(),
									'height'          => array(),
									'frameborder'     => array(),
									'allowfullscreen' => array(),
								),
							),
							'required' => array('head-video-src', '=', 'embed'),
						),

						// Video Select
						array(
							'id'             => 'head-video',
							'type'           => 'media',
							'title'          => __( 'Video', 'mixt' ),
							'subtitle'       => __( 'Select a video from the gallery or upload one', 'mixt' ),
							'mode'           => 'webm, mp4, ogg',
							'library_filter' => array('webm', 'mp4', 'ogg'),
							'placeholder'    => __( 'No video selected', 'mixt' ),
							'required'       => array('head-video-src', '=', 'local'),
						),

						// Video Fallback Select
						array(
							'id'             => 'head-video-2',
							'type'           => 'media',
							'title'          => __( 'Video Fallback', 'mixt' ),
							'subtitle'       => __( 'Select a fallback video from the gallery or upload one', 'mixt' ),
							'mode'           => 'webm, mp4, ogg',
							'library_filter' => array('webm', 'mp4', 'ogg'),
							'placeholder'    => __( 'No video selected', 'mixt' ),
							'required'       => array('head-video-src', '=', 'local'),
						),

						// Video Poster
						array(
							'id'             => 'head-video-poster',
							'type'           => 'media',
							'title'          => __( 'Video Poster', 'mixt' ),
							'subtitle'       => __( 'Select an image to show while the video loads or if video is not supported', 'mixt' ),
							'mode'           => 'jpg, jpeg, png',
							'library_filter' => array('jpg', 'jpeg', 'png'),
							'required'       => array('head-video-src', '=', 'local'),
						),

						// Video Loop
						array(
							'id'       => 'head-video-loop',
							'type'     => 'switch',
							'title'    => __( 'Video Loop', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => true,
							'required' => array('head-video-src', '=', 'local'),
						),

						// Video Luminance
						array(
							'id'       => 'head-video-lum',
							'type'     => 'button_set',
							'title'    => __( 'Video Luminance', 'mixt' ),
							'subtitle' => __( 'Header text color will be adjusted based on this', 'mixt' ),
							'options'  => array(
								'light' => __( 'Light', 'mixt' ),
								'dark'  => __( 'Dark', 'mixt' ),
							),
							'default'  => 'light',
							'required' => array('head-media-type', '=', 'video'),
						),

						// Slider ID
						array(
							'id'       => 'head-slider',
							'type'     => 'text',
							'title'    => __( 'Slider ID', 'mixt' ),
							'subtitle' => __( 'The ID number or slug of the slider to use', 'mixt' ),
							'required' => array('head-media-type', '=', 'slider'),
						),

						// Content Align
						array(
							'id'      => 'head-content-align',
							'type'    => 'button_set',
							'title'   => __( 'Content Align', 'mixt' ),
							'options' => array(
								'left'   => __( 'Left', 'mixt' ),
								'center' => __( 'Center', 'mixt' ),
								'right'  => __( 'Right', 'mixt' ),
							),
							'default' => 'left',
						),

						// Content Size
						array(
							'id'      => 'head-content-size',
							'type'    => 'button_set',
							'title'   => __( 'Content Size', 'mixt' ),
							'options' => array(
								'normal'    => __( 'Normal', 'mixt' ),
								'fullwidth' => __( 'Full Width', 'mixt' ),
								'cover'     => __( 'Cover', 'mixt' ),
							),
							'default' => 'normal',
						),

						// Content Fade Effect
						array(
							'id'      => 'head-content-fade',
							'type'    => 'switch',
							'title'   => __( 'Content Fade Effect', 'mixt' ),
							'on'      => __( 'Yes', 'mixt' ),
							'off'     => __( 'No', 'mixt' ),
							'default' => false,
						),

						// Scroll To Content
						array(
							'id'       => 'head-content-scroll',
							'type'     => 'switch',
							'title'    => __( 'Scroll To Content', 'mixt' ),
							'subtitle' => __( 'Show an arrow that scrolls down to the page content when clicked', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => false,
						),

						// Scroll To Content Icon
						array(
							'id'       => 'head-content-scroll-icon',
							'type'     => 'text',
							'title'    => __( 'Scroll To Content Icon', 'mixt' ),
							'default'  => 'fa fa-chevron-down',
							'required' => array('head-content-scroll', '=', true),
						),

						// Post Info
						array(
							'id'       => 'head-content-info',
							'type'     => 'switch',
							'title'    => __( 'Post Info', 'mixt' ),
							'subtitle' => __( 'Show the post title and meta in the header', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => false,
						),

						// Custom Code
						array(
							'id'       => 'head-content-code',
							'type'     => 'switch',
							'title'    => __( 'Custom Code', 'mixt' ),
							'subtitle' => __( 'Output custom code in the header (can use shortcodes)', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => false,
						),

						// Custom Code Field
						array(
							'id'      => 'head-code',
							'type'    => 'editor',
							'title'   => __( 'Custom Code Content', 'mixt' ),
							'args' => array(
								'teeny'         => false,
								'wpautop'       => false,
								'media_buttons' => false,
								'textarea_rows' => '4',
							),
							'required' => array('head-content-code', '=', true),
						),

					// Divider
					array(
						'id'   => 'global-divider',
						'type' => 'divide',
					),

					// LOCATION BAR SECTION
					array(
						'id'       => 'loc-bar-section',
						'type'     => 'section',
						'title'    => __( 'Location Bar', 'mixt' ),
						'subtitle' => __( 'Configure the location bar and its appearance', 'mixt' ),
						'indent'   => true,
					),

						// On/Off Switch
						array(
							'id'       => 'location-bar',
							'type'     => 'switch',
							'title'    => __( 'Location Bar', 'mixt' ),
							'subtitle' => __( 'Display the location bar', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => true,
						),

						// Background Color
						array(
							'id'       => 'loc-bar-bg-color',
							'type'     => 'color',
							'title'    => __( 'Background Color', 'mixt' ),
							'transparent' => false,
							'validate' => 'color',
							'required' => array('location-bar', '=', true),
						),

						// Background Pattern
						array(
							'id'       => 'loc-bar-bg-pat',
							'type'     => 'mixt_image_select',
							'title'    => __( 'Background Pattern', 'mixt' ),
							'options'  => $img_patterns,
							'empty'    => true,
							'default'  => '',
							'required' => array('location-bar', '=', true),
						),

						// Text Color
						array(
							'id'       => 'loc-bar-text-color',
							'type'     => 'color',
							'title'    => __( 'Text Color', 'mixt' ),
							'transparent' => false,
							'validate' => 'color',
							'required' => array('location-bar', '=', true),
						),

						// Border Color
						array(
							'id'       => 'loc-bar-border-color',
							'type'     => 'color',
							'title'    => __( 'Border Color', 'mixt' ),
							'transparent' => false,
							'validate' => 'color',
							'required' => array('location-bar', '=', true),
						),

						// Left Side Content
						array(
							'id'       => 'loc-bar-left-content',
							'type'     => 'select',
							'title'    => __( 'Left Side Content', 'mixt' ),
							'subtitle' => __( 'Content to show on the left side of the bar', 'mixt' ),
							'options'  => array(
								'0' => __( 'No Content', 'mixt' ),
								'1' => __( 'Title', 'mixt' ),
								'2' => __( 'Breadcrumbs', 'mixt' ),
							),
							'default'  => '1',
							'required' => array('location-bar', '=', true),
						),

						// Right Side Content
						array(
							'id'       => 'loc-bar-right-content',
							'type'     => 'select',
							'title'    => __( 'Right Side Content', 'mixt' ),
							'subtitle' => __( 'Content to show on the right side of the bar', 'mixt' ),
							'options'  => array(
								'0' => __( 'No Content', 'mixt' ),
								'1' => __( 'Title', 'mixt' ),
								'2' => __( 'Breadcrumbs', 'mixt' ),
							),
							'default'  => '2',
							'required' => array('location-bar', '=', true),
						),

						// Breadcrumbs Prefix
						array(
							'id'       => 'breadcrumbs-prefix',
							'type'     => 'text',
							'title'    => __( 'Breadcrumbs Prefix', 'mixt' ),
							'subtitle' => __( 'Text to display before the breadcrumbs', 'mixt' ),
							'required' => array('location-bar', '=', true),
						),
				),
			);


			// LOGO SECTION
			$this->sections[] = array(
				'title'      => __( 'Logo', 'mixt' ),
				'icon'       => 'el-icon-globe',
				'fields'     => array(

					// Type
					array(
						'id'       => 'logo-type',
						'type'     => 'button_set',
						'title'    => __( 'Type', 'mixt' ),
						'subtitle' => __( 'Display text or an image as the logo', 'mixt' ),
						'options'  => array(
							'img'  => __( 'Image', 'mixt' ),
							'text' => __( 'Text', 'mixt' ),
						),
						'default'  => 'text',
					),

					// Image Select
					array(
						'id'       => 'logo-img',
						'type'     => 'media',
						'url'      => false,
						'title'    => __( 'Image', 'mixt' ),
						'subtitle' => __( 'Select the image you want to use as the site\'s logo', 'mixt' ),
						'required' => array('logo-type', '=', 'img'),
					),

					// Inverse Image Select
					array(
						'id'       => 'logo-img-inv',
						'type'     => 'media',
						'url'      => false,
						'title'    => __( 'Inverse Image', 'mixt' ),
						'subtitle' => __( 'Select an inverse logo image for dark backgrounds', 'mixt' ),
						'required' => array('logo-type', '=', 'img'),
					),

					// Hi-Res
					array(
						'id'       => 'logo-img-hr',
						'type'     => 'switch',
						'title'    => __( 'Hi-Res', 'mixt' ),
						'subtitle' => __( 'Scale down logo to half size so it will look sharp on high-resolution screens like Retina', 'mixt' ),
						'on'       => __( 'Yes', 'mixt' ),
						'off'      => __( 'No', 'mixt' ),
						'default'  => true,
						'required' => array('logo-type', '=', 'img'),
					),

					// Text Field
					array(
						'id'       => 'logo-text',
						'type'     => 'text',
						'title'    => __( 'Text', 'mixt' ),
						'subtitle' => __( 'Enter the logo text (leave empty to use the site name)', 'mixt' ),
						'required' => array('logo-type', '=', 'text'),
					),

					// Text Style
					array(
						'id'             => 'logo-text-typo',
						'type'           => 'typography',
						'title'          => __( 'Text Style', 'mixt' ),
						'subtitle'       => __( 'Set up how you want your text logo to look', 'mixt' ),
						'color'          => false,
						'google'         => true,
						'font-backup'    => true,
						'line-height'    => false,
						'text-align'     => false,
						'text-transform' => true,
						'units'          => 'px',
						'default'        => array(
							'google' => false,
						),
						'required'       => array('logo-type', '=', 'text'),
					),

					// Text Color
					array(
						'id'       => 'logo-text-color',
						'type'     => 'color',
						'title'    => __( 'Text Color', 'mixt' ),
						'subtitle' => __( 'Select a logo text color', 'mixt' ),
						'transparent' => false,
						'validate' => 'color',
						'default'  => '#333',
						'required' => array('logo-type', '=', 'text'),
					),

					// Text Inverse Color
					array(
						'id'       => 'logo-text-inv',
						'type'     => 'color',
						'title'    => __( 'Text Inverse Color', 'mixt' ),
						'subtitle' => __( 'Select a logo text color for dark backgrounds', 'mixt' ),
						'transparent' => false,
						'validate' => 'color',
						'default'  => '#fff',
						'required' => array('logo-type', '=', 'text'),
					),

					// Shrink
					array(
						'id'       => 'logo-shrink',
						'type'     => 'spinner',
						'title'    => __( 'Shrink', 'mixt' ),
						'subtitle' => __( 'Amount of pixels the logo will shrink when the navbar becomes fixed <br>(0 means no shrink)', 'mixt' ),
						'max'      => '20',
						'step'     => '1',
						'default'  => '6',
					),

					// Tagline
					array(
						'id'       => 'logo-show-tagline',
						'type'     => 'switch',
						'title'    => __( 'Tagline', 'mixt' ),
						'subtitle' => __( 'Show the site\'s tagline (or a custom one) next to the logo', 'mixt' ),
						'on'       => __( 'Yes', 'mixt' ),
						'off'      => __( 'No', 'mixt' ),
						'default'  => false,
					),

					// Tagline Text
					array(
						'id'       => 'logo-tagline',
						'type'     => 'text',
						'title'    => __( 'Tagline Text', 'mixt' ),
						'subtitle' => __( 'Enter the tagline text (leave empty to use the site tagline)', 'mixt' ),
						'required' => array('logo-show-tagline', '=', true),
					),

					// Tagline Style
					array(
						'id'             => 'logo-tagline-typo',
						'type'           => 'typography',
						'title'          => __( 'Tagline Style', 'mixt' ),
						'color'          => false,
						'google'         => true,
						'font-backup'    => true,
						'line-height'    => false,
						'text-align'     => false,
						'text-transform' => true,
						'units'          => 'px',
						'default'        => array(
							'google' => false,
						),
						'required'       => array('logo-show-tagline', '=', true),
					),

					// Tagline Color
					array(
						'id'       => 'logo-tagline-color',
						'type'     => 'color',
						'title'    => __( 'Tagline Color', 'mixt' ),
						'subtitle' => __( 'Select a tagline text color', 'mixt' ),
						'transparent' => false,
						'validate' => 'color',
						'default'  => '#333',
						'required' => array('logo-show-tagline', '=', true),
					),

					// Tagline Inverse Color
					array(
						'id'       => 'logo-tagline-inv',
						'type'     => 'color',
						'title'    => __( 'Tagline Inverse Color', 'mixt' ),
						'subtitle' => __( 'Select a tagline text color for dark backgrounds', 'mixt' ),
						'transparent' => false,
						'validate' => 'color',
						'default'  => '#fff',
						'required' => array('logo-show-tagline', '=', true),
					),
				),
			);


			// NAVBARS SECTION
			$this->sections[] = array(
				'title'      => __( 'Navbars', 'mixt' ),
				'desc'       => __( 'Customize the primary and secondary navbars', 'mixt' ),
				'icon'       => 'el-icon-minus',
				'customizer' => false,
				'fields'     => array(
					
					// Navbar Icons
					array(
						'id'       => 'nav-menu-icons',
						'type'     => 'switch',
						'title'    => __( 'Menu Icons', 'mixt' ),
						'subtitle' => __( 'Enable icons for menu items', 'mixt' ),
						'on'       => __( 'Yes', 'mixt' ),
						'off'      => __( 'No', 'mixt' ),
						'default'  => true,
					),

					// Navbar Dropdown Arrows
					array(
						'id'       => 'nav-menu-arrows',
						'type'     => 'switch',
						'title'    => __( 'Menu Dropdown Arrows', 'mixt' ),
						'subtitle' => __( 'Enable arrows for menu items with dropdowns', 'mixt' ),
						'on'       => __( 'Yes', 'mixt' ),
						'off'      => __( 'No', 'mixt' ),
						'default'  => true,
					),

					// Divider
					array(
						'id'   => 'navbar-divider',
						'type' => 'divide',
					),

					// PRIMARY NAVBAR SECTION
					array(
						'id'       => 'primary-nav-section',
						'type'     => 'section',
						'title'    => __( 'Primary Navbar', 'mixt' ),
						'subtitle' => __( 'Settings for the primary navbar', 'mixt' ),
						'indent'   => true,
					),

						// Layout
						array(
							'id'       => 'nav-layout',
							'type'     => 'button_set',
							'title'    => __( 'Layout', 'mixt' ),
							'subtitle' => __( 'Set the navbar layout (orientation)', 'mixt' ),
							'options'  => array(
								'horizontal' => __( 'Horizontal', 'mixt' ),
								'vertical'   => __( 'Vertical', 'mixt' ),
							),
							'default'  => 'horizontal',
						),

						// Vertical Position
						array(
							'id'       => 'nav-vertical-position',
							'type'     => 'button_set',
							'title'    => __( 'Position', 'mixt' ),
							'subtitle' => __( 'Position the navbar to the left or right of the page', 'mixt' ),
							'options'  => array(
								'left'  => __( 'Left', 'mixt' ),
								'right' => __( 'Right', 'mixt' ),
							),
							'default'  => 'left',
							'required' => array('nav-layout', '=', 'vertical'),
						),

						// Vertical Width
						array(
							'id'       => 'nav-vertical-width',
							'type'     => 'text',
							'title'    => __( 'Width', 'mixt' ),
							'subtitle' => __( 'Set a custom navbar width, e.g. \'150px\' or \'20%\'', 'mixt' ),
							'required' => array('nav-layout', '=', 'vertical'),
						),

						// Small Vertical Width
						array(
							'id'       => 'nav-vertical-width-sm',
							'type'     => 'text',
							'title'    => __( 'Small Width', 'mixt' ),
							'subtitle' => __( 'Set a custom navbar width for smaller screens, e.g. \'150px\' or \'20%\'', 'mixt' ),
							'required' => array('nav-layout', '=', 'vertical'),
						),

						// Vertical Mode
						array(
							'id'       => 'nav-vertical-mode',
							'type'     => 'button_set',
							'title'    => __( 'Mode', 'mixt' ),
							'subtitle' => __( 'Navbar fixed (scrolls with page) or static (stays at the top)', 'mixt' ),
							'options'  => array(
								'fixed'  => __( 'Fixed', 'mixt' ),
								'static' => __( 'Static', 'mixt' ),
							),
							'default'  => 'fixed',
							'required' => array('nav-layout', '=', 'vertical'),
						),

						// Logo Alignment
						array(
							'id'       => 'logo-align',
							'type'     => 'button_set',
							'title'    => __( 'Logo Alignment', 'mixt' ),
							'subtitle' => __( 'Where the logo will be displayed in the navbar', 'mixt' ),
							'options'  => array(
								'1' => __( 'Left', 'mixt' ),
								'2' => __( 'Center', 'mixt' ),
								'3' => __( 'Right', 'mixt' ),
							),
							'default'  => '1',
						),

						// Mode
						array(
							'id'       => 'nav-mode',
							'type'     => 'button_set',
							'title'    => __( 'Mode', 'mixt' ),
							'subtitle' => __( 'Navbar fixed (scrolls with page) or static (stays at the top)', 'mixt' ),
							'options'  => array(
								'fixed'  => __( 'Fixed', 'mixt' ),
								'static' => __( 'Static', 'mixt' ),
							),
							'default'  => 'fixed',
							'required' => array('nav-layout', '=', 'horizontal'),
						),

						// Theme Select
						array(
							'id'       => 'nav-theme',
							'type'     => 'select',
							'title'    => __( 'Theme', 'mixt' ),
							'subtitle' => __( 'Select the theme for the primary navbar', 'mixt' ),
							'options'  => $nav_themes,
							'default'  => 'auto',
						),

						// Texture
						array(
							'id'       => 'nav-texture',
							'type'     => 'mixt_image_select',
							'title'    => __( 'Texture', 'mixt' ),
							'subtitle' => __( 'Texture the navbar', 'mixt' ),
							'options'  => $img_textures,
							'default'  => '',
							'empty'    => true,
						),

						// Padding
						array(
							'id'       => 'nav-padding',
							'type'     => 'slider',
							'title'    => __( 'Padding', 'mixt' ),
							'subtitle' => __( 'Set the navbar\'s padding (in px) when at the top', 'mixt' ),
							'default'  => 20,
							'min'      => 0,
							'max'      => 50,
							'required' => array('nav-layout', '=', 'horizontal'),
						),

						// Fixed Padding
						array(
							'id'       => 'nav-fixed-padding',
							'type'     => 'slider',
							'title'    => __( 'Padding When Fixed', 'mixt' ),
							'subtitle' => __( 'Set the navbar\'s padding (in px) when fixed', 'mixt' ),
							'default'  => 0,
							'min'      => 0,
							'max'      => 50,
							'required' => array(
								array('nav-layout', '=', 'horizontal'),
								array('nav-mode', '=', 'fixed'),
							),
						),

						// Opacity
						array(
							'id'         => 'nav-opacity',
							'type'       => 'slider',
							'title'      => __( 'Opacity', 'mixt' ),
							'subtitle'   => __( 'Set the navbar\'s opacity when fixed', 'mixt' ),
							'default'    => 0.95,
							'step'       => 0.05,
							'min'        => 0,
							'max'        => 1,
							'resolution' => 0.01,
							'required'   => array('nav-layout', '=', 'horizontal'),
						),

						// See-Through When Possible
						array(
							'id'       => 'nav-transparent',
							'type'     => 'switch',
							'title'    => __( 'See-Through', 'mixt' ),
							'subtitle' => __( 'Make navbar transparent (when possible)', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => false,
							'required' => array('nav-layout', '=', 'horizontal'),
						),

						// See-Through Opacity
						array(
							'id'         => 'nav-top-opacity',
							'type'       => 'slider',
							'title'      => __( 'See-Through Opacity', 'mixt' ),
							'subtitle'   => __( 'Set the navbar\'s see-through opacity', 'mixt' ),
							'default'    => 0.25,
							'step'       => 0.05,
							'min'        => 0,
							'max'        => 1,
							'resolution' => 0.01,
							'required'   => array(
								array('nav-layout', '=', 'horizontal'),
								array('nav-transparent', '=', true),
							),
						),

						// Position
						array(
							'id'       => 'nav-position',
							'type'     => 'button_set',
							'title'    => __( 'Position', 'mixt' ),
							'subtitle' => __( 'Display navbar above or below header (when possible)', 'mixt' ),
							'options'  => array(
								'above' => __( 'Above', 'mixt' ),
								'below' => __( 'Below', 'mixt' ),
							),
							'default' => 'above',
							'required' => array('nav-layout', '=', 'horizontal'),
						),

						// Hover Item Background
						array(
							'id'       => 'nav-hover-bg',
							'type'     => 'switch',
							'title'    => __( 'Hover Item Background', 'mixt' ),
							'subtitle' => __( 'Item background color on hover', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default' => true,
						),

						// Active Item Bar
						array(
							'id'       => 'nav-active-bar',
							'type'     => 'switch',
							'title'    => __( 'Active Item Bar', 'mixt' ),
							'subtitle' => __( 'Show an accent bar for active menu items', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default' => true,
						),

						// Active Item Bar Position
						array(
							'id'       => 'nav-active-bar-pos',
							'type'     => 'button_set',
							'title'    => __( 'Active Bar Position', 'mixt' ),
							'subtitle' => __( 'Where will the active bar be placed', 'mixt' ),
							'options'  => array(
								'top'    => __( 'Top', 'mixt' ),
								'left'   => __( 'Left', 'mixt' ),
								'right'  => __( 'Right', 'mixt' ),
								'bottom' => __( 'Bottom', 'mixt' ),
							),
							'default'  => 'bottom',
							'required' => array('nav-active-bar', '=', true),
						),

						// Border Items
						array(
							'id'       => 'nav-bordered',
							'type'     => 'switch',
							'title'    => __( 'Border Items', 'mixt' ),
							'subtitle' => __( 'Add borders to the navbar items', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => false,
						),

					// Divider
					array(
						'id'   => 'navbar-divider-2',
						'type' => 'divide',
					),

					// SECONDARY NAVBAR SECTION
					array(
						'id'       => 'secondary-nav-section',
						'type'     => 'section',
						'title'    => __( 'Secondary Navbar', 'mixt' ),
						'subtitle' => __( 'Settings for the secondary navbar', 'mixt' ),
						'indent'   => true,
					),

						// On/Off Switch
						array(
							'id'       => 'second-nav',
							'type'     => 'switch',
							'title'    => __( 'Enable Secondary Navbar', 'mixt' ),
							'subtitle' => __( 'Show the secondary navbar above the header', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => false,
						),

						// Theme Select
						array(
							'id'       => 'sec-nav-theme',
							'type'     => 'select',
							'title'    => __( 'Theme', 'mixt' ),
							'subtitle' => __( 'Select the theme for the secondary navbar', 'mixt' ),
							'options'  => $nav_themes,
							'default'  => 'auto',
							'required' => array('second-nav', '=', true),
						),

						// Texture
						array(
							'id'       => 'sec-nav-texture',
							'type'     => 'mixt_image_select',
							'title'    => __( 'Texture', 'mixt' ),
							'subtitle' => __( 'Texture the navbar', 'mixt' ),
							'options'  => $img_textures,
							'empty'    => true,
							'default'  => '',
							'required' => array('second-nav', '=', true),
						),

						// Hover Item Background
						array(
							'id'       => 'sec-nav-hover-bg',
							'type'     => 'switch',
							'title'    => __( 'Hover Item Background', 'mixt' ),
							'subtitle' => __( 'Item background color on hover', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => true,
							'required' => array('second-nav', '=', true),
						),

						// Active Item Bar
						array(
							'id'       => 'sec-nav-active-bar',
							'type'     => 'switch',
							'title'    => __( 'Active Item Bar', 'mixt' ),
							'subtitle' => __( 'Show an accent bar for active menu items', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => false,
							'required' => array('second-nav', '=', true),
						),

						// Active Item Bar Position
						array(
							'id'       => 'sec-nav-active-bar-pos',
							'type'     => 'button_set',
							'title'    => __( 'Active Bar Position', 'mixt' ),
							'subtitle' => __( 'Where will the active bar be placed', 'mixt' ),
							'options'  => array(
								'top'    => __( 'Top', 'mixt' ),
								'left'   => __( 'Left', 'mixt' ),
								'right'  => __( 'Right', 'mixt' ),
								'bottom' => __( 'Bottom', 'mixt' ),
							),
							'default'  => 'bottom',
							'required' => array('sec-nav-active-bar', '=', true),
						),

						// Border Items
						array(
							'id'       => 'sec-nav-bordered',
							'type'     => 'switch',
							'title'    => __( 'Border Items', 'mixt' ),
							'subtitle' => __( 'Add borders to the navbar items', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => true,
							'required' => array('second-nav', '=', true),
						),

						// Left Side Content
						array(
							'id'       => 'sec-nav-left-content',
							'type'     => 'select',
							'title'    => __( 'Left Side Content', 'mixt' ),
							'subtitle' => __( 'Content to show on the left side of the navbar', 'mixt' ),
							'options'  => array(
								'0' => __( 'No Content', 'mixt' ),
								'1' => __( 'Navigation', 'mixt' ),
								'2' => __( 'Social Icons', 'mixt' ),
								'3' => __( 'Custom Text / Code', 'mixt' ),
							),
							'default'  => '0',
							'required' => array('second-nav', '=', true),
						),

						// Left Side Code
						array(
							'id'           => 'sec-nav-left-code',
							'type'         => 'textarea',
							'title'        => __( 'Left Side Code', 'mixt' ),
							'subtitle'     => __( 'Text or code to display on the left side', 'mixt' ),
							'allowed_html' => $text_allowed_html,
							'placeholder'  => $text_code_placeholder,
							'required'     => array('sec-nav-left-content', '=', '3'),
						),

						// Left Side Hide On Mobile
						array(
							'id'       => 'sec-nav-left-hide',
							'type'     => 'switch',
							'title'    => __( 'Hide Left Side On Mobile', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => false,
							'required' => array('sec-nav-left-content', '!=', '0'),
						),

						// Right Side Content
						array(
							'id'       => 'sec-nav-right-content',
							'type'     => 'select',
							'title'    => __( 'Right Side Content', 'mixt' ),
							'subtitle' => __( 'Content to show on the right side of the navbar', 'mixt' ),
							'options'  => array(
								'0' => __( 'No Content', 'mixt' ),
								'1' => __( 'Navigation', 'mixt' ),
								'2' => __( 'Social Icons', 'mixt' ),
								'3' => __( 'Custom Text / Code', 'mixt' ),
							),
							'default'  => '0',
							'required' => array('second-nav', '=', true),
						),

						// Right Side Code
						array(
							'id'           => 'sec-nav-right-code',
							'type'         => 'textarea',
							'title'        => __( 'Right Side Code', 'mixt' ),
							'subtitle'     => __( 'Text or code to display on the right side', 'mixt' ),
							'allowed_html' => $text_allowed_html,
							'placeholder'  => $text_code_placeholder,
							'required'     => array('sec-nav-right-content', '=', '3'),
						),

						// Right Side Hide On Mobile
						array(
							'id'       => 'sec-nav-right-hide',
							'type'     => 'switch',
							'title'    => __( 'Hide Right Side On Mobile', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => false,
							'required' => array('sec-nav-right-content', '!=', '0'),
						),
				),
			);


			// SIDEBARS SECTION
			$this->sections[] = array(
				'title'      => __( 'Sidebars', 'mixt' ),
				'desc'       => __( 'Configure the sidebars and their appearance', 'mixt' ),
				'icon'       => 'el-icon-pause',
				'customizer' => false,
				'fields'     => array(

					// Enable Sidebar
					array(
						'id'       => 'page-sidebar',
						'type'     => 'switch',
						'title'    => __( 'Enabled', 'mixt' ),
						'subtitle' => __( 'Display the sidebar', 'mixt' ),
						'on'       => __( 'Yes', 'mixt' ),
						'off'      => __( 'No', 'mixt' ),
						'default'  => true,
					),

					// Sidebar Position
					array(
						'id'       => 'sidebar-position',
						'type'     => 'button_set',
						'title'    => __( 'Position', 'mixt' ),
						'subtitle' => __( 'Sidebar to the left or to the right of the page', 'mixt' ),
						'options'  => array(
							'left'  => __( 'Left', 'mixt' ),
							'right' => __( 'Right', 'mixt' ),
						),
						'default'  => 'right',
					),

					// Sidebar Width
					array(
						'id'       => 'sidebar-width',
						'type'     => 'text',
						'title'    => __( 'Width', 'mixt' ),
						'subtitle' => __( 'Set a custom sidebar width, e.g. \'300px\' or \'25%\'', 'mixt' ),
					),

					// Small Sidebar Width
					array(
						'id'       => 'sidebar-width-sm',
						'type'     => 'text',
						'title'    => __( 'Small Width', 'mixt' ),
						'subtitle' => __( 'Set a custom sidebar width for smaller screens, e.g. \'200px\' or \'30%\'', 'mixt' ),
					),

					// Hide On Mobile
					array(
						'id'       => 'sidebar-hide',
						'type'     => 'switch',
						'title'    => __( 'Hide On Mobile', 'mixt' ),
						'subtitle' => __( 'Hide sidebar on mobile / small screens', 'mixt' ),
						'on'       => __( 'Yes', 'mixt' ),
						'off'      => __( 'No', 'mixt' ),
						'default'  => false,
					),

					// Child Page Navigation
					array(
						'id'       => 'child-page-nav',
						'type'     => 'switch',
						'title'    => __( 'Child Pages Menu', 'mixt' ),
						'subtitle' => __( 'Display a navigation menu of child pages in the sidebar, when available', 'mixt' ),
						'on'       => __( 'Yes', 'mixt' ),
						'off'      => __( 'No', 'mixt' ),
						'default'  => true,
					),

					// Additional Sidebars
					array(
						'id'       => 'reg-sidebars',
						'type'     => 'mixt_multi_input',
						'title'    => __( 'Custom Sidebars', 'mixt' ),
						'subtitle' => __( 'Register custom sidebars to use on different pages or locations', 'mixt' ),
						'add_text' => __( 'New Sidebar', 'mixt' ),
						'sortable' => true,
						'inputs'   => array(
							'name' => array(
								'wrap_class'  => 'sidebar-custom sidebar-name',
								'placeholder' => __( 'Name', 'mixt' ),
							),
							'id' => array(
								'wrap_class'  => 'sidebar-custom sidebar-id',
								'placeholder' => __( 'ID', 'mixt' ),
							),
						),
					),
				),
			);


			// FOOTER SECTION
			$this->sections[] = array(
				'title'      => __( 'Footer', 'mixt' ),
				'desc'       => __( 'Customize the site footer', 'mixt' ),
				'icon'       => 'el-icon-download-alt',
				'customizer' => false,
				'fields'     => array(

					// Footer Theme Select
					array(
						'id'       => 'footer-theme',
						'type'     => 'select',
						'title'    => __( 'Footer Theme', 'mixt' ),
						'subtitle' => __( 'Select the theme to be used for the footer', 'mixt' ),
						'options'  => $footer_themes,
						'default'  => 'auto',
					),
					
					// Back To Top Button
					array(
						'id'       => 'back-to-top',
						'type'     => 'switch',
						'title'    => __( 'Back To Top Button', 'mixt' ),
						'on'       => __( 'Yes', 'mixt' ),
						'off'      => __( 'No', 'mixt' ),
						'default'  => true,
					),

					// Back To Top Icon
					array(
						'id'       => 'back-to-top-icon',
						'type'     => 'text',
						'title'    => __( 'Back To Top Icon', 'mixt' ),
						'default'  => 'fa fa-chevron-up',
						'required' => array('back-to-top', '=', true),
					),
					
					// Divider
					array(
						'id'   => 'footer-divider',
						'type' => 'divide',
					),

					// WIDGET AREA SECTION
					array(
						'id'       => 'footer-widgets-section',
						'type'     => 'section',
						'title'    => __( 'Widget Area', 'mixt' ),
						'indent'   => true,
					),
					
						// Background Color
						array(
							'id'       => 'footer-widgets-bg-color',
							'type'     => 'color',
							'title'    => __( 'Background Color', 'mixt' ),
							'transparent' => false,
							'validate' => 'color',
						),

						// Background Pattern
						array(
							'id'       => 'footer-widgets-bg-pat',
							'type'     => 'mixt_image_select',
							'title'    => __( 'Background Pattern', 'mixt' ),
							'options'  => $img_patterns,
							'default'  => '',
							'empty'    => true,
						),

						// Text Color
						array(
							'id'       => 'footer-widgets-text-color',
							'type'     => 'color',
							'title'    => __( 'Text Color', 'mixt' ),
							'transparent' => false,
							'validate' => 'color',
						),

						// Text Color
						array(
							'id'       => 'footer-widgets-border-color',
							'type'     => 'color',
							'title'    => __( 'Border Color', 'mixt' ),
							'transparent' => false,
							'validate' => 'color',
						),
						
						// Hide On Mobile
						array(
							'id'       => 'footer-widgets-hide',
							'type'     => 'switch',
							'title'    => __( 'Hide On Mobile', 'mixt' ),
							'subtitle' => __( 'Hide the widget area on mobile / small screens', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => false,
						),

					// Divider
					array(
						'id'   => 'footer-divider-2',
						'type' => 'divide',
					),

					// COPYRIGHT AREA SECTION
					array(
						'id'       => 'footer-copy-section',
						'type'     => 'section',
						'title'    => __( 'Copyright Area', 'mixt' ),
						'indent'   => true,
					),
					
						// Background Color
						array(
							'id'       => 'footer-copy-bg-color',
							'type'     => 'color',
							'title'    => __( 'Background Color', 'mixt' ),
							'transparent' => false,
							'validate' => 'color',
						),

						// Background Pattern
						array(
							'id'       => 'footer-copy-bg-pat',
							'type'     => 'mixt_image_select',
							'title'    => __( 'Background Pattern', 'mixt' ),
							'options'  => $img_patterns,
							'default'  => '',
							'empty'    => true,
						),

						// Text Color
						array(
							'id'       => 'footer-copy-text-color',
							'type'     => 'color',
							'title'    => __( 'Text Color', 'mixt' ),
							'transparent' => false,
							'validate' => 'color',
						),

						// Text Color
						array(
							'id'       => 'footer-copy-border-color',
							'type'     => 'color',
							'title'    => __( 'Border Color', 'mixt' ),
							'transparent' => false,
							'validate' => 'color',
						),

						// Left Side Content
						array(
							'id'       => 'footer-left-content',
							'type'     => 'select',
							'title'    => __( 'Left Side Content', 'mixt' ),
							'subtitle' => __( 'Content to show on the left side of the footer', 'mixt' ),
							'options'  => array(
								'0' => __( 'No Content', 'mixt' ),
								'1' => __( 'Social Icons', 'mixt' ),
								'2' => __( 'Custom Text / Code', 'mixt' ),
							),
							'default'  => '2',
						),

						// Left Side Code
						array(
							'id'           => 'footer-left-code',
							'type'         => 'textarea',
							'title'        => __( 'Left Side Code', 'mixt' ),
							'subtitle'     => __( 'Text or code to display on the left side', 'mixt' ),
							'default'      => 'Copyright &copy; {{year}} Your Company',
							'allowed_html' => $text_allowed_html,
							'placeholder'  => $text_code_placeholder,
							'required'     => array('footer-left-content', '=', '2'),
						),

						// Left Side Hide On Mobile
						array(
							'id'       => 'footer-left-hide',
							'type'     => 'switch',
							'title'    => __( 'Hide Left Side On Mobile', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => false,
							'required' => array('footer-left-content', '!=', '0'),
						),

						// Right Side Content
						array(
							'id'       => 'footer-right-content',
							'type'     => 'select',
							'title'    => __( 'Right Side Content', 'mixt' ),
							'subtitle' => __( 'Content to show on the right side of the footer', 'mixt' ),
							'options'  => array(
								'0' => __( 'No Content', 'mixt' ),
								'1' => __( 'Social Icons', 'mixt' ),
								'2' => __( 'Custom Text / Code', 'mixt' ),
							),
							'default'  => '0',
						),

						// Right Side Code
						array(
							'id'           => 'footer-right-code',
							'type'         => 'textarea',
							'title'        => __( 'Right Side Code', 'mixt' ),
							'subtitle'     => __( 'Text or code to display on the right side', 'mixt' ),
							'allowed_html' => $text_allowed_html,
							'placeholder'  => $text_code_placeholder,
							'required'     => array('footer-right-content', '=', '2'),
						),

						// Right Side Hide On Mobile
						array(
							'id'       => 'footer-right-hide',
							'type'     => 'switch',
							'title'    => __( 'Hide Right Side On Mobile', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => false,
							'required' => array('footer-right-content', '!=', '0'),
						),

						// Social Icons To Display
						array(
							'id'       => 'footer-social-profiles',
							'type'     => 'checkbox',
							'title'    => __( 'Social Profiles', 'mixt' ),
							'subtitle' => __( 'Select which social profiles to display', 'mixt' ),
							'options'  => $social_profile_names,
						),

					// Divider
					array(
						'id'   => 'footer-divider-3',
						'type' => 'divide',
					),

					// INFO BAR SECTION
					array(
						'id'       => 'footer-info-section',
						'type'     => 'section',
						'title'    => __( 'Info Bar', 'mixt' ),
						'subtitle' => __( 'Settings for the info bar. Can be used to show the cookie law notice, a promotion or any other information.', 'mixt' ),
						'indent'   => true,
					),

						// Enable
						array(
							'id'       => 'info-bar',
							'type'     => 'switch',
							'title'    => __( 'Show', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => false,
						),

						// Content
						array(
							'id'           => 'info-bar-content',
							'type'         => 'textarea',
							'title'        => __( 'Content', 'mixt' ),
							'subtitle'     => __( 'Text or code to display in the info bar', 'mixt' ),
							'default'      => 'This site uses cookies to improve user experience. By continuing to use it, you are agreeing to our <a href="#">cookie policy</a>.' .
											  '<a href="#" class="btn btn-red btn-xs pull-right info-close"><i class="fa fa-remove"></i></a>',
							'allowed_html' => $text_allowed_html,
							'placeholder'  => $text_code_placeholder,
							'required'     => array('info-bar', '=', true),
						),

						// Fixed Position
						array(
							'id'       => 'info-bar-fixed',
							'type'     => 'switch',
							'title'    => __( 'Fixed Position', 'mixt' ),
							'subtitle' => __( 'Make the info bar fixed (sticky)', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => false,
							'required' => array('info-bar', '=', true),
						),

						// Hide On Mobile
						array(
							'id'       => 'info-bar-hide',
							'type'     => 'switch',
							'title'    => __( 'Hide On Mobile', 'mixt' ),
							'subtitle' => __( 'Hide the info bar on mobile / small screens', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => false,
							'required' => array('info-bar', '=', true),
						),
				),
			);


			// DIVIDER
			$this->sections[] = array(
				'type' => 'divide',
			);


			// POST PAGES SECTION
			$this->sections[] = array(
				'title'      => __( 'Post Pages', 'mixt' ),
				'desc'       => __( 'Manage post and archive pages', 'mixt' ),
				'icon'       => 'el-icon-book',
				'customizer' => false,
				'fields'     => array(

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
				),
			);

			// BLOG PAGE SECTION
			$this->sections[] = array(
				'title'      => __( 'Blog Page', 'mixt' ),
				'desc'       => __( 'Manage the blog page and post appearance', 'mixt' ),
				'icon'       => 'el-icon-th-list',
				'subsection' => true,
				'customizer' => false,
				'fields'     => array(

					// Layout Type
					array(
						'id'       => 'blog-type',
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
						'id'       => 'blog-columns',
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
						'required' => array('blog-type', '!=', 'standard'),
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
							array('blog-type', '=', 'standard'),
							array('blog-feat-show', '=', true),
						),
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

					// Post Content Type
					array(
						'id'       => 'post-content',
						'type'     => 'button_set',
						'title'    => __( 'Post Content', 'mixt' ),
						'subtitle' => __( 'Show the post\'s excerpt or full content', 'mixt' ),
						'options'  => array(
							'full'    => __( 'Full', 'mixt' ),
							'excerpt' => __( 'Excerpt', 'mixt' ),
						),
						'default'  => 'full',
					),

					// Post Excerpt Limit
					array(
						'id'       => 'post-excerpt-length',
						'type'     => 'slider',
						'title'    => __( 'Excerpt Limit', 'mixt' ),
						'subtitle' => __( 'Set a maximum excerpt length (in words)', 'mixt' ),
						'default'  => 55,
						'min'      => 1,
						'max'      => 200,
						'required' => array('post-content', '=', 'excerpt'),
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
				),
			);

			// AUTHOR PAGE SECTION
			$this->sections[] = postsPageFields('author', 'user', array( 'meta-show' => 'false' ));

			// CATEGORY PAGE SECTION
			$this->sections[] = postsPageFields('category', 'folder-open');

			// DATE PAGE SECTION
			$this->sections[] = postsPageFields('date', 'time', array( 'post-info' => false ));

			// SEARCH PAGE SECTION
			$this->sections[] = postsPageFields('search', 'search', array( 'sidebar' => 'false', 'feat-show' => false, 'meta-show' => 'false' ));

			// TAG PAGE SECTION
			$this->sections[] = postsPageFields('tag', 'tag');

			// TAXONOMY PAGE SECTION
			$this->sections[] = postsPageFields('taxonomy', 'tags', array( 'post-info' => false ));


			// POSTS SECTION
			$this->sections[] = array(
				'title'      => __( 'Posts', 'mixt' ),
				'desc'       => __( 'Configure the post\'s appearance', 'mixt' ),
				'icon'       => 'el-icon-pencil',
				'customizer' => false,
				'fields'     => array(

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

					// RELATED POSTS SECTION
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
								'tags' => __( 'Tags', 'mixt' ),
								'cats' => __( 'Categories', 'mixt' ),
							),
							'default'  => 'tags',
							'required' => array('post-related', '=', true),
						),

						// Related Posts Number
						array(
							'id'       => 'post-related-number',
							'type'     => 'spinner',
							'title'    => __( 'Number', 'mixt' ),
							'subtitle' => __( 'How many related posts to display', 'mixt' ),
							'max'      => '15',
							'min'      => '1',
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

			// POST META SECTION
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

					// Author Icon
					array(
						'id'       => 'meta-author-icon',
						'type'     => 'text',
						'title'    => __( 'Author Icon', 'mixt' ),
						'default'  => 'fa fa-user',
						'required' => array('meta-author', '=', true),
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

					// Date Icon
					array(
						'id'       => 'meta-date-icon',
						'type'     => 'text',
						'title'    => __( 'Date Icon', 'mixt' ),
						'default'  => 'fa fa-clock-o',
						'required' => array('meta-date', '=', true),
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

					// Category Icon
					array(
						'id'       => 'meta-category-icon',
						'type'     => 'text',
						'title'    => __( 'Category Icon', 'mixt' ),
						'default'  => 'fa fa-folder-open',
						'required' => array('meta-category', '=', true),
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

					// Comments Icon
					array(
						'id'       => 'meta-comments-icon',
						'type'     => 'text',
						'title'    => __( 'Comments Icon', 'mixt' ),
						'default'  => 'fa fa-comments',
						'required' => array('meta-comments', '=', true),
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

			// POST FORMATS SECTION
			$this->sections[] = array(
				'title'      => __( 'Post Formats', 'mixt' ),
				'desc'       => __( 'Configure the post formats and icons', 'mixt' ),
				'icon'       => 'el-icon-paper-clip',
				'subsection' => true,
				'customizer' => false,
				'fields'     => array(

					// Standard Format Icon
					array(
						'id'       => 'format-standard-icon',
						'type'     => 'text',
						'title'    => __( 'Standard Format Icon', 'mixt' ),
						'default'  => 'fa fa-align-left',
					),

					// Aside Format Icon
					array(
						'id'       => 'format-aside-icon',
						'type'     => 'text',
						'title'    => __( 'Aside Format Icon', 'mixt' ),
						'default'  => 'fa fa-pencil',
					),

					// Image Format Icon
					array(
						'id'       => 'format-image-icon',
						'type'     => 'text',
						'title'    => __( 'Image Format Icon', 'mixt' ),
						'default'  => 'fa fa-picture-o',
					),

					// Video Format Icon
					array(
						'id'       => 'format-video-icon',
						'type'     => 'text',
						'title'    => __( 'Video Format Icon', 'mixt' ),
						'default'  => 'fa fa-play',
					),

					// Audio Format Icon
					array(
						'id'       => 'format-audio-icon',
						'type'     => 'text',
						'title'    => __( 'Audio Format Icon', 'mixt' ),
						'default'  => 'fa fa-music',
					),

					// Gallery Format Icon
					array(
						'id'       => 'format-gallery-icon',
						'type'     => 'text',
						'title'    => __( 'Gallery Format Icon', 'mixt' ),
						'default'  => 'fa fa-camera',
					),

					// Quote Format Icon
					array(
						'id'       => 'format-quote-icon',
						'type'     => 'text',
						'title'    => __( 'Quote Format Icon', 'mixt' ),
						'default'  => 'fa fa-quote-right',
					),

					// Link Format Icon
					array(
						'id'       => 'format-link-icon',
						'type'     => 'text',
						'title'    => __( 'Link Format Icon', 'mixt' ),
						'default'  => 'fa fa-link',
					),

					// Status Format Icon
					array(
						'id'       => 'format-status-icon',
						'type'     => 'text',
						'title'    => __( 'Status Format Icon', 'mixt' ),
						'default'  => 'fa fa-sticky-note',
					),

					// Page Format Icon
					array(
						'id'       => 'format-page-icon',
						'type'     => 'text',
						'title'    => __( 'Page Format Icon', 'mixt' ),
						'default'  => 'fa fa-file-text',
					),

					// Product Format Icon
					array(
						'id'       => 'format-product-icon',
						'type'     => 'text',
						'title'    => __( 'Product Format Icon', 'mixt' ),
						'default'  => 'fa fa-shopping-cart',
					),
				),
			);

			// SOCIAL SHARING SECTION
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

			// COMMENTS SECTION
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


			// ADD PORTFOLIO FIELDS IF ENABLED
			if ( class_exists('Mixt_Portfolio') ) {
				include_once( MIXT_PLUGINS_DIR . '/redux-extend/portfolio-fields.php' );
			}


			// ADD SHOP FIELDS IF WOOCOMMERCE ENABLED
			if ( class_exists('WooCommerce') ) {
				include_once( MIXT_PLUGINS_DIR . '/redux-extend/woocommerce-fields.php' );
			}


			// DIVIDER
			$this->sections[] = array(
				'type' => 'divide',
			);


			// THEMES SECTION

			if ( $themes_enabled ) {

				// SITE-WIDE THEMES SECTION
				$this->sections[] = array(
					'title'      => __( 'Themes', 'mixt' ),
					'desc'       => __( 'Create and manage site-wide themes.', 'mixt' ) . ' ' .
									__( 'Fields marked * can be left empty and their respective colors will be automatically generated.', 'mixt' ),
					'icon'       => 'el-icon-leaf',
					'customizer' => false,
					'fields'     => array(

						array(
							'id'       => 'site-themes',
							'type'     => 'mixt_multi_input',
							'no_title' => true,
							'sortable' => true,
							'no_ajax'  => true,
							'add_text' => __( 'New Theme', 'mixt' ),
							'inputs'   => array(

								// Theme Name
								'name' => array(
									'type'       => 'text',
									'icon'       => 'el-icon-brush',
									'label'      => __( 'Theme Name', 'mixt' ),
									'wrap_class' => 'theme-name',
								),

								// Theme ID
								'id' => array(
									'type'       => 'group-id',
									'icon'       => 'el-icon-tags',
									'label'      => __( 'Theme ID', 'mixt' ),
									'wrap_class' => 'theme-id',
								),

								// Accent
								'accent' => array(
									'type'  => 'color',
									'label' => __( 'Accent', 'mixt' ),
								),

								// Background Color
								'bg' => array(
									'type'  => 'color',
									'label' => __( 'Background Color', 'mixt' ),
								),

								// Text Color
								'color' => array(
									'type'  => 'color',
									'label' => __( 'Text Color', 'mixt' ),
								),

								// Text Color Fade
								'color-fade' => array(
									'type'  => 'color',
									'label' => __( 'Text Color Fade', 'mixt' ) . ' *',
								),

								// Border Color
								'border' => array(
									'type'  => 'color',
									'label' => __( 'Border Color', 'mixt' ),
								),

								// Inverse Background Color
								'bg-inv' => array(
									'type'  => 'color',
									'label' => __( 'Inverse Background', 'mixt' ) . ' *',
								),

								// Inverse Text Color
								'color-inv' => array(
									'type'  => 'color',
									'label' => __( 'Inverse Text Color', 'mixt' ),
								),

								// Inverse Text Color Fade
								'color-inv-fade' => array(
									'type'  => 'color',
									'label' => __( 'Inverse Text Fade', 'mixt' ) . ' *',
								),

								// Inverse Border Color
								'border-inv' => array(
									'type'  => 'color',
									'label' => __( 'Inverse Border', 'mixt' ) . ' *',
								),

								// Alt Background Color
								'bg-alt' => array(
									'type'  => 'color',
									'label' => __( 'Alt Background', 'mixt' ) . ' *',
								),

								// Alt Text Color
								'color-alt' => array(
									'type'  => 'color',
									'label' => __( 'Alt Text Color', 'mixt' ) . ' *',
								),

								// Alt Border Color
								'border-alt' => array(
									'type'  => 'color',
									'label' => __( 'Alt Border', 'mixt' ) . ' *',
								),

								// Dark Background Check
								'bg-dark' => array(
									'type'       => 'checkbox',
									'label'      => __( 'Dark Background', 'mixt' ),
								),
							),
							'default' => get_option('mixt-site-themes', array()),
						),
					),
				);

				// NAVBAR THEMES SECTION
				$this->sections[] = array(
					'title'      => __( 'Navbar Themes', 'mixt' ),
					'desc'       => __( 'Create and manage themes for the navbar.', 'mixt' ) . ' ' .
									__( 'Fields marked * can be left empty and their respective colors will be automatically generated.', 'mixt' ),
					'icon'       => 'el-icon-minus',
					'subsection' => true,
					'customizer' => false,
					'fields'     => array(

						array(
							'id'       => 'nav-themes',
							'type'     => 'mixt_multi_input',
							'no_title' => true,
							'sortable' => true,
							'no_ajax'  => true,
							'add_text' => __( 'New Theme', 'mixt' ),
							'inputs'   => array(

								// Theme Name
								'name' => array(
									'type'       => 'text',
									'icon'       => 'el-icon-brush',
									'label'      => __( 'Theme Name', 'mixt' ),
									'wrap_class' => 'theme-name',
								),

								// Theme ID
								'id' => array(
									'type'       => 'group-id',
									'icon'       => 'el-icon-tags',
									'label'      => __( 'Theme ID', 'mixt' ),
									'wrap_class' => 'theme-id',
								),

								// Accent
								'accent' => array(
									'type'  => 'color',
									'label' => __( 'Accent', 'mixt' ),
								),

								// Inverse Accent
								'accent-inv' => array(
									'type'  => 'color',
									'label' => __( 'Inverse Accent', 'mixt' ) . ' *',
								),

								// Background Color
								'bg' => array(
									'type'  => 'color',
									'label' => __( 'Background Color', 'mixt' ),
								),

								// Text Color
								'color' => array(
									'type'  => 'color',
									'label' => __( 'Text Color', 'mixt' ),
								),

								// Inverse Text Color
								'color-inv' => array(
									'type'  => 'color',
									'label' => __( 'Inverse Text Color', 'mixt' ),
								),

								// Border Color
								'border' => array(
									'type'  => 'color',
									'label' => __( 'Border Color', 'mixt' ),
								),

								// Inverse Border Color
								'border-inv' => array(
									'type'  => 'color',
									'label' => __( 'Inverse Border', 'mixt' ),
								),

								// Menu Background Color
								'menu-bg' => array(
									'type'  => 'color',
									'label' => __( 'Menu Background', 'mixt' ) . ' *',
								),

								// Menu Text Color
								'menu-color' => array(
									'type'  => 'color',
									'label' => __( 'Menu Text Color', 'mixt' ) . ' *',
								),

								// Menu Text Fade Color
								'menu-color-fade' => array(
									'type'  => 'color',
									'label' => __( 'Menu Text Fade', 'mixt' ) . ' *',
								),

								// Menu Hover Background Color
								'menu-bg-hover' => array(
									'type'  => 'color',
									'label' => __( 'Menu Hover Bg', 'mixt' ) . ' *',
								),

								// Menu Hover Text Color
								'menu-hover-color' => array(
									'type'  => 'color',
									'label' => __( 'Menu Hover Text', 'mixt' ) . ' *',
								),

								// Menu Border Color
								'menu-border' => array(
									'type'  => 'color',
									'label' => __( 'Menu Border', 'mixt' ) . ' *',
								),

								// Dark Background Check
								'bg-dark' => array(
									'type'       => 'checkbox',
									'label'      => __( 'Dark Background', 'mixt' ),
								),

								// RGBA Check
								'rgba' => array(
									'type'       => 'checkbox',
									'label'      => __( 'Enable Opacity', 'mixt' ),
									'wrap_class' => 'rgba-field',
								),
							),
							'default' => get_option('mixt-nav-themes', array())
						),
					),
				);

			}


			// ICONS
			$this->sections[] = array(
				'title'      => __( 'Icons', 'mixt' ),
				'desc'       => __( 'Define various icons used throughout the site', 'mixt' ),
				'icon'       => 'el-icon-adjust',
				'customizer' => false,
				'fields'     => array(

					// Left Arrow
					array(
						'id'       => 'left-arrow-icon',
						'type'     => 'text',
						'title'    => __( 'Left Arrow', 'mixt' ),
						'default'  => 'fa fa-chevron-left',
					),

					// Right Arrow
					array(
						'id'       => 'right-arrow-icon',
						'type'     => 'text',
						'title'    => __( 'Right Arrow', 'mixt' ),
						'default'  => 'fa fa-chevron-right',
					),

					// Up Arrow
					array(
						'id'       => 'up-arrow-icon',
						'type'     => 'text',
						'title'    => __( 'Up Arrow', 'mixt' ),
						'default'  => 'fa fa-chevron-up',
					),

					// Down Arrow
					array(
						'id'       => 'down-arrow-icon',
						'type'     => 'text',
						'title'    => __( 'Down Arrow', 'mixt' ),
						'default'  => 'fa fa-chevron-down',
					),
				),
			);
			

			// SOCIAL PROFILES
			$this->sections[] = array(
				'title'      => __( 'Social Profiles', 'mixt' ),
				'desc'       => __( 'Manage your social profiles and add new ones', 'mixt' ),
				'icon'       => 'el-icon-group',
				'customizer' => false,
				'fields'     => array(

					// Social Icons Color On Hover
					array(
						'id'   => 'social-profiles-color',
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
					
					// Social Profiles
					array(
						'id'       => 'social-profiles',
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
								'placeholder' => __( 'URL', 'mixt' ),
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
						'default'  => $social_profiles,
					),
				),
			);


			// TYPOGRAPHY
			$this->sections[] = array(
				'title'      => __( 'Typography', 'mixt' ),
				'desc'       => __( 'Manage the site\'s typography options and fonts.', 'mixt' ),
				'icon'       => 'el-icon-font',
				'customizer' => false,
				'fields'     => array(

					// Site-Wide Font
					array(
						'id'          => 'font-sitewide',
						'type'        => 'typography',
						'title'       => __( 'Main Font', 'mixt' ),
						'subtitle'    => __( 'Select the font to use site-wide', 'mixt' ),
						'google'      => true,
						'font-backup' => true,
						'color'       => false,
						'line-height' => false,
						'text-align'  => false,
						'font-style'  => false,
						'font-weight' => false,
						'units'       => 'px',
						'default'     => array(
							'google'      => false,
						),
					),

					// Nav Font
					array(
						'id'          => 'font-nav',
						'type'        => 'typography',
						'title'       => __( 'Nav Menu Font', 'mixt' ),
						'subtitle'    => __( 'Select the font to use for the navigation menu', 'mixt' ),
						'google'      => true,
						'font-backup' => true,
						'color'       => false,
						'line-height' => false,
						'text-align'  => false,
						'font-style'  => false,
						'font-weight' => true,
						'text-transform' => true,
						'units'       => 'px',
						'default'     => array(
							'google'      => false,
						),
					),

					// Heading Font
					array(
						'id'          => 'font-heading',
						'type'        => 'typography',
						'title'       => __( 'Heading Font', 'mixt' ),
						'subtitle'    => __( 'Select the font to use for headings', 'mixt' ),
						'google'      => true,
						'font-backup' => true,
						'color'       => false,
						'line-height' => true,
						'text-align'  => false,
						'font-size'   => false,
						'font-style'  => true,
						'font-weight' => false,
						'units'       => 'px',
						'default'     => array(
							'google'      => false,
						),
					),
				),
			);


			// DOCUMENTATION
			if ( file_exists( dirname( __FILE__ ) . '/../README.md' ) ) {
				$this->sections['theme_docs'] = array(
					'icon'   => 'el-icon-list-alt',
					'title'  => __( 'Documentation', 'mixt' ),
					'fields' => array(
						array(
							'id'       => '17',
							'type'     => 'raw',
							'markdown' => true,
							'content'  => file_get_contents( dirname( __FILE__ ) . '/../README.md' )
						),
					),
				);
			}


			$this->sections[] = array(
				'type' => 'divide',
			);


			// IMPORT & DEMOS SECTION
			include_once( MIXT_PLUGINS_DIR . '/redux-extend/demos.php' );
			$this->sections[] = array(
				'id'         => 'wbc_importer_section',
				'title'      => __( 'Settings & Demos', 'mixt' ),
				'desc'       => __( 'Manage your settings, and import demo content.', 'mixt' ) .
								'<br><strong class="red-text">' .
									__( 'Demos work best on clean, fresh sites. For complete content import, make sure all recommended plugins (Appearance > Install Plugins) are activated! The page will reload after importing.', 'mixt' ) .
								'</strong>',
				'icon'       => 'el-icon-refresh',
				'customizer' => false,
				'fields'     => array(

					// Demo Import
					array(
						'id'   => 'wbc_demo_importer',
						'type' => 'wbc_importer',
					),

					// Options Import/Export
					array(
						'id'         => 'opt-import-export',
						'type'       => 'import_export',
						'full_width' => true,
					),
					
				)
			);


			// CUSTOMIZER SECTIONS
			if ( is_customize_preview() ) {
				include_once( MIXT_PLUGINS_DIR . '/redux-extend/customizer-fields.php' );
			}
		}

		public function setHelpTabs() {

			$mixt_help_file = function($file) {
				$file_path = MIXT_FRAME_DIR . "/admin/help/$file.html";

				if ( file_exists($file_path) ) {
					return file_get_contents($file_path);
				} else {
					return "<p>Unable to find help file <strong>$file.html</strong></p>";
				}
			};

			// Custom page help tabs, displayed using the help API. Tabs are shown in order of definition.
			$this->args['help_tabs'][] = array(
				'id'      => 'help-global',
				'title'   => __( 'Global Options', 'mixt' ),
				'content' => $mixt_help_file('global'),
			);

			$this->args['help_tabs'][] = array(
				'id'      => 'help-header',
				'title'   => __( 'Header', 'mixt' ),
				'content' => $mixt_help_file('header'),
			);

			$this->args['help_tabs'][] = array(
				'id'      => 'help-navbars',
				'title'   => __( 'Navbars', 'mixt' ),
				'content' => $mixt_help_file('navbars'),
			);

			$this->args['help_tabs'][] = array(
				'id'      => 'help-sidebars',
				'title'   => __( 'Sidebars', 'mixt' ),
				'content' => $mixt_help_file('sidebars'),
			);

			$this->args['help_tabs'][] = array(
				'id'      => 'help-post-pages',
				'title'   => __( 'Post Pages', 'mixt' ),
				'content' => $mixt_help_file('post-pages'),
			);

			$this->args['help_tabs'][] = array(
				'id'      => 'help-themes',
				'title'   => __( 'Themes', 'mixt' ),
				'content' => $mixt_help_file('themes'),
			);

			$this->args['help_tabs'][] = array(
				'id'      => 'help-social-profiles',
				'title'   => __( 'Social Profiles', 'mixt' ),
				'content' => $mixt_help_file('social-profiles'),
			);

			// Set the help sidebar
			$this->args['help_sidebar'] = '<p>The latest documentation is available online.<br><a class="button button-primary" href="http://docs.mixt.novalx.com/" target="_blank">Documentation</a></p>';
		}

		/**
		 * All the possible arguments for Redux.
		 * For full documentation on arguments, please refer to: https://github.com/ReduxFramework/ReduxFramework/wiki/Arguments
		 * */
		public function setArguments() {

			$theme = wp_get_theme();

			$this->args = array(
				'opt_name'           => 'mixt_opt',
				'global_variable'    => '',
				'display_name'       => 'MIXT',
				'display_version'    => $theme->get('Version'),
				'menu_type'          => 'submenu',
				'allow_sub_menu'     => false,
				'menu_title'         => __( 'Theme Options', 'mixt' ),
				'page_title'         => __( 'MIXT Options', 'mixt' ),
				'admin_bar'          => true,
				'admin_bar_icon'     => 'dashicons-screenoptions',
				'admin_bar_priority' => '31.6498',

				'dev_mode'           => false,
				'update_notice'      => true,
				'disable_tracking'   => true,
				
				'customizer'         => true,
				
				'page_priority'      => null,
				'page_parent'        => 'mixt-admin',
				'page_permissions'   => 'manage_options',
				'menu_icon'          => '',
				'page_icon'          => 'icon-themes',
				'page_slug'          => 'mixt-options',
				'save_defaults'      => true,
				'default_show'       => false,
				'default_mark'       => '',
				'show_import_export' => false,

				'templates_path'     => MIXT_DIR . '/templates/redux-templates',

				// You will need to generate a Google API key to use this feature.
				// Please visit: https://developers.google.com/fonts/docs/developer_api#Auth
				'google_api_key'       => apply_filters('mixt_google_api_key', ''),
				// Set it you want google fonts to update weekly. A google_api_key value is required.
				'google_update_weekly' => false,
				// Must be defined to add google fonts to the typography module
				'async_typography'     => true,

				// CAREFUL -> These options are for advanced use only
				'transient_time' => 60 * MINUTE_IN_SECONDS,
				'output'         => true,
				'output_tag'     => true,

				// HINTS
				'hints' => array(
					'icon'          => 'icon-question-sign',
					'icon_position' => 'right',
					'icon_color'    => 'lightgray',
					'icon_size'     => 'normal',
					'tip_style'     => array(
						'color'   => 'light',
						'shadow'  => true,
						'rounded' => false,
						'style'   => '',
					),
					'tip_position'  => array(
						'my' => 'top left',
						'at' => 'bottom right',
					),
					'tip_effect'    => array(
						'show' => array(
							'effect'   => 'slide',
							'duration' => '500',
							'event'    => 'mouseover',
						),
						'hide' => array(
							'effect'   => 'slide',
							'duration' => '500',
							'event'    => 'click mouseleave',
						),
					),
				)
			);

			// ADMIN BAR LINKS -> Setup custom links in the admin bar menu as external items.
			// $this->args['admin_bar_links'][] = array(
			// 	'id'    => 'redux-docs',
			// 	'href'   => 'http://docs.reduxframework.com/',
			// 	'title' => __( 'Documentation', 'mixt' ),
			// );

			// SOCIAL ICONS -> Setup custom links in the footer for quick links in your panel footer icons.
			// $this->args['share_icons'][] = array(
			//     'url'   => 'https://www.facebook.com/novalexdesign',
			//     'title' => 'Like novalex on Facebook',
			//     'icon'  => 'el-icon-facebook'
			// );

			// Panel Intro text -> before the form
			// $this->args['intro_text'] = __( '', 'mixt' );

			// Add content after the form.
			$this->args['footer_text'] = '';
		}
	}

	global $mixtConfig;
	$mixtConfig = new Redux_MIXT_config();
} else {
	echo "The class named Redux_MIXT_config has already been called. <strong>Developers, you need to prefix this class with your company name or you'll run into problems!</strong>";
}
