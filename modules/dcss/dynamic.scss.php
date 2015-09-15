<?php

/**
 * MIXT Dynamic Sass
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access

require_once( MIXT_CORE_DIR . '/options.php' );
require_once( MIXT_FRAME_DIR . '/libs/Color.php' );

use Mexitek\PHPColors\Color;

global $mixt_opt;

if ( ! is_array($mixt_opt) ) { return; }

// MEDIA BREAKPOINTS

$media_bp = function($bp, $range = 'max') {
	$bps = array(
		'mercury' => 480,
		'mars'    => 767,
		'venus'   => 992,
		'earth'   => 1200,
	);

	if ( isset($bps[$bp]) ) {
		if ( $range == 'max' ) {
			return $bps[$bp] . 'px';
		} else {
			return $bps[$bp] + 1 . 'px';
		}
	}
};


// START SASS OUTPUT


// PAGE LOADER

$page_loader_bg    = $mixt_opt['page-loader-bg'];
$page_loader_color = $mixt_opt['page-loader-color'];

if ( $page_loader_bg != '' ) {
	echo '#load-overlay {' .
			"background-color: $page_loader_bg;";
			if ( $page_loader_color != '' ) {
				echo ".ring, .square2 { border-color: $page_loader_color; }";
				echo ".circle, .square { background-color: $page_loader_color; }";
			}
	echo '}';
}


// LOGO STYLES

if ( ! isset($mixt_opt['logo-type']) || $mixt_opt['logo-type'] == 'text' ) {
// Text Logo

	$typo_opts      = $mixt_opt['logo-text-typo'];

	$color          = $typo_opts['color'];
	$font_size      = $typo_opts['font-size'];
	$font_weight    = $typo_opts['font-weight'];
	$font_family    = $typo_opts['font-family'];
	$text_transform = $typo_opts['text-transform'];

	if ( $typo_opts['font-backup'] != '' ) {
		$font_family .= ', ' . $typo_opts['font-backup'];
	}

	echo '#nav-logo strong {';
		if ( $color != '' ) {
			echo "color: $color;";
		}
		echo "font-size: $font_size;";
		echo "font-family: $font_family;";
		if ( $font_weight != '' ) {
			echo "font-weight: $font_weight;";
		}
		if ( $text_transform != '' ) {
			echo "text-transform: $text_transform;";
		}
	echo "}\n";

	// Dark Bg Logo Color
	if ( $mixt_opt['logo-text-inv'] != '' ) {
		echo '#nav-logo .logo-dark { color:' . $mixt_opt['logo-text-inv'] . '; }';
	}

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


// NAVBAR THEMES

$nav_option_arr = array(
	'nav-theme' => array(
		'type'    => 'str',
		'return'  => 'value',
		'default' => 'aqua',
	),
	'sec-nav-theme' => array(
		'type'    => 'str',
		'return'  => 'value',
		'default' => 'aqua',
	),
);

$nav_options = mixt_get_options($nav_option_arr);

$nav_themes = array();
$nav_themes[] = $nav_options['nav-theme'];

if ( $nav_options['nav-theme'] != $nav_options['sec-nav-theme'] ) {
	$nav_themes[] = $nav_options['sec-nav-theme'];
}

$nav_defaults = array(
	'bg'       => '#ffffff',
	'text'     => '#333333',
	'inv-text' => '#ffffff',
	'accent'   => '#5991CE',
);

foreach ( $nav_themes as $theme_id ) {

	if ( $theme_id != 'aqua' && $theme_id != 'nightly' ) {

		if ( isset($mixt_opt['nav-themes'][$theme_id]) ) {
			$theme = $mixt_opt['nav-themes'][$theme_id];
		} else {
			$first_theme = key($mixt_opt['nav-themes']);
			$theme = $mixt_opt['nav-themes'][$first_theme];
		}

		$theme_id    = 'theme-' . $theme_id;
		$navbar      = '.navbar.' . $theme_id;
		$navbar_dark = $navbar . '.bg-dark';

		// Get Theme Colors

		$nav_bg    = $theme['bg'] != '' ? $theme['bg'] : $nav_defaults['bg'];
		$nav_bg_ob = new Color($nav_bg);

		$nav_border    = $theme['border'] != '' ? $theme['border'] : '#'.$nav_bg_ob->darken(10);
		$nav_border_ob = new Color($nav_border);

		$nav_text     = $theme['text'] != '' ? $theme['text'] : $nav_defaults['text'];
		$nav_inv_text = $theme['inv-text'] != '' ? $theme['inv-text'] : $nav_defaults['inv-text'];

		$nav_accent     = $theme['accent'] != '' ? $theme['accent'] : $nav_defaults['accent'];
		$nav_inv_accent = $theme['inv-accent'] != '' ? $theme['inv-accent'] : $nav_accent;

		$nav_menu_bg    = $theme['menu-bg'] != '' ? $theme['menu-bg'] : $nav_bg;
		$nav_menu_bg_ob = new Color($nav_menu_bg);

		$nav_menu_border    = $theme['menu-border'] != '' ? $theme['menu-border'] : '#'.$nav_menu_bg_ob->darken(20);
		$nav_menu_border_ob = new Color($nav_menu_border);

		// Set Effects & Text Colors According To The Background Color

		if ( $nav_bg_ob->isLight() ) {
			$nav_hover  = '#'.$nav_bg_ob->darken(4);

			$nav_bg_light_text = $nav_text;
			$nav_bg_dark_text  = $nav_inv_text;

			$nav_bg_light_accent = $nav_accent;
			$nav_bg_dark_accent  = $nav_inv_accent;
		} else {
			$nav_hover  = '#'.$nav_bg_ob->lighten(4);

			$nav_bg_light_text = $nav_inv_text;
			$nav_bg_dark_text  = $nav_text;

			$nav_bg_light_accent = $nav_inv_accent;
			$nav_bg_dark_accent  = $nav_accent;
		}

		// Make RGBA Colors If Enabled

		$nav_bg_rgba = $nav_border_rgba = $nav_menu_bg_rgba = $nav_menu_border_rgba = '';

		$theme_rgba = isset($theme['rgba']) ? $theme['rgba'] : 0;

		if ( $theme_rgba ) {
			$nav_bg_rgb  = implode(',', $nav_bg_ob->getRgb());
			$nav_bg_rgba = "background-color: rgba($nav_bg_rgb, 0.95);";

			$nav_border_rgb  = implode(',', $nav_border_ob->getRgb());
			$nav_border_rgba = "border-color: rgba($nav_border_rgb, 0.8)";

			$nav_menu_bg_rgb  = implode(',', $nav_menu_bg_ob->getRgb());
			$nav_menu_bg_rgba = "background-color: rgba($nav_menu_bg_rgb, 0.95);";

			$nav_menu_border_rgb  = implode(',', $nav_menu_border_ob->getRgb());
			$nav_menu_border_rgba = "border-color: rgba($nav_menu_border_rgb, 0.8)";
		}


		// BG Color

		echo "$navbar { background-color: $nav_bg; $nav_bg_rgba }\n";

		// Text Color

		echo "$navbar .text-cont, " .
			 "$navbar .nav > li > a { color: $nav_bg_light_text; }\n";

		echo "$navbar_dark .text-cont, " .
			 "$navbar_dark .nav > li > a { color: $nav_bg_dark_text; }\n";

		// Hover & Active Text Color

		echo "$navbar .nav > li:hover > a, " .
			 "$navbar .nav > li > a:hover, " .
			 "$navbar .navbar-toggle:hover { background-color: $nav_hover; }\n";

		echo "$navbar .text-cont a, " .
			 "$navbar .nav > li:hover > a, " .
			 "$navbar .nav > li > a:hover, " .
			 "$navbar .nav > li.active > a { color: $nav_bg_light_accent; } \n";

		echo "$navbar .nav > .active > a:before, " .
			 "$navbar .nav > .current-menu-parent > a:before { background-color: $nav_bg_light_accent; box-shadow: 0 1px 0 $nav_bg_light_accent; }\n";

		echo "$navbar_dark .text-cont a, " .
			 "$navbar_dark .nav > li:hover > a, " .
			 "$navbar_dark .nav > li > a:hover, " .
			 "$navbar_dark .nav > li.active > a { color: $nav_bg_dark_accent; } \n";

		echo "$navbar_dark .nav > .active > a:before, " .
			 "$navbar_dark .nav > .current-menu-parent > a:before { background-color: $nav_bg_dark_accent; box-shadow: 0 1px 0 $nav_bg_dark_accent; }\n";

		// Border Color

		echo "$navbar, " .
			 "$navbar .nav > li, " .
			 "$navbar .nav > li > a, " .
			 "$navbar .navbar-toggle { border-color: $nav_border; $nav_border_rgba }\n";

		// Menus

		if ( $nav_menu_bg_ob->isLight() ) {
			$nav_menu_text   = $nav_bg_light_text;
			$nav_menu_accent = $nav_bg_light_accent;
			$nav_menu_hover  = '#'.$nav_menu_bg_ob->darken(3);
			$nav_menu_expand = 'rgba(0,0,0,0.03)';
		} else {
			$nav_menu_text   = $nav_bg_dark_text;
			$nav_menu_accent = $nav_bg_dark_accent;
			$nav_menu_hover  = '#'.$nav_menu_bg_ob->lighten(5);
			$nav_menu_expand = 'rgba(255,255,255,0.05)';
		}

		echo "$navbar .sub-menu { background-color: $nav_menu_bg; $nav_menu_bg_rgba }\n";

		echo "$navbar .sub-menu li > a, " .
			 "$navbar .sub-menu input, " .
			 "$navbar .search-form button { color: $nav_menu_text; }\n";

		echo "$navbar .sub-menu ::-webkit-input-placeholder { color: $nav_menu_text; }\n";
		echo "$navbar .sub-menu ::-moz-placeholder { color: $nav_menu_text; }\n";

		echo "$navbar .sub-menu li > a:hover, " .
			 "$navbar .nav-search .btn { background-color: $nav_menu_hover; }\n";

		echo "$navbar .sub-menu li > a:hover, " .
			 "$navbar .sub-menu .active > a, " .
			 "$navbar .sub-menu .active > a:hover { color: $nav_menu_accent; }\n";

		echo "$navbar .sub-menu, " .
			 "$navbar .sub-menu > li, " .
			 "$navbar .sub-menu > li > a, " .
			 "$navbar .nav-search button { border-color: $nav_menu_border; $nav_menu_border_rgba }\n";

		echo "$navbar .mega-menu-column > a { background-color: $nav_menu_hover; }\n";

		// Divider

		echo "$navbar li.divider { background-color: $nav_bg_light_text; }\n";
		echo "$navbar_dark li.divider { background-color: $nav_bg_dark_text; }\n";

		// Navbar Toggle

		echo "$navbar .navbar-toggle .icon-bar { background-color: $nav_bg_light_text; }\n";
		echo "$navbar_dark .navbar-toggle .icon-bar { background-color: $nav_bg_dark_text; }\n";

		// Media

		$nav_media_mars = $media_bp('mars');

		echo "@media (max-width: $nav_media_mars) {\n";

			echo "$navbar.navbar-mixt .navbar-inner { background-color: $nav_menu_bg; $nav_menu_bg_rgba }\n";

			echo "$navbar.navbar-mixt .navbar-inner .text-cont, " .
				 "$navbar.navbar-mixt .nav > li > a { color: $nav_menu_text; }\n";

			echo "$navbar.navbar-mixt .nav > li:hover > a, " .
				 "$navbar.navbar-mixt .nav > li > a:hover { background-color: $nav_menu_hover; }\n";

			echo "$navbar.navbar-mixt .nav > li:hover > a, " .
				 "$navbar.navbar-mixt .nav > li > a:hover, " .
				 "$navbar.navbar-mixt .nav > li.active > a { color: $nav_menu_accent; } \n";

			echo "$navbar.navbar-mixt .navbar-inner, " .
				 "$navbar.navbar-mixt .nav > li, " .
				 "$navbar.navbar-mixt .nav > li > a { border-color: $nav_menu_border; $nav_menu_border_rgba }\n";

			echo "$navbar.navbar-mixt .nav li.expand, " .
				 "$navbar.navbar-mixt .nav li.expand .sub-menu a:hover { background-color: $nav_menu_expand; }\n";

		echo "}\n";
	}
}

unset($nav_themes, $nav_defaults);