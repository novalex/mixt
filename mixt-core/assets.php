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
		'names' => array(
			'aqua' => 'Aqua', 'nightly' => 'Nightly',
			'lava' => 'Lava', 'dark-lava' => 'Dark Lava',
			'eco' => 'Eco',
		),

		'site' => array(
			'aqua' => array(
				'name' => 'Aqua', 'id' => 'aqua',
				'text' => '#333', 'text-fade' => '#777',
				'inv-text' => '#fff', 'inv-text-fade' => '#ddd',
				'border' => '#ddd',
				'accent' => '#539ddd', 'link'   => '#539ddd',
			),
			'lava' => array(
				'name' => 'Lava', 'id' => 'lava',
				'text' => '#333', 'text-fade' => '#777',
				'inv-text' => '#fff', 'inv-text-fade' => '#ddd',
				'border' => '#ddd',
				'accent' => '#dd3e3e', 'link'   => '#dd3e3e',
			),
		),

		'nav' => array(
			'lava' => array(
				'name' => 'Lava', 'id' => 'lava',
				'bg' => '#fff', 'border' => '#ddd',
				'text' => '#333', 'inv-text' => '#fff',
				'accent' => '#dd3e3e', 'inv-accent' => '#dd3e3e',
				'menu-bg' => '#fbfbfb', 'menu-border' => '#ddd',
				'rgba' => '1',
			),
			'aqua' => array(
				'name' => 'Aqua', 'id' => 'aqua',
				'bg' => '#fff', 'border' => '#ddd',
				'text' => '#333', 'inv-text' => '#fff',
				'accent' => '#539ddd', 'inv-accent' => '#539ddd',
				'menu-bg' => '#fbfbfb', 'menu-border' => '#ddd',
				'rgba' => '1',
			),
			'nightly' => array(
				'name' => 'Nightly', 'id' => 'nightly',
				'bg' => '#444', 'border' => '#333',
				'text' => '#333', 'inv-text' => '#fff',
				'accent' => '#539ddd', 'inv-accent' => '#539ddd',
				'menu-bg' => '#fbfbfb', 'menu-border' => '#ddd',
				'rgba' => '1',
			),
		),
	);
	return $themes[$set];
}


/**
 * Return array of theme names and ids for specified element
 *
 * @param str $elem
 */
function mixt_get_themes($elem = '') {

	if ( empty($elem) ) { return false; }

	$theme_list = array();

	$themes = get_option($elem . '-themes');

	if ( ! empty($themes) && is_array($themes) ) {
		foreach ( $themes as $theme_id => $theme ) {
			if ( $theme['name'] == '' ) {
				$theme_list[$theme_id] = $theme_id;
			} else {
				$theme_list[$theme_id] = $theme['name'];
			}
		}

		return $theme_list;
	} else {
		return false;
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


/**
 * Test For Server Image Manipulation Capabilities
 */
function mixt_img_edit_support() {
	$img_edit_support = array(
		'mime_type' => 'image/png',
		'methods' => array(
			'resize',
			'save',
		),
	);
	return wp_image_editor_supports($img_edit_support);
}
