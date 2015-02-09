<?php

// Array Of CSS Animations

function mixt_css_anims($type = 'all') {

	$anim_loops = array(
		'bounce'     => 'Bounce',
		'flash'      => 'Flash',
		'flip'       => 'Flip',
		'pulsate'    => 'Pulsate',
		'pulse'      => 'Pulse',
		'rubberBand' => 'Rubber Band',
		'shake'      => 'Shake',
		'swing'      => 'Swing',
		'tada'       => 'Ta-Da!',
		'wobble'     => 'Wobble',
	);

	$anim_trans = array(

		'bounceIn'      => 'Bounce In',
		'bounceInDown'  => 'Bounce In Down',
		'bounceInLeft'  => 'Bounce In Left',
		'bounceInRight' => 'Bounce In Right',
		'bounceInUp'    => 'Bounce In Up',

		'bounceOut'      => 'Bounce Out',
		'bounceOutDown'  => 'Bounce Out Down',
		'bounceOutLeft'  => 'Bounce Out Left',
		'bounceOutRight' => 'Bounce Out Right',
		'bounceOutUp'    => 'Bounce Out Up',

		'fadeIn'         => 'Fade In',
		'fadeInDown'     => 'Fade In Down',
		'fadeInDownBig'  => 'Fade In Down Big',
		'fadeInLeft'     => 'Fade In Left',
		'fadeInLeftBig'  => 'Fade In Left Big',
		'fadeInRight'    => 'Fade In Right',
		'fadeInRightBig' => 'Fade In Right Big',
		'fadeInUp'       => 'Fade In Up',
		'fadeInUpBig'    => 'Fade In Up Big',

		'fadeOut'         => 'Fade Out',
		'fadeOutDown'     => 'Fade Out Down',
		'fadeOutDownBig'  => 'Fade Out Down Big',
		'fadeOutLeft'     => 'Fade Out Left',
		'fadeOutLeftBig'  => 'Fade Out Left Big',
		'fadeOutRight'    => 'Fade Out Right',
		'fadeOutRightBig' => 'Fade Out Right Big',
		'fadeOutUp'       => 'Fade Out Up',
		'fadeOutUpBig'    => 'Fade Out Up Big',

		'flipInX'  => 'Flip In X',
		'flipInY'  => 'Flip In Y',
		'flipOutX' => 'Flip Out X',
		'flipOutY' => 'Flip Out Y',

		'lightSpeedIn'  => 'Light Speed In',
		'lightSpeedOut' => 'Light Speed Out',

		'rotateIn'          => 'Rotate In',
		'rotateInDownLeft'  => 'Rotate In Down Left',
		'rotateInDownRight' => 'Rotate In Down Right',
		'rotateInUpLeft'    => 'Rotate In Up Left',
		'rotateInUpRight'   => 'Rotate In Up Right',

		'rotateOut'          => 'Rotate Out',
		'rotateOutDownLeft'  => 'Rotate Out Down Left',
		'rotateOutDownRight' => 'Rotate Out Down Right',
		'rotateOutUpLeft'    => 'Rotate Out Up Left',
		'rotateOutUpRight'   => 'Rotate Out Up Right',

		'hinge'   => 'Hinge',
		'rollIn'  => 'Roll In',
		'rollOut' => 'Roll Out',

		'zoomIn'      => 'Zoom In',
		'zoomInDown'  => 'Zoom In Down',
		'zoomInLeft'  => 'Zoom In Left',
		'zoomInRight' => 'Zoom In Right',
		'zoomInUp'    => 'Zoom In Up',

		'zoomOut'      => 'Zoom Out',
		'zoomOutDown'  => 'Zoom Out Down',
		'zoomOutLeft'  => 'Zoom Out Left',
		'zoomOutRight' => 'Zoom Out Right',
		'zoomOutUp'    => 'Zoom Out Up',

		'slideInDown'  => 'Slide In',
		'slideInLeft'  => 'Slide In Left',
		'slideInRight' => 'Slide In Right',
		'slideInUp'    => 'Slide In Up',

		'slideOutDown'  => 'Slide Out',
		'slideOutLeft'  => 'Slide Out Left',
		'slideOutRight' => 'Slide Out Right',
		'slideOutUp'    => 'Slide Out Up',
	);

	if ( $type == 'loops' ) {
		$anims = $anim_loops;
	} else if ( $type == 'trans' ) {
		$anims = $anim_trans;
	} else {
		$anims = array_merge($anim_loops, $anim_trans);
	}

	return $anims;
}


