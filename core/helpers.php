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
 * @param bool $echo Whether to echo or return string
 * @param bool $bs_wrapper Wrap string inside Bootstrap markup
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
 * Handle JS Plugins and their dependencies
 */
class Mixt_JS_Plugins {
	public static $plugin_prefix = 'mixt-';
	protected static $plugin_path;
	protected static $plugin_uri;

	public function __construct() {
		self::$plugin_path = MIXT_DIR . '/dist/plugins';
		self::$plugin_uri = MIXT_URI . '/dist/plugins';

		add_action('wp_enqueue_scripts', array($this, 'register'), 99);
	}

	/**
	 * Recursively scan a given directory and return its structure
	 * 
	 * @return array
	 */
	public function dir_struct($dir) {
		$struct = array();
		foreach ( array_diff(scandir($dir), array('.', '..')) as $key => $value ) {
			if ( is_dir($dir . DIRECTORY_SEPARATOR . $value) ) {
				$struct[$value] = $this->dir_struct($dir . DIRECTORY_SEPARATOR . $value);
			} else {
				$name = explode('.', $value)[0];
				$struct[$name] = $value;
			}
		}
		return $struct;
	}

	public function register() {
		$scripts = $stylesheets = array();
		$plugins = $this->dir_struct(self::$plugin_path);

		foreach ( $plugins as $handle => $plugin ) {
			// Plugins with own directory
			if ( is_array($plugin) ) {
				$plugin_path = self::$plugin_path.'/'.$handle;
				$plugin_uri = self::$plugin_uri.'/'.$handle;

				// JS File
				if ( ! empty($plugin['js'][$handle]) && file_exists( $plugin_path.'/js/'.$plugin['js'][$handle] ) ) {
					$scripts[$handle] = $plugin_uri.'/js/'.$plugin['js'][$handle];
				}

				// CSS File
				if ( ! empty($plugin['css'][$handle]) && file_exists( $plugin_path.'/css/'.$plugin['css'][$handle] ) ) {
					$stylesheets[$handle] = $plugin_uri.'/css/'.$plugin['css'][$handle];
				}

			// Plugins in top level directory
			} else if ( file_exists( self::$plugin_path.'/'.$plugin ) ) {
				$scripts[$handle] = self::$plugin_uri.'/'.$plugin;
			}
		}

		// Register JS Files
		foreach ( $scripts as $handle => $file ) {
			$handle = self::$plugin_prefix . $handle;
			wp_register_script( $handle, $file, array('jquery'), MIXT_VERSION, true );
		}

		// Register CSS Files
		foreach ( $stylesheets as $handle => $file ) {
			$handle = self::$plugin_prefix . $handle;
			wp_register_style( $handle, $file, array(), MIXT_VERSION );
		}
	}

	public static function enqueue($handle) {
		$handle = self::$plugin_prefix . $handle;
		wp_enqueue_script($handle);
		wp_enqueue_style($handle);
	}
}
new Mixt_JS_Plugins;

function mixt_enqueue_plugin($plugin) {
	return Mixt_JS_Plugins::enqueue($plugin);
}