<?php


require_once( MIXT_FRAME_DIR . '/libs/Color.php' );

use Mexitek\PHPColors\Color;

// MIXT HEADER STYLE GENERATOR

function mixt_print_css() {

	global $mixt_opt;

	if ( ! is_array($mixt_opt) ) {
		return;
	}

	echo '<style type="text/css">';


	// PAGE LOADER

	$page_loader_bg    = $mixt_opt['page-loader-bg'];
	$page_loader_color = $mixt_opt['page-loader-color'];

	if ( $page_loader_bg != '' ) {
		echo "#load-overlay { background-color: $page_loader_bg; }\n";
	}

	if ( $page_loader_color != '' ) {
		echo "#load-overlay .ring, #load-overlay .square2 { border-color: $page_loader_color; }\n";
		echo "#load-overlay .circle, #load-overlay .square { background-color: $page_loader_color; }\n";
	}


	// NAVBAR THEMES

	$navbar_themes = $mixt_opt['nav-themes'];

	foreach ( $navbar_themes as $theme_id => $theme ) {
		if ( strlen($theme_id) < 3 ) {
			$theme_id = 'theme-' . $theme_id;
		}

		$navbar = '.navbar-mixt.' . $theme_id;
		$nav_bg = $theme['bg-color'];
		$nav_accent = $theme['accent'];
		$nav_text_color = $theme['text-color'];
		$nav_text_active = $theme['text-active-color'];

		$nav_bg_ob = new Color($nav_bg);
		$nav_text_ob = new Color($nav_text_color);
		$nav_text_hover_ob = new Color($nav_text_active);

		echo $navbar . " { background-color: $nav_bg; }\n";

		$navbar_hover = "$navbar .nav>li:hover>a," .
						"$navbar.text-dark.position-top .nav>li:hover>a," .
						"$navbar .nav>li:hover>a:hover," .
						"$navbar.text-dark.position-top .nav>li:hover>a:hover," .
						"$navbar .nav>li:hover>a:focus," .
						"$navbar.text-dark.position-top .nav>li:hover>a:focus";
		echo $navbar_hover . " { color: $nav_text_active !important; }\n";

		$navbar_accents = "$navbar .nav>.active>a:before," .
						  "$navbar.text-dark.position-top .nav>.active>a:before," .
						  "$navbar .nav>.current-menu-parent>a:before," .
						  "$navbar.text-dark.position-top .nav>.current-menu-parent>a:before";
		echo $navbar_accents . " { background-color: $nav_accent; box-shadow: 0 1px 0 $nav_accent; }\n";

		$navbar_active = "$navbar .nav>.active>a," .
						 "$navbar.text-dark.position-top .nav>.active>a," .
						 "$navbar .nav>.active>a:hover," .
						 "$navbar.text-dark.position-top .nav>.active>a:hover," .
						 "$navbar .nav>.active>a:focus," .
						 "$navbar.text-dark.position-top .nav>.active>a:focus";
		echo $navbar_active . " { color: $nav_text_active; }\n";

		if ( $nav_bg_ob->isLight() ) {
			$sh_color = $nav_bg_ob->lighten(10);
			$nav_text_sh = "text-shadow: 0 1px 0 #$sh_color";
		} else {
			$sh_color = $nav_bg_ob->darken(10);
			$nav_text_sh = "text-shadow: 0 1px 1px #$sh_color";
		}

		echo "@media (min-width: 767px) {\n";
			$navbar_text = "$navbar .nav>li>a, $navbar .no-menu-msg";
			echo $navbar_text . " { color: $nav_text_color; $nav_text_sh; }\n";
		echo "}\n";
	}

	unset($navbar_themes);


	// LOGO STYLES

	if ( $mixt_opt['logo-type'] == 'text' ) {

		// TEXT LOGO

		$typo_opts      = $mixt_opt['logo-text-typo'];

		$color          = $typo_opts['color'];
		$font_size      = $typo_opts['font-size'];
		$font_weight    = $typo_opts['font-weight'];
		$font_family    = $typo_opts['font-family'];
		$font_backup    = $typo_opts['font-backup'];
		$text_transform = $typo_opts['text-transform'];

		echo '#nav-logo strong {';
			if ( $color != '' ) {
				echo 'color:' . $color . ';';
			}
			echo 'font-size:' . $font_size . ';';
			echo 'font-weight:' . $font_weight . ';';
			echo 'font-family:' . $font_family . ', ' . $font_backup . ';';
			if ( $text_transform != '' ) {
				echo 'text-transform:' . $text_transform . ';';
			}
		echo '}';

		if ( $mixt_opt['logo-text-inv'] != '' ) {
			echo '#nav-logo .logo-dark { color:' . $mixt_opt['logo-text-inv'] . '; }';
		}

		if ( $mixt_opt['logo-shrink'] != '0' ) {
			$shrink_amount = $mixt_opt['logo-shrink'];
			$shrink_size   = intval($font_size) - $shrink_amount . 'px';

			echo '.fixed-nav #nav-logo strong { font-size:' . $shrink_size . '; }';
		}
	} else {

		// IMAGE LOGO

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

	echo '</style>';

}