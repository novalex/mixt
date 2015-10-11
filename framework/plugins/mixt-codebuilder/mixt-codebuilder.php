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

class Mixt_CodeBuilder {

	function __construct() {
		define( 'MIXTCB_VERSION', '1.0' );
		define( 'MIXTCB_DIR', MIXT_PLUGINS_DIR . '/mixt-codebuilder' );
		define( 'MIXTCB_URL', MIXT_PLUGINS_URI . '/mixt-codebuilder' );

		add_action( 'admin_init', array($this, 'admin_init') );
	}

	/**
	 * Load admin panel & assets
	 */
	function admin_init() {
		require_once( MIXTCB_DIR . '/panel.php' );

		// Load Fields
		foreach ( glob( __DIR__ . '/includes/fields/*.php' ) as $file ) { include_once $file; }

		do_action('mixtcb_load');

		wp_enqueue_script( 'jquery-ui-sortable' );

		$local = array(
			'dir'          => MIXTCB_URL,
			'button_title' => __( 'Build Shortcode', 'mixt' ),
			'media_frame_title' => __( 'Select Media', 'mixt' ),
		);
		wp_localize_script( 'jquery', 'mixt_cb', $local );
	}
}

new Mixt_CodeBuilder;

?>
