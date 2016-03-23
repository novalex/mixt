<?php

/**
 * Assets
 *
 * @package MIXT\Core
 */

defined('ABSPATH') or die('You are not supposed to do that.'); // No Direct Access


/**
 * Return theme names and ids for specified element
 *
 * @param  string $elem Element for which to retreive themes, or default for default themes
 * @param  string $type The type of themes to retreive ('default', 'custom' or 'all')
 * @return array
 */
function mixt_get_themes( $elem, $type = 'all' ) {
	// Default universal themes
	$default_themes = apply_filters( 'mixt_default_themes', array(
		'lava'      => 'Lava',
		'dark-lava' => 'Dark Lava',
		'eco'       => 'Eco',
		'dark-eco'  => 'Dark Eco',
		'aqua'      => 'Aqua',
		'nightly'   => 'Nightly',
		'edge'      => 'Edge',
		'reno'      => 'Reno',
	) );
	// Default site themes
	$default_site_themes = apply_filters( 'mixt_default_site_themes', array() );
	// Default nav themes
	$default_nav_themes = apply_filters( 'mixt_default_nav_themes', array() );

	$theme_list = array();

	if ( $elem == 'default' ) {
		return $default_themes;
	} else if ( $elem == 'site' && ( $type == 'default' || $type == 'all' ) ) {
		$theme_list = array_merge($default_themes, $default_site_themes);
	} else if ( $elem == 'nav' && ( $type == 'default' || $type == 'all' ) ) {
		$theme_list = array_merge($default_themes, $default_nav_themes);
	}

	if ( $type == 'all' || $type == 'custom' ) {
		$themes = get_option("mixt-$elem-themes", array());

		if ( ! empty($themes) && is_array($themes) ) {
			foreach ( $themes as $theme_id => $theme ) {
				if ( empty($theme['name']) ) {
					$theme_list[$theme_id] = $theme_id;
				} else {
					$theme_list[$theme_id] = $theme['name'];
				}
			}
		}
	}
	return $theme_list;
}


/**
 * Return array of nav menus with ID and name
 *
 * @param bool $show_auto Include 'Auto' option
 */
function mixt_get_nav_menus( $show_auto = true ) {
	$nav_menus = array();
	if ( $show_auto ) { $nav_menus['auto'] = esc_html__( 'Auto', 'mixt'); }
	foreach ( get_terms( 'nav_menu', array( 'hide_empty' => false ) ) as $menu ) {
		$nav_menus[$menu->term_id] = $menu->name;
	}

	return $nav_menus;
}


/**
 * Return array of sidebars with ID and name
 *
 * @param  bool $$show_auto Include 'Auto' option
 */
function mixt_get_sidebars( $show_auto = true ) {
	$available_sidebars = array();
	if ( $show_auto ) { $available_sidebars['auto'] = esc_html__( 'Auto', 'mixt'); }
	$available_sidebars['sidebar-1'] = esc_html__( 'Default', 'mixt' );
	$custom_sidebars = get_option('mixt-sidebars');
	if ( $custom_sidebars ) {
		foreach ( $custom_sidebars as $sidebar ) { $available_sidebars[$sidebar['id']] = $sidebar['name']; }
	}

	return $available_sidebars;
}


/**
 * Return various assets by groups
 *
 * @param  string $group    Main group of assets to retreive
 * @param  string $subgroup Subgroup of assets to retreive
 * @return array
 */
