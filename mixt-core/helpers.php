<?php

/**
 * Helper Functions
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access

// MIXT Upload Directory

$wp_upload_dir = wp_upload_dir();
define( 'MIXT_UPLOAD_PATH', $wp_upload_dir['basedir'] . '/mixt'); // Upload Path
define( 'MIXT_UPLOAD_URL', $wp_upload_dir['baseurl'] . '/mixt');  // Upload URL

// Create upload directory if it doesn't exist
if ( ! is_dir( MIXT_UPLOAD_PATH ) ) {
	wp_mkdir_p( MIXT_UPLOAD_PATH );
}


/**
 * Display a message when no menu is assigned to a location
 *
 * @param bool $echo whether to echo or return string
 * @param bool $bs_wrapper wrap string inside Bootstrap markup
 */
function mixt_no_menu_msg($echo = true, $bs_wrapper = false) {
	$menu_page_url  = get_admin_url( null, 'nav-menus.php' );
	$no_menu_asg    = __('No menu assigned', 'mixt');
	$menu_mng_title = __('Manage menus', 'mixt');
	$menu_page_msg  = __('Click here to assign one', 'mixt');

	$no_menu_msg = sprintf('<p class="no-menu-msg text-cont">%1$s! <a href="%2$s" title="%3$s">%4$s</a>.</p>',
		$no_menu_asg,
		$menu_page_url,
		$menu_mng_title,
		$menu_page_msg
	);

	if ( $bs_wrapper ) {
		$no_menu_msg = '<div class="navbar-inner collapse navbar-collapse navbar-responsive-collapse">' . $no_menu_msg . '</div>';
	}

	if ( $echo == false ) {
		return $no_menu_msg;
	} else {
		echo $no_menu_msg;
	}
}


/**
 * Return array of theme names and ids for specified element
 *
 * @param str $elem
 */
function mixt_get_themes($elem = '') {

	if ( empty($elem) ) { return false; }

	$theme_list = array();

	$themes = get_option($elem . '-themes');

	if ( ! empty($themes) && is_array($themes) ) {
		foreach ( $themes as $theme_id => $theme ) {
			if ( $theme['name'] == '' ) {
				$theme_list[$theme_id] = $theme_id;
			} else {
				$theme_list[$theme_id] = $theme['name'];
			}
		}

		return $theme_list;
	} else {
		return false;
	}
}


/**
 * Test For Server Image Manipulation Capabilities
 */
function mixt_img_edit_support() {
	$img_edit_support = array(
		'mime_type' => 'image/png',
		'methods' => array(
			'resize',
			'save',
		),
	);
	return wp_image_editor_supports($img_edit_support);
};


/**
 * Check If Current Page Is A Blog Page
 */
function mixt_is_blog() {
	return ( ! is_front_page() && is_home() );
}


/**
 * Get Current Page Type
 */
function mixt_get_page_type() {
	// Author Page
	if ( is_author() ) { return 'author'; }
	// Blog Page
	else if ( mixt_is_blog() ) { return 'blog'; }
	// Category Page
	else if ( is_category() ) { return 'category'; }
	// Date Page
	else if ( is_date() ) { return 'date'; }
	// Search Page
	else if ( is_search() ) { return 'search'; }
	// Tag Page
	else if ( is_tag() ) { return 'tag'; }
	// Type Not Set Or Singular
	else { return 'single'; }
}


/**
 * Check If Current Page Is A Posts Page
 */
function mixt_is_posts_page() {
	if ( mixt_get_page_type() == 'single' ) { return false; }
	else { return true; }
}


/**
 * Return Array Of Layout Options For The Current Page
 */
function mixt_layout_options() {
	global $mixt_opt;

	$page_type = mixt_get_page_type();
	if ( $page_type != 'blog' ) {
		$page_type .= '-page';
		if ( ! empty($mixt_opt[$page_type.'-inherit']) && $mixt_opt[$page_type.'-inherit'] == true ) { $page_type = 'blog'; }
	}

	$options = array(
		'type' => array(
			'key'     => $page_type . '-type',
			'return'  => 'value',
			'default' => 'standard',
		),
		'columns' => array(
			'key'     => $page_type . '-columns',
			'return'  => 'value',
			'default' => '2',
		),
		'feat-size' => array(
			'key'     => $page_type . '-feat-size',
			'return'  => 'value',
			'default' => 'blog-large',
		),
		'post-info' => array(
			'key'     => $page_type . '-post-info',
			'default' => 'false',
		),
		'meta-show' => array(
			'key'     => $page_type . '-meta-show',
			'return'  => 'value',
			'default' => 'header',
		),
	);

	return mixt_get_options($options);
}
