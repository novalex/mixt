<?php

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access

/**
 * Display Header Media Element
 *
 * @package MIXT
 */
function mixt_head_media() {
	$options = mixt_get_options( array(
		// Media Type
		'type' => array(
			'key'     => 'head-media-type',
			'return'  => 'value',
			'default' => 'color',
		),
		// Header Colors
		'bg' => array(
			'key'     => 'head-bg-color',
			'return'  => 'value',
			'default' => '#fff',
		),
		// Slider
		'slider' => array(
			'type'   => 'str',
			'key'    => 'head-slider',
			'return' => 'value',
		),
		// Image
		'img-src' => array(
			'key'    => 'head-img-src',
			'return' => 'value',
		),
		'img' => array(
			'key'    => 'head-img',
			'return' => 'value',
		),
		'img-ph' => array(
			'key'    => 'head-img-ph',
			'return' => 'value',
		),
		'img-repeat' => array( 'key' => 'head-img-repeat' ),
		// Video
		'video-src' => array(
			'key'    => 'head-video-src',
			'return' => 'value',
		),
		'video-embed' => array(
			'key'    => 'head-video-embed',
			'return' => 'value',
		),
		'video' => array(
			'key'    => 'head-video',
			'return' => 'value',
		),
		'video-2' => array(
			'key'    => 'head-video-2',
			'return' => 'value',
		),
		'video-poster' => array(
			'key'    => 'head-video-poster',
			'return' => 'value',
		),
		'video-lum' => array(
			'key'     => 'head-video-lum',
			'default' => 'light',
			'return'  => 'value',
		),
		'video-loop' => array( 'key' => 'head-video-loop' ),
		// Parallax
		'parallax' => array( 'key' => 'head-parallax', 'return' => 'value' ),
		// Content
		'content-size' => array(
			'key'     => 'head-content-size',
			'return'  => 'value',
		),
		'content-fade' => array( 'key' => 'head-content-fade' ),
		'align' => array(
			'key'     => 'head-content-align',
			'return'  => 'value',
			'default' => 'left',
		),
		'scroll-icon' => array(
			'key'     => 'head-content-scroll-icon',
			'return'  => 'value',
			'default' => 'fa fa-chevron-down',
		),
		'info' => array( 'key' => 'head-content-info' ),
		'code' => array( 'key' => 'head-content-code' ),
		'code-content' => array(
			'key'    => 'head-code',
			'return' => 'value',
		),
	) );

	$wrap_classes = 'head-media';

	if ( Mixt_Options::get('header', 'fullscreen') ) { $wrap_classes .= ' fullscreen'; }
	if ( $options['parallax'] != 'none' ) {
		$wrap_classes .= ' has-parallax parallax-' . $options['parallax'];
	}

	$media_bg = $slider = $media_cont_classes = '';

	// Slider Media

	if ( $options['type'] == 'slider' && ! empty($options['slider']) ) {
		$wrap_classes .= ' media-slider';

		if ( class_exists('LS_Sliders') || class_exists('RevSlider') ) {
			// LayerSlider
			if ( class_exists('LS_Sliders') && is_array(LS_Sliders::find($options['slider']) ) ) {
				$slider = do_shortcode('[layerslider id="' . $options['slider'] . '"]');

				// Adjust transparent navbar text color depending on slide luminosity ?>
				<script type="text/javascript" id="mixt-slider-bg">
					var wrapper = jQuery('#main-wrap'),
						navbar = jQuery('#main-nav'),
						runFn = wrapper.hasClass('nav-transparent');
					function lsBgLum(data) {
						var header = jQuery('.head-media');
						if ( runFn ) {
							if ( jQuery(data['nextLayer']['selector']).children('.slide-bg-dark').length ) {
								header.removeClass('bg-light').addClass('bg-dark');
								navbar.removeClass('slide-bg-light').addClass('slide-bg-dark');
								if ( navbar.hasClass('position-top') ) { navbar.removeClass('bg-light').addClass('bg-dark'); }
							} else if ( jQuery(data['nextLayer']['selector']).children('.slide-bg-light').length ) {
								header.removeClass('bg-dark').addClass('bg-light');
								navbar.addClass('slide-bg-light').removeClass('slide-bg-dark');
								if ( navbar.hasClass('position-top') ) { navbar.removeClass('bg-dark').addClass('bg-light'); }
							} else {
								header.removeClass('bg-light bg-dark');
								navbar.removeClass('slide-bg-light slide-bg-dark');
								if ( navbar.hasClass('position-top') ) { navbar.removeClass('bg-light bg-dark').addClass('bg-' + navbar.attr('data-bg')); }
							}
						}
					}
				</script><?php

			// Slider Revolution
			} else if ( class_exists('RevSlider') ) {
				$wrap_classes .= ( mixt_hex_is_light($options['bg']) ) ? ' bg-light' : ' bg-dark';
				$slider = do_shortcode('[rev_slider alias="' . $options['slider'] . '"]');

			// Show Slider Not Found Message
			} else if ( current_user_can('manage_options') ) {
				$slider = '<p class="container">' . esc_html__( 'Slider with specified ID not found!', 'mixt' ) . '</p>';
			}

		// Show Slider Deactivated Message
		} else if ( current_user_can('manage_options') ) {
			$wrap_classes .= ' no-slider';
			$slider = '<p class="container">' . esc_html__( 'Slider plugin not installed or deactivated!', 'mixt' ) . '</p>';
		}

	} else {

		// Image Background

		if ( $options['type'] == 'image' ) {

			$img_atts = '';
			$wrap_classes .= ' media-image';

			// Get image ID and URL
			if ( $options['img-src'] == 'feat' ) {
				$img_id = get_post_thumbnail_id( get_queried_object_id() );
				$img_url = wp_get_attachment_url( $img_id );
			} else {
				if ( is_array($options['img']) ) {
					$img_id     = $options['img']['id'];
					$img_url    = $options['img']['url'];
					$img_width  = $options['img']['width'];
					$img_height = $options['img']['height'];
				} else {
					$img_id  = mixt_meta('_mixt-head-img_id');
					$img_url = $options['img'];
				}
			}

			// If image is selected, display it. Else, display placeholder
			if ( $img_id != '' && $img_url != '' ) {
				$lumin      = mixt_meta( '_mixt_luminosity', $img_id );
				$img_repeat = $options['img-repeat'];
				$img_meta   = wp_get_attachment_metadata( $img_id );
				$img_width  = $img_meta['width'];
				$img_height = $img_meta['height'];
			} else {
				$img_repeat = true;
				if ( ! empty($options['img-ph']['url']) ) {
					$img_url = $options['img-ph']['url'];
					$lumin   = mixt_meta( '_mixt_luminosity', $options['img-ph']['id'] );
				} else {
					$lumin   = 'dark';
					$img_url = MIXT_IMG_PLACEHOLDER;
				}
			}

			if ( $lumin == 'none' && ! empty($options['bg']) && $options['bg'] != '#' ) {
				$lumin = ( mixt_hex_is_light($options['bg']) ) ? 'light' : 'dark';
			}

			$wrap_classes .= ( $lumin == 'dark' ) ? ' bg-dark' : ' bg-light';

			// Add pattern or image proportion class
			if ( $img_repeat ) {
				$media_cont_classes .= 'pattern';
			} else if ( $img_width > $img_height ) {
				$media_cont_classes .= 'img-wide';
			} else {
				$media_cont_classes .= 'img-tall';
			}

			$media_bg = "<div class='media-container $media_cont_classes' $img_atts style='background-image: url($img_url);'></div>";
		}

		// Video Background

		else if ( $options['type'] == 'video') {
			$wrap_classes .= ' media-video';

			$wrap_classes .= ( $options['video-lum'] == 'dark' ) ? ' bg-dark' : ' bg-light';

			// Embedded Video
			if ( $options['video-src'] == 'embed' && ! empty($options['video-embed']) ) {
				$media_bg = $options['video-embed'];

			// Local Video
			} else {
				$poster_url = $video_el = $video_atts = '';

				// Video Source Element
				$video_url = $options['video'];
				if ( is_array($options['video']) ) { $video_url = $options['video']['url']; }
				if ( ! empty($video_url) ) {
					$video_ext = pathinfo($video_url, PATHINFO_EXTENSION);
					$video_el  = '<source src="' . $video_url . '" type="video/' . $video_ext . '">';
				}

				// Fallback Video Source Element
				$video_url_2 = $options['video-2'];
				if ( is_array($options['video-2']) ) { $video_url_2 = $options['video-2']['url']; }
				if ( ! empty($video_url_2) ) {
					$video_ext_2 = pathinfo($video_url_2, PATHINFO_EXTENSION);
					$video_el .= '<source src="' . $video_url_2 . '" type="video/' . $video_ext_2 . '">';
				}

				// Video Poster
				$poster_url = $options['video-poster'];
				if ( is_array($options['video-poster']) ) {
					$poster_url = $options['video-poster']['url'];
				}

				// Video Loop
				if ( $options['video-loop'] ) { $video_atts .= 'loop '; }
				$media_bg  = "<video autoplay muted preload $video_atts class='media-container $media_cont_classes' poster='$poster_url'>$video_el</video>";
			}
		}

		// Solid Color Background

		else if ( $options['type'] == 'color' ) {
			$wrap_classes .= ' head-color';
			$wrap_classes .= ( mixt_hex_is_light($options['bg']) ) ? ' bg-light' : ' bg-dark';
			$media_bg = "<div class='media-container $media_cont_classes'></div>";
		}
	}

	if ( $options['code'] && ! empty($options['code-content']) ) { $wrap_classes .= ' media-code'; }

	// Load Skrollr.js if parallax or content fade effect is enabled
	if ( $options['parallax'] || ( ( $options['info'] || $options['code'] ) && $options['content-fade'] ) ) {
		wp_enqueue_script( 'mixt-skrollr' );
	}

// Output

	$html = "<header class='$wrap_classes'>";
		$html .= $media_bg;
		$html .= $slider;

		// Header Content (Custom Code, Post Info)

		if ( $options['info'] || $options['code'] ) {
			$cont_classes = 'container';
			
			if ( $options['content-size'] == 'fullwidth' ) $cont_classes .= ' fullwidth';
			else if ( $options['content-size'] == 'cover' ) $cont_classes .= ' fullwidth cover';

			if ( $options['content-fade'] ) { $cont_classes .= ' has-parallax'; }

			ob_start();

			echo "<div class='$cont_classes'>";

				$inner_classes = 'media-inner';
				if ( $options['align'] != 'left' ) { $inner_classes .= ' align-' . $options['align']; }

				echo "<div class='$inner_classes'>";
					echo do_shortcode(mixt_shortcode_unwrap($options['code-content']));

					// Post Info
					if ( $options['info'] ) {
						$page_title = mixt_get_title();

						// Breadcrumbs
						if ( class_exists('Woocommerce') && ( is_woocommerce() || is_cart() || is_checkout() ) ) { woocommerce_breadcrumb(); }
						else if ( function_exists('mixt_breadcrumbs') ) { mixt_breadcrumbs($page_title); }

						// Title
						echo '<h1 class="page-title">' . $page_title . '</h1>';

						// Post Meta
						if ( is_single() ) {
							mixt_post_meta(null);
						}
					}
			echo '</div></div>';

			$html .= ob_get_clean();
		}

		// Scroll To Content Icon
		if ( Mixt_Options::get('header', 'scroll') ) {
			$html .= "<span class='header-scroll icon {$options['scroll-icon']}'></span>";
		}

	$html .= '</header>';

	echo mixt_clean($html, 'strip');
}

