<?php

/**
 * Admin Integration
 *
 * @package MIXT\Admin
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access


// Menu Pages
require_once( MIXT_FRAME_DIR . '/admin/menu-pages.php' );

// Custom Nav Menu Elements
require_once( MIXT_FRAME_DIR . '/admin/admin-menus.php' );

// Custom Media Meta Fields
require_once( MIXT_FRAME_DIR . '/admin/media-meta.php' );


/**
 * Set flag to redirect to welcome page on theme activation
 */
function mixt_activation_flag() {
	set_transient('_mixt_activation_redirect', true, 30);
}
add_action('after_switch_theme', 'mixt_activation_flag');


/**
 * Perform activation redirect
 */
function mixt_activation_redirect() {
	// Return if the activation redirect flag is not set, activating from the network admin or in bulk
	if ( ! get_transient('_mixt_activation_redirect') || is_network_admin() || isset($_GET['activate-multi']) ) return;

	// Delete the redirect transient
	delete_transient('_mixt_activation_redirect');

	// Set flag to show welcome screen
	set_transient('_mixt_show_welcome', true, 30);

	// Redirect to welcome page
	wp_redirect( admin_url('admin.php?page=mixt-admin') );
	exit();
}
add_action('admin_init', 'mixt_activation_redirect');


/**
 * Add mixt classes to admin body
 */
function mixt_admin_body_class( $classes ) {
	return $classes . ' mixt';
}
add_filter('admin_body_class', 'mixt_admin_body_class');


/**
 * Disable Redux Welcome page
 */
function mixt_disable_redux_welcome() {
	delete_transient('_redux_activation_redirect');
	remove_action('init', array('Redux_Welcome', 'do_redirect'));
}
add_action('init', 'mixt_disable_redux_welcome', 9);


/**
 * Calculate image luminosity after upload and set meta
 */
function mixt_media_upload( $id ) {
	if ( wp_attachment_is_image($id) ) {
		$src = wp_get_attachment_image_src( $id, 'full' );

		$img_lum = mixt_get_img_luminance( $src[0] );
		$img_lum_val = 'none';

		if ( $img_lum < 170 ) {
			$img_lum_val = 'dark';
		} else if ( $img_lum > 170 ) {
			$img_lum_val = 'light';
		}

		update_post_meta( $id, '_mixt_luminosity', $img_lum_val );
	}
}
add_action('add_attachment', 'mixt_media_upload');


/**
 * Add editor stylesheets
 */
function mixt_editor_styles() {
	global $mixt_opt;
	// Icon Fonts
	$icon_fonts = ( empty($mixt_opt['icon-fonts']) ) ? array() : $mixt_opt['icon-fonts'];
	foreach ( $icon_fonts as $font => $val ) {
		if ( $val ) add_editor_style(MIXT_URI . "/assets/fonts/$font/$font.css");
	}
}
add_action('admin_init', 'mixt_editor_styles');
