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
	'extras.php',
	'dcss/dynamic-css.php',
);
mixt_requires( $modules, 'modules' );


// Admin Integration
if ( is_admin() ) {
	require_once( MIXT_FRAME_DIR . '/admin/mixt-admin.php' );
}


/**
 * Load Power Up
 */
require_once( MIXT_FRAME_DIR . '/class-powerup.php' );


/**
 * Update options after they are saved
 */
function mixt_options_changed( $mixt_opt = null ) {
	if ( is_null($mixt_opt) || ! is_array($mixt_opt) ) { global $mixt_opt; }

	// Custom Sidebars
	if ( array_key_exists('reg-sidebars', $mixt_opt) ) { update_option('mixt-sidebars', $mixt_opt['reg-sidebars']); }

	// Post Excerpt Length
	if ( array_key_exists('post-excerpt-length', $mixt_opt) && intval($mixt_opt['post-excerpt-length']) > 0 ) { update_option('mixt-post-excerpt-length', $mixt_opt['post-excerpt-length']); }

	// Themes
	if ( array_key_exists('themes-master', $mixt_opt) ) { update_option('mixt-themes-enabled', $mixt_opt['themes-master']); }
	if ( array_key_exists('site-themes', $mixt_opt) ) { update_option('mixt-site-themes', $mixt_opt['site-themes']); }
	if ( array_key_exists('nav-themes', $mixt_opt) ) { update_option('mixt-nav-themes', $mixt_opt['nav-themes']); }

	// Update Custom CSS
	$dcss = new Mixt_DCSS();
	$dcss->print_stylesheet();

	// Social Profiles
	if ( array_key_exists('social-profiles', $mixt_opt) && ! empty($mixt_opt['social-profiles']) ) { update_option('mixt-social-profiles', $mixt_opt['social-profiles']); }
	else { update_option('mixt-social-profiles', mixt_preset_social_profiles('networks')); }
	if ( array_key_exists('post-sharing-profiles', $mixt_opt) && ! empty($mixt_opt['post-sharing-profiles']) ) { update_option('mixt-sharing-profiles', $mixt_opt['post-sharing-profiles']); }
	else { update_option('mixt-sharing-profiles', mixt_preset_social_profiles('sharing')); }
}
add_action('redux/options/mixt_opt/settings/change', 'mixt_options_changed', 2);
add_action('customize_save_after', 'mixt_options_changed', 99);

/**
 * Add user settings to theme_mods
 */
function mixt_options_to_mods( $mixt_opt ) {
	set_theme_mod('mixt_opt', $mixt_opt);
}
add_action('redux/options/mixt_opt/settings/change', 'mixt_options_to_mods', 3);

// Customizer Preview
if ( is_customize_preview() ) {
	require_once( MIXT_FRAME_DIR . '/admin/customizer.php' );
}


// Initialize and Extend Visual Composer
if ( defined('WPB_VC_VERSION') ) {
	vc_set_shortcodes_templates_dir( MIXT_PLUGINS_DIR . '/vc-extend/templates' );

	include_once( MIXT_PLUGINS_DIR . '/vc-extend/vc-extend.php' );
}


// Initialize LayerSlider As Included With Theme
function mixt_layerslider_overrides() {
	// Disable auto-updates
	$GLOBALS['lsAutoUpdateBox'] = false;
}
add_action('layerslider_ready', 'mixt_layerslider_overrides');


// Configure WooCommerce
if ( class_exists('WooCommerce') ) {
	require_once( MIXT_FRAME_DIR . '/woocommerce-config.php' );
}


/**
 * Enqueue theme scripts and stylesheets
 */
function mixt_scripts() {
	// Main Stylesheet
	wp_enqueue_style( 'mixt-main', MIXT_URI . '/dist/main.css', array(), MIXT_VERSION );

	// Custom Stylesheet
	if ( file_exists(MIXT_DIR . '/dist/dynamic.css') && filesize(MIXT_DIR . '/dist/custom.css') !== 0 ) {
		wp_enqueue_style( 'mixt-custom', MIXT_URI . '/dist/custom.css', array(), MIXT_VERSION );
	}

	// Dynamic Stylesheet
	if ( file_exists(MIXT_UPLOAD_PATH . '/dynamic.css') ) {
		wp_enqueue_style( 'mixt-dynamic', MIXT_UPLOAD_URI . '/dynamic.css', array(), MIXT_VERSION );
	}

	// Icon Fonts
	$icon_fonts = (array) Mixt_Options::get('assets', 'icon-fonts');
	foreach ( $icon_fonts as $font => $val ) {
		if ( $val ) wp_enqueue_style( "mixt-$font", MIXT_URI . "/assets/fonts/$font/$font.css", array(), MIXT_VERSION );
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
function mixt_admin_scripts( $hook ) {
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
	if ( ! empty($opt['page']['page-type']) && $opt['page']['page-type'] == 'single' ) {
		if ( get_option('page_comments') && in_array($opt['layout']['comment-pagination-type'], array('ajax-click', 'ajax-scroll')) ) {
			$opt['layout']['comment-default-page'] = get_option('default_comments_page', 'newest');
		}
	}

	return apply_filters('mixt_local_options', $opt);
}
