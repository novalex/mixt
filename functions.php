<?php

/**
 * Core Functions
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access

// DEFINE THEME CONSTANTS

define( 'MIXT_VERSION', wp_get_theme()->get('Version') );

define( 'MIXT_DIR', get_template_directory() );            // Base Theme Path
define( 'MIXT_URI', get_template_directory_uri()) ;        // Base Theme URI

define( 'MIXT_FRAME_DIR', MIXT_DIR . '/framework' );       // Framework Path
define( 'MIXT_FRAME_URI', MIXT_URI . '/framework' );       // Framework URI

define( 'MIXT_MODULES_DIR', MIXT_DIR . '/modules' );       // Modules Path
define( 'MIXT_MODULES_URI', MIXT_URI . '/modules' );       // Modules URI

define( 'MIXT_PLUGINS_DIR', MIXT_FRAME_DIR . '/plugins' ); // Plugins Path
define( 'MIXT_PLUGINS_URI', MIXT_FRAME_URI . '/plugins' ); // Plugins URI

define( 'MIXT_THEME', 'aqua' );                            // Default Theme


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
	'footer-tags.php',
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


// GENERAL ACTIONS


/**
 * Run wp_head functions
 */
function mixt_wp_head() {
	if ( Mixt_Options::get('page', 'responsive') ) {
		?>
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
		<?php
	}
}
add_action('wp_head', 'mixt_wp_head', 1);


/**
 * Run functions before main wrap
 */
function mixt_before_wrap() {
	?>
	<script type="text/javascript" id="mixt-test-js">document.body.className = document.body.className.replace('no-js','js');</script>
	<?php
}
add_action('mixt_before_wrap', 'mixt_before_wrap');


/**
 * Run functions before nav wrap
 */
function mixt_before_nav_wrap() {
	// Show Secondary Navbar
	if ( Mixt_Options::get('nav', 'second-nav') ) {
		mixt_second_nav();
	}

	// Show Header Media (Above Navbar)
	if ( Mixt_Options::get('header', 'enabled') && Mixt_Options::get('nav', 'position') == 'below' ) {
		mixt_head_media();
	}
}
add_action('mixt_before_nav_wrap', 'mixt_before_nav_wrap');


/**
 * Run functions before content wrap
 */
function mixt_before_content_wrap() {
	// Show Header Media (Below Navbar)
	if ( Mixt_Options::get('header', 'enabled') && Mixt_Options::get('nav', 'position') == 'above' ) {
		mixt_head_media();
	}

	// Show Location Bar
	if ( ( ! Mixt_Options::get('header', 'enabled') || ! Mixt_Options::get('header', 'content-info') ) && Mixt_Options::get('page', 'location-bar') ) {
		mixt_location_bar();
	}
}
add_action('mixt_before_content_wrap', 'mixt_before_content_wrap');


/**
 * Run functions before sidebar
 */
function mixt_before_sidebar() {
	// Child Page Navigation
	if ( Mixt_Options::get('sidebar', 'page-nav') ) {
		mixt_child_page_nav();
	}
}
add_action('mixt_before_sidebar', 'mixt_before_sidebar');


/**
 * Run functions after content wrap
 */
function mixt_after_content_wrap() {
	// Back To Top Button
	if ( mixt_get_option( array( 'key' => 'back-to-top' ) ) ) {
		echo '<a href="#" id="back-to-top" class="btn btn-accent" data-no-hash-scroll="true">';
			echo mixt_get_icon('back-to-top');
		echo '</a>';
	}
}
add_action('mixt_after_content_wrap', 'mixt_after_content_wrap');


// GENERAL CLASS FILTERS


/**
 * Construct body classes
 */
function mixt_body_classes( $classes ) {
	$classes[] = 'no-js';
	$classes[] = 'body-theme-' . Mixt_Options::get('themes', 'site');
	if ( Mixt_Options::get('page', 'layout') == 'boxed' ) $classes[] = 'boxed';
	if ( ! Mixt_Options::get('page', 'responsive') ) $classes[] = 'non-responsive';
	if ( Mixt_Options::get('page', 'page-type') == 'onepage' ) $classes[] = 'one-page';
	if ( Mixt_Options::get('page', 'page-loader') ) $classes[] = 'loading';

	// Add class to blogs with more than 1 published author
	if ( is_multi_author() ) { $classes[] = 'blog-multi'; }

	// Old WP Version Handling
	$version = empty($wp_version) ? get_bloginfo('version') : $wp_version;
	// Slim Admin Bar in WP < 3.8
	if ( version_compare($version, '3.8', '<') ) { $classes[] = 'admin-bar-slim'; }

	return $classes;
}
add_filter('body_class', 'mixt_body_classes');


/**
 * Construct main wrap classes
 */