function mixt_get_assets( $group, $subgroup = false ) {
	$assets = apply_filters( 'mixt_assets_array', array(
		'button' => array(
			'sizes' => array(
				''       => esc_html__( 'Normal', 'mixt' ),
				'btn-lg' => esc_html__( 'Large', 'mixt' ),
				'btn-xl' => esc_html__( 'Extra Large', 'mixt' ),
				'btn-sm' => esc_html__( 'Small', 'mixt' ),
				'btn-xs' => esc_html__( 'Extra Small', 'mixt' ),
			),
			'types' => array(
				''       => esc_html__( 'Normal', 'mixt' ),
				'round'  => esc_html__( 'Round', 'mixt' ),
				'emboss' => esc_html__( 'Embossed', 'mixt' ),
			),
			'animations' => array(
				''        => esc_html__( 'None', 'mixt' ),
				'fill'    => 'Fill',
				'fill-in' => 'Fill In',
				'grow'    => 'Grow',
				'shrink'  => 'Shrink',
				'pop'     => 'Pop',
				'push'    => 'Push',
			),
			'icon-animations' => array(
				''                  => esc_html__( 'None', 'mixt' ),
				'icon-goDown'       => esc_html__( 'Go Down', 'mixt' ),
				'hover-icon-goDown' => esc_html__( 'Go Down on Hover', 'mixt' ),
			),
		),
		
		'colors' => array(
			'basic' => array(
				'accent' => esc_html__( 'Theme Accent', 'mixt' ),
				'white'  => esc_html__( 'White', 'mixt' ),
				'grey'   => esc_html__( 'Grey', 'mixt' ),
				'black'  => esc_html__( 'Black', 'mixt' ),
				'orange' => esc_html__( 'Orange', 'mixt' ),
				'red'    => esc_html__( 'Red', 'mixt' ),
				'green'  => esc_html__( 'Green', 'mixt' ),
				'blue'   => esc_html__( 'Blue', 'mixt' ),
			),
			'buttons' => array(
				'default' => esc_html__( 'Default', 'mixt' ),
				'minimal' => esc_html__( 'Minimal', 'mixt' ),
				'primary' => esc_html__( 'Primary (accent)', 'mixt' ),
				'white'   => esc_html__( 'White', 'mixt' ),
				'grey'    => esc_html__( 'Grey', 'mixt' ),
				'black'   => esc_html__( 'Black', 'mixt' ),
				'red'     => esc_html__( 'Red', 'mixt' ),
				'orange'  => esc_html__( 'Orange', 'mixt' ),
				'green'   => esc_html__( 'Green', 'mixt' ),
				'blue'    => esc_html__( 'Blue', 'mixt' ),
				'violet'  => esc_html__( 'Violet', 'mixt' ),
				'shine'   => esc_html__( 'Shine', 'mixt' ),
				'shade'   => esc_html__( 'Shade', 'mixt' ),
			),
			'elements' => array(
				'color-auto'  => esc_html__( 'Auto', 'mixt' ),
				'blue'        => esc_html__( 'Blue', 'mixt' ),
				'turquoise'   => esc_html__( 'Turquoise', 'mixt' ),
				'pink'        => esc_html__( 'Pink', 'mixt' ),
				'violet'      => esc_html__( 'Violet', 'mixt' ),
				'peacoc'      => esc_html__( 'Peacoc', 'mixt' ),
				'chino'       => esc_html__( 'Chino', 'mixt' ),
				'mulled-wine' => esc_html__( 'Mulled Wine', 'mixt' ),
				'vista-blue'  => esc_html__( 'Vista Blue', 'mixt' ),
				'black'       => esc_html__( 'Black', 'mixt' ),
				'grey'        => esc_html__( 'Grey', 'mixt' ),
				'orange'      => esc_html__( 'Orange', 'mixt' ),
				'sky'         => esc_html__( 'Sky', 'mixt' ),
				'green'       => esc_html__( 'Green', 'mixt' ),
				'juicy-pink'  => esc_html__( 'Juicy pink', 'mixt' ),
				'sandy-brown' => esc_html__( 'Sandy brown', 'mixt' ),
				'purple'      => esc_html__( 'Purple', 'mixt' ),
				'white'       => esc_html__( 'White', 'mixt' ),
			),
		),

		'image-styles' => array(
			'' => esc_html__( 'Default', 'mixt' ),

			'image-border'  => esc_html__( 'Bordered', 'mixt' ),
			'image-outline' => esc_html__( 'Outlined', 'mixt' ),
			'image-eclipse' => esc_html__( 'Eclipse', 'mixt' ),
			'image-shadow'  => esc_html__( 'Shadow', 'mixt' ),

			'image-rounded' => esc_html__( 'Rounded', 'mixt' ),
			'image-rounded image-border'  => esc_html__( 'Rounded with border', 'mixt' ),
			'image-rounded image-outline' => esc_html__( 'Rounded with outline', 'mixt' ),
			'image-rounded image-eclipse' => esc_html__( 'Rounded with eclipse', 'mixt' ),
			'image-rounded image-shadow'  => esc_html__( 'Rounded with shadow', 'mixt' ),

			'image-circle' => esc_html__( 'Circle', 'mixt' ),
			'image-circle image-border'  => esc_html__( 'Circle with border', 'mixt' ),
			'image-circle image-outline' => esc_html__( 'Circle with outline', 'mixt' ),
			'image-circle image-eclipse' => esc_html__( 'Circle with eclipse', 'mixt' ),
			'image-circle image-shadow'  => esc_html__( 'Circle with shadow', 'mixt' ),

			'image-shadow-3d' => esc_html__( '3D Shadow', 'mixt' ),
		),
	) );

	if ( ! $subgroup ) {
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
 * Return available CSS animations
 *
 * @param  string $type Type of animations to return
 * @return array
 */
function mixt_css_anims( $type = 'all' ) {
	$anims = apply_filters( 'mixt_css_anims', array(
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

			'lightSpeedIn' => 'Light Speed In',

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

			'rollIn' => 'Roll In',
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

			'hinge' => 'Hinge',
		),
	) );

	if ( $type == 'all' ) {
		return array_merge($anims['loops'], $anims['trans-in'], $anims['trans-out']);
	} else if ( $type == 'trans' ) {
		return array_merge($anims['trans-in'], $anims['trans-out']);
	} else {
		return $anims[$type];
	}
}


/**
 * Retreive an icon defined in the options
 * 
 * @param  string $icon   The icon to retreive
 * @param  bool   $markup Whether to return the CSS class only or complete HTML markup
 * @return string
 */
function mixt_get_icon( $icon, $markup = true ) {
	global $mixt_opt;

	$defaults = array(
		'left-arrow'          => 'fa fa-chevron-left',
		'right-arrow'         => 'fa fa-chevron-right',
		'up-arrow'            => 'fa fa-chevron-up',
		'down-arrow'          => 'fa fa-chevron-down',
		'search'              => 'fa fa-search',
		'head-content-scroll' => 'fa fa-chevron-down',
		'view-post'           => 'fa fa-share',
		'view-image'          => 'fa fa-search',
		'author'              => 'fa fa-user',
		'date'                => 'fa fa-clock-o',
		'category'            => 'fa fa-folder-open',
		'comments'            => 'fa fa-comment',
		'back-to-top'         => 'fa fa-chevron-up',
		'shop-cart'           => 'fa fa-shopping-cart',
		'format-standard'     => 'fa fa-align-left',
		'format-aside'        => 'fa fa-pencil',
		'format-image'        => 'fa fa-picture-o',
		'format-video'        => 'fa fa-play',
		'format-audio'        => 'fa fa-music',
		'format-gallery'      => 'fa fa-camera',
		'format-quote'        => 'fa fa-quote-right',
		'format-link'         => 'fa fa-link',
		'format-status'       => 'fa fa-sticky-note',
		'format-chat'         => 'fa fa-comments',
		'format-page'         => 'fa fa-file-text',
		'format-product'      => 'fa fa-shopping-cart',
	);

	if ( $icon == 'defaults' ) { return $defaults; }

	if ( isset($mixt_opt[$icon . '-icon']) ) {
		$icon_class = mixt_sanitize_html_classes($mixt_opt[$icon . '-icon']);
	} else if ( isset($defaults[$icon]) ) {
		$icon_class = $defaults[$icon];
	}
	if ( ! empty($icon_class) ) {
		return ( $markup ) ? "<i class='$icon_class'></i>" : $icon_class;
	} else {
		return '';
	}
}


/**
 * Return icon animations
 *
 * @param  string $type The type of animations to return. Can be 'main', 'sec', 'all' or 'combined'.
 * @return array
 */
function mixt_icon_anims( $type = 'combined' ) {
	$anims = apply_filters( 'mixt_icon_anims', array(
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
	) );

	if ( $type == 'combined' ) {
		$icon_anims = array_merge($anims['main'], $anims['sec']);
		foreach ( $anims['main'] as $main_key => $main_name ) {
			foreach ( $anims['sec'] as $sec_key => $sec_name ) {
				$icon_anims["$main_key $sec_key"] = $main_name . ' ' . esc_html__( 'and', 'mixt' ) . ' ' . $sec_name;
			}
		}
		return $icon_anims;
	} else {
		return ( $type == 'all' ) ? array_merge($anims['main'], $anims['sec']) : $anims[$type];
	}
}


/**
 * Return asset images by type
 *
 * @param  string $type Type of images to retrieve (must match directory name in '/assets/img/')
 * @return array
 */
function mixt_get_images( $type ) {
	$images_path = apply_filters('mixt_images_path', MIXT_DIR . '/assets/img/') . $type . '/';
	$images_url  = apply_filters('mixt_images_url', MIXT_URI . '/assets/img/') . $type . '/';
	$images      = array();

	if ( is_dir( $images_path ) ) {
		if ( $images_dir = scandir($images_path) ) {
			foreach ( $images_dir as $image_file ) {
				if ( stristr( $image_file, '.png' ) !== false || stristr( $image_file, '.jpg' ) !== false ) {
					$name = explode( '.', $image_file );
					$name = str_replace( '.' . end( $name ), '', $image_file );
					$images[] = array(
						'alt' => esc_attr($name),
						'img' => esc_url($images_url . rawurlencode($image_file)),
					);
				}
			}
		}
	}
	return $images;
}


/**
 * Test for server image manipulation capabilities
 *
 * @return bool
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
