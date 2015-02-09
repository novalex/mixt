<?php

/**
 * MIXT Header Elements
 *
 * @package mixt
 */


// PAGE LOADER DISPLAY

function mixt_page_loader() {

	global $mixt_opt;

	$load_set_type = $mixt_opt['page-loader-type'];
	$load_classes  = 'loader ';

	// Loader Animation
	$load_anim = $mixt_opt['page-loader-anim'];

	if ( $load_anim != 'none' && $load_anim != '' ) {
		$load_classes .= 'animated infinite ' . $load_anim . ' ';
	}

	if ( $load_set_type == '1' ) {
	// Loader Shape
		$load_shape = $mixt_opt['page-loader-shape'];

		if ( $load_shape != '' ) {
			$load_classes .= $load_shape;

			$load_elem = '<div class="' . $load_classes . '"></div>';
		}
	} else {
	// Loader Image
		$load_img = $mixt_opt['page-loader-img'];

		if ( is_array($load_img) ) {
			$load_img_url = $mixt_opt['page-loader-img']['url'];

			$load_elem = ( $load_img_url == '' ) ? '' : '<img src="' . $loader_img . '" alt="Loader Image" class="' . $load_classes . '">';
		}
	}

	echo '<div id="load-overlay">';
		echo '<div class="load-inner">';
			echo $load_elem;
		echo '</div>';
	echo '</div>';
	echo '<script type="text/javascript" id="mixt-loading-class">document.body.className += " loading";</script>';
}


// LOGO DISPLAY

function mixt_display_logo() {

	global $mixt_opt;

	$logo_type = 'text';
	$logo_text = get_bloginfo( 'name', 'display' );
	$logo_colors = false;

	$logo_img = $logo_img_inv = $logo_tagline = '';

	if ( isset($mixt_opt) && array_key_exists('logo-type', $mixt_opt) ) {

		// Image Logo
		if ( $mixt_opt['logo-type'] == 'img' && $mixt_opt['logo-img']['url'] != '' ) {
			$logo_type = 'img';
			$logo_img  = $mixt_opt['logo-img']['url'];

			if ( $mixt_opt['logo-img-inv']['url'] != '' ) {
				$logo_img_inv = $mixt_opt['logo-img-inv']['url'];

				if ( $logo_img_inv != '') {
					$logo_colors = true;
				}
			}
		} else {
		// Text Logo
			if ( $mixt_opt['logo-text'] != '' ) {
				$logo_text = $mixt_opt['logo-text'];
			}

			if ( $mixt_opt['logo-text-inv'] != '' ) {
				$logo_colors = true;
			}
		}

		// Tagline
		if ( $mixt_opt['logo-show-tagline'] ) {
			if ( $mixt_opt['logo-tagline'] != '' ) {
				$logo_tagline = $mixt_opt['logo-tagline'];
			} else {
				$logo_tagline = get_bloginfo( 'description', 'display' );
			}
		}
	}

	// Output Logo

	if ( $logo_type == 'img' ) {
		if ( $logo_colors ) {
			echo '<img class="logo-img logo-light" src="' . $logo_img . '" alt="' . $logo_text . ' Logo">';
			echo '<img class="logo-img logo-dark" src="' . $logo_img_inv . '" alt="' . $logo_text . ' Logo">';
		} else {
			echo '<img class="logo-img" src="' . $logo_img . '" alt="' . $logo_text . ' Logo">';
		}
	} else {
		if ( $logo_colors ) {
			echo '<strong class="logo-light">' . $logo_text . '</strong>';
			echo '<strong class="logo-dark">' . $logo_text . '</strong>';
		} else {
			echo '<strong>' . $logo_text . '</strong>';
		}
	}

	// Output Tagline

	if ( $logo_tagline != '' ) {
		echo '<small>' . $logo_tagline . '</small>';
	}
}

// SECONDARY NAVBAR

