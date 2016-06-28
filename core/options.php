<?php

/**
 * Options Framework
 *
 * @package MIXT\Core
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access


/**
 * Theme configuration class
 */
class Mixt_Options {

	/**
	 * Stored configuration options
	 * @var array
	 */
	protected static $config = array();

	/**
	 * Initialize object and set options once all data becomes available
	 */
	public function __construct() {
		add_action('wp', array($this, 'init'));
	}

	/**
	 * Set options and perform init functions
	 */
	public function init() {
		self::set_options();

		// Run post-init functions
		$this->after_init();
	}

	/**
	 * Return an option, group of options, or all options
	 * 
	 * @param  string $group
	 * @param  string $key   Key to retreive from group
	 */
	public static function get( $group, $key = null ) {
		if ( $group == 'all' ) {
			return self::$config;
		} else {
			if ( ! empty($key) ) {
				if ( ! empty(self::$config[$group]) && array_key_exists($key, self::$config[$group]) ) { return self::$config[$group][$key]; }
			}
			else if ( array_key_exists($group, self::$config) ) { return self::$config[$group]; }
			else { return array(); }
		}
	}

	/**
	 * Set an option or group of options
	 * 
	 * @param string $group
	 * @param string $key
	 * @param mixed  $val
	 */
	public static function set( $group, $key = null, $val ) {
		if ( empty($key) ) { self::$config[$group] = $val; }
		else { self::$config[$group][$key] = $val; }
	}

	/**
	 * Add a group of options to the config array
	 * 
	 * @param string $group
	 * @param mixed  $val
	 */
	public static function add( $group, $val ) {
		self::$config[$group] = array_merge(self::$config[$group], $val);
	}

