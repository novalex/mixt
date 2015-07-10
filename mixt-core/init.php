<?php

/**
 * MIXT Init
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access


/**
 * Initialize and load framework plugins
 */
class MixtPlugins {
	public $required = array();

	public function __construct() {
		$this->load_plugins();
		add_action( 'after_setup_theme', array($this, 'load_mixt_plugins') );
	}

	/**
	 * Load plugins
	 */
	public function load_plugins() {
		global $mixt_opt;

		// Redux Framework and Extensions
			// Extension Loader
			if ( file_exists( MIXT_PLUGINS_DIR . '/redux-extensions/loader.php' ) ) {
				require_once( MIXT_PLUGINS_DIR . '/redux-extensions/loader.php' );
			}
			// Framework
			if ( file_exists( MIXT_PLUGINS_DIR . '/redux/ReduxCore/framework.php' ) ) {
				if ( ! class_exists( 'ReduxFramework' ) ) {
					require_once( MIXT_PLUGINS_DIR . '/redux/ReduxCore/framework.php' );
				}
			} else {
				$this->required[] = array(
					'name'     => 'Redux Framework',
					'slug'     => 'redux-framework',
					'required' => true
				);
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
	 * Load custom plugins
	 */
	public function load_mixt_plugins() {
		// MIXT Custom Post Types
		if ( ! function_exists('mixt_posts_register') ) {
			require_once( MIXT_PLUGINS_DIR . '/mixt-posts/mixt-posts.php' );
		}
		// MIXT CodeBuilder
		if ( file_exists( MIXT_PLUGINS_DIR . '/mixt-codebuilder/mixt-codebuilder.php' ) ) {
			require_once( MIXT_PLUGINS_DIR . '/mixt-codebuilder/mixt-codebuilder.php' );
		}
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
new MixtPlugins;


// Set options that need to be accessed before Redux is initialized (themes, sidebars)
function mixt_options_changed( $mixt_opt ) {
	// Dynamic Sass Option
	if ( ! empty($mixt_opt['dynamic-sass']) ) { update_option('mixt-dynamic-sass', $mixt_opt['dynamic-sass']); }
	// Custom Sidebars
	if ( ! empty($mixt_opt['reg-sidebars']) ) { update_option('mixt-sidebars', $mixt_opt['reg-sidebars']); }
	// Post Excerpt Length
	if ( ! empty($mixt_opt['post-excerpt-length']) ) { update_option('post-excerpt-length', $mixt_opt['post-excerpt-length']); }
	// Themes
	if ( ! empty($mixt_opt['site-themes']) ) { update_option('site-themes', $mixt_opt['site-themes']); }
	if ( ! empty($mixt_opt['nav-themes']) ) { update_option('nav-themes', $mixt_opt['nav-themes']); }
}
add_action('redux/options/mixt_opt/settings/change', 'mixt_options_changed', 2);

// Set Custom Excerpt Length
function mixt_excerpt_length( $length ) {
	return get_option('post-excerpt-length', 55);
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


// Old WP Version Handling
add_filter('body_class', 'mixt_wp_old_classes');
function mixt_wp_old_classes($classes) {
	$version = empty($wp_version) ? get_bloginfo('version') : $wp_version;
	// Slim Admin Bar in WP < 3.8
	if ( version_compare($version, '3.8', '<') ) { $classes[] = 'admin-bar-slim'; }
	
	return $classes;
}


// LOAD THEME MODULES

$mixt_modules = array(
	'head-media.php',
	'breadcrumbs.php',
	'social.php',
	'favicons.php',
	'gallery.php',
	'extras.php',
	'customizer.php',
);
mixt_requires( $mixt_modules, MIXT_MODULES_DIR );
unset($mixt_modules);

// Admin Integration
require_once MIXT_FRAME_DIR . '/admin/mixt-admin.php';

// Color Manipulation
require_once MIXT_FRAME_DIR . '/libs/color-manipulation.php';

// Load the dynamic CSS file or Sass parser
if ( get_option('mixt-dynamic-sass', 0) ) {
	require_once( MIXT_PLUGINS_DIR . '/wp-sass/wp-sass.php' );
} else {
	require_once( MIXT_MODULES_DIR . '/dynamic-styles/dynamic.css.php' );
}


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
	// Main CSS
	wp_enqueue_style( 'mixt-main-style', MIXT_URI . '/dist/main.css', array(), MIXT_VERSION );

	// Font Awesome Icons
	wp_enqueue_style( 'mixt-fa-icons', MIXT_URI . '/assets/fonts/font-awesome/font-awesome.css', array(), MIXT_VERSION );

	// Dynamic Sass
	if ( get_option('mixt-dynamic-sass', 0) ) {
		wp_enqueue_style( 'mixt-dynamic-style', MIXT_MODULES_URI . '/dynamic-styles/dynamic.scss.php' );
	}

	// Bootstrap JS
	wp_enqueue_script( 'mixt-bootstrap-js', MIXT_URI . '/dist/bootstrap.js', array( 'jquery' ), MIXT_VERSION, true );

	// Main JS
	wp_enqueue_script( 'mixt-main-js', MIXT_URI . '/dist/main.js', array( 'jquery' ), MIXT_VERSION, true );

	// Global Functions JS
	wp_enqueue_script( 'mixt-global-js', MIXT_URI . '/js/global.js', array( 'jquery', 'mixt-main-js' ), MIXT_VERSION, true );

	// Localize Options
	wp_localize_script( 'mixt-main-js', 'mixt_opt', mixt_local_options() );

	// Comment Reply JS
	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) { wp_enqueue_script( 'comment-reply' ); }


	// JS Plugins

	foreach ( array_diff(scandir( MIXT_DIR . '/dist/plugins' ), array('.', '..')) as $filename ) {
		$plugin_handle = 'mixt-' . explode('.', $filename)[0];
		wp_register_script( $plugin_handle, MIXT_URI . '/dist/plugins/' . $filename, MIXT_VERSION );
	}

	// Isotope Masonry
	if ( MIXT::get('layout', 'type') == 'masonry' ) { wp_enqueue_script('mixt-isotope'); }
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
add_action('admin_footer', 'mixt_browsersync');


/**
 * Localize options to be used by scripts
 */
function mixt_local_options() {
	$opt = array();
	$opt['page'] = MIXT::get('page');
	$opt['nav'] = MIXT::get('nav');
	$opt['header'] = MIXT::get('header');
	$opt['layout'] = MIXT::get('layout');

	// Additional nav options
	$nav_options = mixt_get_options( array(
		'top-opacity' => array( 'key' => 'nav-top-opacity', 'type' => 'str', 'return' => 'value' ),
	));
	$opt['nav'] = array_merge($opt['nav'], $nav_options);

	// Pagination Options
	global $wp_query;
	if ( $opt['page']['posts-page'] ) {
		if ( $opt['layout']['pagination-type'] == 'ajax-click' || $opt['layout']['pagination-type'] == 'ajax-scroll' ) {
			$opt['layout']['next-url'] = next_posts($wp_query->max_num_pages, false);
		}
	}
	if ( $opt['page']['page-type'] == 'single' ) {
		if ( get_option('page_comments') ) {
			if ( $opt['layout']['comment-pagination-type'] == 'ajax-click' || $opt['layout']['comment-pagination-type'] == 'ajax-scroll' ) {
				$opt['layout']['comment-default-page'] = get_option('default_comments_page', 'newest');
				$opt['layout']['comment-next-url'] = get_comments_pagenum_link( get_query_var('cpage', 1) + 1 );
			}
		}
	}

	return $opt;
}
