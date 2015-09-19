<?php

/**
 * MIXT Assets
 *
 * @package MIXT
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access


/**
 * Return various assets by groups
 */
function mixt_get_assets($group, $subgroup) {
	$assets = array(
		'button' => array(
			'sizes' => array(
				''       => __( 'Normal', 'mixt' ),
				'btn-lg' => __( 'Large', 'mixt' ),
				'btn-xl' => __( 'Extra Large', 'mixt' ),
				'btn-sm' => __( 'Small', 'mixt' ),
				'btn-xs' => __( 'Extra Small', 'mixt' ),
			),
			'colors' => array(
				'default' => __( 'Default', 'mixt' ),
				'minimal' => __( 'Minimal', 'mixt' ),
				'primary' => __( 'Primary (accent)', 'mixt' ),
				'white'   => __( 'White', 'mixt' ),
				'grey'    => __( 'Grey', 'mixt' ),
				'black'   => __( 'Black', 'mixt' ),
				'red'     => __( 'Red', 'mixt' ),
				'orange'  => __( 'Orange', 'mixt' ),
				'green'   => __( 'Green', 'mixt' ),
				'blue'    => __( 'Blue', 'mixt' ),
				'violet'  => __( 'Violet', 'mixt' ),
				'shine'   => __( 'Shine', 'mixt' ),
				'shade'   => __( 'Shade', 'mixt' ),
			),
			'types' => array(
				''       => __( 'Normal', 'mixt' ),
				'round'  => __( 'Round', 'mixt' ),
				'emboss' => __( 'Embossed', 'mixt' ),
			),
			'animations' => array(
				''        => __( 'None', 'mixt' ),
				'fill'    => 'Fill',
				'fill-in' => 'Fill In',
				'grow'    => 'Grow',
				'shrink'  => 'Shrink',
				'pop'     => 'Pop',
				'push'    => 'Push',
			),
			'icon-animations' => array(
				''                  => __( 'None', 'mixt' ),
				'icon-goDown'       => __( 'Go Down', 'mixt' ),
				'hover-icon-goDown' => __( 'Go Down on Hover', 'mixt' ),
			),
		),
		
		'colors' => array(
			'basic' => array(
				'accent' => __( 'Theme Accent', 'mixt' ),
				'white'  => __( 'White', 'mixt' ),
				'grey'   => __( 'Grey', 'mixt' ),
				'black'  => __( 'Black', 'mixt' ),
				'orange' => __( 'Orange', 'mixt' ),
				'red'    => __( 'Red', 'mixt' ),
				'green'  => __( 'Green', 'mixt' ),
				'blue'   => __( 'Blue', 'mixt' ),
			),
			'elements' => array(
				'color-auto'  => __( 'Auto', 'mixt' ),
				'blue'        => __( 'Blue', 'mixt' ),
				'turquoise'   => __( 'Turquoise', 'mixt' ),
				'pink'        => __( 'Pink', 'mixt' ),
				'violet'      => __( 'Violet', 'mixt' ),
				'peacoc'      => __( 'Peacoc', 'mixt' ),
				'chino'       => __( 'Chino', 'mixt' ),
				'mulled-wine' => __( 'Mulled Wine', 'mixt' ),
				'vista-blue'  => __( 'Vista Blue', 'mixt' ),
				'black'       => __( 'Black', 'mixt' ),
				'grey'        => __( 'Grey', 'mixt' ),
				'orange'      => __( 'Orange', 'mixt' ),
				'sky'         => __( 'Sky', 'mixt' ),
				'green'       => __( 'Green', 'mixt' ),
				'juicy-pink'  => __( 'Juicy pink', 'mixt' ),
				'sandy-brown' => __( 'Sandy brown', 'mixt' ),
				'purple'      => __( 'Purple', 'mixt' ),
				'white'       => __( 'White', 'mixt' ),
			),
		),
	);

	if ( empty($subgroup) ) {
		return $assets[$group];
	} else {
		if ( $subgroup == 'icon-animations' ) {
			$assets['button']['icon-animations'] = array_merge(
				$assets['button']['icon-animations'],
				mixt_icon_anims('sec', false)
			);
		}

		return $assets[$group][$subgroup];
	}
}


/**
 * Return array of theme names and ids for specified element
 *
 * @param str $elem
 */
function mixt_get_themes($elem = '') {
	if ( empty($elem) ) { return false; }

	$theme_list = array();
	$themes = get_option("mixt-$elem-themes");

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
		return null;
	}
}


/**
 * Return array of available CSS animations
 *
 * @param str $type type of animations to return
 */