// Background Patterns Array

function mixt_bg_pattern_img() {
	
	$bg_patterns_path = MIXT_DIR . '/assets/img/bg-pat/';
	$bg_patterns_url  = MIXT_URI . '/assets/img/bg-pat/';
	$bg_patterns      = array();

	if ( is_dir( $bg_patterns_path ) ) :

		if ( $bg_patterns_dir = opendir( $bg_patterns_path ) ) :

			while ( ( $bg_patterns_file = readdir( $bg_patterns_dir ) ) !== false ) {

				if ( stristr( $bg_patterns_file, '.png' ) !== false || stristr( $bg_patterns_file, '.jpg' ) !== false ) {
					$name              = explode( '.', $bg_patterns_file );
					$name              = str_replace( '.' . end( $name ), '', $bg_patterns_file );
					$bg_patterns[] = array(
						'alt' => $name,
						'img' => $bg_patterns_url . $bg_patterns_file
					);
				}
			}

		endif;

	endif;

	return $bg_patterns;
}

// SOCIAL PROFILE PRESETS

function mixt_preset_social_profiles() {

	$networks = array(
		// Facebook
		'facebook'  => array(
			'name'  => 'Facebook',
			'url'   => 'https://www.facebook.com/',
			'icon'  => 'icon-facebook',
			'color' => '#3b5998',
			'title' => __('Like us on Facebook', 'mixt'),
		),
		// Twitter
		'twitter'  => array(
			'name'  => 'Twitter',
			'url'   => 'https://twitter.com/',
			'icon'  => 'icon-twitter',
			'color' => '#00aced',
			'title' => __('Follow us on Twitter', 'mixt'),
		),
		// Google+
		'google+'  => array(
			'name'  => 'Google+',
			'url'   => 'https://plus.google.com/',
			'icon'  => 'icon-googleplus',
			'color' => '#dd4b39',
			'title' => __('Follow us on Google+', 'mixt'),
		),
		// YouTube
		'youtube'  => array(
			'name'  => 'YouTube',
			'url'   => 'https://www.youtube.com/',
			'icon'  => 'icon-youtube',
			'color' => '#bb0000',
			'title' => __('Subscribe to us on Youtube', 'mixt'),
		),
		// LinkedIn
		'linkedin'  => array(
			'name'  => 'LinkedIn',
			'url'   => 'https://www.linkedin.com/',
			'icon'  => 'icon-linkedin',
			'color' => '#007bb6',
			'title' => __('Connect on LinkedIn', 'mixt'),
		),
		// Instagram
		'instagram'  => array(
			'name'  => 'Instagram',
			'url'   => 'https://instagram.com/',
			'icon'  => 'icon-instagram',
			'color' => '#517fa4',
			'title' => __('Follow us on Instagram', 'mixt'),
		),
		// Pinterest
		'pinterest'  => array(
			'name'  => 'Pinterest',
			'url'   => 'https://www.pinterest.com/',
			'icon'  => 'icon-pinterest',
			'color' => '#cb2027',
			'title' => __('Follow us on Pinterest', 'mixt'),
		),
		// Tumblr
		'tumblr'  => array(
			'name'  => 'Tumblr',
			'url'   => 'https://www.tumblr.com/',
			'icon'  => 'icon-tumblr',
			'color' => '#32506d',
			'title' => __('Follow us on Tumblr', 'mixt'),
		),
	);

	return $networks;
}


// FAVICON FUNCTION

