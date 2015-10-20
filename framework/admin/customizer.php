<?php
/**
 * Theme Customizer Integration
 *
 * @package MIXT
 */


/**
 * Add Theme Customizer support for MIXT elements
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function mixt_customize_register($wp_customize) {

	// LOGO
	
	$wp_customize->get_setting('blogname')->transport = 'postMessage';
	$wp_customize->get_setting('blogdescription')->transport = 'postMessage';
	
	$wp_customize->get_setting('mixt_opt[logo-type]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[logo-img]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[logo-img-inv]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[logo-img-hr]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[logo-text]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[logo-text-color]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[logo-text-inv]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[logo-shrink]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[logo-show-tagline]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[logo-tagline]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[logo-tagline-color]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[logo-tagline-inv]')->transport = 'postMessage';
	
	// GLOBAL OPTIONS
	
	$wp_customize->get_setting('mixt_opt[site-bg-color]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[site-bg-pat]')->transport = 'postMessage';

	$wp_customize->get_setting('mixt_opt[page-loader]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[page-loader-type]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[page-loader-shape]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[page-loader-color]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[page-loader-img]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[page-loader-bg]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[page-loader-anim]')->transport = 'postMessage';

	// HEADER

	$wp_customize->get_setting('mixt_opt[head-bg-color]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[head-text-color]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[head-inv-text-color]')->transport = 'postMessage';

	$wp_customize->get_setting('mixt_opt[loc-bar-bg-color]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[loc-bar-bg-pat]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[loc-bar-text-color]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[loc-bar-border-color]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[breadcrumbs-prefix]')->transport = 'postMessage';

	// THEMES
	
	$wp_customize->get_setting('mixt_opt[site-theme]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[nav-theme]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[sec-nav-theme]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[footer-theme]')->transport = 'postMessage';

	if ( get_option('mixt-themes-enabled', true) ) {
		$wp_customize->get_setting('mixt_opt[site-themes]')->transport = 'postMessage';
		$wp_customize->get_setting('mixt_opt[nav-themes]')->transport = 'postMessage';
	}

	// NAVBARS
	
	$wp_customize->get_setting('mixt_opt[nav-vertical-position]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[logo-align]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[nav-texture]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[nav-padding]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[nav-fixed-padding]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[nav-opacity]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[nav-transparent]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[nav-top-opacity]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[nav-hover-bg]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[nav-active-bar]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[nav-active-bar-pos]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[nav-bordered]')->transport = 'postMessage';

	$wp_customize->get_setting('mixt_opt[sec-nav-texture]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[sec-nav-hover-bg]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[sec-nav-active-bar]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[sec-nav-active-bar-pos]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[sec-nav-bordered]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[sec-nav-left-code]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[sec-nav-left-hide]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[sec-nav-right-code]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[sec-nav-right-hide]')->transport = 'postMessage';

	// FOOTER
	
	$wp_customize->get_setting('mixt_opt[footer-widgets-bg-color]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[footer-widgets-bg-pat]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[footer-widgets-text-color]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[footer-widgets-border-color]')->transport = 'postMessage';

	$wp_customize->get_setting('mixt_opt[footer-copy-bg-color]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[footer-copy-bg-pat]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[footer-copy-text-color]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[footer-copy-border-color]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[footer-left-code]')->transport = 'postMessage';
	$wp_customize->get_setting('mixt_opt[footer-right-code]')->transport = 'postMessage';
}
add_action('customize_register', 'mixt_customize_register', 999);


/**
 * Enqueue customizer JS handler script
 */
function mixt_customize_js() {
	wp_enqueue_script('mixt-tinycolor', MIXT_URI . '/dist/plugins/tinycolor.min.js', array('customize-preview'), MIXT_VERSION, true);
	wp_enqueue_script('mixt-customizer', MIXT_FRAME_URI . '/admin/js/customizer.js', array('customize-preview', 'mixt-tinycolor'), MIXT_VERSION, true);

	// Localize Options
	wp_localize_script('mixt-customizer', 'mixt_customize', mixt_customize_options());
}
add_action('customize_preview_init', 'mixt_customize_js');

function mixt_customize_options() {
	global $mixt_opt;

	$nav_options = mixt_get_options( array(
		'opacity' => array( 'key' => 'nav-opacity', 'type' => 'str', 'return' => 'value', 'default' => '0.95' ),
		'second-nav' => array(),
	) );
	
	return array(
		'logo' => array(
			'text-typo' => $mixt_opt['logo-text-typo'],
			'tagline-typo' => $mixt_opt['logo-tagline-typo'],
		),
		'nav' => $nav_options,
		'themes' => mixt_get_themes('default'),
		'breakpoints' => Mixt_DCSS::$media_bps,
		'mixt-uri' => MIXT_URI,
	);
}
