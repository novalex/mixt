<?php

/**
 * Dynamic CSS Generator
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access

require_once( MIXT_CORE_DIR . '/options.php' );
require_once( MIXT_FRAME_DIR . '/libs/Color.php' );

use Mexitek\PHPColors\Color;


/**
 * Output dynamic CSS
 */
function mixt_print_css() {
	global $mixt_opt;
	if ( ! is_array($mixt_opt) ) { return; }

	// FUNCTIONS

	$set_color_for_bg = function($bg, $colors = array('#333333', '#ffffff')) {
		$bg_ob = new Color($bg);

		if ( $bg_ob->isLight() ) {
			return $colors[0];
		} else {
			return $colors[1];
		}
	};

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


	// START CSS OUTPUT

	echo '<style type="text/css">';


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

	if ( ! empty($site_options['site-bg-pat']) ) {
		$img_url = $site_options['site-bg-pat'];
		echo "#content-wrap { background-image: url('$img_url'); }\n";
	}

	$site_font = $mixt_opt['site-font'];
	$font_family = $site_font['font-family'];
	if ( $font_family != 'Roboto' && ! empty($font_family) ) {
		if ( ! empty($site_font['font-backup']) ) {
			$font_family .= ', ' . $site_font['font-backup'];
		}
		echo "body { font-family: $font_family; }\n";
	}


	$default_theme = 'aqua';

	$default_site_themes = mixt_default_themes('site');
	$theme_defaults      = $default_site_themes[$default_theme];

	$site_options = array(
		// Site Background Pattern
		'site-bg-pat' => array(
			'type'    => 'str',
			'return'  => 'value',
			'default' => '',
		),
		// Active Site-Wide Theme
		'site-theme' => array(
			'type'    => 'str',
			'return'  => 'value',
			'default' => $default_theme,
		),
	);
	$site_options = mixt_get_options($site_options);

	$active_site_theme = $site_options['site-theme'];
	$site_theme = $mixt_opt['site-themes'][$active_site_theme];

	$site_text      = ! empty($site_theme['text']) ? $site_theme['text'] : $theme_defaults['text'];
	$site_text_ob   = new Color($site_text);
	$site_text_fade = ! empty($site_theme['text-fade']) ? $site_theme['text-fade'] : '#'.$site_text_ob->lighten(20);

	$site_inv_text      = ! empty($site_theme['inv-text']) ? $site_theme['inv-text'] : $theme_defaults['inv-text'];
	$site_inv_text_ob   = new Color($site_inv_text);
	$site_inv_text_fade = ! empty($site_theme['inv-text-fade']) ? $site_theme['inv-text-fade'] : $site_inv_text_ob->darken(40);

	$site_border = ! empty($site_theme['border']) ? $site_theme['border'] : $theme_defaults['border'];

	$site_accent = ! empty($site_theme['accent']) ? $site_theme['accent'] : $theme_defaults['accent'];

	$site_link_color = ! empty($site_theme['link']) ? $site_theme['link'] : $site_accent;

	if ( ! array_key_exists($active_site_theme, $default_site_themes) || 0 > 1 ) { ////////////////////////////////////////////////////////////////////////////////

		// Text Color
		echo "body, a.no-color, a:hover, a:focus { color: $site_text; }\n";

		// Text Color Fade
		echo ".post-meta a," .
			 ".post-meta > span { color: $site_text_fade; }\n";

		// Border Color
		echo "#content { border-color: $site_border; }\n";

		// Accent Text Color
		echo ".accent-color { color: $site_accent; }\n";

		// Accent Background Color
		echo ".accent-bg," .
			 ".accent-bg:hover," .
			 ".tag-list a:hover," .
			 ".tagcloud a:hover," .
			 ".hover-accent-bg:hover { background-color: $site_accent; color: " . $set_color_for_bg($site_accent, array($site_text, $site_inv_text)) . "; }\n";

		// Accent Border Color
		echo "blockquote { border-left-color: $site_accent !important; }\n";

		// Link Color
		echo "a," .
			 ".post-meta a:hover { color: $site_link_color; }\n";
	}


	// LOGO STYLING

	if ( ! isset($mixt_opt['logo-type']) || $mixt_opt['logo-type'] == 'text' ) {
	// Text Logo

		$typo_opts      = $mixt_opt['logo-text-typo'];

		$color          = $typo_opts['color'];
		$font_size      = $typo_opts['font-size'];
		$font_weight    = $typo_opts['font-weight'];
		$font_family    = $typo_opts['font-family'];
		$text_transform = $typo_opts['text-transform'];

		if ( ! empty($typo_opts['font-backup']) ) {
			$font_family .= ', ' . $typo_opts['font-backup'];
		}

		echo '#nav-logo strong {';
			if ( ! empty($color) ) {
				echo "color: $color;";
			}
			echo "font-size: $font_size;";
			echo "font-family: $font_family !important;";
			if ( ! empty($font_weight) ) {
				echo "font-weight: $font_weight;";
			}
			if ( ! empty($text_transform) ) {
				echo "text-transform: $text_transform;";
			}
		echo "}\n";

		// Dark Bg Logo Color
		if ( ! empty($mixt_opt['logo-text-inv']) ) {
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


	// NAVBAR STYLING

	if ( ! empty($mixt_opt['nav-texture']) ) {
		$img_url = $mixt_opt['nav-texture'];
		echo ".navbar-mixt { background-image: url('$img_url'); }\n";
	}

	if ( ! empty($mixt_opt['sec-nav-texture']) ) {
		$img_url = $mixt_opt['sec-nav-texture'];
		echo ".second-nav { background-image: url('$img_url'); }\n";
	}

	if ( isset($mixt_opt['nav-padding']) ) {
		$nav_pad = $mixt_opt['nav-padding'];
		if ( $nav_pad != 20 ) {

			$nav_height = 50;
			$nav_pad_px = $nav_pad . 'px';
			$nav_wrap_height = $nav_height + ($nav_pad * 2) . 'px';

			echo "#main-nav-wrap { min-height: $nav_wrap_height; }\n";
			echo ".navbar-mixt { padding-top: $nav_pad_px; padding-bottom: $nav_pad_px; }\n";
		}
	}

	$nav_options = mixt_get_options( array(
		'nav-theme' => array(
			'type'    => 'str',
			'return'  => 'value',
			'default' => $default_theme,
		),
		'nav-opacity' => array(
			'type'    => 'str',
			'return'  => 'value',
			'default' => '0.95',
		),
		'nav-top-opacity' => array(
			'type'    => 'str',
			'return'  => 'value',
			'default' => '0.1',
		),
		'sec-nav-theme' => array(
			'type'    => 'str',
			'return'  => 'value',
			'default' => $default_theme,
		),
	));

	$nav_themes = array();
	$nav_themes[] = $nav_options['nav-theme'];

	if ( $nav_options['nav-theme'] != $nav_options['sec-nav-theme'] ) {
		$nav_themes[] = $nav_options['sec-nav-theme'];
	}

	$default_nav_themes = mixt_default_themes('nav');
	$nav_defaults       = $default_nav_themes[$default_theme];

	foreach ( $nav_themes as $theme_id ) {

		if ( isset($mixt_opt['nav-themes'][$theme_id]) ) {
			$theme = $mixt_opt['nav-themes'][$theme_id];
		} else {
			$first_theme = key($mixt_opt['nav-themes']);
			$theme = $mixt_opt['nav-themes'][$first_theme];
		}

		$nav_bg      = ! empty($theme['bg']) ? $theme['bg'] : $nav_defaults['bg'];
		$nav_bg_ob   = new Color($nav_bg);
		$nav_bg_rgb  = implode(',', $nav_bg_ob->getRgb());
		echo ".nav-transparent .navbar-mixt.theme-$theme_id.position-top { background-color: rgba($nav_bg_rgb, {$nav_options['nav-top-opacity']}); }\n";
		echo ".fixed-nav .navbar-mixt.theme-$theme_id { background-color: rgba($nav_bg_rgb,{$nav_options['nav-opacity']}); }\n";

		if ( ! array_key_exists($theme_id, mixt_default_themes('names')) ) { /////////////////////////////////////////////////////////

			$theme_id    = 'theme-' . $theme_id;
			$navbar      = '.navbar.' . $theme_id;
			$navbar_dark = $navbar . '.bg-dark';
			$top_navbar  = $navbar . '.navbar-mixt';

			// Get Theme Colors

			$nav_border    = ! empty($theme['border']) ? $theme['border'] : '#'.$nav_bg_ob->darken(10);
			$nav_border_ob = new Color($nav_border);

			$nav_text     = ! empty($theme['text']) ? $theme['text'] : $site_text;
			$nav_inv_text = ! empty($theme['inv-text']) ? $theme['inv-text'] : $site_inv_text;

			$nav_accent     = ! empty($theme['accent']) ? $theme['accent'] : $site_accent;
			$nav_inv_accent = ! empty($theme['inv-accent']) ? $theme['inv-accent'] : $nav_accent;

			$nav_menu_bg    = ! empty($theme['menu-bg']) ? $theme['menu-bg'] : $nav_bg;
			$nav_menu_bg_ob = new Color($nav_menu_bg);

			$nav_menu_border    = ! empty($theme['menu-border']) ? $theme['menu-border'] : '#'.$nav_menu_bg_ob->darken(20);
			$nav_menu_border_ob = new Color($nav_menu_border);

			// Set Effects & Text Colors According To The Background Color

			if ( $nav_bg_ob->isLight() ) {
				$nav_hover  = '#'.$nav_bg_ob->darken(4);

				$nav_bg_light_text = $nav_text;
				$nav_bg_dark_text  = $nav_inv_text;

				$nav_bg_light_accent = $nav_accent;
				$nav_bg_dark_accent  = $nav_inv_accent;
			} else {
				$nav_hover  = '#'.$nav_bg_ob->lighten(6);

				$nav_bg_light_text = $nav_inv_text;
				$nav_bg_dark_text  = $nav_text;

				$nav_bg_light_accent = $nav_inv_accent;
				$nav_bg_dark_accent  = $nav_accent;
			}

			// Make RGBA Colors If Enabled

			$nav_border_rgba = $nav_menu_bg_rgba = $nav_menu_border_rgba = '';

			$theme_rgba = isset($theme['rgba']) ? $theme['rgba'] : 0;

			if ( $theme_rgba ) {
				$nav_border_rgb  = implode(',', $nav_border_ob->getRgb());
				$nav_border_rgba = "border-color: rgba($nav_border_rgb, 0.8)";

				$nav_menu_bg_rgb  = implode(',', $nav_menu_bg_ob->getRgb());
				$nav_menu_bg_rgba = "background-color: rgba($nav_menu_bg_rgb, 0.95);";

				$nav_menu_border_rgb  = implode(',', $nav_menu_border_ob->getRgb());
				$nav_menu_border_rgba = "border-color: rgba($nav_menu_border_rgb, 0.8)";
			}


			// BG Color

			echo "$navbar { background-color: $nav_bg; }\n";

			// Text Color

			echo "$navbar .text-cont," .
				 "$navbar .text-cont a:hover," .
				 "$navbar .text-cont a.no-color," .
				 "$navbar .nav > li > a { color: $nav_bg_light_text; }\n";

			echo "$navbar_dark .text-cont," .
				 "$navbar_dark .text-cont a:hover," .
				 "$navbar_dark .text-cont a.no-color," .
				 "$navbar_dark .nav > li > a { color: $nav_bg_dark_text; }\n";

			// Hover & Active Text Color

			echo "$navbar .nav > li:hover > a," .
				 "$navbar .nav > li.hover > a," .
				 "$navbar .nav > li > a:hover," .
				 "$navbar .navbar-toggle:hover { background-color: $nav_hover; }\n";

			echo "$navbar .text-cont a," .
				 "$navbar .nav > li:hover > a," .
				 "$navbar .nav > li.hover > a," .
				 "$navbar .nav > li > a:hover," .
				 "$navbar .nav > li.active > a { color: $nav_bg_light_accent; } \n";

			echo "$navbar .nav > .active > a:before { background-color: $nav_bg_light_accent; }\n";

			if ( $nav_bg_dark_accent !== $nav_bg_light_accent ) {
				echo "$navbar_dark .text-cont a," .
					 "$navbar_dark .nav > li:hover > a," .
					 "$navbar_dark .nav > li.hover > a," .
					 "$navbar_dark .nav > li > a:hover," .
					 "$navbar_dark .nav > li.active > a { color: $nav_bg_dark_accent; } \n";

				echo "$navbar_dark .nav > .active > a:before { background-color: $nav_bg_dark_accent; }\n";
			}

			// Border Color

			echo "$navbar," .
				 "$navbar .nav > li," .
				 "$navbar .nav > li > a," .
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

			echo "$navbar .sub-menu li > a," .
				 "$navbar .sub-menu input," .
				 "$navbar .search-form button { color: $nav_menu_text; }\n";

			echo "$navbar .sub-menu ::-webkit-input-placeholder { color: $nav_menu_text; }\n";
			echo "$navbar .sub-menu ::-moz-placeholder { color: $nav_menu_text; }\n";

			echo "$navbar .sub-menu li.hover > a," .
				 "$navbar .sub-menu li > a:hover," .
				 "$navbar .nav-search .btn { background-color: $nav_menu_hover; }\n";

			echo "$navbar .sub-menu li.hover > a," .
				 "$navbar .sub-menu li > a:hover," .
				 "$navbar .sub-menu .active > a," .
				 "$navbar .sub-menu .active > a:hover { color: $nav_menu_accent; }\n";

			echo "$navbar .sub-menu," .
				 "$navbar .sub-menu > li," .
				 "$navbar .sub-menu > li > a," .
				 "$navbar .nav-search button { border-color: $nav_menu_border; $nav_menu_border_rgba }\n";

			echo "$navbar .mega-menu-column > a { background-color: $nav_menu_hover; }\n";

			// Divider

			echo "$navbar li.divider { background-color: $nav_bg_light_text; }\n";
			echo "$navbar_dark li.divider { background-color: $nav_bg_dark_text; }\n";

			// Navbar Toggle

			echo "$navbar .navbar-toggle .icon-bar { background-color: $nav_bg_light_text; }\n";
			echo "$navbar_dark .navbar-toggle .icon-bar { background-color: $nav_bg_dark_text; }\n";

			// Mobile Styling

			$nav_media_mars = $media_bp('mars');

			echo "@media (max-width: $nav_media_mars) {\n";

				echo "$top_navbar .navbar-inner { background-color: $nav_menu_bg; $nav_menu_bg_rgba }\n";

				echo "$top_navbar .navbar-inner .text-cont," .
					 "$top_navbar .navbar-inner .text-cont a:hover," .
					 "$top_navbar .navbar-inner .text-cont a.no-color," .
					 "$top_navbar .nav > li > a { color: $nav_menu_text; }\n";

				echo "$top_navbar .nav > li:hover > a," .
					 "$top_navbar .nav > li.hover > a," .
					 "$top_navbar .nav > li > a:hover { background-color: $nav_menu_hover; }\n";

				echo "$top_navbar .navbar-inner .text-cont a," .
					 "$top_navbar .nav > li:hover > a," .
					 "$top_navbar .nav > li.hover > a," .
					 "$top_navbar .nav > li > a:hover," .
					 "$top_navbar .nav > li.active > a { color: $nav_menu_accent; } \n";

				echo "$top_navbar .navbar-inner," .
					 "$top_navbar .nav > li," .
					 "$top_navbar .nav > li > a { border-color: $nav_menu_border; $nav_menu_border_rgba }\n";

				echo "$top_navbar .nav li.expand," .
					 "$top_navbar .nav li.expand .sub-menu a:hover { background-color: $nav_menu_expand; }\n";

			echo "}\n";
		}
	}

	unset($nav_themes, $nav_defaults);


	// HEAD MEDIA STYLING

	$hm_options_arr = array(
		'bg' => array(
			'type'    => 'str',
			'return'  => 'value',
			'key'     => 'head-bg-color',
		),
		'text' => array(
			'type'    => 'str',
			'return'  => 'value',
			'key'     => 'head-text-color',
			'default' => $site_text,
		),
		'inv-text' => array(
			'type'    => 'str',
			'return'  => 'value',
			'key'     => 'head-inv-text-color',
			'default' => $site_inv_text,
		),
	);
	$hm_options = mixt_get_options($hm_options_arr);

	$hm_el = '.head-media';
	if ( ! empty($hm_options['bg']) ) {
		$hm_bg = $hm_options['bg'];
		echo "$hm_el { background-color: $hm_bg; }\n";
	}
	if ( $hm_options['text'] != $theme_defaults['text'] ) {
		$hm_text = $hm_options['text'];
		echo "$hm_el .container," .
			 "$hm_el #breadcrumbs li + li:before { color: $hm_text; }\n";
	}
	if ( $hm_options['inv-text'] != $theme_defaults['inv-text'] ) {
		$hm_inv_text = $hm_options['inv-text'];
		echo "$hm_el.bg-dark .container," .
			 "$hm_el.bg-dark .media-inner a," .
			 "$hm_el.bg-dark #breadcrumbs li + li:before { color: $hm_inv_text; }\n";
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
	echo "}\n";

	if ( ! empty($loc_bar_options['text']) ) { echo '#location-bar, #location-bar a:hover, #location-bar li:before { color: ' . $loc_bar_options['text'] . "; }\n"; }

	echo '</style>';

}