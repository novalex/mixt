<?php

/**
 * Core Functions
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access

// DEFINE THEME CONSTANTS

define( 'MIXT_DIR', get_template_directory() );            // Base Theme Path
define( 'MIXT_URI', get_template_directory_uri() );        // Base Theme URI

define( 'MIXT_CORE_DIR', MIXT_DIR . '/mixt-core' );        // Core Files Path
define( 'MIXT_FRAME_DIR', MIXT_DIR . '/framework' );       // Framework Path
define( 'MIXT_MODULES_DIR', MIXT_DIR . '/mixt-modules' );  // Modules Path
define( 'MIXT_PLUGINS_DIR', MIXT_FRAME_DIR . '/plugins' ); // Plugins Path

define( 'MIXT_CORE_URI', MIXT_URI . '/mixt-core' );        // Core Files URI
define( 'MIXT_FRAME_URI', MIXT_URI . '/framework' );       // Framework URI
define( 'MIXT_MODULES_URI', MIXT_URI . '/mixt-modules' );  // Modules URI
define( 'MIXT_PLUGINS_URI', MIXT_FRAME_URI . '/plugins' ); // Plugins URI


// LOAD MIXT CORE FILES & FRAMEWORK

if ( ! function_exists('mixt_requires') ) {
	/**
	 * Load files using require_once() and display an error message if a file is not found
	 *
	 * @param array $files the files to require
	 * @param string $dir path in which to look for files (without trailing slash)
	 */
	function mixt_requires($files, $dir) {
		foreach ( $files as $file ) {
			$file = $dir . '/' . $file;
			if ( ! file_exists( $file ) ) {
				trigger_error( __('Error locating file for inclusion', 'mixt') . ': ' . $file, E_USER_ERROR );
			}
			require_once $file;
		}
		unset( $file );
	}
}

$mixt_core_files = array(
	'assets.php',
	'helpers.php',
	'options.php',
	'init.php',
	'header.php',
	'tags.php',
	'post.php',
	'navwalker.php',
);
mixt_requires( $mixt_core_files, MIXT_CORE_DIR );
unset($mixt_core_files);

// Load Shortcodes
foreach ( glob(MIXT_MODULES_DIR . '/shortcodes/*.php') as $filename ) { include $filename; }

// SET UP THEME AND REGISTER FEATURES

if ( ! isset( $content_width ) ) {
	// Set The Content Width
	$content_width = 750;
}

if ( ! function_exists( 'mixt_setup' ) ) {
	/**
	 * Register various theme features and support
	 */
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
			add_theme_support( 'post-formats', array( 'aside', 'image', 'video', 'audio', 'gallery', 'quote', 'link', ) );

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

		// Custom Blog Image Sizes
		add_image_size( 'blog-large', 960, 460, true );
		add_image_size( 'blog-medium', 320, 200, true );
		add_image_size( 'blog-small', 120, 120, true );
	}
}
add_action( 'after_setup_theme', 'mixt_setup' );


/**
 * Register Widgetized Areas
 */
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


// Title Tag Backwards Compatibility
if ( ! function_exists( '_wp_render_title_tag' ) ) {
	function mixt_render_title() { ?>
		<title><?php wp_title( '-', true, 'right' ); ?></title>
	<?php }
	add_action( 'wp_head', 'mixt_render_title' );
}

// Protected Post Title
function protected_title_format($title) {
	return '<i class="icon icon-key" title="Password Protected"></i>&nbsp;%s';
}
add_filter('protected_title_format', 'protected_title_format');

// Private Post Title
function private_title_format($title) {
	return '<i class="icon icon-eye-close" title="Private"></i>&nbsp;%s';
}
add_filter('private_title_format', 'private_title_format');

// Remove admin bar inline styles
add_action( 'get_header', 'remove_adminbar_styles' );
function remove_adminbar_styles() {
	remove_action('wp_head', '_admin_bar_bump_cb');
}
