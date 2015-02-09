<?php

/**
 * MIXT INIT
 *
 * @package mixt
 */

// SET DEFAULT OPTIONS

function mixt_set_options() {
	$default_themes = array(
		'ice-white' => array(
			'name'              => 'Ice White',
			'bg-color'          => '#ffffff',
			'accent'            => '#539ddd',
			'text-color'        => '#333333',
			'text-active-color' => '#539ddd',
		),
		'nightly' => array(
			'name'              => 'Nightly',
			'bg-color'          => '#333333',
			'accent'            => '#539ddd',
			'text-color'        => '#eeeeee',
			'text-active-color' => '#539ddd',
		),
	);

	update_option('nav-default-themes', $default_themes);
}

mixt_set_options();

// LOAD FRAMEWORK PLUGINS

function mixt_plugins() {

	global $mixt_opt;

	$plugins = array();

	// Redux Framework and extensions

		// Extension Loader
		if ( file_exists( MIXT_PLUGINS_DIR . '/redux-extension-loader/loader.php' ) ) {
			require_once( MIXT_PLUGINS_DIR . '/redux-extension-loader/loader.php' );
		}
		// Framework
		if ( file_exists( MIXT_PLUGINS_DIR . '/redux/ReduxCore/framework.php' ) ) {
			if ( ! class_exists( 'ReduxFramework' ) ) {
				require_once( MIXT_PLUGINS_DIR . '/redux/ReduxCore/framework.php' );
			}
		} else {
			$plugins[] = array(
				'name'     => 'Redux Framework',
				'slug'     => 'redux-framework',
				'required' => true
			);
		}
		// Custom Panel CSS
		function redux_mixt_css() {
			wp_register_style( 'redux-mixt-css', MIXT_FRAME_URI . '/admin/css/redux-mixt.css', array(), time(), 'all' );  
			wp_enqueue_style( 'redux-mixt-css' );

			wp_register_script( 'redux-mixt-js', MIXT_FRAME_URI . '/admin/js/redux-mixt.js', array( 'jquery' ), time(), 'all' );  
			wp_enqueue_script( 'redux-mixt-js' );
		}
		add_action( 'redux/page/mixt_opt/enqueue', 'redux_mixt_css', 2 );

		// Config
		if ( ! isset( $mixt_opt ) && file_exists( MIXT_FRAME_DIR . '/redux-config.php' ) ) {
			require_once( MIXT_FRAME_DIR . '/redux-config.php' );
		}

	// CMB2 Framework

		if ( ( ! isset($mixt_opt) || $mixt_opt['page-metaboxes'] != '0' ) && file_exists( MIXT_FRAME_DIR . '/cmb2-config.php' ) ) {
			require_once( MIXT_FRAME_DIR . '/cmb2-config.php' );

			if ( ! file_exists( MIXT_PLUGINS_DIR . '/cmb2/init.php') ) {
				$plugins[] = array(
					'name'     => 'CMB2',
					'slug'     => 'cmb2',
					'required' => true
				);
			}
		}

	// MICF library & Config

		if ( file_exists( MIXT_PLUGINS_DIR . '/micf/menu-item-custom-fields.php' ) ) {
			require_once( MIXT_PLUGINS_DIR . '/micf/menu-item-custom-fields.php' );
		} else {
			$plugins[] = array(
				'name'     => 'Menu Item Custom Fields',
				'slug'     => 'menu-item-custom-fields',
				'required' => true
			);
		}
		if ( file_exists( MIXT_FRAME_DIR . '/micf-config.php' ) ) {
			require_once( MIXT_FRAME_DIR . '/micf-config.php' );
		}

	// WP-Sass

		if ( file_exists( MIXT_PLUGINS_DIR . '/wp-sass/wp-sass.php' ) ) {
			require_once( MIXT_PLUGINS_DIR . '/wp-sass/wp-sass.php' );
		}

	// WPBakery Visual Composer

		$plugins[] = array(
			'name'     => 'WPBakery Visual Composer',
			'slug'     => 'js_composer',
			'source'   => MIXT_PLUGINS_DIR . '/js_composer.zip',
			'required' => false,
			'force_deactivation' => true
		);

	// LayerSlider

		$plugins[] = array(
			'name' => 'LayerSlider WP',
			'slug' => 'LayerSlider',
			'source' => MIXT_PLUGINS_DIR . '/layerslider.zip',
			'required' => false,
			'version' => '5.0.2',
			'force_deactivation' => true
		);

	// Update Notifier

		if ( file_exists( MIXT_PLUGINS_DIR . '/theme-update/envato-wp-theme-updater.php' ) ) {

			$username = $api_key = '';

			if ( isset($mixt_opt) ) {
				$username = $mixt_opt['tf-update-user'];
				$api_key  = $mixt_opt['tf-update-key'];

				load_template( MIXT_PLUGINS_DIR . '/theme-update/envato-wp-theme-updater.php' );
				Envato_WP_Theme_Updater::init( $username, $api_key, 'novalex' );
			}
		}

	// Return missing plugins

	return $plugins;
}

// Run TGMPA Function

require_once( MIXT_PLUGINS_DIR . '/class-tgm-plugin-activation.php' );

add_action( 'tgmpa_register', 'mixt_register_plugins' );

function mixt_register_plugins() {

	$plugins = mixt_plugins();

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

	tgmpa( $plugins, $config );
}


// LOAD CUSTOM POST TYPES PLUGIN

add_action('after_setup_theme', 'mixt_load_plugins');

// This function loads the plugin.
function mixt_load_plugins() {

	if ( ! function_exists('mixt_posts_register') ) {
		// MIXT Custom Post Types

		require_once( MIXT_PLUGINS_DIR . '/mixt-posts/mixt-posts.php' );
	}
}


// RUN INIT FUNCTION

add_action('init', 'mixt_on_init');

/**
 * Apply global options
 */
function mixt_on_init() {

	global $mixt_opt;

	if ( is_array($mixt_opt) ) {

		// WP Admin bar
		if ( $mixt_opt['show-admin-bar'] == false ) {
			show_admin_bar(false);
		}

		if ( isset($mixt_opt['nav-themes']) ) {
			update_option('nav-themes', $mixt_opt['nav-themes']);
		}
		
	}
}


// LOAD INCLUDES & MODULES

$mixt_inc_files = array(
	'breadcrumbs.php',   // Breadcrumbs
	'custom-header.php', // Custom Header
	'jetpack.php',       // Jetpack Bullshit
	'template-tags.php', // Custom Template Tags
	'extras.php',        // Extra Functions
	'customizer.php',    // Customizer Additions
	'modules.php',       // Modules
);

mixt_requires( $mixt_inc_files, MIXT_INC_DIR );

$dynamic_css = false; // todo: set to options value

if ( $dynamic_css ) {
	require_once MIXT_PLUGINS_DIR . '/wp-sass/wp-sass.php' ;
} else {
	$dynamic_css = false;
	require_once MIXT_FRAME_DIR . '/mixt-modules/dynamic-styles/dynamic.css.php' ;
}

// Admin Functions
require_once MIXT_FRAME_DIR . '/admin/mixt-admin.php';

// Color Manipulation
require_once MIXT_FRAME_DIR . '/libs/color-manipulation.php';

// MIXT ShortGen
// require_once MIXT_PLUGINS_DIR . '/shortcodes-mixt/mixt_shortcodes.php';
