<?php

// MIXT Shortcode Generator (MSG)
 
if ( ! defined('MIXT_PLUGINS_URI') || ! defined( 'ABSPATH' ) ) {
	exit;
}

$msg_dir = MIXT_PLUGINS_URI . '/shortcodes-mixt';

function mixt_sg_add_button() {
	if ( !current_user_can( 'edit_posts' ) && ! current_user_can( 'edit_pages' ) ) {
		return;
	}
	if ( 'true' == get_user_option( 'rich_editing' ) ) {
		add_filter( 'mce_external_plugins', 'mixt_sg_add_plugin' );
		add_filter( 'mce_buttons', 'mixt_sg_reg_button' );
	}
}
add_action('admin_head', 'mixt_sg_add_button');

function mixt_sg_add_plugin( $plugin_array ) {
	global $msg_dir;
	$plugin_array['mixt_shortcodes'] = $msg_dir . '/mixt_shortcodes.js';
	return $plugin_array;
}

function mixt_sg_reg_button( $buttons ) {
	array_push( $buttons, 'mixt_sg_button' );
	return $buttons;
}

// // setup the shortcode for use
// function mixt_button_shortcode( $atts, $content = null ) {
// 	extract( shortcode_atts(
// 		array(
// 			'color' => 'blue',
// 			'size' => 'medium',
// 			'style' => 'round',
// 			'align' => 'none',
// 			'text' => '',
// 			'url' => '',
// 	    ),
//     $atts ) );
		
// 	if( $url ) {
// 		return '<div class="mixt-button button-' . $size . ' button-' . $color . ' button-' . $style . ' button-' . $align . '"><a href="' . $url . '">' . $text . $content . '</a></div>';
// 	} else {
// 		return '<div class="mixt-button button-' . $size . ' button-' . $color . ' button-' . $style . ' button-' . $align . '">' . $text . $content . '</div>';
// 	}
// }
// add_shortcode('button', 'mixt_button_shortcode');

// function msg_css() {
// 	global $msg_dir;
// 	wp_enqueue_style('mixt-sg', $msg_dir . '/css/mixt_buttons.css');
// }
// add_action('wp_print_styles', 'msg_css');

// function register_msg_button($buttons) {
// 	array_push($buttons, "|", "mixt_button");
// 	return $buttons;
// }

// function msg_button() {
// 	if ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') ) {
// 		return;
// 	}
// 	if ( get_user_option('rich_editing') == 'true') {
// 		add_filter("mce_external_plugins", "msg_plugin");
// 		add_filter('mce_buttons', 'register_msg_button');
// 	}
// }
// add_action('init', 'msg_button');

// function msg_plugin($plugin_array) {
// 	global $msg_dir;
// 	$plugin_array['mixt_button'] = $msg_dir . '/mixt_shortcodes.js';
// 	return $plugin_array;
// }