/**
 * Generate CSS for the header media element
 */
function mixt_head_media_css() {
	if ( Mixt_Options::get('header', 'enabled') ) {
		$options = mixt_get_options( array(
			'bg' => array( 'key' => 'head-bg-color', 'return' => 'value' ),
			'text' => array( 'key' => 'head-text-color', 'return' => 'value' ),
			'inv-text' => array( 'key' => 'head-inv-text-color', 'return' => 'value' ),
			'min-height' => array( 'key' => 'head-min-height', 'return' => 'value' ),
		) );

		$height = Mixt_Options::get('header', 'height');

		$hm = '.head-media';
		$css = '';
		$hm_styles = '';

		if ( ! empty($options['bg']) ) {
			$hm_styles .= " background-color: {$options['bg']};";
		}
		if ( ! empty($options['text']) ) {
			$hm_light = $hm.'.bg-light';
			$css .= "$hm_light .container, $hm_light .media-inner > a, $hm_light .header-scroll, $hm_light #breadcrumbs > li + li:before { color: {$options['text']} !important; }\n";
		}
		if ( ! empty($options['inv-text']) ) {
			$hm_dark = $hm.'.bg-dark';
			$css .= "$hm_dark .container, $hm_dark .media-inner > a, $hm_dark .header-scroll, $hm_dark #breadcrumbs > li + li:before { color: {$options['inv-text']} !important; }\n";
		}
		if ( is_array($height) && ! empty($height['height']) && $height['units'] == 'px' ) {
			$hm_styles .= " height: {$height['height']};";
		}
		if ( is_array($options['min-height']) && ! empty($options['min-height']['height']) && $options['min-height']['units'] == 'px' ) {
			$hm_styles .= " min-height: {$options['min-height']['height']} !important;";
			$css .= "$hm .container { min-height: {$options['min-height']['height']} !important; }\n";
		}
		if ( $hm_styles != '' ) {
			$css .= "$hm { $hm_styles }\n";
		}

		if ( $css != '' ) Mixt_DCSS::$head_css .= $css;
	}
}
add_action('mixt_options_set', 'mixt_head_media_css');
