<?php

/**
 * MIXT Init
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access


// LOAD THEME MODULES

$modules = array(
	'head-media.php',
	'breadcrumbs.php',
	'social.php',
	'favicons.php',
	'gallery.php',
	'extras.php',
	'customizer.php',
	'dcss/class-dcss.php',
);
mixt_requires( $modules, MIXT_MODULES_DIR );

// Elements & Shortcodes
foreach ( glob( MIXT_MODULES_DIR . '/elements/*.php' ) as $filename ) {
	include $filename;
}


/**
 * Initialize and load framework plugins
 */
class Mixt_Plugins {
	public $required = array();

	public function __construct() {
		$this->load_plugins();
	}

	/**
	 * Load plugins
	 */
	public function load_plugins() {
		global $mixt_opt;

		// MIXT Portfolio
			if ( ! class_exists('Mixt_Portfolio') ) {
				include_once( MIXT_PLUGINS_DIR . '/mixt-portfolio/mixt-portfolio.php' );
			}

		// MIXT CodeBuilder
			if ( ! class_exists('Mixt_CodeBuilder') ) {
				include_once( MIXT_PLUGINS_DIR . '/mixt-codebuilder/mixt-codebuilder.php' );
			}

		// Redux Framework and Extensions
			// Extension Loader
			if ( file_exists( MIXT_PLUGINS_DIR . '/redux-extensions/loader.php' ) ) {
				require_once( MIXT_PLUGINS_DIR . '/redux-extensions/loader.php' );
			}
			// Framework
			if ( ! class_exists( 'ReduxFramework' ) ) {
				if ( file_exists( MIXT_PLUGINS_DIR . '/redux/framework.php' ) ) {
					require_once( MIXT_PLUGINS_DIR . '/redux/framework.php' );
				} else {
					$this->required[] = array(
						'name'     => 'Redux Framework',
						'slug'     => 'redux-framework',
						'required' => true
					);
				}
			}
			add_action( 'redux/page/mixt_opt/enqueue', array($this, 'redux_scripts'), 2 );
			// Config
			if ( ! isset( $mixt_opt ) && file_exists( MIXT_FRAME_DIR . '/redux-config.php' ) ) {
				require_once( MIXT_FRAME_DIR . '/redux-config.php' );
			}

		// CMB2 Framework
			if ( ( ! empty($mixt_opt['page-metaboxes']) && $mixt_opt['page-metaboxes'] == 1 ) && file_exists( MIXT_FRAME_DIR . '/cmb2-config.php' ) ) {
				require_once( MIXT_FRAME_DIR . '/cmb2-config.php' );

				if ( ! file_exists( MIXT_PLUGINS_DIR . '/cmb2/init.php') ) {
					$this->required[] = array(
						'name'     => 'CMB2',
						'slug'     => 'cmb2',
						'required' => true
					);
				}
				// CMB2 Extensions
				if ( file_exists( MIXT_PLUGINS_DIR . '/cmb2-extensions/post-search-field.php' ) ) {
					require_once( MIXT_PLUGINS_DIR . '/cmb2-extensions/post-search-field.php' );
				}
			}

		// MICF library & Config
			if ( file_exists( MIXT_PLUGINS_DIR . '/micf/menu-item-custom-fields.php' ) ) {
				require_once( MIXT_PLUGINS_DIR . '/micf/menu-item-custom-fields.php' );
			} else {
				$this->required[] = array(
					'name'     => 'Menu Item Custom Fields',
					'slug'     => 'menu-item-custom-fields',
					'required' => true
				);
			}
			if ( file_exists( MIXT_FRAME_DIR . '/micf-config.php' ) ) {
				require_once( MIXT_FRAME_DIR . '/micf-config.php' );
			}

		// WPBakery Visual Composer
			$this->required[] = array(
				'name'     => 'WPBakery Visual Composer',
				'slug'     => 'js_composer',
				'source'   => MIXT_PLUGINS_DIR . '/js_composer.zip',
				'required' => false,
				'force_deactivation' => true
			);

		// LayerSlider
			$this->required[] = array(
				'name' => 'LayerSlider WP',
				'slug' => 'LayerSlider',
				'source' => MIXT_PLUGINS_DIR . '/layerslider.zip',
				'required' => false,
				'version' => '5.0.2',
				'force_deactivation' => true
			);

		// Update Notifier
			if ( file_exists( MIXT_PLUGINS_DIR . '/theme-update/envato-wp-theme-updater.php' ) && ! empty($mixt_opt['tf-update-login']) && is_array($mixt_opt['tf-update-login']) ) {
				$username = $mixt_opt['tf-update-login']['username'];
				$api_key  = $mixt_opt['tf-update-login']['password'];
				if ( ! empty($username) && ! empty($api_key) ) {
					load_template( MIXT_PLUGINS_DIR . '/theme-update/envato-wp-theme-updater.php' );
					Envato_WP_Theme_Updater::init( $username, $api_key, 'novalex' );
				}
			}

		// TGM Plugin Activation
			require_once( MIXT_PLUGINS_DIR . '/class-tgm-plugin-activation.php' );
			add_action( 'tgmpa_register', array($this, 'tgmpa_init') );
	}

