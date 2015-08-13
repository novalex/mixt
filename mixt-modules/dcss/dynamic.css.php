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
		'nav-height' => 50,
		'nav-padding' => 20,
		'nav-fixed-padding' => 0,
		'font-family' => 'Roboto',
	);
	$site_theme = $theme_ob->site_theme;


	// START CSS OUTPUT

	echo "<style type='text/css' data-id='mixt-head-css'>\n";

	$bp_min_mars_properties = '';


	// PAGE LOADER STYLING

	$page_loader_bg    = $mixt_opt['page-loader-bg'];
	$page_loader_color = $mixt_opt['page-loader-color'];

	if ( ! empty($page_loader_bg) ) {
		echo "#load-overlay { background-color: $page_loader_bg; }";
	}

	if ( ! empty($page_loader_color) ) {
		echo "#load-overlay .ring, #load-overlay .square2 { border-color: $page_loader_color; }";
		echo "#load-overlay .circle, #load-overlay .square { background-color: $page_loader_color; }";
	}


	// SITE-WIDE STYLING

	$site_options = mixt_get_options( array(
		'site-bg-pat' => array( 'type' => 'str', 'return' => 'value', 'default' => '' ),
	) );
	if ( ! empty($site_options['site-bg-pat']) ) {
		$img_url = $site_options['site-bg-pat'];
		echo "#content-wrap { background-image: url('$img_url'); }";
	}

	$site_font = $mixt_opt['font-sitewide'];
	$font_family = $site_font['font-family'];
	if ( $font_family != $defaults['font-family'] && ! empty($font_family) ) {
		if ( ! empty($site_font['font-backup']) ) {
			$font_family .= ', ' . $site_font['font-backup'];
		}
		echo "body { font-family: $font_family; }";
	}

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
		echo "}";

		// Dark Bg Logo Color
		if ( ! empty($mixt_opt['logo-text-inv']) ) { echo "#nav-logo .logo-dark { color: {$mixt_opt['logo-text-inv']}; }"; }

		// Logo Shrink
		if ( $mixt_opt['logo-shrink'] != '0' ) {
			$shrink_amount = $mixt_opt['logo-shrink'];
			$shrink_size   = intval($font_size) - $shrink_amount . 'px';

			echo ".fixed-nav #nav-logo strong { font-size: $shrink_size; }";
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

		echo '#nav-logo img { width:' . $logo_width_val . '; height:' . $logo_height_val . '; }';

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
			echo '.fixed-nav #nav-logo img { width:' . $shrink_width . '; height:' . $shrink_height . '; }';
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
	echo "}";


	// NAVBAR STYLING

	$navbar_properties = '';

	// Navbar Texture
	if ( ! empty($mixt_opt['nav-texture']) ) {
		$img_url = $mixt_opt['nav-texture'];
		$navbar_properties .= "background-image: url('$img_url');";
	}
	if ( ! empty($mixt_opt['sec-nav-texture']) ) {
		$img_url = $mixt_opt['sec-nav-texture'];
		echo ".second-nav { background-image: url('$img_url'); }";
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

			echo ".fixed-nav #main-nav-wrap { min-height: $nav_wrap_height; }";
			echo ".fixed-nav .navbar-mixt { padding-top: $nav_pad_px; padding-bottom: $nav_pad_px; }";

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

	echo ".navbar-mixt { $navbar_properties }";

	// Navbar Themes
	$theme_ob->output_navbar();


	// HEAD MEDIA STYLING

	$hm_options = mixt_get_options( array(
		'bg' => array(
			'type'    => 'str',
			'return'  => 'value',
			'key'     => 'head-bg-color',
		),
		'text' => array(
			'type'    => 'str',
			'return'  => 'value',
			'key'     => 'head-text-color',
			'default' => $site_theme['text'],
		),
		'inv-text' => array(
			'type'    => 'str',
			'return'  => 'value',
			'key'     => 'head-inv-text-color',
			'default' => $site_theme['inv-text'],
		),
	) );

	$hm_el = '.head-media';
	if ( ! empty($hm_options['bg']) ) {
		$hm_bg = $hm_options['bg'];
		echo "$hm_el { background-color: $hm_bg; }";
	}
	if ( $hm_options['text'] != $site_theme['text'] ) {
		$hm_text = $hm_options['text'];
		echo "$hm_el .container," .
			 "$hm_el #breadcrumbs li + li:before { color: $hm_text; }";
	}
	if ( $hm_options['inv-text'] != $site_theme['inv-text'] ) {
		$hm_inv_text = $hm_options['inv-text'];
		echo "$hm_el.bg-dark .container," .
			 "$hm_el.bg-dark .media-inner a," .
			 "$hm_el.bg-dark #breadcrumbs li + li:before { color: $hm_inv_text; }";
	}

	// LOCATION BAR STYLING

	$loc_bar_option_arr = array(
		'bg' => array(
			'type'    => 'str',
			'return'  => 'value',
			'key'     => 'loc-bar-bg-color',
		),
		'bg-pat' => array(
			'type'    => 'str',
			'return'  => 'value',
			'key'     => 'loc-bar-bg-pat',
		),
		'text' => array(
			'type'    => 'str',
			'return'  => 'value',
			'key'     => 'loc-bar-text-color',
		),
		'border' => array(
			'type'    => 'str',
			'return'  => 'value',
			'key'     => 'loc-bar-border-color',
		),
	);
	$loc_bar_options = mixt_get_options($loc_bar_option_arr);

	echo '#location-bar {';
		if ( ! empty($loc_bar_options['border']) ) { echo 'border-color: ' . $loc_bar_options['border'] . ';'; }
		if ( ! empty($loc_bar_options['bg']) ) { echo 'background-color: ' . $loc_bar_options['bg'] . ';'; }
		if ( ! empty($loc_bar_options['bg-pat']) ) { echo 'background-image: url(' . $loc_bar_options['bg-pat'] . ');'; }
	echo "}";

	if ( ! empty($loc_bar_options['text']) ) { echo '#location-bar, #location-bar a:hover, #location-bar li:before { color: ' . $loc_bar_options['text'] . "; }"; }


	// MEDIA QUERIES
	
	if ( $bp_min_mars_properties != '' ) echo "@media ( min-width: {$theme_ob->media_bp('mars', 'min')} ) { $bp_min_mars_properties }";

	echo "\n</style>";
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