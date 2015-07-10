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
			'type'    => 'str',
			'key'     => 'head-media-type',
			'return'  => 'value',
			'default' => 'color',
		),
		'height' => array(
			'type'   => 'str',
			'key'    => 'head-height',
			'return' => 'value',
		),
		// Header Colors
		'bg' => array(
			'type'    => 'str',
			'key'     => 'head-bg-color',
			'return'  => 'value',
			'default' => '#ebf0f4',
		),
		// Slider
		'slider' => array(
			'type'   => 'str',
			'key'    => 'head-slider',
			'return' => 'value',
		),
		// Image
		'img-src' => array(
			'type'   => 'str',
			'key'    => 'head-img-src',
			'return' => 'value',
		),
		'img' => array(
			'type'   => 'str',
			'key'    => 'head-img',
			'return' => 'value',
		),
		'img-ph' => array(
			'type'   => 'str',
			'key'    => 'head-img-ph',
			'return' => 'value',
		),
		'img-repeat' => array( 'key' => 'head-img-repeat' ),
		'parallax' => array( 'key' => 'head-img-parallax' ),
		// Video
		'video-src' => array(
			'type'   => 'str',
			'key'    => 'head-video-src',
			'return' => 'value',
		),
		'video-embed' => array(
			'type'   => 'str',
			'key'    => 'head-video-embed',
			'return' => 'value',
		),
		'video' => array(
			'type'   => 'str',
			'key'    => 'head-video',
			'return' => 'value',
		),
		'video-2' => array(
			'type'   => 'str',
			'key'    => 'head-video-2',
			'return' => 'value',
		),
		'video-poster' => array(
			'type'   => 'str',
			'key'    => 'head-video-poster',
			'return' => 'value',
		),
		'video-lum' => array(
			'key'     => 'head-video-lum',
			'default' => 'true',
		),
		'video-loop' => array( 'key' => 'head-video-loop' ),
		// Content
		'content-size' => array(
			'type'    => 'str',
			'key'     => 'head-content-size',
			'return'  => 'value',
		),
		'content-fade' => array( 'key' => 'head-content-fade' ),
		'align' => array(
			'type'    => 'str',
			'key'     => 'head-content-align',
			'return'  => 'value',
			'default' => 'left',
		),
		'scroll-icon' => array(
			'type'    => 'str',
			'key'     => 'head-content-scroll-icon',
			'return'  => 'value',
			'default' => 'fa fa-chevron-down',
		),
		'info' => array( 'key' => 'head-content-info' ),
		'code' => array( 'key' => 'head-content-code' ),
		'code-content' => array(
			'type'   => 'str',
			'key'    => 'head-code',
			'return' => 'value',
		),
	) );

	$wrap_classes = 'head-media';

	if ( MIXT::get('header', 'fullscreen') ) { $wrap_classes .= ' fullscreen'; }

	$media_bg = $slider = $media_cont_classes = '';

	// Slider Media

	if ( $options['type'] == 'slider' && ! empty($options['slider']) ) {
		$wrap_classes .= ' media-slider';
		$slider_id = intval(trim($options['slider'], '"'));

		if ( class_exists('LS_Sliders') ) {
			if ( is_array(LS_Sliders::find($slider_id) ) ) {
				$slider = do_shortcode('[layerslider id="' . $slider_id . '"]');

				// Adjust transparent navbar text color depending on slide luminosity ?>
				<script type="text/javascript" id="mixt-slider-bg">
					var navbar = jQuery('#main-nav'),
						header = jQuery('.head-media');
					function lsBgLum(data) {
						if ( jQuery('#main-wrap').hasClass('nav-transparent') ) {
							if ( jQuery(data["nextLayer"]["selector"]).children(".slide-bg-dark").length ) {
								header.addClass('bg-dark');
								navbar.removeClass("slide-bg-light").addClass("slide-bg-dark");
								if ( navbar.hasClass('position-top') ) { navbar.addClass('bg-dark'); }
							} else {
								header.removeClass('bg-dark');
								navbar.addClass("slide-bg-light").removeClass("slide-bg-dark");
								if ( navbar.hasClass('position-top') ) { navbar.removeClass('bg-dark'); }
							}
						}
					}
				</script><?php
			// Show Slider Not Found Message
			} else { $slider = '<p class="media-not-found">' . __( 'Slider with specified ID not found!', 'mixt' ) . '</p>'; }
		// Show LayerSlider Deactivated Message
		} else { $slider = '<p class="media-not-found">' . __( 'LayerSlider plugin not installed or deactivated!', 'mixt' ) . '</p>'; }

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

			if ( $img_id != '' && $img_url != '' ) {
				$img_response = wp_remote_head( $img_url );
			}

			// If image was deleted or none was selected, use placeholder
			if ( ! empty($img_response) && is_array($img_response) && $img_response['response']['code'] == '200' ) {
				$img_color  = mixt_meta( '_image_color', $img_id );
				$img_repeat = $options['img-repeat'];
				$img_meta   = wp_get_attachment_metadata( $img_id );
				$img_width  = $img_meta['width'];
				$img_height = $img_meta['height'];
			} else {
				$img_repeat = true;
				if ( ! empty($options['img-ph']['url']) ) {
					$img_url   = $options['img-ph']['url'];
					$img_color = mixt_meta( '_image_color', $options['img-ph']['id'] );
				} else {
					$img_color  = 'dark';
					$img_url    = MIXT_URI . '/assets/img/patterns/placeholder.jpg';
				}
			}

			if ( $img_color == 'dark' ) { $wrap_classes .= ' bg-dark'; }

			// Add pattern or image proportion class
			if ( $img_repeat ) {
				$media_cont_classes .= ' pattern';
			} else {
				if ( $img_width > $img_height ) { $media_cont_classes .= ' img-wide'; }
				else { $media_cont_classes .= ' img-tall'; }
			}

			// Parallax
			if ( $options['parallax'] ) {
				$media_cont_classes .= ' has-parallax';
				$img_atts .= 'data-top="transform: translate3d(0, 0%, 0);" data-top-bottom="transform: translate3d(0, 25%, 0);" ';
			}

			$media_bg = "<div class='media-container $media_cont_classes' $img_atts style='background-image: url($img_url);'></div>";
		}

		// Video Background

		else if ( $options['type'] == 'video') {
			$wrap_classes .= ' media-video';

			if ( $options['video-lum'] == 'false' ) { $wrap_classes .= ' bg-dark'; }

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
				$media_bg  = "<video autoplay $video_atts class='media-container $media_cont_classes' poster='$poster_url'>$video_el</video>";
			}
		}

		// Solid Color Background

		else if ( $options['type'] == 'color' ) {
			$wrap_classes .= ' head-color';
			if ( hex_is_light($options['bg']) == false ) { $wrap_classes .= ' bg-dark'; }
			$media_bg = "<div class='media-container $media_cont_classes' style='background-color: {$options['bg']};'></div>";
		}
	}

	if ( $options['code'] && ! empty($options['code-content']) ) { $wrap_classes .= ' media-code'; }

	// Load Skrollr.js if parallax or content fade effect is enabled
	if ( ( $options['type'] == 'image' && $options['parallax'] ) || ( ( $options['info'] || $options['code'] ) && $options['content-fade'] ) ) { wp_enqueue_script( 'mixt-skrollr' ); }