	/**
	 * Enqueue custom Redux Panel CSS
	 */
	public function redux_scripts() {
		wp_enqueue_script( 'redux-mixt-js', MIXT_FRAME_URI . '/admin/js/redux-mixt.js', array( 'jquery' ), time(), 'all' );
	}

	/**
	 * TGM Plugin Activation
	 */
	public function tgmpa_init() {
		$config = array(
			'default_path' => '',                      // Default absolute path to pre-packaged plugins.
			'menu'         => 'tgmpa-install-plugins', // Menu slug.
			'has_notices'  => true,                    // Show admin notices or not.
			'dismissable'  => true,                    // If false, a user cannot dismiss the nag message.
			'dismiss_msg'  => '',                      // If 'dismissable' is false, this message will be output at top of nag.
			'is_automatic' => false,                   // Automatically activate plugins after installation or not.
			'message'      => '',                      // Message to output right before the plugins table.
			'strings'      => array(
				'page_title'                      => __( 'Install Required Plugins', 'tgmpa' ),
				'menu_title'                      => __( 'Install Plugins', 'tgmpa' ),
				'installing'                      => __( 'Installing Plugin: %s', 'tgmpa' ), // %s = plugin name.
				'oops'                            => __( 'Something went wrong with the plugin API.', 'tgmpa' ),
				'notice_can_install_required'     => _n_noop( 'This theme requires the following plugin: %1$s.', 'This theme requires the following plugins: %1$s.' ), // %1$s = plugin name(s).
				'notice_can_install_recommended'  => _n_noop( 'This theme recommends the following plugin: %1$s.', 'This theme recommends the following plugins: %1$s.' ), // %1$s = plugin name(s).
				'notice_cannot_install'           => _n_noop( 'Sorry, but you do not have the correct permissions to install the %s plugin. Contact the administrator of this site for help on getting the plugin installed.', 'Sorry, but you do not have the correct permissions to install the %s plugins. Contact the administrator of this site for help on getting the plugins installed.' ), // %1$s = plugin name(s).
				'notice_can_activate_required'    => _n_noop( 'The following required plugin is currently inactive: %1$s.', 'The following required plugins are currently inactive: %1$s.' ), // %1$s = plugin name(s).
				'notice_can_activate_recommended' => _n_noop( 'The following recommended plugin is currently inactive: %1$s.', 'The following recommended plugins are currently inactive: %1$s.' ), // %1$s = plugin name(s).
				'notice_cannot_activate'          => _n_noop( 'Sorry, but you do not have the correct permissions to activate the %s plugin. Contact the administrator of this site for help on getting the plugin activated.', 'Sorry, but you do not have the correct permissions to activate the %s plugins. Contact the administrator of this site for help on getting the plugins activated.' ), // %1$s = plugin name(s).
				'notice_ask_to_update'            => _n_noop( 'The following plugin needs to be updated to its latest version to ensure maximum compatibility with this theme: %1$s.', 'The following plugins need to be updated to their latest version to ensure maximum compatibility with this theme: %1$s.' ), // %1$s = plugin name(s).
				'notice_cannot_update'            => _n_noop( 'Sorry, but you do not have the correct permissions to update the %s plugin. Contact the administrator of this site for help on getting the plugin updated.', 'Sorry, but you do not have the correct permissions to update the %s plugins. Contact the administrator of this site for help on getting the plugins updated.' ), // %1$s = plugin name(s).
				'install_link'                    => _n_noop( 'Begin installing plugin', 'Begin installing plugins' ),
				'activate_link'                   => _n_noop( 'Begin activating plugin', 'Begin activating plugins' ),
				'return'                          => __( 'Return to Required Plugins Installer', 'tgmpa' ),
				'plugin_activated'                => __( 'Plugin activated successfully.', 'tgmpa' ),
				'complete'                        => __( 'All plugins installed and activated successfully. %s', 'tgmpa' ), // %s = dashboard link.
				'nag_type'                        => 'updated' // Determines admin notice type - can only be 'updated', 'update-nag' or 'error'.
			)
		);
		tgmpa( $this->required, $config );
	}
}
new Mixt_Plugins;


