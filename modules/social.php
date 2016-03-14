<?php

/**
 * Social Profiles
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access

/**
 * Add Open Graph Attributes
 */
function mixt_og_xmlns( $output ) {
	return $output . ' xmlns:og="http://opengraphprotocol.org/schema/" xmlns:fb="http://www.facebook.com/2008/fbml"';
}

/**
 * Add Open Graph Meta Information
 */
function mixt_og_meta() {
	if ( ! is_singular() ) return;

	global $post;

	$options = mixt_get_options( array(
		'fb-appid'  => array( 'key' => 'social-fb-appid', 'return' => 'value' ),
		'fb-admins' => array( 'key' => 'social-fb-admins', 'return' => 'value' ),
		'site-name' => array( 'key' => 'social-site-name', 'return' => 'value' ),
		'img-ph'    => array( 'key' => 'social-img-ph', 'return' => 'value' ),
	));

	if ( ! empty($options['fb-appid']) ) {
		echo "<meta property='fb:app_id' content='" . esc_attr($options['fb-appid']) . "' />\n";
	}
	if ( ! empty($options['fb-admins']) && ! empty($options['fb-admins'][0]) ) {
		foreach ( $options['fb-admins'] as $admin_id ) {
			if ( ! empty($admin_id) ) { echo "<meta property='fb:admins' content='" . esc_attr($admin_id) . "' />\n"; }
		}
	}
	echo "<meta property='og:type' content='article' />\n";
	echo "<meta property='og:title' content='" . esc_attr(get_the_title()) . "' />\n";
	echo "<meta property='og:url' content='" . esc_attr(get_permalink()) . "' />\n";

	$site_name = ( empty($options['site-name']) ) ? get_bloginfo('name', 'display') : $options['site-name'];
	echo "<meta property='og:site_name' content='" . esc_attr($site_name) . "' />\n";

	if ( has_post_thumbnail($post->ID) ) {
		$image = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'large' );
		echo "<meta property='og:image' content='" . esc_attr($image[0]) . "' />\n";
	} else if ( ! empty($options['img-ph']) && ! empty($options['img-ph']['url']) ) {
		$image = $options['img-ph']['url'];
		echo "<meta property='og:image' content='" . esc_attr($image) . "' />\n";
	}

	$description = get_the_excerpt();
	if ( ! empty($description) ) {
		echo "<meta property='og:description' content='" . esc_attr($description) . "' />\n";
	}
}

/**
 * Initialize Social Open Graph Meta
 */
function mixt_social_og() {
	if ( mixt_get_option( array('key' => 'social-og-meta') ) ) {
		add_filter('language_attributes', 'mixt_og_xmlns');
		add_action('wp_head', 'mixt_og_meta', 5);
	}
}
add_action('init', 'mixt_social_og');


/**
 * Get Social Profiles & Output Links or Return Data
 *
 * @param bool   $echo true to echo links, false to return them as a string
 * @param string $type output network profiles or sharing buttons
 * @param array  $args additional arguments (hover type, container class, profiles array)
 */