function mixt_favicon_display() {

	$favicons_list = array(
		// Define favicon sizes
		'favicon' => array(
			'16',  // Default
			'32',  // Bigger
			'64',  // Hi-DPI
			'192', // Android Chrome M36+
		),
		'apple-touch-icon' => array(
			'60',  // iPhone
			'76',  // iPad
			'120', // iPhone Retina
			'152', // iPad Retina
		),
	);

	global $mixtConfig, $mixt_opt;

	$favicon_source_id = $favicon_source_url = '';
	$rebuild = false;

	$mixt_img_edit = mixt_img_edit_support();

	if ( is_array( $mixt_opt ) ) {

		// Define favicon paths
		if ( array_key_exists('favicon-img', $mixt_opt) ) {
			$favicon_source_id  = $mixt_opt['favicon-img']['id'];
			$favicon_source_url = $mixt_opt['favicon-img']['url'];
		}

		// Check for rebuild flag
		if ( $mixt_opt['favicon-rebuild'] ) {
			$rebuild = true;
		}
	}

	$favicons_path = MIXT_UPLOAD_PATH . '/favicons';
	$favicons_url  = MIXT_UPLOAD_URL . '/favicons';

	// Create favicon directory if not found
	if ( ! is_dir( $favicons_path ) ) {
		wp_mkdir_p( $favicons_path );
	}

	if ( $rebuild ) {
		$rebuild = true;

		// Delete existing favicons
		$old_icons = glob( $favicons_path . '/*.png' );
		foreach( $old_icons as $icon ) {
			if ( is_file($icon) ) {
				unlink($icon);
			}
		}

		// Empty favicon HTML
		$favicon_html = '';
		$mixtConfig->ReduxFramework->set('favicon-html', $favicon_html);

		// Unset rebuild flag
		$mixtConfig->ReduxFramework->set('favicon-rebuild', false);
	}

	// If a favicon image is selected
	if ( $favicon_source_id !== '' || $favicon_source_url !== '' ) {

		if ( $mixt_img_edit ) {
		// Server has image editing capabilities

			// Check for rebuild flag
			if ( $rebuild ) {

				// BUILD NEW FAVICONS

				// Check if original favicon was copied to favicons directory
				$favicon_dest_path = $favicons_path . '/favicon-original.png';
				if ( ! file_exists($favicon_dest_path) ) {
					copy($favicon_source_url, $favicon_dest_path);
				}

				// Iterate through sizes
				foreach ( $favicons_list as $type => $sizes ) {

					// Get favicon type and use appropriate link rel
					if ( $type == 'apple-touch-icon' ) {
						$attrs    = '';
						$link_rel = 'apple-touch-icon-precomposed';
					} else {
						$attrs    = ' type="image/png"';
						$link_rel = 'icon';
					}

					foreach ( $sizes as $size ) {
						$size_ind  = $size . 'x' . $size;
						$filename  = $type . '-' . $size_ind . '.png';
						$file_path = $favicons_path . '/' . $filename;
						$file_url  = $favicons_url . '/' . $filename;

						$favicon = wp_get_image_editor( $favicon_dest_path );

						if ( ! is_wp_error( $favicon ) ) {
						    $favicon->resize( $size, $size, false );
						    $favicon->save( $file_path );

						    $favicon_html .= '<link rel="' . $link_rel . '"' . $attrs . ' sizes="' . $size_ind .'" href="' . $file_url . '" />' . "\n";
						}
					}
				}

				// Save new HTML and output it
				$mixtConfig->ReduxFramework->set('favicon-html', $favicon_html);

				echo $favicon_html;

			} else {

				// Get saved HTML and output it

				if ( array_key_exists('favicon-html', $mixt_opt) ) {
					$favicon_html = $mixt_opt['favicon-html'];

					if ( ! empty($favicon_html) ) {
						echo $favicon_html;
					}
				}
			}

		} else {
		// Server does NOT have image editing capabilities
			echo '<link rel="shortcut icon" href="' . $favicon_source_url . '" />';
		}
	}
}

// Add Favicons To Admin Head
add_action( 'admin_head', 'mixt_favicon_display' );