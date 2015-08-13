<?php

// Element Common Assets & Functions


/**
 * Remove misplaced p tags added by the wpautop function
 */
function mixt_unautop($string) {
	$string = force_balance_tags($string);
	$string = str_replace(array('<p></p>', '<br />'), '', $string);
	return trim($string);
}


/**
 * Parse styler properties and enqueue CSS
 * 
 * @param  string   $css
 * @param  callback $callback Custom function to parse Styler CSS
 * @return string   class name
 */
function mixt_element_styler($css, $callback = null) {
	preg_match('/\.(styler-.{7})/', $css, $matches);
	$selector = $matches[1];

	if ( is_callable($callback) ) {
		$parsed_css = call_user_func($callback, $css);
	} else {
		$parsed_css = str_replace(array('|', ';'), array('', ' !important;'), $css);
	}

	if ( ! Mixt_DCSS::is_duplicate($selector) ) Mixt_DCSS::add($parsed_css);

	return $selector;
}


/**
 * Parse a Styler CSS string and return array of rules and selectors
 * 
 * @param  string $css
 * @return array
 */
function mixt_styler_parse($css) {
	// Get selector
	preg_match('/\.(styler-.{7})/', $css, $matches);
	$selector = $matches[1];

	// Parse top-level selectors
	preg_match_all('/([^\s]+?){(.*?)}/', $css, $matches);
	if ( empty($matches[1]) || empty($matches[2]) ) return null;
	$rules = array_combine($matches[1], $matches[2]);

	// Parse properties and attributes
	foreach ( $rules as $sel => $props ) {
		preg_match_all('/([^\s]+?):(.+?);/', $props, $matches);
		$rules[$sel] = array_combine($matches[1], $matches[2]);
		$rules[$sel]['raw'] = $props;
	}

	return array(
		'selector' => $selector,
		'rules' => $rules,
	);
}


/**
 * Parse button attributes
 * 
 * @param string $atts
 * @param string $return return parsed values or classes
 */
function mixt_element_button($atts, $return = 'class') {
	$values = array(
		'color' => 'default',
		'size'  => '',
	);
	preg_match_all('/([^,]+):([^,]+)/', $atts, $matches);
	if ( ! empty($matches[1]) ) {
		$values = wp_parse_args(array_combine($matches[1], $matches[2]), $values);
	}

	if ( $return == 'value' ) {
		return $values;
	} else {
		$classes = 'btn';
		foreach ( $values as $att => $value ) {
			switch ( $att ) {
				case 'color':
					$classes .= ' btn-' . $value;
					break;
				default:
					$classes .= ' ' . $value;
					break;
			}
		}
		return trim($classes);
	}
}


/**
 * Element icon class
 */
function mixt_element_icon_class($args) {
	if ( $args['icon'] == '' && $args['icon_type'] != 'icon' && $args['icon_type'] != 'image' ) {
		global $mixt_opt;
		$icon_fonts = $mixt_opt['icon-fonts'];
		if ( ! empty($icon_fonts['linecons']) && $icon_fonts['linecons'] ) {
			$icon = str_replace(array('vc_li ', 'vc_li-'), array('icon-li ', 'li_'), $args["icon_{$args['icon_type']}"]);
		} else {
			$icon = $args["icon_{$args['icon_type']}"];

			if ( ( ! array_key_exists($args['icon_type'], $icon_fonts) || ! $icon_fonts[$args['icon_type']] ) && function_exists('vc_icon_element_fonts_enqueue') ) {
				vc_icon_element_fonts_enqueue($args['icon_type']);
			}
		}
	} else {
		$icon = $args['icon'];
	}
	return $icon;
}


/**
 * Retreive assets by group
 */