// Output

	echo "<header class='$wrap_classes'>";
		echo $media_bg;
		echo $slider;

		// Header Content (Custom Code, Post Info)

		if ( $options['info'] || $options['code'] ) {

			$cont_classes = 'container';
			if ( $options['content-size'] == 'fullwidth' ) $cont_classes .= ' fullwidth';
			else if ( $options['content-size'] == 'cover' ) $cont_classes .= ' fullwidth cover';
			if ( $options['content-fade'] ) $cont_classes .= ' has-parallax';

			echo "<div class='$cont_classes'";
				if ( $options['height'] != '' ) echo " style='height: {$options['height']}px;'";
				if ( $options['content-fade'] ) echo " data-top='opacity: 1; transform: translate3d(0, 0%, 0);' data--200-top-bottom='opacity: 0; transform: translate3d(0, 80%, 0);'";
			echo '>';

				$inner_classes = 'media-inner';
				if ( $options['align'] != 'left' ) { $inner_classes .= ' align-' . $options['align']; }

				echo "<div class='$inner_classes'>";
					echo do_shortcode($options['code-content']);

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

					// Scroll To Content Icon
					if ( MIXT::get('header', 'scroll') ) {
						echo "<span class='header-scroll icon {$options['scroll-icon']}'></span>";
					}
			echo '</div></div>';
		}

	echo '</header>';
}