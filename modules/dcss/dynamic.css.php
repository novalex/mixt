<?php

/**
 * Dynamic CSS Generator
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access

/**
 * Output CSS in the header
 */
function mixt_print_head_css() {
	global $mixt_opt;
	if ( ! is_array($mixt_opt) ) { return; }

	$theme_ob = new Mixt_Themes;

	// DEFAULT VALUES

	$defaults = array(
		'nav-height'        => 50,
		'nav-padding'       => 20,
		'nav-fixed-padding' => 0,
		'font-family'       => 'Roboto',
	);


	// START CSS OUTPUT

	echo "\n<style type='text/css' data-id='mixt-head-css'>\n";

	$bp_min_mars_properties = '';


	// PAGE LOADER STYLING

	$page_loader_bg    = $mixt_opt['page-loader-bg'];
	$page_loader_color = $mixt_opt['page-loader-color'];

	if ( ! empty($page_loader_bg) ) {
		echo "#load-overlay { background-color: $page_loader_bg; }\n";
	}

	if ( ! empty($page_loader_color) ) {
		echo "#load-overlay .ring, #load-overlay .square2 { border-color: $page_loader_color; }\n";
		echo "#load-overlay .circle, #load-overlay .square { background-color: $page_loader_color; }\n";
	}


	// SITE-WIDE STYLING
	
	$body_styles = '';

	// Background color and image for boxed layout
	if ( Mixt_Options::get('page', 'layout') == 'boxed' ) {
		$site_options = mixt_get_options( array(
			'site-bg'     => array( 'return' => 'value' ),
			'site-bg-pat' => array( 'type' => 'str', 'return' => 'value', 'default' => '' ),
		) );
		if ( ! empty($site_options['site-bg']['background-color']) ) {
			$body_styles .= "background-color: {$site_options['site-bg']['background-color']} !important;";
		}
		if ( ! empty($site_options['site-bg']['background-image']) ) {
			$body_styles .= "background-image: url('{$site_options['site-bg']['background-image']}');";
			$body_styles .= "background-attachment: {$site_options['site-bg']['background-attachment']};";
			$body_styles .= "background-size: {$site_options['site-bg']['background-size']};";
			$body_styles .= "background-position: {$site_options['site-bg']['background-position']};";
			$body_styles .= "background-repeat: {$site_options['site-bg']['background-repeat']};";
		} else if ( ! empty($site_options['site-bg-pat']) ) {
			$body_styles .= "background-image: url('{$site_options['site-bg-pat']}');";
		}
	}

	$site_font = $mixt_opt['font-sitewide'];
	$font_family = $site_font['font-family'];
	if ( $font_family != $defaults['font-family'] && ! empty($font_family) ) {
		if ( ! empty($site_font['font-backup']) ) {
			$font_family .= ', ' . $site_font['font-backup'];
		}
		$body_styles .= "font-family: $font_family;";
	}

	if ( $body_styles != '' ) { echo "body { $body_styles }\n"; }

	// Site Theme
	$theme_ob->output_site();


	// LOGO STYLING

	if ( ! isset($mixt_opt['logo-type']) || $mixt_opt['logo-type'] == 'text' ) {
	// Text Logo

		echo "#nav-logo strong {";
			$logo_font_family = $mixt_opt['logo-text-typo']['font-family'];
			if ( ! empty($mixt_opt['logo-text-typo']['font-backup']) ) {
				$logo_font_family .= ', ' . $typo_opts['font-backup'];
			}
			echo "font-family: $logo_font_family !important;";
			if ( ! empty($mixt_opt['logo-text-typo']['color']) ) { echo "color: {$mixt_opt['logo-text-typo']['color']};"; }
			if ( ! empty($mixt_opt['logo-text-typo']['font-size']) ) { echo "font-size: {$mixt_opt['logo-text-typo']['font-size']};"; }
			if ( ! empty($mixt_opt['logo-text-typo']['font-weight']) ) { echo "font-weight: {$mixt_opt['logo-text-typo']['font-weight']};"; }
			if ( ! empty($mixt_opt['logo-text-typo']['text-transform']) ) { echo "text-transform: {$mixt_opt['logo-text-typo']['text-transform']};"; }
		echo "}\n";

		// Dark Bg Logo Color
		if ( ! empty($mixt_opt['logo-text-inv']) ) { echo "#nav-logo .logo-dark { color: {$mixt_opt['logo-text-inv']}; }\n"; }

		// Logo Shrink
		if ( $mixt_opt['logo-shrink'] != '0' ) {
			$shrink_amount = $mixt_opt['logo-shrink'];
			$shrink_size   = intval($font_size) - $shrink_amount . 'px';

			echo ".fixed-nav #nav-logo strong { font-size: $shrink_size; }\n";
		}

	} else {
	// Image Logo

		$logo_img    = $mixt_opt['logo-img'];
		$logo_width  = $logo_img['width'];
		$logo_height = $logo_img['height'];

		$logo_hires  = $mixt_opt['logo-img-hr'];

		if ( $logo_hires ) {
			$logo_width  = $logo_width / 2;
			$logo_height = $logo_height / 2;
		}

		// Logo Wide or Tall
		if ( $logo_width > $logo_height ) {
			$logo_size_type = 'wide';
			$logo_width_val = $logo_width . 'px';
			$logo_height_val = 'auto';
		} else {
			$logo_size_type = 'tall';
			$logo_width_val = 'auto';
			$logo_height_val = $logo_height . 'px';
		}

		echo "#nav-logo img { width: $logo_width_val; height: $logo_height_val; }\n";

		// Logo Shrink
		if ( $mixt_opt['logo-shrink'] != '0' ) {
			$shrink_amount = $mixt_opt['logo-shrink'];

			if ( $logo_size_type == 'wide' ) {
				$shrink_width  = $logo_width - $shrink_amount . 'px';
				$shrink_height = 'auto';
			} else {
				$shrink_width  = 'auto';
				$shrink_height = $logo_height - $shrink_amount . 'px';
			}
			echo ".fixed-nav #nav-logo img { width: $shrink_width; height: $shrink_height; }\n";
		}
	}

	// Logo Tagline
	echo "#nav-logo small {";
		if ( ! empty($mixt_opt['logo-tagline-typo']['font-family']) ) {
			$tagline_font_family = $mixt_opt['logo-tagline-typo']['font-family'];
			if ( ! empty($mixt_opt['logo-tagline-typo']['font-backup']) ) {
				$tagline_font_family .= ', ' . $typo_opts['font-backup'];
			}
			echo "font-family: $tagline_font_family !important;";
		}
		if ( ! empty($mixt_opt['logo-tagline-typo']['color']) ) { echo "color: {$mixt_opt['logo-tagline-typo']['color']};"; }
		if ( ! empty($mixt_opt['logo-tagline-typo']['font-size']) ) { echo "font-size: {$mixt_opt['logo-tagline-typo']['font-size']};"; }
		if ( ! empty($mixt_opt['logo-tagline-typo']['font-weight']) ) { echo "font-weight: {$mixt_opt['logo-tagline-typo']['font-weight']};"; }
		if ( ! empty($mixt_opt['logo-tagline-typo']['text-transform']) ) { echo "text-transform: {$mixt_opt['logo-tagline-typo']['text-transform']};"; }
	echo "}\n";


	// NAVBAR STYLING

	$navbar_properties = '';

	// Navbar Texture
	if ( ! empty($mixt_opt['nav-texture']) ) {
		$img_url = $mixt_opt['nav-texture'];
		$navbar_properties .= "background-image: url('$img_url');";
	}
	if ( ! empty($mixt_opt['sec-nav-texture']) ) {
		$img_url = $mixt_opt['sec-nav-texture'];
		echo ".second-nav { background-image: url('$img_url'); }\n";
	}

	// Navbar Padding
	if ( isset($mixt_opt['nav-padding']) ) {
		$nav_pad = $mixt_opt['nav-padding'];
		if ( $nav_pad != $defaults['nav-padding'] ) {
			$nav_pad_px = $nav_pad . 'px';
			$nav_wrap_height = $defaults['nav-height'] + ($nav_pad * 2) . 'px';

			$bp_min_mars_properties .= "#main-nav-wrap { min-height: $nav_wrap_height; }";
			$navbar_properties .= "padding-top: $nav_pad_px; padding-bottom: $nav_pad_px;";
		}
	}
	if ( isset($mixt_opt['nav-fixed-padding']) ) {
		$nav_pad = $mixt_opt['nav-fixed-padding'];
		if ( $nav_pad != $defaults['nav-fixed-padding'] ) {
			$nav_pad_px = $nav_pad . 'px';
			$nav_wrap_height = $defaults['nav-height'] + ($nav_pad * 2) . 'px';

			echo ".fixed-nav #main-nav-wrap { min-height: $nav_wrap_height; }\n";
			echo ".fixed-nav .navbar-mixt { padding-top: $nav_pad_px; padding-bottom: $nav_pad_px; }\n";

			if ( $nav_pad > 0 ) {
				$bp_min_mars_properties .= ".fixed-nav .navbar-mixt .nav > li > a { height: $nav_wrap_height; margin-top: -$nav_pad_px; margin-bottom: -$nav_pad_px; line-height: $nav_wrap_height; }";
			}
		}
	}

	// Navbar Typography
	$nav_font = $mixt_opt['font-nav'];
	$font_family = $nav_font['font-family'];
	if ( $font_family != $defaults['font-family'] && ! empty($font_family) ) {
		if ( ! empty($nav_font['font-backup']) ) { $font_family .= ', ' . $nav_font['font-backup']; }
		$navbar_properties .= "font-family: $font_family;";
	}
	if ( ! empty($nav_font['font-size']) ) { $navbar_properties .= "font-size: {$nav_font['font-size']};"; }
	if ( ! empty($nav_font['font-weight']) ) { $navbar_properties .= "font-weight: {$nav_font['font-weight']};"; }
	if ( ! empty($nav_font['text-transform']) ) { $navbar_properties .= "text-transform: {$nav_font['text-transform']};"; }

	if ( $navbar_properties != '' ) echo ".navbar-mixt { $navbar_properties }\n";

	// Navbar Themes
	$theme_ob->output_navbar();


	// HEAD MEDIA STYLING

	$hm_options = mixt_get_options( array(
		'bg' => array(
			'return' => 'value',
			'key'    => 'head-bg-color',
		),
		'text' => array(
			'return'  => 'value',
			'key'     => 'head-text-color',
		),
		'inv-text' => array(
			'return'  => 'value',
			'key'     => 'head-inv-text-color',
		),
	) );

	$hm_el = '.head-media';
	if ( ! empty($hm_options['bg']) ) {
		$hm_bg = $hm_options['bg'];
		echo "$hm_el { background-color: $hm_bg; }\n";
	}
	if ( ! empty($hm_options['text']) ) {
		$hm_text = $hm_options['text'];
		echo "$hm_el .container," .
			 "$hm_el #breadcrumbs li + li:before { color: $hm_text; }\n";
	}
	if ( ! empty($hm_options['inv-text']) ) {
		$hm_inv_text = $hm_options['inv-text'];
		echo "$hm_el.bg-dark .container," .
			 "$hm_el.bg-dark .media-inner a," .
			 "$hm_el.bg-dark #breadcrumbs li + li:before { color: $hm_inv_text; }\n";
	}


	// LOCATION BAR STYLING

	$loc_bar_options = mixt_get_options( array(
		'loc-bar-text-color'   => array( 'return' => 'value' ),
		'loc-bar-border-color' => array( 'return' => 'value' ),
		'loc-bar-bg-color'     => array( 'return' => 'value' ),
		'loc-bar-bg-pat'       => array( 'type' => 'str', 'return' => 'value' ),
	) );

	$loc_bar_styles = '';
	if ( ! empty($loc_bar_options['loc-bar-border-color']) ) { $loc_bar_styles .= "border-color: {$loc_bar_options['loc-bar-border-color']};"; }
	if ( ! empty($loc_bar_options['loc-bar-bg-color']) ) { $loc_bar_styles .= "background-color: {$loc_bar_options['loc-bar-bg-color']};"; }
	if ( ! empty($loc_bar_options['loc-bar-bg-pat']) ) { $loc_bar_styles .= "background-image: url({$loc_bar_options['loc-bar-bg-pat']});"; }

	if ( $loc_bar_styles != '' ) echo "#location-bar { $loc_bar_styles }\n";
	if ( ! empty($loc_bar_options['loc-bar-text-color']) ) { echo "#location-bar, #location-bar a:hover, #location-bar li:before { color: {$loc_bar_options['loc-bar-text-color']}; }\n"; }


	// FOOTER STYLING

	$footer_options = mixt_get_options( array(
		// Widgets Section
		'footer-widgets-text-color'   => array( 'return' => 'value' ),
		'footer-widgets-border-color' => array( 'return' => 'value' ),
		'footer-widgets-bg-color'     => array( 'return' => 'value' ),
		'footer-widgets-bg-pat'       => array( 'type' => 'str', 'return' => 'value' ),
		// Copyright Section
		'footer-copy-text-color'   => array( 'return' => 'value' ),
		'footer-copy-border-color' => array( 'return' => 'value' ),
		'footer-copy-bg-color'     => array( 'return' => 'value' ),
		'footer-copy-bg-pat'       => array( 'type' => 'str', 'return' => 'value' ),
	) );

	$footer_widgets_styles = '';
	if ( ! empty($footer_options['footer-widgets-text-color']) ) { $footer_widgets_styles .= "color: {$footer_options['footer-widgets-text-color']};"; }
	if ( ! empty($footer_options['footer-widgets-border-color']) ) { $footer_widgets_styles .= "border-color: {$footer_options['footer-widgets-border-color']};"; }
	if ( ! empty($footer_options['footer-widgets-bg-color']) ) { $footer_widgets_styles .= "background-color: {$footer_options['footer-widgets-bg-color']};"; }
	if ( ! empty($footer_options['footer-widgets-bg-pat']) ) { $footer_widgets_styles .= "background-image: url({$footer_options['footer-widgets-bg-pat']});"; }
	if ( $footer_widgets_styles != '' ) echo "#colophon .widget-row { $footer_widgets_styles }\n";

	$footer_copy_styles = '';
	if ( ! empty($footer_options['footer-copy-text-color']) ) { $footer_copy_styles .= "color: {$footer_options['footer-copy-text-color']};"; }
	if ( ! empty($footer_options['footer-copy-border-color']) ) { $footer_copy_styles .= "border-color: {$footer_options['footer-copy-border-color']};"; }
	if ( ! empty($footer_options['footer-copy-bg-color']) ) { $footer_copy_styles .= "background-color: {$footer_options['footer-copy-bg-color']};"; }
	if ( ! empty($footer_options['footer-copy-bg-pat']) ) { $footer_copy_styles .= "background-image: url({$footer_options['footer-copy-bg-pat']});"; }
	if ( $footer_copy_styles != '' ) echo "#colophon .copyright-row { $footer_copy_styles }\n";


	// MEDIA QUERIES
	
	if ( $bp_min_mars_properties != '' ) { echo "@media ( min-width: {$theme_ob->media_bp('mars', 'min')} ) { $bp_min_mars_properties }\n"; }

	echo "</style>";
}


/**
 * Output CSS code in the body
 * 
 * Used to output CSS from the element Styler
 */
function mixt_print_body_css() {
	if ( Mixt_DCSS::$css == '' ) return;
	echo "<style type='text/css' data-id='mixt-body-css' scoped>\n";
		Mixt_DCSS::output_css();
	echo "\n</style>";
}