	/**
	 * Set global options by group
	 * 
	 * @return array
	 */
	public static function set_options() {
		$options = array(
			'themes' => array(
				'site'    => array( 'key' => 'site-theme', 'type' => 'str', 'return' => 'value', 'default' => MIXT_THEME ),
				'nav'     => array( 'key' => 'nav-theme', 'type' => 'str', 'return' => 'value', 'default' => 'auto' ),
				'sec-nav' => array( 'key' => 'sec-nav-theme', 'type' => 'str', 'return' => 'value', 'default' => 'auto' ),
				'footer'  => array( 'key' => 'footer-theme', 'type' => 'str', 'return' => 'value', 'default' => 'auto' ),
			),
			'assets' => array(
				'icon-fonts' => array( 'return' => 'value', 'default' => array( 'fontawesome' => '1' ) ),
			),
			'page' => array(
				'layout'        => array( 'key' => 'site-layout', 'return' => 'value' ),
				'responsive'    => array( 'key' => 'site-responsive' ),
				'page-loader'   => array(),
				'fullwidth'     => array( 'key' => 'page-fullwidth', 'inherited' => true ),
				'location-bar'  => array(),
				'smooth-scroll' => array(),
			),
			'nav' => array(
				'menu'           => array( 'key' => 'nav-menu', 'return' => 'value', 'default' => 'auto', 'inherited' => true ),
				'layout'         => array( 'key' => 'nav-layout', 'return' => 'value' ),
				'mode'           => array( 'key' => 'nav-mode', 'return' => 'value' ),
				'vertical-mode'  => array( 'key' => 'nav-vertical-mode', 'return' => 'value' ),
				'logo-align'     => array( 'return' => array( '1' => 'left', '2' => 'center', '3' => 'right', 'default' => 'left' ) ),
				'bordered'       => array( 'key' => 'nav-bordered' ),
				'padding'        => array( 'key' => 'nav-padding', 'return' => 'value' ),
				'position'       => array( 'key' => 'nav-position', 'return' => 'value' ),
				'vertical-pos'   => array( 'key' => 'nav-vertical-position', 'return' => 'value' ),
				'transparent'    => array( 'key' => 'nav-transparent' ),
				'hover-bg'       => array( 'key' => 'nav-hover-bg' ),
				'active-bar'     => array( 'key' => 'nav-active-bar' ),
				'active-bar-pos' => array( 'key' => 'nav-active-bar-pos', 'return' => 'value' ),
				'opacity'        => array( 'key' => 'nav-opacity', 'type' => 'str', 'return' => 'value', 'default' => '0.95' ),
				'top-opacity'    => array( 'key' => 'nav-top-opacity', 'type' => 'str', 'return' => 'value', 'default' => '0.25' ),

				'second-nav'     => array(),
			),
			'header' => array(
				'enabled'      => array( 'key' => 'head-media' ),
				'height'       => array( 'key' => 'head-height', 'return' => 'value' ),
				'content-info' => array( 'key' => 'head-content-info' ),
				'content-fade' => array( 'key' => 'head-content-fade' ),
				'scroll'       => array( 'key' => 'head-content-scroll' ),
				'media-type'   => array( 'key' => 'head-media-type', 'type' => 'str', 'return' => 'value', 'default' => 'color' ),
				'img-src'      => array( 'key' => 'head-img-src', 'type' => 'str', 'return' => 'value' ),
				'parallax'     => array( 'key' => 'head-parallax', 'return' => 'value' ),

				'location-bar' => array(),
				'loc-bar-left-content' => array( 'type' => 'str', 'return' => 'value' ),
				'loc-bar-right-content' => array( 'type' => 'str', 'return' => 'value' ),
			),
			'layout' => array(
				'type'              => array( 'key' => 'layout-type', 'return' => 'value', 'default' => 'standard', 'inherited' => true ),
				'columns'           => array( 'key' => 'layout-columns', 'return' => 'value', 'default' => '2', 'inherited' => true ),
				'feat-show'         => array( 'default' => true, 'inherited' => true ),
				'feat-size'         => array( 'return' => 'value', 'default' => 'mixt-large', 'inherited' => true ),
				'post-info'         => array( 'default' => false, 'inherited' => true ),
				'post-content-type' => array( 'return' => 'value', 'default' => 'full', 'inherited' => true ),
				'meta-show'         => array( 'return' => 'value', 'default' => 'header', 'inherited' => true ),
				'pagination-type'   => array( 'return' => 'value' ),
				'show-page-nr'      => array(),
				'comment-pagination-type' => array( 'return' => 'value' ),
				'info-bar-cookie'         => array(),
				'info-bar-cookie-persist' => array( 'return' => 'value' ),
			),
			'sidebar' => array(
				'enabled'  => array( 'key' => 'page-sidebar', 'inherited' => true, 'default' => true ),
				'id'       => array( 'key' => 'sidebar-id', 'type' => 'str', 'return' => 'value', 'default' => 'none', 'inherited' => true ),
				'position' => array( 'key' => 'sidebar-position', 'type' => 'str', 'return' => 'value', 'default' => 'right' ),
				'hide'     => array( 'key' => 'sidebar-hide' ),
				'page-nav' => array( 'key' => 'child-page-nav' ),
			),
		);

		$page_options = array(
			'page-type'      => self::page_type(true),
			'posts-page'     => self::is_posts_page(),
			'show-admin-bar' => is_admin_bar_showing(),
		);

		/**
		 * Process options
		 */
		foreach ( $options as $group => $opts ) {
			self::set($group, null, self::get_options($opts));
		}

		self::add('page', $page_options);
	}

	/**
	 * Post-initialization functions
	 */
	protected function after_init() {
		// Assign the sidebar ID
		if ( in_array(self::get('sidebar', 'id'), array('none', 'auto')) ) {
			if ( self::is_shop() ) {
				// Set sidebar for shop pages
				global $mixt_opt;
				if ( isset($mixt_opt['shop-page-sidebar-id']) ) self::set('sidebar', 'id', $mixt_opt['shop-page-sidebar-id']);
			} else {
				self::set('sidebar', 'id', 'sidebar-1');
			}
		}

		// Override options for vertical navbar
		if ( self::get('nav', 'layout') == 'vertical' ) {
			self::set('page', 'layout', 'wide');
			self::set('nav', 'mode', 'static');
			self::set('nav', 'position', 'above');
			self::set('nav', 'transparent', false);
		}

		// Add header fullscreen flag
		$header_height = self::get('header', 'height');
		if ( is_array($header_height) && $header_height['height'] == '100%' ) {
			self::set('header', 'fullscreen', true);
		} else {
			self::set('header', 'fullscreen', false);
		}

		// Set the theme for elements when they are set to auto
		$site_theme = self::get('themes', 'site');
		if ( ! array_key_exists( $site_theme, mixt_get_themes('nav') ) ) {
			if ( self::get('themes', 'nav') == 'auto' ) self::set('themes', 'nav', MIXT_THEME);
			if ( self::get('themes', 'sec-nav') == 'auto' ) self::set('themes', 'sec-nav', MIXT_THEME);
		} else {
			if ( self::get('themes', 'nav') == 'auto' ) self::set('themes', 'nav', $site_theme);
			if ( self::get('themes', 'sec-nav') == 'auto' ) self::set('themes', 'sec-nav', $site_theme);
		}
		if ( self::get('themes', 'footer') == 'auto' ) self::set('themes', 'footer', $site_theme);

		// Perform "options set" action
		do_action('mixt_options_set');
	}

