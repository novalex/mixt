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

	$defaults = array(
		'nav-height'        => 50,
		'nav-padding'       => 20,
		'nav-fixed-padding' => 0,
	);


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
	if ( ! empty($mixt_opt['site-width']) ) {
		if ( substr($mixt_opt['site-width'], -1) == '%' ) {
			echo ".container, .boxed #main-wrap, .boxed #main-nav { width: {$mixt_opt['site-width']}; }\n";
			echo "#main-wrap.nav-vertical .container { max-width: 100%; }\n";
		} else {
			echo ".container, #main-wrap.nav-vertical .container, .boxed #main-wrap, .boxed #main-nav { max-width: {$mixt_opt['site-width']}; }\n";
			echo "@media only screen and ( min-width: {$mixt_opt['site-width']} ) {\n";
				echo "\t.container, #main-wrap.nav-vertical .container, .boxed #main-wrap, .boxed #main-nav { width: {$mixt_opt['site-width']}; }\n";
			echo "}\n";
		}
	}

	// Sidebar Width
	if ( ! empty($mixt_opt['sidebar-width-sm']) ) {
		if ( substr($mixt_opt['sidebar-width-sm'], -1) == '%' ) {
			$content_width = 100 - intval($mixt_opt['sidebar-width-sm']) . '%';
		} else {
			$content_width = "calc(100% - {$mixt_opt['sidebar-width-sm']})";
		}
		echo "@media only screen and ( min-width: " . Mixt_DCSS::media_bp('mars', 'min') . " ) {\n";
			echo "\t#content-wrap.has-sidebar #content { width: $content_width; }\n";
			echo "\t#content-wrap.has-sidebar .sidebar { width: {$mixt_opt['sidebar-width-sm']}; }\n";
		echo "}\n";
	}
	if ( ! empty($mixt_opt['sidebar-width']) ) {
		if ( substr($mixt_opt['sidebar-width'], -1) == '%' ) {
			$content_width = 100 - intval($mixt_opt['sidebar-width']) . '%';
		} else {
			$content_width = "calc(100% - {$mixt_opt['sidebar-width']})";
		}
		echo "@media only screen and ( min-width: " . Mixt_DCSS::media_bp('venus', 'min') . " ) {\n";
			echo "\t#content-wrap.has-sidebar #content { width: $content_width; }\n";
			echo "\t#content-wrap.has-sidebar .sidebar { width: {$mixt_opt['sidebar-width']}; }\n";
		echo "}\n";
	}

	// Typography
	$site_font = $mixt_opt['font-sitewide'];
	$font_family = $site_font['font-family'];
	if ( ! empty($font_family) ) {
		if ( ! empty($site_font['font-backup']) ) {
			$font_family .= ', ' . $site_font['font-backup'];
		}
		$body_styles .= "font-family: $font_family; ";
	}
	if ( ! empty($site_font['font-size']) ) {
		$body_styles .= "font-size: {$site_font['font-size']}; ";
	}

	if ( $body_styles != '' ) { echo "body { $body_styles }\n"; }


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
		$font_size = ! empty($mixt_opt['logo-text-typo']['font-size']) ? $mixt_opt['logo-text-typo']['font-size'] : '24px';

		echo "#nav-logo strong { ";
			echo "font-size: $font_size; ";
			if ( ! empty($mixt_opt['logo-text-color']) ) { echo "color: {$mixt_opt['logo-text-color']}; "; }
			$logo_font_family = $mixt_opt['logo-text-typo']['font-family'];
			if ( ! empty($mixt_opt['logo-text-typo']['font-backup']) ) {
				$logo_font_family .= ', ' . $mixt_opt['logo-text-typo']['font-backup'];
			}
			echo "font-family: $logo_font_family !important; ";
			if ( ! empty($mixt_opt['logo-text-typo']['font-weight']) ) { echo "font-weight: {$mixt_opt['logo-text-typo']['font-weight']}; "; }
			if ( ! empty($mixt_opt['logo-text-typo']['text-transform']) ) { echo "text-transform: {$mixt_opt['logo-text-typo']['text-transform']}; "; }
		echo "}\n";

		// Dark Bg Logo Color
		if ( ! empty($mixt_opt['logo-text-inv']) ) { echo "#nav-logo .logo-dark { color: {$mixt_opt['logo-text-inv']}; }\n"; }

		// Logo Shrink
		if ( $mixt_opt['logo-shrink'] != '0' ) {
			$shrink_amount = $mixt_opt['logo-shrink'];
			$shrink_size   = intval($font_size) - $shrink_amount . 'px';

			echo ".fixed-nav #nav-logo strong { font-size: $shrink_size; }\n";
		}
	}

	// Logo Tagline
	echo "#nav-logo small { ";
		if ( ! empty($mixt_opt['logo-tagline-color']) ) { echo "color: {$mixt_opt['logo-tagline-color']}; "; }
		if ( ! empty($mixt_opt['logo-tagline-typo']['font-family']) ) {
			$tagline_font_family = $mixt_opt['logo-tagline-typo']['font-family'];
			if ( ! empty($mixt_opt['logo-tagline-typo']['font-backup']) ) {
				$tagline_font_family .= ', ' . $mixt_opt['logo-tagline-typo']['font-backup'];
			}
			echo "font-family: $tagline_font_family !important; ";
		}
		if ( ! empty($mixt_opt['logo-tagline-typo']['font-size']) ) { echo "font-size: {$mixt_opt['logo-tagline-typo']['font-size']}; "; }
		if ( ! empty($mixt_opt['logo-tagline-typo']['font-weight']) ) { echo "font-weight: {$mixt_opt['logo-tagline-typo']['font-weight']}; "; }
		if ( ! empty($mixt_opt['logo-tagline-typo']['text-transform']) ) { echo "text-transform: {$mixt_opt['logo-tagline-typo']['text-transform']}; "; }
	echo "}\n";

	// Dark Bg Tagline Color
	if ( ! empty($mixt_opt['logo-tagline-inv']) ) { echo ".bg-dark #nav-logo small { color: {$mixt_opt['logo-tagline-inv']}; }\n"; }


	// NAVBAR STYLING

	$navbar_properties = '';
	$logo_center = $mixt_opt['logo-align'] == '2';

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
			$nav_wrap_height = $defaults['nav-height'] + $nav_pad * 2;

			if ( $logo_center ) {
				$nav_wrap_height = $nav_wrap_height + $defaults['nav-height'];
				echo ".nav-full #main-nav-wrap.logo-center { min-height: {$nav_wrap_height}px; }";
			} else {
				echo ".nav-full #main-nav-wrap { min-height: {$nav_wrap_height}px; }";
			}
			$navbar_properties .= "padding-top: {$nav_pad}px; padding-bottom: {$nav_pad}px; ";
		}
	}
	if ( isset($mixt_opt['nav-fixed-padding']) ) {
		$nav_pad = $mixt_opt['nav-fixed-padding'];
		if ( $nav_pad != $defaults['nav-fixed-padding'] ) {
			$nav_wrap_height = $nav_item_height = $defaults['nav-height'] + $nav_pad * 2;

			if ( $logo_center ) {
				$nav_wrap_height = $nav_wrap_height + $defaults['nav-height'];
				echo ".fixed-nav .nav-full #main-nav-wrap.logo-center { min-height: {$nav_wrap_height}px; }\n";
			} else {
				echo ".fixed-nav .nav-full #main-nav-wrap { min-height: {$nav_wrap_height}px; }\n";
			}
			echo ".fixed-nav .nav-full .navbar-mixt { padding-top: {$nav_pad}px; padding-bottom: {$nav_pad}px; }\n";

			if ( $nav_pad > 0 ) {
				if ( $logo_center ) {
					$half_padding = $nav_pad / 2;
					$nav_item_height = $nav_item_height - $half_padding;
					echo ".fixed-nav .nav-full .navbar-mixt .navbar-header { margin-top: -{$half_padding}px; }";
					echo ".fixed-nav .nav-full .navbar-mixt .nav > li { margin-top: {$half_padding}px; margin-bottom: -{$nav_pad}px; }";
				} else {
					echo ".fixed-nav .nav-full .navbar-mixt .nav > li { margin-top: -{$nav_pad}px; margin-bottom: -{$nav_pad}px; }";
				}
				echo ".fixed-nav .nav-full .navbar-mixt .nav > li, .fixed-nav .navbar-mixt .nav > li > a { height: {$nav_item_height}px; line-height: {$nav_item_height}px; }";
			}
		}
	}

	// Vertical Navbar Width
	if ( $mixt_opt['nav-layout'] == 'vertical' ) {
		if ( ! empty($mixt_opt['nav-vertical-width-sm']) ) {
			echo "#main-wrap.nav-vertical.nav-full #main-nav-wrap { width: {$mixt_opt['nav-vertical-width-sm']}; }\n";
			echo "#main-wrap.nav-vertical.nav-full.nav-left { padding-left: {$mixt_opt['nav-vertical-width-sm']}; }\n";
			echo "#main-wrap.nav-vertical.nav-full.nav-right { padding-right: {$mixt_opt['nav-vertical-width-sm']}; }\n";
		}
		if ( ! empty($mixt_opt['nav-vertical-width']) ) {
			echo "@media only screen and ( min-width: " . Mixt_DCSS::media_bp('earth', 'min') . " ) {\n";
				echo "\t#main-wrap.nav-vertical.nav-full #main-nav-wrap { width: {$mixt_opt['nav-vertical-width']}; }\n";
				echo "\t#main-wrap.nav-vertical.nav-full.nav-left { padding-left: {$mixt_opt['nav-vertical-width']}; }\n";
				echo "\t#main-wrap.nav-vertical.nav-full.nav-right { padding-right: {$mixt_opt['nav-vertical-width']}; }\n";
			echo "}\n";
		}
	}

	// Navbar Typography
	$nav_font = $mixt_opt['font-nav'];
	$font_family = $nav_font['font-family'];
	if ( ! empty($font_family) ) {
		if ( ! empty($nav_font['font-backup']) ) { $font_family .= ', ' . $nav_font['font-backup']; }
		$navbar_properties .= "font-family: $font_family; ";
	}
	if ( ! empty($nav_font['font-size']) ) { $navbar_properties .= "font-size: {$nav_font['font-size']}; "; }
	if ( ! empty($nav_font['font-weight']) ) { $navbar_properties .= "font-weight: {$nav_font['font-weight']}; "; }
	if ( ! empty($nav_font['text-transform']) ) { $navbar_properties .= "text-transform: {$nav_font['text-transform']}; "; }

	if ( $navbar_properties != '' ) echo ".navbar-mixt { $navbar_properties }\n";


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