function mixt_nav_second() {

	global $mixt_opt;

	$left_el = $left_el_classes = $right_el = $right_el_classes = '';

	$navbar_classes = 'bordered ';

	// Navbar Scheme
	$navbar_classes .= ( $mixt_opt['sec-nav-scheme'] == false ) ? 'navbar-inverse ' : 'navbar-default ';
	// Submenu Scheme
	$navbar_classes .= ( $mixt_opt['sec-nav-sub-scheme'] == false ) ? 'dark-subs ' : 'light-subs ';


	function wrap_code($code) {
		return '<div class="code-inner text-cont">' . $code . '</div>';
	}


	// Left Side Content

	$left_el_content = $mixt_opt['sec-nav-left-content'];

	if ( $left_el_content == '1' ) {
	// Content: Navigation

		$left_el_nav = wp_nav_menu(
			array(
				'theme_location'  => 'sec_navbar_left',
				'container_class' => 'navbar-inner',
				'menu_class'      => 'nav navbar-nav',
				'fallback_cb'     => '__return_false',
				'echo'            => false,
				'menu_id'         => 'sec-navbar-menu-left',
				'walker'          => new mixt_navwalker()
			)
		);
		if ( ! empty($left_el_nav) ) {
			$left_el = $left_el_nav;
		} else {
			$left_el = mixt_no_menu_msg(false);
		}

	} else if ( $left_el_content == '2' ) {
	// Content: Social Icons

		$left_el = mixt_social_profiles(false);

	} else if ( $left_el_content == '3' ) {
	// Content: Text / Code

		$left_el_classes = 'content-code';

		$left_el = wrap_code($mixt_opt['sec-nav-left-code']);
	}


	// Right Side Content

	$right_el_content = $mixt_opt['sec-nav-right-content'];

	if ( $right_el_content == '1' ) {
	// Content: Navigation

		$right_el_nav = wp_nav_menu(
			array(
				'theme_location'  => 'sec_navbar_right',
				'container_class' => 'navbar-inner',
				'menu_class'      => 'nav navbar-nav',
				'fallback_cb'     => '__return_false',
				'echo'            => false,
				'menu_id'         => 'sec-navbar-menu-right',
				'walker'          => new mixt_navwalker()
			)
		);
		if ( ! empty($right_el_nav) ) {
			$right_el = $right_el_nav;
		} else {
			$right_el = mixt_no_menu_msg(false);
		}

	} else if ( $right_el_content == '2' ) {
	// Content: Social Icons

		$right_el = mixt_social_profiles(false);

	} else if ( $right_el_content == '3' ) {
	// Content: Text / Code

		$right_el_classes = 'content-code';

		$right_el = wrap_code($mixt_opt['sec-nav-right-code']);
	}

// Output

if ( $left_el != '' || $right_el != '' ) :

echo <<<EOT
<nav class="second-nav navbar $navbar_classes">
	<div class="container">
		<div class="left $left_el_classes">
			$left_el
		</div>
		<div class="right $right_el_classes">
			$right_el
		</div>
	</div>
</nav>
EOT;

endif;

}

// HEAD MEDIA