	/**
	 * Get page type
	 *
	 * @param  bool $refresh Run the checks again
	 * @return string
	 */
	public static function page_type( $refresh = false ) {
		static $type = '';
		if ( $type != '' && ! $refresh ) return $type;

		if ( is_author() ) { $type = 'author'; }
		else if ( is_tag() ) { $type = 'tag'; }
		else if ( is_date() ) { $type = 'date'; }
		else if ( is_tax() ) { $type = 'taxonomy'; }
		else if ( is_search() ) { $type = 'search'; }
		else if ( is_category() ) { $type = 'category'; }
		else if ( self::is_blog() ) { $type = 'blog'; }
		else if ( self::is_portfolio() ) { $type = 'portfolio'; }
		else if ( self::is_shop('catalog') ) { $type = 'shop'; }
		else if ( get_page_template_slug() == 'templates/one-page.php' ) { $type = 'onepage'; }
		else if ( get_page_template_slug() == 'templates/blank.php' ) { $type = 'blank'; }
		else if ( is_singular('portfolio') ) { $type = 'project'; }
		else { $type = 'single'; }

		return $type;
	}

	// Check if page is a blog page
	public static function is_blog() {
		return ( ( is_home() && ( ! is_front_page() || get_option('show_on_front') == 'posts' ) ) || get_page_template_slug() == 'templates/blog.php' );
	}

	// Check if page is a portfolio page
	public static function is_portfolio() {
		return ( is_post_type_archive('portfolio') || get_page_template_slug() == 'templates/portfolio.php' );
	}

