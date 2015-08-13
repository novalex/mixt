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
 * @param string $type output network profiles or sharing buttons
 * @param array $args additional arguments (hover type, container class, profiles array)
 */
function mixt_social_profiles( $echo = true, $args = array() ) {
	extract( wp_parse_args($args, array(
		'hover'    => '',
		'class'    => '',
		'color'    => 'default',
		'size'     => '',
		'type'     => 'networks',
		'style'    => 'plain',
		'profiles' => array(),
	)) );

	// Social Sharing Profiles
	if ( $type == 'sharing' ) {
		$post_id      = get_the_ID();
		$pattern_tags = array(
			'site'   => rawurlencode( get_bloginfo('name') ),
			'title'  => rawurlencode( get_the_title($post_id) ),
			'link'   => get_permalink($post_id),
			'thumb'  => '',
		);
		if ( ! empty($mixt_opt['post-sharing-short']) && $mixt_opt['post-sharing-short'] ) {
			$pattern_tags['link2'] = make_bitly_url(get_permalink($post_id));
		} else {
			$pattern_tags['link2'] = wp_get_shortlink($post_id);
		}
		$post_media = wp_get_attachment_image_src($post_id, 'blog-small');
		if ( ! empty($post_media[0]) ) {
			$pattern_tags['thumb'] = $post_media[0];
		} else if ( get_post_format($post_id) == 'image' ) {
			$pattern_tags['thumb'] = mixt_get_post_image(null, 'url');
		}
	}

	if ( empty($hover) || empty($profiles) ) global $mixt_opt;

	if ( empty($hover) ) {
		if ( $type == 'networks' ) { $hover  = isset($mixt_opt['social-profiles-color']) ? $mixt_opt['social-profiles-color'] : 'icon'; }
		else if ( $type == 'sharing' ) { $hover  = isset($mixt_opt['post-sharing-color']) ? $mixt_opt['post-sharing-color'] : 'icon'; }
	}

	if ( empty($profiles) ) {
		if ( $type == 'networks' && ! empty($mixt_opt['social-profiles']) ) { $profiles = $mixt_opt['social-profiles']; }
		else if ( $type == 'sharing' && ! empty($mixt_opt['post-sharing-profiles']) ) { $profiles = $mixt_opt['post-sharing-profiles']; }
	}

	$cont_classes = "social-links hover-$hover $class";

	if ( $style == 'plain' ) { $cont_classes .= ' plain'; }
	else if ( $style == 'nav' ) { $cont_classes .= ' nav link-list'; }
	else if ( $style == 'group' ) { $cont_classes .= ' btn-group'; }
	else if ( $style == 'buttons' ) { $cont_classes .= ' buttons'; }

	if ( is_array($profiles) && ! empty($profiles) ) {
		$items = $item_class = '';

		$link_atts = 'data-toggle="tooltip" role="button"';
		if ( $style == 'buttons' || $style == 'group' ) {
			$size = ( empty($size) ) ? '' : $size;
			$link_atts .= " class='btn btn-$color $size'";

			if ( $style == 'group' ) { $item_class .= 'btn-group'; }
		} else {
			$item_class .= ' no-color';
		}

		foreach ( $profiles as $profile ) {

			if ( ! empty($profile['url']) && ! empty($profile['icon']) ) {
				$link_atts_now = $link_atts;
				$profile_name  = $profile['name'];
				$profile_url   = str_replace(' ', '%20', $profile['url']);

				if ( $type == 'sharing' ) {
					foreach ( $pattern_tags as $tag => $value ) {
						$profile_url = str_replace('{'.$tag.'}', $value, $profile_url);
					}
				}

				if ( ! filter_var( $profile_url, FILTER_VALIDATE_URL ) ) {
					if ( $profile['url'] == 'rss' ) { $profile_url = get_bloginfo('rss2_url'); }
				}

				$profile_icon = $profile['icon'];

				if ( isset($profile['color']) ) { $link_atts_now .= "data-color='{$profile['color']}'"; }
				
				$profile_title = isset($profile['title']) ? $profile['title'] : '';

				$item = "<a href='$profile_url' title='$profile_title' target='_blank' $link_atts_now><i class='$profile_icon'></i></a>";

				$items .= "<li class='$item_class'>$item</li>";
			}
		}

		$before = "<ul class='$cont_classes'>";
		$after  = '</ul>';

		$return_val = $before . $items . $after;

		if ( empty($items) ) return '';

		if ( $echo ) { echo $return_val; }
		else { return $return_val; }
	} else {
		return null;
	}
}


/**
 * Bit.ly URL shortening
 */
function make_bitly_url($url, $format = 'json', $version = '2.0.1') {
	global $mixt_opt;
	if ( empty($mixt_opt['short-url-login']) && is_array($mixt_opt['short-url-login']) ) { return; }

	$login  = $mixt_opt['short-url-login']['username'];
	$appkey = $mixt_opt['short-url-login']['password'];
	$bitly  = 'http://api.bit.ly/shorten?version='.$version.'&longUrl='.urlencode($url).'&login='.$login.'&apiKey='.$appkey.'&format='.$format;
	$response = file_get_contents($bitly);
	if ( $format == 'json' ) {
		$json = @json_decode($response, true);
		return $json['results'][$url]['shortUrl'];
	} else {
		$xml = simplexml_load_string($response);
		return 'http://bit.ly/'.$xml->results->nodeKeyVal->hash;
	}
}


/**
 * Return array of preset social profiles
 *
 * @param string $type profile group to return (networks or sharing)
 */