// Set options that need to be accessed before Redux is initialized (themes, sidebars)
function mixt_options_changed( $mixt_opt ) {
	// Dynamic Sass Option
	if ( array_key_exists('dynamic-sass', $mixt_opt) ) { update_option('mixt-dynamic-sass', $mixt_opt['dynamic-sass']); }

	// Custom Sidebars
	if ( ! empty($mixt_opt['reg-sidebars']) ) { update_option('mixt-sidebars', $mixt_opt['reg-sidebars']); }

	// Post Excerpt Length
	if ( ! empty($mixt_opt['post-excerpt-length']) ) { update_option('mixt-post-excerpt-length', $mixt_opt['post-excerpt-length']); }

	// Themes Enabled
	if ( array_key_exists('themes-master', $mixt_opt) ) {
		update_option('mixt-themes-enabled', $mixt_opt['themes-master']);

		if ( $mixt_opt['themes-master'] == false ) {
			global $mixtConfig;
			$mixtConfig->ReduxFramework->set('site-theme', '');
			$mixtConfig->ReduxFramework->set('nav-theme', '');
		}
	}

	// Themes
	if ( ! empty($mixt_opt['site-themes']) ) { update_option('mixt-site-themes', $mixt_opt['site-themes']); }
	if ( ! empty($mixt_opt['nav-themes']) ) { update_option('mixt-nav-themes', $mixt_opt['nav-themes']); }

	// Social Profiles
	if ( ! empty($mixt_opt['social-profiles']) ) { update_option('mixt-social-profiles', $mixt_opt['social-profiles']); }
	else { update_option('mixt-social-profiles', mixt_preset_social_profiles('networks')); }
	if ( ! empty($mixt_opt['post-sharing-profiles']) ) { update_option('mixt-sharing-profiles', $mixt_opt['post-sharing-profiles']); }
	else { update_option('mixt-sharing-profiles', mixt_preset_social_profiles('sharing')); }
}
add_action('redux/options/mixt_opt/settings/change', 'mixt_options_changed', 2);


// Set Custom Excerpt Length
function mixt_excerpt_length( $length ) {
	return get_option('mixt-post-excerpt-length', 55);
}
add_filter( 'excerpt_length', 'mixt_excerpt_length', 999 );


// Initialize and Extend Visual Composer
if ( defined( 'WPB_VC_VERSION' ) ) {
	add_action('vc_before_init', 'vc_set_as_theme');
	vc_set_shortcodes_templates_dir( MIXT_PLUGINS_DIR . '/vc-extend/templates' );

	require_once( MIXT_PLUGINS_DIR . '/vc-extend/vc-extend.php' );
}


// Initialize LayerSlider As Included With Theme
add_action('layerslider_ready', 'mixt_layerslider_overrides');
function mixt_layerslider_overrides() {
	// Disable auto-updates
	$GLOBALS['lsAutoUpdateBox'] = false;
}


// Configure WooCommerce
if ( class_exists('WooCommerce') ) {
	require_once( MIXT_PLUGINS_DIR . '/woocommerce/mixt-woocommerce.php' );
}


// Old WP Version Handling
add_filter('body_class', 'mixt_wp_old_classes');
function mixt_wp_old_classes($classes) {
	$version = empty($wp_version) ? get_bloginfo('version') : $wp_version;
	// Slim Admin Bar in WP < 3.8
	if ( version_compare($version, '3.8', '<') ) { $classes[] = 'admin-bar-slim'; }
	
	return $classes;
}


// Admin Integration
require_once MIXT_FRAME_DIR . '/admin/mixt-admin.php';


// BrowserSync Script
function mixt_browsersync() {
echo <<<EOT
<script type="text/javascript" id="__bs_script__">
if ( ! (/iPhone|iPod|iPad|Android|BlackBerry/).test(navigator.userAgent) ) {
	//<![CDATA[
	document.write("<script async src='http://HOST:3000/browser-sync/browser-sync-client.js'><\/script>".replace("HOST", location.hostname));
	//]]>
}
</script>
EOT;
}


// ENQUEUE SCRIPTS AND STYLESHEETS