	// Check if page is a shop page
	public static function is_shop( $type = 'any' ) {
		if ( class_exists('WooCommerce') ) {
			if ( $type == 'any' ) {
				return ( is_woocommerce() || is_cart() || is_checkout() );
			} else if ( $type == 'catalog' ) {
				return ( is_shop() || is_product_category() || is_product_tag() );
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	// Check if page is a posts page
	public static function is_posts_page() {
		$single_pages = array(
			'single',
			'blank',
			'onepage',
			'project',
		);
		return ( ! in_array(self::page_type(), $single_pages) );
	}

	/**
	 * WP get_post_meta() helper function
	 */
	public static function get_meta( $key, $id = null, $single = true ) {
		if ( ! $id || $id == '' ) { $id = get_queried_object_id(); }
		return get_post_meta( intval($id), $key, $single );
	}

	/**
	 * Get global and page specific options. Page options will override global ones.
	 * 
	 * @param array   $option_arr Options to retrieve
	 * @param integer $post_id    ID of the post or page for which to retreive meta options
	 */
	public static function get_options( $option_arr, $post_id = null ) {
		$options = array();

		if ( empty($option_arr) || ! is_array($option_arr) ) { return $options; }

		global $mixt_opt;

		$page_type     = self::page_type();
		$is_posts_page = self::is_posts_page();

		if ( empty($post_id) && ( is_singular() || ( ! is_front_page() && is_home() ) ) ) {
			$post_id = get_queried_object_id();
		}

		foreach ( $option_arr as $k => $option ) {
			$defaults = array(
				'key'       => $k,
				'type'      => 'bool',
				'true'      => 'true',
				'false'     => 'false',
				'default'   => '',
				'return'    => 'bool',
				'prefix'    => '',
				'suffix'    => '',
				'inherited' => false,
			);
			extract(wp_parse_args($option, $defaults));

			// Handle inherited options
			if ( $page_type != 'blog' && $is_posts_page ) {
				if ( $inherited && ! empty($mixt_opt[$page_type.'-page-inherit']) && $mixt_opt[$page_type.'-page-inherit'] ) {
					$page_type_now = 'blog';
				} else {
					$page_type_now = $page_type . '-page';
				}
			} else {
				$page_type_now = $page_type;
			}
			$page_type_option = $page_type_now . '-' . $key;

			// Get Page Specific Option Value
			if ( ! empty($post_id) && ( empty($mixt_opt['page-metaboxes']) || $mixt_opt['page-metaboxes'] == 1 ) ) {
				$page_meta_key = '_mixt-' . $key;
				$page_value = get_post_meta($post_id, $page_meta_key, true);
				if ( $page_value == '' ) {
					$page_type_meta_key = '_mixt-' . $page_type_option;
					$page_value = get_post_meta($post_id, $page_type_meta_key, true);
				}
				if ( $page_value == '' ) {
					if ( ! empty($mixt_opt[$page_type_option]) ) {
						$page_value = $mixt_opt[$page_type_option];
					} else if ( $is_posts_page && ! in_array($page_type_option, array('blog', 'portfolio-page')) ) {
						$page_value = null;
					} else if ( class_exists('WooCommerce') && is_shop() ) {
						$page_value = get_post_meta(wc_get_page_id('shop'), $page_meta_key, true);
					}
				}
			} else if ( ! empty($mixt_opt[$page_type_option]) ) {
				$page_value = $mixt_opt[$page_type_option];
			} else {
				$page_value = null;
			}
			
			// Get Global Option Value
			if ( isset($mixt_opt[$page_type_option]) && $mixt_opt[$page_type_option] != 'auto' ) {
				$global_value = $mixt_opt[$page_type_option];
			} else if ( isset($mixt_opt[$key]) ) {
				$global_value = $mixt_opt[$key];
			} else {
				$global_value = '';
			}

			if ( $type == 'bool' ) {
				if ( $page_value === '1' || $page_value === '0' ) {
					$page_value = filter_var($page_value, FILTER_VALIDATE_BOOLEAN);
				}
				if ( $global_value === '1' || $global_value === '0' ) {
					$global_value = filter_var($global_value, FILTER_VALIDATE_BOOLEAN);
				}
			}

			if ( ! empty($page_value) && $page_value != 'auto' ) {
				$option_value = $page_value;
			} else {
				$option_value = $global_value;
			}

			if ( $return == 'bool' || $return == 'isset' ) {
				if ( $option_value == $true ) {
					$value = true;
				} else {
					if ( $return == 'isset' ) { $value = null; }
					else if ( empty($option_value) && $option_value !== false ) { $value = $default; }
					else { $value = false; }
				}
				
			} else if ( $return == 'value' ) {
				if ( empty($option_value) && ! empty($default) ) { $option_value = $default; }
				$value = ( is_array($option_value) ) ? $option_value : $prefix . $option_value . $suffix;

			} else if ( is_array($return) ) {
				if ( isset($return[$option_value]) ) { $value = $return[$option_value]; }
				else if ( isset($return['default']) ) { $value = $return['default']; }
				else { $value = ''; }
			}

			$options[$k] = apply_filters("mixt_option_$key", $value, $k);
		}

		return $options;
	}
}
new Mixt_Options;

// Wrapper functions
if ( ! function_exists('mixt_get_option') ) {
	function mixt_get_option( $option ) {
		$arr = (array) Mixt_Options::get_options( array($option) );
		$arr_val = array_values($arr);
		return $arr_val[0]; }
}
if ( ! function_exists('mixt_get_options') ) {
	function mixt_get_options( $option_arr ) { return Mixt_Options::get_options($option_arr); }
}
if ( ! function_exists('mixt_meta') ) {
	function mixt_meta( $key, $post_id = null, $single = true ) { return Mixt_Options::get_meta($key, $post_id, $single); }
}


/**
 * Function to normalize checkbox values
 * @param $value The raw value
 */
function mixt_option_checkbox_val( $value ) {
	$options = array();

	if ( ! is_array($value) || empty($value) ) return array();

	// Option => state type structure saved by Redux
	if ( is_string(key($value)) ) {
		foreach ( $value as $option => $state ) {
			if ( filter_var($state, FILTER_VALIDATE_BOOLEAN) ) {
				$options[] = $option;
			}
		}

	// Simple multi checkbox structure saved by CMB2
	} else if ( is_int(key($value)) ) {
		$options = $value;
	}

	return $options;
}
