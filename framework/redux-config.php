<?php

/**
 * MIXT Redux Config
 *
 * @package MIXT
 */

if ( ! class_exists( 'Mixt_Redux_Config' ) ) {

	class Mixt_Redux_Config {

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

			// Animations
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
			$nav_themes = array_merge( array('auto' => esc_html__( 'Auto', 'mixt')), $nav_themes );
			$footer_themes = array_merge( array('auto' => esc_html__( 'Auto', 'mixt' )), $site_themes );

			// Nav Menus
			$nav_menus = mixt_get_nav_menus();

			// Icons
			$default_icons = mixt_get_icon('defaults');

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
			$text_code_placeholder = esc_html( esc_html__( 'Allowed HTML tags and attributes:', 'mixt' ) . ' <a href="" title="">, <i>, <span>, <strong>, <em>' );

			// Sidebars
			$available_sidebars = mixt_get_sidebars(false);


			// START SECTIONS

			// GLOBAL OPTIONS
			include_once( MIXT_PLUGINS_DIR . '/redux-extend/fields/global.php' );

			// HEADER SECTION
			include_once( MIXT_PLUGINS_DIR . '/redux-extend/fields/header.php' );

			// LOGO
			include_once( MIXT_PLUGINS_DIR . '/redux-extend/fields/logo.php' );

			// NAVBARS
			include_once( MIXT_PLUGINS_DIR . '/redux-extend/fields/navbars.php' );

			// SIDEBARS
			include_once( MIXT_PLUGINS_DIR . '/redux-extend/fields/sidebars.php' );

			// FOOTER
			include_once( MIXT_PLUGINS_DIR . '/redux-extend/fields/footer.php' );

			// DIVIDER
			$this->sections[] = array( 'type' => 'divide' );

			// POST PAGES
			include_once( MIXT_PLUGINS_DIR . '/redux-extend/fields/post-pages.php' );

			// POSTS
			include_once( MIXT_PLUGINS_DIR . '/redux-extend/fields/posts.php' );

			// PORTFOLIO
			if ( class_exists('Mixt_Portfolio') ) {
				$this->sections[] = array( 'type' => 'divide' );
				include_once( MIXT_PLUGINS_DIR . '/redux-extend/fields/portfolio.php' );
			}

			// SHOP
			if ( class_exists('WooCommerce') ) {
				$this->sections[] = array( 'type' => 'divide' );
				include_once( MIXT_PLUGINS_DIR . '/redux-extend/fields/woocommerce.php' );
			}

			// DIVIDER
			$this->sections[] = array( 'type' => 'divide' );

			// THEMES
			include_once( MIXT_PLUGINS_DIR . '/redux-extend/fields/themes.php' );

			// ICONS
			include_once( MIXT_PLUGINS_DIR . '/redux-extend/fields/icons.php' );

			// SOCIAL PROFILES
			include_once( MIXT_PLUGINS_DIR . '/redux-extend/fields/social.php' );

			// TYPOGRAPHY
			include_once( MIXT_PLUGINS_DIR . '/redux-extend/fields/typography.php' );

			// DIVIDER
			$this->sections[] = array( 'type' => 'divide' );


			// CUSTOM SECTIONS
			if ( file_exists( MIXT_PLUGINS_DIR . '/custom/redux/fields.php' ) ) {
				include_once( MIXT_PLUGINS_DIR . '/custom/redux/fields.php' );
			}
			if ( defined('MIXT_CHILD_DIR') && file_exists( MIXT_CHILD_DIR . '/custom/redux/fields.php' ) ) {
				include_once( MIXT_CHILD_DIR . '/custom/redux/fields.php' );
			}


			// IMPORT & DEMOS SECTION
			if ( defined('MIXT_CORE') ) {
				$this->sections[] = array(
					'id'         => 'wbc_importer_section',
					'title'      => esc_html__( 'Settings & Demos', 'mixt' ),
					'desc'       => esc_html__( 'Manage your settings, and import demo content.', 'mixt' ) .
									'<br><strong class="red-text">' .
										esc_html__( 'Demos work best on clean, fresh sites. For complete content import, make sure all recommended plugins (Appearance > Install Plugins) are activated! The page will reload after importing.', 'mixt' ) .
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
			}


			// CUSTOMIZER SECTIONS
			if ( is_customize_preview() ) {
				include_once( MIXT_PLUGINS_DIR . '/redux-extend/fields/customizer.php' );
			}
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
				'menu_title'         => ( defined('MIXT_CORE') ) ? esc_html__( 'Options', 'mixt' ) : esc_html__( 'MIXT - Options' , 'mixt' ),
				'page_title'         => esc_html__( 'MIXT Options', 'mixt' ),
				'admin_bar'          => true,
				'admin_bar_icon'     => 'dashicons-screenoptions',
				'admin_bar_priority' => '31.6498',

				'dev_mode'           => false,
				'update_notice'      => true,
				'disable_tracking'   => true,
				
				'customizer'         => true,
				
				'page_priority'      => null,
				'page_parent'        => ( defined('MIXT_CORE') ) ? 'mixt-admin' : 'themes.php',
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
			// 	'title' => esc_html__( 'Documentation', 'mixt' ),
			// );

			// SOCIAL ICONS -> Setup custom links in the footer for quick links in your panel footer icons.
			// $this->args['share_icons'][] = array(
			//     'url'   => 'https://www.facebook.com/novalexdesign',
			//     'title' => 'Like novalex on Facebook',
			//     'icon'  => 'el-icon-facebook'
			// );

			// Panel Intro text -> before the form
			// $this->args['intro_text'] = esc_html__( '', 'mixt' );

			// Add content after the form.
			$this->args['footer_text'] = '';
		}
	}

	global $mixtConfig;
	$mixtConfig = new Mixt_Redux_Config();
} else {
	echo "The class named Mixt_Redux_Config has already been called. <strong>Developers, you need to prefix this class with your company name or you'll run into problems!</strong>";
}
