<?php

/**
 * Plugin Name: MIXT CodeBuilder
 * Description: Easily build and edit shortcodes
 * Version: 1.0
 * Author: Alex Nitu (novalex)
 * Author URI: http://www.novalx.com
 *
 * Based on ZillaShortcodes
 * http://www.themezilla.com/plugins/zillashortcodes
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access

class MIXTCodeBuilder {

	function __construct() {
		define( 'MIXTCB_VERSION', '1.0' );

		define( 'MIXTCB_DIR', MIXT_PLUGINS_DIR . '/mixt-codebuilder' );
		define( 'MIXTCB_URL', MIXT_PLUGINS_URI . '/mixt-codebuilder' );

		add_action( 'init', array($this, 'init') );
		add_action( 'admin_init', array($this, 'admin_init') );
	}

	/**
	 * Enqueue CSS & JS
	 */
	function init() {
		if ( ! is_admin() ) {
			wp_enqueue_script( 'mixt-cb-script', MIXTCB_URL . '/js/mixt-cb.js', 'jquery', '1.0', true );
		}
	}

	/**
	 * Enqueue admin CSS & JS
	 */
	function admin_init() {
		include_once( MIXTCB_DIR . '/admin.php' );
		add_action( 'wp_ajax_mixtcb_element', 'mixtcb_render_element' );

		wp_enqueue_script( 'jquery-ui-sortable' );

		$local = array(
			'dir'          => MIXTCB_URL,
			'button_title' => __( 'Build Shortcode', 'mixt' ),
		);
		wp_localize_script( 'jquery', 'mixt_cb', $local );
	}
}

new MIXTCodeBuilder;

?>
