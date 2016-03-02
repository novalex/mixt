<?php

/**
 * Dynamic CSS Generator
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access

// Load dynamic CSS class
require_once( MIXT_MODULES_DIR . '/dcss/class-dcss.php' );


/**
 * Generate custom CSS based on options
 * 
 * @return string
 */
function mixt_custom_css() {
	global $mixt_opt;
	if ( ! is_array($mixt_opt) ) { return; }

	$defaults = apply_filters( 'mixt_dcss_defaults', array(
		'nav-padding'                => 20,
		'nav-fixed-padding'          => 0,
		'nav-item-height'            => 50,
		'nav-line-height-correction' => -2,
	) );


	$dimension_field = function($field) {
		global $mixt_opt;
		if ( empty($mixt_opt[$field]) ) return false;

		if ( is_array($mixt_opt[$field]) && intval($mixt_opt[$field]['width']) != 0 ) {
			return $mixt_opt[$field];
		} else {
			return false;
		}
	};


	// START CSS RULES

	ob_start();


	// PAGE LOADER STYLING

	if ( $mixt_opt['page-loader'] ) {
		$page_loader_bg    = $mixt_opt['page-loader-bg'];
		$page_loader_color = $mixt_opt['page-loader-color'];

		if ( ! empty($page_loader_bg) ) {
			echo "#load-overlay { background-color: $page_loader_bg; }\n";
		}
		if ( ! empty($page_loader_color) ) {
			echo "#load-overlay .ring, #load-overlay .square2 { border-color: $page_loader_color; }\n";
			echo "#load-overlay .circle, #load-overlay .square { background-color: $page_loader_color; }\n";
		}
	}


	// SITE-WIDE STYLING
	
	$body_styles = '';

	// Background color and image for boxed layout
	$site_options = mixt_get_options( array(
		'layout'   => array( 'key' => 'site-layout', 'return' => 'value' ),
		'bg'       => array( 'key' => 'site-bg', 'return' => 'value' ),
		'bg-color' => array( 'key' => 'site-bg-color', 'return' => 'value' ),
		'bg-pat'   => array( 'key' => 'site-bg-pat', 'type' => 'str', 'return' => 'value', 'default' => '' ),
	) );
	if ( $site_options['layout'] == 'boxed' ) {
		if ( ! empty($site_options['bg-color']) ) {
			$body_styles .= "background-color: {$site_options['bg-color']}; ";
		}
		if ( ! empty($site_options['bg']['background-image']) ) {
			$body_styles .= "background-image: url({$site_options['bg']['background-image']}); ";
			$body_styles .= "background-attachment: {$site_options['bg']['background-attachment']}; ";
			$body_styles .= "background-size: {$site_options['bg']['background-size']}; ";
			$body_styles .= "background-position: {$site_options['bg']['background-position']}; ";
			$body_styles .= "background-repeat: {$site_options['bg']['background-repeat']}; ";
		} else if ( ! empty($site_options['bg-pat']) ) {
			$body_styles .= "background-image: url({$site_options['bg-pat']}); ";
		}
	}

	// Site width
	$site_width = $dimension_field('site-width');
	if ( $site_width ) {
		$width = $site_width['width'];
		if ( $site_width['units'] == '%' ) {
			$width = min(max(intval($width), 40), 100) . '%';
			echo "\t.container, #main-wrap.nav-vertical .container, .boxed #main-wrap, .boxed #main-nav { width: $width; }\n";
		} else {
			echo "@media only screen and ( min-width: $width ) {\n";
				echo "\t.container, #main-wrap.nav-vertical .container, .boxed #main-wrap, .boxed #main-nav { width: $width; }\n";
			echo "}\n";
		}
		echo ".container, #main-wrap.nav-vertical .container, .boxed #main-wrap, .boxed #main-nav { max-width: 100%; }\n";
	}

	// Sidebar Width
	$sidebar_width_sm = $dimension_field('sidebar-width-sm');
	if ( $sidebar_width_sm ) {
		$width_sm = $sidebar_width_sm['width'];
		if ( $sidebar_width_sm['units'] == '%' ) {
			$width_sm = min(max(intval($width_sm), 10), 100) . '%';
			$content_width = 100 - intval($width_sm) . '%';
		} else {
			$content_width = "calc(100% - $width_sm)";
		}
		echo "@media only screen and ( min-width: " . Mixt_DCSS::media_bp('mars', 'min') . " ) {\n";
			echo "\t#content-wrap.has-sidebar #content { width: $content_width; }\n";
			echo "\t#content-wrap.has-sidebar .sidebar { width: $width_sm; }\n";
		echo "}\n";
	}
	$sidebar_width = $dimension_field('sidebar-width');
	if ( $sidebar_width ) {
		$width = $sidebar_width['width'];
		if ( $sidebar_width['units'] == '%' ) {
			$width = min(max(intval($width), 10), 100) . '%';
			$content_width = 100 - intval($width) . '%';
		} else {
			$content_width = "calc(100% - $width)";
		}
		echo "@media only screen and ( min-width: " . Mixt_DCSS::media_bp('venus', 'min') . " ) {\n";
			echo "\t#content-wrap.has-sidebar #content { width: $content_width; }\n";
			echo "\t#content-wrap.has-sidebar .sidebar { width: $width; }\n";
		echo "}\n";
	}

	if ( $body_styles != '' ) { echo "body { $body_styles }\n"; }

	// Typography
	$site_typo = Mixt_DCSS::parse_typo_field('font-sitewide');
	if ( $site_typo != '' ) { echo "html, body { $site_typo }\n"; }


	// LOGO STYLING

	// Image Logo
	if ( $mixt_opt['logo-type'] == 'img' && ! empty($mixt_opt['logo-img']['url']) ) {
		$logo_img    = $mixt_opt['logo-img'];
		$logo_width  = $logo_img['width'];

		if ( $mixt_opt['logo-img-hr'] ) {
			$logo_width  = $logo_width / 2;
		}

		echo ".navbar-mixt #nav-logo img { max-width: {$logo_width}px; }\n";
		echo "#main-wrap.nav-vertical.nav-full .navbar-mixt #nav-logo img { width: {$logo_width}px; }\n";

		// Logo Shrink
		if ( $mixt_opt['logo-shrink'] != '0' ) {
			$shrink_width  = $logo_width - $mixt_opt['logo-shrink'];
			echo ".fixed-nav .navbar-mixt #nav-logo img { max-width: {$shrink_width}px; }\n";
		}

	// Text Logo
	} else {
		$logo_font = Mixt_DCSS::parse_typo_field('logo-text-typo',
			array( 'color' => mixt_get_option( array( 'key' => 'logo-text-color', 'return' => 'value' ) ) ),
			array('font-family')
		);
		if ( ! empty($logo_font) ) echo "#nav-logo strong { $logo_font }\n";

		// Dark Bg Logo Color
		if ( ! empty($mixt_opt['logo-text-inv']) ) { echo ".bg-dark #nav-logo strong { color: {$mixt_opt['logo-text-inv']}; }\n"; }

		// Logo Shrink
		if ( $mixt_opt['logo-shrink'] != '0' ) {
			$shrink_amount = $mixt_opt['logo-shrink'];
			$font_size = ( empty($mixt_opt['logo-text-typo']['font-size']) ) ? '24px' : $mixt_opt['logo-text-typo']['font-size'];
			$shrink_size   = intval($font_size) - $shrink_amount . 'px';

			echo ".fixed-nav #nav-logo strong { font-size: $shrink_size; }\n";
		}
	}

	// Logo Tagline
	$tagline_font = Mixt_DCSS::parse_typo_field('logo-tagline-typo',
		array( 'color' => mixt_get_option( array( 'key' => 'logo-tagline-color', 'return' => 'value' ) ) ),
		array('font-family')
	);
	if ( ! empty($logo_font) ) echo "#nav-logo small { $tagline_font }\n";

	// Dark Bg Tagline Color
	if ( ! empty($mixt_opt['logo-tagline-inv']) ) { echo ".bg-dark #nav-logo small { color: {$mixt_opt['logo-tagline-inv']}; }\n"; }


	// NAVBAR STYLING

	$navbar_properties = '';

	// Navbar Texture
	if ( ! empty($mixt_opt['nav-texture']) ) {
		$img_url = $mixt_opt['nav-texture'];
		$navbar_properties .= "background-image: url($img_url); ";
	}
	if ( ! empty($mixt_opt['sec-nav-texture']) ) {
		$img_url = $mixt_opt['sec-nav-texture'];
		echo ".second-nav { background-image: url($img_url); }\n";
	}

	// Navbar Padding
	if ( isset($mixt_opt['nav-padding']) ) {
		$nav_pad = $mixt_opt['nav-padding'];
		if ( $nav_pad != $defaults['nav-padding'] ) {
			$nav_height = $defaults['nav-item-height'] + $nav_pad * 2 + 1;
			$nav_center_height = $nav_height + $defaults['nav-item-height'];

			$navbar_properties .= "padding-top: {$nav_pad}px; padding-bottom: {$nav_pad}px; ";

			echo ".nav-full #main-nav-wrap, .nav-full .head-media { min-height: {$nav_height}px; }\n";
			echo ".nav-full #main-nav-wrap.logo-center, .nav-full .head-media.logo-center { min-height: {$nav_center_height}px; }\n";

			echo "#main-wrap.nav-full.nav-transparent .head-media .container { padding-top: {$nav_height}px; }\n";
			echo "#main-wrap.nav-full.nav-transparent .head-media.logo-center .container { padding-top: {$nav_center_height}px; }\n";
			echo "#main-wrap.nav-full.nav-transparent.nav-below .head-media .container { padding-bottom: {$nav_height}px; }\n";
			echo "#main-wrap.nav-full.nav-transparent.nav-below .head-media.logo-center .container { padding-bottom: {$nav_center_height}px; }\n";
			echo "#main-wrap.nav-full.nav-transparent.nav-below .navbar-mixt.position-top { margin-top: -{$nav_height}px; }\n";
			echo "#main-wrap.nav-full.nav-transparent.nav-below .logo-center .navbar-mixt.position-top { margin-top: -{$nav_center_height}px; }\n";
		}
	}
	if ( isset($mixt_opt['nav-fixed-padding']) ) {
		$nav_pad = $mixt_opt['nav-fixed-padding'];
		if ( $nav_pad != $defaults['nav-fixed-padding'] ) {
			$nav_height = $defaults['nav-item-height'] + $nav_pad * 2;
			$half_padding = $nav_pad / 2;
			$nav_center_height = $nav_height + $defaults['nav-item-height'];
			$nav_center_item_height = $nav_height - $nav_pad;
			$nav_line_height_correction = $defaults['nav-line-height-correction'];

			echo ".fixed-nav .nav-full #main-nav-wrap { min-height: {$nav_height}px; }\n";
			echo ".fixed-nav .nav-full .navbar-mixt { padding-top: {$nav_pad}px; padding-bottom: {$nav_pad}px; }\n";

			echo ".fixed-nav .nav-full #main-nav-wrap.logo-center { min-height: {$nav_center_height}px; }\n";

			if ( $nav_pad > 0 ) {
				echo ".fixed-nav .nav-full .navbar-mixt .nav > li { margin-top: -{$nav_pad}px; margin-bottom: -{$nav_pad}px; }\n";
				echo ".fixed-nav .nav-full .navbar-mixt .nav > li, " .
					 ".fixed-nav .nav-full .navbar-mixt .nav > li > a { height: {$nav_height}px; line-height: " . ($nav_height + $nav_line_height_correction) . "px; }\n";

				echo ".fixed-nav .nav-full .logo-center .navbar-mixt .navbar-header { margin-top: -{$half_padding}px; }\n";
				echo ".fixed-nav .nav-full .logo-center .navbar-mixt .nav > li { margin-top: {$half_padding}px; margin-bottom: -{$nav_pad}px; }\n";
				echo ".fixed-nav .nav-full .logo-center .navbar-mixt .nav > li, " .
					 ".fixed-nav .nav-full .logo-center .navbar-mixt .nav > li > a { height: {$nav_center_item_height}px; line-height: " . ($nav_center_item_height + $nav_line_height_correction) . "px; }\n";
			}
		}
	}

	// Vertical Navbar Width
	if ( $mixt_opt['nav-layout'] == 'vertical' ) {
		$navbar_width_sm = $dimension_field('nav-vertical-width-sm');
		if ( $navbar_width_sm ) {
			$width_sm = $navbar_width_sm['width'];
			if ( $navbar_width_sm['units'] == '%' ) {
				$width_sm = min(max(intval($width_sm), 10), 100) . '%';
			}
			echo "#main-wrap.nav-vertical.nav-full #main-nav-wrap { width: $width_sm; }\n";
			echo "#main-wrap.nav-vertical.nav-full.nav-left { padding-left: $width_sm; }\n";
			echo "#main-wrap.nav-vertical.nav-full.nav-right { padding-right: $width_sm; }\n";
		}

		$navbar_width = $dimension_field('nav-vertical-width');
		if ( $navbar_width ) {
			$width = $navbar_width['width'];
			if ( $navbar_width['units'] == '%' ) {
				$width = min(max(intval($width), 10), 100) . '%';
			}
			echo "@media only screen and ( min-width: " . Mixt_DCSS::media_bp('earth', 'min') . " ) {\n";
				echo "\t#main-wrap.nav-vertical.nav-full #main-nav-wrap { width: $width; }\n";
				echo "\t#main-wrap.nav-vertical.nav-full.nav-left { padding-left: $width; }\n";
				echo "\t#main-wrap.nav-vertical.nav-full.nav-right { padding-right: $width; }\n";
			echo "}\n";
		}
	}

	if ( $navbar_properties != '' ) echo ".navbar-mixt { $navbar_properties }\n";

	// Navbar Typography
	$navbar_item_properties = Mixt_DCSS::parse_typo_field('font-nav');

	if ( $navbar_item_properties != '' ) echo ".navbar-mixt .nav > li > a { $navbar_item_properties }\n";

	// Navbar Submenu Typography
	$navbar_sub_item_properties = Mixt_DCSS::parse_typo_field('font-nav-sub');;

	if ( $navbar_sub_item_properties != '' ) echo ".navbar-mixt .sub-menu li > a { $navbar_sub_item_properties }\n";


	// LOCATION BAR STYLING

	if ( $mixt_opt['location-bar'] ) {
		$loc_bar_options = mixt_get_options( array(
			'text-color'   => array( 'key' => 'loc-bar-text-color', 'return' => 'value' ),
			'border-color' => array( 'key' => 'loc-bar-border-color', 'return' => 'value' ),
			'bg-color'     => array( 'key' => 'loc-bar-bg-color', 'return' => 'value' ),
			'bg-pat'       => array( 'key' => 'loc-bar-bg-pat', 'type' => 'str', 'return' => 'value' ),
		) );

		$loc_bar_styles = '';
		if ( ! empty($loc_bar_options['border-color']) ) { $loc_bar_styles .= "border-color: {$loc_bar_options['border-color']}; "; }
		if ( ! empty($loc_bar_options['bg-color']) ) { $loc_bar_styles .= "background-color: {$loc_bar_options['bg-color']}; "; }
		if ( ! empty($loc_bar_options['bg-pat']) ) { $loc_bar_styles .= "background-image: url({$loc_bar_options['bg-pat']}); "; }

		if ( $loc_bar_styles != '' ) echo "#location-bar { $loc_bar_styles }\n";
		if ( ! empty($loc_bar_options['text-color']) ) { echo "#location-bar, #location-bar a:hover, #location-bar li:before { color: {$loc_bar_options['text-color']}; }\n"; }
	}


	// HEADING TYPOGRAPHY

	$heading_typo_main = Mixt_DCSS::parse_typo_field('font-heading-main');
	if ( ! empty($heading_typo_main) ) {
		echo "h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6 { $heading_typo_main }\n";
	}

	$hx = 1;

	while ( $hx <= 6 ) {
		$heading_typo = Mixt_DCSS::parse_typo_field('font-heading-h'.$hx);
		if ( ! empty($heading_typo) ) {
			echo "h{$hx}, .h{$hx} { $heading_typo }\n";
		}
		$hx++;
	}


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
	if ( ! empty($footer_options['footer-widgets-text-color']) ) { $footer_widgets_styles .= "color: {$footer_options['footer-widgets-text-color']}; "; }
	if ( ! empty($footer_options['footer-widgets-border-color']) ) { $footer_widgets_styles .= "border-color: {$footer_options['footer-widgets-border-color']}; "; }
	if ( ! empty($footer_options['footer-widgets-bg-color']) ) { $footer_widgets_styles .= "background-color: {$footer_options['footer-widgets-bg-color']}; "; }
	if ( ! empty($footer_options['footer-widgets-bg-pat']) ) { $footer_widgets_styles .= "background-image: url({$footer_options['footer-widgets-bg-pat']}); "; }
	if ( $footer_widgets_styles != '' ) echo "#colophon .widget-row { $footer_widgets_styles }\n";

	$footer_copy_styles = '';
	if ( ! empty($footer_options['footer-copy-text-color']) ) { $footer_copy_styles .= "color: {$footer_options['footer-copy-text-color']}; "; }
	if ( ! empty($footer_options['footer-copy-border-color']) ) { $footer_copy_styles .= "border-color: {$footer_options['footer-copy-border-color']}; "; }
	if ( ! empty($footer_options['footer-copy-bg-color']) ) { $footer_copy_styles .= "background-color: {$footer_options['footer-copy-bg-color']}; "; }
	if ( ! empty($footer_options['footer-copy-bg-pat']) ) { $footer_copy_styles .= "background-image: url({$footer_options['footer-copy-bg-pat']}); "; }
	if ( $footer_copy_styles != '' ) echo "#colophon .copyright-row { $footer_copy_styles }\n";

	return ob_get_clean();
}


/**
 * Generate theme CSS
 */
function mixt_custom_theme_css() {
	$themes_ob = new Mixt_Themes();

	ob_start();

	// Site Themes
	$themes_ob->output_site();

	// Navbar Themes
	$themes_ob->output_navbar();

	return ob_get_clean();
}
