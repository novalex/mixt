<?php

/* ------------------------------------------------ /
MIXT Redux Config
/ ------------------------------------------------ */

if ( ! class_exists( 'Redux_MIXT_config' ) ) {

	class Redux_MIXT_config {

		public $args = array();
		public $sections = array();
		public $theme;
		public $ReduxFramework;

		public function __construct() {

			if ( ! class_exists( 'ReduxFramework' ) ) {
				return;
			}

			// This is needed. Bah WordPress bugs.  ;)
			// if ( true == Redux_Helpers::isTheme(__FILE__) ) {
			// 	$this->initSettings();
			// } else {
			// 	add_action('plugins_loaded', array($this, 'initSettings'), 10);
			// }

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
			$nav_themes = mixt_get_themes('nav');
			$nav_default_themes = get_option('nav-default-themes');

			// Background Patterns
			$bg_patterns = mixt_bg_pattern_img();

			// Social Networks
			$social_profiles = mixt_preset_social_profiles();


			// DECLARATION OF SECTIONS

			// GLOBAL OPTIONS SECTION
			$this->sections[] = array(
				'title'  => __( 'Global Options', 'mixt' ),
				'desc'   => __( 'Customize the site&#39;s global options and settings', 'mixt' ),
				'icon'   => 'el-icon-off',
				'fields' => array(

					// Background Type
					array(
						'id'       => 'background-type',
						'type'     => 'button_set',
						'title'    => __( 'Site Background Type', 'mixt' ),
						'subtitle' => __( 'Use a color, image or both for the site background', 'mixt' ),
						'options'  => array(
							'1' => 'Color',
							'2' => 'Image',
							'3' => 'Both',
						),
						'default'  => '1',
					),

					// Background Color
					array(
						'id'          => 'background-color',
						'type'        => 'color',
						'title'       => __( 'Site Background Color', 'mixt' ),
						'subtitle'    => __( 'The site&#39;s background color', 'mixt' ),
						'required'    => array( 'background-type', 'not', '2' ),
						'transparent' => false,
						'default'     => '#FFFFFF',
						'validate'    => 'color',
					),

					// Background Pattern
					array(
						'id'       => 'background-pattern',
						'type'     => 'image_select',
						'title'    => __( 'Site Background Pattern', 'mixt' ),
						'subtitle' => __( 'The site&#39;s background pattern', 'mixt' ),
						'options'  => $bg_patterns,
						'required' => array( 'background-type', 'not', '1' ),
					),

					// Divider
					array(
						'id'   => 'global-divider-1',
						'type' => 'divide',
					),

					// Page Loader
					array(
						'id'       => 'page-loader',
						'type'     => 'switch',
						'title'    => __( 'Show Page Loader', 'mixt' ),
						'subtitle' => __( 'Enable page (pre)loader to show animations when loading site', 'mixt' ),
						'on'       => 'Yes',
						'off'      => 'No',
						'default'  => true,
					),

					// Page Loader Type
					array(
						'id'       => 'page-loader-type',
						'type'     => 'button_set',
						'title'    => __( 'Loader Type', 'mixt' ),
						'subtitle' => __( 'Use a shape or image for the loader', 'mixt' ),
						'options'  => array(
							'1' => 'Shape',
							'2' => 'Image',
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
							'circle'  => 'Circle',
							'ring'    => 'Ring',
							'square'  => 'Square',
							'square2' => 'Empty Square',
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

					// Page Metaboxes
					array(
						'id'       => 'page-metaboxes',
						'type'     => 'switch',
						'title'    => __( 'Show Page Option Metaboxes', 'mixt' ),
						'subtitle' => __( 'Enable option metaboxes when editing pages or posts', 'mixt' ),
						'on'       => 'Yes',
						'off'      => 'No',
						'default'  => true,
					),
				),
			);


			// HEADER SECTION
			$this->sections[] = array(
				'title'  => __( 'Header', 'mixt' ),
				'desc'   => __( 'Customize the site header', 'mixt' ),
				'icon'   => 'el-icon-screen',
				'fields' => array(

					// Show Admin Bar
					array(
						'id'       => 'show-admin-bar',
						'type'     => 'switch',
						'title'    => __( 'Show WP Admin Bar', 'mixt' ),
						'subtitle' => __( 'Show or hide the Wordpress administration bar at the top of the page', 'mixt' ),
						'on'       => 'Yes',
						'off'      => 'No',
						'default'  => true,
					),

					// Logo Type
					array(
						'id'       => 'logo-type',
						'type'     => 'button_set',
						'title'    => __( 'Logo Type', 'mixt' ),
						'subtitle' => __( 'Display text or an image as the logo', 'mixt' ),
						'options'  => array(
							'img'  => 'Image',
							'text' => 'Text',
						),
						'default'  => 'text',
					),

					// Logo Image Select
					array(
						'id'       => 'logo-img',
						'type'     => 'media',
						'url'      => false,
						'title'    => __( 'Logo Image', 'mixt' ),
						'subtitle' => __( 'Select the image you want to use as the site&#39;s logo', 'mixt' ),
						'required' => array( 'logo-type', '=', 'img' ),
					),

					// Logo Image Inverse Select
					array(
						'id'       => 'logo-img-inv',
						'type'     => 'media',
						'url'      => false,
						'title'    => __( 'Inverse Logo Image', 'mixt' ),
						'subtitle' => __( 'Select an inverse logo image for dark backgrounds', 'mixt' ),
						'required' => array( 'logo-type', '=', 'img' ),
					),

					// Hi-Res Logo
					array(
						'id'       => 'logo-img-hr',
						'type'     => 'switch',
						'title'    => __( 'Hi-Res Logo', 'mixt' ),
						'subtitle' => __( 'Display logo at half size so it will look sharp on high-resolution screens like Retina', 'mixt' ),
						'on'       => 'Yes',
						'off'      => 'No',
						'default'  => true,
						'required' => array( 'logo-type', '=', 'img' ),
					),

					// Logo Text Field
					array(
						'id'       => 'logo-text',
						'type'     => 'text',
						'title'    => __( 'Logo Text', 'mixt' ),
						'subtitle' => __( 'Enter the logo text (leave empty to use the site name)', 'mixt' ),
						'required' => array( 'logo-type', '=', 'text' ),
					),

					// Logo Text Style
					array(
						'id'             => 'logo-text-typo',
						'type'           => 'typography',
						'title'          => __( 'Logo Text Style', 'mixt' ),
						'subtitle'       => __( 'Set up how you want your text logo to look', 'mixt' ),
						'required'       => array( 'logo-type', '=', 'text' ),
						'google'         => true,
						'font-backup'    => true,
						'line-height'    => false,
						'text-align'     => false,
						'text-transform' => true,
						'units'          => 'px',
						'default'        => array(
							'font-style'  => '500',
							'font-family' => 'Open Sans',
							'google'      => true,
							'font-size'   => '24px',
						),
					),

					// Logo Text Inverse Color
					array(
						'id'       => 'logo-text-inv',
						'type'     => 'color',
						'title'    => __( 'Logo Text Inverse Color', 'mixt' ),
						'subtitle' => __( 'Select an inverse logo text color for dark backgrounds', 'mixt' ),
						'transparent' => false,
						'validate' => 'color',
						'required' => array( 'logo-type', '=', 'text' ),
					),

					// Logo Shrink
					array(
						'id'       => 'logo-shrink',
						'type'     => 'spinner',
						'title'    => __( 'Shrink Logo', 'mixt' ),
						'subtitle' => __( 'Amount of pixels the logo will shrink when the navbar is fixed <br>(0 means no shrink)', 'mixt' ),
						'max'      => '20',
						'step'     => '1',
						'default'  => '6',
					),

					// Show Tagline
					array(
						'id'       => 'logo-show-tagline',
						'type'     => 'switch',
						'title'    => __( 'Show Tagline', 'mixt' ),
						'subtitle' => __( 'Show the site&#39;s tagline (or a custom one) next to the logo', 'mixt' ),
						'on'       => 'Yes',
						'off'      => 'No',
						'default'  => false,
					),

					// Logo Tagline Text
					array(
						'id'       => 'logo-tagline',
						'type'     => 'text',
						'title'    => __( 'Custom Tagline', 'mixt' ),
						'subtitle' => __( 'Enter a custom tagline (leave empty to use the site tagline)', 'mixt' ),
						'required' => array( 'logo-show-tagline', '=', true ),
					),
				),
			);


			// NAVBAR SECTION
			$this->sections[] = array(
				'title'  => __( 'Navbars', 'mixt' ),
				'desc'   => __( 'Customize the primary and secondary navbars', 'mixt' ),
				'icon'   => 'el-icon-minus',
				'fields' => array(

					// Global Navbar Section
					array(
						'id'       => 'global-nav-section',
						'type'     => 'section',
						'indent'   => true,
					),
					
						// Navbar Icons
						array(
							'id'       => 'nav-menu-icons',
							'type'     => 'switch',
							'title'    => __( 'Show Menu Icons', 'mixt' ),
							'subtitle' => __( 'Enable icons for menu items', 'mixt' ),
							'on'       => 'Yes',
							'off'      => 'No',
							'default'  => true,
						),

						// Navbar Dropdown Arrows
						array(
							'id'       => 'nav-menu-arrows',
							'type'     => 'switch',
							'title'    => __( 'Show Menu Dropdown Arrows', 'mixt' ),
							'subtitle' => __( 'Enable arrows for menu items with dropdowns', 'mixt' ),
							'on'       => 'Yes',
							'off'      => 'No',
							'default'  => true,
						),

					// Divider
					array(
						'id'   => 'navbar-divider',
						'type' => 'divide',
					),

					// Primary Navbar Section
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
								'1' => 'Left',
								'2' => 'Center',
								'3' => 'Right',
							),
							'default'  => '1',
						),

						// Navbar Mode
						array(
							'id'       => 'nav-mode',
							'type'     => 'button_set',
							'title'    => __( 'Mode', 'mixt' ),
							'subtitle' => __( 'Navbar fixed (scrolls with page) or static (stays at the top)', 'mixt' ),
							'options'  => array(
								'fixed'  => 'Fixed',
								'static' => 'Static',
							),
							'default'  => 'fixed',
						),

						// Navbar Color Scheme
						array(
							'id'       => 'nav-scheme',
							'type'     => 'button_set',
							'title'    => __( 'Color Scheme', 'mixt' ),
							'subtitle' => __( 'Navbar color scheme', 'mixt' ),
							'options'  => array(
								'1' => 'Light',
								'2' => 'Dark',
								'3' => 'Custom',
							),
							'default'  => '1',
						),

						// Navbar Theme Select
						array(
							'id'       => 'nav-theme',
							'type'     => 'select',
							'title'    => __( 'Theme', 'mixt' ),
							'subtitle' => __( 'Select the theme for the primary navbar', 'mixt' ),
							'options'  => $nav_themes,
							'default'  => '',
						),

						// Navbar Dropdown (Submenu) Scheme
						array(
							'id'       => 'nav-sub-scheme',
							'type'     => 'button_set',
							'title'    => __( 'Menu Color Scheme', 'mixt' ),
							'subtitle' => __( 'Light or dark dropdown menu color scheme', 'mixt' ),
							'options'  => array(
								'light' => 'Light',
								'dark'  => 'Dark',
							),
							'default'  => 'light',
						),

						// Navbar Trnansparent When Possible
						array(
							'id'       => 'nav-transparent',
							'type'     => 'button_set',
							'title'    => __( 'See-Through', 'mixt' ),
							'subtitle' => __( 'Make navbar transparent when possible', 'mixt' ),
							'options'  => array(
								'true'  => 'Yes',
								'false' => 'No',
							),
							'default'  => 'true',
						),

					// Divider
					array(
						'id'   => 'navbar-divider-2',
						'type' => 'divide',
					),

					// Secondary Navbar Section
					array(
						'id'       => 'secondary-nav-section',
						'type'     => 'section',
						'title'    => __( 'Secondary Navbar', 'mixt' ),
						'subtitle' => __( 'Settings for the secondary navbar', 'mixt' ),
						'indent'   => true,
					),

						// Secondary Navbar Switch
						array(
							'id'       => 'second-nav',
							'type'     => 'switch',
							'title'    => __( 'Enable Secondary Navbar', 'mixt' ),
							'subtitle' => __( 'Show the secondary navbar above the header', 'mixt' ),
							'on'       => 'Yes',
							'off'      => 'No',
							'default'  => false,
						),

						// Secondary Navbar Color Scheme
						array(
							'id'       => 'sec-nav-scheme',
							'type'     => 'switch',
							'title'    => __( 'Color Scheme', 'mixt' ),
							'subtitle' => __( 'Light or dark navbar color scheme', 'mixt' ),
							'on'       => 'Light',
							'off'      => 'Dark',
							'default'  => true,
							'required' => array('second-nav', '=', true),
						),

						// Secondary Navbar Background Color
						array(
							'id'       => 'sec-nav-background',
							'type'     => 'color',
							'title'    => __('Background Color', 'mixt'),
							'subtitle' => __( 'Navbar background color', 'mixt' ),
							'validate' => 'color',
							'required' => array('second-nav', '=', true),
						),

						// Secondary Navbar Dropdown (Submenu) Scheme
						array(
							'id'       => 'sec-nav-sub-scheme',
							'type'     => 'button_set',
							'title'    => __( 'Menu Color Scheme', 'mixt' ),
							'subtitle' => __( 'Light or dark dropdown menu color scheme', 'mixt' ),
							'options'  => array(
								'light' => 'Light',
								'dark'  => 'Dark',
							),
							'default'  => 'light',
							'required' => array('second-nav', '=', true),
						),

						// Secondary Navbar Left Side Content
						array(
							'id'       => 'sec-nav-left-content',
							'type'     => 'select',
							'title'    => __( 'Left Side Content', 'mixt' ),
							'subtitle' => __( 'Content to show on the left side of the navbar', 'mixt' ),
							'options'  => array(
								'0' => 'No Content',
								'1' => 'Navigation',
								'2' => 'Social Icons',
								'3' => 'Custom Text / Code',
							),
							'default'  => '0',
							'required' => array('second-nav', '=', true),
						),

						// Secondary Navbar Left Side Code
						array(
							'id'           => 'sec-nav-left-code',
							'type'         => 'textarea',
							'title'        => __( 'Left Side Code', 'mixt' ),
							'subtitle'     => __( 'Text or code to display on the left side', 'mixt' ),
							'allowed_html' => array(
								'link'   => array(
									'href'  => array(),
									'title' => array(),
								),
								'strong' => array(),
								'em'     => array(),
							),
							'placeholder'  => 'Allowed HTML tags and attributes: <a href="" title="">, <strong>, <em>',
							'required'     => array('sec-nav-left-content', '=', '3'),
						),

						// Secondary Navbar Right Side Content
						array(
							'id'       => 'sec-nav-right-content',
							'type'     => 'select',
							'title'    => __( 'Right Side Content', 'mixt' ),
							'subtitle' => __( 'Content to show on the right side of the navbar', 'mixt' ),
							'options'  => array(
								'0' => 'No Content',
								'1' => 'Navigation',
								'2' => 'Social Icons',
								'3' => 'Custom Text / Code',
							),
							'default'  => '0',
							'required' => array('second-nav', '=', true),
						),

						// Secondary Navbar Right Side Code
						array(
							'id'           => 'sec-nav-right-code',
							'type'         => 'textarea',
							'title'        => __( 'Right Side Code', 'mixt' ),
							'subtitle'     => __( 'Text or code to display on the right side', 'mixt' ),
							'allowed_html' => array(
								'link'   => array(
									'href'  => array(),
									'title' => array(),
								),
								'strong' => array(),
								'em'     => array(),
							),
							'placeholder'  => 'Allowed HTML tags and attributes: <a href="" title="">, <strong>, <em>',
							'required'     => array('sec-nav-right-content', '=', '3'),
						),

				),
			);


			// DIVIDER
			$this->sections[] = array(
				'type' => 'divide',
			);


			// CUSTOM THEMES SECTION
			$this->sections[] = array(
				'title'      => __( 'Themes', 'mixt' ),
				'desc'       => __( 'Create and manage custom themes', 'mixt' ),
				'icon'       => 'el-icon-leaf',
				'fields'     => array(

					// Divider
					array(
						'id'   => 'themes-section',
						'type' => 'divide',
					),

					// Sitewide Themes
					array(
						'id'       => 'site-themes-section',
						'type'     => 'section',
						'title'    => __( 'Site-Wide Themes', 'mixt' ),
						'indent'   => true,
					),

						// Site Themes
						array(
							'id'       => 'site-themes',
							'type'     => 'multi_input',
							'add_text' => __( 'New Theme', 'mixt' ),
							'inputs'   => array(
								'name' => array(
									'type'  => 'text',
									'icon'  => 'icon-themes',
									'label' => __( 'Theme Name', 'mixt' ),
								),
								'bg-color' => array(
									'type'  => 'color',
									'value' => '#fff',
									'label' => 'Background Color',
								),
								'text-color' => array(
									'type'  => 'color',
									'value' => '#333',
									'label' => 'Text Color',
								),
								'text-active-color' => array(
									'type'  => 'color',
									'value' => '#539ddd',
									'label' => 'Active Text Color',
								),
							),
						),

					// Divider
					array(
						'id'   => 'nav-divider',
						'type' => 'divide',
					),

					// Navbar Themes
					array(
						'id'       => 'nav-themes-section',
						'type'     => 'section',
						'title'    => __( 'Navbar Themes', 'mixt' ),
						'indent'   => true,
					),

						// Navbar Multi Input
						array(
							'id'       => 'nav-themes',
							'type'     => 'multi_input',
							'add_text' => __( 'New Theme', 'mixt' ),
							'inputs'   => array(
								'name' => array(
									'type'       => 'text',
									'icon'       => 'el-icon-brush',
									'label'      => __( 'Theme Name', 'mixt' ),
									'wrap_class' => 'theme-name',
								),
								'bg-color' => array(
									'type'  => 'color',
									'value' => '',
									'alpha' => true,
									'label' => 'Background Color',
								),
								'accent' => array(
									'type'  => 'color',
									'value' => '',
									'label' => 'Accent',
								),
								'text-color' => array(
									'type'  => 'color',
									'value' => '',
									'label' => 'Text Color',
								),
								'text-active-color' => array(
									'type'  => 'color',
									'value' => '',
									'label' => 'Active Text Color',
								),
							),
							'default' => $nav_default_themes,
						),

					// Divider
					array(
						'id'   => 'colors-divider',
						'type' => 'divide',
					),
				),
			);


			// FAVICON SECTION
			$this->sections[] = array(
				'title'      => __( 'Favicon', 'mixt' ),
				'desc'       => __( 'Set up the favicon (the icon that appears next to the site name in the browser)<br>MIXT will automatically generate icons in different sizes for most devices', 'mixt' ),
				'icon'       => 'el-icon-eye-open',
				'fields'     => array(

					// Image Select
					array(
						'id'       => 'favicon-img',
						'type'     => 'media',
						'url'      => false,
						'title'    => __( 'Select Favicon', 'mixt' ),
						'subtitle' => __( 'Select the image you want to use as the site&#39;s favicon.<br><strong>For optimal results, select an image at least 200x200 pixels big</strong>', 'mixt' ),
					),

					// Rebuild Favicons
					array(
						'id'       => 'favicon-rebuild',
						'type'     => 'switch',
						'title'    => __( 'Rebuild Favicons', 'mixt' ),
						'subtitle' => __( 'Delete the old favicons and rebuild them', 'mixt' ),
						'on'       => 'Yes',
						'off'      => 'No',
						'default'  => false,
					),

					// Saved Favicon HTML Code
					array(
						'id'       => 'favicon-html',
						'type'     => 'textarea',
						'title'    => __( 'Current Favicon Code', 'mixt' ),
						'subtitle' => __( 'This is current favicon HTML, it <strong>will be replaced</strong> on each rebuild', 'mixt' ),
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

			// TYPOGRAPHY
			$this->sections[] = array(
				'title'  => __( 'Typography', 'mixt' ),
				'icon'   => 'el-icon-font',
				'submenu' => false,
				'fields' => array(

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
				'title'   => __( 'Social Profiles', 'mixt' ),
				'icon'    => 'el-icon-group',
				'submenu' => false,
				'fields'  => array(
					
					array(
						'id'       => 'social-profiles',
						'type'     => 'multi_input',
						'title'    => __( 'Social Profiles', 'mixt' ),
						'subtitle' => __( 'Create social profiles', 'mixt' ),
						'add_text' => __( 'New Profile', 'mixt' ),
						'default'  => $social_profiles,
						'inputs'   => array(
							'name' => array(
								'icon'        => 'el-icon-tag',
								'wrap_class'  => 'social-label social-name',
								'input_class' => 'mixt-social-field network-name',
								'placeholder' => 'Name',
							),
							'url' => array(
								'icon'        => 'el-icon-globe',
								'wrap_class'  => 'social-label social-url',
								'input_class' => 'mixt-social-field network-url',
								'placeholder' => 'URL',
							),
							'icon' => array(
								'icon'        => 'el-icon-idea',
								'wrap_class'  => 'social-label social-icon',
								'input_class' => 'mixt-social-field network-icon',
								'placeholder' => 'Icon',
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
								'placeholder' => 'Title',
							),
						),
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

					// Auto Update TF Username
					array(
						'id'       => 'tf-update-user',
						'type'     => 'text',
						'title'    => __('ThemeForest Username', 'mixt'),
						'subtitle' => __('Your ThemeForest username for automatic updates'),
						'default'  => '',
					),

					// Auto Update TF API Key
					array(
						'id'       => 'tf-update-key',
						'type'     => 'text',
						'title'    => __('ThemeForest API Key', 'mixt'),
						'subtitle' => __('Your ThemeForest API key for automatic updates'),
						'default'  => '',
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

			// Custom page help tabs, displayed using the help API. Tabs are shown in order of definition.
			$this->args['help_tabs'][] = array(
				'id'      => 'redux-help-tab-1',
				'title'   => __( 'Theme Information 1', 'mixt' ),
				'content' => __( '<p>This is the tab content, HTML is allowed.</p>', 'mixt' )
			);

			$this->args['help_tabs'][] = array(
				'id'      => 'redux-help-tab-2',
				'title'   => __( 'Theme Information 2', 'mixt' ),
				'content' => __( '<p>This is the tab content, HTML is allowed.</p>', 'mixt' )
			);

			// Set the help sidebar
			$this->args['help_sidebar'] = __( '<p>This is the sidebar content, HTML is allowed.</p>', 'mixt' );
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