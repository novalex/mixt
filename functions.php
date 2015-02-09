<?php

/**
 * MIXT Functions and Definitions
 *
 * @package mixt
 */


// DEFINE THEME CONSTANTS

define( 'MIXT_DIR', get_template_directory() );                   // Base Theme Path
define( 'MIXT_URI', get_template_directory_uri() );               // Base Theme URI

define( 'MIXT_FRAME_DIR', MIXT_DIR . '/framework');               // Framework Path
define( 'MIXT_PLUGINS_DIR', MIXT_DIR . '/framework/plugins');     // Plugins Path
define( 'MIXT_INC_DIR', MIXT_DIR . '/inc');                       // Includes Path

define( 'MIXT_FRAME_URI', MIXT_URI . '/framework');               // Framework URI
define( 'MIXT_PLUGINS_URI', MIXT_URI . '/framework/plugins');     // Plugins URI
define( 'MIXT_INC_URI', MIXT_URI . '/inc');                       // Includes URI


// LOAD MIXT CORE FILES & FRAMEWORK

if ( ! function_exists('mixt_requires') ) {

	function mixt_requires($files, $dir) {
		foreach ( $files as $file ) {
			$file = $dir . '/' . $file;
			if ( ! file_exists( $file ) ) {
				trigger_error( sprintf(__('Error locating %s for inclusion', 'mixt'), $file), E_USER_ERROR );
			}
			require_once $file;
		}
		unset( $file );
	}
}

$mixt_core_files = array(
	'mixt-init.php',
	'mixt-options.php',
	'mixt-header.php',
	'mixt-helpers.php',
	'mixt-assets.php',
	'mixt-navwalker.php',
);

mixt_requires( $mixt_core_files, MIXT_FRAME_DIR . '/mixt-core' );

unset($mixt_core_files);


// SET UP THEME AND REGISTER FEATURES

if ( ! isset( $content_width ) ) {
	// Set The Content Width
	$content_width = 750;
}

if ( ! function_exists( 'mixt_setup' ) ) {
	function mixt_setup() {

		global $cap, $content_width;

		// This theme styles the visual editor with editor-style.css to match the theme style.
		add_editor_style();

		if ( function_exists( 'add_theme_support' ) ) {

			// WP 4.1+ Title Tag Support
			add_theme_support( 'title-tag' );

			// Add default posts and comments RSS feed links to head
			add_theme_support( 'automatic-feed-links' );

			// Enable support for Post Thumbnails on posts and pages
			add_theme_support( 'post-thumbnails' );

			// Enable support for Post Formats
			add_theme_support( 'post-formats', array( 'aside', 'image', 'video', 'quote', 'link' ) );

			// Setup the WordPress core custom background feature
			add_theme_support( 'custom-background', apply_filters( 'mixt_custom_background_args', array(
				'default-color' => 'ffffff',
				'default-image' => '',
			) ) );

			// Declare WooCommerce Support
			add_theme_support( 'woocommerce' );

		}

		// Add Translation Support
		load_theme_textdomain( 'mixt', MIXT_DIR . '/languages' );

		// Register Navigation Menus
		register_nav_menus( array(
			'primary'          => __( 'Primary Navbar', 'mixt' ),
			'sec_navbar_left'  => __( 'Secondary Navbar Left Side', 'mixt' ),
			'sec_navbar_right' => __( 'Secondary Navbar Right Side', 'mixt' ),
		) );
	}
}
add_action( 'after_setup_theme', 'mixt_setup' );

// Initialize Visual Composer As Included With Theme
add_action( 'vc_before_init', 'mixt_vc_overrides' );
function mixt_vc_overrides() {
	vc_set_as_theme();
}

// Initialize LayerSlider As Included With Theme
add_action('layerslider_ready', 'mixt_layerslider_overrides');
function mixt_layerslider_overrides() {
	// Disable auto-updates
	$GLOBALS['lsAutoUpdateBox'] = false;
}