function mixt_social_profiles( $echo = true, $args = array() ) {
	extract( wp_parse_args($args, array(
		'hover'    => '',
		'class'    => '',
		'color'    => 'minimal',
		'size'     => '',
		'type'     => 'networks',
		'style'    => 'plain',
		'profiles' => array(),
	)) );

	$options = mixt_get_options( array(
		'social-profiles'       => array( 'return' => 'value' ),
		'social-icons-color'    => array( 'return' => 'value', 'default' => 'icon' ),
		'social-icons-tooltip'  => array(),
		'post-sharing-profiles' => array( 'return' => 'value' ),
		'post-sharing-color'    => array( 'return' => 'value', 'default' => 'icon' ),
		'post-sharing-short'    => array(),
	) );

	// Social Sharing Profiles
	if ( $type == 'sharing' ) {
		$post_id      = get_the_ID();
		$pattern_tags = array(
			'site'   => rawurlencode( get_bloginfo('name') ),
			'title'  => rawurlencode( get_the_title($post_id) ),
			'link'   => get_permalink($post_id),
			'thumb'  => '',
		);
		if ( $options['post-sharing-short'] ) {
			$pattern_tags['link2'] = mixt_make_bitly_url(get_permalink($post_id));
		} else {
			$pattern_tags['link2'] = wp_get_shortlink($post_id);
		}
		$post_media = wp_get_attachment_image_src(get_post_thumbnail_id($post_id), 'mixt-large');
		if ( ! empty($post_media[0]) ) {
			$pattern_tags['thumb'] = $post_media[0];
		} else if ( get_post_format($post_id) == 'image' ) {
			$pattern_tags['thumb'] = mixt_get_post_image(null, 'url');
		}
	}

	if ( empty($hover) ) {
		$hover = ( $type == 'networks' ) ? $options['social-icons-color'] : $options['post-sharing-color'];
	}

	if ( empty($profiles) ) {
		$profiles = ( $type == 'networks' ) ? $options['social-profiles'] : $options['post-sharing-profiles'];
	}

	$cont_classes = 'social-links ' . mixt_sanitize_html_classes("hover-$hover $class");
	if ( $style == 'plain' ) { $cont_classes .= ' plain'; }
	else if ( $style == 'nav' ) { $cont_classes .= ' nav'; }
	else if ( $style == 'group' ) { $cont_classes .= ' btn-group'; }
	else if ( $style == 'buttons' ) { $cont_classes .= ' buttons'; }

	if ( is_array($profiles) && ! empty($profiles) ) {
		$items = $item_class = '';

		$link_atts = ' role="button"';
		if ( $options['social-icons-tooltip'] ) {
			$link_atts .= ' data-toggle="tooltip"';
		}
		if ( $style == 'buttons' || $style == 'group' ) {
			$size = ( empty($size) ) ? '' : $size;
			$link_atts .= ' class="btn ' . mixt_sanitize_html_classes("btn-$color $size") . '"';

			if ( $style == 'group' ) { $item_class .= 'btn-group'; }
		} else {
			$link_atts .= ' class="no-color"';
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

				if ( isset($profile['color']) ) { $link_atts_now .= ' data-color="' . esc_attr($profile['color']) . '"'; }
				
				$profile_title = isset($profile['title']) ? $profile['title'] : '';

				$item = '<a href="' . esc_url($profile_url) . '" title="' . esc_attr($profile_title) . '" target="_blank"' . $link_atts_now . '>';
					$item .= '<i class="' . mixt_sanitize_html_classes($profile['icon']) . '"></i>';
				$item .= '</a>';

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
function mixt_make_bitly_url( $url, $format = 'json', $version = '2.0.1' ) {
	global $mixt_opt;

	if ( empty($mixt_opt['short-url-login']) || ! is_array($mixt_opt['short-url-login']) ) { return; }

	$login  = $mixt_opt['short-url-login']['username'];
	$appkey = $mixt_opt['short-url-login']['password'];
	$bitly  = 'http://api.bit.ly/shorten?version='.$version.'&longUrl='.urlencode($url).'&login='.$login.'&apiKey='.$appkey.'&format='.$format;
	$response = wp_remote_get($bitly);
	if ( empty($response['body']) ) return;
	if ( $format == 'json' ) {
		$json = @json_decode($response['body'], true);
		return esc_url($json['results'][$url]['shortUrl']);
	} else {
		$xml = simplexml_load_string($response['body']);
		return 'http://bit.ly/' . esc_url($xml->results->nodeKeyVal->hash);
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

// Add default profiles to options
add_option('mixt-social-profiles', mixt_preset_social_profiles('networks'));
add_option('mixt-sharing-profiles', mixt_preset_social_profiles('sharing'));