function mixt_preset_social_profiles( $type = 'networks' ) {
	$profiles = array(

		// SOCIAL NETWORK PROFILES
		'networks' => array(
			// Facebook
			'facebook'  => array(
				'name'  => 'Facebook',
				'url'   => 'https://www.facebook.com/',
				'icon'  => 'fa fa-facebook',
				'color' => '#3b5998',
				'title' => __('Like us on Facebook', 'mixt'),
			),
			// Twitter
			'twitter'  => array(
				'name'  => 'Twitter',
				'url'   => 'https://twitter.com/',
				'icon'  => 'fa fa-twitter',
				'color' => '#00aced',
				'title' => __('Follow us on Twitter', 'mixt'),
			),
			// Google+
			'google+'  => array(
				'name'  => 'Google+',
				'url'   => 'https://plus.google.com/',
				'icon'  => 'fa fa-google-plus',
				'color' => '#dd4b39',
				'title' => __('Follow us on Google+', 'mixt'),
			),
			// YouTube
			'youtube'  => array(
				'name'  => 'YouTube',
				'url'   => 'https://www.youtube.com/',
				'icon'  => 'fa fa-youtube-play',
				'color' => '#bb0000',
				'title' => __('Subscribe to us on Youtube', 'mixt'),
			),
			// LinkedIn
			'linkedin'  => array(
				'name'  => 'LinkedIn',
				'url'   => 'https://www.linkedin.com/',
				'icon'  => 'fa fa-linkedin',
				'color' => '#007bb6',
				'title' => __('Connect on LinkedIn', 'mixt'),
			),
			// Instagram
			'instagram'  => array(
				'name'  => 'Instagram',
				'url'   => 'https://instagram.com/',
				'icon'  => 'fa fa-instagram',
				'color' => '#517fa4',
				'title' => __('Follow us on Instagram', 'mixt'),
			),
			// Pinterest
			'pinterest'  => array(
				'name'  => 'Pinterest',
				'url'   => 'https://www.pinterest.com/',
				'icon'  => 'fa fa-pinterest-p',
				'color' => '#cb2027',
				'title' => __('Follow us on Pinterest', 'mixt'),
			),
			// Tumblr
			'tumblr'  => array(
				'name'  => 'Tumblr',
				'url'   => 'https://www.tumblr.com/',
				'icon'  => 'fa fa-tumblr',
				'color' => '#32506d',
				'title' => __('Follow us on Tumblr', 'mixt'),
			),
		),

		// SOCIAL SHARING PROFILES
		'sharing' => array(
			// Facebook
			'facebook'  => array(
				'name'  => 'Facebook',
				'url'   => 'http://www.facebook.com/sharer.php?u={link}&amp;t={title}',
				'icon'  => 'fa fa-facebook',
				'color' => '#3b5998',
				'title' => __('Share on Facebook', 'mixt'),
			),
			// Twitter
			'twitter'  => array(
				'name'  => 'Twitter',
				'url'   => 'http://twitter.com/home/?status={title} - {link2}',
				'icon'  => 'fa fa-twitter',
				'color' => '#00aced',
				'title' => __('Share on Twitter', 'mixt'),
			),
			// Google+
			'google+'  => array(
				'name'  => 'Google+',
				'url'   => 'https://plus.google.com/share?url={link}',
				'icon'  => 'fa fa-google-plus',
				'color' => '#dd4b39',
				'title' => __('Share on Google+', 'mixt'),
			),
			// Reddit
			'reddit' => array(
				'name'  => 'Reddit',
				'url'   => 'http://www.reddit.com/submit?url={link}&amp;title={title}',
				'icon'  => 'fa fa-reddit',
				'color' => '#ff5700',
				'title' => __('Share on reddit', 'mixt'),
			),
			// LinkedIn
			'linkedin'  => array(
				'name'  => 'LinkedIn',
				'url'   => 'http://www.linkedin.com/shareArticle?mini=true&amp;title={title}&amp;url={link}',
				'icon'  => 'fa fa-linkedin',
				'color' => '#007bb6',
				'title' => __('Share on LinkedIn', 'mixt'),
			),
			// Pinterest
			'pinterest'  => array(
				'name'  => 'Pinterest',
				'url'   => 'http://pinterest.com/pin/create/button/?url={link}&media={thumb}',
				'icon'  => 'fa fa-pinterest-p',
				'color' => '#cb2027',
				'title' => __('Share on Pinterest', 'mixt'),
			),
			// Tumblr
			'tumblr' => array(
				'name'  => 'Tumblr',
				'url'   => 'https://www.tumblr.com/widgets/share/tool?posttype=link&content={link}&title={title}&caption={title}',
				'icon'  => 'fa fa-tumblr',
				'color' => '#35465c',
				'title' => __('Share on Tumblr', 'mixt'),
			),
			// StumbleUpon
			'stumbleupon' => array(
				'name'  => 'StumbleUpon',
				'url'   => 'http://www.stumbleupon.com/submit?url={link}&amp;title={title}',
				'icon'  => 'fa fa-stumbleupon',
				'color' => '#eb4823',
				'title' => __('Share on StumbleUpon', 'mixt'),
			),
			// Email
			'email' => array(
				'name'  => 'Email',
				'url'   => 'mailto:person@example.com?subject={site} - {title}&body={link}',
				'icon'  => 'fa fa-envelope',
				'color' => '#555555',
				'title' => __('Share via email', 'mixt'),
			),
		),
	);
	return $profiles[$type];
}