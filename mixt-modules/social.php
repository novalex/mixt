<?php

/**
 * Social Profiles
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access

/**
 * Get Social Profiles & Output Links or Return Data
 *
 * @param bool $echo true to echo links, false to return them as a string
 */
function mixt_social_profiles($echo = true) {

	global $mixt_opt;

	$social_profiles = ( ! empty($mixt_opt['social-profiles']) ) ? $mixt_opt['social-profiles'] : '';

	if ( is_array($social_profiles) ) {

		$output = '';
		$cont_classes = 'nav link-list social-links ';

		$hover_color = isset($mixt_opt['social-profiles-color']) ? $mixt_opt['social-profiles-color'] : 'icon';

		$cont_classes .= "hover-$hover_color ";

		foreach ( $social_profiles as $profile ) {

			if ( ! empty($profile['url']) && ! empty($profile['icon']) ) {

				$profile_name = $profile['name'];
				$profile_url  = urldecode($profile['url']);

				if ( ! filter_var( $profile_url, FILTER_VALIDATE_URL ) ) {
					if ( $profile['url'] == 'rss' ) {
						$profile_url = get_bloginfo('rss2_url');
					} else {
						$profile_url = '#';
					}
				}

				$profile_icon  = $profile['icon'];

				if ( isset($profile['color']) ) {
					$color_prop = 'data-color="' . $profile['color'] . '"';
				} else {
					$color_prop = '';
				}
				
				$profile_title = isset($profile['title']) ? $profile['title'] : '';

				$output .= '<li><a href="' . $profile_url . '" title="' . $profile_title . '" target="_blank" ' . $color_prop . '><i class="' . $profile_icon . '"></i></a></li>';
			}

		}

		$before = '<ul class="' . $cont_classes . '">';
		$after  = '</ul>';

		$return_val = $before . $output . $after;

		if ( $echo ) {
			echo $return_val;
		} else {
			return $return_val;
		}
	}
}


/**
 * Return array of preset social networks
 */
function mixt_preset_social_profiles() {

	$profiles = array(
		// Facebook
		'facebook'  => array(
			'name'  => 'Facebook',
			'url'   => 'https://www.facebook.com/',
			'icon'  => 'icon-facebook',
			'color' => '#3b5998',
			'title' => __('Like us on Facebook', 'mixt'),
		),
		// Twitter
		'twitter'  => array(
			'name'  => 'Twitter',
			'url'   => 'https://twitter.com/',
			'icon'  => 'icon-twitter',
			'color' => '#00aced',
			'title' => __('Follow us on Twitter', 'mixt'),
		),
		// Google+
		'google+'  => array(
			'name'  => 'Google+',
			'url'   => 'https://plus.google.com/',
			'icon'  => 'icon-googleplus',
			'color' => '#dd4b39',
			'title' => __('Follow us on Google+', 'mixt'),
		),
		// YouTube
		'youtube'  => array(
			'name'  => 'YouTube',
			'url'   => 'https://www.youtube.com/',
			'icon'  => 'icon-youtube',
			'color' => '#bb0000',
			'title' => __('Subscribe to us on Youtube', 'mixt'),
		),
		// LinkedIn
		'linkedin'  => array(
			'name'  => 'LinkedIn',
			'url'   => 'https://www.linkedin.com/',
			'icon'  => 'icon-linkedin',
			'color' => '#007bb6',
			'title' => __('Connect on LinkedIn', 'mixt'),
		),
		// Instagram
		'instagram'  => array(
			'name'  => 'Instagram',
			'url'   => 'https://instagram.com/',
			'icon'  => 'icon-instagram',
			'color' => '#517fa4',
			'title' => __('Follow us on Instagram', 'mixt'),
		),
		// Pinterest
		'pinterest'  => array(
			'name'  => 'Pinterest',
			'url'   => 'https://www.pinterest.com/',
			'icon'  => 'icon-pinterest',
			'color' => '#cb2027',
			'title' => __('Follow us on Pinterest', 'mixt'),
		),
		// Tumblr
		'tumblr'  => array(
			'name'  => 'Tumblr',
			'url'   => 'https://www.tumblr.com/',
			'icon'  => 'icon-tumblr',
			'color' => '#32506d',
			'title' => __('Follow us on Tumblr', 'mixt'),
		),
	);

	return $profiles;
}