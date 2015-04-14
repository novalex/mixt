<?php

/**
 * MIXT Assets
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access

/**
 * Return array of default themes
 *
 * @param str $set which set of themes to return
 */
function mixt_default_themes($set = '') {

	$themes = array(
		'site' => array(
			'aqua' => array(
				'name' => 'Aqua', 'id' => 'aqua',
				'text' => '#333333', 'text-fade' => '#777777',
				'inv-text' => '#ffffff', 'inv-text-fade' => '#dddddd',
				'border' => '#dddddd',
				'accent' => '#539ddd',
				'link'   => '#539ddd',
			),
			'lava' => array(
				'name' => 'Lava', 'id' => 'lava',
				'text' => '#333333', 'text-fade' => '#777777',
				'inv-text' => '#ffffff', 'inv-text-fade' => '#dddddd',
				'border' => '#dddddd',
				'accent' => '#dd3e3e',
				'link'   => '#dd3e3e',
			),
		),

		'nav' => array(
			'aqua' => array(
				'name' => 'Aqua', 'id' => 'aqua',
				'bg-color'          => '#ffffff',
				'accent'            => '#539ddd',
				'text-color'        => '#333333',
				'text-active-color' => '#539ddd',
			),
			'nightly' => array(
				'name' => 'Nightly', 'id' => 'nightly',
				'bg-color'          => '#333333',
				'accent'            => '#539ddd',
				'text-color'        => '#eeeeee',
				'text-active-color' => '#539ddd',
			),
		),
	);

	if ( array_key_exists($set, $themes) ) {
		return $themes[$set];
	}
}

/**
 * Return array of available CSS animations
 *
 * @param str $type type of animations to return (default: 'all')
 */
function mixt_css_anims($type = 'all') {

	$anim_loops = array(
		'bounce'     => 'Bounce',
		'flash'      => 'Flash',
		'flip'       => 'Flip',
		'flipY'      => 'Flip Y',
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


/**
 * Return array of images by type
 *
 * @param str $type type of images to retrieve (must match directory name in /assets/)
 */
function mixt_get_images($type) {
	
	$images_path = MIXT_DIR . '/assets/img/' . $type . '/';
	$images_url  = MIXT_URI . '/assets/img/' . $type . '/';
	$images      = array();

	if ( is_dir( $images_path ) ) {

		if ( $images_dir = opendir( $images_path ) ) {

			while ( ( $image_file = readdir( $images_dir ) ) !== false ) {

				if ( stristr( $image_file, '.png' ) !== false || stristr( $image_file, '.jpg' ) !== false ) {
					$name = explode( '.', $image_file );
					$name = str_replace( '.' . end( $name ), '', $image_file );
					$images[] = array(
						'alt' => $name,
						'img' => $images_url . rawurlencode($image_file),
					);
				}
			}
		}
	}

	return $images;
}