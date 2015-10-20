<?php

/**
 * Initialization
 *
 * @package MIXT\Core
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access


// LOAD THEME MODULES

$modules = array(
	'head-media.php',
	'breadcrumbs.php',
	'social.php',
	'gallery.php',
	'extras.php',
	'dcss/dynamic-css.php',
);
mixt_requires( $modules, 'modules' );


/**
 * Initialize and load framework plugins
 */
class Mixt_Plugins {

	/**
	 * Plugins to be activated
	 * @var array
	 */
	public $plugins = array();

	public function __construct() {
		$this->load_plugins();
	}

	/**
	 * Load plugins
	 */
	public function load_plugins() {
		global $mixt_opt;

		// MIXT Portfolio
			$this->plugins[] = array(
				'name'     => 'MIXT Portfolio',
				'slug'     => 'mixt-portfolio',
				'source'   => 'portfolio.zip',
			);

		// MIXT Elements
			$this->plugins[] = array(
				'name'     => 'MIXT Elements',
				'slug'     => 'mixt-elements',
				'source'   => 'elements.zip',
			);

		// MIXT CodeBuilder
			include_once( MIXT_PLUGINS_DIR . '/mixt-codebuilder/mixt-codebuilder.php' );

		// Redux Framework and Extensions
			// Extension Loader
			include_once( MIXT_PLUGINS_DIR . '/redux-extend/extensions/loader.php' );
			// Framework
			if ( ! class_exists( 'ReduxFramework' ) ) {
				if ( file_exists( MIXT_PLUGINS_DIR . '/redux/framework.php' ) ) {
					require_once( MIXT_PLUGINS_DIR . '/redux/framework.php' );
				} else {
					$this->plugins[] = array(
						'name'     => 'Redux Framework',
						'slug'     => 'redux-framework',
						'required' => true
					);
				}
			}
			add_action( 'redux/page/mixt_opt/enqueue', array($this, 'redux_scripts'), 2 );
			// Config
			if ( ! isset( $mixt_opt ) ) {
				include_once( MIXT_FRAME_DIR . '/redux-config.php' );
			}

		// CMB2 Framework
			if ( ( ! empty($mixt_opt['page-metaboxes']) && $mixt_opt['page-metaboxes'] == 1 ) ) {
				include_once( MIXT_FRAME_DIR . '/cmb2-config.php' );

				if ( ! file_exists( MIXT_PLUGINS_DIR . '/cmb2/init.php') ) {
					$this->plugins[] = array(
						'name'     => 'CMB2',
						'slug'     => 'cmb2',
						'required' => true
					);
				}
				// CMB2 Extensions
				include_once( MIXT_PLUGINS_DIR . '/cmb2-extend/extensions/post-search-field.php' );
			}

		// MICF library & Config
			if ( file_exists( MIXT_PLUGINS_DIR . '/micf/menu-item-custom-fields.php' ) ) {
				require_once( MIXT_PLUGINS_DIR . '/micf/menu-item-custom-fields.php' );
			} else {
				$this->plugins[] = array(
					'name'     => 'Menu Item Custom Fields',
					'slug'     => 'menu-item-custom-fields',
					'required' => true
				);
			}
			include_once( MIXT_FRAME_DIR . '/micf-config.php' );

		// WPBakery Visual Composer
			$this->plugins[] = array(
				'name'     => 'WPBakery Visual Composer',
				'slug'     => 'js_composer',
				'source'   => 'js_composer.zip',
				'version'  => '4.7.4',
				'force_deactivation' => true
			);

		// LayerSlider
			$this->plugins[] = array(
				'name'     => 'LayerSlider WP',
				'slug'     => 'LayerSlider',
				'source'   => 'layerslider.zip',
				'version'  => '5.6.2',
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
			'id'           => 'tgmpa',                 // Unique ID for hashing notices for multiple instances of TGMPA.
			'default_path' => MIXT_PLUGINS_DIR,        // Default absolute path to bundled plugins.
			'menu'         => 'tgmpa-install-plugins', // Menu slug.
			'parent_slug'  => 'themes.php',            // Parent menu slug.
			'capability'   => 'edit_theme_options',    // Capability needed to view plugin install page, should be a capability associated with the parent menu used.
			'has_notices'  => true,                    // Show admin notices or not.
			'dismissable'  => true,                    // If false, a user cannot dismiss the nag message.
			'dismiss_msg'  => '',                      // If 'dismissable' is false, this message will be output at top of nag.
			'is_automatic' => false,                   // Automatically activate plugins after installation or not.
			'message'      => '',                      // Message to output right before the plugins table.
		);
		tgmpa($this->plugins, $config);
	}
}
new Mixt_Plugins;


/**
 * Update options after they are saved
 */
