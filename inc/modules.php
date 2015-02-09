<?php

/* ------------------------------------------------ /
MIXT - MODULES
/ ------------------------------------------------ */

/**
 * Get Social Profiles & Output Links or Return Data
 *
 * @param bool $echo - if true echo links, else return them as string
 */

function mixt_social_profiles($echo = true) {

	global $mixt_opt;

	if ( isset($mixt_opt['social-profiles']) ) {
		$output = '';

		$before = '<ul class="nav link-list social-links">';
		$after  = '</ul>';

		foreach ( $mixt_opt['social-profiles'] as $profile ) {

			if ( isset($profile['name']) && isset($profile['url']) && isset($profile['icon']) ) {

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
					$profile_color = $profile['color'];
					$color_prop = 'style="color:' . $profile_color . '"';
				} else {
					$profile_color = '';
					$color_prop = '';
				}
				
				$profile_title = isset($profile['title']) ? $profile['title'] : '';

				$output .= '<li><a href="' . $profile_url . '" title="' . $profile_title . '" ' . $color_prop . '><i class="' . $profile_icon . '"></i></a></li>';
			}

		}

		$return_val = $before . $output . $after;

		if ( $echo ) {
			echo $return_val;
		} else {
			return $return_val;
		}
	}
};