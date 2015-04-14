<?php

/**
 * MIXT Options Framework
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access

/**
 * Retreive Post Meta
 */
function mixt_meta( $key, $post_id = '', $single = true ) {
	if ( ! $post_id || $post_id == '' ) {
		$post_id = get_queried_object_id();
	}
	return get_post_meta( $post_id, $key, $single );
}

/**
 * Get options to set up part of the site. Page options will override global ones.
 *
 * @param array $option_arr array of options to retrieve
 * @param int $post_id id of the post for which to retreive meta options
 */
function mixt_get_options($option_arr = array(), $post_id = '') {

	global $mixt_opt;

	if ( $post_id == '' && ( is_category() || is_author() ) ) { $post_id = null; }

	$options = array();

	if ( isset($option_arr) ) {
		$setup_opt = $option_arr;

		foreach ( $setup_opt as $k => $option ) {
			$key     = isset($option['key']) ? $option['key'] : $k;
			$type    = isset($option['type']) ? $option['type'] : 'bool';
			$true    = isset($option['true']) ? $option['true'] : 'true';
			$false   = isset($option['false']) ? $option['false'] : 'false';
			$default = isset($option['default']) ? $option['default'] : '';
			$return  = isset($option['return']) ? $option['return'] : 'bool';
			$prefix  = isset($option['prefix']) ? $option['prefix'] : '';
			$suffix  = isset($option['suffix']) ? $option['suffix'] : '';

			$meta_key = '_mixt-' . $key;
			if ( is_null($post_id) ) { $page_value = null; }
			else if ( ! empty($post_id) ) { $page_value = mixt_meta($meta_key, $post_id); }
			else { $page_value = mixt_meta($meta_key); }

			$global_value = isset( $mixt_opt[$key] ) ? $mixt_opt[$key] : '';
			if ( $type == 'bool' ) {
				if ( $global_value == '1' ) { $global_value = 'true'; }
				else if ( $global_value == '0' ) { $global_value = 'false'; }
			}

			if ( ! empty($page_value) && $page_value != 'auto' ) {
				$option_value = $page_value;
			} else {
				$option_value = $global_value;
			}

			if ( $return == 'bool' || $return == 'isset' ) {
				if ( $option_value == $true ) {
					$options[$k] = 'true';
				} else {
					if ( $return == 'isset' ) {
						$options[$k] = null;
					} else {
						$options[$k] = 'false';
					}
				}
				
			} else if ( $return == 'value' ) {
				if ( empty($option_value) && ! empty($default) ) {
					$option_value = $default;
				}
				$options[$k] = ( is_array($option_value) ) ? $option_value : $prefix . $option_value . $suffix;

			} else if ( is_array($return) ) {
				if ( isset($return[$option_value]) ) {
					$options[$k] = $return[$option_value];
				} else if ( isset($return['default']) ) {
					$options[$k] = $return['default'];
				} else {
					$options[$k] = '';
				}
			}

		}
	}

	return $options;
}