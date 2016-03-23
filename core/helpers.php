<?php

/**
 * Helper Functions
 *
 * @package MIXT\Core
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access


// MIXT Upload Directory

$wp_upload_dir = wp_upload_dir();
define( 'MIXT_UPLOAD_PATH', $wp_upload_dir['basedir'] . '/mixt'); // Upload Path
define( 'MIXT_UPLOAD_URI', $wp_upload_dir['baseurl'] . '/mixt');  // Upload URL

// Create upload directory if it doesn't exist
if ( ! is_dir( MIXT_UPLOAD_PATH ) ) {
	wp_mkdir_p( MIXT_UPLOAD_PATH );
}

// Placeholder Image
define( 'MIXT_IMG_PLACEHOLDER', MIXT_URI . '/assets/img/patterns/placeholder.jpg' );


if ( ! function_exists('mixt_media_breakpoints') ) {
	/**
	 * Return an array of media query breakpoints or a single one
	 * 
	 * @param  string $bp Breakpoint to return, or 'all' for array
	 * @return mixed
	 */
	function mixt_media_breakpoints( $bp = 'all' ) {
		if ( Mixt_Options::get('page', 'responsive') ) {
			$bps = apply_filters( 'mixt_media_breakpoints', array(
				'mercury' => 480,
				'mars'    => 767,
				'venus'   => 992,
				'earth'   => 1200,
			) );
		} else {
			$bps = array( 'mercury' => 1, 'mars' => 2, 'venus' => 3, 'earth' => 4 );
		}

		if ( $bp == 'all' ) {
			return $bps;
		} else {
			return $bps[$bp];
		}
	}
}


if ( ! function_exists('mixt_unautop') ) {
	/**
	 * Remove misplaced p tags added by the wpautop function
	 *
	 * @param  string $string
	 * @return string
	 */
	function mixt_unautop( $string ) {
		$string = force_balance_tags($string);
		$string = str_replace(array('<p></p>', '<br />'), '', $string);
		return trim($string);
	}
}
add_filter('mixt_unautop', 'mixt_unautop');


if ( ! function_exists('mixt_shortcode_unwrap') ) {
	/**
	 * Remove unwanted p tags wrapping shortcodes
	 *
	 * @param  string $string
	 * @return string
	 */
	function mixt_shortcode_unwrap( $string ) {
		$string = str_replace(array('<p>[', ']</p>'), array('[', ']'), $string);
		return trim($string);
	}
}
add_filter('mixt_sc_unwrap', 'mixt_shortcode_unwrap');


if ( ! function_exists('mixt_sanitize_html_classes') && function_exists('sanitize_html_class') ) {
	/**
	 * Sanitize a string or array of multiple HTML classes
	 *
	 * @param mixed  $cls
	 * @param string $fallback
	 */
	function mixt_sanitize_html_classes( $cls, $fallback = null ) {
		if ( empty($cls) ) return '';

		if ( ! is_string($cls) ) {
			$cls = implode(' ', $cls);
		}
		$cls = array_map('sanitize_html_class', explode(' ', $cls));

		return implode(' ', $cls);
	}
}


if ( ! function_exists('mixt_regex_pattern') ) {
	/**
	 * Retreive a regex pattern for specific purpose
	 *
	 * @param string $type
	 */
	function mixt_regex_pattern( $type ) {
		$pat = array(
			'url'               => "https?:\/\/[\S]*",
			'image'             => "(<img [^>]* \/>)",
			'iframe'            => "<iframe.*?<\/iframe>",
			'cite'              => "<cite[^\<]*>(.*)<\/cite>",
			'anchor'            => "<a href=\"(.*?)\".*?>(.*?)<\/a>",
			'blockquote'        => "<blockquote[^\<]*>(.*)<\/blockquote>",
			'image-attributes'  => "([\\w\\-]+)=([^\"'>]+|(['\"]?)(?:[^\\3]|\\3+)+?\\3)",
			'audio-shortcode'   => "\[(\[?)(audio)(?![\w-])([^\]\/]*(?:\/(?!\])[^\]\/]*)*?)(?:(\/)\]|\](?:([^\[]*+(?:\[(?!\/\2\])[^\[]*+)*+)\[\/\2\])?)(\]?)",
			'video-shortcode'   => "\[(\[?)(video)(?![\w-])([^\]\/]*(?:\/(?!\])[^\]\/]*)*?)(?:(\/)\]|\](?:([^\[]*+(?:\[(?!\/\2\])[^\[]*+)*+)\[\/\2\])?)(\]?)",
			'gallery-shortcode' => "\[(\[?)(gallery)(?![\w-])([^\]\/]*(?:\/(?!\])[^\]\/]*)*?)(?:(\/)\]|\](?:([^\[]*+(?:\[(?!\/\2\])[^\[]*+)*+)\[\/\2\])?)(\]?)",
		);

		if ( array_key_exists($type, $pat) ) { return $pat[$type]; }
	}
}


