<?php

/**
 * Core Functions
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access

// DEFINE THEME CONSTANTS

define( 'MIXT_VERSION', wp_get_theme()->get('Version') );

define('MIXT_DIR', get_template_directory());            // Base Theme Path
define('MIXT_URI', get_template_directory_uri());        // Base Theme URI

define('MIXT_CORE_DIR', MIXT_DIR . '/core');             // Core Files Path
define('MIXT_CORE_URI', MIXT_URI . '/core');             // Core Files URI

define('MIXT_FRAME_DIR', MIXT_DIR . '/framework');       // Framework Path
define('MIXT_FRAME_URI', MIXT_URI . '/framework');       // Framework URI

define('MIXT_MODULES_DIR', MIXT_DIR . '/modules');       // Modules Path
define('MIXT_MODULES_URI', MIXT_URI . '/modules');       // Modules URI

define('MIXT_PLUGINS_DIR', MIXT_FRAME_DIR . '/plugins'); // Plugins Path
define('MIXT_PLUGINS_URI', MIXT_FRAME_URI . '/plugins'); // Plugins URI

define('MIXT_THEME', 'aqua');                            // Default Theme


/**
 * Load files and display an error message if a file is not found. Looks in child theme first.
 *
 * @param array  $files The files to load
 * @param string $dir   Relative path to directory in which to look for files
 */
function mixt_requires($files, $dir) {
	$child_dir = get_stylesheet_directory().'/'.$dir.'/';
	$parent_dir = get_template_directory().'/'.$dir.'/';
	foreach ( $files as $file ) {
		if ( file_exists( $child_dir . $file ) ) {
			require_once( $child_dir . $file );
		} else if ( file_exists( $parent_dir . $file ) ) {
			require_once( $parent_dir . $file );
		} else {
			trigger_error( esc_html__( 'Error locating file for inclusion', 'mixt' ) . ': ' . $file, E_USER_ERROR );
		}
	}
}


// LOAD CORE FILES

$core_files = array(
	'assets.php',
	'helpers.php',
	'options.php',
	'init.php',
	'header-tags.php',
	'navwalker.php',
	'tags.php',
	'post.php',
);
mixt_requires( $core_files, 'core' );


// SET UP THEME AND REGISTER FEATURES

if ( ! isset( $content_width ) ) {
	// Set The Content Width
	$content_width = 960;
}

/**
 * Register various theme features and support
 */
function mixt_setup() {

	if ( function_exists('add_theme_support') ) {
		// WP 4.1+ Title Tag Support
		add_theme_support('title-tag');

		// Add default posts and comments RSS feed links to head
		add_theme_support('automatic-feed-links');

		// Enable support for Post Thumbnails on posts and pages
		add_theme_support('post-thumbnails');

		// Enable support for Post Formats
		add_theme_support('post-formats', array( 'aside', 'image', 'video', 'audio', 'gallery', 'link', 'quote', 'status' ));

		// HTML5 support
		add_theme_support('html5', array( 'gallery', 'caption' ));
	}

	// Add Translation Support
	load_theme_textdomain('mixt', apply_filters('mixt_lang_path', MIXT_DIR . '/lang'));

	// Register Navigation Menus
	register_nav_menus( array(
		'primary'          => esc_html__( 'Main Nav', 'mixt' ),
		'sec_navbar_left'  => esc_html__( 'Secondary Nav Left Side', 'mixt' ),
		'sec_navbar_right' => esc_html__( 'Secondary Nav Right Side', 'mixt' ),
		'404_page'         => esc_html__( '404 Page Nav', 'mixt' ),
	) );

	// Custom Image Sizes
	add_image_size('mixt-large', 960, 460, true);
	add_image_size('mixt-medium', 320, 200, true);
	add_image_size('mixt-small', 120, 120, true);
	add_image_size('mixt-grid', 600, 360, true);
}
add_action('after_setup_theme', 'mixt_setup');


/**
 * Register Widgetized Areas
 */
function mixt_widgets_init() {

	// Main Sidebar
	register_sidebar( array(
		'name' => esc_html__( 'Sidebar', 'mixt' ),
		'id'   => 'sidebar-1',
		'before_widget' => '<aside id="%1$s" class="widget %2$s">', 'after_widget' => '</aside>',
		'before_title' => '<h3 class="widget-title">', 'after_title' => '</h3>',
	) );

	// Custom Sidebars
	$custom_sidebars = get_option('mixt-sidebars');
	if ( is_array($custom_sidebars) ) {
		foreach ( $custom_sidebars as $sidebar ) {
			if ( empty($sidebar['name']) || empty($sidebar['id']) ) continue;

			$sidebar['id'] = sanitize_title($sidebar['id']);
			
			register_sidebar( array(
				'name' => $sidebar['name'],
				'id'   => $sidebar['id'],
				'before_widget' => '<aside id="%1$s" class="widget %2$s">', 'after_widget' => '</aside>',
				'before_title' => '<h3 class="widget-title">', 'after_title' => '</h3>',
			) );
		}
	}

	// Footer Sidebars
	register_sidebar( array(
		'name' => esc_html__( 'Footer Column 1', 'mixt' ),
		'id'   => 'footer-1',
		'before_widget' => '<aside id="%1$s" class="widget %2$s">', 'after_widget' => '</aside>',
		'before_title' => '<h4 class="widget-title">', 'after_title' => '</h4>',
	) );
	register_sidebar( array(
		'name' => esc_html__( 'Footer Column 2', 'mixt' ),
		'id'   => 'footer-2',
		'before_widget' => '<aside id="%1$s" class="widget %2$s">', 'after_widget' => '</aside>',
		'before_title' => '<h4 class="widget-title">', 'after_title' => '</h4>',
	) );
	register_sidebar( array(
		'name' => esc_html__( 'Footer Column 3', 'mixt' ),
		'id'   => 'footer-3',
		'before_widget' => '<aside id="%1$s" class="widget %2$s">', 'after_widget' => '</aside>',
		'before_title' => '<h4 class="widget-title">', 'after_title' => '</h4>',
	) );
	register_sidebar( array(
		'name' => esc_html__( 'Footer Column 4', 'mixt' ),
		'id'   => 'footer-4',
		'before_widget' => '<aside id="%1$s" class="widget %2$s">', 'after_widget' => '</aside>',
		'before_title' => '<h4 class="widget-title">', 'after_title' => '</h4>',
	) );
}
add_action('widgets_init', 'mixt_widgets_init');


// Title Tag Backwards Compatibility
if ( ! function_exists( '_wp_render_title_tag' ) ) {
	function mixt_render_title() {
		?>
		<title><?php wp_title(); ?></title>
		<?php
	}
	add_action('wp_head', 'mixt_render_title');
}


// Remove admin bar inline styles
function remove_adminbar_styles() {
	remove_action('wp_head', '_admin_bar_bump_cb');
}
add_action('get_header', 'remove_adminbar_styles');
