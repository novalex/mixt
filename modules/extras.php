<?php

/**
 * Custom functions that act independently of the theme templates
 *
 * @package MIXT
 */


/**
 * Add custom classes to the array of body classes.
 */
function mixt_body_classes( $classes ) {
	// Add class to blogs with more than 1 published author
	if ( is_multi_author() ) { $classes[] = 'blog-multi'; }

	// Old WP Version Handling
	$version = empty($wp_version) ? get_bloginfo('version') : $wp_version;
	// Slim Admin Bar in WP < 3.8
	if ( version_compare($version, '3.8', '<') ) { $classes[] = 'admin-bar-slim'; }

	return $classes;
}
add_filter('body_class', 'mixt_body_classes');


/**
 * Customize the "Read More" link
 */
function mixt_read_more_link($permalink) {
	preg_match('/href="([^"]*)"/', $permalink, $matches);
	if ( ! empty($matches[1]) ) {
		return '<a class="btn btn-black btn-hover-accent read-more more-link" href="' . $matches[1] . '">' . __('Read More', 'mixt') . '</a>';
	}
	return $permalink;
}
add_filter('the_content_more_link', 'mixt_read_more_link');


// Set Custom Excerpt Length
function mixt_excerpt_length($length) {
	return get_option('mixt-post-excerpt-length', 55);
}
add_filter( 'excerpt_length', 'mixt_excerpt_length', 999 );


/**
 * Get the wp_nav_menu() fallback, wp_page_menu(), to show a home link.
 */
function mixt_page_menu_args( $args ) {
	$args['show_home'] = true;
	return $args;
}
add_filter('wp_page_menu_args', 'mixt_page_menu_args');


/**
 * Filter in a link to a content ID attribute for the next/previous image links on image attachment pages
 */
function mixt_enhanced_image_navigation( $url, $id ) {
	if ( ! is_attachment() && ! wp_attachment_is_image( $id ) )
		return $url;

	$image = get_post( $id );
	if ( ! empty( $image->post_parent ) && $image->post_parent != $id )
		$url .= '#main';

	return $url;
}
add_filter('attachment_link', 'mixt_enhanced_image_navigation', 10, 2);


// BrowserSync Script
function mixt_browsersync() {
	ob_start();
	?>
	<script type="text/javascript" id="__bs_script__">
		if ( ! (/iPhone|iPod|iPad|Android|BlackBerry/).test(navigator.userAgent) ) {
			//<![CDATA[
			document.write("<script async src='http://HOST:3000/browser-sync/browser-sync-client.js'><\/script>".replace("HOST", location.hostname));
			//]]>
		}
	</script>
	<?php
	echo ob_get_clean();
}
if ( current_user_can('manage_options') ) {
	add_action('wp_footer', 'mixt_browsersync');
	add_action('admin_footer', 'mixt_browsersync');
	// add_action('customize_controls_enqueue_scripts', 'mixt_browsersync');
}
