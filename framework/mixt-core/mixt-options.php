<?php

/* ------------------------------------------------ /
MIXT OPTIONS FRAMEWORK
/ ------------------------------------------------ */

/**
 * Get options to set up part of the site
 */
function mixt_get_options($part) {

	global $mixt_opt;

	$options = array();

	$mixt_options = array(

		'page' => array(
			'page-loader' => array(
				'true' => '1',
			),
			'sidebar' => array(
				'key'  => 'page-sidebar',
			),
			'fullwidth' => array(
				'key'    => 'page-fullwidth',
				'return' => array(
					'true'  => 'fullwidth ',
				),
			),
		),

		'header' => array(
			'head-media' => array(
				'return' => 'isset',
			),
			'head-full-height' => array(
				'return' => array(
					'true' => 'full-height ',
				),
			),
		),

		'navbar' => array(
			'nav-mode' => array(
				'return' => array(
					'fixed'  => 'sticky ',
				),
			),
			'nav-theme' => array(
				'type'   => 'str',
				'return' => 'value',
				'prefix' => 'theme-',
				'suffix' => ' ',
			),
			'logo-align' => array(
				'return' => array(
					'1' => 'logo-left ',
					'2' => 'logo-center ',
					'3' => 'logo-right ',
				),
			),
			'sub-scheme' => array(
				'key'    => 'nav-sub-scheme',
				'return' => array(
					'light' => 'light-subs ',
					'dark'  => 'dark-subs ',
				),
			),
			'nav-transparent' => array(
				'return' => array(
					'true'  => 'nav-transparent ',
				),
			),
			'nav-position' => array(
				'return' => array(
					'below' => array(
						'value' => 'below',
						'class' => 'nav-below-header ',
					),
					'default' => array(
						'value' => 'above',
						'class' => '',
					),
				),
			),
		),
	);

	if ( isset($mixt_options[$part]) ) {
		$setup_opt = $mixt_options[$part];

		foreach ( $setup_opt as $k => $option ) {
			$key    = isset($option['key']) ? $option['key'] : $k;
			$type   = isset($option['type']) ? $option['type'] : 'bool';
			$true   = isset($option['true']) ? $option['true'] : 'true';
			$false  = isset($option['false']) ? $option['false'] : 'false';
			$return = isset($option['return']) ? $option['return'] : 'bool';
			$prefix = isset($option['prefix']) ? $option['prefix'] : '';
			$suffix = isset($option['suffix']) ? $option['suffix'] : '';

			$meta_key = '_mixt-' . $key;

			$page_value   = mixt_meta($meta_key);
			$global_value = isset( $mixt_opt[$key] ) ? $mixt_opt[$key] : '';

			if ( $page_value != '' && $page_value != 'auto' ) {
				$option_value = $page_value;
			} else {
				$option_value = $global_value;
			}

			if ( $return == 'bool' || $return == 'isset' ) {
				if ( $option_value == $true ) {
					$options[$k] = 'true';
				} else {
					if ( $return == 'isset' ) {
						$options[$k] = null;
					} else {
						$options[$k] = 'false';
					}
				}

			} else if ( $return == 'value' ) {
				$options[$k] = ( is_array($option_value) ) ? $option_value : $prefix . $option_value . $suffix;

			} else if ( is_array($return) ) {
				if ( isset($return[$option_value]) ) {
					$options[$k] = $return[$option_value];
				} else if ( isset($return['default']) ) {
					$options[$k] = $return['default'];
				} else {
					$options[$k] = '';
				}
			}

		}
	}

	return $options;
}

// 	$head_media = mixt_meta('mixt_head_media');
// 	$nav_position = mixt_meta('mixt_nav_position');
// 	$head_full = mixt_meta('mixt_head_full_height');

// 	// Main wrapper classes
// 	$wrap_classes = "$page_fullwidth $page_header";
// 	if ( $head_media ) {
// 		$wrap_classes .= 'has-head-media ';
// 	}
// 	if ( $head_full == 'true' ) {
// 		$wrap_classes .= 'head-media-full ';
// 	}
// 	if ( strlen($navbar_theme) > 3 ) {
// 		$wrap_classes .= $navbar_theme . ' ';
// 	}
// 	if ( strlen($navbar_tsp) > 3 ) {
// 		$wrap_classes .= $navbar_tsp . ' ';
// 	}
// 	if ( $nav_position == 'below' ) {
// 		$wrap_classes .= 'nav-below-header ';
// 	}



// 	// Navbar settings
// 	$navbar_sticky = false;
// 	$navbar_sticky_global = $mixt_opt['nav-mode'];
// 	$navbar_sticky_page = mixt_meta('mixt_nav_mode');
// 	if ( $navbar_sticky_page == 'true' || $navbar_sticky_page != 'false' && $navbar_sticky_global != 0 ) {
// 		$navbar_sticky = true;
// 	}
	