function mixt_wrap_classes( $classes ) {
	$classes[] = 'nav-full';
	if ( Mixt_Options::get('page', 'fullwidth') ) $classes[] = 'fullwidth';
	if ( Mixt_Options::get('nav', 'layout') == 'vertical' ) {
		$classes[] = 'nav-vertical';
		$classes[] = ( Mixt_Options::get('nav', 'vertical-pos') == 'left' ) ? 'nav-left' : ' nav-right';
	}
	if ( Mixt_Options::get('header', 'enabled') ) {
		$classes[] = 'has-head-media';
		if ( Mixt_Options::get('nav', 'transparent') ) $classes[] = 'nav-transparent';
		if ( Mixt_Options::get('nav', 'position') == 'below' ) $classes[] = 'nav-below';
	}
	return $classes;
}
add_filter('mixt_wrap_class', 'mixt_wrap_classes');


/**
 * Construct inner wrap classes
 */
function mixt_wrap_inner_classes( $classes ) {
	$classes[] = 'main-theme';
	$classes[] = 'theme-' . Mixt_Options::get('themes', 'site');
	return $classes;
}
add_filter('mixt_wrap_inner_class', 'mixt_wrap_inner_classes');


/**
 * Construct nav wrap classes
 */
function mixt_nav_wrap_classes( $classes ) {
	$classes[] = 'logo-' . Mixt_Options::get('nav', 'logo-align');

	if ( Mixt_Options::get('nav', 'layout') == 'vertical' ) {
		$classes[] = ( Mixt_Options::get('nav', 'vertical-mode') == 'fixed' ) ? 'vertical-fixed' : 'vertical-static';
	}
	return $classes;
}
add_filter('mixt_nav_wrap_class', 'mixt_nav_wrap_classes');


/**
 * Construct navbar classes
 */
function mixt_nav_classes( $classes ) {
	$classes[] = 'theme-' . Mixt_Options::get('themes', 'nav');

	if ( Mixt_Options::get('nav', 'layout') == 'vertical' ) {
		$classes[] = 'vertical';
	} else {
		$classes[] = 'horizontal';
		if ( Mixt_Options::get('nav', 'mode') == 'fixed' ) $classes[] = 'sticky';
	}
	if ( Mixt_Options::get('nav', 'bordered') ) $classes[] = 'bordered';
	if ( ! Mixt_Options::get('nav', 'hover-bg') ) $classes[] = 'no-hover-bg';
	return $classes;
}
add_filter('mixt_nav_class', 'mixt_nav_classes');


/**
 * Construct navbar menu classes
 */
function mixt_nav_menu_classes( $classes ) {
	$classes[] = 'nav';
	$classes[] = 'navbar-nav';
	if ( Mixt_Options::get('nav', 'active-bar') ) {
		$classes[] = 'active-' . Mixt_Options::get('nav', 'active-bar-pos');
	} else {
		$classes[] = 'no-active';
	}
	return $classes;
}
add_filter('mixt_nav_menu_class', 'mixt_nav_menu_classes');


/**
 * Construct content wrap classes
 */
function mixt_content_wrap_classes( $classes ) {
	$classes[] = 'container';
	if ( Mixt_Options::get('sidebar', 'enabled') && Mixt_Options::get('page', 'page-type') != 'onepage' ) {
		$classes[] = 'has-sidebar';
		if ( Mixt_Options::get('sidebar', 'position') == 'left' ) $classes[] = 'sidebar-left';
	} else {
		$classes[] = 'no-sidebar';
	}
	return $classes;
}
add_filter('mixt_content_wrap_class', 'mixt_content_wrap_classes');


/**
 * Construct content classes
 */
function mixt_content_classes( $classes ) {
	if ( Mixt_Options::get('page', 'posts-page') ) {
		$classes[] = 'blog-' . Mixt_Options::get('layout', 'type');
		if ( Mixt_Options::get('layout', 'type') != 'standard' ) $classes[] = 'blog-' . Mixt_Options::get('layout', 'columns') . '-col';
	}
	return $classes;
}
add_filter('mixt_content_class', 'mixt_content_classes');


/**
 * Construct sidebar classes
 */
function mixt_sidebar_classes( $classes ) {
	$classes[] = 'sidebar';
	$classes[] = 'widget-area';
	if ( Mixt_Options::get('sidebar', 'hide') ) {
		$classes[] = 'hidden-xs';
	}
	return $classes;
}
add_filter('mixt_sidebar_class', 'mixt_sidebar_classes');


/**
 * Construct footer classes
 */
function mixt_footer_classes( $classes ) {
	$classes[] = 'theme-' . Mixt_Options::get('themes', 'footer');
	return $classes;
}
add_filter('mixt_footer_class', 'mixt_footer_classes');