/**
 * Display a message when no menu is assigned to a location
 *
 * @param bool $echo       Whether to echo or return string
 * @param bool $bs_wrapper Wrap string inside Bootstrap markup
 */
function mixt_no_menu_msg( $echo = true, $bs_wrapper = false ) {
	if ( ! current_user_can('edit_theme_options') ) return;

	$no_menu_msg = sprintf('<p class="no-menu-msg text-cont">%1$s! <a href="%2$s" title="%3$s">%4$s</a>.</p>',
		esc_html__('No menu assigned', 'mixt'),
		get_admin_url( null, 'nav-menus.php' ),
		esc_attr__('Manage menus', 'mixt'),
		esc_html__('Click here to assign one', 'mixt')
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
	public function dir_struct( $dir ) {
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

	public static function enqueue( $handle ) {
		$handle = self::$plugin_prefix . $handle;
		wp_enqueue_script($handle);
		wp_enqueue_style($handle);
	}
}
new Mixt_JS_Plugins;

/**
 * Wrapper for enqueueing JS plugins
 * 
 * @param string $plugin Name of the plugin
 */
function mixt_enqueue_plugin( $plugin ) {
	return Mixt_JS_Plugins::enqueue($plugin);
}


/**
 * Determine if hex color is light
 * 
 * @param  string $hex HEX code of color to analyze
 * @return bool
 */
function mixt_hex_is_light( $hex ) {
	$hex = str_replace('#', '', $hex);

	if ( strlen($hex) == 3 ) { $hex .= $hex; }

	$r = hexdec(substr($hex, 0, 2));
	$g = hexdec(substr($hex, 2, 2));
	$b = hexdec(substr($hex, 4, 2));

	$avg_lum = (($r * 299) + ($g * 587) + ($b * 114)) / 1000;

	if ( $avg_lum > 170 ) {
		return true;
	} else {
		return false;
	}
}


/**
 * Determine an image's average luminance
 * 
 * @param  string  $file Path or URL to image
 * @param  integer $num_samples
 * @return integer Luminance value
 */
function mixt_get_img_luminance( $file, $num_samples = 10 ) {
	$extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
	if ( $extension == 'jpg' || $extension == 'jpeg' ) {
		$img = imagecreatefromjpeg($file);
	} else if ( $extension == 'png' ) {
		$img = imagecreatefrompng($file);
	} else {
		return 170;
	}

	$width = imagesx($img);
	$height = imagesy($img);
	$x_step = intval($width/$num_samples);
	$y_step = intval($height/$num_samples);
	$total_lum = 0;
	$sample_no = 1;

	for ($x=0; $x<$width; $x+=$x_step) {
		for ($y=0; $y<$height; $y+=$y_step) {
			$rgb = imagecolorat($img, $x, $y);
			$r = ($rgb >> 16) & 0xFF;
			$g = ($rgb >> 8) & 0xFF;
			$b = $rgb & 0xFF;

			$lum = ($r+$r+$b+$g+$g+$g)/6;
			$total_lum += $lum;
			$sample_no++;
		}
	}
	$avg_lum  = $total_lum / $sample_no;

	return floor($avg_lum);
}