// 	$navbar_scheme_global = $mixt_opt['nav-scheme'];
// 	$navbar_scheme_page = mixt_meta('mixt_nav_scheme');
// 	$navbar_scheme = 'navbar-default ';
// 	if ( $navbar_scheme_page == 'dark' || $navbar_scheme_page != 'light' && $navbar_scheme_global == 0 ) {
// 		$navbar_scheme = 'navbar-inverse ';
// 	}

// 	$nav_theme = $mixt_opt['nav-theme'];
// 	if ( strlen($nav_theme) < 3 ) {
// 		$nav_theme = 'theme-' . $nav_theme . ' ';
// 	}

// 	$navbar_sub_scheme = 'light-subs ';
// 	$navbar_sub_scheme_global = $mixt_opt['nav-sub-scheme'];
// 	$navbar_sub_scheme_page = mixt_meta('mixt_nav_sub_scheme');
// 	if ( $navbar_sub_scheme_page == 'dark' || $navbar_sub_scheme_page != 'light' && $navbar_sub_scheme_global == 0 ) {
// 		$navbar_sub_scheme = 'dark-subs ';
// 	}

// 	// Navbar classes
// 	$navbar_classes = 'position-top ';
// 	$navbar_classes .= "$navbar_scheme $nav_theme $navbar_sub_scheme";
// 	if ( $navbar_sticky ) {
// 		$navbar_classes .= ' sticky';
// 	}
// );

// $has_sidebar = mixt_meta('mixt_page_sidebar');

// // Header & global page settings
// $navbar_theme = '';
// $fullwidth_class = (mixt_meta('mixt_page_fullwidth') == 'true' ? 'fullwidth' : '');
// $navbar_tsp = (mixt_meta('mixt_nav_tsp') == 'true' ? 'nav-transparent' : '');

// $head_media = mixt_meta('mixt_head_media');
// $nav_position = mixt_meta('mixt_nav_position');
// $head_full = mixt_meta('mixt_head_full_height');

// // Main wrapper classes
// $wrap_classes = '';
// if ( strlen($fullwidth_class) > 3 ) {
// 	$wrap_classes .= $fullwidth_class . ' ';
// }
// if ( $head_media == 'true' ) {
// 	$wrap_classes .= 'has-head-media ';
// }
// if ( $head_full == 'true' ) {
// 	$wrap_classes .= 'head-media-full ';
// }
// if ( strlen($navbar_tsp) > 3 ) {
// 	$wrap_classes .= $navbar_tsp . ' ';
// }
// if ( $nav_position == 'below' ) {
// 	$wrap_classes .= 'nav-below-header ';
// }

// // Logo alignment
// $logo_align_opt = $mixt_opt['logo-align'];
// if ( $logo_align_opt == 2 ) {
// 	$logo_align = 'logo-center';
// }
// elseif ( $logo_align_opt == 3 ) {
// 	$logo_align = 'logo-right';
// }
// else {
// 	$logo_align = 'logo-left';
// }

// // Navbar wrap classes
// $navbar_wrap_classes = $logo_align . ' ' . $navbar_theme;

// // Navbar settings
// $navbar_sticky = false;
// $navbar_sticky_global = $mixt_opt['nav-mode'];
// $navbar_sticky_page = mixt_meta('mixt_nav_mode');
// if ( $navbar_sticky_page == 'true' || $navbar_sticky_page != 'false' && $navbar_sticky_global != 0 ) {
// 	$navbar_sticky = true;
// }

// $navbar_scheme_global = $mixt_opt['nav-scheme'];
// $navbar_scheme_page = mixt_meta('mixt_nav_scheme');
// $navbar_scheme = 'navbar-default ';
// if ( $navbar_scheme_page == 'dark' || $navbar_scheme_page != 'light' && $navbar_scheme_global == 0 ) {
// 	$navbar_scheme = 'navbar-inverse ';
// }

// $nav_theme = $mixt_opt['nav-theme'];
// if ( strlen($nav_theme) < 3 ) {
// 	$nav_theme = 'theme-' . $nav_theme . ' ';
// }

// $navbar_sub_scheme = 'light-subs ';
// $navbar_sub_scheme_global = $mixt_opt['nav-sub-scheme'];
// $navbar_sub_scheme_page = mixt_meta('mixt_nav_sub_scheme');
// if ( $navbar_sub_scheme_page == 'dark' || $navbar_sub_scheme_page != 'light' && $navbar_sub_scheme_global == 0 ) {
// 	$navbar_sub_scheme = 'dark-subs ';
// }

// // Navbar classes
// $navbar_classes = 'position-top ';
// $navbar_classes .= "$navbar_scheme $nav_theme $navbar_sub_scheme";
// if ( $navbar_sticky ) {
// 	$navbar_classes .= ' sticky';
// }
