<?php

/**
 * Options Framework
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access


/**
 * Theme configuration class
 */
class Mixt_Options {
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
		$queried = get_queried_object();
		self::set('page', null, array(
			'page-type'      => self::page_type(),
			'posts-page'     => self::is_posts_page(),
			'show-admin-bar' => is_admin_bar_showing(),
		));
		self::add('page', self::options('page'));
		self::set('themes', null, self::options('themes'));
		self::set('assets', null, self::options('assets'));
		self::set('nav', null, self::options('nav'));
		self::set('header', null, self::options('header'));
		self::set('layout', null, self::options('layout'));

		// Run post-init functions
		$this->after_init();
	}

	/**
	 * Return an option, group of options, or all options
	 * @param  string $group
	 * @param  string $key   key to retreive from group
	 */
	public static function get($group, $key = null) {
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
	 * Set an option or group
	 * @param string $group
	 * @param string $key
	 * @param mixed  $val
	 */
	public static function set($group, $key, $val) {
		if ( empty($key) ) { self::$config[$group] = $val; }
		else { self::$config[$group][$key] = $val; }
	}

	/**
	 * Add a group of options to the config array
	 * @param string $group
	 * @param mixed  $val
	 */
	public static function add($group, $val) {
		self::$config[$group] = array_merge(self::$config[$group], $val);
	}

	public static function options($group) {
		$page_type = self::$config['page']['page-type'];
		if ( $group == 'layout' && $page_type != 'blog' && self::$config['page']['posts-page'] ) {
			global $mixt_opt;
			$page_type .= '-page';
			if ( ! empty($mixt_opt[$page_type.'-inherit']) && $mixt_opt[$page_type.'-inherit'] ) { $page_type = 'blog'; }
		}

		$options = array(
			'themes' => array(
				'site' => array( 'key' => 'site-theme', 'type' => 'str', 'return' => 'value', 'default' => MIXT_THEME ),
				'nav'  => array( 'key' => 'nav-theme', 'type' => 'str', 'return' => 'value', 'default' => MIXT_THEME ),
				'sec-nav'  => array( 'key' => 'sec-nav-theme', 'type' => 'str', 'return' => 'value', 'default' => MIXT_THEME ),
			),
			'assets' => array(
				'icon-fonts' => array( 'return' => 'value' ),
			),
			'page' => array(
				'layout'           => array( 'key' => 'site-layout', 'return' => 'value' ),
				'page-loader'      => array(),
				'fullwidth'        => array( 'key' => 'page-fullwidth' ),
				'sidebar'          => array( 'key' => 'page-sidebar' ),
				'sidebar-id'       => array( 'type' => 'str', 'return' => 'value', 'default' => 'none' ),
				'sidebar-position' => array( 'type' => 'str', 'return' => 'value', 'default' => 'right' ),
				'location-bar'     => array(),
				'child-page-nav'   => array(),
			),
			'nav' => array(
				'layout'         => array( 'key' => 'nav-layout', 'return' => 'value' ),
				'mode'           => array( 'key' => 'nav-mode', 'return' => 'value' ),
				'logo-align'     => array(
					'return'     => array( '1' => 'logo-left', '2' => 'logo-center', '3' => 'logo-right', 'default' => 'logo-left' ),
				),
				'bordered'       => array( 'key' => 'nav-bordered' ),
				'padding'        => array( 'key' => 'nav-padding', 'return' => 'value' ),
				'position'       => array( 'key' => 'nav-position', 'return' => 'value' ),
				'transparent'    => array( 'key' => 'nav-transparent' ),
				'hover-bg'       => array( 'key' => 'nav-hover-bg' ),
				'active-bar'     => array( 'key' => 'nav-active-bar' ),
				'active-bar-pos' => array( 'key' => 'nav-active-bar-pos', 'return' => 'value' ),

				'second-nav'     => array(),
			),
			'header' => array(
				'enabled'      => array( 'key' => 'head-media' ),
				'fullscreen'   => array( 'key' => 'head-fullscreen' ),
				'content-info' => array( 'key' => 'head-content-info' ),
				'content-fade' => array( 'key' => 'head-content-fade' ),
				'scroll'       => array( 'key' => 'head-content-scroll' ),
				'media-type'   => array( 'key' => 'head-media-type', 'type' => 'str', 'return' => 'value', 'default' => 'color' ),
				'img-src'      => array( 'key' => 'head-img-src', 'type' => 'str', 'return' => 'value' ),
				'parallax'     => array( 'key' => 'head-img-parallax' ),

				'location-bar' => array(),
				'loc-bar-left-content' => array( 'type' => 'str', 'return' => 'value' ),
				'loc-bar-right-content' => array( 'type' => 'str', 'return' => 'value' ),
			),
			'layout' => array(
				'type'            => array( 'key' => $page_type . '-type', 'return' => 'value', 'default' => 'standard' ),
				'columns'         => array( 'key' => $page_type . '-columns', 'return' => 'value', 'default' => '2' ),
				'feat-show'       => array( 'key' => $page_type . '-feat-show', 'default' => true ),
				'feat-size'       => array( 'key' => $page_type . '-feat-size', 'return' => 'value', 'default' => 'blog-large' ),
				'post-info'       => array( 'key' => $page_type . '-post-info', 'default' => 'false' ),
				'post-content'    => array( 'return' => 'value' ),
				'meta-show'       => array( 'key' => $page_type . '-meta-show', 'return' => 'value', 'default' => 'header' ),
				'pagination-type' => array( 'return' => 'value' ),
				'show-page-nr'    => array(),
				'comment-pagination-type' => array( 'return' => 'value' ),
			),
		);

		return self::get_options($options[$group]);
	}

	/**
	 * Post-init functions
	 */
	protected function after_init() {
		if ( in_array(self::get('page', 'sidebar-id'), array('none', 'auto')) ) {
			if ( self::is_shop() ) {
				// Set sidebar for shop pages
				global $mixt_opt;
				if ( isset($mixt_opt['wc-sidebar']) ) self::set('page', 'sidebar-id', $mixt_opt['wc-sidebar']);
			} else {
				self::set('page', 'sidebar-id', 'sidebar-1');
			}
		}

		// Override options for vertical navbar
		if ( self::get('nav', 'layout') == 'vertical' ) {
			self::set('nav', 'mode', 'static');
			self::set('nav', 'position', 'above');
			self::set('nav', 'transparent', false);
		}

		// Perform "options set" action
		do_action('mixt_options_set');
	}

	/**
	 * Get page type
	 * @return string
	 */
	public static function page_type() {
		if ( is_author() ) { return 'author'; }
		else if ( is_category() ) { return 'category'; }
		else if ( is_date() ) { return 'date'; }
		else if ( is_search() ) { return 'search'; }
		else if ( is_tag() ) { return 'tag'; }
		else if ( is_tax() ) { return 'taxonomy'; }
		else if ( self::is_blog() ) { return 'blog'; }
		else if ( self::is_portfolio() ) { return 'portfolio'; }
		else if ( get_page_template_slug() == 'templates/one-page.php' ) { return 'onepage'; }
		else if ( get_page_template_slug() == 'templates/blank.php' ) { return 'blank'; }
		else { return 'single'; }
	}
	// Check if page is a blog page
	public static function is_blog() {
		return ( ! is_front_page() && is_home() || get_page_template_slug() == 'templates/blog.php' );
	}
	// Check if page is a portfolio page
	public static function is_portfolio() {
		return ( is_post_type_archive('portfolio') || get_page_template_slug() == 'templates/portfolio.php' );
	}
	// Check if page is a shop page
	public static function is_shop() {
		return class_exists('WooCommerce') && ( is_woocommerce() || is_cart() || is_checkout() );
	}
	// Check if page is a posts page
	public static function is_posts_page() {
		$single_pages = array(
			'single',
			'onepage',
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
	 * @param mixed   $option_arr options to retrieve
	 * @param integer $post_id id of the post or page for which to retreive meta options
	 */
	public static function get_options($option_arr, $post_id = null) {
		$options = array();

		if ( empty($option_arr) || ! is_array($option_arr) ) { return $options; }

		global $mixt_opt;

		if ( empty(self::$config['page']) ) {
			$is_posts_page = false;
			$page_type = 'single';
		} else {
			$is_posts_page = self::$config['page']['posts-page'];
			$page_type     = self::$config['page']['page-type'];
			if ( $page_type != 'blog' ) { $page_type .= '-page'; }
		}

		foreach ( $option_arr as $k => $option ) {
			$defaults = array(
				'key'     => $k,
				'type'    => 'bool',
				'true'    => 'true',
				'false'   => 'false',
				'default' => '',
				'return'  => 'bool',
				'prefix'  => '',
				'suffix'  => '',
			);
			extract(wp_parse_args($option, $defaults));

			// Get Page Specific Option Value
			$meta_key = '_mixt-' . $key;
			$meta_val = get_post_meta(get_queried_object_id(), $meta_key, true);
			if ( ! empty($post_id) ) {
				$page_value = get_post_meta($post_id, $meta_key, true);
			} else if ( ! empty($mixt_opt[$page_type.'-'.$key]) && $meta_val == '' ) {
				$page_value = $mixt_opt[$page_type.'-'.$key];
			} else {
				if ( $is_posts_page && ! in_array($page_type, array('blog', 'portfolio-page')) ) {
					$page_value = null;
				} else if ( class_exists('WooCommerce') && is_shop() ) {
					$page_value = get_post_meta(wc_get_page_id('shop'), $meta_key, true);
				} else {
					$page_value = $meta_val;
				}
			}
			
			// Get Global Option Value
			$global_value = isset( $mixt_opt[$key] ) ? $mixt_opt[$key] : '';
			if ( $type == 'bool' ) {
				if ( $global_value == '1' ) { $global_value = 'true'; }
				else if ( $global_value == '0' ) { $global_value = 'false'; }
			}

			if ( ! empty($page_value) && $page_value != 'auto' ) { $option_value = $page_value; }
			else { $option_value = $global_value; }

			if ( $return == 'bool' || $return == 'isset' ) {
				if ( $option_value == $true ) {
					$options[$k] = true;
				} else {
					if ( $return == 'isset' ) { $options[$k] = null; }
					else if ( empty($option_value) && $option_value !== false ) { $options[$k] = $default; }
					else { $options[$k] = false; }
				}
				
			} else if ( $return == 'value' ) {
				if ( empty($option_value) && ! empty($default) ) { $option_value = $default; }
				$options[$k] = ( is_array($option_value) ) ? $option_value : $prefix . $option_value . $suffix;

			} else if ( is_array($return) ) {
				if ( isset($return[$option_value]) ) { $options[$k] = $return[$option_value]; }
				else if ( isset($return['default']) ) { $options[$k] = $return['default']; }
				else { $options[$k] = ''; }
			}
		}
		return $options;
	}
}
new Mixt_Options;

// Wrapper functions
function mixt_get_options($option_arr) { return Mixt_Options::get_options($option_arr); }
function mixt_meta($key, $post_id = null, $single = true) { return Mixt_Options::get_meta($key, $post_id, $single); }