function mixt_head_media() {

	$page_ID = get_queried_object_id();

	$head_media_type = mixt_meta('_mixt-head-media-type');
	$head_media_classes = 'head-media';

	$media_bg = $media_slider = $media_html = '';

	// Slider Media
	if ( $head_media_type == 'slider' ) {
		$head_slider_id = '"' . mixt_meta('_mixt-head-slider') . '"';
		$head_media_classes .= ' media-slider';
		if ( 1 > 0 ) {
			$media_slider = do_shortcode("[layerslider id=$head_slider_id]");
		}
	} else {
		$media_cont_classes = '';

		// Image Background

		if ( $head_media_type == 'image' ) {

			$img_attrs = '';
			$head_media_classes .= ' media-image';

			// Get image ID and URL
			$head_img_src = mixt_meta('_mixt-head-img-src');
			if ( $head_img_src == 'feat' ) {
				$img_id = get_post_thumbnail_id( $page_ID );
				$img_url = wp_get_attachment_url( $img_id );
			} else {
				$img_id = mixt_meta('_mixt-head-img_id');
				$img_url = mixt_meta('_mixt-head-img');
			}

			// If no image is selected, use placeholder
			if ( $img_id == '' || $img_url == '' ) {
				$img_url = MIXT_URI . '/assets/img/misc-pat/placeholder.jpg';
				$img_color = 'dark';
				$img_pattern = 'true';
			} else {
				$img_color = mixt_meta( '_image_color', $img_id );
				$img_pattern = mixt_meta('_mixt-head-img-repeat');
				$img_metadata = wp_get_attachment_metadata( $img_id );
			}

			// Change text color based on image predominant color
			if ( $img_color == 'dark' ) {
				$head_media_classes .= ' text-light';
			} else {
				$head_media_classes .= ' text-dark';
			}

			// Pattern image
			if ( $img_pattern == 'true' ) {
				$media_cont_classes .= 'pattern ';
			} else {
				$img_width = $img_metadata['width'];
				$img_height = $img_metadata['height'];

				if ( $img_width > $img_height ) {
					$media_cont_classes .= 'img-wide ';
				} else {
					$media_cont_classes .= 'img-tall ';
				}

				$img_attrs .= 'data-stellar-background-ratio="0.5"';
			}

			// Output image media element
			$media_bg = sprintf('<div class="media-container parallax %1$s" %3$s style="background-image: url(%2$s);"></div>',
				$media_cont_classes,
				$img_url,
				$img_attrs
			);
		}

		// Video Background

		else if ( $head_media_type == 'video') {
			// Output image media element
			$media_bg = sprintf(
				'<video autoplay loop id="bgvid" class="media-container %1$s" poster="http://192.168.0.103/wp/wp-content/themes/mixt/assets/videos/bokeh-motion-poster.jpg">
					<source src="http://192.168.0.103/wp/wp-content/themes/mixt/assets/videos/road-timelapse.webm" type="video/webm">
					<source src="http://192.168.0.103/wp/wp-content/themes/mixt/assets/videos/road-timelapse.mp4" type="video/mp4">
				</video>',
				$media_cont_classes
			);
		}

		// Solid Color Background

		else if ( $head_media_type == 'color' ) {
			$head_media_classes .= ' head-color';

			$head_color = mixt_meta('_mixt-head-color');

			if ( $head_color == '' ) {
				$head_color = '#eeeeee';
			}

			$color_light = hex_is_light($head_color);

			if ( $color_light ) {
				$head_media_classes .= ' text-dark';
			} else {
				$head_media_classes .= ' text-light';
			}

			// Output image media element
			$media_bg = sprintf('<div class="media-container %1$s" style="background-color: %2$s;"></div>',
				$media_cont_classes,
				$head_color
			);
		}

		// Header Content (post meta, custom text & code)
		$media_content = '';
		$head_content_code = mixt_meta('_mixt-head-content-code');
		$head_content_info = mixt_meta('_mixt-head-content-info');

		$head_code = mixt_meta('_mixt-head-code');
		if ( $head_content_code == 'true' && $head_code != '' ) {
			$head_media_classes .= ' media-text';
			$media_content .= do_shortcode($head_code);
		}

		if ( $head_content_info == 'true' ) {
			$info_title = sprintf('<h1 class="page-title">%s</h1>', get_the_title() );
			$info_meta  = '<div class="entry-meta">' . mixt_posted_on( false ) . '</div>';
			$media_content .= $info_title . $info_meta;
		}

		if ( $head_content_code == 'true' || $head_content_info == 'true' ) {
			$media_html = sprintf('<div class="container"><div class="media-inner parallax" data-stellar-ratio="0.5">%s</div></div>', $media_content);
		}
	}

// Output

echo <<<EOT
<div class="$head_media_classes">
	$media_bg
	$media_slider
	$media_html
</div>
EOT;

}