function mixt_options_changed($mixt_opt = null) {
	if ( is_null($mixt_opt) ) { global $mixt_opt; }

	// Custom Sidebars
	if ( array_key_exists('reg-sidebars', $mixt_opt) ) { update_option('mixt-sidebars', $mixt_opt['reg-sidebars']); }

	// Post Excerpt Length
	if ( ! empty($mixt_opt['post-excerpt-length']) ) { update_option('mixt-post-excerpt-length', $mixt_opt['post-excerpt-length']); }

	// Themes
	if ( array_key_exists('themes-master', $mixt_opt) ) { update_option('mixt-themes-enabled', $mixt_opt['themes-master']); }
	if ( array_key_exists('site-themes', $mixt_opt) ) { update_option('mixt-site-themes', $mixt_opt['site-themes']); }
	if ( array_key_exists('nav-themes', $mixt_opt) ) { update_option('mixt-nav-themes', $mixt_opt['nav-themes']); }

	// Update Custom CSS
	( new Mixt_DCSS() )->stylesheet();

	// Social Profiles
	if ( ! empty($mixt_opt['social-profiles']) ) { update_option('mixt-social-profiles', $mixt_opt['social-profiles']); }
	else { update_option('mixt-social-profiles', mixt_preset_social_profiles('networks')); }
	if ( ! empty($mixt_opt['post-sharing-profiles']) ) { update_option('mixt-sharing-profiles', $mixt_opt['post-sharing-profiles']); }
	else { update_option('mixt-sharing-profiles', mixt_preset_social_profiles('sharing')); }
}
add_action('redux/options/mixt_opt/settings/change', 'mixt_options_changed', 2);
add_action('customize_save_after', 'mixt_options_changed');

// Customizer Preview
if ( is_customize_preview() ) {
	mixt_options_changed();
	require_once MIXT_FRAME_DIR . '/admin/customizer.php';
}


// Initialize and Extend Visual Composer
if ( defined('WPB_VC_VERSION') ) {
	add_action('vc_before_init', 'vc_set_as_theme');
	vc_set_shortcodes_templates_dir( MIXT_PLUGINS_DIR . '/vc-extend/templates' );

	require_once( MIXT_PLUGINS_DIR . '/vc-extend/vc-extend.php' );
}


// Initialize LayerSlider As Included With Theme
function mixt_layerslider_overrides() {
	// Disable auto-updates
	$GLOBALS['lsAutoUpdateBox'] = false;
}
add_action('layerslider_ready', 'mixt_layerslider_overrides');


// Configure WooCommerce
if ( class_exists('WooCommerce') ) {
	require_once( MIXT_PLUGINS_DIR . '/woocommerce/mixt-woocommerce.php' );
}


// Admin Integration
if ( is_admin() ) {
	require_once MIXT_FRAME_DIR . '/admin/mixt-admin.php';
}


/**
 * Enqueue theme scripts and stylesheets
 */
function mixt_scripts() {
	// Main CSS
	wp_enqueue_style( 'mixt-main', MIXT_URI . '/dist/main.css', array(), MIXT_VERSION );

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

	// Icon Fonts
	$icon_fonts = Mixt_Options::get('assets', 'icon-fonts');
	foreach ( $icon_fonts as $font => $val ) {
		if ( $val ) wp_enqueue_style( "mixt-$font", MIXT_URI . "/assets/fonts/$font/$font.css", array(), MIXT_VERSION );
	}

	// Custom Dynamic Stylesheet
	if ( file_exists(MIXT_UPLOAD_PATH . '/dynamic.css') ) {
		wp_enqueue_style( 'mixt-dynamic', MIXT_UPLOAD_URI . '/dynamic.css', array(), MIXT_VERSION );
	}

	// Enqueue the lightSlider plugin on blog and portfolio pages when AJAX pagination is enabled
	if ( in_array(Mixt_Options::get('layout', 'pagination-type'), array('ajax-click', 'ajax-scroll')) && in_array(Mixt_Options::get('page', 'page-type'), array('blog', 'portfolio')) ) {
		mixt_enqueue_plugin('lightslider');
	}

	// Isotope Masonry
	if ( Mixt_Options::get('layout', 'type') == 'masonry' ) { mixt_enqueue_plugin('isotope'); }
}
add_action('wp_enqueue_scripts', 'mixt_scripts', 99);


/**
 * Enqueue admin scripts and stylesheets
 * 
 * @param string $hook Current admin page
 */
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

	// Pagination Options
	global $wp_query;
	if ( ! empty($opt['page']['page-type']) && $opt['page']['page-type'] == 'single' ) {
		if ( get_option('page_comments') && in_array($opt['layout']['comment-pagination-type'], array('ajax-click', 'ajax-scroll')) ) {
			$opt['layout']['comment-default-page'] = get_option('default_comments_page', 'newest');
		}
	}

	return $opt;
}
