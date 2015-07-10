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

			// Function to test the compiler hook and demo CSS output.
			// Above 10 is a priority, but 2 in necessary to include the dynamically generated CSS to be sent to the function.
			add_filter('redux/options/'.$this->args['opt_name'].'/compiler', array( $this, 'compiler_action' ), 10, 3);

			// Change the arguments after they've been declared, but before the panel is created
			//add_filter('redux/options/'.$this->args['opt_name'].'/args', array( $this, 'change_arguments' ) );

			// Change the default value of a field after it's been set, but before it's been useds
			//add_filter('redux/options/'.$this->args['opt_name'].'/defaults', array( $this,'change_defaults' ) );

			// Dynamically add a section. Can be also used to modify sections/fields
			//add_filter('redux/options/' . $this->args['opt_name'] . '/sections', array($this, 'dynamic_section'));

			$this->ReduxFramework = new ReduxFramework( $this->sections, $this->args );
		}

		/**
		 * This is a test function that will let you see when the compiler hook occurs.
		 * It only runs if a field    set with compiler=>true is changed.
		 * */
		function compiler_action( $options, $css, $changed_values ) {
			add_action('admin_notices', 'compiler_notification');
			function compiler_notification() {
				echo '<div id="info-notice_success" class="redux-success redux-notice-field redux-field-info" style="margin: 15px 0 0;">
					  <p class="redux-info-desc"><b>Compiler Run</b><br>Custom CSS sucessfully compiled!</p>
					  </div>';
			}
			// echo "<pre>";
			// print_r( $changed_values ); // Values that have changed since the last save
			// echo "</pre>";
			//print_r($options); //Option values
			//print_r($css); // Compiler selector CSS values  compiler => array( CSS SELECTORS )

			// CUSTOM CSS FILE

			global $wp_filesystem;

			$filename = MIXT_UPLOAD_PATH . '/custom-style.css';

			if ( empty( $wp_filesystem ) ) {
				require_once( ABSPATH . '/wp-admin/includes/file.php' );
				WP_Filesystem();
			}

			if ( $wp_filesystem ) {
				$wp_filesystem->put_contents(
					$filename,
					$css,
					FS_CHMOD_FILE // predefined mode settings for WP files
				);
			}
		}

		/**
		 * Custom function for filtering the sections array. Good for child themes to override or add to the sections.
		 * Simply include this function in the child themes functions.php file.
		 * NOTE: the defined constants for URLs, and directories will NOT be available at this point in a child theme,
		 * so you must use get_template_directory_uri() if you want to use any of the built in icons
		 * */
		function dynamic_section( $sections ) {
			//$sections = array();
			$sections[] = array(
				'title'  => __( 'Section via hook', 'mixt' ),
				'desc'   => __( '<p class="description">This is a section created by adding a filter to the sections array. Can be used by child themes to add/remove sections from the options.</p>', 'mixt' ),
				'icon'   => 'el-icon-paper-clip',
				// Leave this as a blank section, no options just some intro text set above.
				'fields' => array()
			);

			return $sections;
		}

		/**
		 * Filter hook for filtering the args. Good for child themes to override or add to the args array. Can also be used in other functions.
		 * */
		function change_arguments( $args ) {
			//$args['dev_mode'] = true;

			return $args;
		}

		/**
		 * Filter hook for filtering the default value of any given field. Very useful in development mode.
		 * */
		function change_defaults( $defaults ) {
			$defaults['str_replace'] = 'Testing filter hook!';

			return $defaults;
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

			ob_start();

			$ct          = wp_get_theme();
			$this->theme = $ct;
			$item_name   = $this->theme->get( 'Name' );
			$tags        = $this->theme->Tags;
			$class       = '';

			?>

			<div id="current-theme" class="<?php echo esc_attr( $class ); ?>">

				<h4><?php echo $this->theme->display( 'Name' ); ?></h4>

				<div>
					<ul class="theme-info">
						<li><?php printf( __( 'By %s', 'mixt' ), $this->theme->display( 'Author' ) ); ?></li>
						<li><?php printf( __( 'Version %s', 'mixt' ), $this->theme->display( 'Version' ) ); ?></li>
						<li><?php echo '<strong>' . __( 'Tags', 'mixt' ) . ':</strong> '; ?><?php printf( $this->theme->display( 'Tags' ) ); ?></li>
					</ul>
					<p class="theme-description"><?php echo $this->theme->display( 'Description' ); ?></p>
					<?php
						if ( $this->theme->parent() ) {
							printf( ' <p class="howto">' . __( 'This <a href="%1$s">child theme</a> requires its parent theme, %2$s.', 'mixt' ) . '</p>', __( 'http://codex.wordpress.org/Child_Themes', 'mixt' ), $this->theme->parent()->display( 'Name' ) );
						}
					?>

				</div>
			</div>

			<?php
			$item_info = ob_get_contents();

			ob_end_clean();

			$sampleHTML = '';
			if ( file_exists( dirname( __FILE__ ) . '/info-html.html' ) ) {
				Redux_Functions::initWpFilesystem();

				global $wp_filesystem;

				$sampleHTML = $wp_filesystem->get_contents( dirname( __FILE__ ) . '/info-html.html' );
			}


			// GET ASSETS

			$page_loader_anims = array(
				'none' => 'No Animation',
			);
			$css_loop_anims = mixt_css_anims('loops');
			$page_loader_anims = array_merge($page_loader_anims, $css_loop_anims);

			// Themes
			$preset_themes = mixt_default_themes('names');

			$site_themes = ! empty(mixt_get_themes('site')) ? mixt_get_themes('site') : $preset_themes;
			$site_default_themes = mixt_default_themes('site');

			$nav_themes = ! empty(mixt_get_themes('nav')) ? mixt_get_themes('nav') : $preset_themes;
			$nav_default_themes = mixt_default_themes('nav');

			// Image Patterns
			$img_patterns = mixt_get_images('patterns');

			// Image Textures
			$img_textures = mixt_get_images('textures');

			// Social Networks
			$social_profiles = $social_sharing_profiles = '';
			if ( function_exists('mixt_preset_social_profiles') ) {
				$social_profiles = mixt_preset_social_profiles('networks');
				$social_sharing_profiles = mixt_preset_social_profiles('sharing');
			}

			// HTML Allowed in the secondary nav custom code field
			$sec_nav_allowed_html = array(
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
			// Secondary Nav custom code field placeholder
			$sec_nav_code_placeholder = __( 'Allowed HTML tags and attributes: <a href="" title="">, <i>, <span>, <strong>, <em>', 'mixt' );

			// Output Fields Array For Posts Pages
			function postsPageFields( $type, $icon = 'check-empty', $defaults = array() ) {
				if ( empty($type) ) return;

				$preset_defaults = array(
					'fullwidth' => 'auto',
					'sidebar'   => 'auto',
					'inherit'   => false,
					'type'      => 'grid',
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

					// Site-Wide Theme Select
					array(
						'id'       => 'site-theme',
						'type'     => 'select',
						'title'    => __( 'Site Theme', 'mixt' ),
						'subtitle' => __( 'Select the theme to be used site-wide', 'mixt' ),
						'options'  => $site_themes,
						'default'  => 'aqua',
					),

					// Site Typography
					array(
						'id'          => 'site-font',
						'type'        => 'typography',
						'title'       => __( 'Main Font', 'mixt' ),
						'subtitle'    => __( 'Select the font to use site-wide', 'mixt' ),
						'google'      => true,
						'font-backup' => true,
						'color'       => false,
						'line-height' => false,
						'text-align'  => false,
						'font-size'   => false,
						'font-style'  => false,
						'font-weight' => false,
						'units'       => 'px',
						'default'     => array(
							'font-family' => 'Roboto',
							'google'      => true,
						),
					),

					// Background Pattern
					array(
						'id'       => 'site-bg-pat',
						'type'     => 'image_select',
						'title'    => __( 'Site Background Pattern', 'mixt' ),
						'subtitle' => __( 'The site\'s background pattern', 'mixt' ),
						'options'  => $img_patterns,
						'empty'    => true,
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
							'default'  => true,
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
							'required' => array( 'page-loader', '=', true ),
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
							'required' => array( 'page-loader-type', '=', '1' ),
						),

						// Page Loader Shape Color Select
						array(
							'id'          => 'page-loader-color',
							'type'        => 'color',
							'title'       => __( 'Loader Shape Color', 'mixt' ),
							'subtitle'    => __( 'Select a loader shape color', 'mixt' ),
							'required'    => array( 'page-loader-type', '=', '1' ),
							'transparent' => false,
							'default'     => '#ffffff',
							'validate'    => 'color',
						),

						// Page Loader Image Select
						array(
							'id'       => 'page-loader-img',
							'type'     => 'media',
							'url'      => false,
							'title'    => __( 'Loader Image', 'mixt' ),
							'subtitle' => __( 'Image to use for the loader', 'mixt' ),
							'required' => array( 'page-loader-type', '=', '2' ),
						),

						// Page Loader Background Color Select
						array(
							'id'          => 'page-loader-bg',
							'type'        => 'color',
							'title'       => __( 'Loader Background Color', 'mixt' ),
							'subtitle'    => __( 'The page loader background color', 'mixt' ),
							'required'    => array( 'page-loader', '=', true ),
							'transparent' => false,
							'default'     => '#539DDD',
							'validate'    => 'color',
						),

						// Page Loader Animation Select
						array(
							'id'       => 'page-loader-anim',
							'type'     => 'select',
							'title'    => __( 'Loader Animation', 'mixt' ),
							'subtitle' => __( 'Animation to use for the loader', 'mixt' ),
							'options'  => $page_loader_anims,
							'default'  => 'pulsate',
							'required' => array( 'page-loader', '=', true ),
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

						// Dynamic Stylesheet Mode
						array(
							'id'       => 'dynamic-sass',
							'type'     => 'switch',
							'title'    => __( 'Dynamic Sass Stylesheet', 'mixt' ),
							'subtitle' => __( 'Use Sass for dynamic styles, or regular CSS output in the head<br> Using Sass allows caching, but requires server write permissions', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => false,
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

						// Background Color
						array(
							'id'       => 'head-bg-color',
							'type'     => 'color',
							'title'    => __( 'Background Color', 'mixt' ),
							'subtitle' => __( 'Select a background color for the header', 'mixt' ),
							'transparent' => false,
							'validate' => 'color',
							'default'  => '#fafafa',
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
							'library_filter' => array( 'jpg', 'jpeg', 'png' ),
							'required'       => array( 'head-media-type', '=', 'image' ),
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
							'required' => array( 'head-media-type', '=', 'image' ),
						),

						// Image Select
						array(
							'id'       => 'head-img',
							'type'     => 'media',
							'title'    => __( 'Select Image', 'mixt' ),
							'subtitle' => __( 'Select an image from the gallery or upload one', 'mixt' ),
							'required' => array( 'head-img-src', '=', 'gallery' ),
						),

						// Repeat / Pattern Image
						array(
							'id'       => 'head-img-repeat',
							'type'     => 'switch',
							'title'    => __( 'Repeat / Pattern Image', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => true,
							'required' => array( 'head-media-type', '=', 'image' ),
						),

						// Parallax Effect
						array(
							'id'       => 'head-img-parallax',
							'type'     => 'switch',
							'title'    => __( 'Parallax Effect', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => false,
							'required' => array( 'head-media-type', '=', 'image' ),
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
							'required' => array( 'head-media-type', '=', 'video' ),
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
							'required' => array( 'head-video-src', '=', 'embed' ),
						),

						// Video Select
						array(
							'id'             => 'head-video',
							'type'           => 'media',
							'title'          => __( 'Video', 'mixt' ),
							'subtitle'       => __( 'Select a video from the gallery or upload one', 'mixt' ),
							'mode'           => 'webm, mp4, ogg',
							'library_filter' => array( 'webm', 'mp4', 'ogg' ),
							'placeholder'    => __( 'No video selected', 'mixt' ),
							'required'       => array( 'head-video-src', '=', 'local' ),
						),

						// Video Fallback Select
						array(
							'id'             => 'head-video-2',
							'type'           => 'media',
							'title'          => __( 'Video Fallback', 'mixt' ),
							'subtitle'       => __( 'Select a fallback video from the gallery or upload one', 'mixt' ),
							'mode'           => 'webm, mp4, ogg',
							'library_filter' => array( 'webm', 'mp4', 'ogg' ),
							'placeholder'    => __( 'No video selected', 'mixt' ),
							'required'       => array( 'head-video-src', '=', 'local' ),
						),

						// Video Poster
						array(
							'id'             => 'head-video-poster',
							'type'           => 'media',
							'title'          => __( 'Video Poster', 'mixt' ),
							'subtitle'       => __( 'Select an image to show while the video loads or if video is not supported', 'mixt' ),
							'mode'           => 'jpg, jpeg, png',
							'library_filter' => array( 'jpg', 'jpeg', 'png' ),
							'required'       => array( 'head-video-src', '=', 'local' ),
						),

						// Video Loop
						array(
							'id'       => 'head-video-loop',
							'type'     => 'switch',
							'title'    => __( 'Video Loop', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => true,
							'required' => array( 'head-video-src', '=', 'local' ),
						),

						// Video Luminance
						array(
							'id'       => 'head-video-lum',
							'type'     => 'switch',
							'title'    => __( 'Video Luminance', 'mixt' ),
							'subtitle' => __( 'Header text color will be adjusted based on this', 'mixt' ),
							'on'       => __( 'Light', 'mixt' ),
							'off'      => __( 'Dark', 'mixt' ),
							'default'  => true,
							'required' => array( 'head-media-type', '=', 'video' ),
						),

						// Slider ID
						array(
							'id'       => 'head-slider',
							'type'     => 'text',
							'title'    => __( 'Slider ID', 'mixt' ),
							'subtitle' => __( 'The ID of the slider to use', 'mixt' ),
							'required' => array( 'head-media-type', '=', 'slider' ),
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
							'default' => true,
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
							'required' => array( 'head-content-scroll', '=', true ),
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
							'title'   => __( 'Custom Code', 'mixt' ),
							'args' => array(
								'teeny'         => false,
								'wpautop'       => false,
								'media_buttons' => false,
								'textarea_rows' => '4',
							),
							'required' => array( 'head-content-code', '=', true ),
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
							'subtitle' => __( 'Select a background color for the location bar', 'mixt' ),
							'transparent' => false,
							'validate' => 'color',
							'required' => array('location-bar', '=', true),
						),

						// Background Pattern
						array(
							'id'       => 'loc-bar-bg-pat',
							'type'     => 'image_select',
							'title'    => __( 'Background Pattern', 'mixt' ),
							'subtitle' => __( 'Select a background image for the bar', 'mixt' ),
							'options'  => $img_patterns,
							'empty'    => true,
							'required' => array('location-bar', '=', true),
						),

						// Text Color
						array(
							'id'       => 'loc-bar-text-color',
							'type'     => 'color',
							'title'    => __( 'Text Color', 'mixt' ),
							'subtitle' => __( 'Select a text color for the location bar', 'mixt' ),
							'transparent' => false,
							'validate' => 'color',
							'required' => array('location-bar', '=', true),
						),

						// Text Color
						array(
							'id'       => 'loc-bar-border-color',
							'type'     => 'color',
							'title'    => __( 'Border Color', 'mixt' ),
							'subtitle' => __( 'Select a border color for the location bar', 'mixt' ),
							'transparent' => false,
							'validate' => 'color',
							'required' => array('location-bar', '=', true),
						),

						// Right Side Content
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


			// LOGO & FAVICON SECTION
			$this->sections[] = array(
				'title'      => __( 'Logo & Favicon', 'mixt' ),
				'desc'       => __( 'Configure the site\'s logo and favicon', 'mixt' ),
				'icon'       => 'el-icon-globe',
				'customizer' => false,
				'fields'     => array(

					// LOGO SECTION
					array(
						'id'       => 'logo-section',
						'type'     => 'section',
						'title'    => __( 'Logo', 'mixt' ),
						'indent'   => true,
					),

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
							'required' => array( 'logo-type', '=', 'img' ),
						),

						// Inverse Image Select
						array(
							'id'       => 'logo-img-inv',
							'type'     => 'media',
							'url'      => false,
							'title'    => __( 'Inverse Image', 'mixt' ),
							'subtitle' => __( 'Select an inverse logo image for dark backgrounds', 'mixt' ),
							'required' => array( 'logo-type', '=', 'img' ),
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
							'required' => array( 'logo-type', '=', 'img' ),
						),

						// Text Field
						array(
							'id'       => 'logo-text',
							'type'     => 'text',
							'title'    => __( 'Text', 'mixt' ),
							'subtitle' => __( 'Enter the logo text (leave empty to use the site name)', 'mixt' ),
							'required' => array( 'logo-type', '=', 'text' ),
						),

						// Text Style
						array(
							'id'             => 'logo-text-typo',
							'type'           => 'typography',
							'title'          => __( 'Text Style', 'mixt' ),
							'subtitle'       => __( 'Set up how you want your text logo to look', 'mixt' ),
							'required'       => array( 'logo-type', '=', 'text' ),
							'google'         => true,
							'font-backup'    => true,
							'line-height'    => false,
							'text-align'     => false,
							'text-transform' => true,
							'units'          => 'px',
							'default'        => array(
								'color'       => '#333333',
								'font-weight' => '500',
								'font-family' => 'Open Sans',
								'font-backup' => '',
								'google'      => true,
								'font-size'   => '24px',
								'text-transform' => '',
							),
						),

						// Text Inverse Color
						array(
							'id'       => 'logo-text-inv',
							'type'     => 'color',
							'title'    => __( 'Text Inverse Color', 'mixt' ),
							'subtitle' => __( 'Select an inverse logo text color for dark backgrounds', 'mixt' ),
							'transparent' => false,
							'validate' => 'color',
							'default'  => '#ffffff',
							'required' => array( 'logo-type', '=', 'text' ),
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
							'required' => array( 'logo-show-tagline', '=', true ),
						),

					// Divider
					array(
						'id'   => 'favicon-divider',
						'type' => 'divide',
					),

					// FAVICON SECTION
					array(
						'id'       => 'favicon-section',
						'type'     => 'section',
						'title'    => __( 'Favicon', 'mixt' ),
						'subtitle' => __( 'Set up the favicon (the icon that appears next to the site name in the browser)<br>MIXT will automatically generate icons in different sizes for most devices', 'mixt' ),
						'indent'   => true,
					),

						// Image Select
						array(
							'id'       => 'favicon-img',
							'type'     => 'media',
							'url'      => false,
							'title'    => __( 'Select Image', 'mixt' ),
							'subtitle' => __( 'Select the image you want to use as the site\'s favicon.<br><strong>For optimal results, select an image at least 200x200 pixels big</strong>', 'mixt' ),
						),

						// Rebuild Favicons
						array(
							'id'       => 'favicon-rebuild',
							'type'     => 'switch',
							'title'    => __( 'Rebuild Favicons', 'mixt' ),
							'subtitle' => __( 'Delete the old favicons and rebuild from new source', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => false,
						),

						// Saved Favicon HTML Code
						array(
							'id'       => 'favicon-html',
							'type'     => 'textarea',
							'title'    => __( 'Current Favicon Code', 'mixt' ),
							'subtitle' => __( 'This is the current favicon HTML, it <strong>will be replaced</strong> on each rebuild', 'mixt' ),
							'allowed_html' => array(
								'link' => array(
									'rel'   => array(),
									'type'  => array(),
									'sizes' => array(),
									'href'  => array(),
								),
							),
						),
				),
			);


			// NAVBAR SECTION
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
						),

						// Theme Select
						array(
							'id'       => 'nav-theme',
							'type'     => 'select',
							'title'    => __( 'Theme', 'mixt' ),
							'subtitle' => __( 'Select the theme for the primary navbar', 'mixt' ),
							'options'  => $nav_themes,
							'default'  => 'aqua',
						),

						// Texture
						array(
							'id'       => 'nav-texture',
							'type'     => 'image_select',
							'title'    => __( 'Texture', 'mixt' ),
							'subtitle' => __( 'Texture the navbar', 'mixt' ),
							'options'  => $img_textures,
							'empty'    => true,
						),

						// Padding
						array(
							'id'            => 'nav-padding',
							'type'          => 'slider',
							'title'         => __( 'Padding', 'mixt' ),
							'subtitle'      => __( 'Set the navbar\'s padding (in px) when at the top', 'mixt' ),
							'default'       => 20,
							'min'           => 0,
							'max'           => 50,
							'display_value' => 'text',
						),

						// Opacity
						array(
							'id'            => 'nav-opacity',
							'type'          => 'slider',
							'title'         => __( 'Opacity', 'mixt' ),
							'subtitle'      => __( 'Set the navbar\'s opacity when fixed', 'mixt' ),
							'default'       => 0.95,
							'step'          => 0.05,
							'min'           => 0,
							'max'           => 1,
							'resolution'    => 0.01,
							'display_value' => 'text',
						),

						// See-Through When Possible
						array(
							'id'       => 'nav-transparent',
							'type'     => 'button_set',
							'title'    => __( 'See-Through', 'mixt' ),
							'subtitle' => __( 'Make navbar transparent (when possible)', 'mixt' ),
							'options'  => array(
								'true'  => __( 'Yes', 'mixt' ),
								'false' => __( 'No', 'mixt' ),
							),
							'default'  => 'false',
						),

						// See-Through Opacity
						array(
							'id'            => 'nav-top-opacity',
							'type'          => 'slider',
							'title'         => __( 'See-Through Opacity', 'mixt' ),
							'subtitle'      => __( 'Set the navbar\'s see-through opacity', 'mixt' ),
							'default'       => 0.25,
							'step'          => 0.05,
							'min'           => 0,
							'max'           => 1,
							'resolution'    => 0.01,
							'display_value' => 'text',
							'required' => array('nav-transparent', '=', 'true'),
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
						),

						// Hover Item Background
						array(
							'id'       => 'nav-hover-bg',
							'type'     => 'button_set',
							'title'    => __( 'Hover Item Background', 'mixt' ),
							'subtitle' => __( 'Item background color on hover', 'mixt' ),
							'options'  => array(
								'true'  => __( 'Yes', 'mixt' ),
								'false' => __( 'No', 'mixt' ),
							),
							'default' => 'true',
						),

						// Active Item Bar
						array(
							'id'       => 'nav-active-bar',
							'type'     => 'button_set',
							'title'    => __( 'Active Item Bar', 'mixt' ),
							'subtitle' => __( 'Show an accent bar for active menu items', 'mixt' ),
							'options'  => array(
								'true'  => __( 'Yes', 'mixt' ),
								'false' => __( 'No', 'mixt' ),
							),
							'default' => 'true',
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
							'required' => array('nav-active-bar', '=', 'true'),
						),

						// Border Items
						array(
							'id'       => 'nav-bordered',
							'type'     => 'button_set',
							'title'    => __( 'Border Items', 'mixt' ),
							'subtitle' => __( 'Add borders to the navbar items', 'mixt' ),
							'options'  => array(
								'true'  => __( 'Yes', 'mixt' ),
								'false' => __( 'No', 'mixt' ),
							),
							'default'  => 'false',
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
							'default'  => 'ice-white',
							'required' => array('second-nav', '=', true),
						),

						// Texture
						array(
							'id'       => 'sec-nav-texture',
							'type'     => 'image_select',
							'title'    => __( 'Texture', 'mixt' ),
							'subtitle' => __( 'Texture the navbar', 'mixt' ),
							'options'  => $img_textures,
							'empty'    => true,
							'required' => array('second-nav', '=', true),
						),

						// Hover Item Background
						array(
							'id'       => 'sec-nav-hover-bg',
							'type'     => 'button_set',
							'title'    => __( 'Hover Item Background', 'mixt' ),
							'subtitle' => __( 'Item background color on hover', 'mixt' ),
							'options'  => array(
								'true'  => __( 'Yes', 'mixt' ),
								'false' => __( 'No', 'mixt' ),
							),
							'default' => 'true',
							'required' => array('second-nav', '=', true),
						),

						// Active Item Bar
						array(
							'id'       => 'sec-nav-active-bar',
							'type'     => 'button_set',
							'title'    => __( 'Active Item Bar', 'mixt' ),
							'subtitle' => __( 'Show an accent bar for active menu items', 'mixt' ),
							'options'  => array(
								'true'  => __( 'Yes', 'mixt' ),
								'false' => __( 'No', 'mixt' ),
							),
							'default' => 'false',
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
							'required' => array('sec-nav-active-bar', '=', 'true'),
						),

						// Border Items
						array(
							'id'       => 'sec-nav-bordered',
							'type'     => 'button_set',
							'title'    => __( 'Border Items', 'mixt' ),
							'subtitle' => __( 'Add borders to the navbar items', 'mixt' ),
							'options'  => array(
								'true'  => __( 'Yes', 'mixt' ),
								'false' => __( 'No', 'mixt' ),
							),
							'default'  => 'true',
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
							'allowed_html' => $sec_nav_allowed_html,
							'placeholder'  => $sec_nav_code_placeholder,
							'required'     => array('sec-nav-left-content', '=', '3'),
						),

						// Left Side Hide On Mobile
						array(
							'id'       => 'sec-nav-left-hide',
							'type'     => 'switch',
							'title'    => __( 'Left Hide On Mobile', 'mixt' ),
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
							'allowed_html' => $sec_nav_allowed_html,
							'placeholder'  => $sec_nav_code_placeholder,
							'required'     => array('sec-nav-right-content', '=', '3'),
						),

						// Right Side Hide On Mobile
						array(
							'id'       => 'sec-nav-right-hide',
							'type'     => 'switch',
							'title'    => __( 'Right Hide On Mobile', 'mixt' ),
							'on'       => __( 'Yes', 'mixt' ),
							'off'      => __( 'No', 'mixt' ),
							'default'  => false,
							'required' => array('sec-nav-right-content', '!=', '0'),
						),
				),
			);

			// SIDEBAR SECTION
			$this->sections[] = array(
				'title'      => __( 'Sidebar', 'mixt' ),
				'desc'       => __( 'Configure the sidebar and its appearance', 'mixt' ),
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

					// Additional Sidebars
					array(
						'id'       => 'reg-sidebars',
						'type'     => 'multi_input',
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
							'full'      => __( 'Full', 'mixt' ),
							'excerpt'   => __( 'Excerpt', 'mixt' ),
						),
						'default'  => 'full',
					),

					// Post Excerpt Limit
					array(
						'id'            => 'post-excerpt-length',
						'type'          => 'slider',
						'title'         => __( 'Excerpt Limit', 'mixt' ),
						'subtitle'      => __( 'Set a maximum excerpt length (in words)', 'mixt' ),
						'default'       => 55,
						'min'           => 1,
						'max'           => 200,
						'display_value' => 'text',
						'required'      => array('post-content', '=', 'excerpt'),
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
			$this->sections[] = postsPageFields('category', 'folder-close');

			// DATE PAGE SECTION
			$this->sections[] = postsPageFields('date', 'time');

			// SEARCH PAGE SECTION
			$this->sections[] = postsPageFields('search', 'search', array( 'sidebar' => 'false', 'feat-show' => false, 'meta-show' => 'false' ));

			// TAG PAGE SECTION
			$this->sections[] = postsPageFields('tag', 'tag');


			// POSTS SECTION
			$this->sections[] = array(
				'title'      => __( 'Posts', 'mixt' ),
				'desc'       => __( 'Configure the post\'s appearance', 'mixt' ),
				'icon'       => 'el-icon-pencil',
				'customizer' => false,
				'fields'     => array(

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

					// About The Author
					array(
						'id'       => 'post-about-author',
						'type'     => 'switch',
						'title'    => __( 'About The Author', 'mixt' ),
						'subtitle' => __( 'Show info about the author', 'mixt' ),
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

						// Related Posts Number
						array(
							'id'       => 'post-related-number',
							'type'     => 'spinner',
							'title'    => __( 'Number', 'mixt' ),
							'subtitle' => __( 'How many related posts to display', 'mixt' ),
							'max'      => '10',
							'min'      => '2',
							'step'     => '1',
							'default'  => '3',
							'required' => array('post-related', '=', true),
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
						),

						// Related Posts
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

						// Related Posts Featured Media Placeholder
						array(
							'id'             => 'post-related-feat-ph',
							'type'           => 'media',
							'title'          => __( 'Featured Media Placeholder', 'mixt' ),
							'subtitle'       => __( 'Select a placeholder image to show if a post does not have any featured media', 'mixt' ),
							'mode'           => 'jpg, jpeg, png',
							'library_filter' => array( 'jpg', 'jpeg', 'png' ),
							'required' => array('post-related', '=', true),
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
						'subtitle'    => __( 'Your user and API key. Get them <a href="https://bitly.com/a/settings/advanced">here</a>', 'mixt' ),
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
						'type'     => 'multi_input',
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
								'icon'        => 'el-icon-idea',
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
						'title'    => __( '&quot;Logged in as&quot;', 'mixt' ),
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


			// DIVIDER
			$this->sections[] = array(
				'type' => 'divide',
			);


			// THEMES SECTION
			$this->sections[] = array(
				'title'      => __( 'Themes', 'mixt' ),
				'desc'       => __( 'Create and manage site-wide themes', 'mixt' ),
				'icon'       => 'el-icon-leaf',
				'customizer' => false,
				'fields'     => array(

					array(
						'id'       => 'site-themes',
						'type'     => 'multi_input',
						'no_title' => true,
						'sortable' => true,
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

							// Text Color
							'text' => array(
								'type'  => 'color',
								'label' => __( 'Text Color' ),
							),

							// Text Color Fade
							'text-fade' => array(
								'type'  => 'color',
								'label' => __( 'Text Color Fade' ),
							),

							// Text Inverse Color
							'inv-text' => array(
								'type'  => 'color',
								'label' => __( 'Inverse Text Color' ),
							),

							// Text Inverse Color Fade
							'inv-text-fade' => array(
								'type'  => 'color',
								'label' => __( 'Inverse Text Fade' ),
							),

							// Border Color
							'border' => array(
								'type'  => 'color',
								'label' => __( 'Border Color', 'mixt' ),
							),

							// Accent
							'accent' => array(
								'type'  => 'color',
								'label' => __( 'Accent', 'mixt' ),
							),

							// Link Color
							'link' => array(
								'type'  => 'color',
								'label' => __( 'Link Color', 'mixt' ),
							),
						),
						'default' => $site_default_themes,
					),
				),
			);

			// Navbar THEMES SECTION
			$this->sections[] = array(
				'title'      => __( 'Navbar Themes', 'mixt' ),
				'desc'       => __( 'Create and manage themes for the navbar', 'mixt' ),
				'icon'       => 'el-icon-minus',
				'customizer' => false,
				'subsection' => true,
				'fields'     => array(

					array(
						'id'       => 'nav-themes',
						'type'     => 'multi_input',
						'no_title' => true,
						'sortable' => true,
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

							// Background Color
							'bg' => array(
								'type'  => 'color',
								'label' => __( 'Background Color', 'mixt' ),
							),

							// Border Color
							'border' => array(
								'type'  => 'color',
								'label' => __( 'Border Color', 'mixt' ),
							),

							// Text Color
							'text' => array(
								'type'  => 'color',
								'label' => __( 'Text Color' ),
							),

							// Inverse Text Color
							'inv-text' => array(
								'type'  => 'color',
								'label' => __( 'Inverse Text Color' ),
							),

							// Accent
							'accent' => array(
								'type'  => 'color',
								'label' => __( 'Accent', 'mixt' ),
							),

							// Inverse Accent
							'inv-accent' => array(
								'type'  => 'color',
								'label' => __( 'Inverse Accent', 'mixt' ),
							),

							// Menu Background Color
							'menu-bg' => array(
								'type'  => 'color',
								'label' => __( 'Menu Background', 'mixt' ),
							),

							// Menu Border Color
							'menu-border' => array(
								'type'  => 'color',
								'label' => __( 'Menu Border', 'mixt' ),
							),

							// RGBA Check
							'rgba' => array(
								'type'       => 'checkbox',
								'label'      => __( 'Enable RGBA', 'mixt' ),
								'wrap_class' => 'rgba-field',
							),
						),
						'default' => $nav_default_themes,
					),
				),
			);

			// TYPOGRAPHY
			$this->sections[] = array(
				'title'   => __( 'Typography', 'mixt' ),
				'icon'    => 'el-icon-font',
				'fields'  => array(

					// Web Fonts
					array(
						'id'       => 'opt-web-fonts',
						'type'     => 'media',
						'title'    => __( 'Web Fonts', 'mixt' ),
						'compiler' => 'true',
						'mode'     => false,
						// Can be set to false to allow any media type, or can also be set to any mime type.
						'desc'     => __( 'Basic media uploader with disabled URL input field.', 'mixt' ),
						'subtitle' => __( 'Upload any media using the WordPress native uploader', 'mixt' ),
						'hint'     => array(
							//'title'     => '',
							'content' => 'This is a <b>hint</b> tool-tip for the webFonts field.<br/><br/>Add any HTML based text you like here.',
						)
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
						'type'     => 'multi_input',
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
								'icon'        => 'el-icon-idea',
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

			$theme_info = '<div class="redux-framework-section-desc">';
			$theme_info .= '<p class="redux-framework-theme-data description theme-uri">' . __( '<strong>Theme URL:</strong> ', 'mixt' ) . '<a href="' . $this->theme->get( 'ThemeURI' ) . '" target="_blank">' . $this->theme->get( 'ThemeURI' ) . '</a></p>';
			$theme_info .= '<p class="redux-framework-theme-data description theme-author">' . __( '<strong>Author:</strong> ', 'mixt' ) . $this->theme->get( 'Author' ) . '</p>';
			$theme_info .= '<p class="redux-framework-theme-data description theme-version">' . __( '<strong>Version:</strong> ', 'mixt' ) . $this->theme->get( 'Version' ) . '</p>';
			$theme_info .= '<p class="redux-framework-theme-data description theme-description">' . $this->theme->get( 'Description' ) . '</p>';
			$tabs = $this->theme->get( 'Tags' );
			if ( ! empty( $tabs ) ) {
				$theme_info .= '<p class="redux-framework-theme-data description theme-tags">' . __( '<strong>Tags:</strong> ', 'mixt' ) . implode( ', ', $tabs ) . '</p>';
			}
			$theme_info .= '</div>';

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
				'icon'            => 'el-icon-list-alt',
				'title'           => __( 'Customizer Only', 'mixt' ),
				'desc'            => __( '<p class="description">This Section should be visible only in Customizer</p>', 'mixt' ),
				'customizer_only' => true,
				'fields'          => array(
					array(
						'id'              => 'opt-customizer-only',
						'type'            => 'select',
						'title'           => __( 'Customizer Only Option', 'mixt' ),
						'subtitle'        => __( 'The subtitle is NOT visible in customizer', 'mixt' ),
						'desc'            => __( 'The field desc is NOT visible in customizer.', 'mixt' ),
						'customizer_only' => true,
						'options'         => array(
							'1' => 'Opt 1',
							'2' => 'Opt 2',
							'3' => 'Opt 3'
						),
						'default'         => '2'
					),
				)
			);

			$this->sections[] = array(
				'title'  => __( 'Import / Export', 'mixt' ),
				'desc'   => __( 'Import and Export theme settings from file, text or URL.', 'mixt' ),
				'icon'   => 'el-icon-refresh',
				'fields' => array(
					array(
						'id'         => 'opt-import-export',
						'type'       => 'import_export',
						'title'      => 'Import Export',
						'subtitle'   => 'Save and restore your theme options',
						'full_width' => false,
					),
				),
			);

			$this->sections[] = array(
				'type' => 'divide',
			);

			$this->sections[] = array(
				'icon'   => 'el-icon-list-alt',
				'title'  => __( 'About MIXT', 'mixt' ),
				'desc'   => __( '<p class="description">Something about this wonderful theme here.</p>', 'mixt' ),
				'fields' => array(
					array(
						'id'      => 'opt-raw-info',
						'type'    => 'raw',
						'content' => $item_info,
					),

					// Auto-Update Login
					array(
						'id'          => 'tf-update-login',
						'type'        => 'password',
						'title'       => __( 'Auto Update - ThemeForest login', 'mixt' ),
						'subtitle'    => __( 'Your TF user and API key to enable auto-updates for MIXT', 'mixt' ),
						'username'    => true,
						'placeholder' => array(
							'username' => __( 'Enter your Username', 'mixt' ),
							'password' => __( 'Enter your API Key', 'mixt' ),
						),
					),
				),
			);

			if ( file_exists( trailingslashit( dirname( __FILE__ ) ) . 'README.html' ) ) {
				$tabs['docs'] = array(
					'icon'    => 'el-icon-book',
					'title'   => __( 'Documentation', 'mixt' ),
					'content' => nl2br( file_get_contents( trailingslashit( dirname( __FILE__ ) ) . 'README.html' ) )
				);
			}
		}

		public function setHelpTabs() {

			$mixt_help_file = function($file) {
				$file_path = MIXT_DIR . "/mixt-modules/help/$file.html";

				if ( file_exists($file_path) ) {
					return file_get_contents($file_path);
				} else {
					return "<p>Unable to find help file <strong>$file.html</strong></p>";
				}
			};

			// Custom page help tabs, displayed using the help API. Tabs are shown in order of definition.
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
			$this->args['help_sidebar'] = '<p>The latest documentation is available at the <br>' .
										  '<a class="button button-primary" href="https://bitbucket.org/nova-inc/mixt-docs/" target="_blank">MIXT Wiki</a></p>';
		}

		/**
		 * All the possible arguments for Redux.
		 * For full documentation on arguments, please refer to: https://github.com/ReduxFramework/ReduxFramework/wiki/Arguments
		 * */
		public function setArguments() {

			$theme = wp_get_theme(); // For use with some settings. Not necessary.

			$this->args = array(
				// TYPICAL -> Change these values as you need/desire
				'opt_name'             => 'mixt_opt',
				// This is where your data is stored in the database and also becomes your global variable name.
				'display_name'         => $theme->get( 'Name' ),
				// Name that appears at the top of your panel
				'display_version'      => $theme->get( 'Version' ),
				// Version that appears at the top of your panel
				'menu_type'            => 'menu',
				//Specify if the admin menu should appear or not. Options: menu or submenu (Under appearance only)
				'allow_sub_menu'       => true,
				// Show the sections below the admin menu item or not
				'menu_title'           => __( 'MIXT', 'mixt' ),
				'page_title'           => __( 'MIXT Options', 'mixt' ),
				// You will need to generate a Google API key to use this feature.
				// Please visit: https://developers.google.com/fonts/docs/developer_api#Auth
				'google_api_key'       => 'AIzaSyANZToOjYpoewv8b-GpX4LOOVZXC_08tD0',
				// Set it you want google fonts to update weekly. A google_api_key value is required.
				'google_update_weekly' => false,
				// Must be defined to add google fonts to the typography module
				'async_typography'     => true,
				// Use a asynchronous font on the front end or font string
				//'disable_google_fonts_link' => true,                    // Disable this in case you want to create your own google fonts loader
				'admin_bar'            => true,
				// Show the panel pages on the admin bar
				'admin_bar_icon'     => 'dashicons-admin-generic',
				// Choose an icon for the admin bar menu
				'admin_bar_priority' => '31.6497',
				// Choose an priority for the admin bar menu
				'global_variable'      => '',
				// Set a different name for your global variable other than the opt_name
				'dev_mode'             => true,
				// Show the time the page took to load, etc
				'update_notice'        => true,
				// If dev_mode is enabled, will notify developer of updated versions available in the GitHub Repo
				'customizer'           => true,
				// Enable basic customizer support
				//'open_expanded'     => true,                    // Allow you to start the panel in an expanded way initially.
				//'disable_save_warn' => true,                    // Disable the save warning when a user changes a field

				// OPTIONAL -> Give you extra features
				'page_priority'        => '59.6497',
				// Order where the menu appears in the admin area. If there is any conflict, something will not show. Warning.
				'page_parent'          => 'themes.php',
				// For a full list of options, visit: http://codex.wordpress.org/Function_Reference/add_submenu_page#Parameters
				'page_permissions'     => 'manage_options',
				// Permissions needed to access the options panel.
				'menu_icon'            => 'dashicons-screenoptions',
				// Specify a custom URL to an icon
				'last_tab'             => '',
				// Force your panel to always open to a specific tab (by id)
				'page_icon'            => 'icon-themes',
				// Icon displayed in the admin panel next to your menu_title
				'page_slug'            => 'mixt_options',
				// Page slug used to denote the panel
				'save_defaults'        => true,
				// On load save the defaults to DB before user clicks save or not
				'default_show'         => false,
				// If true, shows the default value next to each field that is not the default value.
				'default_mark'         => '',
				// What to print by the field's title if the value shown is default. Suggested: *
				'show_import_export'   => true,
				// Shows the Import/Export panel when not used as a field.

				'sass' => array (
					'enabled'     => true,
					'page_output' => false
				),

				'ajax_save' => true,

				'templates_path' => MIXT_DIR . '/templates/redux-templates',

				// CAREFUL -> These options are for advanced use only
				'transient_time'       => 60 * MINUTE_IN_SECONDS,
				'output'               => true,
				// Global shut-off for dynamic CSS output by the framework. Will also disable google fonts output
				'output_tag'           => true,
				// Allows dynamic CSS to be generated for customizer and google fonts, but stops the dynamic CSS from going to the head
				// 'footer_credit'     => '',                   // Disable the footer credit of Redux. Please leave if you can help it.

				// FUTURE -> Not in use yet, but reserved or partially implemented. Use at your own risk.
				'database'             => '',
				// possible: options, theme_mods, theme_mods_expanded, transient. Not fully functional, warning!
				'system_info'          => false,
				// REMOVE

				// HINTS
				'hints'                => array(
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
			$this->args['admin_bar_links'][] = array(
				'id'    => 'redux-docs',
				'href'   => 'http://docs.reduxframework.com/',
				'title' => __( 'Documentation', 'mixt' ),
			);

			// SOCIAL ICONS -> Setup custom links in the footer for quick links in your panel footer icons.
			// $this->args['share_icons'][] = array(
			//     'url'   => 'https://www.facebook.com/novalexdesign',
			//     'title' => 'Like novalex on Facebook',
			//     'icon'  => 'el-icon-facebook'
			// );

			// Panel Intro text -> before the form
			// $this->args['intro_text'] = __( '', 'mixt' );

			// Add content after the form.
			$this->args['footer_text'] = __( '<p>MiXT by <a href="http://novalx.com/">novalex</a></p>', 'mixt' );
		}

		public function validate_callback_function( $field, $value, $existing_value ) {
			$error = true;
			$value = 'just testing';

			/*
		  do your validation

		  if(something) {
			$value = $value;
		  } elseif(something else) {
			$error = true;
			$value = $existing_value;

		  }
		 */

			$return['value'] = $value;
			$field['msg']    = 'your custom error message';
			if ( $error == true ) {
				$return['error'] = $field;
			}

			return $return;
		}

		public function class_field_callback( $field, $value ) {
			print_r( $field );
			echo '<br/>CLASS CALLBACK';
			print_r( $value );
		}

	}

	global $mixtConfig;
	$mixtConfig = new Redux_MIXT_config();
} else {
	echo "The class named Redux_MIXT_config has already been called. <strong>Developers, you need to prefix this class with your company name or you'll run into problems!</strong>";
}

/**
 * Custom function for the callback referenced above
 */
if ( ! function_exists( 'redux_my_custom_field' ) ):
	function redux_my_custom_field( $field, $value ) {
		print_r( $field );
		echo '<br/>';
		print_r( $value );
	}
endif;

/**
 * Custom function for the callback validation referenced above
 * */
if ( ! function_exists( 'redux_validate_callback_function' ) ):
	function redux_validate_callback_function( $field, $value, $existing_value ) {
		$error = true;
		$value = 'just testing';

		/*
	  do your validation

	  if(something) {
		$value = $value;
	  } elseif(something else) {
		$error = true;
		$value = $existing_value;

	  }
	 */

		$return['value'] = $value;
		$field['msg']    = 'your custom error message';
		if ( $error == true ) {
			$return['error'] = $field;
		}

		return $return;
	}

endif;