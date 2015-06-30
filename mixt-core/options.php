<?php

/**
 * MIXT Options Framework
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access


/**
 * Theme configuration class with helper methods
 */
class MIXT {
	protected static $config = array();

	// Initialize object and set options once all data becomes available
	function __construct() {
		add_action('get_header', array($this, 'init'));
	}

	public function init() {
		$queried = get_queried_object();
		self::set('page', null, array(
			'page-type'      => self::page_type(),
			'posts-page'     => self::is_posts_page(),
			'show-admin-bar' => is_admin_bar_showing(),
		));
		self::add('page', $this->options('page'));
		self::set('theme', null, $this->options('theme'));
		self::set('nav', null, $this->options('nav'));
		self::set('header', null, $this->options('header'));
		self::set('layout', null, $this->options('layout'));
	}

	public static function get($group, $key = null) {
		if ( $group == 'all' ) { return self::$config; }
		else {
			if ( empty($key) ) { return self::$config[$group]; }
			else { return self::$config[$group][$key]; }
		}
	}
	public static function set($group, $key, $val) {
		if ( empty($key) ) { self::$config[$group] = $val; }
		else { self::$config[$group][$key] = $val; }
	}
	public static function add($group, $val) {
		self::$config[$group] = array_merge(self::$config[$group], $val);
	}

	private function options($group) {
		$page_type = self::$config['page']['page-type'];
		if ( $group == 'layout' && $page_type != 'blog' && self::$config['page']['posts-page'] ) {
			global $mixt_opt;
			$page_type .= '-page';
			if ( ! empty($mixt_opt[$page_type.'-inherit']) && $mixt_opt[$page_type.'-inherit'] ) { $page_type = 'blog'; }
		}

		$options = array(
			'theme' => array(
				'site' => array( 'key' => 'site-theme', 'type' => 'str', 'return' => 'value', 'default' => 'aqua' ),
				'nav'  => array( 'key' => 'nav-theme', 'type' => 'str', 'return' => 'value', 'default' => 'aqua' ),
			),
			'page' => array(
				'page-loader'      => array(),
				'fullwidth'        => array( 'key' => 'page-fullwidth' ),
				'sidebar'          => array( 'key' => 'page-sidebar' ),
				'sidebar-id'       => array( 'type' => 'str', 'return' => 'value', 'default' => 'sidebar-1' ),
				'sidebar-position' => array( 'type' => 'str', 'return' => 'value', 'default' => 'right' ),
				'location-bar'     => array(),
			),
			'nav' => array(
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

	// Get page type
	public static function page_type() {
		if ( is_author() ) { return 'author'; }
		else if ( is_category() ) { return 'category'; }
		else if ( is_date() ) { return 'date'; }
		else if ( is_search() ) { return 'search'; }
		else if ( is_tag() ) { return 'tag'; }
		else if ( self::is_blog() ) { return 'blog'; }
		else { return 'single'; }
	}
	// Check if page is a blog page
	public static function is_blog() {
		return ( ! is_front_page() && is_home() || get_page_template_slug() == 'templates/blog.php' );
	}
	// Check if page is a posts page
	public static function is_posts_page() { return ( self::page_type() != 'single' ); }

	/**
	 * WP get_post_meta() helper function
	 */
	public static function mixt_meta( $key, $id = null, $single = true ) {
		if ( ! $id || $id == '' ) { $id = get_queried_object_id(); }
		return get_post_meta( intval($id), $key, $single );
	}

	/**
	 * Get global and page specific options. Page options will override global ones.
	 *
	 * @param array $option_arr options to retrieve
	 * @param int $post_id id of the post or page for which to retreive meta options
	 */
	public static function get_options($option_arr = array(), $post_id = null) {
		global $mixt_opt;

		$options = array();

		$is_posts_page = self::$config['page']['posts-page'];
		$page_type     = self::$config['page']['page-type'];
		if ( $page_type != 'blog' ) { $page_type .= '-page'; }

		if ( ! empty($option_arr) && is_array($option_arr) ) {
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
				if ( ! empty($post_id) ) { $page_value = get_post_meta($post_id, $meta_key, true); }
				else if ( $is_posts_page && ! empty($mixt_opt[$page_type.'-'.$key]) ) { $page_value = $mixt_opt[$page_type.'-'.$key]; }
				else { $page_value = get_post_meta(get_queried_object_id(), $meta_key, true); }
				
				// Get Global Option Value
				$global_value = isset( $mixt_opt[$key] ) ? $mixt_opt[$key] : '';
				if ( $type == 'bool' ) {
					if ( $global_value == '1' ) { $global_value = 'true'; }
					else if ( $global_value == '0' ) { $global_value = 'false'; }
				}

				if ( ! empty($page_value) && $page_value != 'auto' ) { $option_value = $page_value; }
				else { $option_value = $global_value; }

				if ( $return == 'bool' || $return == 'isset' ) {
					if ( $option_value == $true ) { $options[$k] = true; }
					else {
						if ( $return == 'isset' ) { $options[$k] = null; }
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
		}
		return $options;
	}
}
new MIXT;

function mixt_get_options($option_arr) { return MIXT::get_options($option_arr); }
function mixt_meta($key, $post_id = null, $single = true) { return MIXT::mixt_meta($key, $post_id, $single); }