function mixt_css_anims($type = 'all') {
	$anims = array(
		'loops' => array(
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
			'jello'      => 'Jello',
		),

		'trans-in' => array(
			'fadeIn'         => 'Fade In',
			'fadeInDown'     => 'Fade In Down',
			'fadeInDownBig'  => 'Fade In Down Big',
			'fadeInLeft'     => 'Fade In Left',
			'fadeInLeftBig'  => 'Fade In Left Big',
			'fadeInRight'    => 'Fade In Right',
			'fadeInRightBig' => 'Fade In Right Big',
			'fadeInUp'       => 'Fade In Up',
			'fadeInUpBig'    => 'Fade In Up Big',

			'bounceIn'      => 'Bounce In',
			'bounceInDown'  => 'Bounce In Down',
			'bounceInLeft'  => 'Bounce In Left',
			'bounceInRight' => 'Bounce In Right',
			'bounceInUp'    => 'Bounce In Up',

			'flipInX'  => 'Flip In X',
			'flipInY'  => 'Flip In Y',

			'lightSpeedIn'  => 'Light Speed In',

			'rotateIn'          => 'Rotate In',
			'rotateInDownLeft'  => 'Rotate In Down Left',
			'rotateInDownRight' => 'Rotate In Down Right',
			'rotateInUpLeft'    => 'Rotate In Up Left',
			'rotateInUpRight'   => 'Rotate In Up Right',

			'zoomIn'      => 'Zoom In',
			'zoomInDown'  => 'Zoom In Down',
			'zoomInLeft'  => 'Zoom In Left',
			'zoomInRight' => 'Zoom In Right',
			'zoomInUp'    => 'Zoom In Up',

			'slideInUp'    => 'Slide In Up',
			'slideInDown'  => 'Slide In Down',
			'slideInLeft'  => 'Slide In Left',
			'slideInRight' => 'Slide In Right',

			'rollIn'  => 'Roll In',
		),

		'trans-out' => array(
			'fadeOut'         => 'Fade Out',
			'fadeOutDown'     => 'Fade Out Down',
			'fadeOutDownBig'  => 'Fade Out Down Big',
			'fadeOutLeft'     => 'Fade Out Left',
			'fadeOutLeftBig'  => 'Fade Out Left Big',
			'fadeOutRight'    => 'Fade Out Right',
			'fadeOutRightBig' => 'Fade Out Right Big',
			'fadeOutUp'       => 'Fade Out Up',
			'fadeOutUpBig'    => 'Fade Out Up Big',

			'bounceOut'      => 'Bounce Out',
			'bounceOutDown'  => 'Bounce Out Down',
			'bounceOutLeft'  => 'Bounce Out Left',
			'bounceOutRight' => 'Bounce Out Right',
			'bounceOutUp'    => 'Bounce Out Up',

			'flipOutX' => 'Flip Out X',
			'flipOutY' => 'Flip Out Y',

			'lightSpeedOut' => 'Light Speed Out',

			'rotateOut'          => 'Rotate Out',
			'rotateOutDownLeft'  => 'Rotate Out Down Left',
			'rotateOutDownRight' => 'Rotate Out Down Right',
			'rotateOutUpLeft'    => 'Rotate Out Up Left',
			'rotateOutUpRight'   => 'Rotate Out Up Right',

			'zoomOut'      => 'Zoom Out',
			'zoomOutDown'  => 'Zoom Out Down',
			'zoomOutLeft'  => 'Zoom Out Left',
			'zoomOutRight' => 'Zoom Out Right',
			'zoomOutUp'    => 'Zoom Out Up',

			'slideOutUp'    => 'Slide Out Up',
			'slideOutDown'  => 'Slide Out Down',
			'slideOutLeft'  => 'Slide Out Left',
			'slideOutRight' => 'Slide Out Right',

			'rollOut' => 'Roll Out',

			'hinge'   => 'Hinge',
		),
	);

	if ( $type == 'all' ) {
		return array_merge($anims['loops'], $anims['trans-in'], $anims['trans-out']);
	} else if ( $type == 'trans' ) {
		return array_merge($anims['trans-in'], $anims['trans-out']);
	} else {
		return $anims[$type];
	}
}


/**
 * Return array of icon animations
 *
 * @param string $type The type of animations to return. Can be 'main', 'sec', 'all' and 'combined'
 */
function mixt_icon_anims($type = 'combined') {
	$anims = array(
		'main' => array(
			'anim-pop'    => 'Pop',
			'anim-focus'  => 'Focus',
			'anim-invert' => 'Invert',
		),
		'sec' => array(
			'anim-rise'     => 'Rise',
			'anim-fall'     => 'Fall',
			'anim-go-right' => 'Go Right',
			'anim-go-left'  => 'Go Left',
			'anim-spin'     => 'Spin',
			'anim-rotate'   => 'Rotate',
			'anim-grow'     => 'Grow',
			'anim-shrink'   => 'Shrink',
		),
	);

	if ( $type == 'combined' ) {
		$icon_anims = array_merge($anims['main'], $anims['sec']);
		foreach ( $anims['main'] as $main_key => $main_name ) {
			foreach ( $anims['sec'] as $sec_key => $sec_name ) {
				$icon_anims["$main_key $sec_key"] = $main_name . ' ' . __( 'and', 'mixt' ) . ' ' . $sec_name;
			}
		}
		return $icon_anims;
	} else {
		return ( $type == 'all' ) ? array_merge($anims['main'], $anims['sec']) : $anims[$type];
	}
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