// Register Widgetized Areas
function mixt_widgets_init() {

	// Main Sidebar
	register_sidebar( array(
		'name'          => __( 'Sidebar', 'mixt' ),
		'id'            => 'sidebar-1',
		'before_widget' => '<aside id="%1$s" class="widget %2$s">',
		'after_widget'  => '</aside>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );

	// Footer Sidebar
	register_sidebar( array(
		'name' => 'Footer Widgets',
		'id' => 'footer-1',
		'before_widget' => '<div>',
		'after_widget' => '</div>',
		'before_title' => '<h2 class="rounded">',
		'after_title' => '</h2>',
	) );
}
add_action( 'widgets_init', 'mixt_widgets_init' );


// ENQUEUE SCRIPTS AND STYLESHEETS

function mixt_scripts() {

	global $dynamic_css;

	// Theme Stylesheet
	// wp_enqueue_style( 'mixt-style', get_stylesheet_uri() );

	// Bootstrap CSS
	wp_enqueue_style( 'bootstrap-style', MIXT_URI . '/dist/bootstrap.css' );

	// Master CSS
	wp_enqueue_style( 'master-style', MIXT_URI . '/dist/master.css' );

	// Font Awesome CSS
	wp_enqueue_style( 'whh-glyphs', MIXT_URI . '/inc/css/whhg.css', false, '4.1.0' );

	// Custom CSS
	if ( file_exists(MIXT_UPLOAD_PATH . '/custom-style.css') ) {
		// wp_enqueue_style( 'custom-style', MIXT_UPLOAD_URL . '/custom-style.css' );
	}

	// Dynamic Sass
	if ( $dynamic_css ) {
		wp_enqueue_style( 'dynamic-style', MIXT_FRAME_URI . '/mixt-modules/dynamic-styles/dynamic.scss.php' );
	}

	// Bootstrap JS
	wp_enqueue_script( 'mixt-bootstrap-js', MIXT_URI . '/dist/bootstrap.js', array( 'jquery' ) );

	// MIXT JS Plugins
	wp_enqueue_script( 'mixt-plugins-js', MIXT_URI . '/dist/plugins.js', array( 'jquery' ), '1.0', true );

	// MIXT JS Modules
	wp_enqueue_script( 'mixt-modules-js', MIXT_URI . '/dist/modules.js', array( 'jquery', 'mixt-plugins-js' ), '1.0', true );

	// Global Functions JS
	wp_enqueue_script( 'mixt-global-js', MIXT_URI . '/js/global.js', array( 'jquery', 'mixt-modules-js' ), '1.0', true );

	// Comment Reply Js
	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}

}
add_action( 'wp_enqueue_scripts', 'mixt_scripts' );


// ENQUEUE ADMIN SCRIPTS AND STYLESHEETS

function mixt_admin_scripts($hook) {
	// Menu Page Scripts
	if ( $hook == 'nav-menus.php' ) {
		wp_enqueue_script( 'mixt-admin-menu-js', MIXT_FRAME_URI . '/admin/js/menu-scripts.js', array('jquery'), '1.0' );
	// Page Admin Scripts
	} elseif ( $hook == 'post.php' || $hook == 'post-new.php' ) {
		wp_enqueue_script( 'mixt-admin-page-js', MIXT_FRAME_URI . '/admin/js/page-scripts.js', array('jquery'), '1.0', true );
		wp_enqueue_style( 'mixt-admin-page-css', MIXT_FRAME_URI . '/admin/css/page-styles.css', false, '1.0' );
	} else {
		return;
	}
}
add_action( 'admin_enqueue_scripts', 'mixt_admin_scripts' );

// VARIOUS THEME OPTIONS AND FUNCTIONS

// Defer JS Files

// add_filter( 'clean_url', function( $url ) {
//     if ( strpos($url, '.js') === false ) {
//         return $url;
//     }
//     return "$url' defer='defer";
// }, 11, 1 );


// Title Tag Backwards Compatibility
if ( ! function_exists( '_wp_render_title_tag' ) ) {
	function mixt_render_title() { ?>
		<title><?php wp_title( '-', true, 'right' ); ?></title>
	<?php }
	add_action( 'wp_head', 'mixt_render_title' );
}

// Remove admin bar inline styles
add_action( 'get_header', 'remove_adminbar_styles' );
function remove_adminbar_styles() {
	remove_action('wp_head', '_admin_bar_bump_cb');
}

function mixt_meta_options() {
	// $has_sidebar = mixt_meta('mixt_page_sidebar');
}
// add_action( 'wp_head', 'mixt_meta_options' );