function mixt_element_assets($group) {
	$assets = array(
		'image-styles' => array(
			'' => __( 'Default', 'mixt' ),

			'image-border'  => __( 'Bordered', 'mixt' ),
			'image-outline' => __( 'Outlined', 'mixt' ),
			'image-eclipse' => __( 'Eclipse', 'mixt' ),
			'image-shadow'  => __( 'Shadow', 'mixt' ),

			'image-rounded' => __( 'Rounded', 'mixt' ),
			'image-rounded image-border'  => __( 'Rounded with border', 'mixt' ),
			'image-rounded image-outline' => __( 'Rounded with outline', 'mixt' ),
			'image-rounded image-eclipse' => __( 'Rounded with eclipse', 'mixt' ),
			'image-rounded image-shadow'  => __( 'Rounded with shadow', 'mixt' ),

			'image-circle' => __( 'Circle', 'mixt' ),
			'image-circle image-border'  => __( 'Circle with border', 'mixt' ),
			'image-circle image-outline' => __( 'Circle with outline', 'mixt' ),
			'image-circle image-eclipse' => __( 'Circle with eclipse', 'mixt' ),
			'image-circle image-shadow'  => __( 'Circle with shadow', 'mixt' ),

			'image-shadow-3d' => __( '3D Shadow', 'mixt' ),
		),

		'icon-styles' => array(
			'default'      => __( 'Default', 'mixt' ),
			'icon-solid'   => __( 'Solid', 'mixt' ),
			'icon-outline' => __( 'Outlined', 'mixt' ),
			'icon-solid icon-rounded'   => __( 'Rounded', 'mixt' ),
			'icon-outline icon-rounded' => __( 'Rounded outline', 'mixt' ),
			'icon-solid icon-circle'    => __( 'Circle', 'mixt' ),
			'icon-outline icon-circle'  => __( 'Circle outline', 'mixt' ),
		),
		'icon-sizes' => array(
			''        => __( 'Normal', 'mixt' ),
			'icon-sm' => __( 'Small', 'mixt' ),
			'icon-lg' => __( 'Large', 'mixt' ),
			'icon-xl' => __( 'Extra Large', 'mixt' ),
		),

		'row-separators' => array(
			''                 => __( 'None', 'mixt' ),
			'curve'            => __( 'Curve', 'mixt' ),
			'curve-inv'        => __( 'Curve (inverted)', 'mixt' ),
			'circle'           => __( 'Circle', 'mixt' ),
			'cricle-inv'       => __( 'Circle (inverted)', 'mixt' ),
			'triangle'         => __( 'Triangle', 'mixt' ),
			'triangle-inv'     => __( 'Triangle (inverted)', 'mixt' ),
			'big-triangle'     => __( 'Big Triangle', 'mixt' ),
			'big-triangle-inv' => __( 'Big Triangle (inverted)', 'mixt' ),
		),

		'animations' => array(
			__( 'No', 'js_composer' ) => '',
			__( 'Top to bottom', 'js_composer' ) => 'top-to-bottom',
			__( 'Bottom to top', 'js_composer' ) => 'bottom-to-top',
			__( 'Left to right', 'js_composer' ) => 'left-to-right',
			__( 'Right to left', 'js_composer' ) => 'right-to-left',
			__( 'Appear from center', 'js_composer' ) => 'appear',
		),
	);

	return $assets[$group];
}

/**
 * Output row separator
 */
function mixt_row_separator($type = 'triangle', $color = '', $icon = '') {
	$cont_class = $svg_fill = '';
	if ( $color != '' ) {
		$svg_fill = "fill='$color'";
	} else {
		$cont_class .= 'no-fill';
	}
	$svg_atts = 'xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100" preserveAspectRatio="none"';

	echo "<div class='mixt-row-separator $type $cont_class'>";
		// Multi-Part Separators
		if ( $type == 'circle-inv' || $type == 'triangle-inv' ) {
			echo "<svg class='sep-left' $svg_fill $svg_atts><rect width='100' height='100' /></svg>";
			echo "<svg class='sep-center' $svg_fill $svg_atts>";
				if ( $type == 'circle-inv' ) {
					echo '<path d="M 0 0 a 50.01 100 0 0 0 99.9 0 L 100 100 0 100 z" /></svg>';
				} else {
					echo '<polygon points="0 0, 50 99, 100 0, 100 100, 0 100" /></svg>';
				}
			echo "<svg class='sep-right' $svg_fill $svg_atts><rect width='100' height='100' /></svg>";
		// Single-Part Separators
		} else {
			echo "<svg $svg_fill $svg_atts>";
			switch($type) {
				case 'curve':
					echo '<path d="M 0 0 q 50 200 100 0 L 100 0 z" />';
					break;
				case 'curve-inv':
					echo '<path d="M 0 0 q 50 200 100 0 L 100 100 0 100 z" />';
					break;
				case 'circle':
					echo '<circle cx="50" cy="50" r="50" />';
					break;
				case 'triangle':
					echo '<polygon points="0 0, 100 0, 50 100" />';
					break;
				case 'big-triangle':
					echo '<polygon points="0 0, 50 100, 100 0, 0 0" />';
					break;
				case 'big-triangle-inv':
					echo '<polygon points="0 0, 50 90, 100 0, 100 100, 0 100" />';
					break;
			}
			echo '</svg>';
		}
		if ( $icon != '' ) {
			echo "<i class='$icon'></i>";
		}
	echo '</div>';
}
