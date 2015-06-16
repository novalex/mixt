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
 * Output "fancy" title with lines on the side
 */
function mixt_fancy_title($title = '', $classes = '', $align = 'left', $tag = 'h3', $echo = true) {
	$classes = 'title line-title ' . $classes;
	$output = "<div class='$classes'>";
		if ( $align == 'center' || $align == 'right' ) { $output .= '<span class="line-left"></span>'; }
		$output .= "<$tag class='title-text'>$title</$tag>";
		if ( $align == 'center' || $align == 'left' ) { $output .= '<span class="line-right"></span>'; }
	$output .= '</div>';

	if ( $echo ) echo $output;
	else return $output;
}
