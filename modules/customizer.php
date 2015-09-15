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
function mixt_customize_register( $wp_customize ) {
	$wp_customize->get_setting( 'blogname' )->transport         = 'postMessage';
	$wp_customize->get_setting( 'blogdescription' )->transport  = 'postMessage';
	$wp_customize->get_setting( 'header_textcolor' )->transport = 'postMessage';

	// $wp_customize->get_setting( 'mixt_opt[background-type]' )->transport = 'postMessage';
	// $wp_customize->get_setting( 'mixt_opt[background-color]' )->transport = 'postMessage';
}
add_action( 'customize_register', 'mixt_customize_register' );

/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
function mixt_customize_js() {
	wp_enqueue_script( 'mixt-customizer', MIXT_URI . '/js/customizer.js', array( 'customize-preview' ), '1.0', true );
}
add_action( 'customize_preview_init', 'mixt_customize_js' );