function mixt_scripts() {
	// Define resource paths as filtered array so they can be overridden from child themes
	$resources = array(
		'main-css'     => MIXT_URI . '/dist/main.css',
		'main-js'      => MIXT_URI . '/dist/main.js',
		'global-js'    => MIXT_URI . '/js/global.js',
		'bootstrap-js' => MIXT_URI . '/dist/bootstrap.js',
	);
	$resources = apply_filters('mixt_resources', $resources, $resources);

	// Main CSS
	wp_enqueue_style( 'mixt-main-style', $resources['main-css'], array(), MIXT_VERSION );

	// Dynamic Sass
	if ( get_option('mixt-dynamic-sass', 0) ) {
		wp_enqueue_style( 'mixt-dynamic-style', MIXT_MODULES_URI . '/dcss/dynamic.scss.php' );
	}

	// Bootstrap JS
	wp_enqueue_script( 'mixt-bootstrap-js', $resources['bootstrap-js'], array( 'jquery' ), MIXT_VERSION, true );

	// Main JS
	wp_enqueue_script( 'mixt-main-js', $resources['main-js'], array( 'jquery' ), MIXT_VERSION, true );

	// Global Functions JS
	wp_enqueue_script( 'mixt-global-js', $resources['global-js'], array( 'jquery', 'mixt-main-js' ), MIXT_VERSION, true );

	// Localize Options
	wp_localize_script( 'mixt-main-js', 'mixt_opt', mixt_local_options() );

	// Comment Reply JS
	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) { wp_enqueue_script( 'comment-reply' ); }

	// Icon Fonts
	$icon_fonts = Mixt_Options::get('assets', 'icon-fonts');
	foreach ( $icon_fonts as $font => $val ) {
		if ( $val ) wp_enqueue_style( "mixt-$font", MIXT_URI . "/assets/fonts/$font/$font.css", array(), MIXT_VERSION );
	}

	// Isotope Masonry
	if ( Mixt_Options::get('layout', 'type') == 'masonry' ) { mixt_enqueue_plugin('isotope'); }
}
add_action('wp_enqueue_scripts', 'mixt_scripts', 99);


// ENQUEUE ADMIN SCRIPTS AND STYLESHEETS

function mixt_admin_scripts($hook) {
	// Admin Styles
	wp_enqueue_style( 'mixt-admin-styles', MIXT_URI . '/dist/admin.css', false, MIXT_VERSION );

	// Menu Page Scripts
	if ( $hook == 'nav-menus.php' ) {
		wp_enqueue_script( 'mixt-admin-menu-js', MIXT_FRAME_URI . '/admin/js/menu-scripts.js', array('jquery'), MIXT_VERSION );
	// Page Admin Scripts
	} elseif ( $hook == 'post.php' || $hook == 'post-new.php' ) {
		wp_enqueue_script( 'mixt-admin-page-js', MIXT_FRAME_URI . '/admin/js/page-scripts.js', array('jquery'), MIXT_VERSION, true );
	}
}
add_action('admin_enqueue_scripts', 'mixt_admin_scripts');
// Add BrowserSync script to admin pages
add_action('admin_footer', 'mixt_browsersync');


/**
 * Localize options to be used by scripts
 */
function mixt_local_options() {
	$opt = array(
		'page'   => Mixt_Options::get('page'),
		'nav'    => Mixt_Options::get('nav'),
		'header' => Mixt_Options::get('header'),
		'layout' => Mixt_Options::get('layout'),
	);

	if ( $opt['header']['enabled'] == false ) $opt['header'] = array( 'enabled' => false );

	// Additional nav options
	$nav_options = mixt_get_options( array(
		'top-opacity' => array( 'key' => 'nav-top-opacity', 'type' => 'str', 'return' => 'value' ),
	));
	$opt['nav'] = array_merge($opt['nav'], $nav_options);

	// Pagination Options
	global $wp_query;
	if ( ! empty($opt['page']['posts-page']) && $opt['page']['posts-page'] ) {
		if ( $opt['layout']['pagination-type'] == 'ajax-click' || $opt['layout']['pagination-type'] == 'ajax-scroll' ) {
			$opt['layout']['next-url'] = next_posts($wp_query->max_num_pages, false);
		}
	}
	if ( ! empty($opt['page']['page-type']) && $opt['page']['page-type'] == 'single' ) {
		if ( get_option('page_comments') ) {
			if ( $opt['layout']['comment-pagination-type'] == 'ajax-click' || $opt['layout']['comment-pagination-type'] == 'ajax-scroll' ) {
				$opt['layout']['comment-default-page'] = get_option('default_comments_page', 'newest');
				$opt['layout']['comment-next-url'] = get_comments_pagenum_link( get_query_var('cpage', 1) + 1 );
			}
		}
	}

	return $opt;
}
